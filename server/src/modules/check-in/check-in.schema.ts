import { z } from "zod";

// 驗票請求的 Body
export const verifyTicketSchema = z.object({
  body: z.object({
    qr_code: z.string().min(1, "QR Code 不能為空"),
  }),
});

export type VerifyTicketBody = z.infer<typeof verifyTicketSchema>["body"];