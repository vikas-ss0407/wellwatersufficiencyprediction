// Season calculator based on month and hemisphere
export const getSeason = (month, latitude) => {
  const isNorthern = latitude >= 0;
  
  // Northern hemisphere seasons
  if (isNorthern) {
    if (month >= 3 && month <= 5) return "Spring";
    if (month >= 6 && month <= 8) return "Summer";
    if (month >= 9 && month <= 11) return "Autumn";
    return "Winter";
  }
  
  // Southern hemisphere (opposite)
  if (month >= 3 && month <= 5) return "Autumn";
  if (month >= 6 && month <= 8) return "Winter";
  if (month >= 9 && month <= 11) return "Spring";
  return "Summer";
};

export const getMonthName = (month) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return months[month] || "Unknown";
};
