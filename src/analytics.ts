import { db } from "./firebase";
import { collection, addDoc, getDocs, query } from "firebase/firestore/lite";

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
    [key: string]: any;
}

export const logEvent = async (eventName: string, data: any = {}) => {
    try {
        let sessionId = sessionStorage.getItem("analytics_session_id");
        if (!sessionId) {
            sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
            sessionStorage.setItem("analytics_session_id", sessionId);
        }

        await addDoc(collection(db, EVENTS_COLLECTION), {
            eventName,
            timestamp: new Date(), // Stored as Timestamp in Firestore
            dateStr: new Date().toISOString(),
            sessionId,
            userAgent: navigator.userAgent,
            screenSize: `${window.innerWidth}x${window.innerHeight}`,
            referrer: document.referrer || '',
            ...data
        });
        // Silent success
    } catch (e) {
        console.warn("[Analytics] Failed to log event:", e);
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
        const conversions = { hire: 0, resume: 0, email: 0, social: 0, github: 0, linkedin: 0 };

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

            // Conversions
            if (e.eventName === 'click_hire_me') conversions.hire++;
            if (e.eventName === 'click_hero_resume') conversions.resume++;
            if (e.eventName.includes('email')) conversions.email++;
            if (e.eventName.includes('social')) conversions.social++;
            if (e.eventName.includes('github')) conversions.github++;
            if (e.eventName.includes('linkedin')) conversions.linkedin++;
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
