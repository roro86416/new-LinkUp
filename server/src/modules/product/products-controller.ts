import { Request, Response } from "express";
import {
  findAllProductsService,
  findProductByIdService,
  createNewProductService,
  updateProductService,
  deleteProductService,
} from "./products-service.js";

//獲取所有產品的 Controller
export const getAllProductsController = async (req: Request, res: Response) => {
  try {
    // 呼叫 Service 去拿資料
    const products = await findAllProductsService();

    // 回傳 Service 給的結果
    res.json({
      status: "success",
      data: products,
    });
  } catch (error) {
    // 處理錯誤
    const e = error as Error;
    res.status(500).json({
      status: "error",
      message: e.message,
    });
  }
};

//獲取指定商品的Controller
export const getProductByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const product = await findProductByIdService(id);

    res.json({
      status: "success",
      data: product,
    });
  } catch (error) {
    const e = error as Error;
    res.status(500).json({
      status: "error",
      message: e.message,
    });
  }
};

//建立新產品的 Controller
export const createProductController = async (req: Request, res: Response) => {
  try {
    // 呼叫 Service，並把 request body 傳給它
    const newProduct = await createNewProductService(req.body);

    res.status(201).json({
      status: "success",
      data: newProduct,
    });
  } catch (error) {
    const e = error as Error;
    res.status(500).json({
      status: "error",
      message: e.message,
    });
  }
};

//更新產品的 Controller
export const updateProductController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    // 呼叫 Service，傳入 id 和 body
    const updatedProduct = await updateProductService(id, req.body);

    res.json({
      status: "success",
      data: updatedProduct,
    });
  } catch (error) {
    const e = error as Error;
    res.status(500).json({
      status: "error",
      message: e.message,
    });
  }
};

//刪除產品的 Controller
export const deleteProductController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    // 呼叫 Service 執行刪除
    const deletedProduct = await deleteProductService(id);

    res.json({
      status: "success",
      data: deletedProduct,
    });
  } catch (error) {
    const e = error as Error;
    res.status(500).json({
      status: "error",
      message: e.message,
    });
  }
};
