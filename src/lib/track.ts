/**
 * First-party analytics tracking module
 * Tracks page views with special focus on LinkedIn traffic detection
 */

interface UTMParams {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    utm_term?: string;
}

interface FirstTouch {
    source: string;
    refDomain: string;
    utm: UTMParams;
    timestamp: number;
    expiresAt: number;
}

interface TrackingPayload {
    ts: number;
    path: string;
    source: string;
    refDomain: string;
    utm: UTMParams;
    linkedinWebview: boolean;
    visitorId: string;
    firstTouch?: FirstTouch;
}

const FIRST_TOUCH_KEY = 'analytics_first_touch';
const VISITOR_ID_KEY = 'analytics_visitor_id';
const FIRST_TOUCH_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
const EXCLUDED_PATHS = ['/admin', '/analytics'];

/**
 * Detect if the user agent is LinkedIn in-app browser
 */
function isLinkedInWebView(ua: string): boolean {
    // LinkedIn in-app browser patterns
    const patterns = [
        /LinkedInApp/i,
        /LinkedIn/i,
        /LNKD/i,
    ];
    return patterns.some(pattern => pattern.test(ua));
}

/**
 * Extract domain from URL
 */
function extractDomain(url: string): string {
    if (!url) return '';
    try {
        const urlObj = new URL(url);
        return urlObj.hostname;
    } catch {
        return '';
    }
}

/**
 * Parse UTM parameters from URL search string
 */
function parseUTMParams(search: string): UTMParams {
    const params = new URLSearchParams(search);
    return {
        utm_source: params.get('utm_source') || undefined,
        utm_medium: params.get('utm_medium') || undefined,
        utm_campaign: params.get('utm_campaign') || undefined,
        utm_content: params.get('utm_content') || undefined,
        utm_term: params.get('utm_term') || undefined,
    };
}

/**
 * Determine traffic source with priority:
 * 1. UTM source if present
 * 2. LinkedIn if referrer or UA indicates LinkedIn
 * 3. Direct if no referrer
 * 4. Referrer domain otherwise
 */
function determineSource(
    utm: UTMParams,
    referrer: string,
    linkedinWebview: boolean
): string {
    // Priority 1: UTM source
    if (utm.utm_source) {
        return utm.utm_source;
    }

    // Priority 2: LinkedIn detection
    const refDomain = extractDomain(referrer);
    if (refDomain.includes('linkedin.com') || linkedinWebview) {
        return 'linkedin';
    }

    // Priority 3: Direct traffic
    if (!referrer) {
        return 'direct';
    }

    // Priority 4: Referrer domain
    return refDomain;
}

/**
 * Get or create visitor ID
 */
function getVisitorId(): string {
    try {
        let visitorId = localStorage.getItem(VISITOR_ID_KEY);
        if (!visitorId) {
            visitorId = `v_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
            localStorage.setItem(VISITOR_ID_KEY, visitorId);
        }
        return visitorId;
    } catch {
        // Fallback if localStorage is unavailable
        return `v_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    }
}

/**
 * Get first touch attribution from localStorage
 */
function getFirstTouch(): FirstTouch | null {
    try {
        const stored = localStorage.getItem(FIRST_TOUCH_KEY);
        if (!stored) return null;

        const firstTouch: FirstTouch = JSON.parse(stored);

        // Check if expired
        if (Date.now() > firstTouch.expiresAt) {
            localStorage.removeItem(FIRST_TOUCH_KEY);
            return null;
        }

        return firstTouch;
    } catch {
        return null;
    }
}

/**
 * Set first touch attribution in localStorage
 */
function setFirstTouch(
    source: string,
    refDomain: string,
    utm: UTMParams
): void {
    try {
        const firstTouch: FirstTouch = {
            source,
            refDomain,
            utm,
            timestamp: Date.now(),
            expiresAt: Date.now() + FIRST_TOUCH_TTL,
        };
        localStorage.setItem(FIRST_TOUCH_KEY, JSON.stringify(firstTouch));
    } catch (e) {
        console.warn('[Track] Failed to set first touch:', e);
    }
}

/**
 * Send tracking data to server using sendBeacon or fetch
 */
async function sendTrackingData(payload: TrackingPayload): Promise<void> {
    const endpoint = '/api/track';
    const data = JSON.stringify(payload);

    try {
        // Try sendBeacon first (works better in WebViews and on page unload)
        if (navigator.sendBeacon) {
            const blob = new Blob([data], { type: 'application/json' });
            const sent = navigator.sendBeacon(endpoint, blob);
            if (sent) {
                return; // Success
            }
        }

        // Fallback to fetch
        await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: data,
            keepalive: true, // Important for tracking on page unload
        });
    } catch (e) {
        console.warn('[Track] Failed to send tracking data:', e);
    }
}

/**
 * Track a page view
 */
export async function trackPageView(): Promise<void> {
    try {
        // SSR safety
        if (typeof window === 'undefined') return;

        const path = window.location.pathname;

        // Exclude protected routes
        if (EXCLUDED_PATHS.some(excluded => path.startsWith(excluded))) {
            return;
        }

        const ua = navigator.userAgent;
        const linkedinWebview = isLinkedInWebView(ua);
        const referrer = document.referrer;
        const refDomain = extractDomain(referrer);
        const utm = parseUTMParams(window.location.search);
        const source = determineSource(utm, referrer, linkedinWebview);
        const visitorId = getVisitorId();

        // Handle first touch attribution
        let firstTouch = getFirstTouch();

        // If no first touch exists and this is an attributed visit, set it
        if (!firstTouch && source !== 'direct') {
            setFirstTouch(source, refDomain, utm);
            firstTouch = getFirstTouch();
        }

        // Build payload
        const payload: TrackingPayload = {
            ts: Date.now(),
            path,
            source,
            refDomain,
            utm,
            linkedinWebview,
            visitorId,
            firstTouch: firstTouch || undefined,
        };

        // Send to server
        await sendTrackingData(payload);
    } catch (e) {
        console.warn('[Track] Error in trackPageView:', e);
    }
}

/**
 * Initialize tracking (call once on app load)
 */
export function initTracking(): void {
    // Track initial page view
    trackPageView();
}
