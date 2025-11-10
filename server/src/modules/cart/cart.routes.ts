import { Router } from "express";
import verify from "../../middleware/verify.middleware";
import { addToCartSchema, updateCartItemSchema } from "./cart.schema";
import {
  addToCartController,
  getCartController,
  deleteCartItemController,
  updateCartItemController,
} from "./cart.controller";

const router = Router();
//取得購物車
router.get("/", getCartController);

// 新增購物車內容
router.post("/", verify(addToCartSchema), addToCartController);

// 更新購物車內容
router.put("/:id", verify(updateCartItemSchema), updateCartItemController);

// 刪除購物車項目
router.delete("/:id", deleteCartItemController);

export default router;
