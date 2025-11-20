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
    // 您可以在這裡加入頁面標題或其他外層結構
    <LotteryGame />
  );
};

export default LotteryPage;