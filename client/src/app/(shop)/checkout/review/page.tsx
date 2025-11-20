// new-LinkUp/client/src/app/(shop)/checkout/review/page.tsx
'use client';
import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiClient } from '../../../../api/auth/apiClient'; 
import toast from 'react-hot-toast';
import { CreditCardIcon, TicketIcon, UserIcon, ShoppingBagIcon, CalculatorIcon, ClockIcon, ArrowPathIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { redirectToECPay } from '../../../../utils/ecpay';
import { CheckoutStepper } from '../../../../components/shop/CheckoutSteps';

// 訂單資料介面
interface OrderItem {
  id: number;
  item_type: 'ticket_types' | 'products';
  item_name: string;
  variant_description?: string;
  quantity: number;
  unit_price: string | number;
}

interface OrderData {
  id: number;
  order_number: string;
  total_amount: string | number;
  subtotal: string | number;
  discount_amount: string | number;
  status: string;
  expires_at: string;
  billing_name: string;
  billing_phone: string;
  billing_email: string;
  items: OrderItem[];
  event?: {
    title: string;
  }; 
}

// --- 1. 倒數計時器 ---
const ExpiryTimer = ({ expiresAt }: { expiresAt: string }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const target = new Date(expiresAt).getTime();
    
    const updateTimer = () => {
        const now = new Date().getTime();
        const diff = Math.floor((target - now) / 1000);
        
        if (diff <= 0) {
            setTimeLeft(0);
            setIsExpired(true);
        } else {
            setTimeLeft(diff);
        }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border shadow-sm transition-all
        ${isExpired 
            ? 'bg-red-500/10 border-red-500/30 text-red-400' 
            : 'bg-[#EF9D11]/10 border-[#EF9D11]/30 text-[#EF9D11]'
        }`}>
        <ClockIcon className="w-5 h-5" />
        <div className="flex flex-col items-start leading-none">
            <span className="text-[10px] opacity-80 uppercase tracking-wider">
                {isExpired ? "已過期" : "剩餘時間"}
            </span>
            <span className="font-mono font-bold text-xl tracking-wider">
                {isExpired ? "00:00" : `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`}
            </span>
        </div>
    </div>
  );
};

// --- 2. 規格字串處理工具 ---
const formatVariant = (desc?: string) => {
    if (!desc) return null;
    return desc.replace(/null:\s*/gi, '').replace(/Default:\s*/gi, '').trim();
};

export default function ReviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  
  const [order, setOrder] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    if (!orderId) { 
        toast.error("缺少訂單編號"); 
        router.push('/'); 
        return; 
    }

    const fetchOrder = async () => {
        try {
            // 這裡回傳的是 JSON Body: { status: "success", data: { ... } }
            const res = await apiClient.get<any>(`/api/v1/orders/${orderId}`);
            // 所以我們要拿的是 res.data
            const orderData = res.data; 
            setOrder(orderData);
        } catch (e) { 
            console.error(e); 
            toast.error("無法讀取訂單資料"); 
            router.push('/');
        } finally { 
            setIsLoading(false); 
        }
    };
    fetchOrder();
  }, [orderId, router]);

  const { subtotalDisplay, taxDisplay, totalDisplay } = useMemo(() => {
    if (!order) return { subtotalDisplay: 0, taxDisplay: 0, totalDisplay: 0 };
    const t = Number(order.total_amount);
    const sales = Math.round(t / 1.05);
    const tax = t - sales;
    return { subtotalDisplay: sales, taxDisplay: tax, totalDisplay: t };
  }, [order]);

  // [修正後的付款函式]
  const handlePay = async () => {
    if (!orderId) return;
    setIsPaying(true);
    try {
       // 1. 呼叫後端
       console.log(`正在請求 ECPay 參數...`);
       // apiClient.post 回傳的就是 JSON Body: { status: "success", data: { orderId, ecpay: {...} } }
       const res = await apiClient.post<any>(`/api/v1/orders/${orderId}/repay`); 
       
       console.log("API 回應:", res); // 用於除錯

       // 2. 檢查資料結構
       // 因為 res 就是 body，所以 ecpay 在 res.data.ecpay
       if (!res || !res.data || !res.data.ecpay) {
           throw new Error("後端回傳資料缺少 ECPay 參數");
       }

       const { ecpay } = res.data;

       // 3. 記錄 ID 並跳轉
       localStorage.setItem('lastOrderId', orderId); 
       toast.success("正在前往綠界付款...");
       redirectToECPay(ecpay);

    } catch (e: any) { 
        console.error("付款失敗:", e); 
        toast.error(e.message || "付款跳轉失敗"); 
        setIsPaying(false); 
    }
  };

  if (isLoading || !order) {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-gray-500 gap-4">
            <ArrowPathIcon className="w-8 h-8 animate-spin text-[#EF9D11]" />
            <p>正在載入訂單資訊...</p>
        </div>
    );
  }

  const ticketItems = order.items.filter(i => i.item_type === 'ticket_types');
  const productItems = order.items.filter(i => i.item_type === 'products');
  const eventTitle = order.event?.title || "活動票券";

  return (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CheckoutStepper step={3} />

      <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
        
        {/* 頂部提示與倒數 */}
        <div className="bg-[#0C2838] text-white p-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
                <div className="bg-green-500/20 p-2 rounded-full">
                    <CheckCircleIcon className="w-8 h-8 text-green-400" />
                </div>
                <div>
                    <h1 className="text-xl font-bold">訂單已建立</h1>
                    <p className="text-gray-400 text-xs mt-0.5">訂單編號：<span className="font-mono text-white tracking-wider">#{order.order_number}</span></p>
                </div>
            </div>
            
            <ExpiryTimer expiresAt={order.expires_at} />
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-5 gap-10">
            
            {/* 左側：明細 (3/5) */}
            <div className="lg:col-span-3 space-y-8">
                
                {/* 票券區塊 */}
                {ticketItems.length > 0 && (
                    <div>
                        <h2 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2 border-b pb-2">
                            <TicketIcon className="w-4 h-4" /> 活動票券
                        </h2>
                        <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                            {ticketItems.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center p-4 border-b border-gray-100 last:border-0">
                                    <div>
                                        <p className="font-bold text-gray-900">{eventTitle}</p>
                                        <p className="text-sm text-gray-600 mt-0.5">{item.item_name} x {item.quantity}</p>
                                    </div>
                                    <span className="font-bold text-gray-900">NT$ {(Number(item.unit_price) * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 2. 加購商品區塊 (規格修正) */}
                {productItems.length > 0 && (
                    <div>
                        <h2 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2 border-b pb-2">
                            <ShoppingBagIcon className="w-4 h-4" /> 加購商品
                        </h2>
                        <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                            {productItems.map((item, idx) => {
                                const cleanVariant = formatVariant(item.variant_description);
                                return (
                                    <div key={idx} className="flex justify-between items-center p-4 border-b border-gray-100 last:border-0">
                                        <div>
                                            <p className="font-medium text-gray-800">{item.item_name}</p>
                                            {cleanVariant && (
                                                <p className="text-xs text-gray-500 mt-0.5">規格: {cleanVariant}</p>
                                            )}
                                            <p className="text-xs text-gray-500">數量: {item.quantity}</p>
                                        </div>
                                        <span className="font-medium text-gray-900">NT$ {(Number(item.unit_price) * item.quantity).toLocaleString()}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* 3. 訂購人資訊 */}
                <div>
                    <h2 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2 border-b pb-2">
                        <UserIcon className="w-4 h-4" /> 訂購人資訊
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <span className="block text-xs text-gray-400 mb-1">姓名</span>
                            <span className="font-medium text-gray-900">{order.billing_name}</span>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <span className="block text-xs text-gray-400 mb-1">電話</span>
                            <span className="font-medium text-gray-900">{order.billing_phone}</span>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 md:col-span-2">
                            <span className="block text-xs text-gray-400 mb-1">Email</span>
                            <span className="font-medium text-gray-900">{order.billing_email}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 右側：金額計算 */}
            <div className="lg:col-span-2 bg-slate-50 p-6 rounded-2xl border border-slate-200 h-fit sticky top-28 shadow-sm">
                <div className="flex items-center gap-2 mb-6 text-gray-800 border-b border-slate-200 pb-4">
                    <CalculatorIcon className="w-5 h-5" />
                    <span className="font-bold text-lg">金額詳情</span>
                </div>
                
                <div className="space-y-3 text-sm mb-8">
                    <div className="flex justify-between text-gray-600">
                        <span>銷售金額 (未稅)</span>
                        <span>NT$ {subtotalDisplay.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>營業稅 (5%)</span>
                        <span className="text-green-600">+ NT$ {taxDisplay.toLocaleString()}</span>
                    </div>
                    <div className="h-px bg-dashed bg-gray-300 my-3"></div>
                    
                    <div className="flex justify-between items-end">
                        <span className="font-bold text-gray-900 text-base">應付總額</span>
                        <span className="text-4xl font-black text-[#EF9D11]">
                            <span className="text-lg font-normal text-gray-400 mr-1">NT$</span>
                            {totalDisplay.toLocaleString()}
                        </span>
                    </div>
                </div>

                <button 
                    onClick={handlePay}
                    disabled={isPaying}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-600/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    <CreditCardIcon className="w-6 h-6" />
                    {isPaying ? '處理中...' : '前往綠界付款 (ECPay)'}
                </button>
                
                <p className="text-xs text-gray-400 text-center mt-4 leading-relaxed">
                    點擊付款後將導向第三方支付平台<br/>
                    請確保您的瀏覽器允許彈出視窗
                </p>
            </div>

        </div>
      </div>
    </div>
  );
}