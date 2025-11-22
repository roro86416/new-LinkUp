import prisma from "../../utils/prisma-only.js";
import { OrderCreateBody } from "./orders.schema.js";
import { ItemType, OrderStatus } from "../../generated/prisma/enums.js";
import { Decimal } from "@prisma/client/runtime/library";

// 輔助函數：生成唯一的訂單號碼
const generateOrderNumber = (): string => {
  return `LU-${Date.now()}-${Math.floor(Math.random() * 9000) + 1000}`;
};

// 輔助函數：生成唯一的票券 QR Code
const generateQrCode = (): string => {
  return `TICKET-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
};

/**
 * @desc 查詢使用者所有訂單列表 (保持不變)
 */
export const findOrdersByUserService = async (userId: string) => {
  const orders = await prisma.order.findMany({
    where: { user_id: userId },
    include: {
      items: {
        include: {
          ticketType: {
            include: {
              event: {
                select: { id: true, title: true } // 抓取 ID 和 標題
              }
            }
          }
        }
      }
    },
    orderBy: { created_at: "desc" },
  });

  const eventIds = new Set<number>();
  orders.forEach(order => {
    order.items.forEach(item => {
      if (item.ticketType?.event?.id) {
        eventIds.add(item.ticketType.event.id);
      }
    });
  });

  // 3. 一次性查詢使用者對這些活動是否已評價
  const userRatings = await prisma.eventRating.findMany({
    where: {
      user_id: userId,
      event_id: { in: Array.from(eventIds) }
    },
    select: { event_id: true }
  });

  // 轉成 Set 方便快速比對
  const ratedEventIds = new Set(userRatings.map(r => r.event_id));

  // 4. 組合回傳資料
  return orders.map(order => {
    // 找出訂單對應的活動 (通常取第一個 TicketType 的活動)
    const eventData = order.items.find(i => i.ticketType?.event)?.ticketType?.event;

    return {
      ...order,
      event: eventData, // 方便前端直接取用
      is_reviewed: eventData ? ratedEventIds.has(eventData.id) : false // [新增] 評價狀態旗標
    };
  });
};



/**
 * @desc 查詢單筆訂單詳情 (已修正：包含 event 資料)
 */
export const findOrderByIdService = async (userId: string, orderId: number) => {
  const order = await prisma.order.findFirstOrThrow({
    where: {
      id: orderId,
      user_id: userId,
    },
    include: {
      items: {
        include: {
          ticket: true, // 包含票券資料 (QR Code)
          // [新增] 必須包含 TicketType -> Event，才能拿到活動資訊
          ticketType: {
            include: {
              event: true,
            }
          }
        },
      },
      coupon: true,
    },
  });

  // [新增] 從訂單項目中，找出關聯的活動 (Event)
  // 假設一張訂單通常屬於一個活動 (或我們取第一個找到的活動)
  const eventItem = order.items.find(
    (item) => item.item_type === ItemType.ticket_types && item.ticketType?.event
  );

  const eventData = eventItem?.ticketType?.event;

  // 回傳重組後的資料，把 event 放進去，滿足前端介面
  return {
    ...order,
    event: eventData || {}, // 如果只有買商品沒買票，這裡可能會是空物件，前端可能需對應處理
  };
};

// 定義用於 Prisma 建立 OrderItem 的資料結構
type OrderItemInputData = {
  item_type: ItemType;
  ticket_type_id?: string;
  product_variant_id?: number;
  item_name: string;
  variant_description?: string;
  quantity: number;
  unit_price: Decimal;
};

/**
 * @desc 建立新訂單的服務函數 (已重構：直接購買模式，不依賴購物車)
 */
export const createOrderService = async (
  userId: string,
  body: OrderCreateBody
) => {

  // 1. 從 body 中解構出我們需要的資料
  // [核心修改] 我們現在直接使用 items，而不是去撈購物車
  const { attendees, items, ...billingInfo } = body;

  // 檢查是否包含 items (前端必須傳送)
  if (!items || items.length === 0) {
    throw new Error("訂單中沒有任何項目，無法結帳。");
  }

  const result = await prisma.$transaction(async (tx) => {

    // 2. 初始化變數
    let subtotal = new Decimal(0);
    const orderItemsData: OrderItemInputData[] = [];
    const productUpdates: { id: number; quantity: number }[] = [];
    const ticketUpdates: { id: string; quantity: number }[] = [];

    // 用於追蹤票券項目，以便稍後驗證人數
    const ticketItemsInOrder: {
      ticketTypeId: string;
      quantity: number;
    }[] = [];


    // 3. [核心修改] 遍歷 body.items，並從資料庫驗證價格與庫存
    for (const item of items) {
      const quantity = item.quantity;
      let unitPrice = new Decimal(0);
      let itemName = "";
      let variantDesc: string | undefined = undefined;
      let availableQuantity = 0;

      if (item.item_type === ItemType.products) {
        // --- 處理商品 ---
        if (!item.product_variant_id) throw new Error("商品項目缺少 product_variant_id");

        // [安全驗證] 從資料庫查詢商品資訊 (取代購物車查詢)
        const variant = await tx.productVariant.findUniqueOrThrow({
          where: { id: item.product_variant_id },
          include: { product: true }
        });

        // 計算單價 (Base + Offset)
        unitPrice = variant.product.base_price.add(variant.price_offset);
        itemName = variant.product.name;
        variantDesc = `${variant.option1_name}: ${variant.option1_value}`;
        availableQuantity = variant.stock_quantity;

        if (availableQuantity < quantity) {
          throw new Error(`商品 ${itemName} 庫存不足。剩餘: ${availableQuantity}`);
        }
        productUpdates.push({ id: variant.id, quantity: quantity });

      } else if (item.item_type === ItemType.ticket_types) {
        // --- 處理票券 ---
        if (!item.ticket_type_id) throw new Error("票券項目缺少 ticket_type_id");

        // [安全驗證] 從資料庫查詢票券資訊 (取代購物車查詢)
        const ticket = await tx.ticketType.findUniqueOrThrow({
          where: { id: item.ticket_type_id },
          include: { event: true }
        });

        unitPrice = ticket.price;
        itemName = `${ticket.event.title} - ${ticket.name}`;
        availableQuantity = ticket.total_quantity;

        if (availableQuantity < quantity) {
          throw new Error(`活動票券 ${itemName} 數量不足。剩餘: ${availableQuantity}`);
        }
        ticketUpdates.push({ id: ticket.id, quantity: quantity });

        // 記錄這是票券，稍後比對 attendees
        ticketItemsInOrder.push({
          ticketTypeId: ticket.id,
          quantity: quantity,
        });
      }

      // 累加小計
      subtotal = subtotal.add(unitPrice.mul(quantity));

      // 準備寫入 OrderItem 的資料
      orderItemsData.push({
        item_type: item.item_type,
        ticket_type_id: item.ticket_type_id ?? undefined,
        product_variant_id: item.product_variant_id ?? undefined,
        item_name: itemName,
        variant_description: variantDesc,
        quantity: quantity,
        unit_price: unitPrice, // 使用資料庫查出的價格
      });
    }


    // 4. 總金額計算與安全檢查

    // 驗證持票人數量是否與購買的票券總數相符
    const totalTicketsCount = ticketItemsInOrder.reduce((sum, item) => sum + item.quantity, 0);
    if (totalTicketsCount !== attendees.length) {
      throw new Error(`持票人資料數量 (${attendees.length}) 與訂單中的票券總數 (${totalTicketsCount}) 不符。`);
    }

    let discountAmount = new Decimal(0);
    let totalAmount = subtotal.sub(discountAmount);

    // [安全檢查] 比對後端計算的金額與前端傳來的金額
    if (totalAmount.toNumber() !== billingInfo.total_amount) {
      console.warn(`金額不符警告：後端計算 ${totalAmount}, 前端傳送 ${billingInfo.total_amount}`);
      // 如果您希望嚴格一點，可以取消下面這行的註解
      // throw new Error("訂單金額驗證失敗，請重新整理頁面後再試。");
    }

    const orderNumber = generateOrderNumber();
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 15); // 30 分鐘到期

    // 5. 建立訂單 (Order) 與 訂單項目 (OrderItem)
    const newOrder = await tx.order.create({
      data: {
        order_number: orderNumber,
        user_id: userId,
        status: OrderStatus.pending,
        billing_name: billingInfo.billing_name,
        billing_phone: billingInfo.billing_phone,
        billing_email: billingInfo.billing_email,
        billing_address: billingInfo.billing_address,
        payment_method: billingInfo.payment_method,
        delivery_method: billingInfo.delivery_method,
        expires_at: expiryDate,
        subtotal: subtotal,
        discount_amount: discountAmount,
        total_amount: totalAmount,
        coupon_code: billingInfo.coupon_code,
        items: {
          createMany: {
            data: orderItemsData,
          },
        },
      },
      include: {
        items: true, // 取回 ID 以建立 Ticket
      }
    });

    // 6a. 建立電子票券 (Ticket)
    let attendeeIndex = 0;
    const ticketCreatePromises: Promise<any>[] = [];

    for (const orderItem of newOrder.items) {
      if (orderItem.item_type === ItemType.ticket_types && orderItem.ticket_type_id) {

        for (let i = 0; i < orderItem.quantity; i++) {
          const attendee = attendees[attendeeIndex];
          if (!attendee) {
            throw new Error("內部錯誤：持票人資料分配失敗 (人數不足)。");
          }

          const ticketPromise = tx.ticket.create({
            data: {
              order_item_id: orderItem.id,
              name: attendee.name,
              email: attendee.email,
              phone: attendee.phone,
              gender: attendee.gender,
              qr_code_data: generateQrCode(),
              status: "valid",
            },
          });
          ticketCreatePromises.push(ticketPromise);
          attendeeIndex++;
        }
      }
    }

    // 6b. 扣除庫存 (Product & TicketType)
    const productUpdatePromises = productUpdates.map(update =>
      tx.productVariant.update({
        where: { id: update.id },
        data: { stock_quantity: { decrement: update.quantity } },
      })
    );

    const ticketUpdatePromises = ticketUpdates.map(update =>
      tx.ticketType.update({
        where: { id: update.id },
        data: { total_quantity: { decrement: update.quantity } },
      })
    );

    // 執行所有資料庫變更
    await Promise.all([
      ...productUpdatePromises,
      ...ticketUpdatePromises,
      ...ticketCreatePromises
    ]);

    await tx.notification.create({
      data: {
        type: "transaction",
        title: "訂單成立通知",
        message: `您的訂單 #${newOrder.order_number} 已成立。\n請於 15 分鐘內完成付款，否則訂單將自動取消。`,
        sent_at: new Date(),
        userStatuses: {
          create: {
            user_id: userId,
            is_read: false,
          },
        },
      },
    });

    // 7. 返回完整的訂單資料
    const completeOrder = await tx.order.findUniqueOrThrow({
      where: { id: newOrder.id },
      include: {
        items: {
          include: {
            ticket: true,
          }
        },
        coupon: true
      },
    });

    return completeOrder;
  }); // <-- $transaction 結束

  return result;
};

/**
 * @desc 取消一筆待付款 (Pending) 的訂單 (保持不變)
 */
export const cancelOrderService = async (userId: string, orderId: number) => {
  const result = await prisma.$transaction(async (tx) => {
    const order = await tx.order.findFirstOrThrow({
      where: { id: orderId, user_id: userId },
      include: { items: true },
    });

    if (order.status !== OrderStatus.pending) {
      throw new Error(`無法取消狀態為 "${order.status}" 的訂單。`);
    }

    await tx.order.update({
      where: { id: order.id },
      data: { status: OrderStatus.cancelled },
    });

    // 庫存回補邏輯
    const productUpdates = order.items
      .filter(item => item.product_variant_id)
      .map(item => tx.productVariant.update({
        where: { id: item.product_variant_id! },
        data: { stock_quantity: { increment: item.quantity } }
      }));

    const ticketUpdates = order.items
      .filter(item => item.ticket_type_id)
      .map(item => tx.ticketType.update({
        where: { id: item.ticket_type_id! },
        data: { total_quantity: { increment: item.quantity } }
      }));

    await Promise.all([...productUpdates, ...ticketUpdates]);

    return { message: "訂單已成功取消，庫存已回補。" };
  });

  return result;
};