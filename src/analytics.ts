import { db } from "./firebase";
import { collection, getDocs, query, writeBatch, doc } from "firebase/firestore/lite";
import { logEvent as trackEvent } from "./lib/track";

const EVENTS_COLLECTION = "analytics_events";

export interface AnalyticsEvent {
    eventName: string;
    category?: string;
    label?: string;
    timestamp: Date;
    dateStr?: string;
    sessionId?: string;
    userAgent?: string;
    screenSize?: string;
    ip?: string;
    [key: string]: any;
}

/**
 * Log an analytics event - now uses the new first-party tracking API
 * This maintains backward compatibility with existing code
 */
export const logEvent = async (eventName: string, data: any = {}) => {
    // Use the new tracking system which sends to /api/track
    await trackEvent(eventName, data);
};

export const clearAnalytics = async () => {
    try {
        const q = query(collection(db, EVENTS_COLLECTION));
        const snapshot = await getDocs(q);
        const batch = writeBatch(db);

        snapshot.docs.forEach((docSnap) => {
            batch.delete(doc(db, EVENTS_COLLECTION, docSnap.id));
        });

        await batch.commit();
        return true;
    } catch (e) {
        console.error("[Analytics] Error clearing analytics:", e);
        return false;
    }
};

export const getAnalyticsStats = async () => {
    try {
        const q = query(collection(db, EVENTS_COLLECTION));
        const snapshot = await getDocs(q);

        const events: AnalyticsEvent[] = snapshot.docs.map(doc => {
            const d = doc.data();
            // Handle Firestore Timestamp conversion if needed
            const date = d.timestamp && typeof d.timestamp.toDate === 'function'
                ? d.timestamp.toDate()
                : new Date(d.dateStr || Date.now());

            return {
                ...d,
                eventName: d.eventName || 'unknown',
                timestamp: date
            } as AnalyticsEvent;
        });

        // Aggregations
        const stats: Record<string, number> = {};
        const uniqueSessions = new Set<string>();
        const topProjects: Record<string, number> = {};
        const deviceStats = { mobile: 0, desktop: 0 };
        const conversions = {
            hire: 0,
            resume: 0,
            email: 0,
            linkedin: 0,
            github: 0,
            trailhead: 0,
            other: 0
        };

        events.forEach(e => {
            // General Event Counts
            stats[e.eventName] = (stats[e.eventName] || 0) + 1;

            // Unique Visitors
            if (e.sessionId) uniqueSessions.add(e.sessionId);

            // Top Projects
            if (e.eventName === 'view_project' && e['project']) {
                const pName = e['project'];
                topProjects[pName] = (topProjects[pName] || 0) + 1;
            }

            // Device Breakdown
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(e.userAgent || '');
            if (isMobile) deviceStats.mobile++;
            else deviceStats.desktop++;

            // Conversions & Socials
            const name = e.eventName.toLowerCase();
            if (name === 'click_hire_me') conversions.hire++;
            else if (name.includes('resume')) conversions.resume++;
            else if (name.includes('email')) conversions.email++;
            else if (name.includes('linkedin')) conversions.linkedin++;
            else if (name.includes('github')) conversions.github++;
            else if (name.includes('trailhead')) conversions.trailhead++;
            // Capture other 'social' clicks that aren't the specific ones above
            else if (name.includes('social')) conversions.other++;
        });

        return {
            totalEvents: events.length,
            uniqueVisitors: uniqueSessions.size,
            breakdown: stats,
            topProjects: Object.entries(topProjects).sort(([, a], [, b]) => b - a),
            deviceStats,
            conversions,
            // Sort recent events desc
            recentEvents: events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        };
    } catch (e) {
        console.error("[Analytics] Error fetching stats:", e);
        return null;
    }
};
