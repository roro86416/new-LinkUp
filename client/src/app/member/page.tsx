'use client';

import { useSearchParams } from 'next/navigation';
import { ReactNode } from 'react';

// 引入所有會員內容元件
import AccountSettings from '../../components/content/member/AccountSettings';
import Messages from '../../components/content/member/Messages';
import Favorites from '../../components/content/member/Favorites';

export default function MemberPage() {
  const searchParams = useSearchParams();
  const section = searchParams.get('section');

  const renderContent = (): ReactNode => {
    switch (section) {
      case '帳號設定':
        return <AccountSettings />;
      case '訊息管理':
        return <Messages />;
      case '我的收藏':
        return <Favorites />;
      default:
        // 如果沒有 section 或 section 不匹配，預設顯示帳號設定
        return <AccountSettings />;
    }
  };

  // 這個頁面只渲染對應的內容，版面由 layout.tsx 控制
  return <>{renderContent()}</>;
}
