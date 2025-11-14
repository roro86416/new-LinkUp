import { Request, Response, NextFunction } from "express";
import {
  addToCartService,
  getCartService,
  updateCartItemService,
  deleteCartItemService,
} from "./cart.service";
import { AddToCartBody, UpdateCartItemBody } from "./cart.schema";

/**
 * @desc  新增項目到購物車
 * @param req
 * @param res
 * @param next
 */

// 取得購物車
export const getCartController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = "d5dbe765-1f72-4efc-859c-4662d8d8da36";
    const cart = await getCartService(userId);
    res.status(200).json({
      status: "success",
      data: cart,
    });
  } catch (error) {
    const e = error as Error;
    res.status(500).json({
      status: "error",
      message: e.message,
    });
  }
};

//加入購物車
export const addToCartController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body as AddToCartBody;
    const userId = "d5dbe765-1f72-4efc-859c-4662d8d8da36"; //未來user修改處
    const resultItem = await addToCartService(userId, body);
    res.status(200).json({
      status: "success",
      data: resultItem,
    });
  } catch (error) {
    const e = error as Error;
    res.status(500).json({
      status: "error",
      message: e.message,
    });
  }
};

//更新購物車資訊
export const updateCartItemController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = "d5dbe765-1f72-4efc-859c-4662d8d8da36";
    const itemId = parseInt(req.params.id);
    const body = req.body as UpdateCartItemBody;
    const result = await updateCartItemService(userId, itemId, body);
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    const e = error as Error;
    res.status(500).json({
      status: "error",
      message: e.message,
    });
  }
};

//刪除購物車指定項目
export const deleteCartItemController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = "d5dbe765-1f72-4efc-859c-4662d8d8da36";
    const itemId = parseInt(req.params.id);
    const result = await deleteCartItemService(userId, itemId);
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    const e = error as Error;
    res.status(404).json({
      status: "error",
      message: e.message,
    });
  }
};
