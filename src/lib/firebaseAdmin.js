import admin from "firebase-admin";

/**
 * Firebase Admin bootstrap (server only).
 *
 * Required env vars:
 *   FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
 * Optional:
 *   FIREBASE_STORAGE_BUCKET
 *
 * Exports (kept backwards compatible with the AI chat routes):
 *   default            -> the firebase-admin namespace (or a throwing stub when not configured)
 *   firestore()        -> Firestore instance, throws FirebaseNotConfiguredError when not configured
 *   isFirebaseConfigured() -> boolean
 */

export class FirebaseNotConfiguredError extends Error {
  constructor(message = "Firebase Admin is not configured.") {
    super(message);
    this.name = "FirebaseNotConfiguredError";
  }
}

function readCredentials() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.trim()
        .replace(/^"|"$/g, "")
        .replace(/\\n/g, "\n")
    : "";

  if (!projectId || !clientEmail || !privateKey) return null;
  return { projectId, clientEmail, privateKey };
}

function initialize() {
  if (admin.apps.length > 0) return true;

  const credentials = readCredentials();
  if (!credentials) {
    console.warn(
      "[firebase-admin] Not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY."
    );
    return false;
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert(credentials),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || undefined,
    });
    return true;
  } catch (error) {
    console.error("[firebase-admin] Initialization failed:", error.message);
    return false;
  }
}

const initialized = initialize();

const notConfigured = () => {
  throw new FirebaseNotConfiguredError();
};

const stub = {
  firestore: notConfigured,
  storage: notConfigured,
  auth: notConfigured,
  apps: [],
};

export function isFirebaseConfigured() {
  return initialized;
}

export function firestore() {
  if (!initialized) throw new FirebaseNotConfiguredError();
  return admin.firestore();
}

export default initialized ? admin : stub;