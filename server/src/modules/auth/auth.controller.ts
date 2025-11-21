import { Request, Response } from "express";
import { authService } from "./auth.service.js";
import { registerSchema, loginSchema } from "./auth.schema.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";
const {OAuth2Client} = await import('google-auth-library');
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export const authController = {
  /** 註冊 (修改：成功後直接回傳 Token) */
  async register(req: Request, res: Response) {
    try {
      const parsed = registerSchema.parse(req.body);
      const user = await authService.register(parsed);

      // [新增] 註冊成功當下，直接簽發 Token
      const tokenPayload = {
        userId: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar || null,
      };

      // 簽發 Token (效期 7 天)
      const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "7d" });

      res.status(201).json({ 
        message: "註冊成功", 
        user: tokenPayload, 
        token // [關鍵] 回傳 Token 給前端
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
  async googleLogin(req: Request, res: Response) {
    try {
      const { credential } = req.body;
      
      // 1. 驗證 Google Token
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      
      if (!payload || !payload.email) {
        throw new Error("Google 登入失敗：無效的 Token");
      }

      // 2. 呼叫 Service 處理 (尋找現有用戶或自動註冊)
      // 注意：您需要在 auth.service.ts 中實作 findOrCreateByGoogle，這裡先模擬直接用 email 找
      // 建議您在 auth.service.ts 新增對應方法，這裡示範直接整合邏輯:
      
      let user = await authService.findUserByEmail(payload.email); // 假設 service 有這支
      
      if (!user) {
        // 若用戶不存在，自動註冊
        // 隨機生成一組密碼，因為 Google 登入不需要密碼
        const randomPassword = Math.random().toString(36).slice(-8) + "Aa1!";
        user = await authService.register({
          email: payload.email,
          password: randomPassword,
          name: payload.name, // 若 schema 有支援 name
        });
      }

      // 3. 發發 JWT
      const tokenPayload = {
        userId: user.id,
        email: user.email,
        name: user.name || payload.name,
        avatar: user.avatar || payload.picture,
      };

      const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "7d" });

      res.status(200).json({
        message: "Google 登入成功",
        token,
        user: tokenPayload,
      });

    } catch (err: any) {
      console.error("Google Login Error:", err);
      res.status(400).json({ error: "Google 登入失敗" });
    }
  }
};
