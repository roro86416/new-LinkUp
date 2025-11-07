import { z } from "zod";

//週邊商品的規範
const productBody = z.object({
  item_type: z.literal("products"),
  product_variant_id: z.number().int().positive(),
  quantity: z.number().int().min(1),
});

//票券的規範
const ticketBody = z.object({
  item_type: z.literal("ticket_types"),
  ticket_type_id: z.string().uuid(),
  quantity: z.literal(1, { message: "票券數量必須為1" }),
});

//加入購物車的規範
export const addToCartSchema = z.object({
  body: z.discriminatedUnion("item_type", [productBody, ticketBody]),
});
//
export type AddToCartBody = z.infer<typeof addToCartSchema>["body"];
