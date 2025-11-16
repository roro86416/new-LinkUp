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

  const uploadToServer = async (file: File) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file); // 名稱要和 Multer 一致

      const res = await fetch("http://localhost:3001/post/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        console.error("Upload failed:", data.message);
        return null;
      }

      return data.url as string;
    } catch (err) {
      console.error("Upload error:", err);
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
