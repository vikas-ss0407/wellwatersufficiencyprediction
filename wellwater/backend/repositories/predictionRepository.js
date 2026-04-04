import { db } from "../config/firebaseAdmin.js";

const COLLECTION = "predictions";

export const createPrediction = async (predictionData) => {
  const predictionRef = await db.collection(COLLECTION).add({
    userId: predictionData.userId,
    hardwareId: predictionData.hardwareId,
    irrigationStart: predictionData.irrigationStart,
    treeCount: predictionData.treeCount,
    litersPerTree: predictionData.litersPerTree,
    currentWaterLevel: predictionData.currentWaterLevel,
    temperature: predictionData.temperature,
    humidity: predictionData.humidity,
    isSufficient: predictionData.isSufficient,
    availableWaterL: predictionData.availableWaterL,
    requiredWaterL: predictionData.requiredWaterL,
    finalUsableWaterL: predictionData.finalUsableWaterL,
    evaporationLoss: predictionData.evaporationLoss,
    message: predictionData.message,
    createdAt: new Date().toISOString()
  });

  const doc = await predictionRef.get();
  return { id: doc.id, ...doc.data() };
};

export const getPredictionsByUserId = async (userId) => {
  const snapshot = await db
    .collection(COLLECTION)
    .where("userId", "==", userId)
    .get();

  return snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 50);
};

export const getPredictionById = async (predictionId) => {
  const doc = await db.collection(COLLECTION).doc(predictionId).get();
  if (!doc.exists) {
    return null;
  }
  return { id: doc.id, ...doc.data() };
};