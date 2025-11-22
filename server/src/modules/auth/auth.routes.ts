// server/src/modules/auth/auth.routes.ts
import { Router } from "express";
import { authController } from "./auth.controller.js";


const router = Router();

// POST /api/auth/register
router.post("/register", authController.register);

// POST /api/auth/login
router.post("/login", authController.login);

router.post("/google", authController.googleLogin);




export default router;
