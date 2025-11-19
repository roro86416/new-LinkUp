import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";

const verify =
  (
    schema: ZodObject<any>
  ) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("🔍 [Verify Middleware] 收到請求，開始驗證...");
      console.log("📦 [Verify Middleware] Body 內容:", JSON.stringify(req.body, null, 2));

      // 1. 執行驗證
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      console.log("✅ [Verify Middleware] 驗證成功！前往 Controller ->");
      
      // 2. 驗證成功，繼續
      next();
    } catch (error) {
      console.error("❌ [Verify Middleware] 驗證失敗！");
      
      if (error instanceof ZodError) {
        // 印出詳細的 Zod 錯誤原因 (這對除錯非常有幫助)
        console.error("📋 [Zod Error Detail]:", JSON.stringify(error.issues, null, 2));
      } else {
        console.error("⚠️ [Unknown Error]:", error);
      }

      // 3. 將錯誤傳遞給 Express
      next(error);
    }
  };

export default verify;