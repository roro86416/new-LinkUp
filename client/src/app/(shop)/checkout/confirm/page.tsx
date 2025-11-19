'use client';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '../../../../api/auth/apiClient'; 
import toast from 'react-hot-toast';
import { ChevronRightIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { redirectToECPay } from '../../../../utils/ecpay';

// --- 1. 定義資料介面 ---
interface TicketTypeData {
  id: string;
  name: string;
  price: number;
}
interface BillingData {
  name: string;
  phone: string;
  email: string;
}
interface AttendeeData {
  name: string;
  email: string;
  phone: string;
  gender?: string;
}
interface SelectedAddon {
  productVariantId: number;
  productName: string;
  variantName: string;
  quantity: number;
  unitPrice: number;
}
interface ConfirmationData {
  eventId: number;
  eventTitle: string;
  selectedTicket: TicketTypeData;
  billing: BillingData;
  attendees: AttendeeData[];
  selectedAddons: SelectedAddon[];
}

// 定義 API 回傳的正確結構 (對應後端 controller)
interface OrderApiResponse {
  status: string;
  message: string;
  data: {
    orderId: number;
    ecpay: {
      apiUrl: string;
      formData: Record<string, string | number>;
    };
  };
}

export default function CheckoutConfirmPage() {
  const router = useRouter();
  const [confirmationData, setConfirmationData] = useState<ConfirmationData | null>(null);
  const [isLoading, setIsLoading] = useState(true); 
  const [isSubmitting, setIsSubmitting] = useState(false); 

  // --- 2. 修正 useEffect ---
  useEffect(() => {
    const dataString = localStorage.getItem('checkoutData');
    if (!dataString) {
      toast.error('發生錯誤：找不到結帳資料，請重新報名。');
      router.push('/'); 
      return;
    }
    try {
        const data: ConfirmationData = JSON.parse(dataString);
        setConfirmationData(data);
    } catch (e) {
        console.error(e);
        toast.error("資料格式錯誤");
    } finally {
        setIsLoading(false);
    }
  }, [router]); 

  // 計算總金額
  const totalPrice = useMemo(() => {
    if (!confirmationData) return 0;
    const ticketPrice = confirmationData.selectedTicket.price; 
    const addonsPrice = confirmationData.selectedAddons.reduce(
      (total, addon) => total + (addon.unitPrice * addon.quantity), 0
    );
    return ticketPrice + addonsPrice;
  }, [confirmationData]);
  
  // --- 3. 確認付款 (修正邏輯) ---
  const handleConfirmPayment = async () => {
    if (!confirmationData) return;
    
    setIsSubmitting(true); 
    
   const payload = {
      billing_name: confirmationData.billing.name,
      billing_phone: confirmationData.billing.phone,
      billing_email: confirmationData.billing.email,
      billing_address: "N/A",
      payment_method: "ECPay",
      delivery_method: "shipping",
      total_amount: totalPrice,
      items: [
        {
            item_type: "ticket_types",
            ticket_type_id: confirmationData.selectedTicket.id,
            quantity: 1,
        },
        ...(confirmationData.selectedAddons || []).map(addon => ({
            item_type: "products",
            product_variant_id: addon.productVariantId,
            quantity: addon.quantity,
        }))
      ],
      // [!!! 關鍵修正 !!!]
      // 如果 localStorage 裡沒有 attendees，給予空陣列，避免送出 undefined
      attendees: confirmationData.attendees || [] 
    };

    try {
      console.log("正在送出訂單 payload:", payload); 
      const response = await apiClient.post<OrderApiResponse>('/api/v1/orders', payload);
      console.log("收到後端回應:", response); 

      const { ecpay, orderId } = response.data; 
      if (!ecpay) {
          throw new Error("後端回傳資料缺少 ECPay 參數");
      }

      toast.success("訂單建立成功！正在前往綠界付款...");
      localStorage.removeItem('checkoutData');
      localStorage.setItem('lastOrderId', orderId.toString());
      redirectToECPay(ecpay);
    } catch (error: unknown) { 
      console.error("建立訂單失敗:", error);
      
      let errorMessage = "建立訂單失敗";
      if (error instanceof Error) {
          errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      // [重要] 確保無論成功失敗，按鈕都會恢復狀態 (如果沒有跳轉的話)
      setIsSubmitting(false);
    }
    
  };

  if (isLoading || !confirmationData) return <div>載入中...</div>;

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">確認您的訂單</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-4 rounded shadow border">
                <h2 className="font-bold text-lg mb-2">活動與票券</h2>
                <p>活動：{confirmationData.eventTitle}</p>
                <p>票種：{confirmationData.selectedTicket.name} (NT$ {confirmationData.selectedTicket.price})</p>
            </div>
            
            <div className="bg-white p-4 rounded shadow border">
                <h2 className="font-bold text-lg mb-2">加購商品</h2>
                {confirmationData.selectedAddons.length === 0 ? <p className="text-gray-500">無加購商品</p> : (
                    <ul>
                        {confirmationData.selectedAddons.map((item, idx) => (
                            <li key={idx} className="flex justify-between">
                                <span>{item.productName} - {item.variantName} x {item.quantity}</span>
                                <span>NT$ {item.unitPrice * item.quantity}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>

        <div className="md:col-span-1">
            <div className="bg-white p-6 rounded shadow border sticky top-20">
                <div className="flex justify-between items-center mb-4 text-xl font-bold">
                    <span>總金額</span>
                    <span className="text-orange-600">NT$ {totalPrice}</span>
                </div>
                
                <button 
                  onClick={handleConfirmPayment}
                  disabled={isSubmitting}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 disabled:bg-gray-400 transition flex items-center justify-center gap-2"
                >
                    <CreditCardIcon className="w-5 h-5" />
                    {isSubmitting ? '處理中...' : '確認付款 (ECPay)'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}