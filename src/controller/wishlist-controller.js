import WishlistService from "../services/wishlist-service.js";

const wishlistService = new WishlistService();

export const toggleWishlist = async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const { medicineId } = req.body;
      console.log(userId, productId)
      const user = await wishlistService.toggleWishlist(userId, medicineId);
      res.status(200).json({
        type: "success",
        message: "Wishlist toggled successfully",
        data: user
      });
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      res.status(500).json({
        type: "error",
        message: "Internal Server Error",
        error: error.message
      });
    }
  };



export const getWishlistController = async (req, res) => {
    try {
        const userId = req.user.userId;
        const wishlist = await wishlistService.getWishlist(userId);
        res.status(200).json({
            type: "success",
            message: "Wishlist fetched successfully",
            data: wishlist
        });
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        res.status(500).json({
            type: "error",
            message: "Internal Server Error",
            error: error.message
        });
    }
};
