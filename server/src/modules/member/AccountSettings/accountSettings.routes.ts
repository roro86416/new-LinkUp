import { Router } from "express";
import { AccountSettingsController } from "./accountSettings.controller.js";
import { authMiddleware } from "../../../middleware/auth-middleware.js";

const router = Router();
const accountSettingsController = new AccountSettingsController();

// Route to change password
// POST /api/member/account-settings/change-password
router.post(
  "/change-password",
  authMiddleware, // Protect this route
  (req, res) => accountSettingsController.changePassword(req, res)
);

export default router;