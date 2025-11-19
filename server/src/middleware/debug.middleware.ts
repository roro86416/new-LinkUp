import { Request, Response, NextFunction } from "express";

/**
 * 臨時中介軟體：打印出請求的 Authorization Header
 */
export const debugAuth = (req: Request, res: Response, next: NextFunction) => {
    // ⚠️ 請仔細觀察控制台的輸出！
    console.log("--- DEBUG AUTH CHECK ---");
    console.log("Header Authorization:", req.headers.authorization); 

    // 檢查是否有 Authorization 屬性
    if (!req.headers.authorization) {
        console.log("❗ 警告：請求中缺少 Authorization Header。");
    } else {
        // 嘗試分割以確認格式
        const parts = req.headers.authorization.split(" ");
        if (parts.length === 2 && parts[0] === 'Bearer') {
            console.log("✅ 格式正確！Token 似乎存在於 Header 中。");
        } else {
            console.log("❌ 格式錯誤！不是 Bearer <token> 格式。", req.headers.authorization);
        }
    }
    console.log("------------------------");
    next(); // 繼續到 auth 中間件
};