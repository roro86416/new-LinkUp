import prisma from "../../utils/prisma-only.js";
import { NotificationType } from "../../generated/prisma/client.js";

// 類型對照表：後端 Enum -> 前端顯示文字
const typeMapping: Record<string, string> = {
  event: "活動提醒",
  transaction: "報名成功",
  announcement: "系統公告",
  system: "系統公告",
  review: "活動變更", // 暫定
};

// 取得我的通知列表
export const getMyNotifications = async (userId: string) => {
  const statuses = await prisma.userNotificationStatus.findMany({
    where: {
      user_id: userId,
      is_deleted: false, // 只撈未刪除的
    },
    include: {
      notification: true, // 關聯出通知標題、內容
    },
    orderBy: {
      created_at: "desc",
    },
  });

  // 整理回傳格式 (扁平化資料 + 轉型)
  return statuses.map((status) => {
    const rawType = status.notification.type;
    const displayType = typeMapping[rawType] || "系統公告";

    return {
      id: status.id.toString(), // 前端 id 用 string，轉型一下
      notificationId: status.notification.id,
      title: status.notification.title,
      content: status.notification.message, // schema 裡欄位是 message
      type: displayType,
      sentAt: (status.notification.sent_at || status.created_at).toISOString(),
      isRead: status.is_read,
    };
  });
};

// 標記為已讀
export const markAsRead = async (statusId: number, userId: string) => {
  return prisma.userNotificationStatus.update({
    where: {
      id: statusId,
      user_id: userId, // 確保是本人操作
    },
    data: {
      is_read: true,
      read_at: new Date(),
    },
  });
};

// 刪除通知 (軟刪除)
export const deleteNotification = async (statusId: number, userId: string) => {
  return prisma.userNotificationStatus.update({
    where: {
      id: statusId,
      user_id: userId,
    },
    data: {
      is_deleted: true,
      deleted_at: new Date(),
    },
  });
};