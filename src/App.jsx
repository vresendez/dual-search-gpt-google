import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Routes, Route, Navigate, useLocation, useSearchParams, Link } from 'react-router-dom';
import GoogleView from './components/GoogleView';
import ChatView from './components/ChatView';
import SourcesPage from './components/SourcesPage';
import ArticlePage from './components/ArticlePage';
import { searchAll } from './services/searchService';
import { initSession, logEvent, logInteraction, logNavigation, finalizeSession, redirectToQualtrics } from './services/interactionService';
import './index.css';

const getStoredState = () => {
  try {
    const item = localStorage.getItem('study_session');
    if (item) {
      const parsed = JSON.parse(item);
      if (parsed.endTime > Date.now() || parsed.hasConsented) return parsed;
    }
  } catch (e) {}
  return null;
};

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const pathParts = location.pathname.split('/').filter(Boolean);
  const pathPid = (pathParts.length >= 2 && (pathParts[0] === 'google' || pathParts[0] === 'chatgpt')) ? pathParts[1] : null;
  const pathCondition = (pathParts.length >= 3 && (pathParts[0] === 'google' || pathParts[0] === 'chatgpt')) ? pathParts[2] : null;

  // Global Session State via LocalStorage
  const [storedState, setStoredState] = useState(getStoredState);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'study_session') {
        setStoredState(getStoredState());
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const saveStoredState = useCallback((updates) => {
    const prev = getStoredState() || {};
    const next = { ...prev, ...updates };
    localStorage.setItem('study_session', JSON.stringify(next));
    setStoredState(next);
  }, []);

  const participantId = pathPid || searchParams.get('pid') || storedState?.participantId || 'anonymous';
  const condition = pathCondition || searchParams.get('condition') || storedState?.condition || 'none';
  
  const hasConsented = storedState?.hasConsented || false;
  const sessionInfo = storedState?.sessionInfo || null;
  const interactionCount = storedState?.interactionCount || 0;

  const [isFinishing, setIsFinishing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(() => {
    return storedState?.endTime ? Math.max(0, Math.floor((storedState.endTime - Date.now()) / 1000)) : 20 * 60;
  });
  const timerRef = useRef(null);
  const hasRedirected = useRef(false);

  // Initialize session ONLY after consent and if not already initialized
  useEffect(() => {
    if (!hasConsented || sessionInfo) return;
    const startSession = async () => {
      const info = await initSession(participantId, condition);
      saveStoredState({ sessionInfo: info });
    };
    startSession();
  }, [hasConsented, sessionInfo, participantId, condition, saveStoredState]);

  // 20-minute countdown timer — starts after consent
  useEffect(() => {
    if (!hasConsented || !storedState?.endTime) return;
    timerRef.current = setInterval(() => {
      const remaining = Math.max(0, Math.floor((storedState.endTime - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timerRef.current);
      }
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [hasConsented, storedState?.endTime]);

  // Auto-redirect when timer hits 0
  useEffect(() => {
    if (timeLeft === 0 && sessionInfo && !hasRedirected.current) {
      hasRedirected.current = true;
      const autoFinish = async () => {
        await finalizeSession(interactionCount);
        redirectToQualtrics(participantId, condition);
      };
      autoFinish();
    }
  }, [timeLeft, sessionInfo, interactionCount, participantId, condition]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Track view navigation
  useEffect(() => {
    if (sessionInfo) {
      const view = location.pathname.includes('chat') ? 'chatgpt' : 'google';
      logNavigation('previous', view);
    }
  }, [location.pathname, sessionInfo]);

  const handleSearch = useCallback(async (searchQuery) => {
    setLoading(true);
    try {
      const allResults = await searchAll(searchQuery);
      
      const resultsWithParams = allResults.map(res => {
        return {
          ...res,
          url: `${res.url}/${participantId}/${condition}`
        };
      });

      setResults(resultsWithParams);

      // Log interaction
      if (sessionInfo) {
        const newCount = interactionCount + 1;
        saveStoredState({ interactionCount: newCount });
        logInteraction(searchQuery, allResults, location.pathname, newCount);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  }, [sessionInfo, interactionCount, location.pathname, saveStoredState]);

  const handleFinish = async () => {
    if (sessionInfo) {
      setIsFinishing(true);
      await finalizeSession(interactionCount);
      redirectToQualtrics(participantId, condition);
    }
  };

  const handleConsent = () => {
    saveStoredState({
      participantId,
      condition,
      hasConsented: true,
      endTime: Date.now() + 20 * 60 * 1000,
      interactionCount: 0
    });
  };

  // Draggable completion container state
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e) => {
    // Prevent dragging when clicking the button
    if (e.target.tagName.toLowerCase() === 'button') return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y
    });
  };

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const viewMode = location.pathname.includes('chat') ? 'chat' : 'google';

  if (!hasConsented) {
    return (
      <div className="consent-screen">
        <div className="consent-content">
          <h1>Research Study Simulation</h1>
          <p>
            Welcome to the academic research simulation. Please note that this is a
            controlled environment created exclusively for research purposes.
          </p>
          <p>
            <strong>Disclaimer:</strong> This site is not affiliated with, endorsed by,
            or connected to Google, OpenAI, or any other entities represented in the simulation.
            Any resemblance to actual platforms is purely for study purposes.
          </p>
          <button className="consent-btn" onClick={handleConsent}>
            I Understand & Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`app-wrapper ${viewMode}-mode`}>
      <Routes>
        <Route
          path="/google/:pid?/:condition?"
          element={
            <GoogleView
              onSearch={handleSearch}
              results={results}
              loading={loading}
              query={query}
              setQuery={setQuery}
            />
          }
        />
        <Route
          path="/chatgpt/:pid?/:condition?"
          element={
            <ChatView
              onSearch={handleSearch}
              results={results}
              loading={loading}
              query={query}
              setQuery={setQuery}
            />
          }
        />
        {/* Support the user's typos just in case */}
        <Route path="/ggoogle" element={<Navigate to="/google" replace />} />
        <Route path="/chtgpt" element={<Navigate to="/chatgpt" replace />} />
        <Route path="/sources" element={<SourcesPage />} />
        <Route path="/article/:id/:pid?/:condition?" element={<ArticlePage />} />
        <Route path="/" element={<Navigate to="/google" replace />} />
      </Routes>

      {/* Sticky Completion link */}
      <div 
        className="study-completion-container"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          transform: `translate(calc(-50% + ${position.x}px), ${position.y}px)`,
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          touchAction: 'none'
        }}
      >
        <div className="study-timer" style={{
          fontVariantNumeric: 'tabular-nums',
          fontWeight: 600,
          fontSize: '14px',
          color: timeLeft <= 60 ? '#ea4335' : (timeLeft <= 300 ? '#fbbc05' : '#34a853'),
        }}>
          ⏱ {formatTime(timeLeft)}
        </div>
        <button
          className="finish-btn"
          onClick={handleFinish}
          disabled={interactionCount < 1 || isFinishing}
        >
          {isFinishing ? "Saving Data..." : "Complete Study & Return to Qualtrics"}
        </button>
      </div>
    </div>
  );
}

export default App;
