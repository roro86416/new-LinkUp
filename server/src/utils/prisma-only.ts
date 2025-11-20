import { PrismaClient } from "../generated/prisma/client.js";

// 建立一個 PrismaClient 的單一實體
const prisma = new PrismaClient();

// 將這個實體匯出，讓其他檔案可以 import 並使用它
export default prisma;