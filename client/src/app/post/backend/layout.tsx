// backend/layout.tsx
import Sidebar from "./components/sidebar"; // 注意大小寫習慣
import "../../../app/globals.css";

export default function BackendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 1. 外層容器：設置整個畫面的高度為 100vh，背景使用淺色調 (slate/gray-50)
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10">
        
       
        <div className="mx-auto max-w-7xl pb-10"> 
          
          
          
          {children}

        </div>
      </main>
    </div>
  );
}