// new-LinkUp/client/src/components/content/member/Orders.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '../../../api/auth/apiClient';
import { ReceiptRefundIcon, ClockIcon, XCircleIcon, CreditCardIcon, QrCodeIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { redirectToECPay } from '../../../utils/ecpay';

interface OrderItem {
  id: number;
  item_name: string;
  quantity: number;
  unit_price: string;
  ticket_type?: { event_id: number }
}

interface Order {
  id: number;
  order_number: string;
  created_at: string;
  expires_at: string;
  total_amount: string;
  status: 'pending' | 'paid' | 'cancelled' | 'completed';
  items: OrderItem[];
  event?: { id: number; title: string };
  is_reviewed?: boolean;
}
interface OrdersApiResponse { status: string; data: Order[]; }

const CountdownTimer = ({ expiresAt }: { expiresAt: string }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isExpired, setIsExpired] = useState(false);
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(expiresAt) - +new Date();
      if (difference > 0) {
        const m = Math.floor((difference / 1000 / 60) % 60).toString().padStart(2, '0');
        const s = Math.floor((difference / 1000) % 60).toString().padStart(2, '0');
        setTimeLeft(`${m}:${s}`);
      } else {
        setTimeLeft('00:00'); setIsExpired(true);
      }
    };
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);
  if (isExpired) return <span className="text-red-400 font-bold text-xs">逾時待取消</span>;
  return <span className="text-[#EF9D11] font-mono font-bold flex items-center gap-1 text-xs"><ClockIcon className="w-3 h-3" /> 付款剩餘: {timeLeft}</span>;
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const handleRepay = async (orderId: number) => {
    const toastId = toast.loading("正在前往付款...");
    try {
      const response = await apiClient.post<any>(`/api/v1/orders/${orderId}/repay`, {});
      localStorage.setItem('lastOrderId', orderId.toString());
      redirectToECPay(response.data.ecpay);
    } catch (error) { toast.error("無法前往付款", { id: toastId }); fetchOrders(); }
  };

  const fetchOrders = async () => {
    try {
      const response = await apiClient.get<OrdersApiResponse>('/api/v1/orders');
      if (response?.data) setOrders(response.data);
    } catch (error) { console.error(error); } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const getStatusBadge = (status: string) => {
    const map: Record<string, any> = {
      paid: <span className="px-2 py-0.5 bg-green-500/20 text-green-400 border border-green-500/30 text-xs rounded-full">已付款</span>,
      completed: <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs rounded-full">已參加</span>,
      pending: <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-xs rounded-full">待付款</span>,
      cancelled: <span className="px-2 py-0.5 bg-white/10 text-gray-400 border border-white/20 text-xs rounded-full">已取消</span>,
    };
    return map[status] || <span>{status}</span>;
  };

  // [修改] 跳轉至活動評價頁面
  const handleGoToReview = (order: Order) => {
    // 優先從 order.event 拿，沒有才從 items 找
    let eventId = order.event?.id;
    if (!eventId && order.items.length > 0) {
      // 這裡需要轉型或確認 items 結構，假設後端有 populate
      eventId = (order.items[0] as any).ticketType?.event?.id;
    }

    if (!eventId) {
      toast.error("無法取得活動資訊");
      return;
    }

    // 導向：帶上 action=review 會自動開啟編輯框
    router.push(`/event/${eventId}?tab=rating&action=review`);
  };

  if (isLoading) return <div className="text-center py-20 text-gray-400">載入訂單中...</div>;

  return (
    <div className="w-full mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300 relative">
      <header className="mb-8 border-b border-white/10 pb-6">
        <h1 className="text-2xl font-extrabold text-white mb-2 flex items-center gap-2">
          <ReceiptRefundIcon className="w-7 h-7 text-[#EF9D11]" /> 我的訂單
        </h1>
        <p className="text-gray-400">查看您的所有歷史訂單與交易紀錄。</p>
      </header>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
          <ReceiptRefundIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="mt-2 text-lg font-medium text-white">目前沒有訂單</h3>
          <button onClick={() => router.push('/')} className="mt-6 px-6 py-2 bg-[#EF9D11] text-white rounded-full hover:bg-[#d88d0e] transition">前往瀏覽活動</button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono text-sm text-white/80">#{order.order_number}</span>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</div>
                </div>
                <div className="text-right">
                  <span className="block text-lg font-bold text-[#EF9D11]">NT$ {Number(order.total_amount).toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 mb-4 cursor-pointer" onClick={() => {
                if (order.status === 'paid' || order.status === 'completed') {
                  router.push(`/orders/${order.id}`);
                }
              }}>
                {order.items.slice(0, 2).map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-gray-300 mb-1 group-hover:text-white transition-colors">
                    <span>{item.item_name} x {item.quantity}</span>
                  </div>
                ))}
                {order.items.length > 2 && <div className="text-xs text-gray-500 mt-1">...還有 {order.items.length - 2} 個項目</div>}
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-dashed border-white/10">
                <div>
                  {order.status === 'pending' && <CountdownTimer expiresAt={order.expires_at} />}
                  {order.status === 'cancelled' && <span className="text-gray-500 text-xs flex items-center gap-1"><XCircleIcon className="w-3 h-3" /> 訂單已取消</span>}
                </div>
                <div className="flex gap-2">

                  {/* 待付款：立即付款 */}
                  {order.status === 'pending' && (
                    <button onClick={() => handleRepay(order.id)} className="flex items-center gap-1 bg-green-600 text-white hover:bg-green-500 px-4 py-1.5 rounded-lg font-bold text-xs transition shadow-lg shadow-green-900/20">
                      <CreditCardIcon className="w-3 h-3" /> 立即付款
                    </button>
                  )}

                  {/* 已付款：查看電子票券 */}
                  {order.status === 'paid' && (
                    <button onClick={() => router.push(`/orders/${order.id}`)} className="flex items-center gap-1 bg-[#EF9D11] text-white hover:bg-[#d88d0e] px-4 py-1.5 rounded-lg font-bold text-xs transition shadow-lg shadow-orange-900/20">
                      <QrCodeIcon className="w-3 h-3" /> 查看電子票券
                    </button>
                  )}

                  {/* 已完成 (已參加)：查看票券 + 留下評價(跳轉) */}
                  {order.status === 'completed' && (
                    <div className="flex gap-2">
                      <button onClick={() => router.push(`/orders/${order.id}`)} className="flex items-center gap-1 border border-[#EF9D11] text-[#EF9D11] hover:bg-[#EF9D11] hover:text-white px-4 py-1.5 rounded-lg font-bold text-xs transition">
                        <QrCodeIcon className="w-3 h-3" /> 查看票券
                      </button>
                      {/* 這裡觸發跳轉 */}
                      <button
                        onClick={() => handleGoToReview(order)}
                        className={`flex items-center gap-1 px-4 py-1.5 rounded-lg font-bold text-xs transition shadow-lg 
                                ${order.is_reviewed
                            ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 shadow-black/20' // 已評價：灰色
                            : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-900/20' // 未評價：藍色
                          }`}
                      >
                        <PencilSquareIcon className="w-3 h-3" />
                        {order.is_reviewed ? '修改評價' : '留下評價'}
                      </button>
                    </div>
                  )}

                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}