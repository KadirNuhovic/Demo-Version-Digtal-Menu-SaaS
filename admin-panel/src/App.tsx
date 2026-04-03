import React, { useState, useEffect, useCallback } from 'react';
import { Order } from './types';
import { apiService } from './services/apiService';
import { socketService } from './services/socketService';
import OrderCard from './components/OrderCard';
import OrderStats from './components/OrderStats';
import OrderFilters from './components/OrderFilters';
import QuickActions from './components/QuickActions';
import Notification from './components/Notification';
import LoadingSpinner from './components/LoadingSpinner';
import { useNotifications } from './hooks/useNotifications';
import './index.css';

const App: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [newOrderCount, setNewOrderCount] = useState(0);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    searchTerm: ''
  });
  
  const { notifications, addNotification, removeNotification } = useNotifications();

  useEffect(() => {
    fetchOrders();
    setupWebSocket();

    return () => {
      socketService.disconnect();
    };
  }, []);

  useEffect(() => {
    applyFilters();
  }, [orders, filters]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const fetchedOrders = await apiService.getOrders();
      setOrders(fetchedOrders);
      setError(null);
      addNotification('Orders loaded successfully', 'success');
    } catch (err) {
      setError('Failed to fetch orders');
      addNotification('Failed to load orders', 'error');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = useCallback(() => {
    let filtered = [...orders];

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(order => order.status === filters.status);
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt);
        
        switch (filters.dateRange) {
          case 'today':
            return orderDate >= today;
          case 'week':
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return orderDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
            return orderDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    // Search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(searchLower) ||
        order.customerName.toLowerCase().includes(searchLower) ||
        order.items.some(item => item.productId.name.toLowerCase().includes(searchLower))
      );
    }

    setFilteredOrders(filtered);
  }, [orders, filters]);

  const setupWebSocket = () => {
    socketService.connect();

    socketService.on('new-order', (event) => {
      setOrders(prev => [event.data, ...prev]);
      setNewOrderCount(prev => prev + 1);
      addNotification(`New order #${event.data.orderNumber} received!`, 'info');
      
      // Play notification sound
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZURE');
      audio.play().catch(() => {});
    });

    socketService.on('order-status-update', (event) => {
      setOrders(prev => 
        prev.map(order => 
          order._id === event.orderId ? event.data : order
        )
      );
      addNotification(`Order #${event.data.orderNumber} updated to ${event.status}`, 'success');
    });

    socketService.on('order-deleted', (event) => {
      setOrders(prev => prev.filter(order => order._id !== event.orderId));
      addNotification('Order deleted', 'warning');
    });

    setConnected(socketService.isConnected());
  };

  const handleOrderUpdate = (updatedOrder: Order) => {
    setOrders(prev => 
      prev.map(order => 
        order._id === updatedOrder._id ? updatedOrder : order
      )
    );
  };

  const handleOrderDelete = (orderId: string) => {
    setOrders(prev => prev.filter(order => order._id !== orderId));
  };

  const handleBulkAction = async (action: string, selectedOrderIds: string[]) => {
    try {
      const promises = selectedOrderIds.map(orderId => {
        let newStatus = '';
        
        switch (action) {
          case 'confirm':
            newStatus = 'CONFIRMED';
            break;
          case 'prepare':
            newStatus = 'PREPARING';
            break;
          case 'ready':
            newStatus = 'READY';
            break;
          case 'cancel':
            newStatus = 'CANCELLED';
            break;
          default:
            return Promise.resolve();
        }

        return apiService.updateOrderStatus(orderId, newStatus);
      });

      await Promise.all(promises);
      await fetchOrders(); // Refresh orders
      addNotification(`Bulk action completed: ${action}`, 'success');
    } catch (error) {
      console.error('Bulk action failed:', error);
      addNotification('Bulk action failed', 'error');
    }
  };

  const activeOrders = filteredOrders.filter(order => 
    ['PENDING', 'CONFIRMED', 'PREPARING', 'READY'].includes(order.status)
  );

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🍕</div>
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-white text-xl font-bold">Loading Kitchen Dashboard...</p>
          <p className="text-gray-400 mt-2">Getting your delicious orders ready!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            message={notification.message}
            type={notification.type}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>

      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <div className="text-4xl">👨‍🍳</div>
              <div>
                <h1 className="text-4xl font-bold text-white">
                  Kitchen Dashboard
                </h1>
                <p className="text-gray-400 text-lg">Real-time order management system</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                connected 
                  ? 'bg-green-900 text-green-400 border border-green-700' 
                  : 'bg-red-900 text-red-400 border border-red-700'
              }`}>
                <div className={`w-3 h-3 rounded-full ${
                  connected ? 'bg-green-400' : 'bg-red-400'
                }`}></div>
                {connected ? 'Connected' : 'Disconnected'}
              </div>
              
              {newOrderCount > 0 && (
                <div className="bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-bold border-2 border-orange-700">
                  🔥 {newOrderCount} new orders!
                </div>
              )}
              
              <button
                onClick={() => {
                  fetchOrders();
                  setNewOrderCount(0);
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <span>🔄</span>
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Active Orders Alert */}
        {activeOrders.length > 0 && (
          <div className="mb-6 p-4 bg-orange-900 border border-orange-700 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔥</span>
                <div>
                  <div className="text-lg font-bold text-orange-400">
                    {activeOrders.length} Active Orders
                  </div>
                  <div className="text-orange-300">
                    Need immediate attention!
                  </div>
                </div>
              </div>
              <div className="text-2xl">⚡</div>
            </div>
          </div>
        )}

        {/* Order Statistics */}
        <OrderStats orders={filteredOrders} />

        {/* Filters */}
        <OrderFilters 
          onFilterChange={setFilters} 
          orders={filteredOrders}
        />

        {/* Quick Actions */}
        <QuickActions 
          onBulkAction={handleBulkAction}
          orders={filteredOrders}
        />

        {/* Error Message */}
        {error && (
          <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-6 flex items-center gap-4 text-red-400">
            <span className="text-2xl">❌</span>
            <div>
              <div className="font-bold">Connection Error</div>
              <div className="text-sm">{error}</div>
            </div>
          </div>
        )}

        {/* Orders List */}
        {filteredOrders.length === 0 && !loading ? (
          <div className="text-center py-16 bg-gray-800 rounded-lg">
            <div className="text-6xl mb-4">🍽️</div>
            <div className="text-2xl font-bold text-white mb-4">No orders yet</div>
            <div className="text-gray-400 mb-6">New orders will appear here in real-time</div>
            <button
              onClick={fetchOrders}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔄 Check for Orders
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Sort orders by status and creation time */}
            {filteredOrders
              .sort((a, b) => {
                const statusPriority = {
                  'PENDING': 0,
                  'CONFIRMED': 1,
                  'PREPARING': 2,
                  'READY': 3,
                  'COMPLETED': 4,
                  'CANCELLED': 5
                };
                
                const aPriority = statusPriority[a.status] || 999;
                const bPriority = statusPriority[b.status] || 999;
                
                if (aPriority !== bPriority) {
                  return aPriority - bPriority;
                }
                
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
              })
              .map(order => (
                <OrderCard
                  key={order._id}
                  order={order}
                  onUpdate={handleOrderUpdate}
                  onDelete={handleOrderDelete}
                />
              ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="text-gray-400">
              <div className="text-lg font-bold">🍕 Digital Menu SaaS</div>
              <div className="text-sm">Kitchen Dashboard v2.0 - Made with ❤️</div>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <span>Powered by</span>
              <span className="text-2xl">⚡</span>
              <span>Real-time WebSocket</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
