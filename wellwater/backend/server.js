import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import hardwareRoutes from "./routes/hardwareRoutes.js";
import predictionRoutes from "./routes/predictionRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";
import { isFirebaseCredentialed } from "./config/firebaseAdmin.js";
import { checkFirestoreHealth } from "./repositories/firebaseHealthRepository.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "AquaCortex Backend API",
    version: "1.0.0",
    status: "operational"
  });
});

app.get("/api/health/firebase", async (req, res) => {
  if (!isFirebaseCredentialed) {
    return res.status(200).json({
      connected: false,
      message: "Firebase not connected",
      reason: "Missing server credentials"
    });
  }

  try {
    // A lightweight read confirms Firestore auth + connectivity.
    await checkFirestoreHealth();
    res.status(200).json({
      connected: true,
      message: "Firebase connected"
    });
  } catch (error) {
    res.status(200).json({
      connected: false,
      message: "Firebase not connected",
      reason: error?.message || "Unknown error"
    });
  }
});

const requireFirebaseCredentials = (req, res, next) => {
  if (!isFirebaseCredentialed) {
    return res.status(503).json({
      success: false,
      message: "Firebase server credentials are not configured.",
      code: "FIREBASE_CREDENTIALS_MISSING"
    });
  }
  next();
};

// Routes
app.use("/api/auth", requireFirebaseCredentials, authRoutes);
app.use("/api/hardware", requireFirebaseCredentials, hardwareRoutes);
app.use("/api/prediction", requireFirebaseCredentials, predictionRoutes);
app.use("/api/weather", weatherRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
});

export default app;
