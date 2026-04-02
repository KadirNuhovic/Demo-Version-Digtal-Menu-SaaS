import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  orderNumber: string;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
  totalAmount: number;
  customerName?: string;
  customerEmail?: string;
  tableId?: mongoose.Types.ObjectId;
  notes?: string;
  items: IOrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

const OrderSchema: Schema = new Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING'
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  customerName: {
    type: String,
    trim: true,
    maxlength: 255
  },
  customerEmail: {
    type: String,
    trim: true,
    maxlength: 255,
    lowercase: true
  },
  tableId: {
    type: Schema.Types.ObjectId,
    ref: 'Table'
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 500
  },
  items: [OrderItemSchema]
}, {
  timestamps: true
});

OrderSchema.index({ status: 1 });
OrderSchema.index({ tableId: 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ orderNumber: 1 }, { unique: true });

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
