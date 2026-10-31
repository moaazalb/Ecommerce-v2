import "server-only";

import {
  cert,
  getApps,
  initializeApp,
  type App,
} from "firebase-admin/app";

import { getAuth } from "firebase-admin/auth";

/**
 * Initializes Firebase Admin SDK using private environment variables.
 *
 * @returns {App} The initialized Firebase Admin application.
 */
function initializeFirebaseAdmin(): App {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Missing Firebase Admin environment variables.");
  }

  const existingApp = getApps().find((app) => app.name === "admin");

  return (
    existingApp ??
    initializeApp(
      {
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      },
      "admin"
    )
  );
}

const adminApp = initializeFirebaseAdmin();

export const adminAuth = getAuth(adminApp);