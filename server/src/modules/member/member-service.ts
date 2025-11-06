import prisma from "../../utils/prisma-only.js";
import bcrypt from "bcryptjs";
import { RegisterInput, LoginInput } from "./member-schema.js";


export const memberService = {
  async register(data: RegisterInput) {
    const { email, password, name } = data;

    // 檢查是否已存在
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new Error("此 Email 已被註冊");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 如果沒傳 name，自動取 email 前綴 或預設名稱
    const defaultName = name || email.split("@")[0] || `User_${Date.now()}`;

    const user = await prisma.user.create({
      data: {
        email,
        password_hash: hashedPassword,
        name: defaultName,
        role: "MEMBER",
      },
      select: { id: true, email: true, name: true, created_at: true },
    });

    return user;
  },

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
      role: user.role,
    };
  },
};
