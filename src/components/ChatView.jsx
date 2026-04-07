import React, { useState, useEffect, useRef } from "react";
import { CHATGPT_SUMMARY } from "../services/searchService";

/* ─── Helpers ─────────────────────────────────────────────── */

const RichText = ({ text, sources }) => {
  const parts = text.split(/(\*\*.*?\*\*|\[\d+\])/g);
  return (
    <>
      {parts.map((part, i) => {
        if (/^\*\*.*\*\*$/.test(part)) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        const citeMatch = part.match(/^\[(\d+)\]$/);
        if (citeMatch) {
          const n = parseInt(citeMatch[1], 10);
          const src = sources?.[n - 1];
          return (
            <a
              key={i}
              href={src?.url ?? "#"}
              target="_blank"
              rel="noreferrer"
              className="cite-chip"
              title={src?.title ?? ""}
            >
              {n}
            </a>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
};

const SummaryBlock = ({ block, sources }) => {
  if (block.type === "heading")
    return <h3 className="gpt-heading">{block.text}</h3>;

  if (block.type === "bullets") {
    return (
      <ul className="gpt-bullets">
        {block.items.map((item, i) => (
          <li key={i}>
            <RichText text={item.text} sources={sources} />
            {item.cite != null && (
              <a
                href={sources?.[item.cite - 1]?.url ?? "#"}
                target="_blank"
                rel="noreferrer"
                className="cite-chip"
                title={sources?.[item.cite - 1]?.title ?? ""}
              >
                {item.cite}
              </a>
            )}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p className="gpt-paragraph">
      <RichText text={block.text} sources={sources} />
      {Array.isArray(block.cite) &&
        block.cite.map((n) => (
          <a
            key={n}
            href={sources?.[n - 1]?.url ?? "#"}
            target="_blank"
            rel="noreferrer"
            className="cite-chip"
            title={sources?.[n - 1]?.title ?? ""}
          >
            {n}
          </a>
        ))}
    </p>
  );
};

/* ─── Word-by-word streaming hook ────────────────────────── */
function useStreaming(active, sources) {
  const blocks = CHATGPT_SUMMARY;
  const [visibleCount, setVisibleCount] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [done, setDone] = useState(false);

  const currentBlock = blocks[visibleCount];
  const currentBlockText = React.useMemo(() => {
    if (!currentBlock) return "";
    if (currentBlock.type === "paragraph" || currentBlock.type === "heading")
      return currentBlock.text;
    if (currentBlock.type === "bullets")
      return currentBlock.items.map((b) => b.text).join("\n");
    return "";
  }, [currentBlock]);

  useEffect(() => {
    if (!active) return;
    setVisibleCount(0);
    setCharIndex(0);
    setDone(false);
  }, [active]);

  useEffect(() => {
    if (!active || done) return;
    if (visibleCount >= blocks.length) {
      setDone(true);
      return;
    }

    const total = currentBlockText.length;
    if (charIndex < total) {
      const delay = 12 + Math.random() * 8;
      const id = setTimeout(() => setCharIndex((c) => c + 1), delay);
      return () => clearTimeout(id);
    } else {
      const id = setTimeout(() => {
        setVisibleCount((v) => v + 1);
        setCharIndex(0);
      }, 100);
      return () => clearTimeout(id);
    }
  }, [active, done, visibleCount, charIndex, currentBlockText, blocks.length]);

  const fullyRevealedBlocks = blocks.slice(0, visibleCount);
  const streamingBlock =
    visibleCount < blocks.length ? blocks[visibleCount] : null;
  const streamingChars = charIndex;

  return { fullyRevealedBlocks, streamingBlock, streamingChars, done, sources };
}

/* ─── Streaming block renderer ───────────────────────────── */
const StreamingBlock = ({ block, chars, sources }) => {
  if (!block) return null;

  if (block.type === "heading") {
    return (
      <h3 className="gpt-heading">
        {block.text.slice(0, chars)}
        <span className="gpt-cursor" />
      </h3>
    );
  }

  if (block.type === "paragraph") {
    const visible = block.text.slice(0, chars);
    const parts = visible.split(/(\*\*.*?\*\*|\[\d+\])/g);
    return (
      <p className="gpt-paragraph">
        {parts.map((part, i) => {
          if (/^\*\*.*\*\*$/.test(part))
            return <strong key={i}>{part.slice(2, -2)}</strong>;
          const cm = part.match(/^\[(\d+)\]$/);
          if (cm) {
            const n = parseInt(cm[1], 10);
            return (
              <a
                key={i}
                href={sources?.[n - 1]?.url ?? "#"}
                target="_blank"
                rel="noreferrer"
                className="cite-chip"
              >
                {n}
              </a>
            );
          }
          return <span key={i}>{part}</span>;
        })}
        <span className="gpt-cursor" />
      </p>
    );
  }

  if (block.type === "bullets") {
    const fullText = block.items.map((b) => b.text).join("\n");
    const visibleText = fullText.slice(0, chars);
    const visibleLines = visibleText.split("\n");
    return (
      <ul className="gpt-bullets">
        {visibleLines.map((line, i) => {
          const origItem = block.items[i];
          const isLast = i === visibleLines.length - 1;
          const fullLine = origItem?.text ?? "";
          const isComplete = !isLast || line === fullLine;
          const parts = line.split(/(\*\*.*?\*\*)/g);
          return (
            <li key={i}>
              {parts.map((p, j) =>
                /^\*\*.*\*\*$/.test(p) ? (
                  <strong key={j}>{p.slice(2, -2)}</strong>
                ) : (
                  <span key={j}>{p}</span>
                ),
              )}
              {isLast && <span className="gpt-cursor" />}
              {isComplete && origItem?.cite != null && (
                <a
                  href={sources?.[origItem.cite - 1]?.url ?? "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="cite-chip"
                >
                  {origItem.cite}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    );
  }

  return null;
};

/* ─── Main Component ──────────────────────────────────────── */
const ChatView = ({ onSearch, results, loading, query, setQuery }) => {
  const [submitted, setSubmitted] = useState(false);
  const [lastQuery, setLastQuery] = useState("");
  const chatEndRef = useRef(null);

  const streamActive = results.length > 0 && !loading;
  const { fullyRevealedBlocks, streamingBlock, streamingChars, done } =
    useStreaming(streamActive, results);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [fullyRevealedBlocks, streamingChars, loading]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLastQuery(query);
    setSubmitted(true);
    onSearch(query);
  };

  const recentChats = [
    "Nanoparticles in Sunscreen",

  ];

  return (
    <div className="gpt-layout">
      {/* Sidebar */}
      <aside className="gpt-sidebar">
        <div className="gpt-sidebar-top-nav">
          <div className="gpt-side-nav-item">
            <span className="gpt-side-nav-icon">📝</span>
            <span>New chat</span>
          </div>
          <div className="gpt-side-nav-item">
            <span className="gpt-side-nav-icon">🔍</span>
            <span>Search chats</span>
          </div>
          <div className="gpt-side-nav-item">
            <span className="gpt-side-nav-icon">🖼️</span>
            <span>Images</span>
          </div>
          <div className="gpt-side-nav-item">
            <span className="gpt-side-nav-icon">📱</span>
            <span>Apps</span>
          </div>
        </div>

        <div className="gpt-sidebar-section-label">Recent</div>
        <div className="gpt-recent-chats">
          {recentChats.map((chat, idx) => (
            <div
              key={idx}
              className={`gpt-recent-item ${idx === 0 ? "active" : ""}`}
            >
              {chat}
            </div>
          ))}
        </div>

        <div className="gpt-sidebar-footer">
          <div className="gpt-user-profile">
            <div className="gpt-avatar-small">U</div>
            <span>User</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="gpt-main">
        <header className="gpt-header">
          <div className="gpt-header-title">
            <span>ChatGPT</span>
            <span>▼</span>
          </div>
        </header>

        <div className="gpt-conversation">
          {!submitted && !loading ? (
            <div
              className="gpt-welcome"
              style={{ padding: "100px 20px", textAlign: "center" }}
            >
              <h1 style={{ fontSize: "32px", marginBottom: "40px" }}>
                How can I help you today?
              </h1>
            </div>
          ) : (
            <>
              {/* User turn */}
              <div className="gpt-turn gpt-user-turn">
                <div className="gpt-user-bubble">{lastQuery}</div>
              </div>

              {/* Assistant turn */}
              <div className="gpt-turn gpt-assistant-turn">
                <div className="gpt-assistant-avatar">
                  <svg width="24" height="24" viewBox="0 0 41 41" fill="none">
                    <path
                      d="M37.532 16.87a9.963 9.963 0 0 0-.856-8.184 10.078 10.078 0 0 0-10.855-4.835 9.964 9.964 0 0 0-6.4-3.955 10.079 10.079 0 0 0-10.121 4.931 9.963 9.963 0 0 0-6.664 4.834 10.079 10.079 0 0 0 1.24 11.817 9.965 9.965 0 0 0 .856 8.185 10.079 10.079 0 0 0 10.855 4.835 9.965 9.965 0 0 0 6.4 3.954 10.079 10.079 0 0 0 10.121-4.931 9.963 9.963 0 0 0 6.664-4.834 10.079 10.079 0 0 0-1.24-11.817z"
                      fill="white"
                    />
                  </svg>
                </div>
                <div className="gpt-assistant-content">
                  {loading && <div className="gpt-searching">Thinking...</div>}
                  {streamActive && (
                    <div className="gpt-answer">
                      {fullyRevealedBlocks.map((block, i) => (
                        <SummaryBlock key={i} block={block} sources={results} />
                      ))}
                      <StreamingBlock
                        block={streamingBlock}
                        chars={streamingChars}
                        sources={results}
                      />

                      {done && (
                        <div
                          className="gpt-divider"
                          style={{ marginTop: "40px" }}
                        />
                      )}

                      {done && (
                        <div className="gpt-sources-list">
                          <p
                            style={{
                              fontSize: "14px",
                              color: "#666",
                              marginBottom: "16px",
                            }}
                          >
                            Ready-to-cite sources:
                          </p>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "12px",
                            }}
                          >
                            {results.map((src) => (
                              <a
                                key={src.id}
                                href={src.url}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  textDecoration: "none",
                                  fontSize: "14px",
                                }}
                              >
                                <span
                                  style={{
                                    color: "#000",
                                    fontWeight: "600",
                                  }}
                                >
                                  {src.source}
                                </span>{" "}
                                —{" "}
                                <span style={{ color: "#0d0d0d" }}>
                                  {src.title}
                                </span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Bottom Input Area */}
        <div className="gpt-input-area">
          {/*<div className="gpt-limit-banner">
            <span className="gpt-banner-text">
              You're using a less powerful model until your limit resets after
              1:51 PM.
            </span>
            <a href="#" className="gpt-banner-link">
              Claim free offer
            </a>
         </div> */}

          <div className="gpt-input-wrapper">
            <form onSubmit={handleSend} className="gpt-input-pill">
              <div className="gpt-plus-btn">＋</div>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask anything"
                rows="1"
                className="gpt-textarea"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) handleSend(e);
                }}
              />
              <div className="gpt-input-tools">
                <span className="gpt-tool-icon">🌐</span>
                <span className="gpt-tool-icon">📁</span>
                <span className="gpt-tool-icon">🎙️</span>
                <button
                  type="submit"
                  disabled={!query.trim() || loading}
                  className="gpt-send-btn"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 11l5-5 5 5M12 6v12" />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          <div className="gpt-footer-note">
            ChatGPT can make mistakes. Check important info. See{" "}
            <a href="#" className="gpt-footer-link">
              Cookie Preferences
            </a>
            .
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatView;
