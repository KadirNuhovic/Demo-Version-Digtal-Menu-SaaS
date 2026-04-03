import React from 'react';
import { Order } from '../types';

interface OrderStatsProps {
  orders: Order[];
}

const OrderStats: React.FC<OrderStatsProps> = ({ orders }) => {
  const getStatusCounts = () => {
    const counts = {
      PENDING: 0,
      CONFIRMED: 0,
      PREPARING: 0,
      READY: 0,
      COMPLETED: 0,
      CANCELLED: 0,
    };

    const totalRevenue = orders
      .filter(order => order.status !== 'CANCELLED')
      .reduce((sum, order) => sum + order.totalAmount, 0);

    orders.forEach(order => {
      counts[order.status]++;
    });

    return { counts, totalRevenue };
  };

  const { counts, totalRevenue } = getStatusCounts();

  const stats = [
    {
      key: 'PENDING',
      label: 'Pending',
      icon: '⏳',
      bg: 'bg-yellow-900',
      border: 'border-yellow-700',
      text: 'text-yellow-400',
      count: counts.PENDING
    },
    {
      key: 'CONFIRMED',
      label: 'Confirmed',
      icon: '✓',
      bg: 'bg-blue-900',
      border: 'border-blue-700',
      text: 'text-blue-400',
      count: counts.CONFIRMED
    },
    {
      key: 'PREPARING',
      label: 'Preparing',
      icon: '👨‍🍳',
      bg: 'bg-orange-900',
      border: 'border-orange-700',
      text: 'text-orange-400',
      count: counts.PREPARING
    },
    {
      key: 'READY',
      label: 'Ready',
      icon: '🔔',
      bg: 'bg-green-900',
      border: 'border-green-700',
      text: 'text-green-400',
      count: counts.READY
    },
    {
      key: 'COMPLETED',
      label: 'Completed',
      icon: '✅',
      bg: 'bg-gray-800',
      border: 'border-gray-600',
      text: 'text-gray-400',
      count: counts.COMPLETED
    },
    {
      key: 'CANCELLED',
      label: 'Cancelled',
      icon: '❌',
      bg: 'bg-red-900',
      border: 'border-red-700',
      text: 'text-red-400',
      count: counts.CANCELLED
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {stats.map(stat => (
        <div
          key={stat.key}
          className={`${stat.bg} ${stat.border} border rounded-lg p-4`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">{stat.icon}</span>
            {stat.count > 0 && (
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            )}
          </div>
          <div className={`text-2xl font-bold ${stat.text}`}>{stat.count}</div>
          <div className={`text-sm ${stat.text} opacity-75`}>{stat.label}</div>
        </div>
      ))}
      
      {/* Total Revenue Card */}
      <div className="bg-purple-900 border border-purple-700 rounded-lg p-4 col-span-2 md:col-span-3 lg:col-span-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">💰</span>
              <span className="text-sm text-purple-400 font-medium">Total Revenue</span>
            </div>
            <div className="text-3xl font-bold text-purple-400">
              ${totalRevenue.toFixed(2)}
            </div>
            <div className="text-sm text-purple-300 opacity-75">
              From {orders.filter(o => o.status !== 'CANCELLED').length} orders
            </div>
          </div>
          <div className="text-4xl opacity-50 text-purple-400">📊</div>
        </div>
      </div>
    </div>
  );
};

export default OrderStats;
