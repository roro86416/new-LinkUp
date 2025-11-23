import React from 'react';

interface CreatorButtonProps {
  /** 創作者介面的目標連結 */
  href: string;
}

/**
 * 浮動操作按鈕 (FAB) 元件，固定在畫面的右下角。
 * 點擊後導向創作者介面。
 */
export default function CreatorButton({ href }: CreatorButtonProps) {
  return (
    <a
      href={href}
      // 使用 fixed 定位，固定在視窗右下角
      className="
        fixed bottom-8 right-8 
        z-50 /* 確保按鈕浮在所有內容之上 */
        
        bg-gray-600 hover:bg-gray-700 
        text-white 
        font-semibold 
        p-4 
        rounded-full 
        shadow-2xl hover:shadow-3xl 
        transition-all duration-200 
        transform hover:scale-105
        flex items-center justify-center 
        space-x-2
        ring-4 ring-lime-300/50
        w-16 h-16 sm:w-auto sm:h-auto
      "
      aria-label="前往創作者介面"
    >
      {/* 創作者圖示 (使用 SVG，確保無需外部載入) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3a3 3 0 0 0-3 3zM12 2c-3.866 0-7 3.134-7 7c0 2.228 1.05 4.195 2.68 5.485L7 17l4.004-1.001c.663.072 1.334.072 1.996 0L17 17l.32-1.515C19.95 13.195 21 11.228 21 9c0-3.866-3.134-7-7-7z" />
        <path d="M22 17l-3.32-1.515c-1.63 1.29-3.57 2.155-5.68 2.37V22h4l1-1h3v-2h-3l-1 1z" />
      </svg>
      
      {/* 僅在寬螢幕顯示文字，讓手機保持為小圓按鈕 */}
      <span className="hidden sm:inline">
        創作者介面
      </span>
    </a>
  );
}