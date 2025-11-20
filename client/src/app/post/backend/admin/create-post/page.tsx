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
      content: { blocks: [] },
    },
  });

  const onSubmit = async (data: PostFormData) => {


    const authToken = localStorage.getItem('token'); 

    console.log("📌 從 localStorage 讀取的 Token:", authToken);

    if (!authToken) {
      console.error("錯誤：請先登入，找不到驗證 Token。");
      // 導航到登入頁面
      router.push('/login'); 
      return;
    }
    // --- content blocks ---
    const contentJSON = JSON.stringify(
      data.content.blocks.map((block) => {
        if (block.type === "paragraph") {
          return { type: "text", content: block.text };
        } else if (block.type === "image") {
          return { type: "image", content: block.url };
        }
      })
    );

    // --- tags ---
    const tagArray = data.tags
      ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    // --- category 只要字串 ---
    const categoryValue = data.category ? data.category.trim() : "";
const currentUserId = localStorage.getItem('user_id') || "7a57e4cd-dcd0-4126-a002-7a0ff251413f";
    // --- 最終 payload（完全符合後端 createPost） ---
    const payload = {
      title: data.title,
      coverImage: data.coverImage || null,
      category: categoryValue, // 字串
      content: contentJSON,
      tags: tagArray,
      author_id: currentUserId,
    };

    console.log("📌 送到後端的 payload:", payload);

    try {
      const res = await fetch("http://localhost:3001/api/post", {
        method: "POST",
        headers: {
    "Content-Type": "application/json",
    // "Authorization": `Bearer ${authToken}`,
  },
  // credentials: "include",
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        console.log("文章上傳成功", result);
        const newPostId = result.id;
        if (newPostId) {
          router.refresh(); 
          
          // 關鍵修復 2: 使用 replace 取代 push，避免頁面歷史紀錄堆疊
          router.replace(`/post/detail/${newPostId}`); 
          // router.push(`/post/detail/${newPostId}`);
        }
      } else {
        console.error("文章上傳失敗", result);
      }
    } catch (err) {
      console.error("❌ 上傳錯誤", err);
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
