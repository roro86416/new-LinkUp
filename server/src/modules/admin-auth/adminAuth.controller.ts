import { Request, Response, NextFunction } from "express";
import { getAdminProfile, loginAdmin } from "./adminAuth.service.js";
import { AdminLoginInput } from "./adminAuth.schema.js";
import { AuthRequest } from "../../middleware/auth.middleware.js";

export const loginAdminHandler = async (
  req: Request<{}, {}, AdminLoginInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = await loginAdmin(req.body);
    res.status(200).json({ token });
  } catch (error: any) {
    // 為了安全，統一回傳通用錯誤訊息
    res.status(401).json({ message: "帳號或密碼錯誤" });
  }
};

export const getAdminProfileHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const adminId = req.user?.id;
    if (typeof adminId !== "string") {
      return res.status(401).json({ message: "無效的權杖" });
    }
    const admin = await getAdminProfile(adminId);
    res.status(200).json(admin);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};