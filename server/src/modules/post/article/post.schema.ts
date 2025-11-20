import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  category: z.string().min(1, "分類必填"),
  tags: z.union([z.string(), z.array(z.string())]).optional(),
  coverImage: z.string().optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
