"use client";
import { useState } from "react";

export default function PostContentForm() {
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setImages([...images, ...newImages]);
    }
  };

  return (
    <div className="border p-6 rounded-xl bg-white shadow-sm flex flex-col gap-5">
      <h2 className="text-xl font-semibold text-gray-700">Post Content</h2>

      {/* 文章內容 */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your article here..."
        className="border rounded-lg p-3 min-h-[180px]"
      />

      {/* 上傳多張圖片 */}
      <div>
        <label className="block mb-2 text-gray-600 font-medium">
          Upload additional images
        </label>
        <input type="file" multiple onChange={handleImageUpload} />
        <div className="flex gap-3 flex-wrap mt-3">
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`uploaded-${i}`}
              className="w-24 h-24 object-cover rounded-lg"
            />
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => console.log({ content, images })}
        className="bg-blue-600 text-white px-5 py-2 rounded-lg w-fit"
      >
        Save Draft
      </button>
    </div>
  );
}
