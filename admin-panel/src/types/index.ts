export interface Order {
  _id: string;
  orderNumber: string;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
  totalAmount: number;
  customerName: string;
  customerEmail?: string;
  notes?: string;
  tableId?: {
    _id: string;
    number: number;
    status: string;
  };
  items: {
    productId: {
      _id: string;
      name: string;
      price: number;
      category: string;
    };
    quantity: number;
    price: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface WebSocketEvent {
  type: 'NEW_ORDER' | 'ORDER_STATUS_UPDATE' | 'ORDER_DELETED';
  data?: Order;
  orderId?: string;
  status?: string;
  timestamp: string;
}
