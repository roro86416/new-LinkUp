import { z } from "zod";

// 註冊驗證
export const registerSchema = z.object({
  email: z.string().email("請輸入有效的 Email"),
  password: z.string().min(6, "密碼至少 6 碼"),
  name: z.string().optional(),
});

// 登入驗證
export const loginSchema = z.object({
  email: z.string().email("請輸入有效的 Email"),
  password: z.string().min(6, "密碼至少 6 碼"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
