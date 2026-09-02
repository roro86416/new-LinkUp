// src/app/schema/postSchema.ts
import { z } from "zod";

export const PostSchema = z.object({
  coverImage: z.string().min(1, "請上傳封面圖片"),
  title: z.string().min(1, "標題不能空白"),
  tags: z
    .array(z.string())
    .min(1, "請至少選擇一個標籤"),
  category: z.string().min(1, "請選擇分類"),
  eventLink: z.string().url("活動連結格式不正確").optional().or(z.literal("")),
  content: z.string().min(10, "內容至少 10 個字"),
  images: z.array(z.string()).optional(),
});
