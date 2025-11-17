//
// 這是 "client" 專案中的 "src/app/(main)/layout.tsx"
//
import HeaderWrapper from '../../components/layout/HeaderWrapper'; // 匯入您的首頁 Header
import Footer from '../../components/Footer'; // 匯入 Footer

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    // 這是您的 "首頁" 版型
    <>
      <HeaderWrapper />
      {/* [!] 
        HeaderWrapper 內部是 "sticky" 或 "fixed"
        而 page.tsx 內容會從 Header "下方" 開始
        (我們在 Gemi-247 中已修復 z-index)
      */}
      <main className="relative z-40 w-full justify-center m-0 p-0 min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}