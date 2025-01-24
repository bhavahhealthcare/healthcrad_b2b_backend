// models/Order.js
import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  address: { type: String, required: true },
  products: [{ 
    medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
    quantity: { type: Number, required: true },
    finalPurchaseRate: { type: Number, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    mrp: { type: Number, required: true },
    cateogery: { type: String, required: true }
  }],
  paymentStatus: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  convenienceCharge: { type: Number, required: true },
  packagingCharge: { type: Number, required: true },
  deliveryCharge: { type: Number, required: true },
  couponCode: { type: String },
  discount: { type: Number, required: true },
  finalAmount: { type: Number, required: true },
  status: { type: String, default: 'pending', required: true },
  trackingHistory: [{ status: String, date: Date }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Order', OrderSchema);
