// new-LinkUp/client/src/app/(shop)/checkout/success/page.tsx
'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CheckCircleIcon, TicketIcon, HomeIcon } from '@heroicons/react/24/outline';
import { apiClient } from '../../../../api/auth/apiClient';

export default function CheckoutSuccessPage() {
  const [status, setStatus] = useState("付款成功！");
  const [isChecking, setIsChecking] = useState(false); 

  useEffect(() => {
    const orderId = localStorage.getItem('lastOrderId');
    if (orderId) {
      const timer = setTimeout(() => {
        setIsChecking(true);
        setStatus("正在確認訂單狀態...");
        apiClient.post(`/api/v1/orders/${orderId}/fake-pay`, {})
          .then(() => {
            setStatus("付款成功！訂單已確認。");
            localStorage.removeItem('lastOrderId');
          })
          .catch((err) => { console.error(err); setStatus("付款成功！"); })
          .finally(() => { setIsChecking(false); });
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 animate-in fade-in zoom-in duration-500">
      <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md w-full border border-gray-100 relative overflow-hidden">
        
        {/* 背景裝飾 */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-green-600"></div>

        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-5 rounded-full shadow-inner">
            <CheckCircleIcon className="w-20 h-20 text-green-600" />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
          {status}
        </h1>
        
        <p className="text-gray-500 mb-10 leading-relaxed">
          感謝您的購買！您的訂單已建立。<br/>
          電子票券已發送至您的會員帳戶。
        </p>

        <div className="space-y-4">
          <Link 
            href="/member?section=我的訂單" 
            className="flex items-center justify-center gap-2 w-full bg-[#EF9D11] text-white font-bold py-3.5 rounded-xl hover:bg-[#d88d0e] transition-all shadow-lg shadow-orange-200"
          >
            <TicketIcon className="w-5 h-5" />
            查看我的票券
          </Link>

          <Link 
            href="/" 
            className="flex items-center justify-center gap-2 w-full bg-gray-50 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
          >
            <HomeIcon className="w-5 h-5" />
            回首頁逛逛
          </Link>
        </div>

      </div>
    </div>
  );
}