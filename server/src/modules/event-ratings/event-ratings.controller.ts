/*
controller是後端程式之一，其功能顧名思義是控制器，接收請求req與回傳結果res
Controller 不直接動資料庫，只負責：
1. 驗證資料
2. 呼叫 service
3. 控制輸出格式（回傳成功或失敗）
*/

// src/modules/event-ratings/event-ratings.controller.ts
import { Request, Response } from "express";
import { createRatingSchema } from "./event-ratings.schema";
import { createRatingService } from "./event-ratings.service";

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
