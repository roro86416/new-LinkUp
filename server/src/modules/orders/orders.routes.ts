import { Router } from "express";
// 引入您的中間件
import verify from "../../middleware/verify.middleware.js"; //
import { auth } from "../../middleware/auth.middleware.js"; //

// 引入我們剛剛建立的 Schema
import { createOrderSchema } from "./orders.schema.js"; //

// 引入我們剛剛建立的所有 Controller 函數
import {
  createOrderController,
  getOrdersController,
  getOrderByIdController,
  cancelOrderController,
} from "./orders.controller.js";

const router = Router();

// 先登入驗證
router.use(auth); //

// 查詢目前使用者的所有訂單列表
router.get(
  "/",
  getOrdersController
);

// 查詢單筆訂單詳情
router.get(
  "/:id",
  getOrderByIdController
);

// 建立新訂單 (結帳)
router.post(
  "/",
  verify(createOrderSchema), 
  createOrderController
);

// 取消一筆待付款 (Pending) 的訂單
router.delete(
  "/:id",
  cancelOrderController
);

export default router;