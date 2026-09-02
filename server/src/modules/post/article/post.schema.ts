import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  category: z.string().min(1, "分類必填"),
  tags: z.union([z.string(), z.array(z.string())]).optional(),
  coverImage: z.string().optional(),
  author_id: z.string({
    message: "必須提供 author_id (使用者 ID)",
}).uuid({ message: "作者 ID 必須是有效的 UUID 格式" }),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
