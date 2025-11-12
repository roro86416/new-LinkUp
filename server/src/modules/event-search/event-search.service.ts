// server/src/modules/event-search/event-search.service.ts
import prisma from "../../utils/prisma-only.js";
import { getDateRange } from "../../utils/dateRange.js";
// import { getDateRange } from "../../utils/index.js";
import { SearchEventsInput } from "./event-search.schema.js";

/**
 * 搜尋活動
 * @param filters 來自 searchEventsSchema 驗證後的查詢參數
 */
export async function searchEventsService(filters: SearchEventsInput) {
  try {
    const {
      keyword,
      category,
      region,
      date,
      startDate,
      endDate,
      price,
      type,
      skip = 0,
      take = 10,
    } = filters;

    // --- 組成查詢條件 ---
    const whereClause: any = { AND: [] };

    // 🔍 關鍵字搜尋 (活動名稱 / 副標題 / 描述 / 地點 / 主辦單位 / 標籤)
    if (keyword) {
      whereClause.OR = [
        { title: { contains: keyword } },
        { subtitle: { contains: keyword } },
        { description: { contains: keyword } },
        { location_name: { contains: keyword } },
        { organizer: { org_name: { contains: keyword } } },
        {
          tags: {
            some: {
              tag: { name: { contains: keyword } },
            },
          },
        },
      ];
    }

    // 🎟️ 類別篩選
        if (category) {
          whereClause.category_id = Number(category);
        }

    // 📍 地區篩選
    if (region) {
      whereClause.address = { contains: region };
    }

    // 🕒 日期篩選
    if (date) {
      const range = getDateRange(date, startDate, endDate);
      if (range) {
        whereClause.AND.push({
          start_time: { gte: range.start },
        });
        whereClause.AND.push({
          end_time: { lte: range.end },
        });
      }
    }

    // 💰 價格篩選（免費 or 付費）
    if (price === "free") {
      whereClause.ticketTypes = { some: { price: 0 } };
    } else if (price === "paid") {
      whereClause.ticketTypes = { some: { price: { gt: 0 } } };
    }

    // 🧭 活動類型（線上 / 線下）
    if (type) {
      whereClause.event_type = type.toUpperCase(); // 確保符合 enum EventType
    }

    // --- 執行查詢 ---
    const events = await prisma.event.findMany({
      where: whereClause,
      include: {
        organizer: {
          select: { org_name: true },
        },
        category: {
          select: { name: true },
        },
        tags: {
          select: { tag: { select: { name: true } } },
        },
      },
      orderBy: { start_time: "asc" },
      skip: Number(skip),
      take: Number(take),
    });

    return events;
  } catch (error: any) {
    console.error("❌ searchEventsService 錯誤：", error);
    throw new Error("伺服器內部錯誤，活動搜尋失敗");
  }
}
