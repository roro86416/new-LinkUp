import { Search } from 'lucide-react';

interface OptimizedSearchInputProps {
  search: string;
  setSearch: (value: string) => void;
}

// 這是將搜尋輸入框獨立出來的元件
export default function OptimizedSearchInput({ search, setSearch }: OptimizedSearchInputProps) {
  return (
    // 外層容器，用於包裹圖標和輸入框
    <div className="relative flex items-center w-full mb-6">
        
        {/* 搜尋圖標 */}
        <Search className="w-20 h-5 text-gray-400 absolute left-3 pointer-events-none" />

        <input
          type="text"
          placeholder="搜尋文章標題…"
          className="
                w-full 
                bg-gray-200 
                pl-10 pr-4 py-3 
                rounded-lg 
                focus:ring-2 focus:ring-blue-500 focus:outline-none 
                transition-all 
                dark:bg-gray-700 dark:text-gray-100
                text-base
            "
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
    </div>
  );
}