'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Props = {
  eventId: number;
};

const API_BASE = 'http://localhost:3001'; // 之後可改成環境變數

export default function EventActions({ eventId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const commonBtnClass =
    'inline-flex items-center rounded-full border border-slate-300 px-3 py-1 text-slate-700 ' +
    'hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

  // 編輯：導到 /events/[id]/edit（group (organizer) 不會出現在 URL）
  const handleEdit = () => {
    router.push(`/events/${eventId}/edit`);
  };

  // 刪除：對應後端 /api/v1/organizer/events/:id
  const handleDelete = async () => {
    if (!confirm('確定要刪除這場活動？刪除後無法復原。')) return;
    try {
      setLoading(true);
      const res = await fetch(
        `${API_BASE}/api/v1/organizer/events/${eventId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      if (!res.ok) {
        throw new Error('刪除失敗');
      }

      router.refresh(); // 重新抓 dashboard 的資料
    } catch (err) {
      console.error(err);
      alert('刪除失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  // 複製：對應後端 /api/v1/organizer/events/:id/copy
  const handleCopy = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${API_BASE}/api/v1/organizer/events/${eventId}/copy`,
        {
          method: 'POST',
          credentials: 'include',
        }
      );

      if (!res.ok) {
        throw new Error('複製失敗');
      }

      router.refresh();
    } catch (err) {
      console.error(err);
      alert('複製失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 text-[11px]">
      <button
        type="button"
        onClick={handleEdit}
        className={commonBtnClass}
        disabled={loading}
      >
        編輯
      </button>
      <button
        type="button"
        onClick={handleDelete}
        className={commonBtnClass}
        disabled={loading}
      >
        刪除
      </button>
      <button
        type="button"
        onClick={handleCopy}
        className={commonBtnClass}
        disabled={loading}
      >
        {loading ? '處理中…' : '複製'}
      </button>
    </div>
  );
}