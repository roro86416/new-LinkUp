import prisma from "../../utils/prisma-only.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AdminLoginInput } from "./adminAuth.schema.js";

const JWT_SECRET = process.env.JWT_ADMIN_SECRET || "adminsecretkey"; // 建議使用不同的 Secret

export const loginAdmin = async (input: AdminLoginInput) => {
  const { email, password } = input;

  // 1. 根據 email 查詢 Admin
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) {
    throw new Error("帳號或密碼錯誤");
  }

  // 2. 驗證密碼
  const isPasswordValid = await bcrypt.compare(password, admin.password_hash);
  if (!isPasswordValid) {
    throw new Error("帳號或密碼錯誤");
  }

  // 3. 生成 JWT
  const payload = {
    id: admin.id,
    role: "admin", // 明確標示角色
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" }); // Token 有效期為 1 天

  return token;
};

export const getAdminProfile = async (adminId: string) => {
  const admin = await prisma.admin.findUnique({
    where: { id: adminId },
    select: {
      id: true,
      email: true,
      name: true,
      created_at: true,
    },
  });

  if (!admin) throw new Error("找不到管理員");
  return admin;
};