import { z } from "zod";

// ✅ 註冊驗證（可選上傳 avatar）
export const registerSchema = z.object({
  email: z.string().email("請輸入有效的 Email"),
  password: z.string().min(6, "密碼至少 6 碼"),
  name: z.string().optional(),
  avatar: z.string().url("請輸入有效的圖片網址").optional().nullable(), // ✅ 新增欄位
});

// ✅ 登入驗證（不需 avatar）
export const loginSchema = z.object({
  email: z.string().email("請輸入有效的 Email"),
  password: z.string().min(6, "密碼至少 6 碼"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
