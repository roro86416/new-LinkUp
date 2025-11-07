import { Router } from "express";
import { MemberProfileController } from "./memberProfile.controller.js";
import { authMiddleware } from "../../../middleware/auth-middleware.js";

const router = Router();
const controller = new MemberProfileController();

// CRUD
router.get("/", authMiddleware, controller.getProfile.bind(controller));
router.post("/", authMiddleware, controller.createProfile.bind(controller));
router.put("/", authMiddleware, controller.updateProfile.bind(controller));
router.delete("/", authMiddleware, controller.deleteAccount.bind(controller));

export default router;
