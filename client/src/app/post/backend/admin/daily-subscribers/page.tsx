"use client" // 必須聲明為客戶端組件

import React from 'react';
// 假設 SubscriberCounter.tsx 位於 app/components/
import SubscriberCounter from './SubscribersChart'; 

// ⚠️ 注意：metadata 相關的程式碼已從此文件移除，並移至 layout.tsx

const SubscriberPage: React.FC = () => {
  return (
    // 移除 min-h-screen 和 bg-gray-950，因為這些已經在 layout.tsx 中處理
    <div className="flex-grow flex flex-col">

        {/* Main Content Area: Centered in the middle of the remaining screen space */}
        <main className="flex-grow flex items-center justify-center py-10 px-4">
          <SubscriberCounter />
        </main>

        {/* Footer */}
        <footer className="w-full text-center p-4 text-xs text-gray-600 border-t border-gray-800">
          Project built with Next.js & Tailwind CSS. Simulated data.
        </footer>
    </div>
  );
};

export default SubscriberPage;