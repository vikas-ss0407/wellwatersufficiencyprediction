import { auth } from "../config/firebaseAdmin.js";
import { AppError } from "./errorMiddleware.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("No token provided", 401);
    }

    const token = authHeader.split(" ")[1];

    try {
      const decodedToken = await auth.verifyIdToken(token);
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email
      };
      next();
    } catch (error) {
      throw new AppError("Invalid or expired token", 401);
    }
  } catch (error) {
    next(error);
  }
};
