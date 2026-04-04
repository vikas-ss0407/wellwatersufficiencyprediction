import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

const projectId = process.env.FIREBASE_PROJECT_ID || "wellwatersufficiencyprediction";
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

const hasEnvServiceAccount = Boolean(clientEmail && privateKey);
const hasManagedIdentity = Boolean(
  process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    process.env.K_SERVICE ||
    process.env.FUNCTION_TARGET ||
    process.env.GOOGLE_CLOUD_PROJECT
);
export const isFirebaseCredentialed = hasEnvServiceAccount || hasManagedIdentity;

if (!admin.apps.length) {
  if (hasEnvServiceAccount) {
    // Recommended for non-GCP hosting: set secrets as env vars, no JSON file on disk.
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey
      }),
      projectId
    });
    console.log("[Firebase Admin] Initialized with env service account credentials.");
  } else if (hasManagedIdentity) {
    // Recommended for GCP hosting (Cloud Run, Functions, GKE): use attached identity.
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId
    });
    console.log("[Firebase Admin] Initialized with application default credentials.");
  } else {
    // This mode can verify some config but Firestore calls may fail without credentials.
    admin.initializeApp({ projectId });
    console.warn(
      "[Firebase Admin] No credentials detected. Set FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY, or deploy with managed identity."
    );
  }
}

export const db = admin.firestore();
export const auth = admin.auth();

export default admin;
