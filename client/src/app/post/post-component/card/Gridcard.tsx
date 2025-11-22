"use client";

interface GridCardProps {
  image: string;
  category?: string;
  title: string;
  href: string;
  author?: string;
  date?: string;
}

export default function GridCard({
  image,
  category,
  title,
  href,
  author,
  date,
}: GridCardProps) {
  return (
    <a
      href={href}
      className="
        block 
        overflow-hidden 
        bg-white 
        border border-neutral-200/30 
        
        /* 浮動效果 */
        shadow-xl 
        hover:shadow-2xl 
        hover:-translate-y-1 
        transition-all duration-300 ease-in-out
        
        /* 確保高度固定和 Flex 佈局 */
        flex flex-col 
        h-96 /* 卡片總高度 */
        
        /* 設置外層卡片大圓角 */
        rounded-2xl 
      "
    >
      {/* 1. 圖片區域 - 佔據卡片約 40% (h-40) */}
      <div className="
            w-full h-40 
            overflow-hidden 
            flex-shrink-0 
            /* 🔥 關鍵：只讓頂部圓角與卡片貼合 */
            rounded-t-2xl 
        ">
        <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.02]" 
        />
      </div>

      {/* 2. 內文區域 - 置中、調整 padding (p-5) */}
      <div className="p-5 flex-grow text-center">
        
        {/* 標籤 - 膠囊形狀和顏色 */}
        {category && (
          <span className="
                inline-block 
                text-xs font-medium 
                text-indigo-700 
                bg-indigo-100 
                rounded-full 
                px-3 py-1 
                uppercase tracking-wider 
                mb-2 
            ">
            {category}
          </span>
        )}

        {/* 標題 - 自動置中 */}
        <h3 className="text-xl font-semibold mt-1 leading-snug text-neutral-800">
          {title}
        </h3>

        {/* 作者/日期 */}
        {(author || date) && (
          <p className="text-sm text-neutral-500 mt-2">
            {author && `By ${author}`} {date && ` • ${date}`}
          </p>
        )}
      </div>
    </a>
  );
}