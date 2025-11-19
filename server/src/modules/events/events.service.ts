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
/**
 * [公開] 獲取單一活動的詳細資料 (用於活動詳細頁)
 * 包含：票種(TicketTypes) 和 週邊商品(Products)
 */
export const getPublicEventById = async (eventId: number) => {
  
  // 1. 執行查詢
  const event = await prisma.event.findUnique({
    where: { 
      id: eventId,
      status: EventStatus.APPROVED, // [!] 確保活動是已批准的
    },
    include: {
      
      // (A) 串聯主辦方 -> 使用者 (為了名稱)
      organizer: { 
        include: {
          user: { 
            select: {
              name: true, 
              avatar: true, // [!] 我們也把主辦方頭像一起抓回來
            }
          }
        }
      },
      // (B) 串聯所有票種 (為了票券列表)
      ticketTypes: { 
        where: {
          sale_end_time: { gt: new Date() } // [!] 只抓取還在販售的票
        },
        orderBy: {
          price: 'asc'
        }
      },
      // (C) [!!!] 串聯「商品連結表 (productLinks)」 -> 「商品 (product)」
      //     這就是您的「商城」資料
      productLinks: { 
        where: {
          product: { 
            is_published: true 
          }
        },
        include: {
          product: {
            include: {
              variants: { 
                where: {
                  stock_quantity: { gt: 0 } 
                },
                orderBy: {
                  price_offset: 'asc' 
                }
              }
            }
          }
        }
      },
    }
  });

  // 2. 如果找不到活動，拋出錯誤
  if (!event) {
    throw new Error("找不到活動或活動未開放");
  }

  // 3. 將 Prisma 回傳的複雜資料，「格式化」成前端需要的樣子
  
  // (A) 格式化主辦方
  const organizerInfo = {
    name: event.organizer?.user?.name || '主辦單位',
    avatar: event.organizer?.user?.avatar || null,
  };

  // (B) 格式化票種
  const formattedTicketTypes = event.ticketTypes.map(tt => ({
    id: tt.id,
    name: tt.name,
    price: tt.price.toNumber(),
    total_quantity: tt.total_quantity,
    sale_end_time: tt.sale_end_time.toISOString(),
  }));

  // (C) 格式化商品 (您的商城)
  const formattedProducts = event.productLinks
    .map(link => link.product) // 取出 product 物件
    .filter(product => product != null) // 過濾掉 product == null 的情況
    .map(product => ({
      // (基本商品資料)
      id: product!.id,
      name: product!.name,
      description: product!.description,
      base_price: product!.base_price.toNumber(),
      image_url: product!.image_url,

      // [!] 補上 "variants" 欄位
      variants: product!.variants.map(v => ({
        id: v.id,
        option1_value: v.option1_value,
        option2_value: v.option2_value,
        price_offset: v.price_offset.toNumber(),
        stock_quantity: v.stock_quantity,
      })),
    }));

  // 4. 組合並回傳最終資料
  return {
    // (活動主要資料)
    id: event.id,
    title: event.title,
    subtitle: event.subtitle,
    description: event.description,
    cover_image: event.cover_image,
    start_time: event.start_time.toISOString(),
    end_time: event.end_time.toISOString(),
    location_name: event.location_name,
    address: event.address,
    organizer: organizerInfo,
    ticketTypes: formattedTicketTypes,
    products: formattedProducts, 
  };
};