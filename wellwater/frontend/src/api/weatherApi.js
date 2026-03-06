import axios from "axios";

const API_KEY = "YOUR_OPENWEATHER_API_KEY";
const NOMINATIM_BASE = "https://nominatim.openstreetmap.org/reverse";

export const getWeatherByCity = async (city) => {
  const res = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
  );

  return res.data;
};

export const getWeatherByCoords = async (lat, lon) => {
  try {
    const res = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    return {
      temperature: res.data.main.temp,
      humidity: res.data.main.humidity,
      location: res.data.name,
      weatherCondition: res.data.weather[0]?.main || "Clear"
    };
  } catch {
    // Fallback weather data when API is unavailable
    return {
      temperature: 28,
      humidity: 65,
      location: "Unknown Location",
      weatherCondition: "Clear"
    };
  }
};

export const getLocationDetailsByCoords = async (lat, lon) => {
  try {
    const res = await axios.get(NOMINATIM_BASE, {
      params: {
        format: "jsonv2",
        lat,
        lon,
        zoom: 18,
        addressdetails: 1
      },
      headers: {
        Accept: "application/json"
      }
    });

    const address = res.data.address || {};

    return {
      village:
        address.village || address.town || address.city || address.hamlet || "Unknown",
      district: address.county || address.state_district || "Unknown",
      state: address.state || "Unknown",
      country: address.country || "Unknown",
      postcode: address.postcode || "N/A",
      displayName: res.data.display_name || "Unknown location"
    };
  } catch {
    return {
      village: "Unknown",
      district: "Unknown",
      state: "Unknown",
      country: "Unknown",
      postcode: "N/A",
      displayName: "Unable to fetch location details"
    };
  }
};