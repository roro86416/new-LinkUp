import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

// 模組匯入
import productRoutes from "./modules/product/products-routes.js";
import authRoutes from "./modules/auth/auth-routes.js";
import memberProfileRoutes from "./modules/member/memberProfile/memberProfile.routes.js";
import adminAuthRoutes from "./modules/admin-auth/adminAuth.routes.js";
import accountSettingsRoutes from "./modules/member/AccountSettings/accountSettings.routes.js";
import adminMemberRoutes from "./modules/admin-member/member.routes.js";

dotenv.config();

const app: Express = express();

// --- 全域中間件 ---
app.use(express.json());

// --- CORS 設定（允許前端 localhost:3000 存取，含 cookies/token） ---
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

// --- 測試用路由 ---
app.get("/api/test", (req: Request, res: Response) => {
  res.json({ message: "愛來自 LinkUp 伺服器! 🚀" });
});

// --- 模組路由註冊 ---

// 產品模組
app.use("/api/v1/products", productRoutes);

// 登入註冊模組
app.use("/api/auth", authRoutes);

// 後台登入模組
app.use("/api/admin", adminAuthRoutes);

// 後台會員管理模組
app.use("/api/admin/members", adminMemberRoutes);

// 會員資料模組
app.use("/api/member", memberProfileRoutes); // 維持 /api/member 作為基礎路徑

// 帳號設定模組
app.use("/api/member/account-settings", accountSettingsRoutes);


// --- （未使用的主辦方模組預留）---
// app.use("/api/v1/organizer", organizerRoutes);

export default app;
