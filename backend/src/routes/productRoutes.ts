import { Router, Request, Response, NextFunction } from 'express';
import { Product, IProduct } from '../models/Product';
import { validateProduct, validateUUID } from '../middleware/validation';
import { createError } from '../middleware/errorHandler';

const router = Router();

// GET /api/products - Get all products
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, available, page = 1, limit = 10 } = req.query;
    
    const filter: any = {};
    if (category) filter.category = category;
    if (available !== undefined) filter.available = available === 'true';

    const skip = (Number(page) - 1) * Number(limit);
    
    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(filter)
    ]);

    res.json({
      products,
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

// GET /api/products/:id - Get product by ID
router.get('/:id', validateUUID('id'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      throw createError('Product not found', 404);
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
});

// POST /api/products - Create new product
router.post('/', validateProduct, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, price, category, image, available } = req.body;
    
    const product = new Product({
      name,
      description,
      price,
      category,
      image,
      available: available ?? true
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    next(error);
  }
});

// PUT /api/products/:id - Update product
router.put('/:id', validateUUID('id'), validateProduct, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, price, category, image, available } = req.body;
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        category,
        image,
        available,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!product) {
      throw createError('Product not found', 404);
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/products/:id - Delete product
router.delete('/:id', validateUUID('id'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      throw createError('Product not found', 404);
    }

    res.json({ message: 'Product deleted successfully', product });
  } catch (error) {
    next(error);
  }
});

// GET /api/products/categories/list - Get all categories
router.get('/categories/list', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

export default router;
