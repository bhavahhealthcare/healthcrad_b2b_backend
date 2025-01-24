import CartRepository from "../repository/cart-repository.js";
import MedicineRepository from "../repository/medicine-repository.js";
import User from "../models/user.js";

class CartService {
    constructor() {
        this.cartRepository = new CartRepository();
        this.medicineRepository = new MedicineRepository();
    }

    async createCartForUser(userId) {
        try {
            const cart = await this.cartRepository.createCart(userId);
            console.log(cart);
            await User.findByIdAndUpdate(userId, { cartId: cart._id });
            return cart;
        } catch (error) {
            console.error("Error creating cart for user:", error);
            throw new Error("Error creating cart for user");
        }
    }

    async addProductToCart(userId, medicineData) {
        try {
            const { medicineId, quantity } = medicineData.items[0];
            const product = await this.medicineRepository.getMedicine(medicineId);
            console.log("product", product);

            const user = await User.findById(userId);
            let cartId = user.cartId;

            if (!cartId) {
                const cart = await this.createCartForUser(userId);
                cartId = cart._id;
                await User.findByIdAndUpdate(userId, { cartId });
            }

            if (!product) {
                throw new Error(`Product with ID ${medicineId} not found`);
            }

            const cartItem = {
                medicineId,
                quantity,
                finalPurchaseRate: product.Final_PURCHASE_RATE,
                name: product.NAME,
                manufacturer: product.MANUFACTURER,
                mrp: product.MRP,
                cateogery: product.CATEGORY
            };

            const cart = await this.cartRepository.addCartItem(userId, cartItem);
            console.log("cartItem", cart);

            return cart;
        } catch (error) {
            console.log("Error adding product to cart:", error);
            throw new Error("Error adding product to cart");
        }
    }

    async getCart(userId) {
        try {
            const cart = await this.cartRepository.getCartByUserId(userId);
            return cart;
        } catch (error) {
            console.log("Error fetching cart:", error);
            throw new Error("Error fetching cart");
        }
    }
    async removeCartItem(userId, medicineId){
        try {
            const cart = await this.cartRepository.removeCartItem(userId,medicineId)
            return cart
        } catch (error) {
            console.log("Error removing item from cart:", error);
            throw new Error("Error fetching cart");
        }
    }
    async getAbandonedCarts() {
        try {
            return await this.cartRepository.getAbandonedCarts();
        } catch (error) {
            console.error("Error getting abandoned carts:", error);
            throw new Error("Error getting abandoned carts");
        }
    }
}

export default CartService;
