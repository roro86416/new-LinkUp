import { Request, Response, NextFunction } from "express";
import { addToCartService } from "./cart.service";
import { AddToCartBody } from "./cart.schema";

/**
 * @desc  新增項目到購物車
 * @param req
 * @param res
 * @param next
 */

export const addToCartController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body as AddToCartBody;
    const userId = "1"; //未來user修改處
    const resultItem = await addToCartService(userId, body);
    res.status(200).json({
      status: "success",
      data: resultItem,
    });
  } catch (error) {
    //庫存不足、票券重複
    next(error);
  }
};
