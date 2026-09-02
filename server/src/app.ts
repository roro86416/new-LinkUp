<<<<<<< HEAD
import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

// 模組匯入
=======
//必要模組
import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
// 功能匯入
>>>>>>> origin/main-final
import productRoutes from "./modules/product/products.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import memberProfileRoutes from "./modules/member/memberProfile/memberProfile.routes.js";
import adminAuthRoutes from "./modules/admin-auth/adminAuth.routes.js";
import accountSettingsRoutes from "./modules/member/AccountSettings/accountSettings.routes.js";
import adminMemberRoutes from "./modules/admin-member/member.routes.js";
import organizerRoutes from "./modules/organizer/organizer.routes.js";
import eventRatingsRoutes from "./modules/event-ratings/event-ratings.routes.js";
<<<<<<< HEAD
=======
import uploadRoutes from "./modules/post/coverupload/coverupload.routes.js"
import postRoute from "./modules/post/article/post.route.js"
import imageRoutes from "./modules/post/image/image.route.js";
import eventRoutes from "./modules/events/events.routes.js";
import notificationRoutes from "./modules/notification/notification.routes.js";
import orderRoutes from "./modules/orders/orders.routes.js";
import checkInRoutes from './modules/check-in/check-in.routes.js';
import eventWeatherRoutes from "./modules/event-weather/event-weather.routes.js";
import eventSearchRoutes from "./modules/event-search/event-search.routes.js";
import eventStatsRoutes from "./modules/event-stats/event-stats.routes.js";

import { startOrderScheduler } from "./tasks/orderScheduler.js";

// 中間件匯入
import { errorHandler } from "./middleware/error.middleware.js";
>>>>>>> origin/main-final

dotenv.config();

const app: Express = express();

// --- 全域中間件 ---
app.use(express.json());
<<<<<<< HEAD

=======
app.use(express.urlencoded({ extended: true }));
>>>>>>> origin/main-final
// --- CORS 設定（允許前端 localhost:3000 存取，含 cookies/token） ---
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
<<<<<<< HEAD
=======
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")))

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
>>>>>>> origin/main-final

// --- 測試用路由 ---
app.get("/api/test", (req: Request, res: Response) => {
  res.json({ message: "愛來自 LinkUp 伺服器! 🚀" });
});

<<<<<<< HEAD
// --- 模組路由註冊 ---
=======
// --- 模組路import uploadRoutes from "./modules/post/coverupload/coverupload.Schema.js"由註冊 ---
>>>>>>> origin/main-final

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
app.use("/api/v1/organizer", organizerRoutes);

// 模組四 (使用者購買票券) 路由 ->活動評論API
app.use("/api/ratings", eventRatingsRoutes);
<<<<<<< HEAD
=======
// 活動搜尋與篩選模組 
app.use("/api/events", eventSearchRoutes);
// 活動統計模組 (Event Stats)
app.use("/api/events", eventStatsRoutes);
// 查詢活動當地天氣
app.use("/api/events", eventWeatherRoutes);


app.use("/api/v1/events", eventRoutes);

app.use("/api/notifications", notificationRoutes);

app.use("/api/v1/orders", orderRoutes);

// 工作人員票券驗證模組
app.use('/api/v1/check-in', checkInRoutes);

// 新增：圖片上傳 API
app.use("/post/upload", uploadRoutes);

app.use("/post", postRoute);

app.use("/image", imageRoutes);

startOrderScheduler();

// --- 全域錯誤處理中介軟體 (必須放在所有路由之後) ---
app.use(errorHandler);

>>>>>>> origin/main-final

export default app;
