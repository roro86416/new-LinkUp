// server/src/modules/event-stats/event-stats.controller.ts
import { Request, Response } from "express";
import {
  getPopularTagsService,
  getMostFavoritedEventsService,
  getUpcomingEventsService,
} from "./event-stats.service.js";

/* 設計重點與說明:
1. 錯誤處理: 以 try...catch 包裹，每支 API 獨立捕捉錯誤
2. 暫不包含 /popular 與 /view
*/

/**
 * 取得熱門標籤
 * GET /api/events/tags
 */
export async function getPopularTags(req: Request, res: Response) {
  try {
    const tags = await getPopularTagsService();
    return res.status(200).json({
      success: true,
      message: "熱門標籤查詢成功",
      data: tags,
    });
  } catch (error: any) {
    console.error("❌ getPopularTags 錯誤：", error);
    return res.status(500).json({
      success: false,
      message: "伺服器錯誤，無法取得熱門標籤",
    });
  }
}

/**
 * 取得最多人收藏的活動
 * GET /api/events/favorites
 */
export async function getMostFavoritedEvents(req: Request, res: Response) {
  try {
    const favorites = await getMostFavoritedEventsService();
    return res.status(200).json({
      success: true,
      message: "最多人收藏的活動查詢成功",
      data: favorites,
    });
  } catch (error: any) {
    console.error("❌ getMostFavoritedEvents 錯誤：", error);
    return res.status(500).json({
      success: false,
      message: "伺服器錯誤，無法取得收藏活動",
    });
  }
}

/**
 * 取得即將開始的活動
 * GET /api/events/upcoming
 */
export async function getUpcomingEvents(req: Request, res: Response) {
  try {
    const events = await getUpcomingEventsService();
    return res.status(200).json({
      success: true,
      message: "即將開始的活動查詢成功",
      data: events,
    });
  } catch (error: any) {
    console.error("❌ getUpcomingEvents 錯誤：", error);
    return res.status(500).json({
      success: false,
      message: "伺服器錯誤，無法取得即將開始的活動",
    });
  }
}
