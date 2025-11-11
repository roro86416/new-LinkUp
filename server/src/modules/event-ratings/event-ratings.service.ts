// service是後端程式之一，其功能是商業邏輯層，進行資料處理、與資料庫互動；在我們的專案就是與Prisma互動: 執行 Prisma 寫入、驗證、錯誤處理

// src/modules/event-ratings/event-ratings.service.ts
import prisma from "../../utils/prisma-only.js"; // 不要建立新的 new PrismaClient()，用統一的 Prisma Client 實例
import { CreateRatingInput, UpdateRatingInput } from "./event-ratings.schema.js";

/**
 * @param data 評論內容（來自 controller 層）
說明:
`prisma.rating.create()` | 用 Prisma 建立一筆新的評論
`data: {...}`            | 寫入欄位（對應你的資料表 schema）
`include`                | 一次查出關聯的 user、event，方便回傳前端時顯示
`try / catch`            | 捕捉資料庫錯誤並統一丟回給 controller 處理
*/

// 建立一筆新的活動評論
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

// =======================================================================
// ✅ 取得特定活動的所有評論 (含使用者資訊)
/*
findMany -> 查出所有符合條件 (event_id = eventId) 的評論
include.user → 關聯 User 表，選取{id, name, avatar}三樣，以便前端顯示「評論者的暱稱與頭像」
orderBy → 最新的評論會排在最上方
*/

export async function getRatingsService(eventId: number) {
  try {
    const ratings = await prisma.eventRating.findMany({
      where: { event_id: eventId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        created_at: "desc", // 依建立時間倒序排列
      },
    });

    return ratings;
  } catch (error) {
    console.error("❌ Prisma getRatingsService 錯誤：", error);
    throw new Error("資料庫查詢失敗");
  }
}


// =======================================================================
// 「修改自己評論」的商業邏輯核心
export async function updateRatingService({ ratingId, data }: UpdateRatingInput) {
  try {
    // 確認評論是否存在
    const existing = await prisma.eventRating.findUnique({
      where: { id: ratingId },
    });

    if (!existing) {
      throw new Error("找不到該評論");
    }

    // 執行更新
    const updated = await prisma.eventRating.update({
      where: { id: ratingId },
      data: {
        rating: data.rating,
        comment: data.comment,
        updated_at: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return updated;
  } catch (error: any) {
    console.error("❌ Prisma updateRatingService 錯誤：", error);
    throw new Error("資料庫寫入失敗");
  }
}

// =======================================================================
// 🧩 刪除評論 Service
export async function deleteRatingService(ratingId: number) {
  try {
    // 1️⃣ 確認該評論是否存在
    const existingRating = await prisma.eventRating.findUnique({
      where: { id: ratingId },
    });

    if (!existingRating) {
      // 拋出錯誤給 controller 捕捉
      throw new Error("NOT_FOUND");
    }

    // 2️⃣ 刪除評論
    await prisma.eventRating.delete({
      where: { id: ratingId },
    });

    // 回傳成功訊息
    return true;
  } catch (error) {
    console.error("❌ Prisma deleteRatingService 錯誤：", error);
    throw error;
  }
}