//
// 這是 "client" 專案中的 "src/app/(shop)/layout.tsx"
//

// 1. 引入我們剛剛建立的 "商城專用" Header
import ShopHeader from '../../components/layout/ShopHeader';
// (我們也可以共用 Footer)
import Footer from '../../components/Footer';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    // [!!!] 2. 
    // 這是一個 "乾淨" 的版面
    // 它 "沒有" 太空背景，而是 "白色背景"
    //
    <div className="flex flex-col min-h-screen bg-white">
      
      {/* 3. 使用 "商城專用" 的 ShopHeader */}
      <ShopHeader />

      {/* 4. 這裡是您 "未來" 的頁面 (例如 /shop, /cart) */}
      <main className="flex-grow w-full max-w-7xl mx-auto p-6">
        {children}
      </main>
      
      {/* 5. 共用 Footer */}
      <Footer />
    </div>
  );
}