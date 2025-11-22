// server/src/modules/auth/auth.controller.ts
import { Request, Response } from "express";
import { authService } from "./auth.service.js";
import { registerSchema, loginSchema, googleLoginSchema } from "./auth.schema.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export const authController = {
  /** 註冊 (修改：成功後直接回傳 Token) */
  async register(req: Request, res: Response) {
    try {
      const parsed = registerSchema.parse(req.body);
      const user = await authService.register(parsed);

      // 註冊成功當下，直接簽發 Token
      const tokenPayload = {
        userId: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar || null,
        role: user.role,
        provider: user.provider || "local",
      };

      // 簽發 Token (效期 7 天)
      const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "7d" });

      res.status(201).json({
        message: "註冊成功",
        user: tokenPayload,
        token,
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  /** 登入 */
  async login(req: Request, res: Response) {
    try {
      const parsed = loginSchema.parse(req.body);
      const user = await authService.login(parsed);

      const tokenPayload = {
        userId: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar || null,
        role: user.role,
        provider: user.provider || "local",
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

  /** Google 登入（前端送 credential / idToken） */
  async googleLogin(req: Request, res: Response) {
    try {
      const { credential } = googleLoginSchema.parse(req.body);

      // 1. 驗證 Google ID Token
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();

      if (!payload?.email) {
        throw new Error("Google 登入失敗：無效的 Token");
      }

      // 2. 找/建 使用者
      let user: any;

      if (typeof (authService as any).findUserByEmail === "function") {
        user = await (authService as any).findUserByEmail(payload.email);

        if (!user) {
          const randomPassword =
            Math.random().toString(36).slice(-8) + "Aa1!";
          user = await authService.register({
            email: payload.email,
            password: randomPassword,
            name: payload.name || "",
          } as any);
        }
      } else {
        // 若 service 已封裝 googleLogin，就直接用它
        user = await authService.googleLogin({ credential } as any);
      }

      // 3. 簽發 JWT
      const tokenPayload = {
        userId: user.id,
        email: user.email,
        name: user.name || payload.name,
        avatar: user.avatar || payload.picture || null,
        role: user.role,
        provider: user.provider || "google",
      };

      const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "7d" });

      res.status(200).json({
        message: "Google 登入成功",
        token,
        user: tokenPayload,
      });
    } catch (err: any) {
      console.error("Google Login Error:", err);
      res.status(400).json({
        message: err.message || "Google 登入失敗",
      });
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
