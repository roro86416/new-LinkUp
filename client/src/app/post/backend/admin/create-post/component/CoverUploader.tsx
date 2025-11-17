"use client";

import React, { useState, useCallback } from "react";
import { Plus, Trash2, RotateCcw } from "lucide-react";
import { useUpload } from "../../../hook/useUpload";
import CropperModal from "./CropperModal";

export default function HeaderUpload() {
  // 先宣告 modal state
  const [openCropper, setOpenCropper] = useState(false);
  const openCropperModal = useCallback(() => setOpenCropper(true), []);
  const closeCropperModal = useCallback(() => setOpenCropper(false), []);

  const [previewList, setPreviewList] = useState<string[]>([]);

  const {
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
  } = useUpload(openCropperModal); // ✅ 先宣告再傳入

  // 裁切完成 → 上傳後端 → 更新 imageUrl
  const handleCropComplete = useCallback(
    async (file: File) => {
      const url = await uploadToServer(file);
      if (url) {
        setImageUrl(url);
        setPreviewList((prev) => [...prev, url]);
      }
    },
    [uploadToServer, setImageUrl]
  );

  // 選檔觸發：放入 rawFile 並直接開 modal
  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setRawFile(file);
        openCropperModal();
      }
      e.currentTarget.value = ""; // 清空 input 允許連續選同一檔
    },
    [setRawFile, openCropperModal]
  );


  return (
    <div className="relative w-full border rounded-xl overflow-hidden bg-gray-100">
      {imageUrl && (
        <img
          src={imageUrl}
          className="absolute inset-0 w-full h-full object-cover opacity-40 blur-sm"
          alt="cover preview"
        />
      )}

      <div
        className={`relative p-20 border-2 border-dashed transition 
          ${isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300"}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {uploading && <p className="text-center text-gray-600">上傳中...</p>}

        {!uploading && !imageUrl && (
          <div className="flex flex-col items-center gap-3 text-gray-600">
            <div className="p-4 bg-white shadow-md rounded-xl">
              <Plus size={28} />
            </div>
            <p className="font-medium">Upload photos and video</p>

            <label className="cursor-pointer text-blue-600 underline">
              選擇檔案
              <input
                type="file"
                name="file" // ✅ 必須和 Multer 一致
                accept="image/*"
                className="hidden"
                onChange={handleFileInputChange}
              />
            </label>
          </div>
        )}

        {imageUrl && (
          <div className="absolute top-4 right-4 flex gap-3">
            <button
              onClick={() => resetImage()}
              className="flex items-center gap-1 bg-white px-4 py-2 rounded-lg shadow hover:bg-gray-50"
            >
              <RotateCcw size={18} />
              重新上傳
            </button>
          </div>
        )}
      </div>

      {previewList.length > 0 && (
        <div className="w-full p-4 bg-white border-t overflow-x-auto">
          <div className="flex gap-3">
            {previewList.map((img, idx) => (
              <div key={idx} className="relative">
                <img
                  src={img}
                  className="h-20 w-32 object-cover rounded-lg shadow"
                  alt={`preview-${idx}`}
                />

                <button
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"
                  onClick={() =>
                    setPreviewList((prev) => prev.filter((_, i) => i !== idx))
                  }
                  aria-label="remove preview"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <CropperModal
        file={rawFile}
        open={openCropper}
        onClose={closeCropperModal}
        onCrop={handleCropComplete}
      />
    </div>
  );
}
