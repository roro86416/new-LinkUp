// new-LinkUp/client/src/app/(shop)/checkout/information/page.tsx
'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../../../context/auth/UserContext';
import { apiClient } from '../../../../api/auth/apiClient'; // 1. 引入 API 客戶端
import toast from 'react-hot-toast';
import { ArrowRightIcon, PlusIcon, MinusIcon, UserIcon, ShoppingBagIcon, IdentificationIcon, TicketIcon } from '@heroicons/react/24/outline';
import { type ProductData } from '../../../../components/card/ProductCard';

import { CheckoutStepper } from '../../../../components/shop/CheckoutSteps';

// --- 介面定義 ---
interface TicketTypeData { id: string; name: string; price: number; }
interface CheckoutData { eventId: number; eventTitle: string; selectedTicket: TicketTypeData; availableProducts: ProductData[]; }
// 後端回傳的格式
interface OrderApiResponse { 
  status: "success"; 
  message: string; 
  data: { 
    orderId: number; 
    // 如果有其他欄位也可加，目前只需要 orderId
  }; 
}

export default function CheckoutInfoPage() {
  const router = useRouter();
  const { user } = useUser(); 
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // 2. 新增提交狀態

  const [billingName, setBillingName] = useState('');
  const [billingPhone, setBillingPhone] = useState('');
  const [billingEmail, setBillingEmail] = useState('');
  
  const [addons, setAddons] = useState<Map<number, number>>(new Map()); 

  useEffect(() => {
    const dataString = localStorage.getItem('checkoutData');
    if (!dataString) { toast.error('找不到結帳資料'); router.push('/'); return; }
    try { setCheckoutData(JSON.parse(dataString)); } catch { toast.error('資料錯誤'); } 
    finally { setIsLoading(false); }
  }, [router]); 

  const handleFillMemberData = () => {
    if (user) {
      setBillingName(user.name || '');
      setBillingEmail(user.email || '');
      toast.success('已帶入會員資料');
    } else {
      toast.error('請先登入會員');
    }
  };

  const updateAddon = (variantId: number, delta: number, stock: number) => {
    setAddons(prev => {
        const next = new Map(prev);
        const current = next.get(variantId) || 0;
        const newVal = current + delta;
        if (newVal <= 0) next.delete(variantId);
        else if (newVal > stock) { toast.error("庫存不足"); return prev; }
        else next.set(variantId, newVal);
        return next;
    });
  };

  const findVariant = useCallback((variantId: number) => {
    if (!checkoutData) return null;
    for (const product of checkoutData.availableProducts) {
      const variant = product.variants.find(v => v.id === variantId);
      if (variant) return { product, variant };
    }
    return null;
  }, [checkoutData]);

  // 計算摘要與總金額 (這部分不僅用於顯示，也會用於 API 驗證)
  const summary = useMemo(() => {
    if (!checkoutData) return { t: 0, a: 0, total: 0 };
    const t = checkoutData.selectedTicket.price;
    let a = 0;
    addons.forEach((qty, vid) => {
        const item = findVariant(vid);
        if(item) a += (item.product.base_price + item.variant.price_offset) * qty;
    });
    return { t, a, total: t + a };
  }, [checkoutData, addons, findVariant]);

  // 3. 核心修改：建立訂單並跳轉
  const handleSubmit = async () => {
    if (!billingName || !billingPhone || !billingEmail) { toast.error("請填寫完整資料"); return; }
    if (!checkoutData) return;

    setIsSubmitting(true);

    try {
      // 準備後端需要的 items 陣列
      const itemsPayload = [
        // 1. 票券
        { 
            item_type: "ticket_types", 
            ticket_type_id: checkoutData.selectedTicket.id, 
            quantity: 1, 
            // 雖然 API Service 會重算價格，但傳送 unit_price 是好習慣 (如果有需要比對)
            unit_price: checkoutData.selectedTicket.price 
        }
      ];

      // 2. 加購商品
      for (const [vid, qty] of addons.entries()) {
          const item = findVariant(vid);
          if (item) {
              itemsPayload.push({
                  item_type: "products",
                  product_variant_id: vid,
                  quantity: qty,
                  unit_price: item.product.base_price + item.variant.price_offset
              });
          }
      }

      const payload = {
        billing_name: billingName,
        billing_phone: billingPhone,
        billing_email: billingEmail,
        billing_address: "N/A", // 虛擬商品暫無地址
        payment_method: "ECPay",
        delivery_method: "shipping",
        total_amount: summary.total, // 傳送前端計算總額供後端比對
        items: itemsPayload,
        attendees: [{ name: billingName, email: billingEmail, phone: billingPhone }] // 目前假設參加者同訂購者
      };

      // 呼叫後端建立訂單
      const res = await apiClient.post<OrderApiResponse>('/api/v1/orders', payload);
      const { orderId } = res.data;

      // 訂單建立成功！清除購物車暫存 (因為訂單已成立，不需要暫存了)
      localStorage.removeItem('checkoutData');
      
      // 跳轉到 Review 頁面，帶上 orderId
      router.push(`/checkout/review?orderId=${orderId}`);

    } catch (error: any) {
      console.error("建立訂單失敗:", error);
      toast.error(error.message || "建立訂單失敗，請稍後再試");
    } finally {
      setIsSubmitting(false);
    }
  };


  if (isLoading || !checkoutData) return <div>Loading...</div>;

  return (
    <div className="w-full max-w-7xl mx-auto">
      <CheckoutStepper step={2} />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 左欄 */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* 表單區 */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <UserIcon className="w-6 h-6 text-[#EF9D11]" /> 填寫報名資料
                </h2>
                
                {/* 帶入會員資料按鈕 */}
                <button 
                    onClick={handleFillMemberData}
                    className="text-sm flex items-center gap-1 text-[#EF9D11] hover:text-[#d88d0e] font-medium transition-colors bg-orange-50 px-3 py-1.5 rounded-lg hover:bg-orange-100"
                >
                    <IdentificationIcon className="w-4 h-4" />
                    帶入會員資料
                </button>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">真實姓名</label>
                <input 
                    type="text" 
                    value={billingName} 
                    onChange={e=>setBillingName(e.target.value)} 
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#EF9D11] focus:ring-[#EF9D11] p-3 bg-gray-50 placeholder-gray-400" 
                    placeholder="請輸入您的真實姓名" 
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                        type="email" 
                        value={billingEmail} 
                        onChange={e=>setBillingEmail(e.target.value)} 
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#EF9D11] focus:ring-[#EF9D11] p-3 bg-gray-50 placeholder-gray-400" 
                        placeholder="ticket@example.com" 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">手機號碼</label>
                    <input 
                        type="tel" 
                        value={billingPhone} 
                        onChange={e=>setBillingPhone(e.target.value)} 
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#EF9D11] focus:ring-[#EF9D11] p-3 bg-gray-50 placeholder-gray-400" 
                        placeholder="0912345678" 
                    />
                </div>
              </div>
            </div>
          </section>

          {/* 加購區 */}
          {checkoutData.availableProducts.length > 0 && (
              <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><ShoppingBagIcon className="w-6 h-6 text-[#EF9D11]" /> 加購周邊</h2>
                <div className="grid gap-6">
                    {checkoutData.availableProducts.map(product => (
                        <div key={product.id} className="flex flex-col sm:flex-row gap-6 p-4 rounded-xl border border-gray-100 hover:border-orange-200 transition-colors bg-gray-50/50">
                            <div className="w-full sm:w-32 h-32 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                                {product.image_url ? <img src={product.image_url} className="w-full h-full object-cover" alt={product.name}/> : <div className="w-full h-full flex items-center justify-center text-gray-400">無圖片</div>}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg text-gray-800">{product.name}</h3>
                                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>
                                <div className="space-y-2">
                                    {product.variants.map(v => {
                                        const qty = addons.get(v.id) || 0;
                                        const price = product.base_price + v.price_offset;
                                        const vName = v.option1_value === 'Default' ? '標準款' : [v.option1_value, v.option2_value].filter(Boolean).join('/');
                                        return (
                                            <div key={v.id} className="flex justify-between items-center bg-white p-2 rounded border border-gray-200">
                                                <div className="text-sm font-medium text-gray-700">
                                                    {vName}
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-[#EF9D11] font-bold text-sm">NT$ {price}</span>
                                                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-100">
                                                        <button onClick={() => updateAddon(v.id, -1, v.stock_quantity)} disabled={qty===0} className={`p-1 rounded-md transition-colors ${qty===0?'text-gray-300':'text-gray-500 hover:bg-white hover:shadow-sm'}`}><MinusIcon className="w-3 h-3"/></button>
                                                        <span className="text-sm font-bold w-4 text-center text-gray-700">{qty}</span>
                                                        <button onClick={() => updateAddon(v.id, 1, v.stock_quantity)} className="p-1 rounded-md text-[#EF9D11] hover:bg-white hover:shadow-sm"><PlusIcon className="w-3 h-3"/></button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
              </section>
          )}
        </div>

       {/* 右欄 (摘要) */}
       <aside className="lg:col-span-5">
          <div className="sticky top-28 bg-white p-6 rounded-2xl shadow-lg border border-gray-100 ring-1 ring-black/5">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6">訂單摘要</h3>
            
            <div className="space-y-6 mb-8">
                {/* 票券 */}
                <div className="bg-orange-50/60 p-4 rounded-xl border border-orange-100">
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-orange-200/50">
                        <TicketIcon className="w-4 h-4 text-orange-500" />
                        <h4 className="text-xs font-bold text-orange-600 uppercase tracking-wider">活動票券</h4>
                    </div>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-bold text-gray-900 text-lg">{checkoutData.selectedTicket.name}</p>
                            <p className="text-xs text-gray-500 mt-1">x 1 張</p>
                        </div>
                        <span className="font-bold text-gray-900 text-lg">NT$ {summary.t}</span>
                    </div>
                </div>

                {/* 加購商品 */}
                {addons.size > 0 && (
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
                            <ShoppingBagIcon className="w-4 h-4 text-gray-500" />
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">加購商品</h4>
                        </div>
                        <div className="space-y-4">
                            {Array.from(addons.entries()).map(([vid, qty]) => {
                                const item = findVariant(vid); if(!item) return null;
                                const vName = item.variant.option1_value==='Default'?'':`(${item.variant.option1_value})`;
                                return (
                                    <div key={vid} className="flex justify-between items-start">
                                        <div className="flex-1 pr-4">
                                            <p className="text-sm font-medium text-gray-800 leading-relaxed">
                                                {item.product.name} {vName}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5">數量: {qty}</p>
                                        </div>
                                        <span className="font-medium text-gray-900 whitespace-nowrap">
                                            NT$ {(item.product.base_price+item.variant.price_offset)*qty}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
            
            {/* 總結區 */}
            <div className="border-t border-dashed border-gray-200 pt-6">
              <div className="flex justify-between items-end">
                <span className="text-gray-600 font-medium">總金額</span>
                <div className="text-right">
                    <span className="block text-3xl font-bold text-[#EF9D11]">NT$ {summary.total}</span>
                    <span className="text-xs text-gray-400">包含所有費用</span>
                </div>
              </div>
              
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="mt-8 w-full flex items-center justify-center gap-2 bg-[#EF9D11] text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-[#d88d0e] transition-all shadow-lg shadow-orange-500/30 disabled:bg-gray-300 disabled:shadow-none transform active:scale-[0.98]"
              >
                <span>
                    {isSubmitting ? '建立訂單中...' : '下一步：確認訂單'}
                </span>
                <ArrowRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}