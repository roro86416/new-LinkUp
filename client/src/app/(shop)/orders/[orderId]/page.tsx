'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
// [路徑修正] 根據檔案位置調整 apiClient 引用層級
import { apiClient } from '../../../../api/auth/apiClient'; 
import toast from 'react-hot-toast';
import Link from 'next/link';
import { ChevronRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { QRCodeSVG } from 'qrcode.react';

interface TicketData {
  id: number;
  name: string;
  email: string;
  phone: string;
  qr_code_data: string; 
  status: string; 
}

interface OrderItemData {
  id: number;
  item_type: 'ticket_types' | 'products';
  item_name: string;
  quantity: number;
  ticket: TicketData | null; 
}

interface EventData {
  title: string;
  start_time: string;
  location_name: string;
}

interface OrderData {
  id: number;
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
  event: EventData;
  items: OrderItemData[];
}

interface ApiResponse {
  status: "success";
  data: OrderData;
}

export default function OrderDetailsPage() {
  const params = useParams(); 
  const orderId = params.orderId as string; 

  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return; 

    const fetchOrder = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get<ApiResponse>(`/api/v1/orders/${orderId}`);
        setOrderData(response.data);
      } catch (error) {
        console.error("獲取訂單失敗:", error);
        toast.error('獲取訂單失敗');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]); 

  const allTickets = useMemo(() => {
    if (!orderData) return [];
    
    // 處理票券資料結構
    // 如果後端回傳的 items 結構有變 (例如 array)，這裡可能需要微調
    // 目前依照您的原始碼邏輯保留
    return orderData.items
      .filter(item => item.item_type === 'ticket_types' && item.ticket) 
      .map(item => item.ticket!); 
  }, [orderData]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div></div>;
  }
  if (!orderData) {
    return <div className="text-center p-10">找不到訂單。</div>;
  }
  
  const formatDateTime = (isoString: string) => {
    return new Date(isoString).toLocaleString('zh-TW', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="w-full p-6 max-w-5xl mx-auto min-h-screen bg-gray-50">
      
      <nav className="flex items-center text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-orange-600 transition-colors">首頁</Link>
        <ChevronRightIcon className="w-4 h-4 mx-2" />
        {/* [修正] 導回會員中心的正確分頁 */}
        <Link href="/member?section=我的訂單" className="hover:text-orange-600 transition-colors">我的訂單</Link>
        <ChevronRightIcon className="w-4 h-4 mx-2" />
        <span className="font-medium text-gray-700">訂單 #{orderData.order_number}</span>
      </nav>
      
      <div className="flex items-center gap-3 text-green-600 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-green-100">
        <CheckCircleIcon className="w-12 h-12" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            感謝您的購買！
          </h1>
          <p className="text-green-700">這是您的電子票券，請妥善保存。</p>
        </div>
      </div>

      <div className="space-y-6">
        {allTickets.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl shadow-sm text-center">
             <p className="text-gray-500 text-lg">此訂單沒有包含電子票券（可能僅購買周邊商品）。</p>
          </div>
        ) : (
          allTickets.map((ticket, index) => (
            <div 
              key={ticket.id} 
              className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-orange-500 grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {/* (A) 左側：QR Code */}
              <div className="col-span-1 flex flex-col items-center justify-center bg-gray-50 rounded-xl p-4">
                <div className="p-4 bg-white border-2 border-gray-200 rounded-xl shadow-sm mb-4">
                  <QRCodeSVG
                    value={ticket.qr_code_data} 
                    size={160} 
                    level="H" 
                  />
                </div>
                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Scan for Entry</p>
              </div>
              
              {/* (B) 右側：票券資訊 */}
              <div className="col-span-2 flex flex-col justify-center space-y-3">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {orderData.event.title}
                  </h2>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span className="bg-gray-100 px-2 py-1 rounded-md">📍 {orderData.event.location_name}</span>
                    <span className="bg-gray-100 px-2 py-1 rounded-md">📅 {formatDateTime(orderData.event.start_time)}</span>
                  </div>
                </div>
                
                <div className="border-t border-dashed border-gray-200 my-2"></div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold">票券持有</p>
                    <p className="text-gray-800 font-medium text-lg">{ticket.name}</p>
                    <p className="text-xs text-gray-500">票券 {index + 1} / {allTickets.length}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold">聯絡 Email</p>
                    <p className="text-gray-800 font-medium break-all">{ticket.email}</p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div>
                     <p className="text-xs text-gray-400 uppercase font-bold mb-1">票券 ID</p>
                     <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-600">{ticket.qr_code_data}</code>
                  </div>
                  
                  {ticket.status === 'valid' ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-700">
                      狀態：有效
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-gray-100 text-gray-600">
                      狀態：{ticket.status === 'used' ? '已使用' : ticket.status}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}