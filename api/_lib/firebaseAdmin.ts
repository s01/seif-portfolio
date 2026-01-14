/**
 * Firebase Admin SDK initialization for server-side operations
 * Used in Vercel serverless functions to write to Firestore
 */

import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let adminApp: App | null = null;
let adminDb: Firestore | null = null;

/**
 * Initialize Firebase Admin SDK
 * Uses service account credentials from environment variables
 */
export function getAdminApp(): App {
    if (adminApp) {
        return adminApp;
    }

    // Check if already initialized
    const existingApps = getApps();
    if (existingApps.length > 0) {
        adminApp = existingApps[0];
        return adminApp;
    }

    // Get credentials from environment variables
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
        throw new Error(
            'Missing Firebase Admin credentials. Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY environment variables.'
        );
    }

    // Handle newline replacement in private key (Vercel env vars escape newlines)
    const formattedPrivateKey = privateKey.replace(/\\n/g, '\n');

    // Initialize admin app
    adminApp = initializeApp({
        credential: cert({
            projectId,
            clientEmail,
            privateKey: formattedPrivateKey,
        }),
    });

    return adminApp;
}

/**
 * Get Firestore instance for admin operations
 */
export function getAdminDb(): Firestore {
    if (adminDb) {
        return adminDb;
    }

    const app = getAdminApp();
    adminDb = getFirestore(app);

    return adminDb;
}
