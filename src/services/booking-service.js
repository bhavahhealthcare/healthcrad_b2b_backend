// services/orderService.js
import CartRepository from '../repository/cart-repository.js';
import OrderRepository from '../repository/booking-repository.js';
import CuponRepository from '../repository/coupan-repository.js';
import UserRepository from '../repository/user-repository.js';
import UserService from './user-service.js';

const calculateCharges = (cartValue) => {
  let convenienceCharge = 0;
  let packagingCharge = 0;
  let deliveryCharge = 0;

  if (cartValue < 5000) {
    convenienceCharge = 15;
    packagingCharge = 5;
    deliveryCharge = 40;
  } else if (cartValue < 10000) {
    convenienceCharge = 40;
    packagingCharge = 10;
    deliveryCharge = 100;
  } else if (cartValue < 15000) {
    convenienceCharge = 80;
    packagingCharge = 10;
    deliveryCharge = 100;
  } else if (cartValue < 20000) {
    convenienceCharge = 80;
    packagingCharge = 15;
    deliveryCharge = 100;
  } else {
    convenienceCharge = 80;
    packagingCharge = 20;
    deliveryCharge = 0;
  }

  return { convenienceCharge, packagingCharge, deliveryCharge };
};



class OrderService {
  constructor(){
     this.cartRepository = new CartRepository();
     this.orderRepository = new OrderRepository();
     this.cuponRepository = new CuponRepository();
     this.userRepository = new UserRepository();
     this.userService = new UserService();
  }
  async prepareOrderSummary(userId,couponCode) {
    try {

      const cart = await this.cartRepository.getCartByUserId(userId);
      if (!cart) {
        throw new Error('Cart not found');
      }

      const manufacturerTotals = {};

      cart.items.forEach(item => {
        if (!manufacturerTotals[item.manufacturer]) {
          manufacturerTotals[item.manufacturer] = 0;
        }
        manufacturerTotals[item.manufacturer] += item.finalPurchaseRate * item.quantity;
      });

      // Check if any manufacturer has a total less than 5000 rupees for generic medicines
      for (const item of cart.items) {
        if (item.cateogery === 'Generic_Medicine' && manufacturerTotals[item.manufacturer] < 5000) {
          throw new Error(`You need to purchase at least 5000 rupees worth of products from ${item.manufacturer} to include generic medicines.`);
        }
      }

      const cartValue = cart.items.reduce((total, item) => total + item.finalPurchaseRate * item.quantity, 0);
      const { convenienceCharge, packagingCharge, deliveryCharge } = calculateCharges(cartValue);
      let finalAmount = cartValue + convenienceCharge + packagingCharge + deliveryCharge;
      // console.log("fahjoilfdh",couponCode.discountPercentage)

      // console.log("fiosdahjofi",couponCode.discountPercentage)
      let discount = 0;
      if (couponCode && typeof couponCode.discountPercentage === 'number') {
        discount = (couponCode.discountPercentage / 100) * finalAmount;
        finalAmount = finalAmount - discount;
      }
   
      const orderSummary = {
        cartValue,
        convenienceCharge,
        packagingCharge,
        deliveryCharge,
        discount : 0,
        finalAmount,
      };

      return orderSummary;
    } catch (error) {
      console.error('Error preparing order summary:', error);
      throw new Error('Error preparing order summary');
    }
  }

  async createOrder(userId, addressData, paymentOption, couponCode) {
    try {
      const coupon = await this.cuponRepository.findCuponByCode(couponCode);  
      const orderSummary = await this.prepareOrderSummary(userId, coupon);
      const cart = await this.cartRepository.getCartByUserId(userId);
      const user = await this.userRepository.findById(userId);

      let address;
      if (!user.addresses || user.addresses.length === 0) {
        const updatedUser = await this.userService.addAddress(userId, addressData);
        address = updatedUser.addresses[0]; // Use the newly added address
      } else {
        address = user.addresses[0]; // Use the first address
      }

      let paymentStatus;
      let amountPaid;
      let remainingAmount;

      if (paymentOption === 'full') {
        paymentStatus = 'paid';
        amountPaid = orderSummary.finalAmount;
        remainingAmount = 0;
      } else if (paymentOption === 'half') {
        paymentStatus = 'half-paid';
        amountPaid = orderSummary.finalAmount / 2;
        remainingAmount = orderSummary.finalAmount / 2;
      } else {
        throw new Error('Invalid payment option');
      }

      const orderData = {
        user: userId,
        address: address,
        products: cart.items,
        paymentStatus: paymentStatus,
        couponCode,
        totalPrice: orderSummary.cartValue,
        convenienceCharge: orderSummary.convenienceCharge,
        packagingCharge: orderSummary.packagingCharge,
        deliveryCharge: orderSummary.deliveryCharge,
        discount: orderSummary.discount,
        finalAmount: orderSummary.finalAmount,
        amountPaid: amountPaid,
        remainingAmount: remainingAmount,
        status: 'pending',
        trackingHistory: [{ status: 'pending', date: new Date() }],
      };

      const order = await this.orderRepository.createOrder(orderData);
      await this.cartRepository.clearCart(userId);

      return {
        ...order,
        receipt: this.generateReceipt(orderData),
      };
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('Error creating order');
    }
  }

  generateReceipt(orderData) {
    return {
      message: `Your total payment is ${orderData.finalAmount}. You have paid ${orderData.amountPaid}. ${orderData.remainingAmount > 0 ? `You have to pay the remaining amount of ${orderData.remainingAmount} at the time of delivery.` : 'Thank you for the full payment.'}`,
    };
  }

  async updateOrderStatus(orderId, status) {
    try {
      const order = await this.orderRepository.updateOrderStatus(orderId, status);
      return order;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw new Error('Error updating order status');
    }
  }

  async getOrderById(orderId) {
    try {
      const order = await this.orderRepository.getOrderById(orderId);
      return order;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw new Error('Error fetching order');
    }
  }
  async getOrdersByStatus(status) {
    try {
      const orders = await this.orderRepository.getOrdersByStatus(status);
      return orders;
    } catch (error) {
      console.error('Error fetching orders by status:', error);
      throw new Error('Error fetching orders by status');
    }
  }

  async getNewOrdersWithinLast12Hours() {
    try {
      const orders = await this.orderRepository.getNewOrdersWithinLast12Hours();
      return orders;
    } catch (error) {
      console.error('Error fetching new orders within last 12 hours:', error);
      throw new Error('Error fetching new orders within last 12 hours');
    }
  }
}

export default OrderService;