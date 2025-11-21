import { Router } from "express";
import { authController } from "./auth.controller.js";

const router = Router();

// POST /api/auth/register
router.post("/register", authController.register);

// POST /api/auth/login
router.post("/login", authController.login);

// Google 登入
router.post("/google", authController.googleLogin);
export default router;
