// src/middleware/validateComment.js
import type { NextFunction, Request, Response } from 'express';
export const validateComment = (req: Request, res: Response, next: NextFunction) => {
  const { authorId, content, rating, post_id } = req.body;

  if (!authorId || !content || rating == null || !post_id) {
    res.status(400).json({ error: "authorId, content, rating, and post_id are required" });
    return;
  }

  if (content.length > 200) {
        return res.status(400).json({ error: "Content too long (max 200 chars)." });
    }
  next();
};
