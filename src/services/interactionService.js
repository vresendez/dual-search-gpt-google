/**
 * interactionService.js
 * 
 * Handles all backend interactions for participant studies.
 * Events are accumulated in memory AND backed up to localStorage.
 * On finalize (or tab close), the full event array is POSTed to Google Sheets.
 */

export const GOOGLE_WEBHOOK_URL = import.meta.env.VITE_GOOGLE_WEBHOOK_URL || 'NOT_SET';

const STORAGE_KEY = 'study_telemetry_events';
const SESSION_KEY = 'study_session_info';

let sessionEvents = [];
let currentSessionInfo = null;

/* ── localStorage backup helpers ─────────────────────────── */

const saveToLocalStorage = () => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionEvents));
        if (currentSessionInfo) {
            localStorage.setItem(SESSION_KEY, JSON.stringify(currentSessionInfo));
        }
    } catch (e) {
        // Storage full or unavailable — silent fail
    }
};

const loadFromLocalStorage = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return JSON.parse(stored);
    } catch (e) { /* ignore */ }
    return [];
};

const clearLocalStorage = () => {
    try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(SESSION_KEY);
    } catch (e) { /* ignore */ }
};

/* ── Core functions ──────────────────────────────────────── */

export const initSession = async (participantId, condition) => {
    const sessionId = crypto.randomUUID();
    const startTime = new Date().toISOString();

    currentSessionInfo = {
        sessionId,
        participantId,
        condition: condition || 'default',
        startTime,
        userAgent: navigator.userAgent,
        screenSize: `${window.innerWidth}x${window.innerHeight}`
    };

    sessionEvents = []; // Reset events
    clearLocalStorage(); // Clear any stale data from a previous session

    logEvent('session_start', { url: window.location.href });

    // Safety net: send data if user closes the tab unexpectedly
    window.addEventListener('beforeunload', handleBeforeUnload);

    return currentSessionInfo;
};

const handleBeforeUnload = () => {
    // Use sendBeacon for reliable delivery during page unload
    if (sessionEvents.length > 0 && GOOGLE_WEBHOOK_URL !== 'NOT_SET') {
        logEvent('session_abandoned', { reason: 'tab_closed' });
        const blob = new Blob([JSON.stringify(sessionEvents)], { type: 'text/plain' });
        navigator.sendBeacon(GOOGLE_WEBHOOK_URL, blob);
    }
};

export const logEvent = (eventType, eventData) => {
    if (!currentSessionInfo) return;

    const eventRecord = {
        sessionId: currentSessionInfo.sessionId,
        participantId: currentSessionInfo.participantId,
        condition: currentSessionInfo.condition,
        timestamp: new Date().toISOString(),
        eventType,
        ...eventData
    };

    console.log(`[Telemetry] ${eventType}`, eventRecord);
    sessionEvents.push(eventRecord);
    saveToLocalStorage(); // Backup after every event
};

export const logInteraction = async (query, results, viewMode, interactionCount) => {
    logEvent('search', {
        query,
        viewMode,
        interactionCount,
        resultsShown: results.map(r => r.id).join(', ')
    });
};

export const logNavigation = async (fromView, toView) => {
    logEvent('navigation', { from: fromView, to: toView });
};

export const logResultClick = async (resultId, resultTitle, source, position) => {
    logEvent('click_result', { resultId, resultTitle, source, position });
};

export const logHover = (resultId, resultTitle, durationMs) => {
    logEvent('hover_result', { resultId, resultTitle, durationMs });
};

export const logArticleRead = (articleId, durationMs) => {
    logEvent('read_article', { articleId, durationMs });
};

export const finalizeSession = async (interactionCount) => {
    logEvent('session_end', { interactionCount });

    // Remove the beforeunload listener since we're sending data properly now
    window.removeEventListener('beforeunload', handleBeforeUnload);

    // Send data to Google Sheets Webhook
    try {
        if (GOOGLE_WEBHOOK_URL !== 'NOT_SET') {
            await fetch(GOOGLE_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify(sessionEvents),
            });
            console.log('[Telemetry] Data successfully sent to Google Sheets.');
            clearLocalStorage(); // Only clear backup after successful send
        } else {
            console.warn("[Telemetry] Google Webhook URL not set. Data not saved externally.", sessionEvents);
        }
    } catch (error) {
        console.error('[Telemetry] Failed to send telemetry to Google Sheets:', error);
        // Data remains in localStorage as backup
        console.warn('[Telemetry] Data is saved in localStorage as backup.');
    }

    return currentSessionInfo;
};

export const redirectToQualtrics = (participantId, condition) => {
    const QUALTRICS_URL = 'https://utwentebs.eu.qualtrics.com/jfe/form/SV_1zzHU2TiPGB9Wdg';
    const redirectUrl = `${QUALTRICS_URL}?ID=${participantId}&condition=${condition}`;
    console.log('[InteractionService] Redirecting to new Qualtrics survey:', redirectUrl);
    window.location.href = redirectUrl;
};
