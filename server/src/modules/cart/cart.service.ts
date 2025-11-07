import prisma from "../../utils/prisma-only.js";
import { AddToCartBody } from "./cart.schema.js";

/**
 * @desc 新增項目到購物車 (商品或票券)
 * @param userId - 經過驗證的使用者 ID (來自 Controller)
 * @param body - 經過 Zod 驗證的請求主體
 */
export const addToCartService = async (userId: string, body: AddToCartBody) => {
  // --- 步驟 1：確保購物車存在 (Upsert Cart) ---
  const cart = await prisma.cart.upsert({
    where: { user_id: userId }, // (修正：使用傳入的 userId)
    create: { user_id: userId },
    update: {},
    select: { id: true },
  });
  const cart_id = cart.id;
  let resultItem;

  // --- 步驟 2：根據 item_type 進行分流 ---
  if (body.item_type === "products") {
    //
    // ========= 這是「商品」的邏輯 =========
    //

    // (A) 先尋找現有項目
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cart_id: cart_id,
        product_variant_id: body.product_variant_id,
        item_type: "products",
      },
    });

    // (B) 再抓取商品規格的庫存
    const variant = await prisma.productVariant.findUniqueOrThrow({
      where: { id: body.product_variant_id },
      select: { stock_quantity: true },
    });

    // (C) 計算「正確的」新總數
    const currentQuantityInCart = existingItem ? existingItem.quantity : 0;
    const newTotalQuantity = currentQuantityInCart + body.quantity;

    // (D) 檢查庫存
    if (variant.stock_quantity < newTotalQuantity) {
      throw new Error(`庫存不足！剩餘庫存：${variant.stock_quantity}`);
    }

    // (E) 執行更新或建立
    if (existingItem) {
      resultItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: {
            increment: body.quantity,
          },
        },
      });
    } else {
      resultItem = await prisma.cartItem.create({
        data: {
          cart_id: cart_id,
          item_type: "products",
          product_variant_id: body.product_variant_id,
          quantity: body.quantity,
        },
      });
    }
  } else {
    //
    // ========= 這是「票券」的邏輯 =========
    //

    // (A) 抓取票券的 event_id 和總庫存
    const ticketType = await prisma.ticketType.findUniqueOrThrow({
      where: { id: body.ticket_type_id },
      select: {
        event_id: true,
        total_quantity: true,
      },
    });

    // (B) 計算該活動票券已售出多少
    const sold_ticket = await prisma.orderItem.count({
      where: {
        ticket_type_id: body.ticket_type_id,
      },
    });

    // (C) 如果已售出票券是否大於該票券庫存
    if (sold_ticket >= ticketType.total_quantity) {
      throw new Error("此票券已售完");
    }

    // (D) 檢查該使用者購物車有沒有重複購買
    const ticketInCart = await prisma.cartItem.findFirst({
      where: {
        cart_id: cart_id,
        item_type: "ticket_types",
        ticketType: {
          event_id: ticketType.event_id,
        },
      },
    });

    // (E) 如果有拋出錯誤
    if (ticketInCart) {
      throw new Error("您的購物車中已經有此活動的票券");
    }

    // (F) 如果沒有就建立新項目 (已刪除重複的 create)
    resultItem = await prisma.cartItem.create({
      data: {
        cart_id: cart_id,
        item_type: "ticket_types",
        ticket_type_id: body.ticket_type_id,
        quantity: 1, // 只能買一張
      },
    });
  }

  // --- 步驟 3：回傳結果 ---
  return resultItem;
};
