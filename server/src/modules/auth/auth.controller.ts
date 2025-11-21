import { Request, Response } from "express";
import { authService } from "./auth.service.js";
import { registerSchema, loginSchema } from "./auth.schema.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

export const authController = {
  /** 註冊 */
  async register(req: Request, res: Response) {
    try {
      const parsed = registerSchema.parse(req.body);
      const user = await authService.register(parsed);
      res.status(201).json({ message: "註冊成功", user });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  /** 登入 */
  async login(req: Request, res: Response) {
    try {
      const parsed = loginSchema.parse(req.body);
      const user = await authService.login(parsed);

      // ✅ 將 avatar 一起放入 payload
      const tokenPayload = {
        userId: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar || null,
         role: user.role, 
      };

      const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "7d" });

      res.status(200).json({
        message: "登入成功",
        token,
        user: tokenPayload,
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  /** 取得登入者個人資料（需 JWT 驗證） */
  async profile(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      res.status(200).json({ message: "取得個人資料成功", user });
    } catch (err: any) {
      res.status(400).json({ error: "無法取得使用者資料" });
    }
  },
};
