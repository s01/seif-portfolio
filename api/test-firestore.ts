/**
 * Simple test endpoint to verify Firestore read access
 * GET /api/test-firestore
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAdminDb } from './_lib/firebaseAdmin.js';

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    try {
        console.log('[Test] Getting admin DB');
        const db = getAdminDb();

        console.log('[Test] Listing collections');
        const collections = await db.listCollections();
        const collectionNames = collections.map(col => col.id);

        console.log('[Test] Collections found:', collectionNames);

        // Try to read from analytics_events
        console.log('[Test] Attempting to read analytics_events');
        const eventsRef = db.collection('analytics_events');
        const snapshot = await eventsRef.limit(1).get();

        console.log('[Test] Query successful, size:', snapshot.size);

        return res.status(200).json({
            success: true,
            collections: collectionNames,
            analyticsEventsExists: collectionNames.includes('analytics_events'),
            documentCount: snapshot.size,
            message: 'Firestore access working!',
        });
    } catch (error) {
        console.error('[Test] Error:', error);
        return res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
        });
    }
}
