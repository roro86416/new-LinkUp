// new-LinkUp/client/src/app/member/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { ReactNode } from 'react';

// 引入各個分頁元件
import AccountSettings from '../../components/content/member/AccountSettings';
import Messages from '../../components/content/member/Messages'; // 對應 "通知管理"
import Orders from '../../components/content/member/Orders';     // 對應 "我的訂單"
import Favorites from '../../components/content/member/Favorites'; // 對應 "我的收藏"
import MyCoupons from '../../components/content/member/MyCoupons'; // 對應 "折價券"
import LotteryGame from '../../components/content/member/Game/LotteryGame'; // 對應 "幸運抽獎"

export default function MemberPage() {
  const searchParams = useSearchParams();
  const section = searchParams.get('section');

  const renderContent = (): ReactNode => {
    switch (section) {
      case '會員設定':
        return <AccountSettings />;
      case '通知管理':
        return <Messages />;
      case '我的訂單':
        return <Orders />;
      case '我的收藏':
        return <Favorites />;
      case '折價券':
        return <MyCoupons />;
      case '幸運抽獎':
        return <LotteryGame />;
      default:
        return <AccountSettings />;
    }
  };

  return <>{renderContent()}</>;
}