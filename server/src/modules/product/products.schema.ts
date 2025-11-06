import { z } from "zod";

// 規格規範
const variantSchema = z.object({
  option1_name: z.string().optional(),
  option1_value: z.string().optional(),
  option2_name: z.string().optional(),
  option2_value: z.string().optional(),
  sku: z.string().optional(),
  stock_quantity: z.number().int().min(0, "庫存不可為負值"),
  price_offset: z.number().default(0),
});

// --- 新增商品規範 ---
export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, "商品名稱不能為空"),
    base_price: z.number().positive("價格必須大與 0"),
    description: z.string().optional(),
    image_url: z.string().optional(),
    is_published: z.boolean().default(false),
    variants: z.array(variantSchema),
  }),
});

// (我們需要匯出這個型別給 Service 使用)
export type CreateProductBody = z.infer<typeof createProductSchema>["body"];

// --- 更新商品規範 ---
export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, "商品名稱不能為空").optional(),
    base_price: z.number().positive("價格必須大於 0").optional(),
    description: z.string().optional(),
    image_url: z.string().optional(),
    variants: z.array(variantSchema).optional(),
    is_published: z.boolean().optional(),
  }),
});

// (你原本已經有這個了，很棒！)
export type UpdateProductBody = z.infer<typeof updateProductSchema>["body"];
