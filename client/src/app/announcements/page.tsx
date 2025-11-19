'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
// 引用共用型別 (請確認路徑是否正確指向 src/types.ts)
import { Banner } from '../../types'; 
import {
  MegaphoneIcon,
  ArrowLeftIcon,
  ChevronRightIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模擬資料讀取
    const loadData = () => {
      try {
        const savedBanners = localStorage.getItem('home_banners');
        if (savedBanners) {
          const parsedData = JSON.parse(savedBanners) as Banner[];
          // 只顯示狀態為「啟用 (isActive: true)」的公告
          const activeBanners = parsedData.filter(b => b.isActive);
          setAnnouncements(activeBanners);
        }
      } catch (error) {
        console.error("無法讀取公告資料", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* 頁面標題區 */}
        <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-6">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-orange-100 rounded-full text-orange-600 shadow-sm">
               <MegaphoneIcon className="w-8 h-8" />
             </div>
             <div>
               <h1 className="text-3xl font-bold text-gray-900">最新公告</h1>
               <p className="text-gray-500 text-sm mt-1">掌握平台最新活動與重要通知</p>
             </div>
          </div>
          
          <Link 
            href="/" 
            className="group flex items-center text-gray-500 hover:text-orange-600 transition-colors font-medium bg-white px-4 py-2 rounded-lg border border-gray-200 hover:border-orange-200 shadow-sm"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            返回首頁
          </Link>
        </div>

        {/* 列表內容區 */}
        {loading ? (
          <div className="text-center py-20">
             <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-200 border-t-orange-500"></div>
             <p className="text-gray-400 mt-2">載入中...</p>
          </div>
        ) : announcements.length === 0 ? (
           // 空狀態
           <div className="bg-white rounded-2xl shadow-sm p-16 text-center border border-gray-100">
             <MegaphoneIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
             <h3 className="text-xl font-semibold text-gray-900">目前沒有公告</h3>
             <p className="text-gray-500 mt-2">請稍後再回來查看最新消息。</p>
           </div>
        ) : (
          // 公告列表
          <div className="space-y-4">
            {announcements.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100 hover:border-orange-200"
              >
                <div className="flex flex-col sm:flex-row h-full">
                  {/* 左側：圖片縮圖 (如果有圖的話) */}
                  <div className="sm:w-48 h-48 sm:h-auto relative shrink-0 bg-gray-100 overflow-hidden">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <PhotoIcon className="w-10 h-10" />
                      </div>
                    )}
                  </div>

                  {/* 右側：文字內容 */}
                  <div className="p-6 flex-1 flex flex-col justify-center relative">
                    <div className="mb-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-600 mb-2 border border-orange-100">
                        系統公告
                      </span>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                    </div>

                    <div className="mt-auto flex items-center justify-end">
                      {item.linkUrl && item.linkUrl !== '#' ? (
                         <Link
                           href={item.linkUrl}
                           className="inline-flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-orange-600 transition-colors"
                         >
                           查看詳情 <ChevronRightIcon className="w-4 h-4" />
                         </Link>
                      ) : (
                        <span className="text-sm text-gray-400 cursor-default">
                          僅供參考
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}