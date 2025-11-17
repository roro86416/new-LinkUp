"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { postSchema, PostFormData } from "../../types/postschema";

import ContentForm from "./component/PostEditor";
import CoverForm from "./component/CoverUploader";
import PostMetaForm from "./component/PostMetaForm";

export default function CreatePostPage() {
  const router = useRouter();

  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      coverImage: "",
      tags: "",
      category: "",
      link: "",
      content: {
        blocks: [],
      },
    },
  });

  const onSubmit = async (data: PostFormData) => {
    const contentJSON = JSON.stringify(
      data.content.blocks.map((block) => {
        if (block.type === "paragraph") {
          return { type: "text", content: block.text };
        } else if (block.type === "image") {
          return { type: "image", content: block.url };
        }
      })
    );

    const tagArray = data.tags
      ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const payload = {
      title: data.title,
      cover_image: data.coverImage || null,
      category_id: Number(data.category) || null,
      content: contentJSON,
      tags: tagArray,
      article_id: data.link || null,
    };

    console.log("📌 後端 payload:", payload);

    try {
      const res = await fetch("http://localhost:3001/post", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});


      const result = await res.json();

      if (res.ok) {
        console.log("文章上傳成功", result);

        // 假設後端回傳新文章的 id
        const newPostId = result.id;
        if (newPostId) {
          router.push(`/posts/${newPostId}`);
        }
      } else {
        console.error("文章上傳失敗", result);
      }
    } catch (err) {
      console.error("上傳錯誤", err);
    }
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