import { z } from "zod";

const paragraphSchema = z.object({
  id: z.string(),
  type: z.literal("paragraph"),
  text: z.string(),
});

const imageSchema = z.object({
  id: z.string(),
  type: z.literal("image"),
  url: z.string(),
});

export const postSchema = z.object({
  title: z.string().min(1),
  coverImage: z.string().optional(),
  tags: z.string().optional(),
  category: z.string().optional(),
  link: z.string().optional(),
  content: z.object({
    blocks: z.array(z.union([paragraphSchema, imageSchema])),
  }),
});
export type PostFormData = z.infer<typeof postSchema>;
