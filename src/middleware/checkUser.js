import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config.js'; // Adjust the path as necessary

const authenticate = (req, res, next) => {
    // Get the token from the request headers
    const token = req.header('Authorization')?.split(' ')[1];

    // Check if token is present
    if (!token) {
        return res.status(401).json({
            type: 'error',
            message: 'Access denied. No token provided.',
        });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log(decoded)
        // Attach the decoded token (user info) to the request object
        req.user = decoded;

        // Proceed to the next middleware/route handler
        next();
    } catch (error) {
        res.status(400).json({
            type: 'error',
            message: 'Invalid token.',
        });
    }
};

export default authenticate;
