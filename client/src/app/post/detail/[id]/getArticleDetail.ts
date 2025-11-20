import type { Article } from "../../types/post";

interface ImageRecord {
  is_cover: boolean;
  image_url: string;
}

interface TagRecord {
  name: string;
}

interface PostData {
  id: number;
  title: string;
  content: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
  images: ImageRecord[] | null;
  author: { id: string; name: string };
  category?: { id: number; name: string } | null;
  tags?: { tag: { id: number; name: string } }[] | null;
  eventLink?: string | null;
}

export async function getArticleDetail(postId: number): Promise<Article> {
  const apiUrl = `http://localhost:3001/api/post/${postId}`;
  const response = await fetch(apiUrl, { cache: "no-store" });

  if (!response.ok) throw new Error("Article Not Found");

  const postData: PostData = await response.json();

  if (!postData) throw new Error("Article Not Found");

  return {
    id: postData.id,
    title: postData.title,
    content: postData.content,
    createdAt: postData.created_at,

    coverImageUrl:
      Array.isArray(postData.images)
        ? postData.images.find(img => img.is_cover)?.image_url ?? null
        : null,

    author: {
      id: postData.author.id,
      name: postData.author.name,
    },

    category: {
      id: postData.category?.id ?? 0,
      name: postData.category?.name ?? "Uncategorized",
    },

    tags: Array.isArray(postData.tags)
      ? postData.tags.map(t => ({ name: t.tag.name }))
      : [],

    eventLink: postData.eventLink || undefined,
  };
}
