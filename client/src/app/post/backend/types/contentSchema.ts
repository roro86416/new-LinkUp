import { z } from "zod";

export const blockSchema = z.object({
  id: z.string(),
  type: z.enum(["paragraph", "image"]),
  text: z.string().optional(),
  url: z.string().optional(),
});

export const contentSchema = z
  .object({
    blocks: z.array(blockSchema),
  })
  .refine(
    (data) =>
      data.blocks.some((b) => b.type === "paragraph" && b.text?.trim() !== ""),
    {
      path: ["blocks"],
      message: "至少需要一段文字內容。",
    }
  )
  .refine((data) => data.blocks.some((b) => b.type === "image" && b.url), {
    path: ["blocks"],
    message: "至少需要上傳一張圖片。",
  });

export type ContentSchemaType = z.infer<typeof contentSchema>;
