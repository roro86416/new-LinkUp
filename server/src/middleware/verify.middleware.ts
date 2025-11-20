import { Request, Response, NextFunction } from "express";
import { ZodObject } from "zod";

const verify =
  (
    schema: ZodObject<any> // <any> is added to ZodObject to prevent ZodObject type error
  ) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1. 【修正】加上 await，確保異步驗證完成
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // 2. 【修正】驗證成功後，必須呼叫 next() 才能繼續執行路由
      next();
    } catch (error) {
      // 3. 【修正】將錯誤傳遞給 Express 處理
      // (通常在 Express 中，我們會將錯誤丟給 next(error) 讓全域錯誤處理器處理)
      next(error);
    }
  };

export default verify;
