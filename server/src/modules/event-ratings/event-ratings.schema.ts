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
    .max(500, { message: "評論文字不能超過 500 字" })
    .optional(),
});

// TypeScript 型別定義（給 service 層使用）
export type CreateRatingInput = z.infer<typeof createRatingSchema>;
