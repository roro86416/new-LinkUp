// new-LinkUp/client/src/app/(shop)/checkout/select-ticket/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { apiClient } from '../../../../api/auth/apiClient'; 
import { useUser } from '../../../../context/auth/UserContext'; 
import toast from 'react-hot-toast';
import { ArrowRightIcon, TicketIcon, CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline';

// [新增] 引入共用的 Stepper 元件
import { CheckoutStepper } from '../../../../components/shop/CheckoutSteps';

// --- 類型定義 (保持不變) ---
interface OrganizerInfo { name: string; avatar: string | null; }
interface TicketTypeData { id: string; name: string; price: number; total_quantity: number; sale_end_time: string; }
interface ProductVariantData { id: number; option1_value: string | null; option2_value: string | null; price_offset: number; stock_quantity: number; }
interface ProductData { id: number; name: string; description: string | null; base_price: number; image_url: string | null; variants: ProductVariantData[]; }
interface EventDetailsData { id: number; title: string; cover_image: string; start_time: string; location_name: string; organizer: OrganizerInfo; ticketTypes: TicketTypeData[]; products: ProductData[]; }
interface ApiResponse { status: "success"; data: EventDetailsData; }

// [移除] 舊的 CheckoutStepper 本地定義 (因為已經 import 了)

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: userLoading } = useUser();

  const [eventDetails, setEventDetails] = useState<EventDetailsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  
  useEffect(() => {
    const eventId = searchParams.get('eventId');
    if (!eventId) { toast.error('錯誤：缺少活動 ID。'); router.push('/'); return; }
    const fetchEventDetails = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get<ApiResponse>(`/api/v1/events/${eventId}`);
        setEventDetails(response.data);
      } catch (error) { console.error("獲取活動詳細資料失敗:", error); toast.error('獲取活動資料失敗'); } 
      finally { setIsLoading(false); }
    };
    fetchEventDetails();
  }, [searchParams, router]);

  const handleSubmit = () => {
    if (!selectedTicketId) { toast.error("請至少選擇一張票券！"); return; }
    const selectedTicket = eventDetails?.ticketTypes.find(t => t.id === selectedTicketId);
    const checkoutData = {
      eventId: eventDetails?.id,
      eventTitle: eventDetails?.title,
      selectedTicket: selectedTicket,
      availableProducts: eventDetails?.products || [],
    };
    localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
    router.push('/checkout/information'); 
  };

  if (isLoading || userLoading) return <div className="min-h-screen flex items-center justify-center text-gray-500">載入中...</div>;
  if (!eventDetails) return <div className="min-h-screen flex items-center justify-center text-gray-500">找不到活動...</div>;

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* 使用共用元件，傳入 step={1} */}
      <CheckoutStepper step={1} />

      <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 mb-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
        <div className="w-full sm:w-32 h-32 rounded-xl overflow-hidden flex-shrink-0 relative shadow-md">
           <img src={eventDetails.cover_image} alt={eventDetails.title} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 text-center sm:text-left">
           <h1 className="text-2xl font-bold text-gray-900 mb-2">{eventDetails.title}</h1>
           <div className="flex flex-col sm:flex-row gap-3 text-sm text-gray-500 justify-center sm:justify-start">
              <div className="flex items-center gap-1"><CalendarIcon className="w-4 h-4" /> {new Date(eventDetails.start_time).toLocaleDateString()}</div>
              {eventDetails.location_name && (
                <div className="flex items-center gap-1"><MapPinIcon className="w-4 h-4" /> {eventDetails.location_name}</div>
              )}
           </div>
           <div className="mt-4 flex items-center justify-center sm:justify-start gap-2">
              <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden">
                 {eventDetails.organizer.avatar ? <img src={eventDetails.organizer.avatar} className="w-full h-full object-cover"/> : null}
              </div>
              <span className="text-sm font-medium text-gray-700">{eventDetails.organizer.name}</span>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <TicketIcon className="w-6 h-6 text-[#EF9D11]" /> 選擇票種
        </h2>
        
        <div className="space-y-4">
          {eventDetails.ticketTypes.length === 0 ? (
            <p className="text-gray-500 text-center py-8">此活動目前沒有可販售的票券。</p>
          ) : (
            eventDetails.ticketTypes.map(ticket => (
              <div 
                key={ticket.id}
                onClick={() => setSelectedTicketId(ticket.id)}
                className={`group relative flex justify-between items-center p-5 rounded-xl cursor-pointer transition-all duration-200
                  ${selectedTicketId === ticket.id 
                    ? 'bg-orange-50 border-2 border-[#EF9D11] shadow-md' 
                    : 'bg-white border border-gray-200 hover:border-orange-300 hover:shadow-md'
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                      ${selectedTicketId === ticket.id ? 'border-[#EF9D11] bg-[#EF9D11]' : 'border-gray-300 group-hover:border-orange-300'}`}>
                      {selectedTicketId === ticket.id && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg ${selectedTicketId === ticket.id ? 'text-[#EF9D11]' : 'text-gray-800'}`}>
                        {ticket.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">售票截止：{new Date(ticket.sale_end_time).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`text-xl font-bold ${selectedTicketId === ticket.id ? 'text-[#EF9D11]' : 'text-gray-900'}`}>
                    NT$ {ticket.price}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="mt-10 flex justify-end">
          <button 
            onClick={handleSubmit}
            disabled={!selectedTicketId || isLoading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#EF9D11] text-white px-10 py-3.5 rounded-full font-bold text-lg hover:bg-[#d88d0e] transition-all shadow-lg shadow-orange-500/30 disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed transform active:scale-95"
          >
            <span>下一步：填寫資料</span>
            <ArrowRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}