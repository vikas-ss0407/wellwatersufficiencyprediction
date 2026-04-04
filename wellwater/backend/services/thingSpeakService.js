import axios from "axios";
import { AppError } from "../middleware/errorMiddleware.js";

const THINGSPEAK_BASE = "https://api.thingspeak.com/channels";
const SENSOR_STALE_SECONDS = Number(process.env.SENSOR_STALE_SECONDS || 90);
const SENSOR_STALE_MS = Number.isFinite(SENSOR_STALE_SECONDS) && SENSOR_STALE_SECONDS > 0
  ? SENSOR_STALE_SECONDS * 1000
  : 90 * 1000;
const ENABLE_THINGSPEAK_DEBUG_LOGS = process.env.ENABLE_THINGSPEAK_DEBUG_LOGS === "true";

export const fetchThingSpeakData = async (channelId, field, readApiKey) => {
  try {
    const url = `${THINGSPEAK_BASE}/${channelId}/fields/${field}/last.json`;
    const params = readApiKey ? { api_key: readApiKey } : {};

    const response = await axios.get(url, { params, timeout: 10000 });
    
    const fieldValue = response.data[`field${field}`];
    return Number(fieldValue) || 0;
  } catch (error) {
    const status = error?.response?.status;
    const errorMessage = error?.response?.data || error?.message;
    console.error("ThingSpeak fetch error:", status || "NO_STATUS", errorMessage);

    if (status === 404) {
      throw new AppError(
        "ThingSpeak channel or field not found. Verify Channel ID and Field number.",
        400
      );
    }

    if (status === 401 || status === 403) {
      throw new AppError(
        "ThingSpeak API key is invalid or does not have read access.",
        400
      );
    }

    if (error?.code === "ECONNABORTED") {
      throw new AppError("ThingSpeak request timed out. Please try again.", 504);
    }

    throw new AppError("Failed to fetch ThingSpeak data", 502);
  }
};

export const fetchThingSpeakLastReading = async (channelId, field, readApiKey) => {
  try {
    const url = `${THINGSPEAK_BASE}/${channelId}/feeds/last.json`;
    const params = readApiKey ? { api_key: readApiKey } : {};
    const response = await axios.get(url, { params, timeout: 10000 });

    const fieldValue = response.data?.[`field${field}`];
    const numericValue = Number(fieldValue);
    const hasValue = fieldValue !== null && fieldValue !== undefined && fieldValue !== "";

    const timestamp = response.data?.created_at || null;
    const readingTime = timestamp ? new Date(timestamp).getTime() : null;
    const isRecent = Number.isFinite(readingTime)
      ? Date.now() - readingTime <= SENSOR_STALE_MS
      : false;

    return {
      value: hasValue ? (Number.isNaN(numericValue) ? null : numericValue) : null,
      timestamp,
      sensorOn: hasValue && isRecent,
      error: null
    };
  } catch (error) {
    const status = error?.response?.status;
    const errorMessage = error?.response?.data || error?.message;
    if (ENABLE_THINGSPEAK_DEBUG_LOGS) {
      console.error("ThingSpeak last reading fetch error:", status || "NO_STATUS", errorMessage);
    }

    return {
      value: null,
      timestamp: null,
      sensorOn: false,
      error: "unavailable"
    };
  }
};

export const fetchThingSpeakHistory = async (channelId, field, readApiKey, results = 10) => {
  try {
    const url = `${THINGSPEAK_BASE}/${channelId}/fields/${field}.json`;
    const params = {
      results,
      ...(readApiKey && { api_key: readApiKey })
    };

    const response = await axios.get(url, { params, timeout: 10000 });
    
    if (!response.data.feeds) {
      return [];
    }

    return response.data.feeds.map((feed) => ({
      timestamp: feed.created_at,
      value: Number(feed[`field${field}`]) || 0
    }));
  } catch (error) {
    console.error("ThingSpeak history fetch error:", error.message);
    return [];
  }
};
