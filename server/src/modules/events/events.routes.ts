import { Router } from "express";
import * as c from "./events.controller.js"; 

const router = Router();

// 獲取活動列表
router.get("/", c.listEvents);

// [新增] 獲取類別列表 (⚠️ 必須放在 /:id 之前)
router.get("/categories", c.listCategories);

// 獲取單一活動詳情
router.get("/:id", c.getEventById);

export default router;