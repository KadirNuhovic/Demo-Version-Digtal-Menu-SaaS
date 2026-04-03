import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { Order } from '../models/Order';

export class SocketService {
  private io: SocketIOServer;
  private static instance: SocketService;

  private constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.CORS_ORIGIN || "http://localhost:3001",
        methods: ["GET", "POST"]
      }
    });

    this.setupEventHandlers();
  }

  public static getInstance(server?: HTTPServer): SocketService {
    if (!SocketService.instance) {
      if (!server) {
        throw new Error('Server instance is required for first initialization');
      }
      SocketService.instance = new SocketService(server);
    }
    return SocketService.instance;
  }

  private setupEventHandlers(): void {
    this.io.on('connection', (socket) => {
      console.log(`✅ Client connected: ${socket.id}`);

      // Join room for order updates
      socket.on('join-orders', () => {
        socket.join('orders');
        console.log(`📝 Client ${socket.id} joined orders room`);
      });

      // Join room for kitchen updates
      socket.on('join-kitchen', () => {
        socket.join('kitchen');
        console.log(`👨‍🍳 Client ${socket.id} joined kitchen room`);
      });

      socket.on('disconnect', () => {
        console.log(`❌ Client disconnected: ${socket.id}`);
      });
    });
  }

  // Emit new order event
  public emitNewOrder(order: any): void {
    this.io.to('orders').emit('new-order', {
      type: 'NEW_ORDER',
      data: order,
      timestamp: new Date().toISOString()
    });

    this.io.to('kitchen').emit('new-order', {
      type: 'NEW_ORDER',
      data: order,
      timestamp: new Date().toISOString()
    });

    console.log(`📢 New order emitted: ${order.orderNumber}`);
  }

  // Emit order status update
  public emitOrderStatusUpdate(orderId: string, status: string, order: any): void {
    const updateData = {
      type: 'ORDER_STATUS_UPDATE',
      orderId,
      status,
      data: order,
      timestamp: new Date().toISOString()
    };

    this.io.to('orders').emit('order-status-update', updateData);
    this.io.to('kitchen').emit('order-status-update', updateData);

    console.log(`🔄 Order status update emitted: ${orderId} -> ${status}`);
  }

  // Emit order deletion
  public emitOrderDeleted(orderId: string): void {
    const deleteData = {
      type: 'ORDER_DELETED',
      orderId,
      timestamp: new Date().toISOString()
    };

    this.io.to('orders').emit('order-deleted', deleteData);
    this.io.to('kitchen').emit('order-deleted', deleteData);

    console.log(`🗑️ Order deletion emitted: ${orderId}`);
  }

  // Get IO instance for external use
  public getIO(): SocketIOServer {
    return this.io;
  }
}
