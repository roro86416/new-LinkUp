'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { apiClient } from '../../../../api/auth/apiClient'; 
import { useUser } from '../../../../context/auth/UserContext'; 
import toast from 'react-hot-toast';
import { ArrowRightIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link'; 

// --- 1. 類型定義 (已根據 Gemi-441/Gemi-437 的 API 完整補完) ---

// (A) 主辦方
interface OrganizerInfo {
  name: string;
  avatar: string | null;
}

// (B) 票種
interface TicketTypeData {
  id: string;
  name: string;
  price: number;
  total_quantity: number;
  sale_end_time: string;
}

// (C) 商品規格 (ProductVariant)
interface ProductVariantData {
  id: number;
  option1_value: string | null;
  option2_value: string | null;
  price_offset: number;
  stock_quantity: number;
}

// (D) 商品 (Product)
interface ProductData {
  id: number;
  name: string;
  description: string | null;
  base_price: number;
  image_url: string | null;
  variants: ProductVariantData[]; // [!] 包含規格陣列
}

// (E) API 回傳的 "data" 物件
interface EventDetailsData {
  id: number;
  title: string;
  cover_image: string;
  start_time: string;
  organizer: OrganizerInfo;
  ticketTypes: TicketTypeData[]; 
  products: ProductData[];      // [!!!] 關鍵修正：不再是 any[]
}

// (F) 完整的 API 回應
interface ApiResponse {
  status: "success";
  data: EventDetailsData;
}

// --- 結帳頁面元件 (第 1 站：選票) ---
export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: userLoading } = useUser();

  const [eventDetails, setEventDetails] = useState<EventDetailsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  
  // (useEffect (獲取 API) 保持不變)
  useEffect(() => {
    const eventId = searchParams.get('eventId');
    if (!eventId) {
      toast.error('錯誤：缺少活動 ID。');
      router.push('/'); 
      return;
    }
    const fetchEventDetails = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get<ApiResponse>(`/api/v1/events/${eventId}`);
        setEventDetails(response.data);
      } catch (error) {
        console.error("獲取活動詳細資料失敗:", error);
        toast.error('獲取活動資料失敗');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEventDetails();
  }, [searchParams, router]);

  // (handleSubmit 函式 - 保持 Gemi-477 的修正)
  const handleSubmit = () => {
    if (!selectedTicketId) {
      toast.error("請至少選擇一張票券！");
      return;
    }
    
    const selectedTicket = eventDetails?.ticketTypes.find(t => t.id === selectedTicketId);
    
    const checkoutData = {
      eventId: eventDetails?.id,
      eventTitle: eventDetails?.title,
      selectedTicket: selectedTicket,
      availableProducts: eventDetails?.products || [], // [!] 這裡會傳遞 "完整" 的 ProductData[]
    };
    
    localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
    
    // [!] 導向到我們在 Gemi-475 建立的新路徑
    router.push('/checkout/information'); 
  };

  // --- 渲染 (Render) ---
  if (isLoading || userLoading) {
    return <div>載入中...</div>;
  }
  if (!eventDetails) {
    return <div>找不到活動...</div>;
  }

  return (
    <div className="w-full">
      
      {/* 麵包屑 (保持 Gemi-477 的修正) */}
      <nav className="flex items-center text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-orange-600">首頁</Link>
        <ChevronRightIcon className="w-4 h-4 mx-1" />
        {/* (未來這裡是 /events/[id]) */}
        <Link href={`/`} className="hover:text-orange-600 truncate max-w-[200px]">
          {eventDetails.title}
        </Link>
        <ChevronRightIcon className="w-4 h-4 mx-1" />
        <span className="font-medium text-gray-700">開始報名</span>
      </nav>

      {/* (單欄佈局 保持不變) */}
      <div className="w-full max-w-2xl mx-auto">
        
        {/* --- 1. 選擇票種 --- (保持不變) */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. 選擇票種</h2>
          <div className="space-y-3">
            {eventDetails.ticketTypes.length === 0 ? (
              <p className="text-gray-500">此活動目前沒有可販售的票券。</p>
            ) : (
              eventDetails.ticketTypes.map(ticket => (
                <div 
                  key={ticket.id}
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className={`flex justify-between items-center p-4 border rounded-lg cursor-pointer transition-all
                    ${selectedTicketId === ticket.id 
                      ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200' 
                      : 'border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  <div>
                    <h3 className="font-bold text-lg">{ticket.name}</h3>
                    <p className="text-sm text-gray-500">售票至 {new Date(ticket.sale_end_time).toLocaleDateString()}</p>
                  </div>
                  <span className="text-xl font-bold">NT$ {ticket.price}</span>
                </div>
              ))
            )}
          </div>
        </section>

        {/* (下一步按鈕 保持不變) */}
        <div className="mt-8 border-t pt-6 flex justify-end">
          <button 
            onClick={handleSubmit}
            disabled={!selectedTicketId || isLoading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-orange-600 transition-colors disabled:bg-gray-300"
          >
            <span>下一步</span>
            <ArrowRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}