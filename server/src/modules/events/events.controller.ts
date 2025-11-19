import { Request, Response } from "express";
import * as svc from "./events.service.js"; 

/**
 * [公開] 獲取活動列表
 * (處理 /api/v1/events?type=...&limit=...) 的請求
 */
export const listEvents = async (req: Request, res: Response) => {
  try {
    //從查詢參數中獲取 type 和 limit(如果前端沒提供，給予預設值)
    const type = (req.query.type as string) || "all";
    const limit = Number(req.query.limit) || 10;
    //呼叫 service 函式，並傳入參數
    const data = await svc.listPublicEvents(type, limit);
    res.json({ status: "success", data });
  } catch (error) {
    // 如果 service 層 (prisma) 發生錯誤，捕捉它並回傳 500
    console.error("Error in listEvents controller:", error);
    if (error instanceof Error) {
      res.status(500).json({ status: "error", message: error.message });
    } else {
      res.status(500).json({ status: "error", message: "An unknown error occurred" });
    }
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    // 從 URL 參數中獲取 eventId (Prisma 的 ID 是 Int，所以我們必須用 parseInt 轉換)
    const eventId = parseInt(req.params.id);
    // 檢查 ID 是否為有效數字
    if (isNaN(eventId)) {
      return res.status(400).json({ status: "error", message: "無效的活動 ID" });
    }

    //呼叫在 service 中的函式
    const data = await svc.getPublicEventById(eventId);
    res.json({ status: "success", data });
  } catch (error) {
    // 捕捉 service 層拋出的錯誤 (例如 "找不到活動")
    console.error(`Error in getEventById controller (ID: ${req.params.id}):`, error);
    if (error instanceof Error) {
      // 如果 service 拋出 "找不到活動"，回傳 404
      if (error.message.includes("找不到活動")) {
        return res.status(404).json({ status: "error", message: error.message });
      }
      // 其他500錯誤
      return res.status(500).json({ status: "error", message: error.message });
    } else {
      return res.status(500).json({ status: "error", message: "An unknown error occurred" });
    }
  }
};
