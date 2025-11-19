'use client';

import React from 'react';
import LotteryGame from './LotteryGame';

/**
 * 幸運摸彩頁面
 * 這個元件作為一個完整的頁面容器，包裹著抽獎遊戲。
 * 您可以在父層元件中，當 activeMenu 為 '幸運摸彩' 時，直接渲染這個頁面。
 */
const LotteryPage: React.FC = () => {
  return (
    // ⭐️ 新增：使用 flex 佈局讓內容水平和垂直置中
    <div className="w-full h-full flex items-center justify-center">
      <LotteryGame />
    </div>
  );
};

export default LotteryPage;