import axios from "axios";

const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";

const WEATHER_CODE_MAP = {
  0: "Clear",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  56: "Freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Slight rain",
  63: "Rain",
  65: "Heavy rain",
  66: "Freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snow",
  73: "Snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Rain showers",
  81: "Rain showers",
  82: "Violent rain showers",
  85: "Snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Severe thunderstorm with hail"
};

const getWeatherCondition = (code) => WEATHER_CODE_MAP[code] || "Unknown";

export const getWeatherByCoords = async (latitude, longitude) => {
  try {
    const response = await axios.get(OPEN_METEO_URL, {
      params: {
        latitude,
        longitude,
        current: "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m",
        timezone: "auto"
      },
      timeout: 10000
    });

    const current = response.data.current;
    const weatherCode = Number(current?.weather_code ?? 0);
    const temperature = Number(current?.temperature_2m ?? 28);
    const humidity = Number(current?.relative_humidity_2m ?? 60);
    const windSpeed = Number(current?.wind_speed_10m ?? 5);

    return {
      temperature: Math.round(temperature),
      humidity: Math.round(humidity),
      windSpeed,
      weatherCode,
      weatherCondition: getWeatherCondition(weatherCode),
      source: "api"
    };
  } catch (error) {
    console.error("Weather fetch error:", error.message);
    
    // Fallback to reasonable defaults
    return {
      temperature: 28,
      humidity: 60,
      windSpeed: 5,
      weatherCode: 0,
      weatherCondition: "Clear",
      source: "fallback"
    };
  }
};

// Reverse geocoding to get location details
export const getLocationDetails = async (latitude, longitude) => {
  try {
    // Using Nominatim (OpenStreetMap) - free reverse geocoding
    const response = await axios.get("https://nominatim.openstreetmap.org/reverse", {
      params: {
        lat: latitude,
        lon: longitude,
        format: "json"
      },
      headers: {
        "User-Agent": "AquaCortex/1.0"
      },
      timeout: 10000
    });

    const address = response.data.address || {};

    return {
      village: address.village || address.town || address.city || "Unknown",
      district: address.county || address.state_district || "Unknown",
      state: address.state || "Unknown",
      country: address.country || "Unknown"
    };
  } catch (error) {
    console.error("Geocoding error:", error.message);
    return {
      village: "Unknown",
      district: "Unknown",
      state: "Unknown",
      country: "Unknown"
    };
  }
};
