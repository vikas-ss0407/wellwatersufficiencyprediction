import express from "express";
import { getWeather, getLocation } from "../controllers/weatherController.js";

const router = express.Router();

router.get("/", getWeather);
router.get("/location", getLocation);

export default router;
