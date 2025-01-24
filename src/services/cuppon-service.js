import CuponRepository from '../repository/coupan-repository.js';
import UserRepository from '../repository/user-repository.js';
import CartRepository from '../repository/cart-repository.js';
import OrderService from './booking-service.js';

class CuponService {
  constructor() {
    this.cuponRepository = new CuponRepository();
    this.userRepository = new UserRepository();
    this.cartRepository = new CartRepository();
    this.orderService = new OrderService();
  }

  async createCupon(cuponData) {
    try {
      return await this.cuponRepository.createCupon(cuponData);
    } catch (error) {
      throw new Error(`Failed to create cupon: ${error.message}`);
    }
  }
  async applyCoupon(userId, couponCode) {
    try {
      // Fetch the coupon details
      const coupon = await this.cuponRepository.findCuponByCode(couponCode);
      // console.log(coupon)

      if (!coupon) {
        throw new Error('Invalid coupon code');
      }

      // Check if the coupon is expired
      const currentDate = new Date();
      if (coupon.expiryDate < currentDate) {
        throw new Error('Coupon is expired');
      }

      // Get the user's current order summary
      const orderSummary = await this.orderService.prepareOrderSummary(userId,coupon);

      // Calculate the discount
      // const discount = (coupon.discountPercentage / 100) * orderSummary.finalAmount;
      // const finalAmount = orderSummary.finalAmount - discount;

      // Update the order summary with the discount
      const updatedOrderSummary = {
        ...orderSummary
      };

      return updatedOrderSummary;
    } catch (error) {
      console.error('Error applying coupon:', error);
      throw new Error('Error applying coupon');
    }
  }
 

  async deleteCupon(code) {
    try {
      return await this.cuponRepository.deleteCupon(code);
    } catch (error) {
      throw new Error(`Failed to delete cupon: ${error.message}`);
    }
  }
  async getAllCupons() {
    try {
      return await this.cuponRepository.getAllCupons();
    } catch (error) {
      throw new Error(`Failed to get all cupons: ${error.message}`);
    }
  }
}

export default  CuponService;
