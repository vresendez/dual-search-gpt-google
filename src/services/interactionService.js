/**
 * interactionService.js
 * 
 * Handles all backend interactions for participant studies.
 */

// Replace this with your actual backend endpoint (e.g., Supabase, Custom API)
const BACKEND_URL = 'https://your-backend-api.com/api/interactions';

/**
 * Initialize a new study session.
 * @param {string} participantId 
 */
export const initSession = async (participantId) => {
    const sessionId = crypto.randomUUID();
    const startTime = new Date().toISOString();

    const sessionData = {
        sessionId,
        participantId,
        startTime,
        status: 'initialized',
        userAgent: navigator.userAgent,
        screenSize: `${window.innerWidth}x${window.innerHeight}`,
        url: window.location.href,
    };

    console.log('[InteractionService] Initializing session:', sessionData);

    // In a real scenario, you'd POST this to your backend
    /*
    try {
      await fetch(`${BACKEND_URL}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData),
      });
    } catch (error) {
      console.error('Failed to initialize session on backend:', error);
    }
    */

    return sessionData;
};

/**
 * Log a user interaction (e.g., a search).
 * @param {object} sessionInfo 
 * @param {string} query 
 * @param {Array} results 
 * @param {string} viewMode 
 * @param {number} interactionCount 
 */
export const logInteraction = async (sessionInfo, query, results, viewMode, interactionCount) => {
    const interactionData = {
        sessionId: sessionInfo.sessionId,
        participantId: sessionInfo.participantId,
        timestamp: new Date().toISOString(),
        type: 'search',
        query,
        viewMode,
        interactionCount,
        // Store metadata about results shown
        resultsShown: results.map((r, index) => ({
            id: r.id,
            source: r.source,
            title: r.title,
            position: index + 1
        })),
    };

    console.log('[InteractionService] Logging interaction:', interactionData);

    /*
    try {
      await fetch(`${BACKEND_URL}/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(interactionData),
      });
    } catch (error) {
      console.error('Failed to log interaction on backend:', error);
    }
    */
};

/**
 * Log when a user switches between Google and ChatGPT views.
 */
export const logNavigation = async (sessionInfo, fromView, toView) => {
    const navData = {
        sessionId: sessionInfo.sessionId,
        participantId: sessionInfo.participantId,
        timestamp: new Date().toISOString(),
        type: 'navigation',
        from: fromView,
        to: toView
    };
    console.log('[InteractionService] Logging navigation:', navData);
    // fetch...
};

/**
 * Log when a user clicks on a particular result.
 */
export const logResultClick = async (sessionInfo, resultId, resultTitle, source, position) => {
    const clickData = {
        sessionId: sessionInfo.sessionId,
        participantId: sessionInfo.participantId,
        timestamp: new Date().toISOString(),
        type: 'click',
        resultId,
        resultTitle,
        source,
        position
    };
    console.log('[InteractionService] Logging click:', clickData);
    // fetch...
};

/**
 * Finalize the session and prepare for redirect.
 * @param {object} sessionInfo 
 * @param {number} interactionCount 
 */
export const finalizeSession = async (sessionInfo, interactionCount) => {
    const endTime = new Date().toISOString();
    const durationMs = new Date(endTime) - new Date(sessionInfo.startTime);

    const finalData = {
        ...sessionInfo,
        endTime,
        durationMs,
        interactionCount,
        status: 'completed',
    };

    console.log('[InteractionService] Finalizing session:', finalData);

    /*
    try {
      await fetch(`${BACKEND_URL}/sessions/${sessionInfo.sessionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });
    } catch (error) {
      console.error('Failed to finalize session on backend:', error);
    }
    */

    return finalData;
};

/**
 * Perform the redirect back to Qualtrics.
 * @param {string} participantId 
 */
export const redirectToQualtrics = (participantId) => {
    // Replace with your actual Qualtrics survey URL + parameters
    const QUALTRICS_URL = 'https://your-qualtrics-survey.com';
    const redirectUrl = `${QUALTRICS_URL}?pid=${participantId}&status=complete`;

    console.log('[InteractionService] Redirecting to:', redirectUrl);
    window.location.href = redirectUrl;
};
