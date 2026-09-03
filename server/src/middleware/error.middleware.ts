import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error); // 在伺服器端記錄完整錯誤

  if (error instanceof ZodError) {
    return res.status(400).json({
      status: 'error',
      message: '輸入資料驗證失敗',
      errors: error.flatten(),
    });
  }

  // 其他類型的錯誤可以在這裡添加，例如 PrismaClientKnownRequestError

  return res.status(500).json({ status: 'error', message: error.message || '伺服器內部錯誤' });
};