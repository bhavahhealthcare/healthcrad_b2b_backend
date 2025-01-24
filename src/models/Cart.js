import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const cartItemSchema = new Schema({
  medicineId: { type: Schema.Types.ObjectId, ref: 'Medicine', required: true },
  quantity: { type: Number, required: true, min: 1 },
//   price: { type: Number, required: true },
  name: { type: String, required: true },
  mrp: { type: Number, required: true },
//   saleRate: { type: Number, required: true },
  finalPurchaseRate: { type: Number, required: true },
  manufacturer: { type: String, required: true },
  cateogery :{type: String, required: true}
});

const cartSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [cartItemSchema],
  totalPrice: { type: Number, default: 0 }
}, { timestamps: true });

// Pre-save hook to calculate total price before saving the cart
cartSchema.pre('save', function(next) {
  const cart = this;
  if (cart.isModified('items')) {
    cart.totalPrice = cart.items.reduce((total, item) => total + (item.saleRate * item.quantity), 0);
  }
  next();
});

const Cart = model('Cart', cartSchema);

export default Cart;
