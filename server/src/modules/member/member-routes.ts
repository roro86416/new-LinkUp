import { Router } from "express";
import { memberController } from "./member-controller.js";

const router = Router();

// POST /api/member/register
router.post("/register", memberController.register);

// POST /api/member/login
router.post("/login", memberController.login);

export default router;
