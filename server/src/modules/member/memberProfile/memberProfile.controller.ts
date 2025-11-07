import { Response } from "express";
import prisma from "../../../utils/prisma-only.js";
import { AuthRequest } from "../../../middleware/auth-middleware.js";

export class MemberProfileController {
  // 取得會員資料
  async getProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ message: "未驗證使用者" });

      const profile = await prisma.user.findUnique({ where: { id: userId } });
      res.json(profile);
    } catch (err) {
      res.status(500).json({ message: "取得會員資料失敗", error: err });
    }
  }

  // 建立或初始化會員資料
  async createProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ message: "未驗證使用者" });

      const data = req.body;
      // 如果想保留 userId 固定對應原帳號
      const newProfile = await prisma.user.update({
        where: { id: userId },
        data,
      });

      res.status(201).json(newProfile);
    } catch (err) {
      res.status(500).json({ message: "建立會員資料失敗", error: err });
    }
  }

  // 更新會員資料
  async updateProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ message: "未驗證使用者" });

      const data = req.body;
      const updated = await prisma.user.update({ where: { id: userId }, data });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: "更新會員資料失敗", error: err });
    }
  }

  // 刪除會員資料
  async deleteAccount(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ message: "未驗證使用者" });

      await prisma.user.delete({ where: { id: userId } });
      res.json({ message: "會員帳號已刪除" });
    } catch (err) {
      res.status(500).json({ message: "刪除會員資料失敗", error: err });
    }
  }
}
