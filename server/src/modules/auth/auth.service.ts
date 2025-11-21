import prisma from "../../utils/prisma-only.js";
import bcrypt from "bcryptjs";
import { RegisterInput, LoginInput } from "./auth.schema.js";

export const authService = {
  /** 註冊 */
  async register(data: RegisterInput) {
    const { email, password, name, avatar } = data;

    // 檢查是否已存在
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new Error("此 Email 已被註冊");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 預設名稱與預設頭像
    const defaultName = name || email.split("@")[0] || `User_${Date.now()}`;
    const defaultAvatar =
      avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"; // ✅ 預設頭像圖片

    // 建立使用者
    const user = await prisma.user.create({
      data: {
        email,
        password_hash: hashedPassword,
        name: defaultName,
        avatar: defaultAvatar,
        role: "MEMBER",
        is_active: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        created_at: true,
      },
    });

    return user;
  },

  /** 登入 */
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
    };
  },

  // 🔥 [新增] 這是您缺少的關鍵函式！
  /** 透過 Email 查找用戶 (Google Login 專用) */
  async findUserByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
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