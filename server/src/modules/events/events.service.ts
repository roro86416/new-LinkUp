import prisma from "../../utils/prisma-only.js";
import { EventStatus } from "../../generated/prisma/client.js";

/**
 * 獲取公開的活動列表 (用於首頁)
 * [修改] 加入 category 的關聯查詢
 */
export const listPublicEvents = async (
  type: string, 
  limit: number = 10,
  categoryId?: number
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
    // [新增] 回傳類別物件
    category: event.category, 
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