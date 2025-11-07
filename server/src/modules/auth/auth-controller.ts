import { Request, Response } from "express";
import { authService } from "./auth-service.js";
import { registerSchema, loginSchema } from "./auth-schema.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const parsed = registerSchema.parse(req.body);
      const user = await authService.register(parsed);
      res.status(201).json({ message: "註冊成功", user });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const parsed = loginSchema.parse(req.body);
      const user = await authService.login(parsed);

      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.status(200).json({ message: "登入成功", token, user });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async profile(req: Request, res: Response) {
    const user = (req as any).user;
    res.json({ message: "取得個人資料成功", user });
  },
};
