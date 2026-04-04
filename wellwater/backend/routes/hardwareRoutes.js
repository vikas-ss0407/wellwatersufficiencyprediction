import express from "express";
import {
  addHardware,
  getHardware,
  getHardwareById,
  getHardwareSensorStatus,
  updateHardwareById,
  deleteHardwareById
} from "../controllers/hardwareController.js";

const router = express.Router();

router.post("/add", addHardware);
router.get("/", getHardware);
router.get("/:id", getHardwareById);
router.get("/:id/sensor-status", getHardwareSensorStatus);
router.put("/:id", updateHardwareById);
router.delete("/:id", deleteHardwareById);

export default router;
