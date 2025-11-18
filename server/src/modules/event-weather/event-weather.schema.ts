// server/src/modules/event-weather/event-weather.schema.ts
import { z } from "zod";

/**
 * GET /api/events/:eventId/weather
 * 只需要驗證路徑參數 eventId（正整數）
 */
export const getEventWeatherSchema = z.object({
  params: z.object({
    eventId: z.preprocess((v) => {
      // 允許傳 string -> 強制轉 number：z.preprocess把URL的字串 :eventId 轉成 number，避免在controller還要自行parse
      if (typeof v === "string" && v.trim() !== "") return Number(v);
      return v;
    }, z.number().int().positive()),
  }),
});
export type GetEventWeatherParams = z.infer<typeof getEventWeatherSchema.shape.params>;

/**
 * (可選) GET /api/weather/forecast?lat=...&lng=...&days=...
 * 如果未來做獨立 forecast endpoint，可同時使用這個 schema
 */
export const getForecastSchema = z.object({
  query: z.object({
    lat: z.preprocess((v) => (v ? Number(v) : v), z.number()).optional(),
    lng: z.preprocess((v) => (v ? Number(v) : v), z.number()).optional(),
    days: z.preprocess((v) => (v ? Number(v) : 3), z.number().int().min(1).max(7)).optional(),
  }),
});
export type GetForecastQuery = z.infer<typeof getForecastSchema.shape.query>;
