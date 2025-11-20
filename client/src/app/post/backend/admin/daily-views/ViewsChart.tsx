"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Eye, TrendingUp, CalendarDays } from 'lucide-react';

interface DailyViewData {
  date: string;
  views: number;
}

const generateDailyViewData = (days: number): DailyViewData[] => {
  const data: DailyViewData[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    
    const dayOfWeek = d.toLocaleDateString('en-US', { weekday: 'short' });
    
    const baseViews = 1200 + (Math.sin(i * 0.7) * 700) + (Math.random() * 400);
    const views = Math.max(500, Math.floor(baseViews));

    data.push({
      date: dayOfWeek,
      views: views,
    });
  }
  return data;
};

const DailyViewsChart: React.FC = () => {
  const [dailyData, setDailyData] = useState<DailyViewData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 修正 React Effect 警告
  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800)); 
        
        setDailyData(generateDailyViewData(7));
        setLoading(false);
    };
    fetchData();
  }, []); 

  const totalViews = useMemo(() => {
    return dailyData.reduce((sum, item) => sum + item.views, 0).toLocaleString('en-US');
  }, [dailyData]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center p-10 bg-gray-900 text-white rounded-3xl shadow-xl border border-gray-700">
        <svg className="animate-spin h-8 w-8 text-blue-500 mr-3" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-xl text-gray-400">Loading chart data...</span>
      </div>
    );
  }

  return (
    <div className="
        w-full p-8 lg:p-10 
        bg-gray-900 text-white 
        rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] 
        border border-gray-700 h-full flex flex-col
    ">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-blue-700 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-blue-500 flex items-center">
          <Eye className="w-7 h-7 mr-3 text-blue-500" />
          Daily Page Views
        </h1>
        <div className="flex items-center text-lg text-gray-300">
            <CalendarDays className="w-5 h-5 mr-2 text-gray-500" />
            Last 7 Days
        </div>
      </div>

      {/* Total Views Summary */}
      <div className="mb-6 flex items-center justify-between bg-gray-800 p-3 rounded-xl shadow-inner">
          <p className="text-lg text-gray-400">Total Views:</p>
          <p className="text-3xl font-extrabold text-white flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-green-400" />
              {totalViews}
          </p>
      </div>

      {/* Chart Container */}
      <div className="flex-grow h-80 lg:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={dailyData}
            margin={{
              top: 15, right: 30, left: 10, bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
            <XAxis dataKey="date" stroke="#cbd5e0" />
            <YAxis stroke="#cbd5e0" tickFormatter={(value) => value.toLocaleString()} /> {/* Y 軸格式化 */}
            <Tooltip 
                contentStyle={{ 
                    backgroundColor: '#1a202c', 
                    border: '1px solid #4a5568', 
                    borderRadius: '5px' 
                }} 
                itemStyle={{ color: '#ffffff' }} 
                labelStyle={{ color: '#a0aec0' }}
            />
            <Line 
                type="monotone" 
                dataKey="views" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={false} // 移除靜態點
                activeDot={{ r: 6, fill: '#ef4444', stroke: '#fff', strokeWidth: 2 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DailyViewsChart;