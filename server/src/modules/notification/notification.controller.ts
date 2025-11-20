import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware.js";
import * as svc from "./notification.service.js";

// 取得列表
export const listMyNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "未驗證使用者" });

    const notifications = await svc.getMyNotifications(userId);
    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "取得通知失敗" });
  }
};

// 標記已讀
export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const statusId = parseInt(req.params.id); // URL 參數
    if (!userId) return res.status(401).json({ message: "未驗證使用者" });
    if (isNaN(statusId)) return res.status(400).json({ message: "無效的 ID" });

    await svc.markAsRead(statusId, userId);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "更新狀態失敗" });
  }
};

// 刪除通知
export const deleteNotification = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const statusId = parseInt(req.params.id);
    if (!userId) return res.status(401).json({ message: "未驗證使用者" });
    if (isNaN(statusId)) return res.status(400).json({ message: "無效的 ID" });

    await svc.deleteNotification(statusId, userId);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "刪除通知失敗" });
  }
};