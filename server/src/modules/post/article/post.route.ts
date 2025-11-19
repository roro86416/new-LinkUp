import { Router } from "express";
// ❌ 移除對 auth 的匯入
// import { auth } from "../../../middleware/auth.middleware.js"; 
import { createPostController } from "./post.controller.js";
// 假設您還有這個
import { getPostsController } from "./post.controller.js"; 

const router = Router();

// 🚀 關鍵修改：移除 auth("member")
router.post(
    "/", 
    // 移除 auth("member")
    createPostController        
);

router.get("/", getPostsController); 

export default router;