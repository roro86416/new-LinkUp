"use client";
import { useFormContext } from "react-hook-form";

export default function PostMetaForm() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="border p-6 rounded-xl bg-white shadow-sm flex flex-col gap-5">
      <h2 className="text-xl font-semibold text-gray-700">文章資訊</h2>

      <input
        type="text"
        {...register("title")}
        placeholder="文章標題"
        className="border p-3 rounded-lg"
      />
      {errors.title && <p className="text-red-500">{String(errors.title.message)}</p>}

      <input
        type="text"
        {...register("tags")}
        placeholder="標籤 (逗號分隔)"
        className="border p-3 rounded-lg"
      />
      {errors.tags && <p className="text-red-500">{String(errors.tags.message)}</p>}

      <input
        type="text"
        {...register("category")}
        placeholder="分類"
        className="border p-3 rounded-lg"
      />
      {errors.category && <p className="text-red-500">{String(errors.category.message)}</p>}

      <input
        type="text"
        {...register("link")}
        placeholder="活動連結（選填）"
        className="border p-3 rounded-lg"
      />
    </div>
  );
}
