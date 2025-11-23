// PostMetaForm.tsx
"use client";
import { useFormContext } from "react-hook-form";
// 假設您在 CreatePostPage 中使用了 PostFormData，我們需要它來解決 useFormContext 的類型問題
// 由於這裡無法導入上層的 PostFormData，我們將使用 FormContext 提供的預設類型
// 在實際應用中，您會將 PostFormData 傳給 useFormContext<PostFormData>()

export default function PostMetaForm() {
  const { register, formState: { errors } } = useFormContext();

  return (
   
    <div className="bg-white p-6 rounded-xl shadow-xl flex flex-col gap-4 dark:bg-gray-800">
      
      {/* 標題優化：更粗體，並使用分隔線 */}
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 pb-3 border-b border-gray-200 dark:border-gray-700">
        文章資訊
      </h2>

      {/* 標題欄位 */}
      <div className="flex flex-col gap-1">
        <label className="font-medium text-gray-700 dark:text-gray-200">標題（必填）</label>
        <input
          type="text"
          {...register("title")}
          placeholder="請輸入文章標題"
          
          className="w-full bg-gray-200 p-4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all dark:bg-gray-700 dark:text-gray-100"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{String(errors.title.message)}</p>
        )}
      </div>

      {/* 標籤欄位 */}
      <div className="flex flex-col gap-1">
        <label className="font-medium text-gray-700 dark:text-gray-200">標籤（用逗號分隔）</label>
        <input
          type="text"
          {...register("tags")}
          placeholder="例如：生活, 美食, 職涯"
          
          className="w-full bg-gray-200 p-4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all dark:bg-gray-700 dark:text-gray-100"
        />
        {errors.tags && (
          <p className="text-red-500 text-sm mt-1">{String(errors.tags.message)}</p>
        )}
      </div>

      {/* 分類欄位 */}
      <div className="flex flex-col gap-1">
        <label className="font-medium text-gray-700 dark:text-gray-200">分類（必填）</label>
        <input
          type="text"
          {...register("category")}
          placeholder="輸入分類，例如：心得、教學、紀錄"
          
          className="w-full bg-gray-200 p-4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all dark:bg-gray-700 dark:text-gray-100"
        />
        {errors.category && (
          <p className="text-red-500 text-sm mt-1">{String(errors.category.message)}</p>
        )}
      </div>

      {/* 活動網址欄位 */}
      <div className="flex flex-col gap-1">
        <label className="font-medium text-gray-700 dark:text-gray-200">活動網址（選填）</label>
        <input
          type="text"
          {...register("link")}
          placeholder="如果是活動文章，可填入活動連結"
         
          className="w-full bg-gray-200 p-4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all dark:bg-gray-700 dark:text-gray-100"
        />
      </div>
    </div>
  );
}