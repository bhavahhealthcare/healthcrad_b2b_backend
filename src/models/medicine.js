import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema(
  {
    NAME: {
      type: String,
      required: true,
    },
    COMPOSITION: {
      type: String,
      required: true,
    },
    PACKING: {
      type: String,
      required: true,
    },
    TYPE: {
      type: String,
      required: true,
    },
    MRP: {
      type: Number,
      required: true,
    },
    MANUFACTURER: {
      type: String,
      required: true,
    },
    DISCOUNT: {
      type: Number,
      default: 0,
    },
    SALE_RATE: {
      type: Number,
      required: true,
    },
    Final_PURCHASE_RATE: {
      type: Number,
      required: true,
    },
    PURCHASE_DISCOUNT: {
      type: Number,
      required: true,
    },
    CATEGORY: {
      type: String,
      enum: ['Generic_Medicine', 'Big_Brand_Medicine'],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Medicine = mongoose.model('Medicine', medicineSchema);

export default Medicine;
