import { db } from "../config/firebaseAdmin.js";

const COLLECTION = "users";

export const createUser = async (userData) => {
  const userRef = db.collection(COLLECTION).doc(userData.uid);
  await userRef.set({
    uid: userData.uid,
    email: userData.email,
    fullName: userData.fullName || "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  return userRef.id;
};

export const getUserById = async (uid) => {
  const userDoc = await db.collection(COLLECTION).doc(uid).get();
  if (!userDoc.exists) {
    return null;
  }
  return { id: userDoc.id, ...userDoc.data() };
};

export const updateUser = async (uid, updates) => {
  await db.collection(COLLECTION).doc(uid).update({
    ...updates,
    updatedAt: new Date().toISOString()
  });
};