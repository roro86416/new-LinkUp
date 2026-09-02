import { Router } from "express";
import { upload } from "../../../middleware/upload.js";
import { uploadImage } from "./image.controller.js";

const router = Router();

// single('file') -> 前端表單欄位名字用 file（你前端可以改成 cover 等）
router.post("/upload", upload.single("file"), uploadImage);

export default router;
