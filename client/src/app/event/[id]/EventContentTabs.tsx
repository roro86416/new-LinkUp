'use client';

import { useState, useEffect } from 'react';
import type { DetailedEvent } from '../data';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

// 模擬的評論資料型別
interface Comment {
  id: number;
  user: string;
  avatar: string;
  text: string;
}

// 模擬的天氣資料型別
interface Weather {
  temp: number;
  condition: string;
  icon: string;
}

// 頁籤內容元件
export default function EventContentTabs({ event }: { event: DetailedEvent }) {
  const [activeTab, setActiveTab] = useState('活動簡介');
  const [weather, setWeather] = useState<Weather | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [comments, setComments] = useState<Comment[]>([
    { id: 1, user: 'Alice', avatar: 'https://api.dicebear.com/8.x/pixel-art/svg?seed=alice', text: '這個活動看起來超棒的！期待！' },
    { id: 2, user: 'Bob', avatar: 'https://api.dicebear.com/8.x/pixel-art/svg?seed=bob', text: '有人要一起去嗎？' },
  ]);
  const [newComment, setNewComment] = useState('');

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    // 如果點擊的是天氣頁籤，且尚未載入過資料，則觸發載入
    if (tab === '活動天氣' && !weather && !isLoadingWeather) {
      setIsLoadingWeather(true);
      const timer = setTimeout(() => {
        setWeather({
          temp: 26,
          condition: '晴時多雲',
          icon: '⛅️',
        });
        setIsLoadingWeather(false);
      }, 1500);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() === '') return;

    const newCommentObject: Comment = {
      id: Date.now(),
      user: '訪客', // 在真實應用中，這裡會是當前登入的使用者名稱
      avatar: `https://api.dicebear.com/8.x/pixel-art/svg?seed=${Date.now()}`,
      text: newComment,
    };

    setComments([newCommentObject, ...comments]);
    setNewComment('');
  };

  const tabs = ['活動簡介', '活動天氣', '評論區'];

  const renderContent = () => {
    switch (activeTab) {
      case '活動天氣':
        return (
          <div className="p-6 bg-gray-50 rounded-b-lg">
            {isLoadingWeather && <p className="text-gray-600 animate-pulse">天氣資訊載入中...</p>}
            {weather && !isLoadingWeather && (
              <div className="flex items-center gap-4">
                <span className="text-6xl">{weather.icon}</span>
                <div>
                  <p className="text-3xl font-bold text-gray-800">{weather.temp}°C</p>
                  <p className="text-lg text-gray-600">{weather.condition}</p>
                </div>
              </div>
            )}
          </div>
        );
      case '評論區':
        return (
          <div className="p-4 bg-gray-50 rounded-b-lg space-y-6">
            {/* 評論輸入框 */}
            <form onSubmit={handleCommentSubmit} className="space-y-2">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md text-gray-800 placeholder:text-gray-500 focus:ring-2 "
                placeholder="分享你的看法..."
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 disabled:bg-gray-400 transition cursor-pointer"
                  disabled={!newComment.trim()}
                >
                  <PaperAirplaneIcon className="w-5 h-5" />
                  送出評論
                </button>
              </div>
            </form>

            {/* 評論列表 */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-3">
                  <img src={comment.avatar} alt={comment.user} className="w-10 h-10 rounded-full" />
                  <div className="flex-1 bg-white p-3 rounded-lg border">
                    <p className="font-semibold text-sm text-gray-800">{comment.user}</p>
                    <p className="text-gray-700">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case '活動簡介':
      default:
        return (
          <div className="p-4 bg-gray-50 rounded-b-lg">
            <p className="text-base md:text-lg text-gray-700 leading-relaxed whitespace-pre-line">
              {event.desc}
            </p>
          </div>
        );
    }
  };

  return (
    <div>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`${activeTab === tab
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-4">{renderContent()}</div>
    </div>
  );
}