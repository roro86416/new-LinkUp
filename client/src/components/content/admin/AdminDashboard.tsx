'use client';

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
  ScriptableContext
} from 'chart.js';

// ⭐️ Heroicons
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
  // --------------------- 顏色 ---------------------
  const primaryColor = '#c2410c';
  const primaryBgColor = 'rgba(194, 65, 12, 0.1)';
  const primaryHoverColor = '#9a3412';

  const secondaryColor = '#d97706';
  const secondaryBgColor = 'rgba(217, 119, 6, 0.1)';
  const secondaryHoverColor = '#b45309';

  const pieColors = ['#9a3412', '#c2410c', '#d97706', '#f59e0b'];

  // --------------------- 圖表資料 ---------------------
  const pieData = {
    labels: ['活動 A', '活動 B', '活動 C', '活動 D'],
    datasets: [
      {
        data: [30, 20, 25, 25],
        backgroundColor: pieColors,
        hoverOffset: 10,
      },
    ],
  };

  const lineDataUser = {
    labels: ['8月', '9月', '10月'],
    datasets: [
      {
        label: '使用者數量',
        data: [1200, 1300, 1500],
        borderColor: primaryColor,
        backgroundColor: primaryBgColor,
        tension: 0.4,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: primaryHoverColor,
        fill: true,
      },
    ],
  };

  const lineDataRevenue = {
    labels: ['8月', '9月', '10月'],
    datasets: [
      {
        label: '交易額',
        data: [20000, 25000, 30000],
        borderColor: secondaryColor,
        backgroundColor: secondaryBgColor,
        tension: 0.4,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: secondaryHoverColor,
        fill: true,
      },
    ],
  };

  const barData = {
    labels: ['8月', '9月', '10月'],
    datasets: [
      {
        label: '報名人數',
        data: [200, 250, 300],
        backgroundColor: secondaryColor,
        hoverBackgroundColor: secondaryHoverColor,
      },
    ],
  };

  // --------------------- 圖表選項 ---------------------
  const pieOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      tooltip: { enabled: true },
    },
    animation: {
      duration: 1200,
      easing: 'easeOutBounce',
    },
  };

  const lineOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      tooltip: { enabled: true },
    },
    animations: {
      y: {
        easing: 'easeInOutElastic',
        duration: 800,
        from: (ctx: ScriptableContext<'line'>) => (ctx.type === 'data' ? ctx.chart.height : 0)
      }
    },
    hover: {
      mode: 'nearest',
      intersect: true,
    },
  };

  const barOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      tooltip: { enabled: true },
    },
    animations: {
      y: {
        easing: 'easeInOutElastic',
        duration: 800,
        from: (ctx: ScriptableContext<'bar'>) => {
          if (ctx.type === 'data') {
            return ctx.chart.height
          }
        },
      },
    },
    hover: {
      mode: 'nearest',
      intersect: true,
    },
  };

  // --------------------- 當月熱門活動 ---------------------
  const hotActivities = [
    { name: '真時光', organizer: 'Microsoft', date: '2025/10/20', email: 'jane@microsoft.com', count: 150, status: '進行中' },
    { name: '未來課堂', organizer: 'Microsoft', date: '2025/10/20', email: 'jane@microsoft.com', count: 120, status: '報名中' },
    { name: '足跡地圖', organizer: 'Microsoft', date: '2025/10/20', email: 'jane@microsoft.com', count: 85, status: '進行中' },
  ];

  return (
    <div className="w-full mx-auto pb-12">
      {/* 匯出按鈕 */}
      <div className="flex justify-end mb-4">
        <span className="flex items-center gap-1 text-yellow-700 cursor-pointer font-semibold hover:text-orange-600 transition-colors">
          <ArrowDownTrayIcon className="w-5 h-5" /> 匯出報表
        </span>
      </div>

      {/* KPI 卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-orange-50 rounded-lg shadow p-4 flex items-center gap-4">
          <div className="p-2 border border-orange-400 rounded">
            <UsersIcon className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h3 className="text-gray-800 font-semibold">總使用人數</h3>
            <p className="text-gray-900 font-bold text-2xl mt-1">1,500</p>
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg shadow p-4 flex items-center gap-4">
          <div className="p-2 border border-orange-400 rounded">
            <CalendarDaysIcon className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h3 className="text-gray-800 font-semibold">當月活動總數</h3>
            <p className="text-gray-900 font-bold text-2xl mt-1">45</p>
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg shadow p-4 flex items-center gap-4">
          <div className="p-2 border border-orange-400 rounded">
            <BanknotesIcon className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h3 className="text-gray-800 font-semibold">當月交易額</h3>
            <p className="text-gray-900 font-bold text-2xl mt-1">$30,000</p>
          </div>
        </div>
      </div>

      {/* 圖表區 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4 mt-6">
          <h3 className="text-gray-900 font-semibold mb-4">使用者成長趨勢</h3>
          <Line data={lineDataUser} options={lineOptions} />
        </div>

        <div className="bg-white rounded-lg shadow p-4 mt-6">
          <h3 className="text-gray-900 font-semibold mb-4">交易額走勢 (近三個月)</h3>
          <Line data={lineDataRevenue} options={lineOptions} />
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-900 font-semibold mb-4">活動分類分布 (近三個月)</h3>
          <div className="w-2/3 mx-auto">
            <Doughnut data={pieData} options={pieOptions} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-900 font-semibold mb-4">報名趨勢</h3>
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      {/* 當月熱門活動表格 */}
      <div className="bg-white rounded-lg shadow p-4 mt-6">
        <h3 className="text-gray-900 font-semibold mb-4 text-lg">當月熱門活動</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">活動名稱</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">主辦方</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">建立日期</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-mail</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">報名人數</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">狀態</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {hotActivities.map((item, idx) => (
                <tr key={item.name + idx} className="hover:bg-orange-50/50 transition-colors duration-150">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.organizer}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.email}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-800">
                    {item.count}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${item.status === '進行中'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                        }`}
                    >
                      {item.status}
                    </span>
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
