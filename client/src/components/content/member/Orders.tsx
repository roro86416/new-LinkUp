'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiClient } from '../../../api/auth/apiClient';
import { 
  EyeIcon, 
  ReceiptRefundIcon, 
  ClockIcon, 
  XCircleIcon, 
  CreditCardIcon 
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { redirectToECPay } from '../../../utils/ecpay';

// --- 類型定義 ---
interface OrderItem {
  id: number;
  item_name: string;
  quantity: number;
  unit_price: string;
}

interface Order {
  id: number;
  order_number: string;
  created_at: string;
  expires_at: string; // 用於計算倒數
  total_amount: string;
  status: 'pending' | 'paid' | 'cancelled' | 'completed';
  items: OrderItem[];
}

interface OrdersApiResponse {
  status: string;
  data: Order[];
}

interface RepayApiResponse {
  status: string;
  data: {
    orderId: number;
    ecpay: {
      apiUrl: string;
      formData: Record<string, string | number>;
    };
  };
}

// [小元件] 倒數計時器
const CountdownTimer = ({ expiresAt }: { expiresAt: string }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(expiresAt) - +new Date();
      
      if (difference > 0) {
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        // 補零
        const m = minutes.toString().padStart(2, '0');
        const s = seconds.toString().padStart(2, '0');
        setTimeLeft(`${m}:${s}`);
      } else {
        setTimeLeft('00:00');
        setIsExpired(true);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  if (isExpired) return <span className="text-red-500 font-bold text-sm">已過期 (等待系統取消)</span>;
  
  return (
    <span className="text-orange-600 font-mono font-bold flex items-center gap-1 text-sm">
      <ClockIcon className="w-4 h-4" />
      付款剩餘: {timeLeft}
    </span>
  );
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // 重新付款邏輯
  const handleRepay = async (orderId: number) => {
    const toastId = toast.loading("正在前往付款...");
    try {
      // 1. 呼叫後端 repay API
      const response = await apiClient.post<RepayApiResponse>(`/api/v1/orders/${orderId}/repay`, {});
      
      const { ecpay } = response.data;
      
      // 2. 儲存 OrderID (為了讓成功頁面可以 fake-pay 測試用)
      localStorage.setItem('lastOrderId', orderId.toString());

      // 3. 跳轉綠界
      redirectToECPay(ecpay);
      
    } catch (error) {
      console.error(error);
      toast.error("無法前往付款，訂單可能已過期", { id: toastId });
      // 重新整理列表以更新狀態
      fetchOrders();
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await apiClient.get<OrdersApiResponse>('/api/v1/orders');
      if (response && response.data) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error('載入訂單失敗:', error);
      // toast.error('無法載入訂單列表');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">已付款</span>;
      case 'completed':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">已使用</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">待付款</span>;
      case 'cancelled':
        return <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">已取消</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">{status}</span>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">我的訂單</h1>
        <p className="text-gray-500">查看您的所有歷史訂單與交易紀錄。</p>
      </header>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-100">
          <ReceiptRefundIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">目前沒有訂單</h3>
          <p className="mt-1 text-sm text-gray-500">您還沒有購買任何活動票券或商品。</p>
          <button
            onClick={() => router.push('/')}
            className="mt-6 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            前往瀏覽活動
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono text-sm text-gray-500">#{order.order_number}</span>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="text-sm text-gray-400">{formatDate(order.created_at)}</div>
                </div>
                <div className="text-right">
                  <span className="block text-lg font-bold text-gray-900">
                    NT$ {Number(order.total_amount).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="border-t border-gray-100 pt-4 mb-4 cursor-pointer" onClick={() => router.push(`/orders/${order.id}`)}>
                {order.items.slice(0, 2).map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-gray-700 mb-1">
                    <span>{item.item_name} x {item.quantity}</span>
                  </div>
                ))}
                {order.items.length > 2 && (
                  <div className="text-xs text-gray-400 mt-1">...還有 {order.items.length - 2} 個項目</div>
                )}
              </div>

              {/* Action Area */}
              <div className="flex justify-between items-center pt-2 border-t border-dashed border-gray-200">
                
                {/* 左側：狀態提示 */}
                <div>
                  {order.status === 'pending' && (
                     <CountdownTimer expiresAt={order.expires_at} />
                  )}
                  {order.status === 'cancelled' && (
                    <span className="text-gray-400 text-sm flex items-center gap-1">
                      <XCircleIcon className="w-4 h-4" />
                      訂單已取消/過期
                    </span>
                  )}
                </div>

                {/* 右側：按鈕動作 */}
                <div className="flex gap-2">
                  {order.status === 'pending' && (
                    <button
                      onClick={() => handleRepay(order.id)}
                      className="flex items-center gap-1 bg-orange-600 text-white hover:bg-orange-700 px-4 py-2 rounded-md font-medium text-sm transition shadow-sm"
                    >
                      <CreditCardIcon className="w-4 h-4" />
                      立即付款
                    </button>
                  )}
                  
                  {/* 任何狀態都可以查看詳情，但付款後按鈕會更顯眼 */}
                  <button
                    onClick={() => router.push(`/orders/${order.id}`)}
                    className={`flex items-center gap-1 px-4 py-2 rounded-md font-medium text-sm transition border ${
                      (order.status === 'paid' || order.status === 'completed')
                        ? 'bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <EyeIcon className="w-4 h-4" />
                    查看詳情
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}