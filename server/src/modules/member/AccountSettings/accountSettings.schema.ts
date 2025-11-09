import { z } from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "原密碼為必填"),
    newPassword: z.string().min(8, "新密碼長度至少需要 8 個字元"),
    confirmPassword: z.string().min(1, "確認密碼為必填"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "新密碼與確認密碼不相符",
    path: ["confirmPassword"], // Attach the error to the confirmPassword field
  });