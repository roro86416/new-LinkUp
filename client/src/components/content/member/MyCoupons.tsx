'use client';

import React from 'react';
import { useCoupons, Coupon } from './CouponsContext';
import { TicketIcon } from '@heroicons/react/24/outline';

const CouponCard: React.FC<{ coupon: Coupon }> = ({ coupon }) => {
  const isExpired = new Date(coupon.expiresAt) < new Date();
  const cardStyle = coupon.isUsed || isExpired
    ? 'grayscale opacity-60'
    : 'hover:shadow-lg hover:scale-105';

  return (
    <div className={`relative flex w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 ${cardStyle}`}>
      <div className="w-1/3 bg-orange-500 p-4 flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-sm">NT$</p>
          <p className="text-4xl font-bold">{coupon.value}</p>
          <p className="text-xs">折價券</p>
        </div>
      </div>
      <div className="w-2/3 p-4">
        <h3 className="text-md font-bold text-gray-800">{coupon.name}</h3>
        <p className="mt-2 text-xs text-gray-500">
          獲得於: {new Date(coupon.obtainedAt).toLocaleDateString()}
        </p>
        <p className="text-xs text-gray-500">
          到期日: {new Date(coupon.expiresAt).toLocaleDateString()}
        </p>
        <div className="mt-3 text-right">
          {coupon.isUsed ? (
            <span className="font-semibold text-gray-500">已使用</span>
          ) : isExpired ? (
            <span className="font-semibold text-red-500">已過期</span>
          ) : (
            <button className="rounded-md bg-orange-500 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-orange-600">
              立即使用
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default function MyCoupons() {
  const { coupons, loading } = useCoupons();

  if (loading) {
    return <div>讀取中...</div>;
  }

  return (
    <div className="w-full">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-2">我的折價券</h1>
      <p className="text-gray-500">您目前擁有的所有折價券。</p>

      {coupons.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {coupons.map(coupon => (
            <CouponCard key={coupon.id} coupon={coupon} />
          ))}
        </div>
      ) : (
        <div className="mt-12 text-center">
          <TicketIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">沒有任何折價券</h3>
          <p className="mt-1 text-sm text-gray-500">
            快去「幸運摸彩」試試手氣吧！
          </p>
        </div>
      )}
    </div>
  );
}