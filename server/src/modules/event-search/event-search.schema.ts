import { z } from "zod";

export const searchEventsSchema = z.object({
  keyword: z.string().optional(),  // 🔍 關鍵字搜尋 (optional)
  category_id: z.coerce.number().optional(),  // 🎨 分類 ID
  region: z.string().optional(),  // 📍 地區關鍵字
  date: z.enum([  // 🕓 日期篩選 (token-based)
    // 前端只允許傳這幾種字串作為日期篩選條件（token），確保輸入值合法，後端不會收到奇怪的 date 值。例如：/api/events/search?date=this_week，或/api/events/search?date=custom&from=2025-11-01&to=2025-11-10 自訂時間才允許傳入 from / to
    "custom", "today", "tomorrow", "this_week", "this_weekend", "next_week", "next_weekend"
  ]).optional(),  
  startDate: z.coerce.date().optional(), // z.coerce.date() 允許字串、自動轉成 JS Date 物件。
  endDate: z.coerce.date().optional(),
  price: z.enum(["free", "paid"]).optional(), // 💰 價格篩選
  type: z.enum(["ONLINE", "OFFLINE"]).optional(), // 🌐 活動型態 (線上/線下)
  skip: z.coerce.number().default(0), // 📄 分頁
  take: z.coerce.number().default(10),
});

// 匯出 TypeScript 型別供 service 使用
export type SearchEventsInput = z.infer<typeof searchEventsSchema>;
