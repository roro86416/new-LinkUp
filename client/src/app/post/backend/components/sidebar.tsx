// backend/components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
// 引入 react-icons 來增加視覺豐富度
import { FileText, Users, TrendingUp, Clock } from 'lucide-react'; // 也可以使用其他圖標庫，例如 lucide-react, react-icons/hi2

const menu = [
  { name: "創作文章", path: "/post/backend/admin/create-post", icon: FileText },
  { name: "創作者文章", path: "/post/backend/admin/creator-posts", icon: Users },
  { name: "每日點閱數", path: "/post/backend/admin/daily-views", icon: TrendingUp },
  { name: "每日訂閱人數", path: "/post/backend/admin/daily-subscribers", icon: Clock },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    // 1. 改變背景色：使用深色背景 (slate-900) 營造專業和高質感
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-6 flex flex-col border-r border-slate-700">
      
      {/* 標題/Logo 區塊 */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-blue-400 tracking-wider">
          創作者介面
        </h2>
        {/* 增加一個細小的分隔線 */}
        <hr className="mt-2 border-t border-slate-700 opacity-50" />
      </div>

      {/* 導航區塊 */}
      <nav className="flex flex-col space-y-2 flex-grow">
        {menu.map((item) => {
          const isActive = pathname === item.path;
          const IconComponent = item.icon; // 取得圖標元件

          return (
            <Link
              key={item.path}
              href={item.path}
              // 2. 調整連結樣式：
              // - 增加圖標，使其更易識別。
              // - 增加 padding (py-3 px-4) 和圓角 (rounded-lg)。
              // - 使用 `group` 讓 hover 效果可以套用在子元素上。
              // - 移除底線 (no-underline)。
              className={`
                flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 group
                ${
                  isActive
                    // 3. 活動狀態：使用亮眼的強調色 (blue-500) 和更深的底色 (blue-600)
                    ? "bg-blue-600 text-white font-semibold shadow-md"
                    // 4. 預設狀態：柔和的文字顏色 (slate-300)，hover 時輕微變色
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }
              `}
            >
              {/* 圖標元件 */}
              <IconComponent 
                className={`w-5 h-5 transition-colors duration-200 
                  ${isActive ? "text-white" : "text-blue-400 group-hover:text-white"}
                `}
              />
              
              {/* 連結文字 */}
              <span className="text-sm">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
      
      {/* 您可以在此處添加一個 Footer 資訊，例如版本號或登出按鈕 */}
      <div className="mt-8 pt-4 border-t border-slate-700">
         <p className="text-xs text-slate-500">
             © 2025 Creator Dashboard
         </p>
      </div>

    </aside>
  );
}