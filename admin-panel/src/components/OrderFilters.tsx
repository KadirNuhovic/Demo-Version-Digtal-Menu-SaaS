import React, { useState, useEffect } from 'react';
import { Order } from '../types';

interface OrderFiltersProps {
  onFilterChange: (filters: {
    status: string;
    dateRange: string;
    searchTerm: string;
  }) => void;
  orders: Order[];
}

const OrderFilters: React.FC<OrderFiltersProps> = ({ onFilterChange, orders }) => {
  const [status, setStatus] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const statuses = [
    { value: 'all', label: 'All Status', icon: '📋' },
    { value: 'PENDING', label: 'Pending', icon: '⏳' },
    { value: 'CONFIRMED', label: 'Confirmed', icon: '✓' },
    { value: 'PREPARING', label: 'Preparing', icon: '👨‍🍳' },
    { value: 'READY', label: 'Ready', icon: '🔔' },
    { value: 'COMPLETED', label: 'Completed', icon: '✅' },
    { value: 'CANCELLED', label: 'Cancelled', icon: '❌' },
  ];

  const dateRanges = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
  ];

  useEffect(() => {
    onFilterChange({ status, dateRange, searchTerm });
  }, [status, dateRange, searchTerm]);

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
      <h3 className="text-lg font-bold text-gray-300 mb-4 flex items-center gap-2">
        <span>🔍</span>
        Filter Orders
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
          >
            {statuses.map(s => (
              <option key={s.value} value={s.value} className="bg-gray-800">
                {s.icon} {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Date Range
          </label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
          >
            {dateRanges.map(range => (
              <option key={range.value} value={range.value} className="bg-gray-800">
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* Search Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Search
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Order #, customer name..."
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>Showing {orders.length} orders</span>
          <button
            onClick={() => {
              setStatus('all');
              setDateRange('all');
              setSearchTerm('');
            }}
            className="text-blue-400 hover:text-blue-300 font-medium"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderFilters;
