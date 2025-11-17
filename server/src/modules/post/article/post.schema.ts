import { z } from "zod";

/**
 * 後端接受的資料格式：
 * {
 *  title: string,
 *  coverImage?: string | null,   // 前端先上傳到 /image/upload，拿到 URL 再放這裡
 *  category_id?: string | number | null,
 *  content: string, // JSON 字串 (blocks)
 *  tags?: string[] | string, // 可接受陣列或逗號分隔字串
 *  article_id?: string | number | null
 * }
 */
export const createPostSchema = z.object({
  title: z.string().min(1),
  coverImage: z.string().nullable().optional(),
  category_id: z.union([z.string(), z.number()]).nullable().optional(),
  content: z.string(),
  tags: z.union([z.array(z.string()), z.string()]).optional(),
  article_id: z.union([z.string(), z.number()]).nullable().optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
