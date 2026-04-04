import {
  createWell,
  getWellsByUserId,
  getWellById,
  updateWell,
  deleteWell
} from "../repositories/hardwareRepository.js";
import {
  fetchThingSpeakLastReading,
  fetchThingSpeakHistory
} from "../services/thingSpeakService.js";
import { AppError } from "../middleware/errorMiddleware.js";

const ALLOWED_UPDATE_FIELDS = new Set([
  "productName",
  "wellName",
  "thingSpeakChannelId",
  "thingSpeakReadApiKey",
  "thingSpeakField",
  "wellDepth",
  "wellWidth",
  "latitude",
  "longitude"
]);

const sanitizeHardwareUpdates = (updates) => {
  const incoming = updates && typeof updates === "object" ? updates : {};
  const sanitized = {};

  for (const [key, value] of Object.entries(incoming)) {
    if (!ALLOWED_UPDATE_FIELDS.has(key)) {
      continue;
    }

    if (key === "productName" || key === "wellName") {
      const trimmed = String(value || "").trim();
      if (!trimmed) {
        throw new AppError(`${key} cannot be empty`, 400);
      }
      sanitized[key] = trimmed;
      continue;
    }

    if (key === "thingSpeakReadApiKey") {
      sanitized[key] = String(value || "").trim();
      continue;
    }

    if (key === "thingSpeakChannelId") {
      const parsed = Number(value);
      if (!Number.isInteger(parsed) || parsed <= 0) {
        throw new AppError("ThingSpeak Channel ID must be a positive integer", 400);
      }
      sanitized[key] = String(parsed);
      continue;
    }

    if (key === "thingSpeakField") {
      const parsed = Number(value);
      if (!Number.isInteger(parsed) || parsed < 1 || parsed > 8) {
        throw new AppError("ThingSpeak Field must be a number between 1 and 8", 400);
      }
      sanitized[key] = String(parsed);
      continue;
    }

    if (key === "wellDepth" || key === "wellWidth") {
      const parsed = Number(value);
      if (!Number.isFinite(parsed) || parsed <= 0) {
        throw new AppError(`${key} must be a number greater than 0`, 400);
      }
      sanitized[key] = parsed;
      continue;
    }

    if (key === "latitude" || key === "longitude") {
      const parsed = Number(value);
      if (!Number.isFinite(parsed)) {
        throw new AppError(`${key} must be a valid number`, 400);
      }
      sanitized[key] = parsed;
    }
  }

  if (Object.keys(sanitized).length === 0) {
    throw new AppError("No valid fields provided for update", 400);
  }

  return sanitized;
};

const withSensorData = async (hardware) => {
  const channelId = hardware?.thingSpeakChannelId;
  const field = hardware?.thingSpeakField;

  if (!channelId || !field) {
    return {
      ...hardware,
      sensor: {
        on: false,
        latestValue: null,
        lastUpdatedAt: null,
        status: "not_configured"
      }
    };
  }

  const reading = await fetchThingSpeakLastReading(
    channelId,
    field,
    hardware?.thingSpeakReadApiKey
  );

  return {
    ...hardware,
    sensor: {
      on: reading.sensorOn,
      latestValue: reading.value,
      lastUpdatedAt: reading.timestamp,
      status: reading.error ? "unavailable" : "ok"
    }
  };
};

export const addHardware = async (req, res, next) => {
  try {
    const {
      userId,
      productName,
      wellName,
      thingSpeakChannelId,
      thingSpeakReadApiKey,
      thingSpeakField,
      wellDepth,
      wellWidth,
      latitude,
      longitude
    } = req.body;

    // Validation
    if (!userId || !productName || !wellName || !thingSpeakChannelId || !thingSpeakField) {
      throw new AppError("Missing required fields", 400);
    }

    const parsedChannelId = Number(thingSpeakChannelId);
    const parsedField = Number(thingSpeakField);
    if (!Number.isInteger(parsedChannelId) || parsedChannelId <= 0) {
      throw new AppError("ThingSpeak Channel ID must be a positive integer", 400);
    }

    if (!Number.isInteger(parsedField) || parsedField < 1 || parsedField > 8) {
      throw new AppError("ThingSpeak Field must be a number between 1 and 8", 400);
    }

    if (!wellDepth || !wellWidth || !latitude || !longitude) {
      throw new AppError("Missing well dimensions or location", 400);
    }

    const hardware = await createWell({
      userId,
      productName: productName.trim(),
      wellName: wellName.trim(),
      thingSpeakChannelId: String(parsedChannelId),
      thingSpeakReadApiKey: (thingSpeakReadApiKey || "").trim(),
      thingSpeakField: String(parsedField),
      wellDepth: Number(wellDepth),
      wellWidth: Number(wellWidth),
      latitude: Number(latitude),
      longitude: Number(longitude)
    });

    res.status(201).json({
      success: true,
      message: "Hardware added successfully",
      hardware
    });
  } catch (error) {
    next(error);
  }
};

export const getHardware = async (req, res, next) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      throw new AppError("User ID is required", 400);
    }

    const hardware = await getWellsByUserId(userId);
    const hardwareWithSensor = await Promise.all(hardware.map(withSensorData));

    res.status(200).json({
      success: true,
      count: hardwareWithSensor.length,
      hardware: hardwareWithSensor
    });
  } catch (error) {
    next(error);
  }
};

export const getHardwareById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const hardware = await getWellById(id);

    if (!hardware) {
      throw new AppError("Hardware not found", 404);
    }

    const hardwareWithSensor = await withSensorData(hardware);

    res.status(200).json({
      success: true,
      hardware: hardwareWithSensor
    });
  } catch (error) {
    next(error);
  }
};

export const getHardwareSensorStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { results = 12 } = req.query;

    const hardware = await getWellById(id);
    if (!hardware) {
      throw new AppError("Hardware not found", 404);
    }

    const latest = await fetchThingSpeakLastReading(
      hardware.thingSpeakChannelId,
      hardware.thingSpeakField,
      hardware.thingSpeakReadApiKey
    );

    const cappedResults = Math.min(30, Math.max(1, Number(results) || 12));
    const history = await fetchThingSpeakHistory(
      hardware.thingSpeakChannelId,
      hardware.thingSpeakField,
      hardware.thingSpeakReadApiKey,
      cappedResults
    );

    res.status(200).json({
      success: true,
      hardwareId: id,
      sensor: {
        on: latest.sensorOn,
        status: latest.error ? "unavailable" : "ok",
        latestValue: latest.value,
        lastUpdatedAt: latest.timestamp,
        history
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateHardwareById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = sanitizeHardwareUpdates(req.body);

    const hardware = await getWellById(id);
    if (!hardware) {
      throw new AppError("Hardware not found", 404);
    }

    await updateWell(id, updates);
    const updated = await getWellById(id);
    const updatedWithSensor = await withSensorData(updated);

    res.status(200).json({
      success: true,
      message: "Hardware updated successfully",
      hardware: updatedWithSensor
    });
  } catch (error) {
    next(error);
  }
};

export const deleteHardwareById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const hardware = await getWellById(id);
    if (!hardware) {
      throw new AppError("Hardware not found", 404);
    }

    await deleteWell(id);

    res.status(200).json({
      success: true,
      message: "Hardware deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};
