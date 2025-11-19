import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// JWT payload 的通用型別
interface JwtPayload {
  id?: string | number;
  userId?: string; // 相容舊的會員 payload
  role?: string;
}

// 擴充 Express Request，加入 user 屬性
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

const JWT_SECRETS = {
  member: process.env.JWT_SECRET || "secretkey",
  admin: process.env.JWT_ADMIN_SECRET || "adminsecretkey",
};
 const TEST_SECRET = "temp_fix_secret_12345"; 
/**
 * 通用的 JWT 驗證中間件
 * @param role 'member' 或 'admin'
 */
export const auth = (role: "member" | "admin") => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({ message: "未提供權杖 (Token)" });
    }

    try {
      const secret = JWT_SECRETS[role];
      
      const decoded = jwt.verify(token, secret) as JwtPayload;

      // 如果需要驗證角色，且角色不符
      if (decoded.role && decoded.role !== role) {
        return res.status(403).json({ message: "權限不足" });
      }

      req.user = decoded; // 將解碼後的 payload 附加到 request 上
      next();
    } catch (err) {
      res.status(403).json({ message: "權杖無效或已過期" });
    }
  };
};