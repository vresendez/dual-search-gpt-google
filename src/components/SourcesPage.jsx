import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CURATED_RESULTS } from '../services/searchService';

/**
 * SourcesPage — a standalone reference page showing full article content
 * for all 6 curated sources. Accessible at /sources.
 * Participants can read detailed summaries and access the original links.
 */
const SourcesPage = () => {
    const [expanded, setExpanded] = useState(null);

    const toggle = (id) => setExpanded(prev => (prev === id ? null : id));

    // Simple markdown-ish renderer for fullContent
    const renderContent = (text) => {
        return text.split('\n').map((line, i) => {
            if (line.startsWith('## ')) {
                return <h3 key={i} className="sp-content-h2">{line.slice(3)}</h3>;
            }
            if (line.startsWith('- **')) {
                // Bold bullet
                const parts = line.slice(2).split(/(\*\*.*?\*\*)/g);
                return (
                    <li key={i} className="sp-content-li">
                        {parts.map((p, j) =>
                            /^\*\*.*\*\*$/.test(p) ? <strong key={j}>{p.slice(2, -2)}</strong> : p
                        )}
                    </li>
                );
            }
            if (line.startsWith('- ')) {
                return <li key={i} className="sp-content-li">{line.slice(2)}</li>;
            }
            if (line.trim() === '') return <div key={i} className="sp-spacer" />;
            // Inline bold
            const parts = line.split(/(\*\*.*?\*\*)/g);
            return (
                <p key={i} className="sp-content-p">
                    {parts.map((p, j) =>
                        /^\*\*.*\*\*$/.test(p) ? <strong key={j}>{p.slice(2, -2)}</strong> : p
                    )}
                </p>
            );
        });
    };

    return (
        <div className="sp-root">
            {/* Header */}
            <header className="sp-header">
                <div className="sp-header-inner">
                    <div className="sp-logo">📄</div>
                    <div>
                        <h1 className="sp-title">Research Sources</h1>
                        <p className="sp-subtitle">
                            Nanoparticle Sunscreens: Health &amp; Environmental Evidence Review
                        </p>
                    </div>
                </div>
            </header>

            {/* Intro */}
            <div className="sp-intro-band">
                <div className="sp-intro-inner">
                    <p>
                        The following 6 sources represent the key peer-reviewed literature and regulatory
                        guidance on the health risks of mineral nanoparticle sunscreens. Click any source
                        to read a full summary, or use the link to access the original document.
                    </p>
                </div>
            </div>

            {/* Source cards */}
            <main className="sp-main">
                {CURATED_RESULTS.map((src, i) => {
                    const isOpen = expanded === src.id;
                    return (
                        <article key={src.id} className={`sp-card ${isOpen ? 'sp-card--open' : ''}`}>
                            {/* Card header row */}
                            <div className="sp-card-header" onClick={() => toggle(src.id)} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && toggle(src.id)}>
                                <div className="sp-card-num" style={{ background: src.sourceColor }}>{i + 1}</div>
                                <div className="sp-card-meta">
                                    <div className="sp-card-source" style={{ color: src.sourceColor }}>{src.source}</div>
                                    <h2 className="sp-card-title">{src.title}</h2>
                                    <div className="sp-card-byline">
                                        {src.authors} &nbsp;·&nbsp; {src.year}
                                    </div>
                                </div>
                                <div className="sp-card-chevron">{isOpen ? '▲' : '▼'}</div>
                            </div>

                            {/* Snippet always visible */}
                            <p className="sp-card-snippet">{src.snippet}</p>

                            {/* Expanded full content */}
                            {isOpen && (
                                <div className="sp-card-content">
                                    <ul className="sp-content-ul">
                                        {renderContent(src.fullContent)}
                                    </ul>
                                    <a
                                        href={src.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="sp-card-link"
                                        style={{ borderColor: src.sourceColor, color: src.sourceColor }}
                                    >
                                        Access original source →
                                    </a>
                                </div>
                            )}
                        </article>
                    );
                })}
            </main>

            <footer className="sp-footer">
                These summaries are provided for research purposes. Always consult the original sources for full methodology and conclusions.
            </footer>
        </div>
    );
};

export default SourcesPage;
