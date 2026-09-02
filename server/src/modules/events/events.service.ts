import prisma from "../../utils/prisma-only.js";
import { EventStatus } from "../../generated/prisma/client.js";

/**
 * 獲取公開的活動列表 (用於首頁)
 * [修改] 加入 category 的關聯查詢
 */
export const listPublicEvents = async (
  type: string, 
  limit: number = 10,
  categoryId?: number,
  region?: string
) => {
  
  const queryOptions: any = {
    where: { 
      status: EventStatus.APPROVED 
    },
    take: limit,
    orderBy: {},
    include: {
      organizer: { 
        include: {
          user: { select: { name: true } }
        }
      },
      ticketTypes: { 
        orderBy: { price: 'asc' },
        take: 1,
      },
      // [新增] 這裡要抓取 category
      category: {
        select: { id: true, name: true }
      }
    }
  };

  if (categoryId) {
    queryOptions.where.category_id = categoryId;
  }
  if (region && region !== '全部') {
    // 處理 "台" vs "臺" 的異體字
    const keywords = [region];
    if (region.includes('台')) keywords.push(region.replace('台', '臺'));
    if (region.includes('臺')) keywords.push(region.replace('臺', '台'));

    // 只要地址或地點名稱包含 "任一" 關鍵字即可
    queryOptions.where.OR = keywords.flatMap(kw => [
      { location_name: { contains: kw } },
      { address: { contains: kw } }
    ]);
  }
  if (type === 'popular') {
    queryOptions.orderBy = { start_time: 'asc' };
  } else if (type === 'new') {
    queryOptions.orderBy = { created_at: 'desc' };
  } else {
    queryOptions.orderBy = { start_time: 'asc' };
  }

  const events = await prisma.event.findMany(queryOptions);

  const formattedEvents = events.map(event => {
    const price = event.ticketTypes[0]?.price.toNumber() || 0;
    const organizerName = event.organizer?.user?.name || '主辦單位';

    return {
      id: event.id,
      title: event.title,
      start_time: event.start_time.toISOString(),
      location_name: event.location_name,
      cover_image: event.cover_image,
      organizerName: organizerName,
      price: price,
      // [新增] 回傳類別資料
      category: event.category 
    };
  });

  return formattedEvents;
};

/**
 * [公開] 獲取單一活動的詳細資料 (用於活動詳細頁)
 * [修改] 加入 category 的關聯查詢
 */
export const getPublicEventById = async (eventId: number) => {
  
  const event = await prisma.event.findUnique({
    where: { 
      id: eventId,
      status: EventStatus.APPROVED,
    },
    include: {
      // [新增] 關鍵修改：抓取 category 資料
      category: {
        select: { id: true, name: true }
      },
      organizer: { 
        include: {
          user: { 
            select: { name: true, avatar: true }
          }
        }
      },
      ticketTypes: { 
        where: { sale_end_time: { gt: new Date() } },
        orderBy: { price: 'asc' }
      },
      productLinks: { 
        where: { product: { is_published: true } },
        include: {
          product: {
            include: {
              variants: { 
                where: { stock_quantity: { gt: 0 } },
                orderBy: { price_offset: 'asc' }
              }
            }
          }
        }
      },
      ratings: {
        include: {
          user: { select: { name: true, avatar: true } } // 抓取評價者的名字和頭像
        },
        orderBy: { created_at: 'desc' } // 新的評價在前面
      }
    }
  });

  if (!event) {
    throw new Error("找不到活動或活動未開放");
  }

  const organizerInfo = {
    name: event.organizer?.user?.name || '主辦單位',
    avatar: event.organizer?.user?.avatar || null,
  };

  const formattedTicketTypes = event.ticketTypes.map(tt => ({
    id: tt.id,
    name: tt.name,
    price: tt.price.toNumber(),
    total_quantity: tt.total_quantity,
    sale_end_time: tt.sale_end_time.toISOString(),
  }));

  const formattedProducts = event.productLinks
    .map(link => link.product)
    .filter(product => product != null)
    .map(product => ({
      id: product!.id,
      name: product!.name,
      description: product!.description,
      base_price: product!.base_price.toNumber(),
      image_url: product!.image_url,
      variants: product!.variants.map(v => ({
        id: v.id,
        option1_value: v.option1_value,
        option2_value: v.option2_value,
        price_offset: v.price_offset.toNumber(),
        stock_quantity: v.stock_quantity,
      })),
    }));
    const formattedReviews = event.ratings.map(r => ({
    id: r.id,
    user_id: r.user_id, // [新增] 這行很重要！
    user_name: r.user.name,
    user_avatar: r.user.avatar,
    rating: r.rating,
    comment: r.comment,
    created_at: r.created_at.toISOString().split('T')[0],
  }));
  const totalRating = event.ratings.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = event.ratings.length > 0 
    ? parseFloat((totalRating / event.ratings.length).toFixed(1)) 
    : 0;

  return {
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
    category: event.category, 
    reviews: formattedReviews,
    rating_average: averageRating,
    rating_count: event.ratings.length,
  };
};

/**
 * [新增] 獲取所有活動類別
 */
export const getAllCategories = async (limit?: number) => {
  const categories = await prisma.category.findMany({
    take: limit,
    orderBy: { id: 'asc' },
  });
  return categories;
};