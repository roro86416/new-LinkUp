import { notFound } from "next/navigation";
import Breadcrumb from "../../post-component/layouts/Breadcrumb";
import ArticleHeader from "../postHeader";
import ArticleContent from "../postContent";
import ReviewComponent from "../PostReview/CommentList";
import { getArticleDetail } from "./getArticleDetail";
import type { Article } from "../../types/post";

export const revalidate = 0;

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const postId = parseInt(params.slug, 10);
  if (isNaN(postId)) notFound();

  let article: Article;
  try {
    article = await getArticleDetail(postId);
  } catch {
    notFound();
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <Breadcrumb
        paths={[
          { name: "首頁", href: "/" },
          { name: article.category.name, href: `/post/category/${article.category.id}` },
          { name: article.title, href: `/post/detail/${article.id}` },
        ]}
      />

      <ArticleHeader
        article={{
          id: article.id,
          title: article.title,
          createdAt: article.createdAt,
          coverImageUrl: article.coverImageUrl,
          author: article.author,
          category: article.category,
          tags: article.tags,
          slug: String(article.id),
          eventLink: article.eventLink,
        }}
      />

      <ArticleContent content={article.content} />

      <ReviewComponent currentPostId={article.id} />
    </main>
  );
}
