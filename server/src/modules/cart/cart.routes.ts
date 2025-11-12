import { Router } from "express";
import verify from "../../middleware/verify.middleware.js";
import { auth } from "../../middleware/auth.middleware.js";
import { addToCartSchema, updateCartItemSchema } from "./cart.schema.js";
import {
  addToCartController,
  getCartController,
  deleteCartItemController,
  updateCartItemController,
} from "./cart.controller.js";

const router = Router();

router.use(auth);
//取得購物車
router.get("/", getCartController);

// 新增購物車內容
router.post("/", verify(addToCartSchema), addToCartController);

// 更新購物車內容
router.put("/:id", verify(updateCartItemSchema), updateCartItemController);

// 刪除購物車項目
router.delete("/:id", deleteCartItemController);

export default router;
