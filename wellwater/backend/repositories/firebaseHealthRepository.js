import { db } from "../config/firebaseAdmin.js";

export const checkFirestoreHealth = async () => {
  await db.collection("_health").limit(1).get();
};