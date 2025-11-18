"use client";

import { useState, useCallback, useMemo } from "react";

// 定義 useUpload Hook 的回傳型別，提高程式碼可讀性
interface UseUploadReturn {
  isDragging: boolean;
  uploading: boolean;
  imageUrl: string | null;
  rawFile: File | null;
  previewUrl: string | null;
  setRawFile: (file: File | null) => void;
  setImageUrl: (url: string | null) => void;
  uploadToServer: (file: File) => Promise<string | null>;
  resetImage: () => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void; // 新增檔案選擇處理
}

/**
 * 用於處理封面圖片的拖放、選擇、上傳和裁切流程的 Hook。
 * 限制：每次只處理一張圖片。
 */
export function useUpload(openCropperModal: () => void): UseUploadReturn {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [rawFile, setRawFile] = useState<File | null>(null); // 儲存原始檔案，用於開啟裁切 Modal

  // 創建 Blob URL 用於前端預覽（如果需要）
  const previewUrl = useMemo(() => {
    if (rawFile) {
      return URL.createObjectURL(rawFile);
    }
    return imageUrl; // 如果已經有上傳 URL，也可以用它來預覽
  }, [rawFile, imageUrl]);

  const resetImage = () => {
    setImageUrl(null);
    setRawFile(null);
    // 釋放 Blob URL 記憶體（如果在其他地方沒有做，可以在這裡做）
    if (rawFile && previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  /**
   * 處理裁切後的單一檔案上傳到後端。
   */
  const uploadToServer = async (file: File) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file); // 必須與後端 Multer 的欄位名稱一致

      const res = await fetch("http://localhost:3001/post/upload", {
        method: "POST",
        body: formData,
      });
      
      // 檢查響應狀態碼，處理非 200 錯誤（如 404, 500）
      if (!res.ok) {
          const errorText = await res.text();
          console.error("Upload failed with status:", res.status, res.statusText);
          console.error("Server response (HTML/Text):", errorText.substring(0, 100) + '...');
          alert(`上傳失敗：伺服器錯誤 (${res.status})，請檢查後端日誌。`);
          return null;
      }

      const data = await res.json();

      if (!data.success) {
        console.error("Upload failed (Backend success=false):", data.message);
        alert(`上傳失敗：${data.message}`);
        return null;
      }
      
      // 由於您只需要一個封面圖，這裡直接返回 URL
      return data.url as string; 

    } catch (err) {
      console.error("Upload error during fetch or JSON parsing:", err);
      alert("上傳過程中發生網路或解析錯誤。");
      return null;
    } finally {
      setUploading(false);
    }
  };

  // --- 拖放處理邏輯 ---

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    
    // ⭐️ 核心限制：只處理第一個檔案，並檢查是否有超額
    if (files.length > 1) {
        alert("封面圖一次只能上傳一張！請只拖曳一個檔案。");
        return; 
    }
    
    const file = files[0];
    if (file) {
      setRawFile(file);
      openCropperModal(); // 拖曳成功後開啟裁切 Modal
    }
  }, [openCropperModal]);

  // --- 檔案選擇處理邏輯 ---
  
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    // ⭐️ 核心限制：只處理第一個檔案，並檢查是否有超額
    if (!files || files.length === 0) return;
    
    if (files.length > 1) {
        alert("封面圖一次只能上傳一張！請只選擇一個檔案。");
        // 清空 input 讓使用者可以重新選擇
        e.target.value = ''; 
        return;
    }
    
    const file = files[0];
    if (file) {
      setRawFile(file);
      openCropperModal(); // 選擇成功後開啟裁切 Modal
    }
    
    // 清空 input 的值，以便使用者再次選擇同一個檔案也能觸發 onChange
    e.target.value = ''; 
  }, [openCropperModal]);
  
  // --- 回傳 ---

  return {
    isDragging,
    uploading,
    imageUrl,
    rawFile,
    previewUrl,
    setRawFile,
    setImageUrl,
    uploadToServer,
    resetImage,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect, // 必須在您的 HeaderUpload.tsx 中使用這個函式
  };
}