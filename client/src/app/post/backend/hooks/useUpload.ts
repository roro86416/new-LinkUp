// src/app/hooks/useUpload.ts
import { useState, useCallback } from "react";

export function useUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // 拖拉事件處理
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  // 拖拉放下的時候觸發上傳
  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    await uploadImage(file);
  }, []);

  // 上傳圖片的函式（可連接你的 API）
  const uploadImage = async (file: File) => {
    try {
      setUploading(true);

      // 假設你有 API 路由 /api/upload
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:3001/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setImageUrl(data.url); // 回傳上傳後的圖片網址
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  return {
    isDragging,
    uploading,
    imageUrl,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    uploadImage,
  };
}
