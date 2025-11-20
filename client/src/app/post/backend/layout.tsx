// backend/layout.tsx
import Sidebar from "./components/sidebar";
import "../../../app/globals.css";

export default function BackendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar 固定在左邊 */}
      <Sidebar />

      {/* 主要內容區 */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
