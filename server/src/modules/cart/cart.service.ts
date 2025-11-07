import prisma from "../../utils/prisma-only";
import { AddToCartBody } from "./cart.schema";

const MOCK_USER_ID = "1";

/**
 * @desc 新增項目到購物車 (商品或票券)
 * @param userId -經過驗證的使用者ID
 * @param body - 經過 Zod 驗證的請求主體
 */

export const addToCartService = async (body: AddToCartBody) => {
  const cart = await prisma.cart.upsert({
    where: { user_id: MOCK_USER_ID },
    create: { user_id: MOCK_USER_ID },
    update: {},
    select: { id: true },
  });
  const cart_id = cart.id;
  let resultItem;

  //週邊商品
  if (body.item_type === "products") {
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cart_id: cart_id,
        product_variant_id: body.product_variant_id,
        item_type: "products", // 確保我們找的是商品
      },
    });
    const variant = await prisma.productVariant.findUniqueOrThrow({
      where: { id: body.product_variant_id },
      select: { stock_quantity: true },
    });

    const currentQuantityInCart = existingItem ? existingItem.quantity : 0;
    const newTotalQuantity = currentQuantityInCart + body.quantity;
    if (variant.stock_quantity < newTotalQuantity) {
      throw new Error(`庫存不足！剩餘庫存：${variant.stock_quantity}`);
    }
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
    //票券
    const ticketType = await prisma.ticketType.findUniqueOrThrow({
      where: {
        id: body.ticket_type_id,
      },
      select: {
        event_id: true,
        total_quantity: true,
      },
    });
    const ticketInCart = await prisma.cartItem.findFirst({
      where: {
        cart_id: cart_id,
        item_type: "ticket_types",
        ticketType: {
          event_id: ticketType.event_id,
        },
      },
    });
    if (ticketInCart) {
      throw new Error("您的購物車中已經有此活動的票券");
    }

    const newTicketItem = await prisma.cartItem.create({
      data: {
        cart_id: cart_id,
        item_type: "ticket_types",
        ticket_type_id: body.ticket_type_id,
        quantity: 1,
      },
    });
  }
  return resultItem;
};
