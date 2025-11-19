'use client';

// [新增] 引入 Link 和 usePathname
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// [保留] 原有的 import
import { ReactElement, useState, ChangeEvent } from 'react'; // 保留 useState/ChangeEvent 給大頭照上傳
import { AiOutlineSetting, AiOutlineInbox, AiOutlineStar, AiOutlineCamera, AiOutlineOrderedList} from 'react-icons/ai';
import { FiPackage, FiBarChart2 } from 'react-icons/fi';
import { useUser } from '../../context/auth/UserContext';

// [新增] 定義菜單項目 (包含 href)
interface MenuItem {
  label: string;
  icon: ReactElement;
  href: string;
}

// 會員菜單連結
const memberMenus: MenuItem[] = [
  { label: '帳號設定', icon: <AiOutlineSetting />, href: '/member' },
  { label: '訊息管理', icon: <AiOutlineInbox />, href: '/member/messages' },
  { label: '我的收藏', icon: <AiOutlineStar />, href: '/member/favorites' },
   { label: '我的訂單', icon: <AiOutlineOrderedList />, href: '/member/orders' },
];

// 
// [TODO] 請檢查這裡的 href 是否正確！
// 
// 管理員菜單連結 (請確保 href 和你步驟 3 建立的資料夾名稱一致)
const adminMenus: MenuItem[] = [
  { label: '後台總覽', icon: <FiBarChart2 />, href: '/admin' },
  // [注意] 下面這兩行是我猜的，請改成你實際的路由！
  { label: '主辦方管理', icon: <AiOutlineSetting />, href: '/admin/organizers' }, 
  { label: '活動管理', icon: <AiOutlineSetting />, href: '/admin/events' },
  // [注意] 下面這兩行應該是正確的
  { label: '交易管理', icon: <FiPackage />, href: '/admin/transactions' },
  { label: '系統公告管理', icon: <AiOutlineSetting />, href: '/admin/announcements' },
];


// [修正] SidebarProps 不再需要 activeMenu 和 onMenuChange
export interface SidebarProps {
  type: 'member' | 'admin';
}

// [修正] 函式簽名不再接收 activeMenu 和 onMenuChange
export default function Sidebar({ type }: SidebarProps) {
  const { user, updateUser, loading } = useUser();
  
  // [新增] 獲取當前路徑
  const pathname = usePathname(); 

  // [新增] 根據 type 選擇菜單
  const menus = type === 'member' ? memberMenus : adminMenus;

  // [保留] 大頭照上傳邏輯 (完全不變)
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const newAvatar = reader.result as string;
      updateUser({ avatar: newAvatar }); // 更新 Context → Header 即時同步
    };
    reader.readAsDataURL(file);
  };

  return (
    <aside className="bg-white w-[280px] h-[660px] rounded-2xl p-6 flex flex-col gap-8 shadow-2xl shadow-gray-200/50">
      
      {/* [保留] 大頭照和使用者資訊區 (完全不變) */}
      <div className="relative w-[120px] h-[120px] mx-auto group rounded-full border-4 border-orange-100 ring-2 ring-orange-300 " >
        {loading ? (
          <div className="w-full h-full rounded-full bg-gray-200 animate-pulse" />
        ) : user?.avatar ? (
          <img src={user.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" />
        ) : (
          <div className="w-full h-full rounded-full bg-gray-500 flex items-center justify-center text-white text-5xl font-bold">
            {user?.name?.[0]?.toUpperCase() || '?'}
          </div>
        )}
        <label
          htmlFor="avatar-upload"
          className="absolute bottom-0 right-0 bg-[#EF9D11] text-white p-2 rounded-full border-4 border-white shadow-lg hover:bg-[#d9890e] transition duration-200 cursor-pointer"
        >
          <AiOutlineCamera className="w-4 h-4" />
        </label>
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
        />
      </div>

      <div className="text-center">
        {loading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
          </div>
        ) : (
          <><p className="text-xl font-bold text-gray-800">{user?.name || (type === 'member' ? '普通會員' : '系統管理員')}</p><p className="text-sm text-gray-500 mt-0.5">{user?.email || 'user@example.com'}</p></>
        )}
      </div>

      {/* [核心修正] 菜單迴圈 */}
      <div className="flex flex-col gap-2">
        {menus.map(item => {
          // [修正] 判斷啟用中的邏輯，改為比較路徑
          const isActive = pathname === item.href;
          return (
            // [修正] <button> 改為 <Link>
            <Link
              key={item.label}
              href={item.href} // [修正] 加上 href
              // [修正] 刪除 onClick
              className={`flex items-center gap-4 w-full text-left cursor-pointer py-3 px-4 rounded-xl transition-all duration-200
                ${isActive
                  ? 'bg-[#EF9D11] text-white font-semibold shadow-lg shadow-orange-400/50'
                  : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600 font-medium'
                }`}
            >
              <span className={`flex items-center justify-center w-5 h-5 ${isActive ? 'text-white' : 'text-orange-600'}`}>
                {item.icon}
              </span>
              <span className="text-base">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}