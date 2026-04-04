import { getWeatherByCoords, getLocationDetails } from "../services/weatherService.js";
import { AppError } from "../middleware/errorMiddleware.js";

export const getWeather = async (req, res, next) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      throw new AppError("Latitude and longitude are required", 400);
    }

    const weather = await getWeatherByCoords(
      Number(latitude),
      Number(longitude)
    );

    res.status(200).json({
      success: true,
      weather
    });
  } catch (error) {
    next(error);
  }
};

export const getLocation = async (req, res, next) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      throw new AppError("Latitude and longitude are required", 400);
    }

    const location = await getLocationDetails(
      Number(latitude),
      Number(longitude)
    );

    res.status(200).json({
      success: true,
      location
    });
  } catch (error) {
    next(error);
  }
};
