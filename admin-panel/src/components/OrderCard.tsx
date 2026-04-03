import React, { useState } from 'react';
import { Order } from '../types';
import { apiService } from '../services/apiService';

interface OrderCardProps {
  order: Order;
  onUpdate: (order: Order) => void;
  onDelete: (orderId: string) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onUpdate, onDelete }) => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleStatusChange = async (newStatus: string) => {
    setLoading(newStatus);
    try {
      const updatedOrder = await apiService.updateOrderStatus(order._id, newStatus);
      onUpdate(updatedOrder);
    } catch (error) {
      console.error('Failed to update order:', error);
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      setLoading('delete');
      try {
        await apiService.deleteOrder(order._id);
        onDelete(order._id);
      } catch (error) {
        console.error('Failed to delete order:', error);
      } finally {
        setLoading(null);
      }
    }
  };

  const getActionButton = (status: string, nextStatus: string, label: string, color: string, icon: string) => {
    if (order.status !== status) return null;
    
    return (
      <button
        onClick={() => handleStatusChange(nextStatus)}
        disabled={loading !== null}
        className={`px-4 py-2 ${color} text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2`}
      >
        {loading === nextStatus ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Processing...
          </>
        ) : (
          <>
            <span>{icon}</span>
            {label}
          </>
        )}
      </button>
    );
  };

  const getCardStyle = () => {
    const baseStyle = "bg-gray-800 rounded-lg border p-6 mb-4";
    
    switch (order.status) {
      case 'PENDING':
        return `${baseStyle} border-yellow-700 bg-yellow-900/50`;
      case 'CONFIRMED':
        return `${baseStyle} border-blue-700 bg-blue-900/50`;
      case 'PREPARING':
        return `${baseStyle} border-orange-700 bg-orange-900/50`;
      case 'READY':
        return `${baseStyle} border-green-700 bg-green-900/50`;
      case 'COMPLETED':
        return `${baseStyle} border-gray-600 bg-gray-800/50 opacity-60`;
      case 'CANCELLED':
        return `${baseStyle} border-red-700 bg-red-900/50 opacity-50`;
      default:
        return baseStyle;
    }
  };

  return (
    <div className={getCardStyle()}>
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-white">#{order.orderNumber}</h3>
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <span>👤</span>
              {order.customerName}
            </span>
            {order.tableId && (
              <span className="flex items-center gap-1">
                <span>🪑</span>
                Table {order.tableId.number}
              </span>
            )}
            <span className="flex items-center gap-1">
              <span>🕐</span>
              {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="text-2xl font-bold text-white">
            ${order.totalAmount.toFixed(2)}
          </div>
          <div className="text-xs text-gray-400">
            {new Date(order.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="mb-4 p-3 bg-gray-700 rounded-lg">
        <h4 className="font-medium text-gray-300 mb-3 flex items-center gap-2">
          <span>🍽️</span>
          Order Items
        </h4>
        <div className="space-y-2">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                  {item.quantity}x
                </span>
                <span className="font-medium text-white">{item.productId.name}</span>
              </div>
              <span className="font-semibold text-gray-300">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      {order.notes && (
        <div className="mb-4 p-3 bg-gray-700 rounded-lg">
          <div className="flex items-start gap-2">
            <span>📝</span>
            <div>
              <div className="text-sm font-medium text-gray-300">Notes</div>
              <div className="text-sm text-gray-400">{order.notes}</div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 flex-wrap">
        {getActionButton('PENDING', 'CONFIRMED', 'Accept', 'bg-blue-600 hover:bg-blue-700', '✓')}
        {getActionButton('CONFIRMED', 'PREPARING', 'Start Preparing', 'bg-orange-600 hover:bg-orange-700', '👨‍🍳')}
        {getActionButton('PREPARING', 'READY', 'Mark Ready', 'bg-green-600 hover:bg-green-700', '🔔')}
        {getActionButton('READY', 'COMPLETED', 'Complete', 'bg-gray-600 hover:bg-gray-700', '✅')}
        
        {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
          <button
            onClick={() => handleStatusChange('CANCELLED')}
            disabled={loading !== null}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {loading === 'CANCELLED' ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Cancelling...
              </>
            ) : (
              <>
                <span>❌</span>
                Cancel
              </>
            )}
          </button>
        )}
        
        {order.status !== 'COMPLETED' && (
          <button
            onClick={handleDelete}
            disabled={loading !== null}
            className="px-4 py-2 bg-red-900 text-red-400 rounded-lg hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {loading === 'delete' ? (
              <>
                <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                Deleting...
              </>
            ) : (
              <>
                <span>🗑️</span>
                Delete
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
