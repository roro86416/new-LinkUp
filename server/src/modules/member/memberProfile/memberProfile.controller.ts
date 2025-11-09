import { Response } from "express";
import prisma from "../../../utils/prisma-only.js";
import { AuthRequest } from "../../../middleware/auth-middleware.js";

export class MemberProfileController {
  // 可更新欄位白名單
  private allowedUpdateFields = [
    "name",
    "avatar",
    "phone_number",
    "birth_date",
    "address",
  ];

  // 取得會員資料
  async getProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId; // 保持使用 'userId'
      if (!userId)
        return res.status(401).json({ message: "未驗證使用者" });

      const profile = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!profile)
        return res.status(404).json({ message: "會員資料不存在" });

      res.json(profile);
    } catch (err) {
      console.error("getProfile Error:", err);
      res.status(500).json({ message: "取得會員資料失敗", error: err });
    }
  }

  // 建立或初始化會員資料
  async createProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId; // 保持使用 'userId'
      if (!userId)
        return res.status(401).json({ message: "未驗證使用者" });

      const data = req.body;

      const newProfile = await prisma.user.update({
        where: { id: userId },
        data: {
          ...data,
        },
      });

      res.status(201).json(newProfile);
    } catch (err) {
      console.error("createProfile Error:", err);
      res.status(500).json({ message: "建立會員資料失敗", error: err });
    }
  }

  // 更新會員資料
  async updateProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId; // 保持使用 'userId'
      if (!userId)
        return res.status(401).json({ message: "未驗證使用者" });

      const data = req.body;

      // 過濾只允許更新的欄位
      const updateData: Record<string, any> = {};
      for (const key of this.allowedUpdateFields) {
        if (data[key] !== undefined) {
          updateData[key] = data[key];
        }
      }

      const updated = await prisma.user.update({
        where: { id: userId },
        data: updateData,
      });

      res.json(updated);
    } catch (err) {
      console.error("updateProfile Error:", err);
      res.status(500).json({ message: "更新會員資料失敗", error: err });
    }
  }

  // 刪除會員資料
  async deleteAccount(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId; // 保持使用 'userId'
      if (!userId)
        return res.status(401).json({ message: "未驗證使用者" });

      await prisma.user.delete({ where: { id: userId } });
      res.json({ message: "會員帳號已刪除" });
    } catch (err) {
      console.error("deleteAccount Error:", err);
      res.status(500).json({ message: "刪除會員資料失敗", error: err });
    }
  }
}
