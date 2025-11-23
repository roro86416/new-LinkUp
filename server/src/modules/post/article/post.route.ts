import express from "express";
// 由於我們是旁路策略，auth.middleware 將不再使用
// import { auth } from "../../middleware/auth.middleware.js"; 
import { createPostController, getPostsController, getPostById} from "./post.controller.js"; 


const router = express.Router();

// 🟢 文章發布：移除 auth("member") 認證中間件
// 現在任何人都可以訪問此路由
router.post("/", createPostController); 

// 文章列表
router.get("/", getPostsController); 

router.get("/:id", getPostById);

// ... 其他路由 ...

export default router;