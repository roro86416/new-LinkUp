import cron from "node-cron";
import prisma from "../utils/prisma-only.js"; // 引入您的 prisma client
import { OrderStatus } from "../generated/prisma/enums.js";

/**
 * @desc 檢查並取消已過期的 'pending' 訂單
 * 同時，將庫存/票券數量加回去 (庫存回補)
 */
const cancelExpiredOrders = async () => {
  console.log("排程任務：正在檢查過期訂單...");

  // 1. 找出所有「待付款」且「已過期」的訂單
  const expiredOrders = await prisma.order.findMany({
    where: {
      status: OrderStatus.pending,
      expires_at: {
        lt: new Date(), // 'lt' (less than) - 到期時間 < 現在時間
      },
    },
    include: {
      items: true, // 載入訂單項目以用於庫存回補
    },
  });

  if (expiredOrders.length === 0) {
    console.log("排程任務：沒有找到過期訂單。");
    return;
  }

  console.log(`排程任務：找到 ${expiredOrders.length} 筆過期訂單。`);

  // 2. 遍歷每一筆過期訂單並執行「取消」和「庫存回補」
  for (const order of expiredOrders) {
    try {
      // 使用 $transaction 確保訂單取消和庫存回補同時成功
      await prisma.$transaction(async (tx) => {

        // a. 將訂單狀態更新為 'cancelled'
        await tx.order.update({
          where: { id: order.id },
          data: { status: OrderStatus.cancelled },
        });

        // b. 準備庫存回補 (Increment)
        const productUpdates = order.items
          .filter(item => item.product_variant_id)
          .map(item => tx.productVariant.update({
            where: { id: item.product_variant_id! },
            data: { stock_quantity: { increment: item.quantity } }
          }));

        // c. 準備票券數量回補 (Increment)
        const ticketUpdates = order.items
          .filter(item => item.ticket_type_id)
          .map(item => tx.ticketType.update({
            where: { id: item.ticket_type_id! },
            data: { total_quantity: { increment: item.quantity } }
          }));

        // d. 執行所有回補
        await Promise.all([...productUpdates, ...ticketUpdates]);

await tx.notification.create({
          data: {
            type: "system", // 這裡用 system 或是 transaction 都可以
            title: "訂單取消通知",
            message: `您的訂單 #${order.order_number} 因超過付款時限（30分鐘），系統已自動取消。\n如需購買請重新下單。`,
            sent_at: new Date(),
            userStatuses: {
              create: {
                user_id: order.user_id,
                is_read: false,
              },
            },
          },
        });

        console.log(`訂單 ${order.order_number} 已成功取消並回補庫存。`);
      });
    } catch (error) {
      console.error(`處理訂單 ${order.order_number} 失敗:`, error);
    }
  }
};

/**
 * @desc 啟動排程：每分鐘執行一次 'cancelExpiredOrders' 函數
 */
export const startOrderScheduler = () => {
  // "*/1 * * * *" = "每 1 分鐘"
  cron.schedule("*/1 * * * *", cancelExpiredOrders);

  console.log("✅ 訂單自動取消排程器已啟動 (每分鐘檢查一次)");
};