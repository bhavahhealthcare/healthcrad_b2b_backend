import User from "../models/user.js";
class WishlistRepository {
  async toggleWishlist(userId, medicineId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      const index = user.wishlist.indexOf(medicineId);
      if (index === -1) {
        // Add to wishlist
        user.wishlist.push(medicineId);
      } else {
        // Remove from wishlist
        user.wishlist.splice(index, 1);
      }
      await user.save();
      return user;
    } catch (error) {
      console.log("Toggle wishlist repository layer error", error);
      throw error;
    }
  }
  async getWishlist(userId) {
    try {
      const user = await User.findById(userId).populate('wishlist');
      return user.wishlist;
    } catch (error) {
      console.log("Get wishlist repository layer error", error);
    }
  }
  async getOldWishlistItems(days) {
    try {
      const dateThreshold = new Date();
      dateThreshold.setDate(dateThreshold.getDate() - days);
      return await Wishlist.find({
        addedAt: {
          $lte: dateThreshold
        }
      });
    } catch (error) {
      console.log("Get old wishlist repository layer error", error);
    }
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - days);
    return await Wishlist.find({
      addedAt: {
        $lte: dateThreshold
      }
    });
  }
}
export default WishlistRepository;