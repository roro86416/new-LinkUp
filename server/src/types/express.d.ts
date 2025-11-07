import { User } from '@prisma/client'; // 如果你有 Prisma 模型，可以用這個；沒有可自訂

declare global {
  namespace Express {
    interface Request {
      user?: User | null; // 或自己定義形狀
    }
  }
}
