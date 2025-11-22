// new-LinkUp/client/src/app/(shop)/orders/[orderId]/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '../../../../api/auth/apiClient';
import toast from 'react-hot-toast';
import { ChevronLeftIcon, CalendarIcon, MapPinIcon, TicketIcon, XMarkIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { QRCodeSVG } from 'qrcode.react';

// --- 介面定義 ---
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
  cover_image: string;
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

export default function OrderTicketPage() {
  const params = useParams();
  const router = useRouter();
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
        toast.error('無法讀取票券資料');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const tickets = useMemo(() => {
    if (!orderData) return [];
    return orderData.items
      .filter(item => item.item_type === 'ticket_types' && item.ticket)
      .map(item => ({ ...item.ticket!, itemName: item.item_name }));
  }, [orderData]);

  if (isLoading) {
    return <div className="min-h-screen flex justify-center items-center bg-[#0C2838] text-white">載入票券中...</div>;
  }

  if (!orderData) {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-[#0C2838] text-white gap-4">
            <p>找不到此訂單或無權限查看。</p>
            <button onClick={() => router.back()} className="text-[#EF9D11] hover:underline">返回上一頁</button>
        </div>
    );
  }

  const eventDate = new Date(orderData.event.start_time);

  return (
    // 使用 fixed inset-0 強制覆蓋原有 layout，並鎖定 scroll (overflow-hidden)
    <div className="fixed inset-0 z-[100] bg-[#0C2838] overflow-hidden flex flex-col">
      
      {/* 背景特效層 (來自首頁) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#1a202c_0%,#0C2838_100%)]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-40"></div>
       
      </div>

      {/* 頂部導航列 */}
      <div className="relative z-10 flex items-center justify-between px-6 py-5 backdrop-blur-md bg-black/20 border-b border-white/10">
        <button 
          onClick={() => router.push('/member?section=我的訂單')} 
          className="flex items-center gap-2 text-white/80 hover:text-[#EF9D11] transition group"
        >
            <div className="bg-white/10 p-2 rounded-full group-hover:bg-[#EF9D11] group-hover:text-white transition">
                <ChevronLeftIcon className="w-5 h-5" />
            </div>
            <span className="font-bold tracking-wide">返回訂單</span>
        </button>
        <div className="text-right">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">ORDER ID</p>
            <p className="text-sm font-mono text-[#EF9D11] font-bold">#{orderData.order_number}</p>
        </div>
      </div>

      {/* 主要內容區 (置中顯示票卡) */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-4 overflow-hidden">
        {/* 這裡用一個容器來置中票券，如果票券很多，可以讓這個容器內部 scroll */}
        <div className="w-full max-w-md h-full max-h-[80vh] overflow-y-auto custom-scrollbar pr-2 space-y-6">
            
            {/* 活動標題 */}
            <div className="text-center space-y-2 mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight drop-shadow-lg">{orderData.event.title}</h1>
                <div className="flex justify-center gap-4 text-sm text-gray-300/80">
                    <span className="flex items-center gap-1"><CalendarIcon className="w-4 h-4 text-[#EF9D11]" /> {eventDate.toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><MapPinIcon className="w-4 h-4 text-[#EF9D11]" /> {orderData.event.location_name}</span>
                </div>
            </div>

            {/* 票券列表 */}
            {tickets.length > 0 ? (
                tickets.map((ticket) => (
                    <div key={ticket.id} className="relative group animate-in slide-in-from-bottom-4 duration-700">
                        {/* 票券本體 (白色卡片) */}
                        <div className="bg-white rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(239,157,17,0.15)] transform transition-all hover:scale-[1.02] duration-300 relative">
                            
                            {/* 頂部裝飾條 */}
                            <div className="h-2 w-full bg-gradient-to-r from-[#EF9D11] to-orange-600"></div>

                            {/* 上半部：QR Code 區域 */}
                            <div className="bg-white p-8 flex flex-col items-center justify-center border-b-2 border-dashed border-gray-200 relative">
                                {/* 左右半圓缺口 (模擬撕票線) */}
                                <div className="absolute -left-4 bottom-[-16px] w-8 h-8 bg-[#0C2838] rounded-full z-10 shadow-inner"></div>
                                <div className="absolute -right-4 bottom-[-16px] w-8 h-8 bg-[#0C2838] rounded-full z-10 shadow-inner"></div>

                                <div className="border-4 border-gray-900 p-3 rounded-2xl mb-4 shadow-sm bg-white">
                                    <QRCodeSVG value={ticket.qr_code_data} size={180} level="H" />
                                </div>
                                <p className="text-gray-400 text-[10px] font-mono tracking-[0.2em] uppercase">Scan to Enter</p>
                                
                                {/* 票券狀態標籤 */}
                                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold border shadow-sm
                                    ${ticket.status === 'valid' 
                                        ? 'bg-green-50 text-green-600 border-green-200' 
                                        : 'bg-gray-100 text-gray-500 border-gray-200'}
                                `}>
                                    {ticket.status === 'valid' ? '可使用' : '已失效'}
                                </div>
                            </div>

                            {/* 下半部：詳細資訊 */}
                            <div className="bg-gray-50/80 p-6 pt-8 backdrop-blur-sm">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">TICKET TYPE</p>
                                        <p className="text-gray-900 font-extrabold text-lg">{ticket.itemName}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">HOLDER</p>
                                        <p className="text-gray-900 font-bold">{ticket.name}</p>
                                    </div>
                                </div>
                                

                                <div 
                                    onClick={() => {
                                        navigator.clipboard.writeText(ticket.qr_code_data);
                                        toast.success('已複製票券編號');
                                    }}
                                    className="bg-white border border-gray-200 rounded-xl p-3 flex items-center justify-between shadow-sm cursor-pointer hover:bg-gray-50 hover:border-[#EF9D11]/50 transition-colors group active:scale-95"
                                    title="點擊複製編號"
                                >
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <code className="text-xs text-gray-500 font-mono tracking-wider group-hover:text-[#EF9D11] transition-colors truncate">
                                            {ticket.qr_code_data}
                                        </code>
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-400 group-hover:text-[#EF9D11]">
                                        <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">複製</span>
                                        <DocumentDuplicateIcon className="w-5 h-5" />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-10 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                    <p className="text-gray-400">此訂單不包含電子票券 (可能僅購買周邊商品)</p>
                </div>
            )}

             {/* 底部 Logo */}
            <div className="text-center py-4 opacity-50">
                <img src="/logo/logoColor.png" alt="LinkUp" className="h-6 mx-auto invert brightness-0 opacity-50" />
            </div>
        </div>
      </div>
    </div>
  );
}