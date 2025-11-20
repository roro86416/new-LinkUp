import { Request, Response } from "express";
import { createPostSchema } from "./post.schema.js";
<<<<<<< HEAD
import * as PostsService from "./post.service.js"; // ✅ namespace 導入

// --- 建立文章 ---
export const createPostController = async (req: Request, res: Response) => {
  try {
    // 1. Zod 驗證
    const parsed = createPostSchema.parse(req.body);

    // 2. 取 author_id
    const author_id = parsed.author_id;

    // 3. 呼叫 Service
    const post = await PostsService.createPost(parsed, author_id);

    return res.status(201).json({ 
      success: true, 
      id: post.id,
      redirectUrl: `/post/detail/${post.id}`
    });
=======
import * as PostsService from "./post.service.js";

export const createPostController = async (req: Request, res: Response) => {
  try {
    const author_id = (req as any).user?.id || "system";

    const parsed = createPostSchema.parse(req.body);

    const post = await PostsService.createPost(parsed, author_id);

    return res.status(201).json({ success: true, id: post.id });
>>>>>>> 77744d70939425ae86e1cda0cce80e81ffbf3a67
  } catch (err: any) {
    console.error("createPostController error:", err);

    if (err?.name === "ZodError") {
      return res.status(400).json({ success: false, issues: err.errors });
    }

    return res.status(500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
};
<<<<<<< HEAD

// --- 取得文章列表 ---
export const getPostsController = (req: Request, res: Response) => {
  // 這裡寫入從資料庫查詢文章列表的邏輯
  res.status(200).json({ message: "文章列表獲取成功！", data: [] });
};

// --- 取得單篇文章 ---
export const getPostById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    // ✅ 使用 namespace 呼叫
    const post = await PostsService.getPostByIdService(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.json(post);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
=======
>>>>>>> 77744d70939425ae86e1cda0cce80e81ffbf3a67
