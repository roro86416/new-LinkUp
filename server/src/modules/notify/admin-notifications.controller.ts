import { Request, Response, NextFunction } from 'express';
import prisma, { Prisma, NotificationType } from "../../utils/prisma-only.js";
import { createNotificationService } from './notifications.service.js';

// 輔助函式，用來包裝非同步 controller，自動捕捉錯誤並傳遞給 next()
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };

// 建立一個從前端中文類型到後端英文類型的映射
const typeMappingToDb: { [key: string]: string } = {
  '活動提醒': 'event',
  '報名成功': 'transaction',
  '系統公告': 'announcement',
  '活動變更': 'event', // 假設活動變更也屬於 'event' 類型
};

// 建立一個從後端英文類型到前端中文類型的反向映射
const typeMappingFromDb: { [key: string]: string } = {
  'event': '活動提醒', // 注意：這裡可能需要更精確的邏輯來區分 '活動提醒' 和 '活動變更'
  'transaction': '報名成功',
  'announcement': '系統公告',
  'system': '系統公告', // 假設 system 也對應到系統公告
};

/**
 * [Admin] 處理 GET /api/admin/notifications 請求
 */
export const getAdminNotificationsController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const page = parseInt(req.query.page as string) || 1;
 const limit = parseInt(req.query.limit as string) || 5;
  const type = req.query.type as string | undefined; // 告知 TypeScript 這可能是 undefined
  const status = req.query.status as string | undefined; // 告知 TypeScript 這可能是 undefined
  const search = req.query.search as string | undefined;

  const skip = (page - 1) * limit;

  const where: Prisma.UserNotificationStatusWhereInput = {};

  if (search) {
    where.OR = [
      { user: { name: { contains: search } } },
      { notification: { title: { contains: search } } },
    ];
  }

  if (type && type !== 'ALL') {
    // ⭐️ 使用映射將前端的中文類型轉換為後端的英文類型進行查詢
    const dbType = typeMappingToDb[type];
    if (dbType) {
      // 確保 where.notification 是一個物件，然後再添加 type 屬性
      if (!where.notification || typeof where.notification !== 'object') {
        where.notification = {};
      }
      (where.notification as Prisma.NotificationWhereInput).type = dbType as NotificationType;
    }
  }

  if (status && status !== 'ALL') {
    where.is_read = status === 'READ';
  }

  const [userNotifications, total] = await prisma.$transaction([
    prisma.userNotificationStatus.findMany({
      where,
      skip,
      take: limit,
      include: {
        notification: true,
        user: { select: { id: true, name: true } },
      },
      orderBy: { notification: { created_at: 'desc' } },
    }),
    prisma.userNotificationStatus.count({ where }),
  ]);

  const formattedItems = userNotifications.map(un => ({
    id: un.notification_id + '_' + un.user_id,
    recipientId: un.user_id,
    recipientName: un.user.name || 'N/A',
    title: un.notification.title,
    // ⭐️ 使用反向映射將後端的英文類型轉回前端需要的中文類型
    type: typeMappingFromDb[un.notification.type] || un.notification.type,
    sentAt: un.notification.created_at.toISOString(),
    isRead: un.is_read,
  }));

  res.status(200).json({
    items: formattedItems,
    total,
  });
});

/**
 * [Admin] 處理 POST /api/admin/notifications/send 請求
 */
export const sendAdminNotificationController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { recipient, title, content, type: notificationType } = req.body;
  
  // ⭐️ 進行類型轉換
  const mappedType = typeMappingToDb[notificationType] || 'system'; // 如果找不到映射，預設為 'system'

  await createNotificationService({
    target_type: 'ALL', // 根據 recipient 邏輯調整
    // ⭐️ 使用轉換後的類型
    type: mappedType as any, // 使用 as any 暫時繞過 Zod 的嚴格檢查，因為 Zod 在這裡還不知道映射
    title,
    message: content,
    // sender_admin_id: req.user.id // 如果有管理員登入驗證
  });

  res.status(200).json({ message: '通知已成功發送' });
});