// server/src/modules/event-stats/event-stats.routes.ts
import express from "express";
import { getPopularTags, getMostFavoritedEvents, getUpcomingEvents } from "./event-stats.controller.js";

const router = express.Router();

/**
 * 📊 活動統計模組 (Event Stats)
 * 包含：
 *  - 熱門標籤 (/api/events/tags)
 *  - 最多人收藏的活動 (/api/events/favorites)
 *  - 即將開始的活動 (/api/events/upcoming)
 */

// 取得熱門標籤
router.get("/tags", getPopularTags);

// 取得最多人收藏的活動
router.get("/favorites", getMostFavoritedEvents);

// 取得即將開始的活動
router.get("/upcoming", getUpcomingEvents);

export default router;
