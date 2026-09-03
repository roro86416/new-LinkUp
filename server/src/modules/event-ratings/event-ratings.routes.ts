<<<<<<< HEAD
// 路由設定：這支檔案定義路由，定義 API endpoint (對應到一個後端程式如controller與service)，例如 /api/ratings對應某個controller, service

// src/modules/event-ratings/event-ratings.routes.ts
import { Router } from "express";
// 若你之後要加權限驗證，可以在這裡引入 verify.middleware
// import verify from "../../middleware/verify.middleware";
// import { ratingSchema } from "./event-ratings.schema.js"; // 先照抄products-routes.ts
import {
  createRating,
  getRatings,
  updateRating,
} from "./event-ratings.controller.js";

// --- 活動評論路由 (event-ratings Routes) ---
const router = Router();

// POST /api/ratings → 新增評論
// 告訴 Express：「當有人發送 POST 請求到 /api/ratings，就執行 createRating() 控制器。」
router.post("/", /* verifyUser, */ createRating);

// GET /api/ratings/:eventId → 新增評論
// ✅ 取得特定活動的所有評論
router.get("/:eventId", getRatings);

// 更新評論
router.patch("/:ratingId", updateRating);

export default router;
=======
import { Router } from "express";
import * as c from "../events/events.controller.js";
// [新增] 引入評價控制器
import { createRating, getRatings, updateRating, deleteRating } from "../event-ratings/event-ratings.controller.js";
import { auth } from "../../middleware/auth.middleware.js";

const router = Router();

// 公開活動相關路由
router.get("/", c.listEvents);

router.get("/categories", c.listCategories);
// 取得單一活動詳情
router.get("/:id", c.getEventById);
//
router.post("/:id/ratings", (req, res, next) => {
    req.body.event_id = parseInt(req.params.id);
    next();
}, createRating);


router.delete("/:ratingId", auth("member"), deleteRating);

export default router;
>>>>>>> origin/main-final
