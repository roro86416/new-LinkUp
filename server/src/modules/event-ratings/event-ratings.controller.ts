/*
controller是後端程式之一，其功能顧名思義是控制器，接收請求req與回傳結果res
Controller 不直接動資料庫，只負責：
1. 驗證資料
2. 呼叫 service
3. 控制輸出格式（回傳成功或失敗）
*/

// src/modules/event-ratings/event-ratings.controller.ts
import { Request, Response } from "express";
// 評論控制器：新增、取用、更新、刪除評論控制器
import {
  createRatingSchema,
  getRatingsSchema,
  updateRatingSchema,
  deleteRatingSchema
} from "./event-ratings.schema.js";
import {
  createRatingService,
  getRatingsService,
  updateRatingService,
  deleteRatingService
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
    // Step 1️⃣ 驗證前端送來的資料格式(用Zod)
    const parsed = createRatingSchema.parse(req.body);

    // Step 2️⃣ 呼叫 service 處理資料庫寫入
    const newRating = await createRatingService(parsed);

    // Step 3️⃣ 回傳成功訊息
    res.status(201).json({
      message: "✅ 評論新增成功",
      data: newRating,
    });
  } catch (error: any) {
    // Step 4️⃣ 捕捉錯誤（包含 Zod 驗證錯誤）
    console.error("❌ createRating 錯誤：", error);

    if (error.name === "ZodError") {
      return res.status(400).json({
        message: "資料格式錯誤",
        errors: error.errors,
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
    const result = await getRatingsService(Number(eventId));

    return res.status(200).json({
      success: true,
      message: "成功取得評論資料",
      averageRating: result.averageRating, // ⭐ 新增平均分數
      data: result.ratings,
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

// =================================================
// DELETE /api/ratings/:id
export async function deleteRating(req: Request, res: Response) {
  try {
    // 驗證 URL 參數
    const parsed = deleteRatingSchema.parse({
      params: req.params,
    });

    const { ratingId } = parsed.params;

    // 呼叫 service 執行刪除
    await deleteRatingService(ratingId);

    return res.status(200).json({
      success: true,
      message: "評論已成功刪除",
    });
  } catch (error: any) {
    console.error("❌ deleteRating 錯誤：", error);

    // Zod 驗證錯誤
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "資料格式錯誤",
        errors: error.errors,
      });
    }

    // 找不到評論
    if (error.message === "NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "找不到該評論",
      });
    }

    // 其他未預期錯誤
    return res.status(500).json({
      success: false,
      message: "伺服器內部錯誤，評論刪除失敗",
    });
  }
}