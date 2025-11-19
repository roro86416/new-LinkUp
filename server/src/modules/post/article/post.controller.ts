import { Request, Response } from "express";
import { createPostSchema } from "./post.schema.js";
import * as PostsService from "./post.service.js";

export const createPostController = async (req: Request, res: Response) => {
  try {
    const author_id = (req as any).user?.id; // 只取 ID

    // 🔥 檢查使用者是否通過認證
    if (!author_id) {
        // 如果沒有 ID，表示使用者未登入或認證失敗
        return res.status(401).json({ success: false, message: "Authentication required to create a post." });
    }

    const parsed = createPostSchema.parse(req.body);

    const post = await PostsService.createPost(parsed, author_id);

    return res.status(201).json({ success: true, id: post.id });
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

export const getPostsController = (req: Request, res: Response) => {
    // 這裡寫入從資料庫查詢文章列表的邏輯
    res.status(200).json({ message: "文章列表獲取成功！", data: [] });
};
