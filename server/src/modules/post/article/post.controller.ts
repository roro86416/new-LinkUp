import { Request, Response } from "express";
import { createPostSchema } from "./post.schema.js";
import * as PostsService from "./post.service.js";

export const createPostController = async (req: Request, res: Response) => {
  try {
    // 假設你已用某個中介拿到登入 user，存在 req.user
    const author_id = (req as any).user?.id || "system"; // 改成你的 session 方式
    // 驗證 body（若要先驗證）
    const parsed = createPostSchema.parse(req.body);

    const post = await PostsService.createPost(parsed, author_id);

    return res.status(201).json({ success: true, id: post.id });
  } catch (err: any) {
    console.error("createPostController error:", err);
    // 若是 zod 驗證錯誤，可回 400 與細節
    if (err?.name === "ZodError") {
      return res.status(400).json({ success: false, issues: err.errors });
    }
    return res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};
