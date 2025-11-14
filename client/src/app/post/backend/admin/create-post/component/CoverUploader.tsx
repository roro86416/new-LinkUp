// src/app/components/HeaderUpload.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { coverSchema, CoverSchemaType } from "../../../types/coverSchema"; 
import { useUpload } from "../../../hooks/useUpload";

export default function HeaderUpload() {
  const {
    isDragging,
    uploading,
    imageUrl,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    uploadImage,
  } = useUpload();
  const form = useForm<CoverSchemaType>({
  resolver: zodResolver(coverSchema),
  defaultValues: { coverImage: "" },
});

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-6 text-center transition ${
        isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {uploading ? (
        <p>上傳中...</p>
      ) : imageUrl ? (
        <img src={imageUrl} alt="Uploaded" className="w-48 h-48 object-cover mx-auto" />
      ) : (
        <>
          <p className="text-gray-500">拖曳圖片到這裡，或</p>
          <label className="cursor-pointer text-blue-500 underline">
            點擊上傳
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadImage(file);
              }}
            />
          </label>
        </>
      )}
    </div>
  );
}
