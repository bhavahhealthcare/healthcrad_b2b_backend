import { model, Schema } from "mongoose";
const addressSchema = new Schema({
  street: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  postalCode: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /^\d{5,6}$/.test(v);
      },
      message: props => `${props.value} is not a valid postal code!`
    }
  }
}, {
  timestamps: true
});
const walletLedgerSchema = new Schema({
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    },
    index: true // Ensure index is created for unique constraint
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /^[6-9]\d{9}$/.test(v);
      },
      message: props => `${props.value} is not a valid 10-digit Indian phone number!`
    }
  },
  phoneOtp: {
    type: String
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ["men", "women"]
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  pharmacyId: {
    type: Schema.Types.ObjectId,
    ref: "Pharmacy"
  },
  cartId: {
    type: Schema.Types.ObjectId,
    ref: "Cart"
  },
  bookingId: [{
    type: Schema.Types.ObjectId,
    ref: "Booking"
  }],
  wishlist: [{
    type: Schema.Types.ObjectId,
    ref: "Product"
  }],
  wallet: {
    balance: {
      type: Number,
      default: 0
    },
    ledger: [walletLedgerSchema]
  },
  addresses: [addressSchema]
}, {
  toJSON: {
    transform(doc, ret) {
      delete ret.__v;
    }
  },
  timestamps: true
});
userSchema.pre("remove", async function (next) {
  try {
    await Pharmacy.deleteMany({
      userId: this._id
    });
    next();
  } catch (error) {
    next(error);
  }
});
const User = model("User", userSchema);
export default User;