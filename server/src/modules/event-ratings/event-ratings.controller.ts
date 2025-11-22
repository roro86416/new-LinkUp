/*
controller是後端程式之一，其功能顧名思義是控制器，接收請求req與回傳結果res
Controller 不直接動資料庫，只負責：
1. 驗證資料
2. 呼叫 service
3. 控制輸出格式（回傳成功或失敗）
*/

// src/modules/event-ratings/event-ratings.controller.ts
import { Request, Response } from "express";
import {
  createRatingSchema,
  getRatingsSchema,
  updateRatingSchema,
} from "./event-ratings.schema.js";
import {
  createRatingService,
  getRatingsService,
  updateRatingService,
  checkRatingEligibility,
  deleteRatingService,
} from "./event-ratings.service.js";

/**
 * 新增活動評論
 * 路由：POST /api/ratings

說明
`ratingSchema.parse(req.body)` -> 驗證前端送來的 JSON 資料格式（用 Zod）
`createRatingService(parsed)`  -> 呼叫下一層的商業邏輯
`res.status(201).json(...)`    -> 回傳 JSON 給前端
錯誤處理區塊                    -> 捕捉 Zod 驗證錯誤與伺服器錯誤
*/
export async function createRating(req: Request, res: Response) {
  try {
    const parsed = createRatingSchema.parse(req.body);
    const newRating = await createRatingService(parsed);

    res.status(201).json({
      message: "✅ 評論新增成功",
      data: newRating,
    });
  } catch (error: any) {
    console.error("❌ createRating 錯誤：", error);

    if (error.name === "ZodError") {
      return res.status(400).json({
        message: "資料格式錯誤",
        errors: error.errors,
      });
    }

    // [關鍵修正] 判斷是否為一般的 Error (包含 Service 拋出的資格錯誤)
    // 我們回傳 400 (Bad Request) 並帶上錯誤訊息
    if (error instanceof Error) {
      return res.status(400).json({
        message: error.message // 這就會是 "您尚未取得評價資格..."
      });
    }

    res.status(500).json({
      message: "伺服器內部錯誤，評論新增失敗",
    });
  }
}
// =================================================
// ✅ 取得特定活動的所有評論 GET /api/ratings/:eventId
/*
說明
`getRatingsSchema.parse` -> 檢查 URL 中的 :eventId 是否為合法數字
`getRatingsService(eventId)`  -> 稍後會在 service 層實作，負責實際去查資料庫
回傳格式統一：
  成功時 → { success: true, data: [...] }
  失敗時 → { success: false, message: "..." }
*/
export async function getRatings(req: Request, res: Response) {
  try {
    // 驗證路徑參數
    const parsed = getRatingsSchema.parse({
      params: req.params,
    });

    const { eventId } = parsed.params;

    // 呼叫service層，查詢評論
    const ratings = await getRatingsService(eventId);

    return res.status(200).json({
      success: true,
      data: ratings,
    });
  } catch (error: any) {
    console.error("❌ getRatings 錯誤：", error);

    // Zod 驗證錯誤
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "參數格式錯誤",
        errors: error.errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: "伺服器錯誤，無法取得評論資料",
    });
  }
}

// =================================================
// PATCH /api/ratings/:Id
/*
這裡使用 updateRatingSchema 來同時驗證：
  req.params → URL 中的 :ratingId
  req.body → 要修改的內容
驗證沒問題後，交給下一步的 service 層 (updateRatingService) 處理資料庫更新。
*/
export async function updateRating(req: Request, res: Response) {
  try {
    // 驗證路由參數 + body
    const parsed = updateRatingSchema.parse({
      params: req.params,
      body: req.body,
    });

    const { ratingId } = parsed.params;
    const { rating, comment } = parsed.body;

    const updatedRating = await updateRatingService({
      ratingId: Number(ratingId),
      data: { rating, comment },
    });

    return res.status(200).json({
      success: true,
      message: "評論已成功更新",
      data: updatedRating,
    });
  } catch (error: any) {
    console.error("❌ updateRating 錯誤：", error);

    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "資料格式錯誤",
        errors: error.errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: "伺服器內部錯誤，評論更新失敗",
    });
  }
}
/**
 * [新增] 檢查評價資格 API
 * GET /api/v1/events/:id/can-review
 */
export async function checkCanReview(req: Request, res: Response) {
  try {
    const eventId = Number(req.params.id);
    // 假設透過 verifyToken 中介軟體，user 會被放在 req.body.user 或 req.user
    // 這裡我們先假設您會傳入 user_id (或者從 token 解析)
    // 為了方便前端 apiClient 呼叫，我們從 query 讀取 user_id (較簡單) 或從 middleware (較安全)

    // 這裡配合前端 apiClient 傳送的方式，假設是透過 verifyToken 解析出的 (req as any).user
    // 如果您的路由沒有掛 verifyToken，我們就從 Query String 拿 (僅供測試，正式建議用 Token)
    const userId = (req as any).user?.userId || req.query.user_id as string;

    if (!userId || isNaN(eventId)) {
      return res.json({ canReview: false });
    }

    const canReview = await checkRatingEligibility(userId, eventId);

    res.json({ status: "success", canReview });
  } catch (error) {
    console.error("檢查資格錯誤", error);
    res.json({ status: "error", canReview: false });
  }
}

export async function deleteRating(req: Request, res: Response) {
  try {
    const ratingId = parseInt(req.params.ratingId);
    // 假設有 auth middleware，從 req.user 拿 ID (或從 query/body 拿，視您的實作)
    const userId = (req as any).user?.userId || req.body.userId;

    await deleteRatingService(ratingId, userId);

    res.status(200).json({ message: "✅ 評論已刪除" });
  } catch (error: any) {
    console.error("❌ deleteRating 錯誤：", error);
    res.status(500).json({ message: error.message || "刪除失敗" });
  }
}