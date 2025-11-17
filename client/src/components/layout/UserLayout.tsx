'use client';

import { ReactNode } from 'react';
import Sidebar from './Sidebar';

// 刪除了所有 content/ 的 import

interface UserLayoutProps {
  type: 'member' | 'admin';
  children: React.ReactNode;
}

// [修正] 確保解構 children
export default function UserLayout({ type, children }: UserLayoutProps) {
  
  // [修正] 刪除了 activeMenu 的 useState
  // [修正] 刪除了 renderContent() 函式

  return (
    <div className="bg-[#f5f5f5] flex gap-6 min-h-screen p-12 justify-center">
      <Sidebar
        type={type}
      />

      <div className="bg-white rounded-md p-6 w-[952px]">
        {children}
      </div>
    </div>
  );
}