// controllers/orderController.js
import OrderService from '../services/booking-service.js';

const orderService = new OrderService();

export const getOrderSummary = async (req, res) => {
  try {
    const userId = req.user.userId; // Assuming user ID is available in req.user
     // Optional coupon code from the request body

    const orderSummary = await orderService.prepareOrderSummary(userId);
    res.status(200).json({
      type: 'success',
      message: 'Order summary retrieved successfully',
      data: orderSummary,
    });
  } catch (error) {
    console.error('Error getting order summary:', error);
    res.status(400).json({
      type: 'error',
      message: error.message,
    });
  }
};

export const createOrder = async (req, res) => {
  try {
    const userId = req.user.userId; // Assuming user ID is available in req.user
    const { address, paymentOption, couponCode } = req.body;

    const order = await orderService.createOrder(userId, address, paymentOption, couponCode);
    res.status(201).json({
      type: 'success',
      message: 'Order created successfully',
      data: order,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(400).json({
      type: 'error',
      message: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { status } = req.body;

    const order = await orderService.updateOrderStatus(orderId, status);
    res.status(200).json({
      type: 'success',
      message: 'Order status updated successfully',
      data: order,
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      type: 'error',
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

export const getOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    const order = await orderService.getOrderById(orderId);
    res.status(200).json({
      type: 'success',
      message: 'Order retrieved successfully',
      data: order,
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      type: 'error',
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user.userId; // Assuming user ID is available in req.user
    const { medicineId } = req.params; // Assuming medicineId is passed as a parameter
    const cart = await cartService.removeCartItem(userId, medicineId);

    res.status(200).json({
      success: true,
      message: 'Cart item removed successfully',
      cart,
    });
  } catch (error) {
    console.error('Error removing cart item:', error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDeliveredOrders = async (req, res) => {
  try {
    const deliveredOrders = await orderService.getOrdersByStatus('delivered');
    res.status(200).json({
      type: 'success',
      message: 'Delivered orders retrieved successfully',
      data: deliveredOrders,
    });
  } catch (error) {
    console.error('Error fetching delivered orders:', error);
    res.status(500).json({
      type: 'error',
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// Fetch all new orders within the last 12 hours
export const getNewOrdersWithinLast12Hours = async (req, res) => {
  try {
    const newOrders = await orderService.getNewOrdersWithinLast12Hours();
    res.status(200).json({
      type: 'success',
      message: 'New orders within the last 12 hours retrieved successfully',
      data: newOrders,
    });
  } catch (error) {
    console.error('Error fetching new orders within last 12 hours:', error);
    res.status(500).json({
      type: 'error',
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

export const checkOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    const order = await orderService.getOrderById(orderId);
    if (!order) {
      return res.status(404).json({
        type: 'error',
        message: 'Order not found',
      });
    }

    let statusMessage = 'Order is in processing';
    if (order.status === 'delivered') {
      statusMessage = 'Order is delivered';
    }

    res.status(200).json({
      type: 'success',
      message: statusMessage,
      data: order,
    });
  } catch (error) {
    console.error('Error checking order status:', error);
    res.status(500).json({
      type: 'error',
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};