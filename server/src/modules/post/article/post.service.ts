import prisma from "../../../utils/prisma-only.js";
import { CreatePostInput } from "./post.schema.js";

/**
 * 解析 tags（前端可以傳 "a,b" or ["a","b"]）
 */
const normalizeTags = (tags?: string[] | string) => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.map((t) => String(t).trim()).filter(Boolean);
  return String(tags)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
};

export const createPost = async (payload: CreatePostInput, author_id: string) => {
  // 解析 content blocks（前端送來是 JSON 字串）
  const blocks = JSON.parse(payload.content || "[]") as { type?: string; content?: string }[];

  // 轉型 category_id 與 article_id
  const categoryId =
    payload.category_id !== null && payload.category_id !== undefined && payload.category_id !== ""
      ? Number(payload.category_id)
      : undefined;

  const articleId =
    payload.article_id !== null && payload.article_id !== undefined && payload.article_id !== ""
      ? Number(payload.article_id)
      : undefined;

  // 只在有值時加入 data
  const data: any = {
    title: payload.title,
    content: payload.content,
    author_id,
  };
  if (!Number.isNaN(categoryId)) data.category_id = categoryId;
  if (!Number.isNaN(articleId)) data.article_id = articleId;

  // 1) 建立 userPost
  const newPost = await prisma.userPost.create({
    data,
  });

  // 2) 如果有 coverImage，存到 post_images 並標 is_cover = true
  if (payload.coverImage) {
    await prisma.postImage.create({
      data: {
        post_id: newPost.id,
        image_url: payload.coverImage,
        is_cover: true,
      },
    });
  }

  // 3) 解析 content 中的 image block，存到 post_images（is_cover = false）
  const imageBlocks = blocks.filter((b) => b.type === "image" && b.content);
  if (imageBlocks.length > 0) {
    const toCreate = imageBlocks.map((b) => ({
      post_id: newPost.id,
      image_url: b.content!,
      is_cover: false,
    }));
    await prisma.postImage.createMany({ data: toCreate });
  }

  // 4) tags 處理：建立 PostTag（若不存在）與 ContactTag 關聯
  const tags = normalizeTags(payload.tags);
  for (const tagName of tags) {
    let tag = await prisma.postTag.findFirst({ where: { name: tagName } });
    if (!tag) {
      tag = await prisma.postTag.create({ data: { name: tagName } });
    }
    await prisma.contactTag.create({
      data: {
        post_id: newPost.id,
        tag_id: tag.id,
      },
    });
  }

  return newPost;
};
