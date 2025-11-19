'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../../../context/auth/UserContext'; 
import toast from 'react-hot-toast';
import Link from 'next/link';
import { ArrowRightIcon, ChevronRightIcon, PlusIcon, MinusIcon, TrashIcon } from '@heroicons/react/24/outline';
import EventMall from '../../../../components/EventMall';
import { type ProductData, type ProductVariantData } from '../../../../components/card/ProductCard';

interface TicketTypeData {
  id: string;
  name: string;
  price: number;
}

interface CheckoutData {
  eventId: number;
  eventTitle: string;
  selectedTicket: TicketTypeData;
  availableProducts: ProductData[]; 
}

// [修正 1] 補上 attendees 定義，讓下一頁讀得到
interface OrderConfirmationData {
  eventId: number;
  eventTitle: string;
  selectedTicket: TicketTypeData;
  availableProducts: ProductData[];
  billing: { 
    name: string;
    phone: string;
    email: string;
  };
  // [新增] 必須傳遞持票人資料給下一頁
  attendees: {
    name: string;
    email: string;
    phone: string;
    gender?: string;
  }[];
  selectedAddons: {
    productId: number;
    productVariantId: number;
    productName: string;
    variantName: string;
    quantity: number;
    unitPrice: number;
    imageUrl: string | null;
  }[];
}

export default function CheckoutInfoPage() {
  const router = useRouter();
  const { user } = useUser(); 
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [billingName, setBillingName] = useState('');
  const [billingPhone, setBillingPhone] = useState('');
  const [billingEmail, setBillingEmail] = useState('');
  const [addons, setAddons] = useState<Map<number, number>>(new Map()); 

  useEffect(() => {
    const dataString = localStorage.getItem('checkoutData');
    if (!dataString) {
      toast.error('發生錯誤：找不到結帳資料，請重新報名。');
      router.push('/'); 
      return;
    }
    try {
      const data: CheckoutData = JSON.parse(dataString);
      setCheckoutData(data);
    } catch (e) {
      console.error(e);
      toast.error('資料讀取失敗');
    } finally {
      setIsLoading(false);
    }
  }, [router]); 

  useEffect(() => {
    if (user) {
      setBillingName(user.name || '');
      setBillingEmail(user.email || '');
    }
  }, [user]); 

  const handleAddToCart = (productVariantId: number, quantity: number) => {
    setAddons(prevAddons => {
      const newAddons = new Map(prevAddons);
      newAddons.set(productVariantId, quantity); 
      return newAddons;
    });
    toast.success("已加入加購！");
  };
  
  const handleRemoveAddon = (productVariantId: number) => {
    setAddons(prevAddons => {
      const newAddons = new Map(prevAddons);
      newAddons.delete(productVariantId); 
      return newAddons;
    });
    toast.error("已移除加購商品");
  };

  const findVariant = useCallback((variantId: number) => {
    if (!checkoutData) return null;
    for (const product of checkoutData.availableProducts) {
      const variant = product.variants.find(v => v.id === variantId);
      if (variant) {
        return { product, variant };
      }
    }
    return null;
  }, [checkoutData]);

  const incrementAddon = (variantId: number) => {
    const currentQuantity = addons.get(variantId) || 0;
    const item = findVariant(variantId);

    if (item && item.variant.stock_quantity <= currentQuantity) {
      toast.error(`庫存不足！此規格僅剩 ${item.variant.stock_quantity} 件。`);
      return;
    }
    setAddons(prevAddons => {
      const newAddons = new Map(prevAddons);
      newAddons.set(variantId, currentQuantity + 1);
      return newAddons;
    });
  };

  const decrementAddon = (variantId: number) => {
    const currentQuantity = addons.get(variantId) || 0;
    if (currentQuantity > 1) {
      setAddons(prevAddons => {
        const newAddons = new Map(prevAddons);
        newAddons.set(variantId, currentQuantity - 1);
        return newAddons;
      });
    } 
  };
  
  const handleSubmit = () => {
    if (!billingName || !billingPhone || !billingEmail) {
      toast.error("請填寫完整的報名資料！");
      return;
    }
    
    const selectedAddons: OrderConfirmationData['selectedAddons'] = [];
    for (const [variantId, quantity] of addons.entries()) {
      const item = findVariant(variantId); 
      if (!item) continue;
      
      const variantName = item.variant.option1_value === "Default" ? "" : (item.variant.option1_value || '') + ' ' + (item.variant.option2_value || '');
      
      selectedAddons.push({
        productId: item.product.id,
        productVariantId: item.variant.id,
        productName: item.product.name,
        variantName: variantName.trim(),
        quantity: quantity,
        unitPrice: item.product.base_price + item.variant.price_offset,
        imageUrl: item.product.image_url,
      });
    }

    // [修正 2] 建立 updatedCheckoutData 時，務必包含 attendees
    // 因為這裡我們是一張票對應一個報名者，所以直接把報名資料當作持票人資料
    const updatedCheckoutData: OrderConfirmationData = {
      eventId: checkoutData!.eventId,
      eventTitle: checkoutData!.eventTitle,
      selectedTicket: checkoutData!.selectedTicket,
      availableProducts: checkoutData!.availableProducts, 

      billing: { 
        name: billingName,
        phone: billingPhone,
        email: billingEmail,
      },
      
      // [關鍵] 這裡就是之前缺少的拼圖！
      attendees: [
        {
          name: billingName,
          email: billingEmail,
          phone: billingPhone,
          // gender: "other" // 如果需要可加上
        }
      ],

      selectedAddons: selectedAddons, 
    };
    
    // 存到 localStorage，這時候資料才是完整的
    localStorage.setItem('checkoutData', JSON.stringify(updatedCheckoutData));
    
    router.push('/checkout/confirm');
  };

  const summary = useMemo(() => {
    if (!checkoutData) {
      return { ticketPrice: 0, addonsPrice: 0, totalPrice: 0 };
    }
    
    const ticketPrice = checkoutData.selectedTicket?.price || 0;
    
    let addonsPrice = 0;
    for (const [variantId, quantity] of addons.entries()) {
      const item = findVariant(variantId); 
      if (item) {
        addonsPrice += (item.product.base_price + item.variant.price_offset) * quantity;
      }
    }
    
    return {
      ticketPrice,
      addonsPrice,
      totalPrice: ticketPrice + addonsPrice,
    };
  }, [checkoutData, addons, findVariant]); 


  if (isLoading || !checkoutData) {
    return <div>載入中...</div>; 
  }

  return (
    <div className="w-full">
      <nav className="flex items-center text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-orange-600">首頁</Link>
        <ChevronRightIcon className="w-4 h-4 mx-1" />
        <Link href={`/`} className="hover:text-orange-600 truncate max-w-[200px]">
          {checkoutData.eventTitle}
        </Link>
        <ChevronRightIcon className="w-4 h-4 mx-1" />
        <Link href={`/checkout/select-ticket?eventId=${checkoutData.eventId}`} className="hover:text-orange-600">
          選擇票種
        </Link>
        <ChevronRightIcon className="w-4 h-4 mx-1" />
        <span className="font-medium text-gray-700">填寫資料</span>
      </nav>
      
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. 填寫報名資料</h2>
            <div className="space-y-4 bg-white p-6 rounded-lg shadow-md border">
              <div>
                <label className="block text-sm font-medium text-gray-700">姓名</label>
                <input 
                  type="text" 
                  value={billingName}
                  onChange={(e) => setBillingName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input 
                  type="email" 
                  value={billingEmail}
                  onChange={(e) => setBillingEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">電話</label>
                <input 
                  type="tel" 
                  value={billingPhone}
                  onChange={(e) => setBillingPhone(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2" 
                />
              </div>
            </div>
          </section>

          <section>
            <EventMall 
              products={checkoutData.availableProducts}
              onAddToCart={handleAddToCart}
            />
          </section>
        </div>

       <aside className="col-span-1">
          <div className="sticky top-24 bg-white p-6 rounded-lg shadow-md border">
            <h3 className="text-xl font-semibold border-b pb-3 mb-4">訂單摘要</h3>
            
            <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-100">
              <span className="text-gray-700">{checkoutData.selectedTicket.name} (x1)</span>
              <span className="font-medium">NT$ {summary.ticketPrice}</span>
            </div>

            {Array.from(addons.entries()).map(([variantId, quantity]) => {
              const item = findVariant(variantId); 
              if (!item) return null;
              
              const variantName = item.variant.option1_value === "Default" ? "" : ` (${item.variant.option1_value})`;
              const name = item.product.name + variantName;
              const price = (item.product.base_price + item.variant.price_offset) * quantity;
              
              return (
                <div key={variantId} className="flex justify-between items-center mb-2 text-sm py-2 border-b border-gray-100">
                  <div className="flex-grow pr-2">
                    <span className="text-gray-600 font-semibold">{name}</span>
                    <br />
                    <span className="font-medium">NT$ {price}</span>
                  </div>
                  
                  <div className="flex-shrink-0 flex items-center border border-gray-300 rounded-md">
                    <button 
                      onClick={() => (quantity === 1 ? handleRemoveAddon(variantId) : decrementAddon(variantId))}
                      className={`px-2 py-1 transition-colors ${quantity === 1 ? 'text-red-500 hover:bg-red-50' : 'text-orange-600 hover:bg-orange-50'}`}
                      title={quantity === 1 ? "移除商品" : "減少數量"}
                    >
                      {quantity === 1 ? (
                        <TrashIcon className="w-4 h-4" />
                      ) : (
                        <MinusIcon className="w-4 h-4" />
                      )}
                    </button>
                    <span className="px-3 py-1 border-x border-gray-300 text-sm font-medium">
                      {quantity}
                    </span>
                    <button 
                      onClick={() => incrementAddon(variantId)} 
                      className="px-2 py-1 text-orange-600 hover:bg-orange-50 transition-colors"
                      title="增加數量"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
            
            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-700">總金額:</span>
                <span className="text-2xl font-bold text-gray-900">
                  NT$ {summary.totalPrice}
                </span>
              </div>
              
              <button 
                onClick={handleSubmit}
                disabled={isLoading}
                className="mt-6 w-full flex items-center justify-center gap-2 bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-orange-600 transition-colors disabled:bg-gray-300"
              >
                <span>下一步：確認訂單</span>
                <ArrowRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}