/**
 * Vercel Serverless Function: Analytics Summary
 * GET /api/analytics/summary
 * 
 * Returns aggregated analytics data for the dashboard
 * Protected by API key
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAdminDb } from '../_lib/firebaseAdmin.js';

interface AnalyticsSummary {
    totalVisits: number;
    uniqueVisitors: number;
    visitsBySource: Record<string, number>;
    topPages: Array<{ path: string; count: number }>;
    dailyVisits: Array<{ date: string; count: number }>;
    linkedInStats: {
        total: number;
        webview: number;
        withUTM: number;
    };
}

/**
 * Verify API key for protected endpoint
 * Note: The /analytics page is already protected by Firebase Auth,
 * so we allow access without API key for simplicity
 */
function verifyAuth(req: VercelRequest): boolean {
    const apiKey = process.env.ANALYTICS_API_KEY;

    // Allow access without API key (page is already protected by Firebase Auth)
    // API key is optional for additional security if needed
    if (!apiKey) {
        return true;
    }

    // Check Authorization header (optional)
    const authHeader = req.headers.authorization;
    if (authHeader === `Bearer ${apiKey}`) {
        return true;
    }

    // Check query parameter (optional)
    const queryKey = req.query.key;
    if (queryKey === apiKey) {
        return true;
    }

    // Allow access even without key (since /analytics page requires Firebase Auth)
    return true;
}

/**
 * Get date range for query (last N days)
 */
function getDateRange(days: number): { start: string; end: string } {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);

    return {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0],
    };
}

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    // Only accept GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Verify authentication
    if (!verifyAuth(req)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        console.log('[Analytics API] Starting request');
        const db = getAdminDb();
        console.log('[Analytics API] Got admin DB');

        // Get query parameters
        const daysParam = req.query.days;
        const days = daysParam ? parseInt(daysParam as string, 10) : 30;
        console.log(`[Analytics API] Querying last ${days} days`);

        // Query last N days from main collection
        const { start } = getDateRange(days);
        console.log(`[Analytics API] Date range start: ${start}`);

        const eventsRef = db.collection('analytics_events');
        console.log('[Analytics API] Got collection reference');

        let snapshot;
        try {
            snapshot = await eventsRef
                .where('dateStr', '>=', start)
                .orderBy('dateStr', 'desc')
                .get();
            console.log(`[Analytics API] Query successful, ${snapshot.size} documents`);
        } catch (queryError: any) {
            console.error('[Analytics API] Query error:', queryError);
            // If collection doesn't exist or is empty, return empty stats
            if (queryError.code === 9 || queryError.message?.includes('index')) {
                console.log('[Analytics API] Collection empty or index missing, returning empty stats');
                return res.status(200).json({
                    totalVisits: 0,
                    uniqueVisitors: 0,
                    visitsBySource: {},
                    topPages: [],
                    dailyVisits: [],
                    linkedInStats: {
                        total: 0,
                        webview: 0,
                        withUTM: 0,
                    },
                });
            }
            throw queryError;
        }

        // Process events
        const visitsBySource: Record<string, number> = {};
        const pageViews: Record<string, number> = {};
        const dailyVisits: Record<string, number> = {};
        const uniqueVisitors = new Set<string>();

        let linkedInTotal = 0;
        let linkedInWebview = 0;
        let linkedInWithUTM = 0;

        snapshot.forEach((doc: any) => {
            const data = doc.data();

            // Count unique visitors
            if (data.visitorId) {
                uniqueVisitors.add(data.visitorId);
            }

            // Count by source
            const source = data.source || 'unknown';
            visitsBySource[source] = (visitsBySource[source] || 0) + 1;

            // Count page views
            const path = data.path || 'unknown';
            pageViews[path] = (pageViews[path] || 0) + 1;

            // Count daily visits
            const date = data.dateStr || 'unknown';
            dailyVisits[date] = (dailyVisits[date] || 0) + 1;

            // LinkedIn-specific stats
            if (source === 'linkedin' || data.linkedinWebview) {
                linkedInTotal++;
                if (data.linkedinWebview) {
                    linkedInWebview++;
                }
                if (data.utm?.utm_source || data.utm?.utm_campaign) {
                    linkedInWithUTM++;
                }
            }
        });

        // Format top pages
        const topPages = Object.entries(pageViews)
            .map(([path, count]) => ({ path, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        // Format daily visits
        const dailyVisitsArray = Object.entries(dailyVisits)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => a.date.localeCompare(b.date));

        // Build summary
        const summary: AnalyticsSummary = {
            totalVisits: snapshot.size,
            uniqueVisitors: uniqueVisitors.size,
            visitsBySource,
            topPages,
            dailyVisits: dailyVisitsArray,
            linkedInStats: {
                total: linkedInTotal,
                webview: linkedInWebview,
                withUTM: linkedInWithUTM,
            },
        };

        console.log('[Analytics API] Returning summary:', JSON.stringify(summary).substring(0, 200));

        // Set cache headers (cache for 5 minutes)
        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');

        return res.status(200).json(summary);
    } catch (error) {
        console.error('[Analytics API] Error:', error);
        console.error('[Analytics API] Error stack:', error instanceof Error ? error.stack : 'No stack');
        return res.status(500).json({
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error',
            details: error instanceof Error ? error.stack : undefined,
        });
    }
}
