"use client";
import { useFormContext } from "react-hook-form";

export default function PostMetaForm() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="border p-6 rounded-xl bg-white shadow-sm flex flex-col gap-5">
      <h2 className="text-xl font-semibold text-gray-700">文章資訊</h2>

      {/* 標題 */}
      <div className="flex flex-col gap-1">
        <label className="font-medium text-gray-600">標題（必填）</label>
        <input
          type="text"
          {...register("title")}
          placeholder="請輸入文章標題"
          className="border p-3 rounded-lg"
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{String(errors.title.message)}</p>
        )}
      </div>

      {/* 標籤 */}
      <div className="flex flex-col gap-1">
        <label className="font-medium text-gray-600">標籤（用逗號分隔）</label>
        <input
          type="text"
          {...register("tags")}
          placeholder="例如：生活, 美食, 職涯"
          className="border p-3 rounded-lg"
        />
        {errors.tags && (
          <p className="text-red-500 text-sm">{String(errors.tags.message)}</p>
        )}
      </div>

      {/* 分類：字串 */}
      <div className="flex flex-col gap-1">
        <label className="font-medium text-gray-600">分類（必填）</label>
        <input
          type="text"
          {...register("category")}
          placeholder="輸入分類，例如：心得、教學、紀錄"
          className="border p-3 rounded-lg"
        />
        {errors.category && (
          <p className="text-red-500 text-sm">{String(errors.category.message)}</p>
        )}
      </div>

      {/* 活動連結 */}
      <div className="flex flex-col gap-1">
        <label className="font-medium text-gray-600">活動網址（選填）</label>
        <input
          type="text"
          {...register("link")}
          placeholder="如果是活動文章，可填入活動連結"
          className="border p-3 rounded-lg"
        />
      </div>
    </div>
  );
}
