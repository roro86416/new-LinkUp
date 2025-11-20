import { Request, Response } from "express";
import * as ImageService from "./image.service.js";

/**
 * POST /image/upload
 * form-data { file: File }
 */
export const uploadImage = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ success: false, message: "No file" });

    const url = await ImageService.saveImageFile(file);
    return res.status(201).json({ success: true, url });
  } catch (err: any) {
    console.error("uploadImage error:", err);
    return res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};
