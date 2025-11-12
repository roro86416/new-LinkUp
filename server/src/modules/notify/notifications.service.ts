import { z } from "zod";
import prisma from "../../utils/prisma-only.js";
import { findTemplateById } from "./notification-templates.service.js";
import { createNotificationSchema } from "./notifications.schema.js";

type CreateNotificationBody = z.infer<typeof createNotificationSchema>["body"];

type PrismaTransactionClient = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];
/**
 * 建立新通知並分發給目標使用者
 * @param notificationData - 通知的資料
 */
export const createNotificationService = async (
  notificationData: CreateNotificationBody
) => {
  // ⭐️ 驗證傳入的資料是否符合 Zod schema
  const validatedData = createNotificationSchema.shape.body.parse(notificationData);

  const { target_type, target_id, template_id, template_params, ...data } =
    validatedData;

  return prisma.$transaction(async (tx: PrismaTransactionClient) => {
    let finalTitle = data.title;
    let finalMessage = data.message;

    // 如果提供了 template_id，則使用模板
    if (template_id) {
      const template = await findTemplateById(template_id);
      if (!template) {
        throw new Error(`找不到 ID 為 ${template_id} 的通知模板`);
      }

      // 簡易的模板變數替換邏輯
      const renderTemplate = (templateString: string, params: Record<string, any> = {}) => {
        return templateString.replace(/{(\w+)}/g, (placeholder, key) => {
          return params[key] !== undefined ? String(params[key]) : placeholder;
        });
      };

      finalTitle = renderTemplate(template.title, template_params);
      finalMessage = renderTemplate(template.message, template_params);
    }

    if (!finalTitle || !finalMessage) {
      throw new Error("通知的標題和內容不能為空");
    }

    // 1. 建立主通知
    const notification = await tx.notification.create({
      data: {
        ...data,
        title: finalTitle,
        message: finalMessage,
        target_type,
        target_id: target_id ? String(target_id) : undefined, // 確保存入 notification 表的是字串
      },
    });

    // 2. 根據 target_type 決定要分發給哪些使用者
    let targetUserIds: string[] = [];

    if (target_type === "USER" && target_id) {
      // 指定單一使用者
      targetUserIds.push(String(target_id));
    } else if (target_type === "ALL") {
      // 發送給所有 'MEMBER' 和 'ORGANIZER' 角色的使用者
      const allUsers = await tx.user.findMany({
        where: {
          role: {
            in: ["MEMBER", "ORGANIZER"],
          },
        },
        select: { id: true },
      });
      targetUserIds = allUsers.map((user: { id: string }) => user.id);
    } else if (target_type === "ORGANIZER") {
      // 這裡可以增加只發送給 ORGANIZER 的邏輯
      // const organizers = await tx.user.findMany({ where: { role: 'ORGANIZER' }, select: { id: true } });
      // targetUserIds = organizers.map(user => user.id);
    }
    // 可以再加入 ORGANIZER 的邏輯

    // 3. 為每個目標使用者建立一筆 user_notification_statuses 記錄
    if (targetUserIds.length > 0) {
      await tx.userNotificationStatus.createMany({
        data: targetUserIds.map((userId) => ({
          notification_id: notification.id,
          user_id: userId,
        })),
      });
    }

    return notification;
  });
};

/**
 * 獲取指定使用者的所有通知
 * @param userId - 使用者 ID
 */
export const findNotificationsByUserService = async (userId: string) => {
  const userNotifications = await prisma.userNotificationStatus.findMany({
    where: {
      user_id: userId,
      is_deleted: false, // 只獲取未刪除的
    },
    include: {
      notification: true, // 關聯載入通知主體內容
    },
    orderBy: {
      notification: {
        created_at: "desc", // 依照通知建立時間排序
      },
    },
  });

  return userNotifications;
};

/**
 * 將使用者的特定通知標記為已讀
 * @param userId - 使用者 ID
 * @param notificationId - 通知 ID
 */
export const markNotificationAsReadService = async (
  userId: string,
  notificationId: number
) => {
  const updatedStatus = await prisma.userNotificationStatus.update({
    where: {
      notification_id_user_id: {
        user_id: String(userId), // 確保傳入的是字串
        notification_id: notificationId,
      },
    },
    data: {
      is_read: true,
      read_at: new Date(),
    },
  });
  return updatedStatus;
};

/**
 * 刪除（軟刪除）使用者的特定通知
 * @param userId - 使用者 ID
 * @param notificationId - 通知 ID
 */
export const deleteNotificationForUserService = async (
  userId: string,
  notificationId: number
) => {
  return await prisma.userNotificationStatus.update({
    where: {
      notification_id_user_id: {
        user_id: String(userId), // 確保傳入的是字串
        notification_id: notificationId,
      },
    },
    data: {
      is_deleted: true,
      deleted_at: new Date(),
    },
  });
};