import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
    return;
  }
  next();
};

// Product validation
export const validateProduct = [
  body('name').trim().isLength({ min: 1, max: 255 }).withMessage('Name must be between 1 and 255 characters'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
  body('category').trim().isLength({ min: 1, max: 100 }).withMessage('Category is required'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description too long'),
  body('available').optional().isBoolean().withMessage('Available must be boolean'),
  handleValidationErrors
];

// Order validation
export const validateOrder = [
  body('customerName').optional().trim().isLength({ min: 1, max: 255 }).withMessage('Customer name must be between 1 and 255 characters'),
  body('customerEmail').optional().isEmail().withMessage('Invalid email format'),
  body('tableId').optional().isUUID().withMessage('Invalid table ID'),
  body('notes').optional().trim().isLength({ max: 500 }).withMessage('Notes too long'),
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('items').custom((items) => {
    if (!Array.isArray(items)) {
      throw new Error('Items must be an array');
    }
    for (const item of items) {
      if (!item.productId || typeof item.productId !== 'string') {
        throw new Error('Each item must have a valid productId');
      }
      if (!item.quantity || typeof item.quantity !== 'number' || item.quantity < 1) {
        throw new Error('Each item must have a valid quantity (minimum 1)');
      }
    }
    return true;
  }),
  handleValidationErrors
];

// Table validation
export const validateTable = [
  body('number').trim().isLength({ min: 1, max: 50 }).withMessage('Table number must be between 1 and 50 characters'),
  body('capacity').optional().isInt({ min: 1, max: 20 }).withMessage('Capacity must be between 1 and 20'),
  body('status').optional().isIn(['AVAILABLE', 'OCCUPIED', 'RESERVED', 'MAINTENANCE']).withMessage('Invalid table status'),
  handleValidationErrors
];

// UUID validation for params
export const validateUUID = (paramName: string) => [
  param(paramName).isUUID().withMessage(`Invalid ${paramName} format`),
  handleValidationErrors
];
