import { Router } from "express";
import { createPostController } from "./post.controller.js";

const router = Router();

// 前端會用 JSON POST，cover 圖片透過 /image/upload 先上傳
router.post("/", createPostController);

export default router;
