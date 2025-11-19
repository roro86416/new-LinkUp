import { Request, Response } from "express";
import { createPostSchema } from "./post.schema.js";
import * as PostsService from "./post.service.js";

// src/modules/post/post.controller.js 裡面的 createPostController 函數

export const createPostController = async (req: Request, res: Response) => {
  try {
    // 1. 執行 Zod 驗證，現在 req.body 必須包含 author_id 欄位
    const parsed = createPostSchema.parse(req.body);
    
    // 2. 從解析後的物件中提取 author_id，取代從 req.user 獲取
    const author_id = parsed.author_id; 

    // 移除原有的 if (!author_id) { ... } 檢查，因為 Zod 已經處理了
    // 您的 Service 函數仍然接收 parsed 和 author_id 兩個參數，不變
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
