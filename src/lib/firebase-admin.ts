
import "server-only";

import {
  cert,
  getApp,
  getApps,
  initializeApp,
  type ServiceAccount,
} from "firebase-admin/app";

import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function getFirebaseAdminApp() {
  const existingApps = getApps();

  if (existingApps.length > 0) {
    return getApp();
  }

  const serviceAccountJson =
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (!serviceAccountJson) {
    throw new Error(
      "Missing FIREBASE_SERVICE_ACCOUNT_JSON environment variable"
    );
  }

  let serviceAccount: ServiceAccount;

  try {
    serviceAccount = JSON.parse(
      serviceAccountJson
    ) as ServiceAccount;
  } catch {
    throw new Error(
      "Invalid Firebase service account JSON"
    );
  }

  return initializeApp({
    credential: cert(serviceAccount),
  });
}

export function getAdminAuth() {
  return getAuth(getFirebaseAdminApp());
}

export function getAdminDb() {
  return getFirestore(getFirebaseAdminApp());
}
