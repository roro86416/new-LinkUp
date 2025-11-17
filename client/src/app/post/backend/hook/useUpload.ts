"use client";

import { useState, useCallback } from "react";

export function useUpload(openCropperModal: () => void) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [rawFile, setRawFile] = useState<File | null>(null);

  const resetImage = () => {
    setImageUrl(null);
    setRawFile(null);
  };

  // useUpload.ts

const uploadToServer = async (file: File) => {
  try {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file); // 名稱要和 Multer 一致

    const res = await fetch("http://localhost:3001/post/upload", {
      method: "POST",
      body: formData,
    });
    
    // ⭐️ 關鍵檢查 1：檢查響應是否成功 (狀態碼 200-299)
    if (!res.ok) {
        // 嘗試讀取響應文本來診斷錯誤（可能會是 HTML）
        const errorText = await res.text();
        console.error("Upload failed with status:", res.status, res.statusText);
        console.error("Server response (HTML/Text):", errorText.substring(0, 100) + '...'); // 僅印出開頭部分
        // 📢: 檢查您的後端日誌，看看 /post/upload 是否有收到請求！
        return null;
    }

    // ⭐️ 關鍵檢查 2：現在才嘗試解析 JSON
    const data = await res.json(); 

    if (!data.success) {
      console.error("Upload failed (Backend success=false):", data.message);
      return null;
    }

    return data.url as string;
  } catch (err) {
    console.error("Upload error during fetch or JSON parsing:", err);
    return null;
  } finally {
    setUploading(false);
  }
};

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      setRawFile(file);
      openCropperModal(); // 拖曳直接開 modal
    }
  }, [openCropperModal]);

  return {
    isDragging,
    uploading,
    imageUrl,
    rawFile,
    setRawFile,
    setImageUrl,
    uploadToServer,
    resetImage,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
}