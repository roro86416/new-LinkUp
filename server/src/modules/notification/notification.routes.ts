import { Router } from "express";
import { auth } from "../../middleware/auth.middleware.js";
import * as c from "./notification.controller.js";

const router = Router();

// 這些路由都需要會員權限 (auth("member"))
router.get("/", auth("member"), c.listMyNotifications);
router.patch("/:id/read", auth("member"), c.markAsRead);
router.delete("/:id", auth("member"), c.deleteNotification);

export default router;