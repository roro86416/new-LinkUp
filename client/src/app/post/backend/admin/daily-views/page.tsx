"use client" // 必須聲明為客戶端組件，因為它依賴於客戶端組件 (DailyViewsChart)

import React from 'react';
// 導入每日點閱數圖表組件
// 請確認您的組件路徑是否為 './components/DailyViewsChart'
import DailyViewsChart from './ViewsChart'; 

// ⚠️ 注意：metadata 已經移到 app/layout.tsx 處理

const DailyViewsPage: React.FC = () => {
  return (
    // flex-grow 確保頁面內容填充 layout.tsx 提供的 flex 容器
    <div className="flex-grow flex flex-col">

        {/* Main Content Area: Centered */}
        <main className="flex-grow flex items-center justify-center py-10 px-4">
          <DailyViewsChart />
        </main>

        {/* Footer */}
        <footer className="w-full text-center p-4 text-xs text-gray-600 border-t border-gray-800">
          Project built with Next.js & Tailwind CSS. Simulated data.
        </footer>
    </div>
  );
};

export default DailyViewsPage;