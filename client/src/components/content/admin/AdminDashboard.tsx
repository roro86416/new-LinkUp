'use client';

import { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';

// Heroicons
import {
  UsersIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  // ----------------- 顏色 -----------------
  const primaryColor = '#c2410c';
  const primaryBgColor = '#FEE2E2';
  const primaryHoverColor = '#9a3412';

  const secondaryColor = '#d97706';
  const secondaryBgColor = '#FEF3C7';
  const secondaryHoverColor = '#b45309';

  const pieColors = ['#9a3412', '#c2410c', '#d97706', '#f59e0b'];

  // ----------------- 圖表資料 -----------------
  const pieData = {
    labels: ['活動 A', '活動 B', '活動 C', '活動 D'],
    datasets: [{ data: [30, 20, 25, 25], backgroundColor: pieColors, hoverOffset: 10 }],
  };

  const lineDataUser = {
    labels: ['8月', '9月', '10月'],
    datasets: [{
      label: '使用者數量',
      data: [1200, 1300, 1500],
      borderColor: primaryColor,
      backgroundColor: primaryBgColor,
      tension: 0.4,
      pointHoverRadius: 8,
      pointHoverBackgroundColor: primaryHoverColor,
      fill: true,
    }],
  };

  const lineDataRevenue = {
    labels: ['8月', '9月', '10月'],
    datasets: [{
      label: '交易額',
      data: [20000, 25000, 30000],
      borderColor: secondaryColor,
      backgroundColor: secondaryBgColor,
      tension: 0.4,
      pointHoverRadius: 8,
      pointHoverBackgroundColor: secondaryHoverColor,
      fill: true,
    }],
  };

  const barData = {
    labels: ['8月', '9月', '10月'],
    datasets: [{
      label: '報名人數',
      data: [200, 250, 300],
      backgroundColor: secondaryColor,
      hoverBackgroundColor: secondaryHoverColor,
    }],
  };

  // ----------------- 圖表選項 -----------------
  const pieOptions: ChartOptions<'doughnut'> = { responsive: true, plugins: { legend: { position: 'bottom' }, tooltip: { enabled: true } } };
  const lineOptions: ChartOptions<'line'> = { responsive: true, plugins: { legend: { position: 'bottom' }, tooltip: { enabled: true } } };
  const barOptions: ChartOptions<'bar'> = { responsive: true, plugins: { legend: { position: 'bottom' }, tooltip: { enabled: true } } };

  // ----------------- 當月熱門活動 -----------------
  const hotActivities = [
    { name: '真時光', organizer: 'Microsoft', date: '2025/10/20', email: 'jane@microsoft.com', count: 150, status: '進行中' },
    { name: '未來課堂', organizer: 'Microsoft', date: '2025/10/20', email: 'jane@microsoft.com', count: 120, status: '報名中' },
    { name: '足跡地圖', organizer: 'Microsoft', date: '2025/10/20', email: 'jane@microsoft.com', count: 85, status: '進行中' },
  ];

  // ----------------- 匯出 PDF -----------------
  const handleExportPDF = async () => {
    const input = dashboardRef.current;
    if (!input || isExporting) {
      console.error("Dashboard element not found.");
      return;
    }

    setIsExporting(true);

    // 找出頁面上所有的 <style> 和 <link rel="stylesheet"> 標籤
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]')) as (HTMLStyleElement | HTMLLinkElement)[];

    try {
      // 1. 暫時禁用所有外部樣式表，避免 lab() 顏色干擾
      // 這可以確保 html2canvas 只讀取元件內的 class 和內聯樣式
      styles.forEach(style => {
        style.setAttribute('media', 'print');
      });

      // 2. 執行 html2canvas 截圖
      const canvas = await html2canvas(input, {
        scale: 2, // 提高解析度以獲得更清晰的圖片
        useCORS: true,
        backgroundColor: '#f9fafb', // 直接指定背景色 (gray-50)
        onclone: (clonedDoc) => { // 在複製的 DOM 上操作，不影響原始頁面
          // a. 在複製出來的 DOM 中隱藏匯出按鈕
          const exportButtonClone = clonedDoc.querySelector<HTMLElement>('#export-button');
          if (exportButtonClone) {
            exportButtonClone.style.display = 'none';
          }

          // b. 關閉 chart.js 動畫，確保截圖正確
          clonedDoc.querySelectorAll('.chartjs-render-monitor').forEach((canvas) => {
            (canvas as HTMLCanvasElement).style.animation = 'none';
          });

          // c. 調整 SVG 圖示大小以補償 scale: 2 的放大效果
          // 將尺寸縮小至 75% (例如 32px * 0.75 = 24px)，經 scale: 2 放大後會是 48px，視覺上會比原始尺寸大一些
          clonedDoc.querySelectorAll('svg').forEach((svg: SVGSVGElement) => {
            if (svg.classList.contains('w-8')) { // 原始 32px
              svg.style.width = '24px'; // 32 * 0.75
              svg.style.height = '24px';
            } else if (svg.classList.contains('w-8')) { // 原始 32px
              svg.style.width = '18px'; // 24 * 0.75
              svg.style.height = '18px';
            } else if (svg.classList.contains('w-5')) { // 原始 20px
              svg.style.width = '15px'; // 20 * 0.75
              svg.style.height = '15px';
            }
          });
        },
      });

      // 3. 截圖完成後，立即恢復樣式表
      styles.forEach(style => {
        style.removeAttribute('media');
      });

      // 4. 產生並下載 PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4'); // A4 尺寸，縱向
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight); // 計算縮放比例
      const imgX = (pdfWidth - imgWidth * ratio) / 2; // 置中圖片
      pdf.addImage(imgData, 'PNG', imgX, 0, imgWidth * ratio, imgHeight * ratio);

      // --- 修改開始：強制觸發下載，而不是預覽 ---
      const date = new Date();
      const dateString = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      const fileName = `dashboard-report-${dateString}.pdf`;

      // 將 PDF 轉為 Blob 物件
      const pdfBlob = pdf.output('blob');
      // 建立一個臨時的 URL 指向這個 Blob
      const url = URL.createObjectURL(pdfBlob);
      // 建立一個隱藏的 <a> 標籤來觸發下載
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      // 清理
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      // --- 修改結束 ---
    } catch (err) {
      console.error('生成 PDF 失敗:', err);
      alert('匯出 PDF 失敗，請檢查控制台錯誤訊息。');
    } finally {
      // 5. 無論成功或失敗，都確保樣式表被恢復
      styles.forEach(style => {
        style.removeAttribute('media');
      });
      setIsExporting(false);
    }
  };

  return (
    <div ref={dashboardRef} className="w-full mx-auto pb-12 p-4 sm:p-6" style={{ backgroundColor: '#F9FAFB' }}>
      {/* 匯出按鈕 */}
      <div id="export-button" className="flex justify-end mb-4">
        <button
          onClick={handleExportPDF}
          disabled={isExporting}
          className="flex items-center gap-1 font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ color: '#B45309' }} // text-yellow-700
          onMouseOver={(e) => e.currentTarget.style.color = '#EA580C'} // hover:text-orange-600
          onMouseOut={(e) => e.currentTarget.style.color = '#B45309'}
        >
          <ArrowDownTrayIcon className="w-5 h-5" /> {isExporting ? '匯出中...' : '匯出報表'}
        </button>
      </div>

      {/* KPI 卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" >
        {[
          { icon: UsersIcon, title: '總使用人數', value: '1,500' },
          { icon: CalendarDaysIcon, title: '當月活動總數', value: '45' },
          { icon: BanknotesIcon, title: '當月交易額', value: '$30,000' }
        ].map((item, idx) => (
          <div key={idx} className="rounded-lg shadow p-4 flex items-center gap-4 cursor-pointer" style={{ backgroundColor: '#FFF7ED' }}>
            <div className="p-2 border rounded" style={{ borderColor: '#FED7AA' }}>
              <item.icon className="w-8 h-8" style={{ color: '#F97316' }} />
            </div>
            <div>
              <h3 className="font-semibold" style={{ color: '#4B5563' }}>{item.title}</h3>
              <p className="font-bold text-2xl mt-1" style={{ color: '#111827' }}>{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 圖表區 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-lg shadow p-4 mt-6 cursor-pointer" style={{ backgroundColor: '#FFFFFF' }}>
          <h3 className="font-semibold mb-4" style={{ color: '#111827' }}>使用者成長趨勢</h3>
          <Line data={lineDataUser} options={lineOptions} />
        </div>
        <div className="rounded-lg shadow p-4 mt-6 cursor-pointer" style={{ backgroundColor: '#FFFFFF' }}>
          <h3 className="font-semibold mb-4" style={{ color: '#111827' }}>交易額走勢 (近三個月)</h3>
          <Line data={lineDataRevenue} options={lineOptions} />
        </div>
        <div className="rounded-lg shadow p-4 cursor-pointer" style={{ backgroundColor: '#FFFFFF' }}>
          <h3 className="font-semibold mb-4" style={{ color: '#111827' }}>活動分類分布 (近三個月)</h3>
          <div className="w-2/3 mx-auto"><Doughnut data={pieData} options={pieOptions} /></div>
        </div>
        <div className="rounded-lg shadow p-4 cursor-pointer" style={{ backgroundColor: '#FFFFFF' }}>
          <h3 className="font-semibold mb-4" style={{ color: '#111827' }}>報名趨勢</h3>
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      {/* 當月熱門活動表格 */}
      <div className="rounded-lg shadow p-4 mt-6 cursor-pointer" style={{ backgroundColor: '#FFFFFF' }}>
        <h3 className="font-semibold mb-4 text-lg" style={{ color: '#111827' }}>當月熱門活動</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead style={{ backgroundColor: '#F9FAFB' }}>
              <tr>
                {['活動名稱', '主辦方', '建立日期', 'E-mail', '報名人數', '狀態'].map((th, idx) => (
                  <th key={idx} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#6B7280' }}>{th}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200" style={{ backgroundColor: '#FFFFFF' }}>
              {hotActivities.map((item, idx) => (
                <tr key={item.name + idx} className="transition-colors duration-150 cursor-pointer hover:bg-orange-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium" style={{ color: '#111827' }}>{item.name}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm" style={{ color: '#6B7280' }}>{item.organizer}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm" style={{ color: '#6B7280' }}>{item.date}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm" style={{ color: '#6B7280' }}>{item.email}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-right font-semibold" style={{ color: '#374151' }}>{item.count}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full`} style={
                      item.status === '進行中' ? { backgroundColor: 'rgb(219, 234, 254)', color: 'rgb(30, 64, 175)' } : // blue-100, blue-800
                        item.status === '報名中' ? { backgroundColor: 'rgb(220, 252, 231)', color: 'rgb(22, 101, 52)' } : // green-100, green-800
                          { backgroundColor: 'rgb(243, 244, 246)', color: 'rgb(55, 65, 81)' } // gray-100, gray-700
                    }>{item.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
