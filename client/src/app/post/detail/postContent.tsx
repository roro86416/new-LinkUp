// src/app/post/detail/components/ArticleContent.tsx
import Image from "next/image";
import React from 'react'; // 確保 React 導入，以防您的環境需要

// 定義內容區塊的介面
interface ContentBlock {
  type: "text" | "image";
  content: string; // 對於 text 是純文本，對於 image 是 URL
}

interface ArticleContentProps {
  content: string; // 這是從後端傳來的 JSON 字串
}

export default function ArticleContent({ content }: ArticleContentProps) {
  let blocks: ContentBlock[] = [];
  let parseError: string | null = null;

  // 1. 🚨 關鍵步驟：嘗試解析 JSON 字串 (使用 unknown 避免 'Unexpected any' 錯誤)
  try {
    if (content) {
      const parsedContent = JSON.parse(content);
      if (Array.isArray(parsedContent)) {
        blocks = parsedContent;
      }
    }
  } catch (error: unknown) { // 修正: 使用 unknown
    // 捕獲錯誤，並將錯誤訊息儲存下來
    const errorMessage = error instanceof Error ? error.message : String(error);
    parseError = `內容解析錯誤：${errorMessage}`;
    console.error("Error parsing article content JSON:", error);
  }

  return (
    // 使用 className="prose" 確保文本樣式
    <article className="prose max-w-none mb-16 space-y-4">
      {parseError && (
        // 如果解析失敗，至少顯示這個錯誤框
        <div className="p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg my-4">
          <strong>[渲染錯誤]</strong>: {parseError}
        </div>
      )}

      {blocks.length === 0 && !parseError && (
        <p className="text-gray-500 italic">這篇文章沒有內容。</p>
      )}

      {blocks.map((block, index) => {
        // 2. ⚡ 根據 type 渲染不同的元素
        try {
          if (block.type === "text") {
            return (
              <p key={index} className="leading-relaxed">
                {block.content}
              </p>
            );
          } else if (block.type === "image" && block.content) {
            // 渲染圖片
            return (
              <figure key={index} className="my-6">
                <Image
                  src={block.content}
                  alt={`文章圖片 ${index + 1}`}
                  width={800} 
                  height={500} 
                  className="w-full h-auto rounded-lg shadow-lg"
                  onError={(e) => console.error("Image loading failed:", e.currentTarget.src)}
                />
              </figure>
            );
          }
          return null;
        } catch (renderError) {
          console.error("Error rendering content block:", renderError, block);
          return <p key={index} className="text-red-500">[渲染區塊錯誤: {block.type}]</p>;
        }
      })}
    </article>
  );
}