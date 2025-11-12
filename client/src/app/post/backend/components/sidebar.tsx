// backend/components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  { name: "創作文章", path: "/backend/admin/create-post" },
  { name: "創作者文章", path: "/backend/admin/creator-posts" },
  { name: "每日點閱數", path: "/backend/admin/daily-views" },
  { name: "每日訂閱人數", path: "/backend/admin/daily-subscribers" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white shadow-md p-6 flex flex-col">
      <h2 className="text-2xl font-semibold mb-8 text-gray-800">後台管理</h2>
      <nav className="flex flex-col space-y-3">
        {menu.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`p-2 rounded-md transition ${
              pathname === item.path
                ? "bg-blue-500 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
