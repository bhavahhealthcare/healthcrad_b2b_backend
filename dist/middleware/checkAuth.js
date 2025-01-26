import { verifyJwtToken } from "../utils/token.util.js";
import jwt from "jsonwebtoken";
import UserRepository from "../repository/user-repository.js";
const checkAuth = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({
      type: "error",
      message: "No token provided"
    });
  }
  try {
    const decodedToken = verifyJwtToken(token);
    const decodedTokenPayload = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedTokenPayload) {
      throw new Error("Unauthorized: Invalid token");
    }

    // Verify the admin status using the userId
    const userRepository = new UserRepository();
    const user = await userRepository.findById(decodedToken);
    console.log(user);
    if (!user || !user.isAdmin) {
      throw new Error("Unauthorized: Not an admin");
    }
    req.user = decodedToken;
    next();
  } catch (err) {
    res.status(401).json({
      type: "error",
      message: err.message || "Unauthorized"
    });
  }
};
export default checkAuth;