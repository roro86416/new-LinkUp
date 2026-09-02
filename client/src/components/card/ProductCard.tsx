"use client";

// [!] 1. (新) 引入 "EyeIcon" (眼睛圖示)，取代 "ShoppingCartIcon"
import { EyeIcon } from '@heroicons/react/24/outline';

// --- 類型定義 (與 Gemi-439/Gemi-441 一致) ---

// [!] (新) 商品規格 (Variant) 的類型
export interface ProductVariantData {
  id: number;
  option1_value: string | null;
  option2_value: string | null;
  price_offset: number;
  stock_quantity: number;
}

// [!] (更新) 商品 (Product) 的類型，現在包含 "variants"
export interface ProductData {
  id: number;
  name: string;
  description: string | null;
  base_price: number;
  image_url: string | null;
  variants: ProductVariantData[]; // [!] 規格陣列
}

// [!!!] 2. 關鍵更新：更新 Props
interface ProductCardProps {
  product: ProductData;
  // (舊) onAddToCart: (productId: number) => void;
  // (新) 點擊卡片時呼叫，並 "回傳完整的商品資料" 給 EventMall
  onCardClick: (product: ProductData) => void; 
}

// [!] 3. 商品卡片元件 (新版)
export default function ProductCard({ product, onCardClick }: ProductCardProps) {
  
  return (
    // [!!!] 4. 關鍵更新：
    // (A) 將 <div> 改為 <button>，讓整張卡片可點擊、可 focus
    // (B) 加上 "onClick" 事件
    <button 
      onClick={() => onCardClick(product)}
      className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-orange-500 text-left"
    >
      {/* 1. 圖片區 (保持不變) */}
      <div className="relative w-full h-56 bg-gray-100">
        <img
          src={product.image_url || '/placeholder.jpg'} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 2. 內容區 (保持不變) */}
      <div className="p-4">
        {/* 標題 (保持不變) */}
        <h3 className="font-bold text-lg text-gray-900 leading-tight truncate" title={product.name}>
          {product.name}
        </h3>
        
        {/* 描述 (保持不變) */}
        {product.description && (
          <p className="text-sm text-gray-600 mt-1 overflow-hidden h-10 [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]">
            {product.description}
          </p>
        )}

        {/* [!!!] 5. 關鍵更新：價格與按鈕 */}
        <div className="flex items-center justify-between mt-4">
          {/* 價格 (只顯示 "基本價") */}
          <div className="text-gray-900 font-bold text-xl">
            <span>NT$ {product.base_price} 起</span>
          </div>

          {/* (舊) "加入購物車" 按鈕已被移除 */}
          
          {/* (新) "查看" 圖示 */}
          <div
            className="flex items-center justify-center p-2 bg-gray-100 text-gray-600 rounded-full"
            title="查看商品"
          >
            <EyeIcon className="w-5 h-5" />
          </div>
        </div>
      </div>
    </button>
  );
};