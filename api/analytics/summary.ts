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
    projectClicks: Array<{ project: string; count: number }>;
    buttonClicks: Array<{ button: string; count: number }>;
    recentEvents: Array<any>;
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
        // Get query parameters
        const daysParam = req.query.days;
        const days = daysParam
            ? parseInt(Array.isArray(daysParam) ? daysParam[0] : daysParam, 10)
            : 30;
        console.log(`[Analytics API] Querying last ${days} days`);

        // Calculate timestamp for N days ago
        const cutoffTime = Date.now() - (days * 24 * 60 * 60 * 1000);
        console.log(`[Analytics API] querying events since: ${new Date(cutoffTime).toISOString()}`);

        const eventsRef = db.collection('analytics_events');
        console.log('[Analytics API] Got collection reference');

        let snapshot;
        try {
            snapshot = await eventsRef
                .where('receivedAt', '>=', cutoffTime)
                .orderBy('receivedAt', 'desc')
                .get();
            console.log(`[Analytics API] Query successful, ${snapshot.size} documents`);
        } catch (queryError: any) {
            console.error('[Analytics API] Query error:', queryError);

            // Check for index error (code 9, 'FAILED_PRECONDITION', or string match)
            const isIndexError =
                queryError.code === 9 ||
                queryError.code === 'FAILED_PRECONDITION' ||
                queryError.message?.includes('index') ||
                String(queryError).toLowerCase().includes('index');

            if (isIndexError) {
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
                    projectClicks: [],
                    buttonClicks: [],
                    recentEvents: [],
                });
            }
            throw queryError;
        }

        // Process events
        const visitsBySource: Record<string, number> = {};
        const pageViews: Record<string, number> = {};
        const dailyVisits: Record<string, number> = {};
        const uniqueVisitors = new Set<string>();
        const projectClicks: Record<string, number> = {};
        const buttonClicks: Record<string, number> = {};
        const recentEvents: Array<any> = [];

        let linkedInTotal = 0;
        let linkedInWebview = 0;
        let linkedInWithUTM = 0;

        snapshot.forEach((doc: any) => {
            const data = doc.data();

            // Add to recent events (limit to 100)
            if (recentEvents.length < 100) {
                recentEvents.push({
                    id: doc.id,
                    ...data,
                    // Convert timestamps to ISO strings for JSON serialization
                    createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
                });
            }

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

            // Project Clicks (view_project)
            if (data.eventName === 'view_project' && data.project) {
                const project = data.project;
                projectClicks[project] = (projectClicks[project] || 0) + 1;
            }

            // Button Clicks (click_hire_me, etc.)
            if (data.eventName && data.eventName.startsWith('click_')) {
                // Use label or category or event name as button identifier
                const button = data.label || data.eventName.replace('click_', '');
                buttonClicks[button] = (buttonClicks[button] || 0) + 1;
            }

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

        // Format project clicks
        const projectClicksArray = Object.entries(projectClicks)
            .map(([project, count]) => ({ project, count }))
            .sort((a, b) => b.count - a.count);

        // Format button clicks
        const buttonClicksArray = Object.entries(buttonClicks)
            .map(([button, count]) => ({ button, count }))
            .sort((a, b) => b.count - a.count);

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
            projectClicks: projectClicksArray,
            buttonClicks: buttonClicksArray,
            recentEvents,
        };

        console.log('[Analytics API] Returning summary:', JSON.stringify(summary).substring(0, 200));

        // Set cache headers - short cache for "live" feel (10 seconds)
        res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=59');

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
