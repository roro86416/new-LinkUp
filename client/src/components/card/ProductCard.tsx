"use client";

// 1. 引入 Heroicons (您專案中已安裝) [cite: client/package.json, page.tsx]
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

// 2. 定義這個元件需要的"資料" (Props)
// (這對應您的 prisma.schema.prisma [cite: server/prisma/schema.prisma] 中的 "Product" model)
export interface ProductData {
  id: number;
  name: string;
  description: string | null;
  base_price: number; // Prisma 的 Decimal 會被轉為 number
  image_url: string | null;
}

interface ProductCardProps {
  product: ProductData;
  onAddToCart: (productId: number) => void; // 點擊 "加入購物車" 時呼叫
}

// 3. 這就是您的商品卡片元件
export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      {/* 1. 圖片區 */}
      <div className="relative w-full h-56 bg-gray-100">
        <img
          src={product.image_url || '/placeholder.jpg'} // [!] 使用商品圖片
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 2. 內容區 */}
      <div className="p-4">
        {/* 標題 */}
        <h3 className="font-bold text-lg text-gray-900 leading-tight truncate" title={product.name}>
          {product.name}
        </h3>
        
        {/* 描述 (可選) */}
        {product.description && (
          <p className="text-sm text-gray-600 mt-1 h-10 overflow-hidden">
            {product.description}
          </p>
        )}

        {/* 價格與按鈕 */}
        <div className="flex items-center justify-between mt-4">
          {/* 價格 */}
          <div className="text-gray-900 font-bold text-xl">
            <span>NT$ {product.base_price}</span>
          </div>

          {/* 加入購物車按鈕 */}
          <button 
            onClick={() => onAddToCart(product.id)}
            className="flex items-center justify-center p-2 bg-orange-500 text-white rounded-full transition-transform hover:scale-110 active:scale-95"
            title="加入購物車"
          >
            <ShoppingCartIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};