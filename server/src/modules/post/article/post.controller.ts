import { Request, Response } from "express";
import { createPostSchema } from "./post.schema.js";
import * as PostsService from "./post.service.js";

export const createPostController = async (req: Request, res: Response) => {
  try {
    const author_id = (req as any).user?.id || "system";

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
