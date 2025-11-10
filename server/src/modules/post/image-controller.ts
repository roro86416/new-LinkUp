import type { Request, Response } from "express";
import multer from "multer";
import prisma from "../../utils/prisma-only.js";
import express from "express"

const router = express.Router();

// 設定上傳位置與檔名
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // 圖片儲存在 server/uploads/
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// 上傳多張圖片 API
router.post(
  "/posts/:postId/images",
  upload.array("images", 10), // "images" 是前端的 formData 欄位名稱
  async (req: Request, res: Response) => {
    try {
      const postId = parseInt(req.params.postId);
      if (!postId) return res.status(400).json({ message: "缺少 postId" });

      if (!req.files || !(req.files instanceof Array)) {
        return res.status(400).json({ message: "沒有上傳檔案" });
      }

      // 建立資料庫紀錄
      const imageRecords = await Promise.all(
        req.files.map(async (file: Express.Multer.File) => {
          return prisma.postImage.create({
            data: {
              post_id: postId,
              image_url: `/uploads/${file.filename}`, // 可依實際靜態路徑調整
              is_cover: false,
            },
          });
        })
      );

      return res.status(201).json({
        message: "圖片上傳成功",
        data: imageRecords,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "伺服器錯誤" });
    }
  }
);

export default router;
