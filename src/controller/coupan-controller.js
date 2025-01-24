import CuponService from "../services/cuppon-service.js";

const cuponService = new CuponService();

export const createCupon = async (req, res, next) => {
    try {
        const { code, discountPercentage, expiryDate } = req.body;
        const cuponData = { code, discountPercentage, expiryDate };
        console.log(code)

        const cupon = await cuponService.createCupon(cuponData);

        res.status(201).json({
            type: "success",
            message: "Cupon created successfully",
            data: cupon
        });
    } catch (error) {
        console.error("Error creating cupon:", error);
        res.status(500).json({
            type: "error",
            message: "Internal Server Error",
            error: error.message
        });
    }
};


export const deleteCupon = async (req, res, next) => {
    try {
        const { code } = req.params;

        await cuponService.deleteCupon(code);

        res.status(200).json({
            type: "success",
            message: "Cupon deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting cupon:", error);
        res.status(500).json({
            type: "error",
            message: "Internal Server Error",
            error: error.message
        });
    }
};

export const getAllCupons = async (req, res, next) => {
    try {
        
        const cupons = await cuponService.getAllCupons();
        res.status(200).json({
            type: "success",
            message: "Cupons fetched successfully",
            data: cupons
        });
    } catch (error) {
        console.error("Error fetching cupons:", error);
        res.status(500).json({
            type: "error",
            message: "Internal Server Error",
            error: error.message
        });
    }
};

export const applyCoupon = async (req, res) => {
    try {
      const userId = req.user.userId;
      const { couponCode } = req.body;
  
      const updatedOrderSummary = await cuponService.applyCoupon(userId, couponCode);
      
      res.status(200).json({
        type: 'success',
        message: 'Coupon applied successfully',
        data: updatedOrderSummary,
      });
    } catch (error) {
      console.error('Error applying coupon:', error);
      res.status(500).json({
        type: 'error',
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  };
  










// export const applyCupon = async (req, res, next) => {
//     try {
//         const userId = req.user.userId;
//         const { couponCode, totalPrice } = req.body;
//         // console.log(couponCode, totalPrice)
//         // console.log(userId)
//         const code = couponCode;
//         const totalAmount = totalPrice;
//         console.log(totalAmount)

//         const finalAmount = await cuponService.applyCoupon(userId, code, totalAmount)
//         res.status(200).json({
//             type: "success",
//             message: "Cupon applied successfully",
//             data: { finalAmount }
//         });
//     } catch (error) {
//         console.error("Error applying cupon:", error);
//         res.status(500).json({
//             type: "error",
//             message: "Internal Server Error",
//             error: error.message
//         });
//     }
// };
