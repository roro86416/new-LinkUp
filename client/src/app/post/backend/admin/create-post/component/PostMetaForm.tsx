"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema, PostSchemaType } from "../../../types/postschema"; // ← 依你專案路徑調整


export default function PostMetaForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostSchemaType>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      tags: "",
      category: "",
      link: "",
    },
  });

  const onSubmit = (data: PostSchemaType) => {
    console.log("表單送出成功：", data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border p-6 rounded-xl bg-white shadow-sm flex flex-col gap-5"
    >
      <h2 className="text-xl font-semibold text-gray-700">Post Details</h2>

      <div>
        <input
          {...register("title")}
          placeholder="Enter post title"
          className="border p-3 rounded-lg w-full"
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
      </div>

      <div>
        <input
          {...register("tags")}
          placeholder="Tags (comma separated)"
          className="border p-3 rounded-lg w-full"
        />
        {errors.tags && (
          <p className="text-red-500 text-sm">{errors.tags.message}</p>
        )}
      </div>

      <div>
        <input
          {...register("category")}
          placeholder="Category"
          className="border p-3 rounded-lg w-full"
        />
        {errors.category && (
          <p className="text-red-500 text-sm">{errors.category.message}</p>
        )}
      </div>

      <div>
        <input
          {...register("link")}
          placeholder="Optional event link"
          className="border p-3 rounded-lg w-full"
        />
        {errors.link && (
          <p className="text-red-500 text-sm">{errors.link.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Submit
      </button>
    </form>
  );
}
