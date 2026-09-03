import { Router } from "express";
import * as c from "./events.controller.js"; 
// [新增] 引入 checkCanReview
import { createRating, checkCanReview } from "../event-ratings/event-ratings.controller.js";
// [新增] 引入驗證 Middleware (確保能拿到 userId)
import { auth } from "../../middleware/auth.middleware.js"; 

const router = Router();

router.get("/", c.listEvents);
router.get("/categories", c.listCategories);
router.get("/:id", c.getEventById);

// [新增] 檢查是否可評價 (需要登入)
router.get("/:id/can-review", auth("member"), checkCanReview);

// 新增評價
router.post("/:id/ratings", auth("member"), (req, res, next) => {
    req.body.eventId = parseInt(req.params.id); 
    next();
}, createRating);

export default router;