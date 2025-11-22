// server/src/modules/auth/auth.service.ts
import prisma from "../../utils/prisma-only.js";
import bcrypt from "bcryptjs";
import {
  RegisterInput,
  LoginInput,
  GoogleLoginInput,
} from "./auth.schema.js";

import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const authService = {
  /** 註冊 (EMAIL) */
  async register(data: RegisterInput) {
    const { email, password, name, avatar } = data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new Error("此 Email 已被註冊");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const defaultName = name || email.split("@")[0] || `User_${Date.now()}`;
    const defaultAvatar =
      avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png";

    const user = await prisma.user.create({
      data: {
        email,
        password_hash: hashedPassword,
        name: defaultName,
        avatar: defaultAvatar,
        role: "MEMBER",
        is_active: true,

        // ✅ 如果你的 Prisma User model 有 provider/provider_id 就打開
        // provider: "GOOGLE",
        // provider_account_id: null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        created_at: true,
      },
    });

    return user;
  },

  /** 登入 (EMAIL) */
  async login(data: LoginInput) {
    const { email, password } = data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("帳號不存在");

    const isValid = await bcrypt.compare(password, user.password_hash || "");
    if (!isValid) throw new Error("密碼錯誤");

    if (!user.is_active) throw new Error("帳號已停用");

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar || null,
      role: user.role,
    };
  },

  /** ✅ Google 第三方登入 / 註冊 */
  async googleLogin(data: GoogleLoginInput) {
    const token = data.credential || data.idToken;
    if (!token) throw new Error("缺少 Google credential/idToken");

    // 1) 驗證 Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email) throw new Error("Google 帳號無 email");

    const email = payload.email;
    const name = payload.name || email.split("@")[0];
    const avatar = payload.picture;

    // 2) 找 user
    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
      // 已存在就更新資料（可選）
      const updated = await prisma.user.update({
        where: { email },
        data: {
          name: existing.name || name,
          avatar: existing.avatar || avatar,

          // ✅ 如果你的 Prisma User model 有 provider/provider_id 就打開
          // provider: "GOOGLE",
          // provider_account_id: payload.sub,
        },
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          role: true,
          created_at: true,
        },
      });

      return updated;
    }

    // 3) 不存在 → 建新 user（等於 Google 註冊）
    const user = await prisma.user.create({
      data: {
        email,
        password_hash: null, // google 註冊沒有密碼
        name,
        avatar,
        role: "MEMBER",
        is_active: true,

        // ✅ 如果你的 Prisma User model 有 provider/provider_id 就打開
        // provider: "GOOGLE",
        // provider_account_id: payload.sub,
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        created_at: true,
      },
    });

    return user;
  },

  /** 更新會員資料 */
  async updateUser(
    userId: string,
    data: Partial<{ name: string; avatar: string; email: string }>
  ) {
    const updated = await prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, email: true, name: true, avatar: true },
    });
    return updated;
  },

  /** 依 userId 取得會員資料 */
  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, avatar: true },
    });
    if (!user) throw new Error("使用者不存在");
    return user;
  },
};