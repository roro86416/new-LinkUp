// src/routes/commentRoutes.ts
import express, { Request, Response } from "express";
// import prisma from "../../prismaClient";
// import { Prisma } from "@prisma/client";
import { validateComment } from "../../middleware/comment.middleware"
// import { PrismaClient } from "@prisma/client";
import { Prisma } from "@prisma/client";
import prisma from "../../utils/prisma-only";
import { string } from "zod";

const router = express.Router();
// const prisma = new PrismaClient

// ==========================
//  Controller + API
// ==========================

// 取得全部留言
const getAllComments = async (req: Request, res: Response): Promise<void> => {
  try {
    const comments = await prisma.postReview.findMany({
      orderBy: { created_at: "desc" },
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};

// 取得單一留言
const getCommentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const comment = await prisma.postReview.findUnique({
      where: { id: Number(id) },
    });

    if (!comment) {
      res.status(404).json({ error: "Comment not found" });
      return;
    }

    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch comment" });
  }
};

// 新增留言
const createComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { authorId, content, rating, post_id } = req.body;

    if (!authorId || !content || rating == null || !post_id) {
      res.status(400).json({ error: "authorId, content, rating, and post_id are required" });
      return;
    }

    if (rating < 0 || rating > 5) {
      res.status(400).json({ error: "Rating must be between 0 and 5" });
      return;
    }

    const newComment = await prisma.postReview.create({
      data: {
        user_id: String(),
        content: String(content),
        post_id: Number(post_id),
        rating: Number(rating),
        created_at: new Date(),
      }
    });

    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create comment" });
  }
};

// 更新留言
const updateComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const existing = await prisma.postReview.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      res.status(404).json({ error: "Comment not found" });
      return;
    }

    const updated = await prisma.postReview.update({
      where: { id: Number(id) },
      data: { content },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update comment" });
  }
};

// 刪除留言
const deleteComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const existing = await prisma.postReview.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      res.status(404).json({ error: "Comment not found" });
      return;
    }

    await prisma.postReview.delete({ where: { id: Number(id) } });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete comment" });
  }
};

// ==========================
//  Routes
// ==========================
router.get("/", getAllComments);                  // GET /api/comments
router.get("/:id", getCommentById);              // GET /api/comments/:id
router.post("/", validateComment, createComment); // POST /api/comments
router.put("/:id", validateComment, updateComment); // PUT /api/comments/:id
router.delete("/:id", deleteComment);           // DELETE /api/comments/:id

export default router;
