// schema是驗證層 (Zod)，負責驗證輸入資料格式，比如在event-ratings的schema.ts，作用就是定義評論與評分資料的格式
// src/modules/event-ratings/event-ratings.schema.ts
import { z } from "zod";

/**
 * 活動評論與評分的資料驗證
 * - eventId: 所屬活動 ID
 * - userId: 發表評論的會員 ID
 * - score: 評分 (1~5)
 * - comment: 評論文字（選填）
 */

/*
說明：
z.object()：建立一個物件驗證規則。 ->所以這裡共有4個物件：eventId, userId, score, comment
.int()：只允許整數。
.min() / .max()：限制分數範圍。
.optional()：代表欄位可以不填。
z.infer<>：讓 TypeScript 自動推導型別，方便之後在 service 層使用。
*/


export const createRatingSchema = z.object({
  eventId: z.number().int().positive({
    message: "eventId 必須是正整數",
  }),
  userId: z.string({
    message: "userId 必須是正整數",
  }),
  score: z
    .number()
    .min(1, { message: "評分不能低於 1 分" })
    .max(5, { message: "評分不能高於 5 分" }),
  comment: z
    .string()
    .max(191, { message: "評論文字不能超過 191 字" })
    .optional(),
});


// ✅ 驗證查詢活動評論的路徑參數
// 已有的 createRatingSchema 可留著 -> export const createRatingSchema = ...
export const getRatingsSchema = z.object({
  params: z.object({ 
    eventId: z
      .string()
      .regex(/^\d+$/, "eventId 必須是數字")
      .transform((val) => Number(val)), // 轉成 number
  }),
});
/*
params：用來驗證 Express 的路由參數 /api/ratings/:eventId
.regex(/^\d+$/)：確保傳入的 eventId 是純數字
.transform(Number)：自動轉成 number，供後端使用
GetRatingsParams：是我們之後 controller 與 service 會用到的型別
*/

// 編修自己的評論
export const updateRatingSchema = z.object({
  params: z.object({
    ratingId: z
      .string()
      .regex(/^\d+$/, { message: "評論 ID 必須是數字" }),
  }),
  body: z.object({
    rating: z
      .number()
      .min(1, { message: "星等不得低於 1" })
      .max(5, { message: "星等不得高於 5" })
      .optional(),
    comment: z
      .string()
      .max(191, { message: "評論文字不能超過 191 字" })
      .optional(),
  }),
});

// TypeScript 型別定義（給 service 層使用）
export type CreateRatingInput = z.infer<typeof createRatingSchema>;
export type GetRatingsParams = z.infer<typeof getRatingsSchema>["params"];
export type UpdateRatingInput = {
  ratingId: number; // URL 參數中的 ID
  data: {
    rating?: number;
    comment?: string;
  };
};