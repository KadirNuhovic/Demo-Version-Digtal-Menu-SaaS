import mongoose, { Document, Schema } from 'mongoose';

export interface ITable extends Document {
  number: string;
  qrCode: string;
  capacity?: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'MAINTENANCE';
  createdAt: Date;
  updatedAt: Date;
}

const TableSchema: Schema = new Schema({
  number: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
    unique: true
  },
  qrCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 500
  },
  capacity: {
    type: Number,
    min: 1,
    max: 20
  },
  status: {
    type: String,
    enum: ['AVAILABLE', 'OCCUPIED', 'RESERVED', 'MAINTENANCE'],
    default: 'AVAILABLE'
  }
}, {
  timestamps: true
});

TableSchema.index({ status: 1 });
TableSchema.index({ number: 1 }, { unique: true });
TableSchema.index({ qrCode: 1 }, { unique: true });

export const Table = mongoose.model<ITable>('Table', TableSchema);
