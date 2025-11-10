import { Router } from "express";
import { AccountSettingsController } from "./accountSettings.controller.js";
import { auth } from "../../../middleware/auth.middleware.js";

const router = Router();
const accountSettingsController = new AccountSettingsController();

// Route to change password
// POST /api/member/account-settings/change-password
router.post(
  "/change-password",
  auth("member"), // 使用新的 auth middleware，並指定角色為 'member'
  (req, res) => accountSettingsController.changePassword(req, res)
);

export default router;