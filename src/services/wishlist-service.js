import WishlistRepository from "../repository/wishlist-repository.js";
import MedicineRepository from "../repository/medicine-repository.js";

class WishlistService {
    constructor() {
        this.wishlistRepository = new WishlistRepository();
        this.productRepository = new MedicineRepository();
    }

    async toggleWishlist(userId, medicineId) {
        try {
          const user = await this.wishlistRepository.toggleWishlist(userId, medicineId);
          return user;
        } catch (error) {
          console.log("Toggle wishlist service layer error", error);
          throw error;
        }
      }

    async getWishlist(userId) {
        try {
            const wishlist = await this.wishlistRepository.getWishlist(userId);
            return wishlist;
        } catch (error) {
            console.log("Error fetching wishlist:", error);
            throw new Error("Error fetching wishlist");
        }
    }
    async sendNotificationForOldWishlistItems() {
      try {
        const oldWishlistItems = await this.wishlistRepository.getOldWishlistItems(3); // Items older than 3 days
        for (const item of oldWishlistItems) {
          const notification = {
            userId: item.userId,
            message: 'You have items in your wishlist for more than 3 days!',
            medicineId: item.medicineId
          };
          publishToQueue('notifications', JSON.stringify(notification));
        }
      } catch (error) {
        console.log("Error sending notifications for old wishlist items:", error);
        throw new Error("Error sending notifications for old wishlist items");
      }
    }
}

export default WishlistService;
