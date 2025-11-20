import prisma from "../../utils/prisma-only.js";

/**
 * 🔹 取得熱門標籤
 * 計算每個標籤(tag)被活動使用的次數，取前 10 名
 */
export async function getPopularTagsService() {
  try {
    const popularTags = await prisma.eventTag.groupBy({
      by: ["tag_id"],
      _count: { tag_id: true },
      orderBy: { _count: { tag_id: "desc" } },
      take: 10,
    });

    // 再取出對應的標籤名稱
    const tagsWithNames = await Promise.all(
      popularTags.map(async (t: { tag_id: string; _count: { tag_id: number } }) => {  // 替t增加明確型別
        const tag = await prisma.tag.findUnique({
          where: { id: t.tag_id },
          select: { name: true },
        });
        return { tagId: t.tag_id, name: tag?.name, count: t._count.tag_id };
      })
    );

    return tagsWithNames;
  } catch (error) {
    console.error("❌ getPopularTagsService 錯誤：", error);
    throw error;
  }
}

/**
 * 🔹 取得最多人收藏的活動
 * 計算每個活動在 UserFavorite 表中的收藏次數
 */
export async function getMostFavoritedEventsService() {
  try {
    const favorites = await prisma.userFavorite.groupBy({
      by: ["favoritable_id"],
      where: { favoritable_type: "EVENT" },
      _count: { favoritable_id: true },
      orderBy: { _count: { favoritable_id: "desc" } },
      take: 10,
    });

    // 補上活動資訊
    const events = await Promise.all(
      favorites.map(async (f: { favoritable_id: string; _count: { favoritable_id: number } }) => {  // 替t增加明確型別
        const event = await prisma.event.findUnique({
          where: { id: f.favoritable_id },  // favoritable_id 是 string
          select: {
            id: true,
            title: true,
            cover_image: true,
            start_time: true,
            end_time: true,
            location_name: true,
          },
        });
        if (!event) return null;
        return { ...event, favoriteCount: f._count.favoritable_id };
      })
    );

    return events.filter((e: any) => e !== null);  // 替t增加明確型別
  } catch (error) {
    console.error("❌ getMostFavoritedEventsService 錯誤：", error);
    throw error;
  }
}

/**
 * 🔹 取得即將開始的活動
 * 條件：start_time > 現在時間，依時間遞增排序，取前 10 筆
 */
export async function getUpcomingEventsService() {
  try {
    const now = new Date();
    const events = await prisma.event.findMany({
      where: {
        start_time: { gt: now },
        status: "APPROVED", // 只顯示審核通過的活動
      },
      orderBy: { start_time: "asc" },
      take: 10,
      select: {
        id: true,
        title: true,
        cover_image: true,
        start_time: true,
        end_time: true,
        location_name: true,
        category: {
          select: { name: true },
        },
      },
    });

    return events;
  } catch (error) {
    console.error("❌ getUpcomingEventsService 錯誤：", error);
    throw error;
  }
}
