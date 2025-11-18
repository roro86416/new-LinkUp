// 路由設定：這支檔案定義路由，定義 API endpoint (對應到一個後端程式如controller與service)，例如 /api/ratings對應某個controller, service

// src/modules/event-ratings/event-ratings.routes.ts
import express from "express";
// 若你之後要加權限驗證，可以在這裡引入 verify.middleware
import { auth } from "../../middleware/auth.middleware.js";
// import { ratingSchema } from "./event-ratings.schema.js"; // 先照抄products-routes.ts
import {
  createRating,
  getRatings,
  updateRating,
  deleteRating
} from "./event-ratings.controller.js";

// --- 活動評論路由 (event-ratings Routes) ---
const router = express.Router();

// 🟢 無須登入即可使用的功能
// GET /api/ratings/:eventId
// ✅ 取得特定活動的所有評論
router.get("/:eventId", getRatings);

// ==========================================================
// 🟡 以下操作需登入（member）
// POST /api/ratings → 新增評論
// 告訴 Express：「當有人發送 POST 請求到 /api/ratings，就執行 createRating() 控制器。」
router.post("/", auth("member"), createRating);

// 更新評論
router.patch("/:ratingId", auth("member"), updateRating);

// ❌ 刪除評論
router.delete("/:ratingId", auth("member"), deleteRating);

export default router;
