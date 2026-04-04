// Water calculation utilities

export const calculateWellVolume = (depth, width) => {
  // Assuming cylindrical well
  const radius = width / 2;
  const volumeCubicFt = Math.PI * radius * radius * depth;
  return volumeCubicFt;
};

export const cubicFeetToLiters = (cubicFeet) => {
  return cubicFeet * 28.3168;
};

export const litersToGallons = (liters) => {
  return liters * 0.264172;
};

export const calculateCurrentWaterVolume = (currentLevel, wellWidth) => {
  const radius = wellWidth / 2;
  const volumeCubicFt = Math.PI * radius * radius * currentLevel;
  return cubicFeetToLiters(volumeCubicFt);
};

export const estimateEvaporation = (temperature, humidity, hoursUntilIrrigation) => {
  // Simplified evaporation estimation
  // Real-world would use Penman-Monteith or similar equations
  
  let baseRate = 0.1; // liters per hour base
  
  if (temperature > 35) baseRate = 0.8;
  else if (temperature > 30) baseRate = 0.5;
  else if (temperature > 25) baseRate = 0.3;
  
  // Humidity adjustment
  const humidityFactor = 1 - (humidity / 200);
  const adjustedRate = baseRate * humidityFactor;
  
  return adjustedRate * hoursUntilIrrigation;
};

export const calculateIrrigationRequirement = (treeCount, litersPerTree, treeCropFactor = 1.0) => {
  return treeCount * litersPerTree * treeCropFactor;
};
