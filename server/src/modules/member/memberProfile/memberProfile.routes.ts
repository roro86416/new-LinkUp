import { Router } from "express";
import { MemberProfileController } from "./memberProfile.controller.js";
import { authMiddleware } from "../../../middleware/auth-middleware.js";

const router = Router();
const controller = new MemberProfileController();

// CRUD
router.get("/profile", authMiddleware, controller.getProfile.bind(controller));
router.post("/profile", authMiddleware, controller.createProfile.bind(controller));
router.put("/profile", authMiddleware, controller.updateProfile.bind(controller));
router.delete("/profile", authMiddleware, controller.deleteAccount.bind(controller));

export default router;
