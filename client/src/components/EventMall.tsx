"use client";
import { useState } from 'react'; // [!] 1. 引入 useState

// [!] 2. 引入 "ProductCard" (Gemi-447 版) 和 "ProductModal" (Gemi-449 版)
import ProductCard, { type ProductData } from "./card/ProductCard";
import ProductModal from "../components/store/ProductModal"; // [!] (新) 引入 Modal

// [!] 3. 關鍵更新：Props
// "onAddToCart" 現在是 (productVariantId: number, quantity: number)
interface EventMallProps {
  products: ProductData[];
  onAddToCart: (productVariantId: number, quantity: number) => void;
}

/**
 * 這是「活動詳細頁」專用的「週邊商品商城」區塊
 * (新版：管理 ProductModal)
 */
export default function EventMall({ products=[], onAddToCart }: EventMallProps) {
  
  // [!!!] 4. (新) 建立 State 來管理 "哪一個商品被選中"
  // (如果 "null"，代表 Modal 是關閉的)
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);

  // 5. (新) 處理 "卡片被點擊" 的函式
  // (由 ProductCard 呼叫)
  const handleCardClick = (product: ProductData) => {
    setSelectedProduct(product); // [!] 設定選中商品，這會 "開啟" Modal
  };

  // 6. (新) 處理 "Modal 被關閉" 的函式
  // (由 ProductModal 呼叫)
  const handleModalClose = () => {
    setSelectedProduct(null); // [!] 清空商品，這會 "關閉" Modal
  };

  // 7. (新) 處理 "Modal 中的加入購物車" 函式
  // (由 ProductModal 呼叫)
  const handleModalAddToCart = (productVariantId: number, quantity: number) => {
    // 8. 將 "productVariantId" 和 "quantity" 往上傳遞
    onAddToCart(productVariantId, quantity); 
  };
  
  return (
    <div className="w-full py-8">
      {/* 區塊標題 (保持不變) */}
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        週邊商品
      </h2>

      {products.length === 0 ? (
        // (空狀態 保持不變)
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">此活動目前沒有提供週邊商品。</p>
        </div>
      ) : (
        // [!!!] 9. (更新) Grid 佈局
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard 
              key={product.id}
              product={product}
              // [!] 將 "handleCardClick" 傳遞下去
              onCardClick={handleCardClick} 
            />
          ))}
        </div>
      )}

      {/* [!!!] 10. (新) 渲染 Modal
        - "selectedProduct" 就是我們要顯示的商品
        - "handleModalClose" 是關閉函式
        - "handleModalAddToCart" 是加入購物車函式
      */}
      <ProductModal
        product={selectedProduct}
        onClose={handleModalClose}
        onAddToCart={handleModalAddToCart}
      />
    </div>
  );
};