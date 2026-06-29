import { initializeApp, cert } from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

const paths = [
  process.env.SERVICE_ACCOUNT_PATH,
  "../serviceAccount.json",
  "./serviceAccount.json",
].filter(Boolean);

const serviceAccountPath = paths.find((p) => existsSync(resolve(p)));

if (!serviceAccountPath) {
  console.error(
    "serviceAccount.json not found. Place it in the project root or set SERVICE_ACCOUNT_PATH env."
  );
  process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(resolve(serviceAccountPath), "utf-8"));

initializeApp({
  credential: cert(serviceAccount),
});

const adminAuth = getAuth();

export default adminAuth;
