import axios from "axios";

const BASE_URL = "http://localhost:5000/api/hardware";
const HARDWARE_STORAGE_KEY = "ww_hardware";

const getAllHardware = () => {
  const raw = localStorage.getItem(HARDWARE_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

const setAllHardware = (hardwareList) => {
  localStorage.setItem(HARDWARE_STORAGE_KEY, JSON.stringify(hardwareList));
};

export const addHardware = async (data, userId) => {
  try {
    const res = await axios.post(`${BASE_URL}/add`, { ...data, userId });
    return res.data.hardware ?? res.data;
  } catch {
    const hardware = {
      id: crypto.randomUUID(),
      userId,
      productName: data.productName.trim(),
      wellName: data.wellName.trim(),
      thingSpeakChannelId: data.thingSpeakChannelId.trim(),
      thingSpeakField: data.thingSpeakField.trim(),
      wellDepth: Number(data.wellDepth),
      wellWidth: Number(data.wellWidth),
      latitude: Number(data.latitude),
      longitude: Number(data.longitude),
      createdAt: new Date().toISOString()
    };

    const list = getAllHardware();
    list.push(hardware);
    setAllHardware(list);

    return hardware;
  }
};

export const getHardware = async (userId) => {
  try {
    const res = await axios.get(BASE_URL, { params: { userId } });
    return res.data.hardware ?? res.data;
  } catch {
    return getAllHardware().filter((item) => item.userId === userId);
  }
};

export const getHardwareById = async (hardwareId, userId) => {
  const list = await getHardware(userId);
  return list.find((item) => item.id === hardwareId) ?? null;
};
