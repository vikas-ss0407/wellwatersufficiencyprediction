import { db } from "../config/firebaseAdmin.js";

const COLLECTION = "hardware";

export const createWell = async (wellData) => {
  const wellRef = await db.collection(COLLECTION).add({
    userId: wellData.userId,
    productName: wellData.productName,
    wellName: wellData.wellName,
    thingSpeakChannelId: wellData.thingSpeakChannelId,
    thingSpeakReadApiKey: wellData.thingSpeakReadApiKey || "",
    thingSpeakField: wellData.thingSpeakField,
    wellDepth: wellData.wellDepth,
    wellWidth: wellData.wellWidth,
    latitude: wellData.latitude,
    longitude: wellData.longitude,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const doc = await wellRef.get();
  return { id: doc.id, ...doc.data() };
};

export const getWellsByUserId = async (userId) => {
  const snapshot = await db
    .collection(COLLECTION)
    .where("userId", "==", userId)
    .get();

  return snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
};

export const getWellById = async (wellId) => {
  const doc = await db.collection(COLLECTION).doc(wellId).get();
  if (!doc.exists) {
    return null;
  }
  return { id: doc.id, ...doc.data() };
};

export const updateWell = async (wellId, updates) => {
  await db.collection(COLLECTION).doc(wellId).update({
    ...updates,
    updatedAt: new Date().toISOString()
  });
};

export const deleteWell = async (wellId) => {
  await db.collection(COLLECTION).doc(wellId).delete();
};