// import { Edit, Trash2 } from 'lucide-react';

interface PostCardProps {
  post: {
    id: string;
    title: string;
    coverImage: string;
    category: string;
    tags: string[];
    createdAt: string;
  };
}

export default function PostCard({ post }: PostCardProps) {
  return (
    
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl dark:bg-gray-800">
      
      <img
        src={post.coverImage || 'https://placehold.co/600x240/1f2937/ffffff?text=No+Cover+Image'}
        alt={post.title}
        className="w-full h-40 object-cover rounded-t-xl"
        onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null; 
            target.src = 'https://placehold.co/600x240/1f2937/ffffff?text=No+Cover+Image';
        }}
      />

      {/* 內容區塊 */}
      <div className="p-2 flex flex-col gap-1">
        
        {/* 標題 */}
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 line-clamp-2">
            {post.title}
        </h2>

        {/* 資訊欄 */}
        <p className="text-sm text-gray-500 dark:text-gray-400">
          類別：
            <span className="font-semibold text-blue-600 dark:text-blue-400">{post.category}</span> 
            <span className="mx-2 text-gray-400 dark:text-gray-500">|</span> 
            {post.createdAt}
        </p>

        {/* 標籤 */}
        <div className="flex flex-wrap gap-1 mt-1">
          {post.tags.map((tag) => (
            <span
              key={tag}
             
              className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-medium dark:bg-blue-900 dark:text-blue-300"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* 動作按鈕優化 */}
        <div className="flex pt-3 border-t border-gray-100 dark:border-gray-700 mt-2">
          
          {/* 編輯按鈕 - 藍色主色調 */}
          <a
            href={`/dashboard/posts/${post.id}/edit`}
            className="
                flex items-center justify-center  flex-1
                bg-blue-500 text-white font-bold
                px-2 py-0.5 rounded-lg shadow-md transition-all 
                hover:bg-blue-600 hover:shadow-lg
            "
          >
            編輯
          </a>

          {/* 刪除按鈕 - 紅色警告色 */}
          <button 
                className="
                    flex items-center justify-center  flex-1
                    bg-red-500 text-white font-bold 
                    px-2 py-0.5 rounded-lg shadow-md transition-all 
                    hover:bg-red-600 hover:shadow-lg
                "
            >
            刪除
          </button>
        </div>
      </div>
    </div>
  );
}