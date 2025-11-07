import prisma from "../../utils/prisma-only.js";
import { AddToCartBody } from "./cart.schema.js";

/**
 * @desc 新增項目到購物車 (商品或票券)
 * @param userId - 經過驗證的使用者 ID (來自 Controller)
 * @param body - 經過 Zod 驗證的請求主體
 */

export const addToCartService = async (userId: string, body: AddToCartBody) => {
  //確保購物車存在
  const cart = await prisma.cart.upsert({
    where: { user_id: userId },
    create: { user_id: userId },
    update: {},
    select: { id: true },
  });
  const cart_id = cart.id;
  let resultItem;

  //根據 item_type分類票券or週邊商品
  if (body.item_type === "products") {
    //「週邊商品」
    //先尋找現有項目
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cart_id: cart_id,
        product_variant_id: body.product_variant_id,
        item_type: "products",
      },
    });

    //抓取商品規格的庫存
    const variant = await prisma.productVariant.findUniqueOrThrow({
      where: { id: body.product_variant_id },
      select: { stock_quantity: true },
    });

    //計算正確的新總數
    const currentQuantityInCart = existingItem ? existingItem.quantity : 0;
    const newTotalQuantity = currentQuantityInCart + body.quantity;

    //檢查庫存
    if (variant.stock_quantity < newTotalQuantity) {
      throw new Error(`庫存不足！剩餘庫存：${variant.stock_quantity}`);
    }

    //執行更新
    if (existingItem) {
      resultItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: {
            increment: body.quantity,
          },
        },
      });
      // 如無項目則更新
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
    //「票券」
    //抓取票券的 event_id 和總庫存
    const ticketType = await prisma.ticketType.findUniqueOrThrow({
      where: { id: body.ticket_type_id },
      select: {
        event_id: true,
        total_quantity: true,
      },
    });

    //計算該活動票券已售出多少
    const sold_ticket = await prisma.orderItem.count({
      where: {
        ticket_type_id: body.ticket_type_id,
      },
    });

    //已售出票券是否大於該票券庫存
    if (sold_ticket >= ticketType.total_quantity) {
      throw new Error("此票券已售完");
    }

    //檢查該使用者購物車有沒有重複購買
    const ticketInCart = await prisma.cartItem.findFirst({
      where: {
        cart_id: cart_id,
        item_type: "ticket_types",
        ticketType: {
          event_id: ticketType.event_id,
        },
      },
    });

    //如有則拋出錯誤
    if (ticketInCart) {
      throw new Error("您的購物車中已經有此活動的票券");
    }

    //如沒有就建立新項目
    resultItem = await prisma.cartItem.create({
      data: {
        cart_id: cart_id,
        item_type: "ticket_types",
        ticket_type_id: body.ticket_type_id,
        quantity: 1, // 只能買一張
      },
    });
  }

  //回傳結果
  return resultItem;
};
