import adminPkg from "firebase-admin";

let admin = adminPkg;
let initialized = false;

if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

  if (projectId && clientEmail && privateKey) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
        storageBucket: storageBucket || undefined,
      });
      initialized = true;
    } catch (e) {
      console.warn("firebase admin init failed", e.message);
    }
  } else {
    console.warn("Firebase admin not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY.");
  }
}

const stub = {
  firestore() {
    throw new Error(
      "Firebase Admin not initialized. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY."
    );
  },
  storage() {
    throw new Error("Firebase Admin not initialized. Set FIREBASE_STORAGE_BUCKET and credentials.");
  },
  auth() {
    throw new Error("Firebase Admin not initialized.");
  },
  apps: [],
};

export function firestore() {
  if (!initialized) throw new Error("Firebase Admin not initialized");
  return admin.firestore();
}

export default initialized ? admin : stub;
