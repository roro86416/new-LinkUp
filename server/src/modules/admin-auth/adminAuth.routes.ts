import express from "express";
import verify from "../../middleware/verify.middleware.js";
import { adminLoginSchema } from "./adminAuth.schema.js";
import {
  getAdminProfileHandler,
  loginAdminHandler,
} from "./adminAuth.controller.js";
import { auth } from "../../middleware/auth.middleware.js";

const router = express.Router();

// 後台登入路由
router.post("/login", verify(adminLoginSchema), loginAdminHandler);

// 取得管理員個人資料 (使用新的 auth middleware，並指定角色為 'admin')
router.get("/profile", auth("admin"), getAdminProfileHandler);

export default router;