import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
// import organizerRoutes from "./api/api-organizer";
import productRoutes from "./modules/product/products-routes";
import postcategoryRoutes from "../src/modules/post/category-controller"
import postcommentRoutes from "../src/modules/post/comment-controller"
import postimageRoutes from "../src/modules/post/image-controller"
import posttagsRoutes from "../src/modules/post/tags-controller"
dotenv.config();
const app: Express = express();

// --- 中間件 (Middlewares) ---
app.use(cors());
app.use(express.json());

// 1. 測試路由
app.get("/api/test", (req: Request, res: Response) => {
  res.json({ message: "愛來自LinkUp伺服器! 🚀" });
});

// 2. 模組三 (產品) 路由
app.use("/api/v1/products", productRoutes);

// 3. 模組二 (主辦方) 路由
// app.use("/api/v1/organizer", organizerRoutes);
app.use("/api/comments",postcommentRoutes)
app.use("/api/category",postcategoryRoutes)
app.use("/api/Image",postimageRoutes)
app.use("/api/Tags",posttagsRoutes)

export default app;
