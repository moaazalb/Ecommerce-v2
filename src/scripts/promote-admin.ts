import dotenv from "dotenv";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

dotenv.config({ path: ".env.local" });

/**
 * Promotes the specified Firebase Auth user to administrator.
 *
 * Preserves existing custom claims and adds the admin claim.
 *
 * @returns {Promise<void>}
 */
export async function promoteAdmin(): Promise<void> {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Missing Firebase Admin environment variables.");
  }

  const app =
    getApps().find((item) => item.name === "admin-script") ??
    initializeApp(
      {
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      },
      "admin-script",
    );

  const adminAuth = getAuth(app);
  const email = "mohazalbari@gmail.com";

  const user = await adminAuth.getUserByEmail(email);

  await adminAuth.setCustomUserClaims(user.uid, {
    ...user.customClaims,
    admin: true,
  });

  console.log(`Successfully promoted ${email} to administrator.`);
}

promoteAdmin().catch((error: unknown) => {
  console.error("Admin promotion failed:", error);
  process.exitCode = 1;
});
