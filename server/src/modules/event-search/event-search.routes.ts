// server/src/modules/event-search/event-search.routes.ts
import express from "express";
import { searchEvents } from "./event-search.controller.js";

const router = express.Router();

/**
 * @route GET /api/events/search
 * @desc 搜尋活動（依關鍵字、地區、日期、票價等條件）
 * @access Public
 */

// 搜尋活動	(GET  /api/events/search)	依關鍵字、類別、地區、日期篩選活動
router.get("/search", searchEvents);

export default router;
