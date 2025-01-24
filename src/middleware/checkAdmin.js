import UserRepository from "../repository/user-repository.js";

const checkAdmin = async (req, res, next) => {
  
  try {
    const  userId  = req.user; // Ensure req.user is set by your authentication middleware
    if (!userId) {
      return res.status(400).json({ type: "error", message: "User ID is missing" });
    }

    const userRepository = new UserRepository();
    const user = await userRepository.findById(userId);

    if (!user || !user.isAdmin) {
      return res.status(403).json({ type: "error", message: "Access denied" });
    }

    next();
  } catch (error) {
    console.error("Error in checkAdmin middleware:", error.message);
    res.status(500).json({ type: "error", message: "Internal server error", error: error.message });
  }
};


export default checkAdmin


// import jwt from "jsonwebtoken";
// import UserRepository from "../repository/user-repository.js";

// const checkAdmin = async (req, res, next) => {
//   const token = req.header("Authorization")?.replace("Bearer ", "");

//   if (!token) {
//     return res.status(401).json({ type: "error", message: "No token provided" });
//   }

//   try {
//     const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
//     const { userId } = decodedToken;

//     if (!userId) {
//       return res.status(400).json({ type: "error", message: "User ID is missing" });
//     }

//     const userRepository = new UserRepository();
//     const user = await userRepository.findById(userId);

//     if (!user || !user.isAdmin) {
//       return res.status(403).json({ type: "error", message: "Access denied" });
//     }

//     req.user = decodedToken;
//     next();
//   } catch (error) {
//     console.error("Error in checkAdmin middleware:", error.message);
//     res.status(500).json({ type: "error", message: "Internal server error", error: error.message });
//   }
// };

// export default checkAdmin;
