'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { apiClient } from '../../../../api/auth/apiClient';

export default function CheckoutSuccessPage() {
  const [status, setStatus] = useState("付款成功！");
  const [isChecking, setIsChecking] = useState(false); 

  useEffect(() => {
    const orderId = localStorage.getItem('lastOrderId');

    if (orderId) {
      // [修正] 使用 setTimeout 包裹，將狀態更新延後到下一個 Tick
      // 這能完美解決 "Calling setState synchronously within an effect" 警告
      const timer = setTimeout(() => {
        setIsChecking(true);
        setStatus("正在確認訂單狀態...");

        apiClient.post(`/api/v1/orders/${orderId}/fake-pay`, {})
          .then(() => {
            setStatus("付款成功！訂單已確認。");
            localStorage.removeItem('lastOrderId');
          })
          .catch((err) => {
            console.error(err);
            setStatus("付款成功！");
          })
          .finally(() => {
            setIsChecking(false);
          });
      }, 0);

      // 清除 timer (雖然通常用不到，但是個好習慣)
      return () => clearTimeout(timer);
    }
  }, []);
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full border border-gray-100">
        
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircleIcon className="w-16 h-16 text-green-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          付款成功！
        </h1>
        
        <p className="text-gray-600 mb-8">
          感謝您的購買，您的電子票券已建立。
          <br />
          您可以前往「我的訂單」查看詳細資訊。
        </p>

        <div className="space-y-3">
          {/* 按鈕 1: 查看我的訂單 (假設您有這個頁面) */}
          <Link 
            href="/member/orders/" 
            className="block w-full bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition"
          >
            前往會員中心查看票券
          </Link>

          {/* 按鈕 2: 回首頁 */}
          <Link 
            href="/" 
            className="block w-full bg-gray-100 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-200 transition"
          >
            回首頁
          </Link>
        </div>

      </div>
    </div>
  );
}