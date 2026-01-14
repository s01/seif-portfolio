import { db } from "./firebase";
import { collection, addDoc, getDocs, query, writeBatch, doc, serverTimestamp } from "firebase/firestore/lite";

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
 * Log an analytics event to Firestore.
 * - Uses addDoc() for auto-generated unique IDs (no collisions)
 * - Deduplicates page_view events per session using sessionStorage
 * - Uses serverTimestamp() for accurate server-side timestamps
 * - Fails silently if Firestore is unavailable
 */
export const logEvent = async (eventName: string, data: any = {}) => {
    try {
        // SSR safety check
        if (typeof window === 'undefined') return;

        // Generate or retrieve session ID
        let sessionId = sessionStorage.getItem("analytics_session_id");
        if (!sessionId) {
            sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
            sessionStorage.setItem("analytics_session_id", sessionId);
        }

        // Deduplicate page_view events: only log once per session per path
        if (eventName === 'page_view') {
            const pathname = window.location.pathname;
            const dedupeKey = `pv:${pathname}`;

            // Check if we've already logged this page view in this session
            if (sessionStorage.getItem(dedupeKey)) {
                console.log('[Analytics] page_view already logged for this session:', pathname);
                return; // Skip duplicate
            }

            // Mark this page view as logged
            sessionStorage.setItem(dedupeKey, 'true');
        }

        // Fetch IP address if not already in session
        let ip = sessionStorage.getItem("analytics_client_ip");
        if (!ip) {
            try {
                // Determine IP using free service (only once per session)
                const res = await fetch('https://api.ipify.org?format=json');
                if (res.ok) {
                    const data = await res.json();
                    ip = data.ip;
                    if (ip) sessionStorage.setItem("analytics_client_ip", ip);
                }
            } catch (err) {
                console.warn("[Analytics] Could not fetch IP:", err);
            }
        }

        // Log event to Firestore with auto-generated ID
        await addDoc(collection(db, EVENTS_COLLECTION), {
            eventName,
            timestamp: serverTimestamp(), // Server-side timestamp (accurate & consistent)
            dateStr: new Date().toISOString(), // Client-side ISO string for fallback
            sessionId,
            userAgent: navigator.userAgent,
            screenSize: `${window.innerWidth}x${window.innerHeight}`,
            referrer: document.referrer || '',
            ip: ip || 'unknown', // Add parsed IP
            ...data
        });
        // Silent success
    } catch (e) {
        console.warn("[Analytics] Failed to log event:", e);
    }
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
