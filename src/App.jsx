import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Routes, Route, Navigate, useLocation, useSearchParams, Link } from 'react-router-dom';
import GoogleView from './components/GoogleView';
import ChatView from './components/ChatView';
import SourcesPage from './components/SourcesPage';
import ArticlePage from './components/ArticlePage';
import { searchAll } from './services/searchService';
import { initSession, logInteraction, logNavigation, finalizeSession, redirectToQualtrics } from './services/interactionService';
import './index.css';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const location = useLocation();

  // Participant and Session State
  const participantId = useMemo(() => searchParams.get('pid') || 'anonymous', [searchParams]);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [interactionCount, setInteractionCount] = useState(0);

  // Initialize session on mount
  useEffect(() => {
    const startSession = async () => {
      const info = await initSession(participantId);
      setSessionInfo(info);
    };
    startSession();
  }, [participantId]);

  // Track view navigation
  useEffect(() => {
    if (sessionInfo) {
      const view = location.pathname.includes('chat') ? 'chatgpt' : 'google';
      logNavigation(sessionInfo, 'previous', view);
    }
  }, [location.pathname, sessionInfo]);

  const handleSearch = useCallback(async (searchQuery) => {
    setLoading(true);
    setResults([]);
    try {
      const allResults = await searchAll(searchQuery);
      setResults(allResults);

      // Log interaction
      if (sessionInfo) {
        setInteractionCount(prev => {
          const newCount = prev + 1;
          logInteraction(sessionInfo, searchQuery, allResults, location.pathname, newCount);
          return newCount;
        });
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  }, [sessionInfo, location.pathname]);

  const handleFinish = async () => {
    if (sessionInfo) {
      await finalizeSession(sessionInfo, interactionCount);
      redirectToQualtrics(participantId);
    }
  };

  const viewMode = location.pathname.includes('chat') ? 'chat' : 'google';

  return (
    <div className={`app-wrapper ${viewMode}-mode`}>
      <Routes>
        <Route
          path="/google"
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
          path="/chatgpt"
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
        <Route path="/article/:id" element={<ArticlePage />} />
        <Route path="/" element={<Navigate to="/google" replace />} />
      </Routes>

      {/* Sticky Completion + Sources link */}
      <div className="study-completion-container">
        <Link to="/sources" className="sources-nav-link" target="_blank" rel="noreferrer">
          📄 View Sources
        </Link>
        <button
          className="finish-btn"
          onClick={handleFinish}
          disabled={interactionCount < 1}
        >
          Complete Study &amp; Return to Qualtrics
        </button>
      </div>
    </div>
  );
}

export default App;
