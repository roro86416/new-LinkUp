<<<<<<< HEAD
// service是後端程式之一，其功能是商業邏輯層，進行資料處理、與資料庫互動；在我們的專案就是與Prisma互動: 執行 Prisma 寫入、驗證、錯誤處理

// src/modules/event-ratings/event-ratings.service.ts
import prisma from "../../utils/prisma-only"; // 不要建立新的 new PrismaClient()，用統一的 Prisma Client 實例
import { CreateRatingInput, UpdateRatingInput } from "./event-ratings.schema";

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
=======
import prisma from "../../utils/prisma-only.js";
import { CreateRatingInput, UpdateRatingInput } from "./event-ratings.schema.js";
import { OrderStatus } from "../../generated/prisma/client.js";

/**
 * [核心] 檢查使用者是否有資格評價
 * 邏輯更新：
 * 1. 尚未評價過 (避免重複評價)
 * 2. 擁有該活動的「已使用 (used)」票券 (代表已參加)
 * 3. 該票券所屬的訂單狀態為「已付款 (paid)」或「已完成 (completed)」
 */
export async function checkRatingEligibility(userId: string, eventId: number) {
  console.log(`檢查資格: User=${userId}, Event=${eventId}`);

  try {
    // 1. 檢查是否已評價 (保持不變)
    const existingRating = await prisma.eventRating.findFirst({
      where: { user_id: userId, event_id: eventId },
      select: { id: true }
    });

    if (existingRating) return false;

    // 2. [修正重點] 檢查是否有「符合資格」的訂單
    // 我們直接要求 Prisma 只找 status 為 paid 或 completed 的訂單
    const validOrder = await prisma.order.findFirst({
      where: {
        user_id: userId,
        // [關鍵] 狀態篩選直接寫在這裡！
        // 只要有一筆訂單是 'paid' 或 'completed' 就算有資格
        status: { in: [OrderStatus.paid, OrderStatus.completed] },
        items: {
          some: {
            ticketType: {
              event_id: eventId // 且包含此活動的票
            }
          }
        }
      },
      select: { id: true }

    });

    // 只要 validOrder 存在，就代表有資格 (因為我們已經過濾過狀態了)
    return !!validOrder;

  } catch (error) {
    console.error("檢查評價資格失敗", error);
    return false;
  }
}

/**
 * 建立一筆新的活動評論
 */
export async function createRatingService(data: CreateRatingInput) {
  try {
    // ------------------------------------------------------------
    // [修改] 步驟 1：呼叫共用的檢查邏輯
    // ------------------------------------------------------------
    const isEligible = await checkRatingEligibility(data.userId, data.eventId);

    if (!isEligible) {
      // 為了給使用者更精確的錯誤訊息，我們可以再細分一下原因 (選做)
      // 但為了保持一致性，這裡統一回傳這句
      throw new Error("您尚未取得評價資格（需完成付款且實際參加活動，或您已評價過）。");
    }

    // ------------------------------------------------------------
    // 步驟 2：通過檢查，執行建立評論
    // ------------------------------------------------------------
    const newRating = await prisma.eventRating.create({
      data: {
        event_id: data.eventId,
>>>>>>> origin/main-final
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
<<<<<<< HEAD
  } catch (error) {
=======

  } catch (error: any) {
    // [優化] 特別捕捉 Prisma 的 "Unique Constraint" 錯誤
    if (error.code === 'P2002') {
      throw new Error("您已經評價過此活動囉！");
    }

    // 如果是我們上面拋出的自定義錯誤，直接往上丟
    if (error.message.includes("尚未取得評價資格")) {
      throw error;
    }

>>>>>>> origin/main-final
    console.error("❌ Prisma createRatingService 錯誤：", error);
    throw new Error("資料庫寫入失敗");
  }
}

<<<<<<< HEAD
// =======================================================================
// ✅ 取得特定活動的所有評論 (含使用者資訊)
/*
findMany -> 查出所有符合條件 (event_id = eventId) 的評論
include.user → 關聯 User 表，選取{id, name, avatar}三樣，以便前端顯示「評論者的暱稱與頭像」
orderBy → 最新的評論會排在最上方
*/

=======
>>>>>>> origin/main-final
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
<<<<<<< HEAD
        created_at: "desc", // 依建立時間倒序排列
=======
        created_at: "desc",
>>>>>>> origin/main-final
      },
    });

    return ratings;
  } catch (error) {
    console.error("❌ Prisma getRatingsService 錯誤：", error);
    throw new Error("資料庫查詢失敗");
  }
}

<<<<<<< HEAD

// =======================================================================
// 「修改自己評論」的商業邏輯核心
export async function updateRatingService({ ratingId, data }: UpdateRatingInput) {
  try {
    // 確認評論是否存在
=======
export async function updateRatingService({ ratingId, data }: UpdateRatingInput) {
  try {
>>>>>>> origin/main-final
    const existing = await prisma.eventRating.findUnique({
      where: { id: ratingId },
    });

    if (!existing) {
      throw new Error("找不到該評論");
    }

<<<<<<< HEAD
    // 執行更新
=======
>>>>>>> origin/main-final
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
<<<<<<< HEAD
=======
}

export async function deleteRatingService(ratingId: number, userId: string) {
  try {
    // 1. 先檢查是否存在且屬於該使用者
    const existing = await prisma.eventRating.findUnique({
      where: { id: ratingId },
    });

    if (!existing) throw new Error("找不到該評論");
    if (existing.user_id !== userId) throw new Error("您無權刪除此評論");

    // 2. 執行刪除
    await prisma.eventRating.delete({
      where: { id: ratingId },
    });

    return { success: true };
  } catch (error) {
    console.error("刪除評論失敗", error);
    throw error;
  }
>>>>>>> origin/main-final
}