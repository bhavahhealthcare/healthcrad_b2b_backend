import CartService from "../services/cart-service.js";
import Cart from "../models/Cart.js";

const cartService = new CartService();

export const addProductToCart = async (req, res, next) => {
    try {
        const userId = req.user.userId; // Assuming user ID is available in req.user
        const medicineData = req.body;
        
        const cart = await cartService.addProductToCart(userId, medicineData);

        res.status(201).json({
            type: "success",
            message: "Product added to cart successfully",
            data: cart
        });
    } catch (error) {
        console.error("Error adding product to cart:", error);
        res.status(500).json({
            type: "error",
            message: "Internal Server Error",
            error: error.message
        });
    }
};
export const removeCartItem = async (req, res) => {
    try {
      const userId = req.user.userId; // Assuming user ID is available in req.user
      console.log("userid in controller",userId)
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
export const getCart = async (req, res, next) => {
    try {
        const userId = req.user.userId; // Assuming user ID is available in req.user

        const cart = await cartService.getCart(userId);

        if (!cart) {
            return res.status(404).json({
                type: "error",
                message: "Cart not found",
            });
        }

        res.status(200).json({
            type: "success",
            message: "Cart fetched successfully",
            data: cart
        });
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({
            type: "error",
            message: "Internal Server Error",
            error: error.message
        });
    }
};

export const clearCart = async (req, res, next) => {
    const itemId = req.params.itemId;
    const userId = req.user.userId;

    try {
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).send({ error: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item._id.toString() !== itemId);

        await cart.save();

        res.status(200).send({ message: 'Item removed from cart', cart });
    } catch (error) {
        res.status(500).send({ error: 'Failed to remove item from cart' });
    }
};

export const incrementCart = async (req, res, next) => {
    const itemId = req.params.itemId;
    const userId = req.user.userId;
    try {
        const cart = await Cart.findOne({ user: userId });
        console.log("cart in controllre",cart)

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        const item = cart.items.find(item => item.medicineId.toString() === itemId);
        console.log("item in controller",item)

        if (!item) {
            return res.status(404).json({ error: 'Item not found in cart' });
        }

        item.quantity += 1;
        cart.totalPrice = cart.items.reduce((total, item) => total + item.finalPurchaseRate * item.quantity, 0);
        await cart.save();

        res.status(200).json({ message: 'Item quantity incremented', cart });
    } catch (error) {
        console.error('Failed to increment item quantity:', error);
        res.status(500).json({ error: 'Failed to increment item quantity' });
    }
};

export const decrementCart = async (req, res, next) => {
    const itemId = req.params.itemId;
    
    const userId = req.user.userId;
   

    try {
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        const item = cart.items.find(item => item.medicineId.toString() === itemId);

        if (!item) {
            return res.status(404).json({ error: 'Item not found in cart' });
        }

        if (item.quantity > 1) {
            item.quantity -= 1;
            cart.totalPrice = cart.items.reduce((total, item) => total + item.finalPurchaseRate * item.quantity, 0);
            await cart.save();
            res.status(200).json({ message: 'Item quantity decremented', cart });
        } else {
            res.status(400).json({ error: 'Item quantity cannot be less than 1' });
        }
    } catch (error) {
        console.error('Failed to decrement item quantity:', error);
        res.status(500).json({ error: 'Failed to decrement item quantity' });
    }
};
