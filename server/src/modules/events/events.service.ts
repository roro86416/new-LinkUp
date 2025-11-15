import prisma from "../../utils/prisma-only.js";
import { EventStatus } from "../../generated/prisma/client.js";

/**
 * 獲取公開的活動列表 (用於首頁)
 * 這裡會自動 JOIN 取得主辦方名稱和最低票價
 */
export const listPublicEvents = async (
  type: string, 
  limit: number = 10
) => {
  
  // 1. 設定 Prisma 查詢條件
  const queryOptions = {
    // [!] 只抓取已批准 (APPROVED) 的活動
    where: { 
      status: EventStatus.APPROVED 
    },
    take: limit, // 取得指定的數量
    // [!] 決定排序方式
    orderBy: {},
    // [!] 串聯 (JOIN) 相關的資料表
    include: {
      organizer: { // 為了抓主辦方名稱
        include: {
          user: { // 需要 JOIN 兩層
            select: {
              name: true, // 只選取 name 欄位
            }
          }
        }
      },
      ticketTypes: { // 為了抓最低價格
        orderBy: {
          price: 'asc' as const, // 價格由低到高排序
        },
        take: 1, // 只抓取第一筆 (也就是最低價)
      }
    }
  };

  // 2. 根據 'type' 參數動態調整排序
  if (type === 'popular') {
    // (範例) 假設熱門是看 "start_time" (近期)
    queryOptions.orderBy = { start_time: 'asc' };
  } else if (type === 'new') {
    // (範例) 假設最新是看 "created_at"
    queryOptions.orderBy = { created_at: 'desc' };
  } else {
    // 預設排序
    queryOptions.orderBy = { start_time: 'asc' };
  }

  // 3. 執行查詢
  const events = await prisma.event.findMany(queryOptions);

  // 4. 將 Prisma 回傳的複雜資料，「格式化」成前端 EventCard 需要的樣子
  const formattedEvents = events.map(event => {
    // 處理價格 (如果活動沒有票券，價格為 0)
    const price = event.ticketTypes[0]?.price.toNumber() || 0;
    // 處理主辦方名稱 (如果 user 被刪除，給個預設值)
    const organizerName = event.organizer?.user?.name || '主辦單位';

    return {
      id: event.id,
      title: event.title,
      start_time: event.start_time.toISOString(), // 轉換為 ISO 字串
      location_name: event.location_name,
      cover_image: event.cover_image,
      organizerName: organizerName,
      price: price
    };
  });

  return formattedEvents;
};