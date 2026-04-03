import React, { useState, useEffect } from 'react';
import { Order } from '../types';

interface QuickActionsProps {
  onBulkAction: (action: string, selectedOrders: string[]) => void;
  orders: Order[];
}

const QuickActions: React.FC<QuickActionsProps> = ({ onBulkAction, orders }) => {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const activeOrders = orders.filter(order => 
    ['PENDING', 'CONFIRMED', 'PREPARING'].includes(order.status)
  );

  const handleSelectAll = () => {
    if (selectedOrders.length === activeOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(activeOrders.map(order => order._id));
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedOrders.length === 0) {
      alert('Please select orders first');
      return;
    }

    setActionLoading(action);
    try {
      await onBulkAction(action, selectedOrders);
      setSelectedOrders([]);
    } catch (error) {
      console.error('Bulk action failed:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const actions = [
    {
      key: 'confirm',
      label: 'Accept All',
      icon: '✓',
      color: 'bg-blue-600 hover:bg-blue-700',
      enabled: selectedOrders.some(id => {
        const order = orders.find(o => o._id === id);
        return order?.status === 'PENDING';
      })
    },
    {
      key: 'prepare',
      label: 'Start Preparing',
      icon: '👨‍🍳',
      color: 'bg-orange-600 hover:bg-orange-700',
      enabled: selectedOrders.some(id => {
        const order = orders.find(o => o._id === id);
        return order?.status === 'CONFIRMED';
      })
    },
    {
      key: 'ready',
      label: 'Mark Ready',
      icon: '🔔',
      color: 'bg-green-600 hover:bg-green-700',
      enabled: selectedOrders.some(id => {
        const order = orders.find(o => o._id === id);
        return order?.status === 'PREPARING';
      })
    },
    {
      key: 'cancel',
      label: 'Cancel Selected',
      icon: '❌',
      color: 'bg-red-600 hover:bg-red-700',
      enabled: selectedOrders.length > 0
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span>⚡</span>
        Quick Actions
      </h3>
      
      {/* Selection Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedOrders.length === activeOrders.length && activeOrders.length > 0}
              onChange={handleSelectAll}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Select All ({activeOrders.length})
            </span>
          </label>
          
          {selectedOrders.length > 0 && (
            <span className="text-sm text-blue-600 font-medium">
              {selectedOrders.length} selected
            </span>
          )}
        </div>
        
        {selectedOrders.length > 0 && (
          <button
            onClick={() => setSelectedOrders([])}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear Selection
          </button>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {actions.map(action => (
          <button
            key={action.key}
            onClick={() => handleBulkAction(action.key)}
            disabled={!action.enabled || actionLoading !== null}
            className={`px-4 py-3 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
              action.enabled ? action.color : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {actionLoading === action.key ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              <>
                <span>{action.icon}</span>
                {action.label}
              </>
            )}
          </button>
        ))}
      </div>

      {/* Selected Orders Summary */}
      {selectedOrders.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            <div className="font-medium mb-2">Selected Orders:</div>
            <div className="flex flex-wrap gap-2">
              {selectedOrders.map(orderId => {
                const order = orders.find(o => o._id === orderId);
                return (
                  <span
                    key={orderId}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                  >
                    #{order?.orderNumber}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickActions;
