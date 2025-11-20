import { Router } from "express";
import { auth } from "../../middleware/auth.middleware.js";
import verify from "../../middleware/verify.middleware.js";
import { verifyTicketSchema } from "./check-in.schema.js";
import { verifyTicketController } from "./check-in.controller.js";

const router = Router();

// 只有登入的使用者 (工作人員) 才能掃描
router.use(auth("member")); // 暫時用 member，如果您有 admin/organizer 角色可自行調整

// POST /api/v1/check-in/verify
router.post(
  "/verify",
  verify(verifyTicketSchema),
  verifyTicketController
);

export default router;