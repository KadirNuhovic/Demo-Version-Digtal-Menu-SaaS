import { Router, Request, Response, NextFunction } from 'express';
import { Table, ITable } from '../models/Table';
import { Order } from '../models/Order';
import { validateTable, validateUUID } from '../middleware/validation';
import { createError } from '../middleware/errorHandler';

const router = Router();

// GET /api/tables - Get all tables
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const filter: any = {};
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    
    const [tables, total] = await Promise.all([
      Table.find(filter)
        .sort({ number: 1 })
        .skip(skip)
        .limit(Number(limit)),
      Table.countDocuments(filter)
    ]);

    // Get active orders for each table
    const tablesWithOrders = await Promise.all(
      tables.map(async (table) => {
        const activeOrders = await Order.find({
          tableId: table._id,
          status: { $in: ['PENDING', 'CONFIRMED', 'PREPARING'] }
        }).populate('items.productId');

        return {
          ...table.toObject(),
          orders: activeOrders
        };
      })
    );

    res.json({
      tables: tablesWithOrders,
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

// GET /api/tables/:id - Get table by ID
router.get('/:id', validateUUID('id'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const table = await Table.findById(req.params.id);
    
    if (!table) {
      throw createError('Table not found', 404);
    }

    // Get all orders for this table
    const orders = await Order.find({ tableId: table._id })
      .populate('items.productId')
      .sort({ createdAt: -1 });

    res.json({
      ...table.toObject(),
      orders
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/tables/qr/:qrCode - Get table by QR code
router.get('/qr/:qrCode', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const table = await Table.findOne({ qrCode: req.params.qrCode });
    
    if (!table) {
      throw createError('Table not found', 404);
    }

    // Get active orders for this table
    const activeOrders = await Order.find({
      tableId: table._id,
      status: { $in: ['PENDING', 'CONFIRMED', 'PREPARING'] }
    }).populate('items.productId');

    res.json({
      ...table.toObject(),
      orders: activeOrders
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/tables - Create new table
router.post('/', validateTable, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { number, capacity, status } = req.body;

    // Check if table number already exists
    const existingTable = await Table.findOne({ number });
    if (existingTable) {
      throw createError('Table with this number already exists', 400);
    }

    // Generate unique QR code
    const qrCode = `TABLE-${number}-${Date.now()}`;

    const table = new Table({
      number,
      capacity,
      status: status || 'AVAILABLE',
      qrCode
    });

    const savedTable = await table.save();
    res.status(201).json(savedTable);
  } catch (error) {
    next(error);
  }
});

// PUT /api/tables/:id - Update table
router.put('/:id', validateUUID('id'), validateTable, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { number, capacity, status } = req.body;

    // Check if table number already exists (excluding current table)
    if (number) {
      const existingTable = await Table.findOne({
        number,
        _id: { $ne: req.params.id }
      });
      
      if (existingTable) {
        throw createError('Table with this number already exists', 400);
      }
    }

    const table = await Table.findByIdAndUpdate(
      req.params.id,
      { number, capacity, status },
      { new: true, runValidators: true }
    );

    if (!table) {
      throw createError('Table not found', 404);
    }

    res.json(table);
  } catch (error) {
    next(error);
  }
});

// PUT /api/tables/:id/status - Update table status
router.put('/:id/status', validateUUID('id'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;

    if (!['AVAILABLE', 'OCCUPIED', 'RESERVED', 'MAINTENANCE'].includes(status)) {
      throw createError('Invalid table status', 400);
    }

    const table = await Table.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!table) {
      throw createError('Table not found', 404);
    }

    res.json(table);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/tables/:id - Delete table
router.delete('/:id', validateUUID('id'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if table has active orders
    const activeOrdersCount = await Order.countDocuments({
      tableId: req.params.id,
      status: { $in: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY'] }
    });

    if (activeOrdersCount > 0) {
      throw createError('Cannot delete table with active orders', 400);
    }

    const table = await Table.findByIdAndDelete(req.params.id);
    
    if (!table) {
      throw createError('Table not found', 404);
    }

    res.json({ message: 'Table deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// GET /api/tables/status/list - Get all table statuses
router.get('/status/list', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(['AVAILABLE', 'OCCUPIED', 'RESERVED', 'MAINTENANCE']);
  } catch (error) {
    next(error);
  }
});

export default router;
