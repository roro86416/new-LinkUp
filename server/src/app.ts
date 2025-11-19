import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import productRoutes from "./modules/product/products.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import memberProfileRoutes from "./modules/member/memberProfile/memberProfile.routes.js";
import adminAuthRoutes from "./modules/admin-auth/adminAuth.routes.js";
import accountSettingsRoutes from "./modules/member/AccountSettings/accountSettings.routes.js";
import adminMemberRoutes from "./modules/admin-member/member.routes.js";
import organizerRoutes from "./modules/organizer/organizer.routes.js";
import eventRatingsRoutes from "./modules/event-ratings/event-ratings.routes.js";
import publicEventRoutes from './modules/events/events.routes.js';
dotenv.config();
import cartRoutes from './modules/cart/cart.routes.js'; 
import orderRoutes from './modules/orders/orders.routes.js';
import { startOrderScheduler } from "./tasks/orderScheduler.js"; // 倒計時
import checkInRoutes from './modules/check-in/check-in.routes.js';

const app: Express = express();

// --- 全域中間件 ---
app.use(express.json());

// --- CORS 設定（允許前端 localhost:3000 存取，含 cookies/token） ---
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// 公開活動模組
app.use('/api/v1/events', publicEventRoutes);

// 登入註冊模組
app.use("/api/auth", authRoutes);

// 後台登入模組
app.use("/api/admin", adminAuthRoutes);

// 後台會員管理模組
app.use("/api/admin/members", adminMemberRoutes);

// 會員資料模組
app.use("/api/member", memberProfileRoutes); 

// 帳號設定模組
app.use("/api/member/account-settings", accountSettingsRoutes);

// --- （未使用的主辦方模組預留）---
app.use("/api/v1/organizer", organizerRoutes);

// 產品模組
app.use("/api/v1/products", productRoutes);

// 購物車模組
app.use("/api/v1/cart", cartRoutes);

// 訂單模組
app.use("/api/v1/orders", orderRoutes);

// (使用者購買票券) 路由 ->活動評論API
app.use("/api/ratings", eventRatingsRoutes);


//倒計時
startOrderScheduler();

// 工作人員票券驗證模組
app.use('/api/v1/check-in', checkInRoutes);

export default app;
