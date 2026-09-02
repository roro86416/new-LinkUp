import { z } from "zod";

export const coverSchema = z.object({
  coverImage: z.string().min(1, "請上傳封面圖片"),
});

export type CoverSchemaType = z.infer<typeof coverSchema>;
