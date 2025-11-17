import prisma from "../../utils/prisma-only.js"; 
import { OrderCreateBody, TicketAttendee } from "./orders.schema.js"; 
import { ItemType, OrderStatus } from "../../generated/prisma/enums.js"; 
import { Decimal } from "@prisma/client/runtime/library";
type OrderItemInputData = {
    item_type: ItemType;
    ticket_type_id?: string;
    product_variant_id?: number;
    item_name: string;
    variant_description?: string;
    quantity: number;
    unit_price: Decimal;
};

// 輔助函數：生成唯一的訂單號碼
const generateOrderNumber = (): string => {
  return `LU-${Date.now()}-${Math.floor(Math.random() * 9000) + 1000}`;
};

// 【新增】輔助函數：生成唯一的票券 QR Code
const generateQrCode = (): string => {
  // 實際應用中應使用更安全的 UUID 或加密字串
  return `TICKET-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
};

/**
 * @desc 查詢使用者所有訂單列表
 */
export const findOrdersByUserService = async (userId: string) => {
  const orders = await prisma.order.findMany({
    where: {
      user_id: userId, // 關鍵：只找這個 user_id 的
    },
    include: {
      items: true, // 包含訂單項目
    },
    orderBy: {
      created_at: "desc", // 讓最新的訂單排在最前面
    },
  });
  return orders;
};

/**
 * @desc 查詢單筆訂單詳情
 */
export const findOrderByIdService = async (userId: string, orderId: number) => {
  // findFirstOrThrow 會在找不到時自動拋出錯誤
  const order = await prisma.order.findFirstOrThrow({
    where: {
      id: orderId,
      user_id: userId, // 核心安全檢查：確保這張訂單屬於目前登入的使用者
    },
    include: {
      items: {
        include: {
          ticket: true, // 同時載入這筆訂單項目所產生的電子票券
        },
      },
      coupon: true,
    },
  });
  return order;
};

/**
 * @desc 建立新訂單的服務函數 (包含 Ticket 建立)
 */
export const createOrderService = async (
  userId: string,
  body: OrderCreateBody
) => {
  
  // 從 body 中分離出帳單資訊和持票人資訊
  const { attendees, ...billingInfo } = body;

  const result = await prisma.$transaction(async (tx) => {
    
    // 步驟 1: 獲取購物車
    const cart = await tx.cart.findUnique({
      where: { user_id: userId },
      include: {
        items: {
          include: {
            productVariant: { include: { product: true } },
            ticketType: { include: { event: true } },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new Error("購物車是空的，無法結帳");
    }

    const { items: cartItems, id: cart_id } = cart;

    // 步驟 2: 初始化變數
    let subtotal = new Decimal(0);
    const orderItemsData: OrderItemInputData[] = [];
    const productUpdates: { id: number; quantity: number }[] = [];
    const ticketUpdates: { id: string; quantity: number }[] = [];
    
    // 【新增】用於儲存哪些 OrderItem 需要建立 Ticket
    const ticketItemsInCart: {
      ticketTypeId: string;
      quantity: number;
    }[] = [];


    // 步驟 3: 檢查庫存並計算價格
    for (const item of cartItems) {
      // ... (省略 for 迴圈內的程式碼，與您上一版的完全相同)
      const quantity = item.quantity;
      let unitPrice = new Decimal(0);
      let itemName = "";
      let variantDesc: string | undefined = undefined;
      let availableQuantity = 0;

      if (item.item_type === ItemType.products) {
        const variant = item.productVariant!;
        unitPrice = variant.product.base_price.add(variant.price_offset);
        itemName = variant.product.name;
        variantDesc = `${variant.option1_name}: ${variant.option1_value}`;
        availableQuantity = variant.stock_quantity;
        if (availableQuantity < quantity) {
          throw new Error(`商品 ${itemName} 庫存不足。剩餘: ${availableQuantity}`);
        }
        productUpdates.push({ id: variant.id, quantity: quantity });
      } else if (item.item_type === ItemType.ticket_types) {
        const ticket = item.ticketType!;
        unitPrice = ticket.price;
        itemName = `${ticket.event.title} - ${ticket.name}`;
        availableQuantity = ticket.total_quantity;
        if (availableQuantity < quantity) {
          throw new Error(`活動票券 ${itemName} 數量不足。剩餘: ${availableQuantity}`);
        }
        ticketUpdates.push({ id: ticket.id, quantity: quantity });
        
        // 【新增】記錄這個購物車項目是票券
        ticketItemsInCart.push({
          ticketTypeId: ticket.id,
          quantity: quantity,
        });
      }
      subtotal = subtotal.add(unitPrice.mul(quantity));
      orderItemsData.push({
        item_type: item.item_type,
        ticket_type_id: item.ticket_type_id ?? undefined,
        product_variant_id: item.product_variant_id ?? undefined,
        item_name: itemName,
        variant_description: variantDesc,
        quantity: quantity,
        unit_price: unitPrice,
      });
    } // <-- for 迴圈結束

    
    // 步驟 4: 總金額計算、驗證與建立訂單 (Order + OrderItems)
    
    // 【新增】驗證持票人 (Attendee) 數量是否正確
    const totalTicketsInCart = ticketItemsInCart.reduce((sum, item) => sum + item.quantity, 0);
    if (totalTicketsInCart !== attendees.length) {
      throw new Error(`持票人資料數量 (${attendees.length}) 與購物車中的票券總數 (${totalTicketsInCart}) 不符。`);
    }

    let discountAmount = new Decimal(0);
    let totalAmount = subtotal.sub(discountAmount); 

    if (totalAmount.toNumber() !== billingInfo.total_amount) { // 【修正】使用 billingInfo
        throw new Error(`總金額計算錯誤或遭篡改 (後端: ${totalAmount}, 前端: ${billingInfo.total_amount})，請重新整理購物車。`);
    }
    
    const orderNumber = generateOrderNumber(); 
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 30); // 30 分鐘到期

    const newOrder = await tx.order.create({
      data: {
        order_number: orderNumber,
        user_id: userId,
        status: OrderStatus.pending, 
        billing_name: billingInfo.billing_name,
        billing_phone: billingInfo.billing_phone,
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
      // 【新增】建立完 Order 後，立刻取回 OrderItem 的 ID
      include: {
        items: true,
      }
    });

    // 步驟 5a: 【新增】建立電子票券 (Ticket)
    
    // 我們需要將 'attendees' 陣列的資料分配給剛剛建立的 'OrderItems'
    let attendeeIndex = 0;
    const ticketCreatePromises: Promise<any>[] = [];

    for (const orderItem of newOrder.items) {
      // 檢查這個 OrderItem 是不是我們在步驟 3 記錄的票券
      if (orderItem.item_type === ItemType.ticket_types && orderItem.ticket_type_id) {
        
        // 檢查這個票券品項購買了幾張 (例如：買了 2 張 VIP 票)
        for (let i = 0; i < orderItem.quantity; i++) {
          const attendee = attendees[attendeeIndex];
          if (!attendee) {
            throw new Error("內部錯誤：持票人資料分配失敗。");
          }

          // 準備建立一張 Ticket 紀錄
          const ticketPromise = tx.ticket.create({
            data: {
              order_item_id: orderItem.id, // 關聯到剛剛建立的 OrderItem
              name: attendee.name,
              email: attendee.email,
              phone: attendee.phone,
              gender: attendee.gender,
              qr_code_data: generateQrCode(), // 生成唯一的 QR Code
              status: "valid", // 初始狀態
            },
          });
          ticketCreatePromises.push(ticketPromise);
          attendeeIndex++;
        }
      }
    }
    
    // 步驟 5b: 扣除庫存 (Product & TicketType)
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

    // 【修改】將建立 Ticket 的 Promise 也加入到 Promise.all 中
    await Promise.all([
      ...productUpdatePromises, 
      ...ticketUpdatePromises,
      ...ticketCreatePromises // 確保 Ticket 也被成功建立
    ]);
    
    // 步驟 6: 清空購物車
    await tx.cartItem.deleteMany({
      where: { cart_id: cart_id }, 
    });

    // 步驟 7: 返回新建立的訂單
    const completeOrder = await tx.order.findUnique({
      where: { id: newOrder.id },
      include: { 
        items: {
          include: {
            ticket: true, // 【新增】返回訂單時，也包含剛剛建立的票券
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
 * @desc 取消一筆待付款 (Pending) 的訂單
 */
export const cancelOrderService = async (userId: string, orderId: number) => {
  // 取消訂單並回補庫存，必須在 $transaction 中完成
  const result = await prisma.$transaction(async (tx) => {
    
    // 步驟 1：找出訂單，並鎖定 (確保它屬於該使用者)
    const order = await tx.order.findFirstOrThrow({
      where: {
        id: orderId,
        user_id: userId,
      },
      include: {
        items: true, // 載入所有項目，準備回補庫存
      },
    });

    // 步驟 2：業務邏輯檢查 (非常重要)
    // 只有 "待付款" (pending) 的訂單才能被使用者取消
    if (order.status !== OrderStatus.pending) {
      throw new Error(`無法取消狀態為 "${order.status}" 的訂單。`);
    }

    // 步驟 3：更新訂單狀態為 "cancelled"
    await tx.order.update({
      where: { id: order.id },
      data: { status: OrderStatus.cancelled },
    });

    // 步驟 4：庫存回補 (與 30 分鐘自動取消的邏輯相同)
    
    // a. 準備商品庫存回補 (Increment)
    const productUpdates = order.items
      .filter(item => item.product_variant_id)
      .map(item => tx.productVariant.update({
        where: { id: item.product_variant_id! },
        data: { stock_quantity: { increment: item.quantity } } // 使用 increment 原子操作
      }));

    // b. 準備票券數量回補 (Increment)
    const ticketUpdates = order.items
      .filter(item => item.ticket_type_id)
      .map(item => tx.ticketType.update({
        where: { id: item.ticket_type_id! },
        data: { total_quantity: { increment: item.quantity } } // 使用 increment 原子操作
      }));
      
    // c. 執行所有回補
    await Promise.all([...productUpdates, ...ticketUpdates]);

    return { message: "訂單已成功取消，庫存已回補。" };
  });

  return result;
};