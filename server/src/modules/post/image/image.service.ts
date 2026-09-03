import path from "path";
import { UPLOAD_DIR_PATH } from "../../../middleware/upload.js";

/**
 * 把 multer 處理完的 file 轉成可公開的 URL（或儲存位置）
 * 這裡範例為回傳相對 /uploads/xxx 的路徑，實際上線請改成 CDN 或完整 URL。
 */
export const saveImageFile = async (file: Express.Multer.File) => {
  // file.path 等於 `${UPLOAD_DIR}/${filename}`
  const filename = path.basename(file.path);
  // 假設你的 express.static 已經掛載 /uploads -> UPLOAD_DIR_PATH
  // 所以前端可透過 http://{host}/uploads/{filename} 取得
  const url = `/uploads/${filename}`;
  return url;
};
