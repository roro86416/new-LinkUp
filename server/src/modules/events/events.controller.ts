import { Request, Response } from "express";
import * as svc from "./events.service.js"; 

/**
 * [公開] 獲取活動列表
 * (處理 /api/v1/events?type=...&limit=...) 的請求
 */
export const listEvents = async (req: Request, res: Response) => {
  try {
    // 1. 從查詢參數 (query parameters) 中安全地獲取 type 和 limit
    // (如果前端沒提供，給予預設值)
    const type = (req.query.type as string) || "all";
    const limit = Number(req.query.limit) || 10;

    // 2. 呼叫 service 函式，並傳入參數
    const data = await svc.listPublicEvents(type, limit);

    // 3. 成功回傳資料
    res.json({ status: "success", data });

  } catch (error) {
    // 4. 如果 service 層 (prisma) 發生錯誤，捕捉它並回傳 500
    console.error("Error in listEvents controller:", error);
    if (error instanceof Error) {
      res.status(500).json({ status: "error", message: error.message });
    } else {
      res.status(500).json({ status: "error", message: "An unknown error occurred" });
    }
  }
};
