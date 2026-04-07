import React, { useState } from "react";
import { CHATGPT_SUMMARY } from "../services/searchService";
import { Link } from "react-router-dom";

const GoogleView = ({ onSearch, results, loading, query, setQuery }) => {
  const [hasSearched, setHasSearched] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setHasSearched(true);
    }
  };

  const chips = [
    "Safety",
    "Zinc oxide",
    "Advantage",
    "Safe",
    "Best",
    "Beauty of Joseon",
    "Benefits",
    "Mineral",
  ];

  if (hasSearched && (results.length > 0 || loading)) {
    return (
      <div className="google-results-container">
        <header className="google-header">
          <div className="header-top">
            <h1 className="logo-small" onClick={() => setHasSearched(false)}>
              <span style={{ color: "#4285F4" }}>G</span>
              <span style={{ color: "#EA4335" }}>o</span>
              <span style={{ color: "#FBBC05" }}>o</span>
              <span style={{ color: "#4285F4" }}>g</span>
              <span style={{ color: "#34A853" }}>l</span>
              <span style={{ color: "#EA4335" }}>e</span>
            </h1>
            <form onSubmit={handleSubmit} className="search-form-small">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="search-input-small"
              />
              <div className="search-icons-group">
                <span className="search-icon-tool">✕</span>
                <span className="search-icon-tool">🎙️</span>
                <span className="search-icon-tool">📷</span>
                <button type="submit" className="search-icon-btn">
                  🔍
                </button>
              </div>
            </form>
          </div>
          <div className="search-tabs">
            <div className="tab active">All</div>
            <div className="tab">Images</div>
            <div className="tab">Videos</div>
            <div className="tab">Short videos</div>
            <div className="tab">Forums</div>
            <div className="tab">News</div>
            <div className="tab">More</div>
            <div className="tab">Tools</div>
          </div>
        </header>

        <div className="google-chips-bar">
          {chips.map((chip) => (
            <div key={chip} className="chip">
              {chip}
            </div>
          ))}
        </div>

        <main className="google-main-content">
          {/* {!loading && (
            // <section className="google-ai-overview">
            //   <div className="ai-header">
            //     <span className="sparkle-icon">✨</span>
            //     <span>AI Overview</span>
            //   </div>
            //   <div className="ai-layout">
            //     <div className="ai-content">
            //       <div className="ai-summary-text">
            //         Nanoparticles in sunscreens, mainly titanium dioxide (TiO₂)
            //         and zinc oxide (ZnO), are{" "}
            //         <b>
            //           widely used to create transparent, non-greasy,
            //           broad-spectrum UV protection without a white cast
            //         </b>
            //         . They are generally considered safe for human skin, as they
            //         do not penetrate the skin surface, though inhalation of
            //         sprays is discouraged.
            //       </div>
            //       <div className="ai-summary-section">
            //         <span className="ai-section-title">
            //           Key Aspects of Nanoparticles in Sunscreen:
            //         </span>
            //         <ul className="ai-bullets">
            //           <li>
            //             <b>Purpose:</b> These tiny particles (&lt; 100
            //             nanometers) improve the formula's texture and
            //             aesthetics, making it easier to apply and, therefore,
            //             more effective.
            //           </li>
            //           <li>
            //             <b>Safety &amp; Skin Penetration:</b> Research shows
            //             that ZnO and TiO₂ nanoparticles stay on the surface of
            //             healthy skin and do not enter the bloodstream.
            //           </li>
            //         </ul>
            //       </div>
            //     </div>
            //     <aside className="ai-side-cards">
            //       <div className="ai-card">
            //         <div className="ai-card-content">
            //           <div className="ai-card-title">
            //             Nanoparticles and sunscreens: Five things worth knowing
            //           </div>
            //           <div className="ai-card-meta">YouTube · Risk Bites</div>
            //         </div>
            //         <div className="ai-card-img-placeholder">📺</div>
            //       </div>
            //       <div className="ai-card">
            //         <div className="ai-card-content">
            //           <div className="ai-card-title">
            //             Nano versus non-nano particles in sun care
            //           </div>
            //           <div className="ai-card-meta">Naïf Care</div>
            //         </div>
            //         <div className="ai-card-img-placeholder">🧴</div>
            //       </div>
            //     </aside>
            //   </div>
            //   <div className="ai-footer">
            //     <button className="ai-show-more">
            //       Show more <span>▼</span>
            //     </button>
            //   </div>
            // </section>
          //)}*/}

          <div className="results-list">
            {loading && <div className="loading-spinner">Searching...</div>}
            {!loading &&
              results.map((res, i) => (
                <div key={res.id} className="result-item">
                  <div className="res-header">
                    <div className="res-favicon">
                      {res.source.charAt(0).toUpperCase()}
                    </div>
                    <div className="res-site-info">
                      <span className="res-site-name">{res.source}</span>
                      <span className="res-url">
                        {res.url.startsWith("/")
                          ? "https://study-reference.org" + res.url
                          : res.url}
                      </span>
                    </div>
                  </div>
                  <Link to={res.url} className="res-links-block">
                    <h3 className="res-title">{res.title}</h3>
                  </Link>
                  <p className="res-snippet">
                    {res.snippet}{" "}
                    <span className="res-read-more">Read more</span>
                  </p>
                  <div className="res-meta">
                    {res.authors} · {res.year}
                  </div>
                </div>
              ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="google-home">
      <div className="google-logo">
        <span style={{ color: "#4285F4" }}>G</span>
        <span style={{ color: "#EA4335" }}>o</span>
        <span style={{ color: "#FBBC05" }}>o</span>
        <span style={{ color: "#4285F4" }}>g</span>
        <span style={{ color: "#34A853" }}>l</span>
        <span style={{ color: "#EA4335" }}>e</span>
      </div>
      <form onSubmit={handleSubmit} className="google-search-form">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="google-input"
            autoFocus
          />
          <span className="mic-icon">🎙️</span>
        </div>
        <div className="google-btns">
          <button type="submit" className="google-btn">
            Google Search
          </button>
          <button type="button" className="google-btn">
            I'm Feeling Lucky
          </button>
        </div>
      </form>
    </div>
  );
};

export default GoogleView;
