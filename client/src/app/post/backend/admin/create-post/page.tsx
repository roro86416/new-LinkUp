import CoverUploader from "./component/CoverUploader";
import PostMetaForm from "./component/PostMetaForm";
import PostContentForm from "./component/PostEditor";

export default function CreatePostPage() {
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
