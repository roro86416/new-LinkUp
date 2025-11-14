import { z } from "zod";

export const postSchema = z.object({
  coverImage: z.string().min(1, "封面圖片為必填"),
  title: z.string().min(1, "標題為必填"),
  tags: z.string().min(1, "標籤為必填"),
  category: z.string().min(1, "分類為必填"),

  link: z
    .string()
    .url("網址格式不正確")
    .optional()
    .or(z.literal("")), // 允許空字串

  content: z.string().min(1, "文章內容為必填"),

  // 若要支援多張文章圖片（可選填）
  images: z.array(z.string()).optional(),
});

export type PostSchemaType = z.infer<typeof postSchema>;
