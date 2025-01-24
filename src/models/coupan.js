import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// Define a schema for the cupon
const cuponSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  discountPercentage: {
    type: Number,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  usedBy: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
}, { timestamps: true });

const Cupon = model('Cupon', cuponSchema);
export default Cupon;
