"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema } from "../types/postschema";
import { z } from "zod";

type PostFormData = z.infer<typeof postSchema>;

export default function CreatePostForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
  });

  const onSubmit = (data: PostFormData) => {
    console.log("✅ 表單通過驗證：", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 封面圖片 URL */}
      <input
        {...register("coverImage")}
        placeholder="封面圖片網址"
        className="border p-2 w-full"
      />
      {errors.coverImage && (
        <p className="text-red-500">{errors.coverImage?.message as string}</p>
      )}

      {/* 標題 */}
      <input
        {...register("title")}
        placeholder="文章標題"
        className="border p-2 w-full"
      />
      {errors.title && (
        <p className="text-red-500">{errors.title?.message as string}</p>
      )}

      {/* 標籤 (這裡用單一輸入示範，視你 UI 可改為 tag input) */}
      <input
        {...register("tags.0")}
        placeholder="輸入標籤"
        className="border p-2 w-full"
      />
      {errors.tags && (
        // 當 tags 是 z.array(...).min(1, "msg") 時，錯誤訊息會在 errors.tags.message
        <p className="text-red-500">{(errors.tags as any)?.message}</p>
      )}

      {/* 分類 */}
      <select {...register("category")} className="border p-2 w-full">
        <option value="">選擇分類</option>
        <option value="tech">技術</option>
        <option value="life">生活</option>
      </select>
      {errors.category && (
        <p className="text-red-500">{errors.category?.message as string}</p>
      )}

      {/* 活動連結 */}
      <input
        {...register("eventLink")}
        placeholder="活動連結（選填）"
        className="border p-2 w-full"
      />
      {errors.eventLink && (
        <p className="text-red-500">{errors.eventLink?.message as string}</p>
      )}

      {/* 內容 */}
      <textarea
        {...register("content")}
        placeholder="文章內容"
        className="border p-2 w-full"
      />
      {errors.content && (
        <p className="text-red-500">{errors.content?.message as string}</p>
      )}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        送出
      </button>
    </form>
  );
}
