"use client";
import { useState } from "react";

export default function HeaderUpload() {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="relative w-full h-64 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
      {preview ? (
        <img src={preview} alt="preview" className="object-cover w-full h-full" />
      ) : (
        <label className="cursor-pointer flex flex-col items-center justify-center text-gray-500 hover:text-blue-500">
          <input type="file" className="hidden" onChange={handleFileChange} />
          <span className="text-lg font-medium">Upload cover image</span>
        </label>
      )}
    </div>
  );
}
