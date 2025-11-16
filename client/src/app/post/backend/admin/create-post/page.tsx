"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { postSchema } from "../../types/postschema";

import ContentForm from "./component/PostEditor";
import CoverForm from "./component/CoverUploader";
import PostMetaForm from "./component/PostMetaForm";

type PostFormData = z.infer<typeof postSchema>;

export default function CreatePostPage() {
  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      coverImage: "",
      tags: "",
      category: "",
      link: "",
      content: {
        blocks: [],   // ← 必須這樣初始化
      },
    },
  });

  const onSubmit = (data: PostFormData) => {
    console.log("📌 最終送出的文章資料：", data);
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-10 p-6 max-w-3xl mx-auto"
      >
        <h1 className="text-2xl font-bold">新增文章</h1>

        <CoverForm />
        <PostMetaForm />
        <ContentForm />

        {/* 全頁面只有這一個按鈕 */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 w-full"
        >
          送出文章
        </button>
      </form>
    </FormProvider>
  );
}
