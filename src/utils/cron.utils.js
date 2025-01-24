// cron-jobs.js
import cron from 'node-cron';
import CartService from '../services/cart-service.js';
import { publishToQueue } from './notification.utils.js';

const cartService = new CartService();

const startCronJobs = () => {
    // Schedule a job to run every day at midnight
    cron.schedule('0 0 * * *', async () => {
        try {
            const abandonedCarts = await cartService.getAbandonedCarts();
            abandonedCarts.forEach(cart => {
                const notification = {
                    userId: cart.user._id,
                    type: 'Cart Reminder',
                    message: 'Your cart has items waiting for you. Complete your purchase today!'
                };
                publishToQueue(notification);
            });
            console.log('Notifications for abandoned carts sent');
        } catch (error) {
            console.error('Error sending notifications for abandoned carts:', error);
        }
    });

    console.log('Cron jobs started');
};

export default startCronJobs;
