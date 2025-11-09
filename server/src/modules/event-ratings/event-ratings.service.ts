// service是後端程式之一，其功能是商業邏輯層，進行資料處理、與資料庫互動；在我們的專案就是與Prisma互動: 執行 Prisma 寫入、驗證、錯誤處理

// src/modules/event-ratings/event-ratings.service.ts
import prisma from "../../utils/prisma-only"; // 不要建立新的 new PrismaClient()，用統一的 Prisma Client 實例
import { CreateRatingInput } from "./event-ratings.schema";

/**
 * 建立一筆新的活動評論
 * @param data 評論內容（來自 controller 層）
 * 
*/
// 說明:
// `prisma.rating.create()` | 用 Prisma 建立一筆新的評論
// `data: {...}`            | 寫入欄位（對應你的資料表 schema）
// `include`                | 一次查出關聯的 user、event，方便回傳前端時顯示
// `try / catch`            | 捕捉資料庫錯誤並統一丟回給 controller 處理

export async function createRatingService(data: CreateRatingInput) {
  try {
    const newRating = await prisma.eventRating.create({
      data: {
        event_id: data.eventId, // 這些data {...} 裏頭key「鍵」的名稱(如eventID, userID, score, comment)，必須schema.prisma 裡 model (EventRating)的欄位名稱完全一致。在 model EventRating裡定義的是 event_id，那你就必須寫成 event_id（不是 eventId）。
        user_id: data.userId,
        rating: data.score,
        comment: data.comment,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        event: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return newRating;
  } catch (error) {
    console.error("❌ Prisma createRatingService 錯誤：", error);
    throw new Error("資料庫寫入失敗");
  }
}
