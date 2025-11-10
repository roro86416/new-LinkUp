import express from "express";
import { auth } from "../../middleware/auth.middleware.js";
import { getAllMembersHandler } from "./member.controller.js";

const router = express.Router();

// GET /api/admin/members - 取得所有會員列表 (僅限管理員)
router.get("/", auth("admin"), getAllMembersHandler);

export default router;