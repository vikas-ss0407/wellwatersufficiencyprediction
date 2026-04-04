import axios from "axios";

const AI_MODEL_URL = process.env.AI_MODEL_URL || "http://127.0.0.1:5001";

const isLocalhostUrl = (url) => /localhost/i.test(url);

export const getPredictionFromAI = async (features) => {
  try {
    const requestConfig = {
      timeout: 15000,
      headers: {
        "Content-Type": "application/json"
      }
    };

    const primaryUrl = `${AI_MODEL_URL}/predict`;
    const response = await axios.post(primaryUrl, features, requestConfig);

    return response.data;
  } catch (error) {
    const shouldRetryOnIPv4 =
      isLocalhostUrl(AI_MODEL_URL) &&
      error?.code === "ECONNREFUSED";

    if (shouldRetryOnIPv4) {
      try {
        const fallbackUrl = `${AI_MODEL_URL.replace(/localhost/gi, "127.0.0.1")}/predict`;
        const fallbackResponse = await axios.post(fallbackUrl, features, {
          timeout: 15000,
          headers: {
            "Content-Type": "application/json"
          }
        });

        return fallbackResponse.data;
      } catch (fallbackError) {
        console.error("AI Model service error:", fallbackError.message);
      }
    } else {
      console.error("AI Model service error:", error.message);
    }
    
    // Fallback to rule-based calculation if AI model is unavailable
    return calculateFallbackPrediction(features);
  }
};

// Fallback calculation logic (same as frontend)
const calculateFallbackPrediction = (data) => {
  const {
    currentWaterLevel,
    wellDepth,
    wellWidth,
    temperature,
    humidity,
    irrigationStart,
    treeCount,
    litersPerTree
  } = data;

  const irrigationDate = new Date(irrigationStart);
  const now = new Date();
  const hoursUntilIrrigation = Math.max(0, (irrigationDate - now) / (1000 * 60 * 60));

  // Convert sensor distance from CM to FT and calculate actual water height
  // currentWaterLevel from ThingSpeak is sensor distance in CM
  const sensorDistanceFt = currentWaterLevel / 30.48; // Convert CM to FT
  const waterHeightFt = Math.max(0, wellDepth - sensorDistanceFt); // Actual water depth in well

  // Calculate available water (corrected water height)
  const wellVolumeCubicFt = wellDepth * wellWidth * wellWidth * Math.PI / 4;
  const currentWaterVolumeCubicFt = waterHeightFt * wellWidth * wellWidth * Math.PI / 4;
  const availableWaterL = currentWaterVolumeCubicFt * 28.3168; // cubic ft to liters

  // Estimate evaporation based on temperature
  const evaporationRateEstimate = temperature > 30 ? 0.5 : temperature > 25 ? 0.3 : 0.1;
  const evaporationLoss = evaporationRateEstimate * hoursUntilIrrigation;
  
  // Leakage estimation (proportional to well dimensions)
  const leakageRateEstimate = (wellDepth * 0.05 + wellWidth * 0.02); // L/hour
  const leakageLoss = leakageRateEstimate * hoursUntilIrrigation;

  // Calculate required water
  const requiredWaterL = treeCount * litersPerTree;

  // Safety margin (10% of required)
  const safetyWaterL = requiredWaterL * 0.1;

  // Final usable water
  const finalUsableWaterL = Math.max(0, availableWaterL - evaporationLoss - leakageLoss - safetyWaterL);

  const isSufficient = finalUsableWaterL >= requiredWaterL;

  return {
    isSufficient,
    currentWaterLevel,
    temperature,
    humidity,
    availableWaterL: Math.round(availableWaterL),
    requiredWaterL: Math.round(requiredWaterL),
    finalUsableWaterL: Math.round(finalUsableWaterL),
    safetyWaterL: Math.round(safetyWaterL),
    evaporationLoss: Math.round(evaporationLoss),
    leakageLoss: Math.round(leakageLoss),
    hoursUntilIrrigation: hoursUntilIrrigation.toFixed(1),
    message: isSufficient
      ? `Water is sufficient for ${treeCount} tree(s).`
      : "Water is not sufficient. Turn on bore motor.",
    irrigationStart,
    treeCount
  };
};
