import { Router } from "express";
import verify from "../../middleware/verify.middleware.js"; //
import { auth } from "../../middleware/auth.middleware.js"; //
import { createOrderSchema } from "./orders.schema.js"; //
import {
  createOrderController,
  getOrdersController,
  getOrderByIdController,
  cancelOrderController,
  repayOrderController,
  fakePayController
} from "./orders.controller.js";

const router = Router();

// 先登入驗證
router.use(auth("member"));

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

// 重新付款 (Repay)
router.post("/:id/repay", repayOrderController);

// 取消一筆待付款 (Pending) 的訂單
router.delete(
  "/:id",
  cancelOrderController
);

//模擬付款成功
router.post("/:id/fake-pay", fakePayController);

export default router;