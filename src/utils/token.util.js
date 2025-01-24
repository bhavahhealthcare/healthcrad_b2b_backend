// utils/token.util.js
import jwt from "jsonwebtoken";

import { JWT_SECRET } from "../config/config.js";

export const createJwtToken = (payload) => {
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "12h" });
  return token;
};

export const verifyJwtToken = (token, next) => {
  try {
    const { userId } = jwt.verify(token, JWT_SECRET);
    return userId;
  } catch (err) {
    next(err);
  }
};
