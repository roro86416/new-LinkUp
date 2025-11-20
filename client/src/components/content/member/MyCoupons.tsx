// new-LinkUp/client/src/components/content/member/MyCoupons.tsx
'use client';
import React from 'react';
import { TicketIcon, ArrowRightIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // [引用 1] 引入路由
import toast from 'react-hot-toast';
import { useCoupons } from './CouponsContext'; // [引用 2] 改用 Context

export default function MyCoupons() {
  const router = useRouter();
  const { coupons, removeCoupon } = useCoupons(); // [引用 2]

  // [功能] 使用折價券：刪除並跳轉
  const handleUseCoupon = (id: string, name: string) => {
    // 1. 先刪除 (模擬已使用)
    removeCoupon(id);
    
    // 2. 顯示提示
    toast.success(`已套用 ${name}，請選擇活動！`);

    // 3. 跳轉到活動列表
    router.push('/events');
  };

  return (
    <div className="w-full mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
      <header className="mb-8 border-b border-white/10 pb-6">
        <h2 className="text-2xl font-extrabold text-white mb-2 flex items-center gap-2">
            <TicketIcon className="w-7 h-7 text-[#EF9D11]" /> 我的折價券
        </h2>
        <p className="text-gray-400">來自幸運抽獎的專屬優惠。</p>
      </header>

      {coupons.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
          <div className="bg-white/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
             <TicketIcon className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="mt-2 text-xl font-bold text-white">目前沒有折價券</h3>
          <p className="text-gray-400 mt-2">快去參加幸運抽獎試試手氣！</p>
          <Link href="/member?section=幸運抽獎" className="mt-8 inline-flex items-center gap-2 px-8 py-3 bg-[#EF9D11] text-white font-bold rounded-xl hover:bg-[#d88d0e] transition shadow-lg shadow-orange-500/20">
            前往抽獎 <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coupons.map((coupon) => (
            <div key={coupon.id} className="relative group">
               {/* [樣式修改] 
                  1. 移除 backdrop-blur (玻璃特效)
                  2. 背景改為 bg-gray-900 (深色實底) 
                  3. 邊框改為實線 border-gray-700
               */}
               <div className="bg-gray-900 border border-gray-700 h-full rounded-2xl p-6 flex justify-between items-center relative overflow-hidden shadow-xl">
                  
                  {/* 裝飾：左側漸層條 */}
                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-[#EF9D11] to-red-500"></div>

                  {/* 裝飾：票券缺口 (模擬實體票券感) */}
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4  rounded-full z-10"></div>
                  <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-500 rounded-full z-10"></div>

                  <div className="pl-4 flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-white mb-1 truncate">{coupon.name}</h3>
                      <p className="text-[#EF9D11] font-mono text-sm tracking-wider font-bold">
                        價值 NT$ {coupon.value}
                      </p>
                      <p className="text-gray-500 text-xs mt-3">
                        有效期限: {new Date(coupon.expiresAt).toLocaleDateString()}
                      </p>
                  </div>
                  
                  {/* 立即使用按鈕 */}
                  <button 
                    onClick={() => handleUseCoupon(coupon.id, coupon.name)}
                    className="flex flex-col items-center justify-center gap-1 bg-white/10 hover:bg-white/20 text-white w-20 h-20 rounded-full border border-white/20 transition backdrop-blur-md"
                  >
                      <span className="text-xs">立即使用</span>
                      <ArrowRightIcon className="w-4 h-4" />
                  </button>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}