import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

// --- 型別定義（保持最佳實踐）---
interface Author {
  name: string;
  id: number;
}
interface Category {
  name: string;
  id: number;
}
interface Tag {
  name: string;
}
interface Article {
  title: string;
  image: string;
  createdAt: string;
  author: Author;
  category: Category;
  tags: Tag[];
  eventLink?: string;
}
interface ArticleHeaderProps {
  article: Article;
}

// --- 樣式常數（提高可讀性）---
// 標籤和分類鏈接的基礎樣式
const baseLinkStyle = "inline-block border border-green-300 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500/50";
// 類別標籤樣式：更顯眼
const categoryStyle = `${baseLinkStyle} px-3 py-1 bg-green-200 text-green-800 hover:bg-green-300 hover:border-green-400 uppercase tracking-wider`;
// 標籤樣式：較為低調，使用綠色邊框
const tagStyle = `${baseLinkStyle} px-3 py-1 text-gray-700 hover:bg-green-50 hover:text-green-800`;


export default function ArticleHeader({ article }: ArticleHeaderProps) {
  const formattedDate = useMemo(() =>
    new Date(article.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }), [article.createdAt]);

  return (
    // 1. 深度與微光: 使用漸層背景, 大圓角, 並使用多層次的陰影 (shadow-xl)
    <section 
      className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-3xl shadow-2xl mb-12 border border-green-200 
                 flex flex-col lg:flex-row items-center lg:items-start gap-8"
      aria-labelledby="article-title"
    >
      <div className="flex-1 min-w-0"> 
        {/* 類別標籤 */}
        <div className="mb-4">
          <Link
            href={`/categories/${article.category.id}`}
            className={categoryStyle}
            aria-label={`View all articles in ${article.category.name} category`}
          >
            {article.category.name}
          </Link>
        </div>

        {/* 標題: 使用更大的字體和更重的字體來強調重要性 */}
        <h1 
            id="article-title" 
            className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-5 leading-tight tracking-tight"
        >
          {article.title}
        </h1>

        {/* 作者和日期: 使用細節線條和顏色分離 */}
        <div className="text-base text-gray-700 mb-5 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-b border-green-200 py-3">
          <Link
            href={`/authors/${article.author.id}`}
            className="hover:text-green-700 font-semibold transition-colors duration-200 hover:underline"
          >
            By: {article.author.name}
          </Link>
          <span className="text-gray-400" aria-hidden="true">|</span>
          <time dateTime={article.createdAt} className="text-gray-600">
            Published: {formattedDate}
          </time>
        </div>

        {/* 標籤列表 */}
        {article.tags.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-5" role="group" aria-label="Article tags">
            {article.tags.map((tag) => (
              <Link
                key={tag.name}
                href={`/tags/${tag.name.toLowerCase()}`}
                className={tagStyle}
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}

        {/* 事件連結: 使用更像按鈕的樣式 */}
        {article.eventLink && (
          <Link
            href={article.eventLink}
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-green-600 text-white rounded-lg font-medium shadow-md hover:bg-green-700 transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-green-500/50"
          >
            <span role="img" aria-label="calendar icon">🗓️</span> 
            View Event Details 
            <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>

      {/* 4. 影像元件: 強調深度與動態感 */}
      <div className="relative w-full lg:w-[450px] flex-shrink-0 h-[300px] rounded-2xl overflow-hidden 
                    shadow-2xl border-4 border-white transform transition-transform duration-500 hover:scale-[1.02]">
        <Image
          src={article.image}
          alt={article.title}
          fill
          priority={true} 
          sizes="(max-width: 1024px) 100vw, 450px" 
          className="object-cover"
        />
        {/* 增加一個影像上方的半透明疊層來增加質感 */}
        <div className="absolute inset-0 bg-black/10 mix-blend-multiply pointer-events-none"></div>
      </div>
    </section>
  );
}