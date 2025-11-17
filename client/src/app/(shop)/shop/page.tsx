'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast'; // [!] 您的 layout.tsx [cite: layout.tsx] 已安裝

// 1. 引入您的 API 客戶端
import { apiClient } from '../../../api/auth/apiClient';

// 2. 引入我們剛建立的 "商品卡片"
import ProductCard, { type ProductData } from '../../../components/card/ProductCard';

// 3. 定義後端回傳的 API 結構
interface ApiResponse<T> {
  status: "success" | "error";
  data: T;
  message?: string;
}

export default function ShopPage() {
  
  // 4. 建立 State 來儲存商品和載入狀態
  const [products, setProducts] = useState<ProductData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 5. 獲取 API 資料
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        // [!] 呼叫您後端已掛載的 API [cite: app.ts]
        const response = await apiClient.get<ApiResponse<ProductData[]>>('/api/v1/products');
        
        setProducts(response.data || []);

      } catch (error) {
        console.error("獲取商品失敗:", error);
        if (error instanceof Error) {
          toast.error(`獲取商品失敗: ${error.message}`);
        } else {
          toast.error('獲取商品失敗');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []); // 空陣列，只在元件掛載時執行一次

  // 6. 加入購物車的 "模擬" 函式
  // (未來我們會在這裡呼叫 "POST /api/v1/cart" [cite: server/src/modules/cart/cart.routes.ts, app.ts])
  const handleAddToCart = (productId: number) => {
    console.log(`(模擬) 將商品 ${productId} 加入購物車`);
    toast.success('已加入購物車！');
  };

  return (
    // 您的 (shop)/layout.tsx [cite: Gemi-307] 會提供 padding (p-6)
    <div className="w-full">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        官方商城
      </h1>

      {isLoading ? (
        <p>載入中...</p>
      ) : products.length === 0 ? (
        <p>目前沒有任何商品。</p>
      ) : (
        // 7. 使用 Grid 佈局顯示卡片
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard 
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}