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

  } catch (error: any) {
    // [優化] 特別捕捉 Prisma 的 "Unique Constraint" 錯誤
    if (error.code === 'P2002') {
      throw new Error("您已經評價過此活動囉！");
    }

    // 如果是我們上面拋出的自定義錯誤，直接往上丟
    if (error.message.includes("尚未取得評價資格")) {
      throw error;
    }

    console.error("❌ Prisma createRatingService 錯誤：", error);
    throw new Error("資料庫寫入失敗");
  }
}

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
        created_at: "desc",
      },
    });

    return ratings;
  } catch (error) {
    console.error("❌ Prisma getRatingsService 錯誤：", error);
    throw new Error("資料庫查詢失敗");
  }
}

export async function updateRatingService({ ratingId, data }: UpdateRatingInput) {
  try {
    const existing = await prisma.eventRating.findUnique({
      where: { id: ratingId },
    });

    if (!existing) {
      throw new Error("找不到該評論");
    }

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
}