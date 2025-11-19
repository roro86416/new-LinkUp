"use client";
import { useState, useMemo, useEffect } from 'react';
import { type ProductData, type ProductVariantData } from '../card/ProductCard';
import { ShoppingCartIcon, XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface ProductModalProps {
  product: ProductData | null; 
  onClose: () => void; 
  onAddToCart: (productVariantId: number, quantity: number) => void; 
}

export default function ProductModal({ product, onClose, onAddToCart }: ProductModalProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  // 4. 當 "product" (prop) 改變時 (例如開啟一個新的 Modal)，重設 state
  useEffect(() => {
    if (product) {
      // 預設選取第一個規格
      const firstVariantId = product.variants?.[0]?.id.toString() || ""; // [!] 修正 #2
      
      // [!!!] 
      // [!!!] 1. 修正 "ESLint 警告"
      // [!!!] 
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedVariantId(firstVariantId);
      setQuantity(1); // 重設數量
    }
  }, [product]); // 依賴 product

  // 5. 輔助函式和 Memo
  const selectedVariant = useMemo(() => {
    // [!!!] 
    // [!!!] 2. 修正 "Runtime Crash"
    // [!!!] 我們必須先檢查 "product" 是否存在，"才" 能呼叫 .find()
    // [!!!] 
    if (!product) {
      return undefined;
    }
    // [!] 加上 "可選串連" (?. )
    return product.variants?.find(v => v.id === Number(selectedVariantId)); 
  }, [selectedVariantId, product]);

  const displayPrice = useMemo(() => {
    if (selectedVariant) {
      return (product?.base_price || 0) + selectedVariant.price_offset;
    }
    return product?.base_price || 0;
  }, [selectedVariant, product]);

  const getVariantName = (variant: ProductVariantData) => {
    if (variant.option1_value && variant.option2_value) {
      return `${variant.option1_value}, ${variant.option2_value}`;
    }
    return variant.option1_value || '預設規格';
  };

  // 6. "加入購物車" 按鈕的處理函式 (保持不變)
  const handleAddToCartClick = () => {
    if (!selectedVariant) {
      toast.error("請先選擇一個商品規格");
      return;
    }
    if (quantity <= 0) {
      toast.error("數量至少為 1");
      return;
    }
    if (quantity > selectedVariant.stock_quantity) {
      toast.error(`庫存不足！此規格僅剩 ${selectedVariant.stock_quantity} 件。`);
      return;
    }
    
    onAddToCart(selectedVariant.id, quantity);
    onClose(); 
  };

  // 8. 如果 "product" 是 null，就什麼都不渲染 (保持不變)
  if (!product) {
    return null;
  }

  // --- 9. 渲染 (Render) Modal (保持不變) ---
  return (
    // (A) 灰色背景遮罩
    <div 
      onClick={onClose} 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
    >
      {/* (B) 白色內容面板 */}
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="bg-white w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden grid grid-cols-2"
      >
        {/* (B.1) 左側：圖片 (保持不變) */}
        <div className="relative w-full h-full min-h-[400px] bg-gray-100">
          <img
            src={product.image_url || '/placeholder.jpg'} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* (B.2) 右側：內容 (保持不變) */}
        <div className="p-6 flex flex-col relative"> {/* [!] 加上 relative */}
          {/* 關閉按鈕 */}
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 z-10">
            <XMarkIcon className="w-6 h-6" />
          </button>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
          <p className="text-sm text-gray-600 mb-4 h-20 overflow-y-auto">
            {product.description}
          </p>
          
          <div className="flex-grow space-y-4">
            {/* 規格下拉選單 */}
            <div>
              <label htmlFor={`modal-variant-${product.id}`} className="block text-sm font-medium text-gray-700">
                規格
              </label>
              <select
                id={`modal-variant-${product.id}`}
                value={selectedVariantId}
                onChange={(e) => setSelectedVariantId(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
              >
                {/* [!] 加上 "product.variants?." */}
                {product.variants?.length === 0 ? (
                  <option value="">此商品無規格</option>
                ) : (
                  product.variants?.map(variant => (
                    <option key={variant.id} value={variant.id}>
                      {getVariantName(variant)} (NT$ {(product.base_price + variant.price_offset)})
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* 數量選擇 */}
            <div>
              <label htmlFor={`modal-quantity-${product.id}`} className="block text-sm font-medium text-gray-700">
                數量
              </label>
              <input
                type="number"
                id={`modal-quantity-${product.id}`}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min={1}
                max={selectedVariant?.stock_quantity || 1} 
                disabled={!selectedVariant} 
                className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
              />
            </div>
          </div>
          
          {/* 底部按鈕區 */}
          <div className="mt-6 pt-6 border-t flex items-center justify-between">
            <span className="text-3xl font-bold text-gray-900">
              NT$ {displayPrice * quantity}
            </span>
            <button 
              onClick={handleAddToCartClick}
              disabled={!selectedVariant} 
              className="flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-lg font-semibold text-base hover:bg-orange-600 transition-colors disabled:bg-gray-300"
            >
              <ShoppingCartIcon className="w-5 h-5" />
              <span>加入購物車</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};