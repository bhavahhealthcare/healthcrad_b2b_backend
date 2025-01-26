// repositories/orderRepository.js
import Order from '../models/booking.js';
class OrderRepository {
  async createOrder(orderData) {
    try {
      const order = new Order(orderData);
      return await order.save();
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('Error creating order');
    }
  }
  async updateOrderStatus(orderId, status) {
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        throw new Error('Order not found');
      }
      order.status = status;
      order.trackingHistory.push({
        status,
        date: new Date()
      });
      await order.save();
      return order;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw new Error('Error updating order status');
    }
  }
  async getOrderById(orderId) {
    try {
      const order = await Order.findById(orderId).populate('products.medicineId');
      if (!order) {
        throw new Error('Order not found');
      }
      return order;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw new Error('Error fetching order');
    }
  }
  async getOrdersByStatus(status) {
    try {
      const orders = await Order.find({
        status
      });
      return orders;
    } catch (error) {
      console.error('Error fetching orders by status:', error);
      throw new Error('Error fetching orders by status');
    }
  }
  async getNewOrdersWithinLast12Hours() {
    try {
      const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
      const orders = await Order.find({
        createdAt: {
          $gte: twelveHoursAgo
        }
      });
      return orders;
    } catch (error) {
      console.error('Error fetching new orders within last 12 hours:', error);
      throw new Error('Error fetching new orders within last 12 hours');
    }
  }
}
export default OrderRepository;