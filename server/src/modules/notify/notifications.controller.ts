import { Request, Response, NextFunction } from "express";
import {
  createNotificationService,
  deleteNotificationForUserService,
  findNotificationsByUserService,
  markNotificationAsReadService,
} from "./notifications.service.js";

// 輔助函式，用來包裝非同步 controller，自動捕捉錯誤並傳遞給 next()
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };

// 假設 userId 可以從 req.user 中取得 (經過 middleware 驗證後)
interface AuthenticatedRequest extends Request {
  user?: { id: string }; // 將 id 型別從 number 改為 string
}

// --- 使用者個人通知 Controllers ---

export const createNotificationController = asyncHandler(async (
  req: Request,
  res: Response
) => {
  const newNotification = await createNotificationService(req.body);
  res.status(201).json({
    status: "success",
    data: newNotification,
  });
});

export const getNotificationsController = asyncHandler(async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ status: "error", message: "使用者未登入" });
  }

  const notifications = await findNotificationsByUserService(userId);
  res.json({ status: "success", data: notifications });
});

export const markAsReadController = asyncHandler(async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user?.id;
  const notificationId = parseInt(req.params.id, 10);

  if (!userId) {
    return res.status(401).json({ status: "error", message: "使用者未登入" });
  }

  const updated = await markNotificationAsReadService(userId, notificationId);
  res.json({ status: "success", data: updated });
});

export const deleteNotificationController = asyncHandler(async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user?.id;
  const notificationId = parseInt(req.params.id, 10);

  if (!userId) {
    return res.status(401).json({ status: "error", message: "使用者未登入" });
  }

  await deleteNotificationForUserService(userId, notificationId);
  res.status(204).send();
});
