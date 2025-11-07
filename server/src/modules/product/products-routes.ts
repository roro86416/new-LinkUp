import { Router } from "express";
import verify from "../../middleware/verify.middleware.js";
import { createProductSchema, updateProductSchema } from "./products.schema.js";
import {
  getAllProductsController,
  getProductByIdController,
  createProductController,
  updateProductController,
  deleteProductController,
} from "./products-controller.js";

const router = Router();

// 獲取所有產品
router.get("/", getAllProductsController);

// 獲取指定產品
router.get("/:id", getProductByIdController);

// 建立新產品
router.post("/", verify(createProductSchema), createProductController);

// 更新指定產品
router.put("/:id", verify(updateProductSchema), updateProductController);

// 刪除指定產品
router.delete("/:id", deleteProductController);

export default router;
