"use client";

import { useState } from "react";
import PostCard from "./component/PostCard";

interface Post {
  id: string;
  title: string;
  coverImage: string;
  category: string;
  tags: string[];
  createdAt: string;
}

export default function DashboardPostsPage() {
  // 直接在 useState 初始化，不要 useEffect
  const [posts] = useState<Post[]>([
    {
      id: "1",
      title: "我的第一篇文章",
      coverImage: "http://localhost:3001/uploads/file-1763002748572-179630978.webp",
      category: "生活",
      tags: ["日常", "成長"],
      createdAt: "2025-02-10",
    },
    {
      id: "2",
      title: "前端學習心得",
      coverImage: "http://localhost:3001/uploads/file-1763088247815-714015603.jpg",
      category: "技術",
      tags: ["React", "Next.js"],
      createdAt: "2025-03-20",
    },
  ]);

  const [search, setSearch] = useState("");

  const filtered = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">你的文章列表</h1>

      {/* 搜尋框 */}
      <input
        type="text"
        placeholder="搜尋文章標題…"
        className="w-full border p-2 rounded mb-6"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* 文章列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-500 mt-10">沒有找到文章</p>
      )}
    </div>
  );
}
