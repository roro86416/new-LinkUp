import { Response } from "express";
import { AuthRequest } from "../../../middleware/auth.middleware.js";
import { AccountSettingsService } from "./accountSettings.service.js";
import { changePasswordSchema } from "./accountSettings.schema.js";

export class AccountSettingsController {
  private accountSettingsService: AccountSettingsService;

  constructor() {
    this.accountSettingsService = new AccountSettingsService();
  }

  async changePassword(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ message: "未驗證使用者" });
      }

      // 1. Validate request body with Zod schema
      const validationResult = changePasswordSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          message: "資料驗證失敗",
          errors: validationResult.error.flatten().fieldErrors,
        });
      }

      const { currentPassword, newPassword } = validationResult.data;

      // 2. Call the service to execute the core logic
      await this.accountSettingsService.changePassword(userId, {
        currentPassword,
        newPassword,
      });

      // 3. Send a success response
      return res.status(200).json({ message: "密碼已成功更新" });
    } catch (err) {
      // 根據 Service 層拋出的特定錯誤，回傳更精確的 HTTP 狀態碼和訊息
      if (err instanceof Error) {
        switch (err.message) {
          case "原密碼不正確":
          case "找不到使用者或使用者未設定密碼":
            return res.status(400).json({ message: err.message });
        }
      }
      return res.status(500).json({ message: "更新密碼時發生內部錯誤" });
    }
  }
}