import prisma from "../../utils/prisma-only.js";
import { CheckInStatus } from "../../generated/prisma/enums.js"; 

export const verifyTicketService = async (scannerId: string, qrCode: string) => {
  // 1. 搜尋票券 (同時找出關聯的活動與參加者，方便回傳顯示)
  const ticket = await prisma.ticket.findUnique({
    where: { qr_code_data: qrCode },
    include: {
      orderItem: {
        include: {
          ticketType: {
            include: {
              event: true,
            },
          },
        },
      },
    },
  });

  // --- 情況 A: 票券無效 (找不到) ---
  if (!ticket) {
    throw new Error("無效的票券代碼 (Ticket not found)");
  }

  // --- 情況 B: 票券已使用 (重複入場) ---
  if (ticket.status === "used") {
    // [關鍵修正] 這裡直接拋出錯誤，不嘗試寫入 CheckIn 資料表
    // 避免觸發 ticket_id 的 @unique 資料庫限制導致伺服器崩潰
    throw new Error("此票券已經使用過，無法重複入場！");
  }

  // --- 情況 C: 驗票成功 ---
  if (ticket.status === "valid") {
    // 使用 Transaction 確保三個動作 (更新票券、建立報到紀錄、更新訂單) 同步成功
    const result = await prisma.$transaction(async (tx) => {
      // 1. 更新票券狀態為 'used'
      const updatedTicket = await tx.ticket.update({
        where: { id: ticket.id },
        data: { status: "used" },
      });

      // 2. 建立成功報到紀錄
      const checkInRecord = await tx.checkIn.create({
        data: {
          ticket_id: ticket.id,
          scanner_id: scannerId,
          status: CheckInStatus.SUCCESS,
          scan_time: new Date(),
        },
      });

      // 3. [新增功能] 同步更新訂單狀態為 'completed' (代表已使用)
      // 這樣前端訂單列表就能顯示「已使用」
      await tx.order.update({
        where: { id: ticket.orderItem.order_id },
        data: { status: "completed" }
      });

      return { ticket: updatedTicket, checkIn: checkInRecord };
    });

    // 回傳給前端顯示的資訊
    return {
      status: "success",
      message: "驗票成功！准許入場",
      data: {
        ticketId: result.ticket.id,
        attendeeName: result.ticket.name,
        eventName: ticket.orderItem.ticketType?.event.title || "未知活動",
        scanTime: result.checkIn.scan_time,
      },
    };
  }

  // 預防性錯誤 (理論上不會執行到這裡)
  throw new Error("票券狀態異常");
};