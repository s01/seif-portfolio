import { db } from "./firebase";
import { collection, addDoc, getDocs, query, orderBy, limit } from "firebase/firestore/lite";

const EVENTS_COLLECTION = "analytics_events";

export interface AnalyticsEvent {
    eventName: string;
    category?: string;
    label?: string;
    timestamp: any;
    dateStr: string;
}

export const logEvent = async (eventName: string, data: any = {}) => {
    try {
        // Basic session handling
        let sessionId = sessionStorage.getItem("analytics_session_id");
        if (!sessionId) {
            sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
            sessionStorage.setItem("analytics_session_id", sessionId);
        }

        await addDoc(collection(db, EVENTS_COLLECTION), {
            eventName,
            timestamp: new Date(),
            dateStr: new Date().toISOString(),
            sessionId,
            userAgent: navigator.userAgent,
            screenSize: `${window.innerWidth}x${window.innerHeight}`,
            ...data
        });
        console.log(`[Analytics] Logged: ${eventName}`);
    } catch (e) {
        console.warn("[Analytics] Failed to log event:", e);
    }
};

export const getAnalyticsStats = async () => {
    try {
        // In production, you'd want aggregation queries or server-side functions.
        // For a portfolio with moderate traffic, fetching client-side is acceptable.
        const q = query(collection(db, EVENTS_COLLECTION));
        const snapshot = await getDocs(q);

        const events = snapshot.docs.map(doc => {
            const d = doc.data();
            // Handle Firestore Timestamp or Date
            const date = d.timestamp?.toDate ? d.timestamp.toDate() : new Date(d.dateStr || Date.now());
            return { ...d, timestamp: date } as AnalyticsEvent;
        });

        // Aggregate
        const stats: Record<string, number> = {};
        const uniqueSessions = new Set<string>();

        events.forEach(e => {
            stats[e.eventName] = (stats[e.eventName] || 0) + 1;
            if (e['sessionId']) uniqueSessions.add(e['sessionId']);
        });

        return {
            totalEvents: events.length,
            uniqueVisitors: uniqueSessions.size,
            breakdown: stats,
            recentEvents: events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 50)
        };
    } catch (e) {
        console.error("[Analytics] Error fetching stats:", e);
        return null;
    }
};
