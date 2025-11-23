import prisma from "../../../utils/prisma-only.js";
import { CreatePostInput } from "./post.schema.js";

const normalizeTags = (tags?: string[] | string) => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.map((t) => String(t).trim()).filter(Boolean);
  return String(tags)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
};

export const createPost = async (payload: CreatePostInput, author_id: string) => {
  const blocks = JSON.parse(payload.content || "[]");

  // 處理分類（string → PostCategory）
  const categoryName = payload.category.trim();

  // 用 findFirst（非 findUnique），因為沒有 unique constraint
  let category = await prisma.postCategory.findFirst({
    where: { name: categoryName },
  });

  if (!category) {
    category = await prisma.postCategory.create({
      data: { name: categoryName },
    });
  }

  // 建立文章，包含 status 與 published_at
  const newPost = await prisma.userPost.create({
    data: {
      title: payload.title,
      content: payload.content,
      author_id,
      category_id: category.id,
      status: "approved",          // ✅ 改成 enum 裡的合法值
      published_at: new Date(),     // ✅ 設定文章發布時間
    },
  });

  // --- 儲存封面 ---
  if (payload.coverImage) {
    await prisma.postImage.create({
      data: {
        post_id: newPost.id,
        image_url: payload.coverImage,
        is_cover: true,
      },
    });
  }

  // --- 儲存文章中的 image blocks ---
  const imageBlocks = blocks.filter((b: any) => b.type === "image" && b.content);
  if (imageBlocks.length > 0) {
    await prisma.postImage.createMany({
      data: imageBlocks.map((b: any) => ({
        post_id: newPost.id,
        image_url: b.content,
        is_cover: false,
      })),
    });
  }

  // --- tags ---
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

export async function getPostByIdService(id: number) {
  return prisma.userPost.findUnique({
    where: { id },
    include: {
      author: true,
      category: true,
      images: true,
      tags: { include: { tag: true } },
      reviews: true,
    },
  });
}