// src/app/post/detail/components/ErrorDisplay.tsx
import React from 'react';

interface ErrorDisplayProps {
  message: string;
  details: string;
}

export default function ErrorDisplay({ message, details }: ErrorDisplayProps) {
  return (
    <div className="max-w-xl mx-auto p-8 bg-red-50 border border-red-200 rounded-xl shadow-lg mt-20 text-red-800">
      <h2 className="text-2xl font-bold mb-4">🚨 錯誤發生：無法載入文章</h2>
      <p className="mb-2"><strong>錯誤訊息：</strong> {message}</p>
      <div className="mt-4 p-3 bg-red-100 rounded-lg text-sm font-mono whitespace-pre-wrap">
        {details}
      </div>
      <p className="mt-4 text-sm">請檢查您的後端服務是否運行，以及 ID {typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : '...'} 的文章數據是否完整。</p>
    </div>
  );
}