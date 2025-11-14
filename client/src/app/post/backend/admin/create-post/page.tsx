import CoverUploader from "./component/CoverUploader";
import PostMetaForm from "./component/PostMetaForm";
import PostContentForm from "./component/PostEditor";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema, PostSchemaType } from "../../types/postschema";


export default function CreatePostPage() {
  const form = useForm<PostSchemaType>({
  resolver: zodResolver(postSchema),
  defaultValues: {
    coverImage: "",
    title: "",
    tags: "",
    category: "",
    link: "",
    content: "",
    images: [],
  }
});

  return (
    <div className="flex flex-col gap-8 p-6 max-w-5xl mx-auto">
      {/* 區塊一：標題圖片 */}
      <CoverUploader />

      {/* 區塊二：創作標題區塊 */}
      <PostMetaForm />

      {/* 區塊三：文章內容區塊 */}
      <PostContentForm />
    </div>
  );
}
