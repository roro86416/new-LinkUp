'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PaperAirplaneIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';

// --------------------- 類型定義 ---------------------
type NotificationType = '活動提醒' | '報名成功' | '系統公告' | '活動變更';

interface SentNotification {
  id: string;
  recipientId: string;
  recipientName: string;
  title: string;
  type: NotificationType;
  sentAt: string;
  isRead: boolean;
}

const templates = {
  '報名成功': { title: '您的「{活動名稱}」報名成功！', content: '親愛的 {使用者名稱}，\n\n恭喜您已成功報名「{活動名稱}」。\n活動時間：{活動時間}\n活動地點：{活動地點}\n\n期待您的參與！' },
  '活動提醒': { title: '活動提醒：「{活動名稱}」即將開始！', content: '親愛的 {使用者名稱}，\n\n提醒您，您報名的活動「{活動名稱}」將於 {提醒時間} 開始。\n請準時參加！' },
  '活動變更': { title: '重要通知：「{活動名稱}」活動已變更', content: '親愛的 {使用者名稱}，\n\n通知您，您報名的活動「{活動名稱}」資訊已更新，詳情請至活動頁面查看。' },
};

// --------------------- 子組件：通知管理 ---------------------
const NotificationList = () => {
  // ⭐️ 狀態管理：增加 loading, error, totalItems 狀態
  const [notifications, setNotifications] = useState<SentNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<{ type: NotificationType | 'ALL'; status: 'ALL' | 'READ' | 'UNREAD' }>({ type: 'ALL', status: 'ALL' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 5;

  // ⭐️ 資料獲取：使用 useEffect 從後端 API 獲取資料
  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 將篩選條件轉為 URL 查詢參數
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: String(itemsPerPage),
        type: filter.type,
        status: filter.status,
        search: searchTerm,
      });
      // 模擬 API 請求
      const response = await fetch(`/api/admin/notifications?${params.toString()}`);
      if (!response.ok) {
        throw new Error('無法獲取通知資料');
      }
      const data = await response.json(); // 假設後端回傳 { items: [], total: 0 }
      setNotifications(data.items);
      setTotalItems(data.total);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, filter, searchTerm]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const styles = {
    '活動提醒': 'bg-yellow-100 text-yellow-800',
    '報名成功': 'bg-green-100 text-green-800',
    '系統公告': 'bg-blue-100 text-blue-800',
    '活動變更': 'bg-red-100 text-red-800',
  };

  // ⭐️ 分頁計算：改用後端回傳的總數
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div>
      <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-80">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜尋接收者或標題..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // 搜尋時回到第一頁
            }}
            className="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition text-gray-700 placeholder-gray-400"
          />
        </div>
        <div className="flex items-center gap-4">
          <FunnelIcon className="h-5 w-5 text-gray-500" />
          <select
            value={filter.type}
            onChange={(e) => {
              setFilter(f => ({ ...f, type: e.target.value as NotificationType | 'ALL' }));
              setCurrentPage(1); // 篩選時回到第一頁
            }}
            className="border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition text-gray-700"
          >
            <option value="ALL">所有類型</option>
            {Object.keys(styles).map(type => <option key={type} value={type}>{type}</option>)}
          </select>
          <select
            value={filter.status}
            onChange={(e) => {
              setFilter(f => ({ ...f, status: e.target.value as 'ALL' | 'READ' | 'UNREAD' }));
              setCurrentPage(1); // 篩選時回到第一頁
            }}
            className="border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition text-gray-700"
          >
            <option value="ALL">所有狀態</option>
            <option value="UNREAD">未讀</option>
            <option value="READ">已讀</option>
          </select>
        </div>
      </div>

      <div className="mt-6 bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['接收者', '標題', '類型', '發送時間', '狀態'].map(header => (
                  <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr><td colSpan={5} className="text-center py-8 text-gray-500">讀取中...</td></tr>
              ) : error ? (
                <tr><td colSpan={5} className="text-center py-8 text-red-500">{error}</td></tr>
              ) : notifications.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-gray-500">找不到符合條件的通知。</td></tr>
              ) : (
                notifications.map(n => (
                  <tr key={n.id} className="hover:bg-orange-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{n.recipientName}</td>
                    <td className="px-6 py-4 max-w-sm truncate text-sm text-gray-800">{n.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[n.type]}`}>{n.type}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{n.sentAt}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {n.isRead ?
                        <span className="flex items-center gap-1.5 text-gray-500"><EyeIcon className="h-4 w-4" />已讀</span> :
                        <span className="flex items-center gap-1.5 text-orange-600 font-semibold"><EyeSlashIcon className="h-4 w-4" />未讀</span>
                      }
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-gray-700">共 {totalItems} 筆紀錄</span>
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"><ChevronLeftIcon className="h-5 w-5" /></button>
          <span className="text-sm">第 {currentPage} / {totalPages || 1} 頁</span>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"><ChevronRightIcon className="h-5 w-5" /></button>
        </div>
      </div>
    </div>
  );
};

// --------------------- 子組件：模板發送 ---------------------
const NotificationTemplates = () => {
  const [template, setTemplate] = useState<keyof typeof templates>('報名成功');
  const [title, setTitle] = useState(templates['報名成功'].title);
  const [content, setContent] = useState(templates['報名成功'].content);
  // ⭐️ 狀態管理：增加發送中的狀態
  const [isSending, setIsSending] = useState(false);

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTemplate = e.target.value as keyof typeof templates;
    setTemplate(newTemplate);
    setTitle(templates[newTemplate].title);
    setContent(templates[newTemplate].content);
  };

  // ⭐️ 資料操作：修改 handleSend 以呼叫後端 API
  const handleSend = async () => {
    setIsSending(true);
    try {
      const response = await fetch('/api/admin/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // 這邊需要從 "發送對象" select 中獲取真實的 recipient
          recipient: 'all', // 範例：所有會員
          title,
          content,
          type: template,
        }),
      });
      if (!response.ok) {
        throw new Error('發送失敗');
      }
      alert('通知已成功發送！');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`發送失敗：${errorMessage}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* 左側：編輯區 */}
      <div className="space-y-6">
        <div>
          <label htmlFor="template" className="block text-sm font-medium text-gray-700">選擇模板</label>
          <select
            id="template"
            value={template}
            onChange={handleTemplateChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 text-gray-700"
          >
            {Object.keys(templates).map(name => <option key={name} value={name}>{name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="recipient" className="block text-sm font-medium text-gray-700">發送對象</label>
          <select
            id="recipient"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 text-gray-700"
          >
            <option>所有會員</option>
            <option>特定活動參與者 (e.g. 夏日音樂節)</option>
            <option>特定會員 (e.g. 王小明)</option>
          </select>
        </div>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">通知標題</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 text-gray-700"
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">通知內容</label>
          <textarea
            id="content"
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 text-gray-700"
          ></textarea>
          <p className="mt-2 text-xs text-gray-500">提示：您可以使用 `{'{變數}'}` 來插入動態內容，如 `{'{活動名稱}'}`。</p>
        </div>
        <div className="text-right">
          <button
            onClick={handleSend}
            disabled={isSending}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
            {isSending ? '發送中...' : '發送通知'}
          </button>
        </div>
      </div>

      {/* 右側：預覽區 */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">預覽</h3>
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-md shadow">
            <p className="text-sm font-medium text-gray-500">標題</p>
            <p className="mt-1 font-semibold text-gray-900">{title || '...'}</p>
          </div>
          <div className="bg-white p-4 rounded-md shadow">
            <p className="text-sm font-medium text-gray-500">內容</p>
            <p className="mt-1 text-gray-800 whitespace-pre-wrap">{content || '...'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --------------------- 子組件：自訂發送 ---------------------
const CustomNotification = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);

  // ⭐️ 資料操作：修改 handleSend 以呼叫後端 API
  const handleSend = async () => {
    if (!title.trim() || !content.trim()) {
      alert('標題和內容不可為空！');
      return;
    }
    setIsSending(true);
    try {
      const response = await fetch('/api/admin/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient: 'all', // 範例
          title,
          content,
          type: '系統公告', // 自訂通知可以預設為某個類型
        }),
      });
      if (!response.ok) {
        throw new Error('發送失敗');
      }
      alert('自訂通知已成功發送！');
      // 清空表單
      setTitle('');
      setContent('');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`發送失敗：${errorMessage}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* 左側：編輯區 */}
      <div className="space-y-6">
        <div>
          <label htmlFor="recipient" className="block text-sm font-medium text-gray-700">發送對象</label>
          <select
            id="recipient"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 text-gray-700"
          >
            <option>所有會員</option>
            <option>特定活動參與者 (e.g. 夏日音樂節)</option>
            <option>特定會員 (e.g. 王小明)</option>
          </select>
        </div>
        <div>
          <label htmlFor="custom-title" className="block text-sm font-medium text-gray-700">通知標題</label>
          <input
            type="text"
            id="custom-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="請輸入自訂通知標題"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 text-gray-700 placeholder-gray-400"
          />
        </div>
        <div>
          <label htmlFor="custom-content" className="block text-sm font-medium text-gray-700">通知內容</label>
          <textarea
            id="custom-content"
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="請輸入自訂通知內容..."
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 text-gray-700 placeholder-gray-400"
          ></textarea>
        </div>
        <div className="text-right">
          <button
            onClick={handleSend}
            disabled={isSending}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
            {isSending ? '發送中...' : '發送通知'}
          </button>
        </div>
      </div>

      {/* 右側：預覽區 (與模板頁共用) */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">預覽</h3>
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-md shadow">
            <p className="text-sm font-medium text-gray-500">標題</p>
            <p className="mt-1 font-semibold text-gray-900">{title || '...'}</p>
          </div>
          <div className="bg-white p-4 rounded-md shadow">
            <p className="text-sm font-medium text-gray-500">內容</p>
            <p className="mt-1 text-gray-800 whitespace-pre-wrap">{content || '...'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --------------------- 主頁面組件 ---------------------
export default function AdminNotifications() {
  const [activeTab, setActiveTab] = useState<'list' | 'template' | 'custom'>('list');

  const tabs = [
    { id: 'list', name: '通知管理' },
    { id: 'template', name: '模板發送' },
    { id: 'custom', name: '自訂發送' },
  ];

  return (
    <div className="w-full mx-auto">
      <h1 className="text-2xl font-bold text-orange-600">通知管理</h1>
      <p className="text-gray-500 mt-1">查看已發送的通知紀錄，或使用模板發布新通知。</p>

      <div className="mt-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'list' | 'template' | 'custom')}
              className={`${activeTab === tab.id
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'list' && <NotificationList />}
      {activeTab === 'template' && <NotificationTemplates />}
      {activeTab === 'custom' && <CustomNotification />}
    </div>
  );
}