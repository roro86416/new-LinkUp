"use client";

import { usePathname } from "next/navigation";

interface Crumb {
  name: string;
  href: string;
}

export function useBreadcrumb() {
  const pathname = usePathname(); // e.g. "/author/posts/create"

  // 把路由切成陣列
  const segments = pathname.split("/").filter(Boolean);

  // 建立 breadcrumb 陣列
  const breadcrumbs: Crumb[] = segments.map((seg, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");

    return {
      name: formatName(seg),
      href,
    };
  });

  return breadcrumbs;
}

// 🔧 自動把路由轉成 Title 標題（可自由擴充）
function formatName(segment: string) {
  const map: Record<string, string> = {
    author: "作者後台",
    posts: "文章管理",
    create: "新增文章",
    edit: "編輯文章",
    category: "分類",
    detail: "詳細內容",
  };

  // 如果有對應中文就用中文
  if (map[segment]) return map[segment];

  // 如果是動態路由 [id] → 顯示 "ID: xxx"
  if (Number(segment)) return `ID: ${segment}`;

  // 預設：將英文轉成首字大寫
  return segment.charAt(0).toUpperCase() + segment.slice(1);
}
