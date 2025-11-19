import HeaderWrapper from '../HeaderWrapper';
import Footer from '../../components/Footer';

// [!] 2. 
// 這個 layout 會自動被 "根" layout.tsx 包裹
// 所以它 "不需要" <html>, <body> 或 Providers
//
export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (

    <div className="flex flex-col min-h-screen bg-white">
      <HeaderWrapper />
      {/* 5. 這裡是您 "未來" 的頁面 (例如 /cart, /checkout) */}
      {/* (我們給它一個 max-w-7xl 和 mx-auto 來置中內容) */}
      <main className="flex-grow w-full max-w-7xl mx-auto p-6">
        {children}
      </main>
      <Footer />
    </div>
  );
}