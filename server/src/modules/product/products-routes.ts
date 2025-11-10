import { Router } from "express";
import verify from "../../middleware/verify.middleware.js";
import { createProductSchema, updateProductSchema } from "./products.schema.js";
import {
  getAllProductsController,
  createProductController,
  updateProductController,
  deleteProductController,
} from "./products-controller.js";

const router = Router();

// --- 產品路由 (Product Routes) ---

// 獲取所有產品
// GET /api/v1/products/
router.get("/", getAllProductsController);

// 建立新產品
// POST /api/v1/products/
router.post(
  "/",
  verify(createProductSchema), // 驗證中間件
  createProductController // 對應的 Controller
);

// 更新指定產品
// PUT /api/v1/products/:id
router.put(
  "/:id",
  verify(updateProductSchema), // 驗證中間件
  updateProductController // 對應的 Controller
);

// 刪除指定產品
// DELETE /api/v1/products/:id
router.delete("/:id", deleteProductController);

export default router;
