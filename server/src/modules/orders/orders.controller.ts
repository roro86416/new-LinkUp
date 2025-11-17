import { Request, Response, NextFunction } from "express";
import { z } from "zod";

// 引入我們在 Schema 步驟中定義的類型
import { OrderCreateBody } from "./orders.schema.js"; 

// 引入我們剛剛完成的所有 Service 函數
import {
  createOrderService,
  findOrdersByUserService,
  findOrderByIdService,
  cancelOrderService,
} from "./orders.service.js";

/**
 * @desc 1. 建立新訂單 (結帳)
 */
export const createOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 假設您的 auth.middleware.ts 會將 user 附加到 req 上
    const userId = (req as any).user.id; 
    const body = req.body as OrderCreateBody;

    // 呼叫 Service
    const order = await createOrderService(userId, body);

    res.status(201).json({
      status: "success",
      message: "訂單創建成功，請前往付款。",
      data: order,
    });
  } catch (error) {
    // 將 Service 拋出的錯誤 (例如 "庫存不足") 傳遞給 Express 錯誤處理器
    next(error); 
  }
};

/**
 * @desc 2. 查詢目前使用者的所有訂單列表
 */
export const getOrdersController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.id; 

    // 呼叫 Service
    const orders = await findOrdersByUserService(userId);

    res.status(200).json({
      status: "success",
      data: orders,
    });
  } catch (error) {
    next(error); 
  }
};

/**
 * @desc 3. 查詢單筆訂單詳情
 */
export const getOrderByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 驗證並轉換 URL 參數 :id
    const orderId = z.coerce.number().int().positive("ID 必須是正整數").parse(req.params.id);
    const userId = (req as any).user.id;

    // 呼叫 Service (Service 內部會檢查 userId 是否匹配)
    const order = await findOrderByIdService(userId, orderId);

    res.status(200).json({
      status: "success",
      data: order,
    });
  } catch (error) {
    // 如果 z.parse 失敗，或 findOrderByIdService 拋出錯誤 (找不到或權限不足)
    next(error); 
  }
};

/**
 * @desc 4. 取消一筆待付款 (Pending) 的訂單
 */
export const cancelOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 驗證並轉換 URL 參數 :id
    const orderId = z.coerce.number().int().positive("ID 必須是正整數").parse(req.params.id);
    const userId = (req as any).user.id;

    // 呼叫 Service (Service 內部會檢查狀態和權限)
    const result = await cancelOrderService(userId, orderId);

    res.status(200).json({
      status: "success",
      data: result, // (會回傳 { message: "訂單已成功取消..." })
    });
  } catch (error) {
    // 如果 z.parse 失敗，或 Service 拋出錯誤 (例如 "無法取消已付款訂單")
    next(error); 
  }
};