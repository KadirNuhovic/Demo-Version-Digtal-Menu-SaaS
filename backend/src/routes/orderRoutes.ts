import { Router, Request, Response, NextFunction } from 'express';
import { Order, IOrder } from '../models/Order';
import { Product } from '../models/Product';
import { validateOrder, validateUUID } from '../middleware/validation';
import { createError } from '../middleware/errorHandler';

const router = Router();

// GET /api/orders - Get all orders
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, tableId, page = 1, limit = 10 } = req.query;
    
    const filter: any = {};
    if (status) filter.status = status;
    if (tableId) filter.tableId = tableId;

    const skip = (Number(page) - 1) * Number(limit);
    
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('tableId')
        .populate('items.productId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments(filter)
    ]);

    res.json({
      orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/orders/:id - Get order by ID
router.get('/:id', validateUUID('id'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('tableId')
      .populate('items.productId');
    
    if (!order) {
      throw createError('Order not found', 404);
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
});

// POST /api/orders - Create new order
router.post('/', validateOrder, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { customerName, customerEmail, tableId, notes, items } = req.body;

    // Calculate total amount and validate products
    let totalAmount = 0;
    const orderItems: any[] = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        throw createError(`Product with ID ${item.productId} not found`, 404);
      }

      if (!product.available) {
        throw createError(`Product ${product.name} is not available`, 400);
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: product._id,
        quantity: item.quantity,
        price: product.price
      });
    }

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const order = new Order({
      orderNumber,
      customerName,
      customerEmail,
      tableId,
      notes,
      items: orderItems,
      totalAmount
    });

    const savedOrder = await order.save();
    const populatedOrder = await Order.findById(savedOrder._id)
      .populate('tableId')
      .populate('items.productId');

    res.status(201).json(populatedOrder);
  } catch (error) {
    next(error);
  }
});

// PUT /api/orders/:id/status - Update order status
router.put('/:id/status', validateUUID('id'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;

    if (!['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'].includes(status)) {
      throw createError('Invalid order status', 400);
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
      .populate('tableId')
      .populate('items.productId');

    if (!order) {
      throw createError('Order not found', 404);
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/orders/:id - Cancel/delete order
router.delete('/:id', validateUUID('id'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      throw createError('Order not found', 404);
    }

    if (order.status === 'COMPLETED') {
      throw createError('Cannot delete completed order', 400);
    }

    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// GET /api/orders/status/list - Get all order statuses
router.get('/status/list', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED']);
  } catch (error) {
    next(error);
  }
});

export default router;
