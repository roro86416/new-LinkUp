'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PaperAirplaneIcon,
  EyeIcon,
  TrashIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';

// --------------------- 類型定義 ---------------------
type NotificationType = '活動提醒' | '報名成功' | '系統公告' | '活動變更';

interface SentNotification {
  id: string;
  recipientName: string;
  title: string;
  type: NotificationType;
  sentAt: string;
  isRead: boolean; // 保持此欄位以與 localStorage 的結構相容，但在本組件中不使用
}

const templates = {
  '報名成功': { title: '您的「{活動名稱}」報名成功！', content: '親愛的 會員，\n\n恭喜您已成功報名「{活動名稱}」。\n活動時間：{活動時間}\n活動地點：{活動地點}\n\n期待您的參與！' },
  '活動提醒': { title: '活動提醒：「{活動名稱}」即將開始！', content: '親愛的 會員，\n\n提醒您，您報名的活動「{活動名稱}」將於 {提醒時間} 開始。\n請準時參加！' },
  '活動變更': { title: '重要通知：「{活動名稱}」活動已變更', content: '親愛的 會員，\n\n通知您，您報名的活動「{活動名稱}」資訊已更新，詳情請至活動頁面查看。' },
};

// --------------------- 子組件：通知管理 ---------------------
const NotificationList = () => {
  // ⭐️ 狀態管理：增加 loading, error, totalItems 狀態
  const [notifications, setNotifications] = useState<SentNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<NotificationType | 'ALL'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 8; // 增加每頁顯示數量

  // ⭐️ 資料獲取：改為從 localStorage 讀取
  const loadNotifications = useCallback(() => {
    setIsLoading(true);
    setError(null);
    try {
      const data = localStorage.getItem('demo_notifications');
      const allItems: SentNotification[] = data ? JSON.parse(data) : [];

      // 模擬後端篩選和搜尋
      const lowerSearchTerm = searchTerm.toLowerCase();
      const filteredItems = allItems.filter(n => {
        const typeMatch = filterType === 'ALL' || n.type === filterType;
        const searchMatch = !lowerSearchTerm || n.title.toLowerCase().includes(lowerSearchTerm);
        return typeMatch && searchMatch;
      });

      setTotalItems(filteredItems.length);
      // 模擬後端分頁
      const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
      setNotifications(paginatedItems);
    } catch (e) {
      setError('讀取通知時發生錯誤。');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, filterType, searchTerm, itemsPerPage]);

  useEffect(() => {
    loadNotifications();
    window.addEventListener('notifications-updated', loadNotifications);
    return () => window.removeEventListener('notifications-updated', loadNotifications);
  }, [loadNotifications]);

  // ⭐️ 新增：刪除通知的處理函式
  const handleDelete = useCallback((id: string, title: string) => {
    if (window.confirm(`確定要刪除通知：「${title}」嗎？`)) {
      const existingNotifications: SentNotification[] = JSON.parse(localStorage.getItem('demo_notifications') || '[]');
      const updatedNotifications = existingNotifications.filter(n => n.id !== id);
      localStorage.setItem('demo_notifications', JSON.stringify(updatedNotifications));

      // 觸發列表重新載入
      loadNotifications();
      // 觸發其他組件（如鈴鐺）更新
      window.dispatchEvent(new CustomEvent('notifications-updated'));
    }
  }, [loadNotifications]);

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
            placeholder="搜尋標題..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // 搜尋時回到第一頁
            }}
            className="w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-4 focus:ring-2  transition text-gray-700 placeholder-gray-400 h"
          />
        </div>
        <div className="flex items-center gap-4">
          <FunnelIcon className="h-5 w-5 text-gray-500" />
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value as NotificationType | 'ALL');
              setCurrentPage(1); // 篩選時回到第一頁
            }}
            className="border border-gray-300 rounded-lg py-2.5 px-3 focus:ring-2 text-gray-700 "
          >
            <option value="ALL">所有類型</option>
            {Object.keys(styles).map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-6 bg-white shadow-md rounded-lg overflow-hidden">
        {/* ⭐️ 加上滾輪 */}
        <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['接收者', '標題', '類型', '發送時間', '操作'].map(header => (
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button onClick={() => handleDelete(n.id, n.title)} className="p-1.5 rounded-md text-red-500 hover:bg-red-100 transition-colors cursor-pointer" title="刪除通知"><TrashIcon className="h-5 w-5" /></button>
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
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"><ChevronLeftIcon className="h-5 w-5 text-gray-600 cursor-pointer" /></button>
          <span className="text-sm text-gray-700">第 {currentPage} / {totalPages || 1} 頁</span>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages} className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"><ChevronRightIcon className="h-5 w-5 text-gray-600 cursor-pointer" /></button>
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
    const notificationData = {
      id: `notif_${Date.now()}`, // 產生一個獨特的 ID
      recipientName: '所有會員', // ⭐️ 修正：固定接收者
      title: title,
      content: content,
      type: template,
      sentAt: new Date().toISOString(), // 使用 ISO 格式以方便排序和解析
      isRead: false,
    };

    setIsSending(true);
    // 模擬 API 呼叫延遲
    await new Promise(resolve => setTimeout(resolve, 1000));

    // --- 核心修改：將通知寫入 localStorage ---
    const existingNotifications = JSON.parse(localStorage.getItem('demo_notifications') || '[]');
    const newNotifications = [notificationData, ...existingNotifications];
    localStorage.setItem('demo_notifications', JSON.stringify(newNotifications));

    // --- 核心修改：發送事件以觸發列表更新 ---
    window.dispatchEvent(new CustomEvent('notifications-updated'));
    alert(`「${title}」已發送！\n您可以在「通知管理」頁籤看到剛剛發送的紀錄。`);
    setIsSending(false);
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
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-2   text-gray-700  px-4 py-2.5"
          >
            {Object.keys(templates).map(name => <option key={name} value={name}>{name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">通知標題</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-700 hover:border-orange-400 transition-colors px-4 py-2.5"
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">通知內容</label>
          <textarea
            id="content"
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-700 hover:border-orange-400 transition-colors p-2.5"
          ></textarea>
          <p className="mt-2 text-xs text-gray-500">提示：您可以使用 `{'{變數}'}` 來插入動態內容，如 `{'{活動名稱}'}`。</p>
        </div>
        <div className="text-right">
          <button
            onClick={handleSend}
            disabled={isSending}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700 transition disabled:bg-gray-400 cursor-pointer disabled:cursor-not-allowed"
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
    const notificationData = {
      id: `notif_${Date.now()}`,
      recipientName: '所有會員', // ⭐️ 修正：固定接收者
      title: title,
      content: content,
      type: '系統公告' as NotificationType,
      sentAt: new Date().toISOString(),
      isRead: false,
    };

    setIsSending(true);
    // 模擬 API 呼叫延遲
    await new Promise(resolve => setTimeout(resolve, 1000));

    // --- 核心修改：寫入 localStorage (與模板發送邏輯相同) ---
    const existingNotifications = JSON.parse(localStorage.getItem('demo_notifications') || '[]');
    const newNotifications = [notificationData, ...existingNotifications];
    localStorage.setItem('demo_notifications', JSON.stringify(newNotifications));

    // --- 核心修改：發送事件以觸發列表更新 ---
    window.dispatchEvent(new CustomEvent('notifications-updated'));
    alert(`「${title}」已發送！\n您可以在「通知管理」頁籤看到剛剛發送的紀錄。`);
    // 清空表單
    setTitle('');
    setContent('');
    setIsSending(false);
  };

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* 左側：編輯區 */}
      <div className="space-y-6">
        <div>
          <label htmlFor="custom-title" className="block text-sm font-medium text-gray-700">通知標題</label>
          <input
            type="text"
            id="custom-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="請輸入自訂通知標題"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-700 placeholder-gray-400 hover:border-orange-400 transition-colors px-4 py-2.5"
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
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-700 placeholder-gray-400 hover:border-orange-400 transition-colors p-2.5"
          ></textarea>
        </div>
        <div className="text-right">
          <button
            onClick={handleSend}
            disabled={isSending}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700 transition disabled:bg-gray-400 cursor-pointer disabled:cursor-not-allowed "
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