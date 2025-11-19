import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { OrderCreateBody } from "./orders.schema.js"; 
import {
  createOrderService,
  findOrdersByUserService,
  findOrderByIdService,
  cancelOrderService,
} from "./orders.service.js";
import { getECPayParams } from "./ecpay.service.js";
import prisma from "../../utils/prisma-only.js";

interface AuthUser {
  id?: string;
  userId?: string;
  [key: string]: any;
}

// 建立新訂單 (結帳) - 已整合 ECPay
export const createOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction 
) => {
  try {
    const user = (req as any).user as AuthUser | undefined;
    console.log("👤 [CreateOrder] Current User:", user);
    const userId = user?.id?.toString() || user?.userId?.toString();
    if (!userId) {
        console.error("❌ User ID not found in request. User object:", user);
        res.status(401).json({ status: "error", message: "無法識別使用者身分，請重新登入" });
        return; // 結束函式
    }

    const body = req.body as OrderCreateBody;

    // 步驟 1: 呼叫 Service 建立訂單
    const order = await createOrderService(userId, body);

    // 步驟 2: 準備 ECPay 參數
    const totalAmount = order.total_amount.toNumber(); 
    
    const itemNames = order.items
      .map(item => `${item.item_name} x ${item.quantity}`)
      .join(','); 

    // 步驟 3: 呼叫 ECPay 服務產生參數
    const ecpayResult = getECPayParams(totalAmount, itemNames);

    if (ecpayResult.status === 'error') {
        throw new Error(ecpayResult.message);
    }

    // 步驟 4: 回傳給前端
    res.status(201).json({
      status: "success",
      message: "訂單創建成功，準備跳轉至 ECPay 付款。",
      data: {
        orderId: order.id,
        ecpay: {
            apiUrl: ecpayResult.payload.action,
            formData: ecpayResult.payload.params,
        }
      }
    });
  } catch (error) {
    console.error("Error in createOrder controller:", error);
    next(error);
  }
};

//取得使用者所有訂單
export const getOrdersController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user as AuthUser;
    const userId = user?.id?.toString() || user?.userId?.toString();
    if(!userId) throw new Error("User ID missing");
    
    const orders = await findOrdersByUserService(userId);
    res.status(200).json({ status: "success", data: orders });
  } catch (error) {
    console.error("Error in getOrdersController:", error);
    next(error);
  }
};

// 取得訂單資訊by ID
export const getOrderByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderId = z.coerce.number().int().positive().parse(req.params.id);
    const user = (req as any).user as AuthUser;
    const userId = user?.id?.toString() || user?.userId?.toString();
    if(!userId) throw new Error("User ID missing");

    const order = await findOrderByIdService(userId, orderId);
    res.status(200).json({ status: "success", data: order });
  } catch (error) {
    if (error instanceof Error && (error.name === 'ZodError' || error.message.includes("findFirstOrThrow"))) {
         return res.status(404).json({ status: "error", message: "找不到訂單或 ID 無效" });
    }
    next(error);
  }
};

//重新付款 (Repay)
export const repayOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orderId = z.coerce.number().parse(req.params.id);
    
    // 取得 User ID (與之前相同的邏輯)
    const user = (req as any).user;
    const userId = user?.id?.toString() || user?.userId?.toString();
    if (!userId) throw new Error("User ID missing");

    // 1. 查詢訂單 (會自動檢查是否屬於該 User)
    const order = await findOrderByIdService(userId, orderId);

    // 2. 檢查狀態
    if (order.status !== "pending") {
      return res.status(400).json({ status: "error", message: "只有待付款的訂單才能重新付款" });
    }

    // 3. 檢查是否過期 (選做，但建議加上)
    if (new Date() > order.expires_at) {
       return res.status(400).json({ status: "error", message: "訂單已過期，請重新下單" });
    }

    // 4. 重新產生 ECPay 參數
    const totalAmount = order.total_amount.toNumber();
    const itemNames = order.items
      .map((item) => `${item.item_name} x ${item.quantity}`)
      .join(",");

    const ecpayResult = getECPayParams(totalAmount, itemNames);

    if (ecpayResult.status === "error") {
      throw new Error(ecpayResult.message);
    }

    // 5. 回傳
    res.status(200).json({
      status: "success",
      data: {
        orderId: order.id,
        ecpay: {
          apiUrl: ecpayResult.payload.action,
          formData: ecpayResult.payload.params,
        },
      },
    });
  } catch (error) {
    console.error("Repay error:", error);
    next(error);
  }
};

//取消訂單
export const cancelOrderController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderId = z.coerce.number().int().positive().parse(req.params.id);
    const user = (req as any).user as AuthUser;
    const userId = user?.id?.toString() || user?.userId?.toString();
    if(!userId) throw new Error("User ID missing");

    const result = await cancelOrderService(userId, orderId);
    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    console.error("Error in cancelOrderController:", error);
    next(error);
  }
};

//假的完成付款狀態
export const fakePayController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderId = parseInt(req.params.id);
    
    // 直接更新資料庫
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'paid' } // 確保您的 Enum 是 'paid' 或 'PAID'
    });

    res.status(200).json({ status: "success", message: "訂單已強制付款", data: updatedOrder });
  } catch (error) {
    console.error("Fake pay failed:", error);
    next(error);
  }
};