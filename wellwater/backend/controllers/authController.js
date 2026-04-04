import { createUser, getUserById } from "../repositories/userRepository.js";
import { AppError } from "../middleware/errorMiddleware.js";

export const register = async (req, res, next) => {
  try {
    const { uid, email, fullName } = req.body;

    if (!uid || !email) {
      throw new AppError("UID and email are required", 400);
    }

    // Check if user already exists
    const existingUser = await getUserById(uid);
    if (existingUser) {
      return res.status(200).json({
        success: true,
        message: "User already registered",
        user: existingUser
      });
    }

    // Create new user
    await createUser({ uid, email, fullName });
    const user = await getUserById(uid);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await getUserById(req.user.uid);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};
