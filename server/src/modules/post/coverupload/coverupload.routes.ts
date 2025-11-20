// modules/post/upload.routes.ts

import express, { Request, Response, Router } from "express";
import multer, { MulterError } from "multer"; // 導入 MulterError 確保類型安全
import path from "path";
import fs from "fs";

const router: Router = express.Router();

// 設置儲存引擎 (使用 diskStorage 來完全控制檔案路徑和名稱)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 儲存到專案根目錄下的 'uploads'
    // process.cwd() 取得專案執行目錄
    const uploadPath = path.join(process.cwd(), 'uploads'); 
    
    // 確保目錄存在
    if (!fs.existsSync(uploadPath)) {
        // 使用同步方法確保目錄在寫入前就建立好
        fs.mkdirSync(uploadPath, { recursive: true }); 
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // 確保檔名唯一，使用時間戳 + 隨機數 + 原始副檔名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
  }
});

const upload = multer({ storage: storage });

// 定義 POST 路由
router.post("/", upload.single("file"), (req: Request, res: Response) => {
  // Multer 處理後的檔案資訊會掛載在 req.file 上
  const file = req.file;

  if (!file) {
    // 處理檔案不存在的情況 (例如使用者沒有選檔案)
    return res.status(400).json({ 
        success: false,
        message: "沒有檔案上傳或檔案欄位名稱錯誤。" 
    });
  }

  // 假設後端伺服器運行在 3001 端口
  // 構造回傳給前端的公開 URL (重要：必須與 server.ts 中的靜態服務路徑 '/uploads' 對應)
  const fileUrl = `http://localhost:3001/uploads/${file.filename}`;

  // 成功回傳檔案的公開 URL
  res.json({ 
    success: true,
    message: '檔案上傳成功', 
    url: fileUrl // 前端 HeaderUpload.tsx 需要這個 URL 來顯示預覽圖
  });
});

export default router;