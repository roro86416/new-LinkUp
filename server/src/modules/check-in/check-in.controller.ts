import { Request, Response, NextFunction } from "express";
import { verifyTicketService } from "./check-in.service.js";
import { VerifyTicketBody } from "./check-in.schema.js";

export const verifyTicketController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 取得掃描者 ID (工作人員)
    const user = (req as any).user;
    const scannerId = user?.id?.toString() || user?.userId?.toString();

    if (!scannerId) {
      return res.status(401).json({ message: "無法識別掃描者身分" });
    }

    const { qr_code } = req.body as VerifyTicketBody;

    const result = await verifyTicketService(scannerId, qr_code);

    res.status(200).json(result);
  } catch (error) {
    // 這裡我們不只 console.error，也回傳 400 給前端顯示錯誤訊息 (如: 重複入場)
    console.error("Check-in failed:", error);
    
    if (error instanceof Error) {
        return res.status(400).json({ status: "error", message: error.message });
    }
    next(error);
  }
};