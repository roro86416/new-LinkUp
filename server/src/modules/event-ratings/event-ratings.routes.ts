// 路由設定：這支檔案定義路由，定義 API endpoint (對應到一個後端程式如controller與service)，例如 /api/ratings對應某個controller, service

// src/modules/event-ratings/event-ratings.routes.ts
import { Router } from "express";
// 若你之後要加權限驗證，可以在這裡引入 verify.middleware
// import verify from "../../middleware/verify.middleware";
// import { ratingSchema } from "./event-ratings.schema.js"; // 先照抄products-routes.ts
import { createRating } from "./event-ratings.controller";

// --- 活動評論路由 (event-ratings Routes) ---
const router = Router();

// POST /api/ratings → 新增評論
// 告訴 Express：「當有人發送 POST 請求到 /api/ratings，就執行 createRating() 控制器。」
router.post("/", /* verifyUser, */ createRating);

export default router;
