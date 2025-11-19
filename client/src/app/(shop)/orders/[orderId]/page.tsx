'use client';
import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { apiClient } from '../../../../api/auth/apiClient'; 
import toast from 'react-hot-toast';
import Link from 'next/link';
import { ChevronRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
// [!!! 修正 1 !!!] 改用 QRCodeSVG
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
    
    return orderData.items
      .filter(item => item.item_type === 'ticket_types' && item.ticket) 
      .map(item => item.ticket!); 
  }, [orderData]);

  if (isLoading) {
    return <div>載入訂單中...</div>;
  }
  if (!orderData) {
    return <div>找不到訂單。</div>;
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
    <div className="w-full p-6 max-w-5xl mx-auto">
      
      <nav className="flex items-center text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-orange-600">首頁</Link>
        <ChevronRightIcon className="w-4 h-4 mx-1" />
        <Link href="/member/orders" className="hover:text-orange-600">我的訂單</Link>
        <ChevronRightIcon className="w-4 h-4 mx-1" />
        <span className="font-medium text-gray-700">訂單 #{orderData.order_number}</span>
      </nav>
      
      <div className="flex items-center gap-2 text-green-600 mb-6">
        <CheckCircleIcon className="w-10 h-10" />
        <h1 className="text-3xl font-bold text-gray-900">
        感謝您的購買，這是您的電子票券。
        </h1>
      </div>

      <div className="space-y-6">
        {allTickets.length === 0 ? (
          <p>此訂單沒有電子票券。</p>
        ) : (
          allTickets.map((ticket, index) => (
            <div 
              key={ticket.id} 
              className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-orange-500 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {/* (A) 左側：QR Code */}
              <div className="col-span-1 flex items-center justify-center">
                <div className="p-4 bg-white border-2 border-gray-200 rounded-lg">
                  
                  {/* [!!! 修正 2 !!!] 改用 QRCodeSVG */}
                  <QRCodeSVG
                    value={ticket.qr_code_data} 
                    size={160} 
                    level="H" 
                  />

                </div>
              </div>
              
              {/* (B) 右側：票券資訊 */}
              <div className="col-span-2 space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {orderData.event.title}
                </h2>
                <p className="text-gray-600">
                  <strong>地點:</strong> {orderData.event.location_name}
                </p>
                <p className="text-gray-600">
                  <strong>時間:</strong> {formatDateTime(orderData.event.start_time)}
                </p>
                
                <div className="border-t my-3"></div>
                
                <p className="text-gray-800">
                  <strong>票券持有:</strong> {ticket.name} (票券 {index + 1} / {allTickets.length})
                </p>
                <p className="text-gray-800">
                  <strong>Email:</strong> {ticket.email}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>票券 ID:</strong> {ticket.qr_code_data}
                </p>
                
                {ticket.status === 'valid' ? (
                  <span className="inline-block bg-green-100 text-green-700 font-medium px-3 py-1 rounded-full text-sm">
                    狀態：有效
                  </span>
                ) : (
                  <span className="inline-block bg-gray-100 text-gray-600 font-medium px-3 py-1 rounded-full text-sm">
                    {/* [修正] 這裡加入判斷：如果是 'used' 就顯示 '已使用'，否則顯示原始狀態 */}
                    狀態：{ticket.status === 'used' ? '已使用' : ticket.status}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}