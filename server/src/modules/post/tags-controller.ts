// src/routes/tagRouter.ts
import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import prisma from "../../utils/prisma-only";

const router = Router();

// 新增標籤
router.post("/", async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "標籤名稱必填" });

  try {
    const tag = await prisma.postTag.create({ data: { name } });
    res.json(tag);
  } catch (err: any) {
    if (err.code === "P2002") {
      res.status(400).json({ error: "標籤名稱已存在" });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// 修改標籤名稱
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const updated = await prisma.postTag.update({
      where: { id: Number(id) },
      data: { name },
    });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 刪除標籤
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.contactTag.deleteMany({ where: { tag_id: Number(id) } });
    await prisma.postTag.delete({ where: { id: Number(id) } });
    res.json({ message: "刪除成功" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 查詢所有標籤
router.get("/", async (_req, res) => {
  const tags = await prisma.postTag.findMany();
  res.json(tags);
});

// 查單一標籤及關聯文章
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const tag = await prisma.postTag.findUnique({
    where: { id: Number(id) },
    include: {
      posts: {
        include: { post: true }, // post: user_posts 資料
      },
    },
  });

  if (!tag) return res.status(404).json({ error: "標籤不存在" });
  res.json(tag);
});

export default router;
