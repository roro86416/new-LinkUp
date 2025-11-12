import { Router } from "express";
import verify from "../../middleware/verify.middleware.js";
import {
  createNotificationSchema,
  updateNotificationStatusSchema,
} from "./notifications.schema.js";
import {
  createNotificationController,
  deleteNotificationController,
  getNotificationsController,
  markAsReadController,
} from "./notifications.controller.js";

const router = Router();

// --- 使用者個人通知 API (會匹配 /api/notifications) ---
router.get("/", verify, getNotificationsController);
router.post("/", verify(createNotificationSchema), createNotificationController);
router.patch(
  "/:id/read",
  verify(updateNotificationStatusSchema),
  markAsReadController
);
router.delete("/:id", verify, deleteNotificationController);

export default router;
