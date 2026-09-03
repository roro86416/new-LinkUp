// server/src/modules/event-search/event-search.controller.ts
// 控制器不直接寫查詢邏輯，而是委派給 searchEventsService()
import { Request, Response } from "express";
import { searchEventsSchema } from "./event-search.schema.js";
import { searchEventsService } from "./event-search.service.js";

/**
 * @desc 搜尋活動
 * @route GET /api/events/search
 */
export async function searchEvents(req: Request, res: Response) {
  try {
    const filters = searchEventsSchema.parse(req.query);  // 驗證查詢參數(query) -> 對應schema裡的各種篩選條件，如 keyword、categoryId、date、priceType、type、region等
    const results = await searchEventsService(filters);  // ✅ 呼叫 service 層,執行搜尋邏輯

    // ✅ 自動根據結果筆數調整 message
    const message =
      results.length > 0
        ? "搜尋成功"
        : "目前沒有符合條件的活動";

    return res.status(200).json({
      success: true,
      message,
      count: results.length,
      data: results,
    });
  } catch (error: any) {
    console.error("❌ searchEvents 錯誤：", error);
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "查詢參數格式錯誤",
        errors: error.errors,
      });
    }
    return res.status(500).json({
      success: false,
      message: "伺服器內部錯誤",
    });
  }
}
