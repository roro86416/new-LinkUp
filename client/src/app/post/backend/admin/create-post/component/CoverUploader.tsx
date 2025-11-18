// modules/post/component/CoverUploader.tsx (您的 CoverForm 元件)

"use client";

import React, { useCallback, useState } from "react";
import CropperModal from "./CropperModal"; // 假設路徑正確
import { useUpload } from "../../../hook/useUpload"; // 假設路徑正確
import { ImageUp, RefreshCcw, Trash2 } from "lucide-react";
import { useFormContext } from "react-hook-form"; // ⭐️ 導入 useFormContext

// 假設您的 PostFormData 有 coverImage 欄位
// interface PostFormData { coverImage: string; ... }

export default function CoverForm() {
  // ⭐️ 關鍵：從 context 取得 setValue 函式和 watch 函式
  const { setValue, watch } = useFormContext();
  const currentCoverImage = watch("coverImage"); // 監聽當前表單中的 coverImage 值

  const [openCropper, setOpenCropper] = useState(false);

  // 初始化 useUpload Hook
  const {
    isDragging,
    uploading,
    imageUrl: hookImageUrl, // 暫時使用 hookImageUrl 避免命名衝突
    rawFile,
    uploadToServer,
    resetImage,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
    // 雖然 useUpload 中有 imageUrl 和 setImageUrl，但我們將以 react-hook-form 為主
  } = useUpload(() => setOpenCropper(true));

  // 裁切完成後的處理函式
  const handleCropComplete = useCallback(
    async (croppedFile: File) => {
      setOpenCropper(false); // 關閉裁切 Modal

      // 上傳裁切後的檔案到後端
      const url = await uploadToServer(croppedFile);

      if (url) {
        // ⭐️ 關鍵：將上傳成功的 URL 寫入 react-hook-form 的 coverImage 欄位
        setValue("coverImage", url, { shouldValidate: true, shouldDirty: true });
      } else {
        // 上傳失敗時，清空圖片
        resetImage();
        setValue("coverImage", "", { shouldValidate: true, shouldDirty: true });
      }
    },
    [uploadToServer, setValue, resetImage]
  );

  // 處理重新上傳
  const handleReupload = () => {
    resetImage(); 
    setValue("coverImage", "", { shouldValidate: true, shouldDirty: true });
    // 注意：resetImage 必須將 rawFile 設為 null，以關閉任何殘餘的預覽。
  };

  // 處理刪除圖片
  const handleDeleteImage = () => {
    resetImage();
    setValue("coverImage", "", { shouldValidate: true, shouldDirty: true });
  };


  // ⭐️ 修正顯示：現在我們只依賴 hook-form 中的 coverImage 值
  const displayImageUrl = currentCoverImage; 

  return (
    <>
      <h2 className="text-xl font-semibold mb-3">封面圖片 (16:9)</h2>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative w-full h-[300px] border-2 border-dashed rounded-lg flex items-center justify-center 
                    text-gray-500 transition-all duration-300 ${
                      isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"
                    }`}
      >
        {uploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white z-10">
            <p>上傳中...</p>
          </div>
        )}

        {/* ⭐️ 核心顯示邏輯：只顯示單張圖片並居中填滿 */}
        {displayImageUrl ? (
          <>
            <img 
              src={displayImageUrl} 
              alt="封面圖預覽" 
              // 修正圖片顯示比例和位置的關鍵 CSS
              className="absolute inset-0 w-full h-full object-cover rounded-lg" 
            />
            {/* 重新上傳和刪除按鈕 */}
            <div className="absolute top-4 right-4 flex gap-2 z-10">
              <button 
                type="button" // 必須設置 type="button" 避免觸發表單提交
                onClick={handleReupload} 
                className="flex items-center gap-1 px-3 py-1 bg-white text-gray-700 rounded-full shadow-md hover:bg-gray-100 transition"
              >
                <RefreshCcw size={16} /> 重新上傳
              </button>
              <button 
                type="button"
                onClick={handleDeleteImage} 
                className="p-1 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </>
        ) : (
          <label htmlFor="file-upload" className="cursor-pointer text-center">
            <ImageUp size={48} className="mx-auto mb-2 text-gray-400" />
            <p className="text-lg font-medium">拖曳圖片到此處，或 <span className="text-blue-600 hover:underline">點擊選擇檔案</span></p>
            <p className="text-sm text-gray-400 mt-1">建議比例 16:9</p>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect} // 使用 useUpload 中的處理函式
            />
          </label>
        )}
      </div>

      {/* 裁切 Modal */}
      {rawFile && (
        <CropperModal
          file={rawFile}
          open={openCropper}
          onClose={() => setOpenCropper(false)}
          onCrop={handleCropComplete}
        />
      )}
    </>
  );
}