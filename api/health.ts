/**
 * Vercel Serverless Function: Health Check
 * GET /api/health
 * 
 * Diagnostic endpoint to verify environment variables and Firebase Admin setup
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    try {
        // Check environment variables
        const envCheck = {
            FIREBASE_PROJECT_ID: !!process.env.FIREBASE_PROJECT_ID,
            FIREBASE_CLIENT_EMAIL: !!process.env.FIREBASE_CLIENT_EMAIL,
            FIREBASE_PRIVATE_KEY: !!process.env.FIREBASE_PRIVATE_KEY,
            ANALYTICS_API_KEY: !!process.env.ANALYTICS_API_KEY,
            IP_HASH_SALT: !!process.env.IP_HASH_SALT,
        };

        // Check if any are missing
        const missing = Object.entries(envCheck)
            .filter(([, exists]) => !exists)
            .map(([key]) => key);

        // Try to initialize Firebase Admin
        let firebaseStatus = 'not_tested';
        let firebaseError = null;

        try {
            const { getAdminDb } = await import('./_lib/firebaseAdmin.js');
            const db = getAdminDb();
            firebaseStatus = 'initialized';

            // Try a simple operation
            const testRef = db.collection('_health_check');
            firebaseStatus = 'connected';
        } catch (err) {
            firebaseStatus = 'error';
            firebaseError = err instanceof Error ? err.message : 'Unknown error';
        }

        return res.status(200).json({
            status: missing.length === 0 ? 'ok' : 'missing_env_vars',
            timestamp: new Date().toISOString(),
            environment: {
                variables: envCheck,
                missing,
            },
            firebase: {
                status: firebaseStatus,
                error: firebaseError,
            },
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
        });
    }
}
