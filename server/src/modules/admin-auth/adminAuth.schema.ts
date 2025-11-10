import { z } from "zod";

export const adminLoginSchema = z.object({
  body: z.object({
    email: z.string().email({ message: "請提供有效的 Email" }),
    password: z.string().min(1, { message: "密碼為必填項" }),
  }),
});

// 導出推斷出來的型別
export type AdminLoginInput = z.infer<typeof adminLoginSchema>["body"];