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

        // Aggregate
        const stats: Record<string, number> = {};
        const uniqueSessions = new Set<string>();

        events.forEach(e => {
            stats[e.eventName] = (stats[e.eventName] || 0) + 1;
            if (e.sessionId) uniqueSessions.add(e.sessionId); // Fixed prop access
        });

        return {
            totalEvents: events.length,
            uniqueVisitors: uniqueSessions.size,
            breakdown: stats,
            // Sort recent events desc
            recentEvents: events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        };
    } catch (e) {
        console.error("[Analytics] Error fetching stats:", e);
        return null;
    }
};
