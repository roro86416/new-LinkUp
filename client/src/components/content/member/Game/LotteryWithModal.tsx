'use client'; // 因為使用了 useState，需要標記為客戶端元件

import React, { useState } from 'react';
import LotteryModal from './LotteryModal';
import LotteryGame from './LotteryGame';

const LotteryWithModal: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      {/* 這個按鈕就是您要放在 Sidebar 的按鈕 */}
      <button
        onClick={openModal}
        className="sidebar-lottery-button" // 您可以自訂樣式
      >
        幸運抽獎
      </button>

      {/* 彈出視窗與其中的抽獎遊戲 */}
      <LotteryModal isOpen={isModalOpen} onClose={closeModal}>
        <LotteryGame />
      </LotteryModal>
    </>
  );
};

export default LotteryWithModal;