import { createPrediction } from "../repositories/predictionRepository.js";
import { fetchThingSpeakData } from "../services/thingSpeakService.js";
import { getWeatherByCoords } from "../services/weatherService.js";
import { getPredictionFromAI } from "../services/aiService.js";
import { AppError } from "../middleware/errorMiddleware.js";

export const getPrediction = async (req, res, next) => {
  try {
    const {
      userId,
      hardwareId,
      thingSpeakChannelId,
      thingSpeakReadApiKey,
      thingSpeakField,
      wellDepth,
      wellWidth,
      latitude,
      longitude,
      currentWaterLevel: manualCurrentWaterLevel,
      irrigationStart,
      treeCount,
      litersPerTree
    } = req.body;

    const warnings = [];

    // Validation
    if (!irrigationStart) {
      throw new AppError("Irrigation start date/time is required", 400);
    }

    if (!Number.isFinite(Number(treeCount)) || Number(treeCount) <= 0) {
      throw new AppError("Tree count must be a number greater than 0", 400);
    }

    if (!Number.isFinite(Number(litersPerTree)) || Number(litersPerTree) <= 0) {
      throw new AppError("Liters per tree must be a number greater than 0", 400);
    }

    if (!thingSpeakChannelId || !thingSpeakField) {
      throw new AppError("Missing ThingSpeak configuration", 400);
    }

    if (!Number.isFinite(Number(wellDepth)) || Number(wellDepth) <= 0) {
      throw new AppError("Well depth must be a number greater than 0", 400);
    }

    if (!Number.isFinite(Number(wellWidth)) || Number(wellWidth) <= 0) {
      throw new AppError("Well width must be a number greater than 0", 400);
    }

    // Fetch current water level from ThingSpeak; if unavailable, continue with fallback.
    let currentWaterLevel;
    let waterLevelSource = "thingspeak";
    try {
      currentWaterLevel = await fetchThingSpeakData(
        thingSpeakChannelId,
        thingSpeakField,
        thingSpeakReadApiKey
      );
    } catch (thingSpeakError) {
      const fallbackLevel = Number(manualCurrentWaterLevel);
      currentWaterLevel = Number.isFinite(fallbackLevel) && fallbackLevel >= 0 ? fallbackLevel : 0;
      waterLevelSource = "fallback";
      warnings.push(
        "ThingSpeak data unavailable. Used fallback current water level for this prediction."
      );
      console.warn("Prediction fallback to manual/default water level:", thingSpeakError?.message);
    }

    // Fetch weather data
    const weather = await getWeatherByCoords(latitude, longitude);
    if (weather?.source === "fallback") {
      warnings.push("Weather API unavailable. Used default weather values for prediction.");
    }

    // Prepare data for AI model
    const predictionInput = {
      currentWaterLevel,
      wellDepth: Number(wellDepth),
      wellWidth: Number(wellWidth),
      temperature: weather.temperature,
      humidity: weather.humidity,
      irrigationStart,
      treeCount: Number(treeCount),
      litersPerTree: Number(litersPerTree)
    };

    // Get prediction from AI model (with fallback)
    const result = await getPredictionFromAI(predictionInput);

    // Save prediction to database (optional)
    if (userId && hardwareId) {
      await createPrediction({
        userId,
        hardwareId,
        ...predictionInput,
        ...result
      });
    }

    res.status(200).json({
      success: true,
      warnings,
      waterLevelSource,
      weatherSource: weather?.source || "api",
      currentWaterLevel,
      ...result
    });
  } catch (error) {
    next(error);
  }
};
