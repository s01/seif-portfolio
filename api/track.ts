/**
 * Vercel Serverless Function: Track page views
 * POST /api/track
 * 
 * Receives tracking data from client and stores in Firestore
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAdminDb } from './_lib/firebaseAdmin.js';
import { createHash } from 'crypto';

interface TrackingPayload {
    ts: number;
    path: string;
    source: string;
    refDomain: string;
    utm: {
        utm_source?: string;
        utm_medium?: string;
        utm_campaign?: string;
        utm_content?: string;
        utm_term?: string;
    };
    linkedinWebview: boolean;
    visitorId: string;
    firstTouch?: {
        source: string;
        refDomain: string;
        utm: Record<string, string>;
        timestamp: number;
        expiresAt: number;
    };
}

/**
 * Hash IP address for privacy
 */
function hashIP(ip: string): string {
    const salt = process.env.IP_HASH_SALT || 'default-salt-change-me';
    return createHash('sha256')
        .update(ip + salt)
        .digest('hex')
        .substring(0, 16); // Truncate for storage efficiency
}

/**
 * Get client IP from request
 */
function getClientIP(req: VercelRequest): string {
    // Vercel provides IP in headers
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
        return forwarded.split(',')[0].trim();
    }
    if (Array.isArray(forwarded) && forwarded.length > 0) {
        return forwarded[0];
    }
    const realIp = req.headers['x-real-ip'];
    if (typeof realIp === 'string') {
        return realIp;
    }
    return 'unknown';
}

/**
 * Get date string for partitioning (YYYY-MM-DD)
 */
function getDateString(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toISOString().split('T')[0];
}

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    // Only accept POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const payload: TrackingPayload = req.body;

        // Validate payload
        if (!payload || !payload.path || !payload.source) {
            return res.status(400).json({ error: 'Invalid payload' });
        }

        // Get server-side data
        const clientIP = getClientIP(req);
        const ipHash = hashIP(clientIP);
        const receivedAt = Date.now();
        const dateStr = getDateString(payload.ts);
        const userAgent = req.headers['user-agent'] || '';

        // Prepare document for Firestore
        const eventDoc = {
            // Client data
            ts: payload.ts,
            path: payload.path,
            source: payload.source,
            refDomain: payload.refDomain,
            utm: payload.utm,
            linkedinWebview: payload.linkedinWebview,
            visitorId: payload.visitorId,
            firstTouch: payload.firstTouch || null,

            // Server data
            receivedAt,
            dateStr,
            ipHash,
            userAgent,

            // Metadata
            createdAt: new Date(),
        };

        // Write to Firestore
        const db = getAdminDb();

        // Use date-partitioned collection for better query performance
        // Collection name: analytics_events_YYYY_MM_DD
        const collectionName = `analytics_events_${dateStr.replace(/-/g, '_')}`;

        await db.collection(collectionName).add(eventDoc);

        // Also add to main collection for cross-day queries
        await db.collection('analytics_events').add(eventDoc);

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('[Track API] Error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
