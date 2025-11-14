import { z } from "zod";

export const contentSchema = z.object({
  content: z.string().min(1, "文章內容不可為空"),
  images: z.array(z.string()).optional(),
});

export type ContentSchemaType = z.infer<typeof contentSchema>;
