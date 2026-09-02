// server/src/modules/event-stats/event-stats.schema.ts
import { z } from "zod";

/*
1. 「熱門標籤 / 即將開始 / 熱門活動 / 最多人收藏」這幾支 GET 類型、都屬於首頁或推薦區的『活動統計/排行榜』功能，放在同一個模組（event-stats）比分散到 event-search 更合理，也方便共用排序、分頁與 cache 機制
2. GET 系列通常開放公開（public），不須 JWT；PATCH /.../view 通常也是公開（由前端頁面在打開活動頁時呼叫）。但你日後可以考慮再加上rate-limit 或在中間層限制避免刷流量
3. (25/11/12) PATCH /api/events/:eventId/view因為schema.prisma沒有任何點閱數views欄位，也沒有EventView資料表，暫不實作
4. (25/11/12) GET /api/events/popular保留架構但暫不實作，理由同3.
*/

/**
 * 共通分頁
skip / take 是 Prisma 的分頁機制，對應前端無限滾動或「下一頁 / 上一頁」功能。一次只取20筆，不一次查整個資料庫，效率較好
    take：一次取幾筆（例如 20 筆活動卡片）
    skip：跳過前幾筆（例如已經載入 20 筆後，下次再 skip=20、take=20）
因為以下4支 API 幾乎都會用到pagination，故把分頁寫在 schema 最上方做為「共通物件」
 */
const pagination = {
  skip: z
    .preprocess((v) => (v ? Number(v) : 0), z.number().int().min(0))
    .optional(),
  take: z
    .preprocess((v) => (v ? Number(v) : 20), z.number().int().positive())
    .optional(),
};

/**
 * 1) GET /api/events/popular
 * - 可接受 period(可選: all / 7d / 30d)、category(可選)、skip/take
 */
// export const getPopularSchema = z.object({
//   query: z.object({
//     period: z.enum(["all", "7d", "30d"]).optional(), // 前端可傳 period 篩選（最近7天／30天／全部）
//     category: z.preprocess((v) => (v ? Number(v) : undefined), z.number().int().optional()),
//     ...pagination,
//   }),
// });
// export type GetPopularQuery = z.infer<typeof getPopularSchema.shape.query>;

/**
 * 2) GET /api/events/favorites
 * - 取得依收藏人數排序的活動
 * - 支援 category, skip, take
 */
export const getFavoritesSchema = z.object({
  query: z.object({
    category: z.preprocess((v) => (v ? Number(v) : undefined), z.number().int().optional()),
    ...pagination,
  }),
});
export type GetFavoritesQuery = z.infer<typeof getFavoritesSchema.shape.query>;

/**
 * 3) GET /api/events/tags
 * - 取得熱門標籤（依使用次數排序）
 * - 支援 limit（取前幾名）
 */
export const getTagsSchema = z.object({
  query: z.object({
    limit: z.preprocess((v) => (v ? Number(v) : 10), z.number().int().positive()).optional(),
  }),
});
export type GetTagsQuery = z.infer<typeof getTagsSchema.shape.query>;

/**
 * 4) GET /api/events/upcoming
 * - 取得即將開始的活動（可選：from, to 範圍；或 preset token）
 */
export const getUpcomingSchema = z.object({
  query: z.object({
    from: z.coerce.date().optional(), // ISO string 也可以被 coerce 成 Date
    to: z.coerce.date().optional(),
    skip: pagination.skip,
    take: pagination.take,
  }),
});
export type GetUpcomingQuery = z.infer<typeof getUpcomingSchema.shape.query>;

/**
 * 5) PATCH /api/events/:eventId/view
 * - 只需要 path param eventId

export const patchViewSchema = z.object({
  params: z.object({
    eventId: z.preprocess((v) => Number(v), z.number().int().positive()),
  }),
});
export type PatchViewParams = z.infer<typeof patchViewSchema.shape.params>;
*/