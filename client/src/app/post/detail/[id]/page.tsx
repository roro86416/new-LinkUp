import { notFound } from "next/navigation";
import Breadcrumb from "../../post-component/layouts/Breadcrumb";
import ArticleHeader from "../postHeader";
import ArticleContent from "../postContent";
import ReviewComponent from "../PostReview/CommentList";

interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  createdAt: string;
  image: string;
  author: { name: string; id: number };
  category: { name: string; id: number };
  tags: { name: string }[];
  eventLink?: string;
}

interface CategoryPageProps {
  paths: { name: string; href: string }[];
}


export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  // ✅ 假資料版本：不用 fetch，直接建立一筆文章資料
  const article: Article = {
    id: 101,
    title: "React 與 Next.js 的整合實戰",
    slug: params.slug, // 動態從網址帶入
    content: `
      <h2>前言</h2>
      <p>本篇將介紹如何在 Next.js 中整合 React 組件與動態路由。</p>
      <h2>實作內容</h2>
      <p>透過動態路由，我們可以根據文章 slug 顯示不同內容。</p>
      <p>此外還能搭配 ISR (Incremental Static Regeneration) 來優化效能。</p>
    `,
    createdAt: "2025-11-09",
    image: "/images/sample.jpg",
    author: { name: "Max", id: 1 },
    category: { name: "前端開發", id: 1 },
    tags: [{ name: "React" }, { name: "Next.js" }, { name: "TypeScript" }],
    eventLink: "https://example.com/event",
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      {/* 導覽路徑 */}
      <Breadcrumb
        paths={[
          { name: "首頁", href: "/" },
          { name: "文章專區", href: "/articles" },
          { name: article.title, href: `/article/${article.slug}` },
        ]}
      />

      {/* 文章標頭 */}
      <ArticleHeader article={article} />

      {/* 文章內容 */}
      <ArticleContent content={article.content} />

      {/* 評論區 */}
      <ReviewComponent currentPostId={article.id} />
    </main>
  );
}