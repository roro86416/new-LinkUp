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