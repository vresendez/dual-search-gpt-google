import React from "react";
import { useParams, Link } from "react-router-dom";
import { CURATED_RESULTS } from "../services/searchService";
import sdLogo from "../images/sciencedirect-logo-vector.png";
import elsevierLogo from "../images/Elsevier_logo_2019.svg";
import guardianLogo from "../images/the-guardian-logo.jpg";
import heroImage from "../images/sunscreen.avif";
import authorImage from "../images/Madeline_Aggeler-guardian.avif";
import pubmedLogo from "../images/US-NLM-PubMed-Logo.svg.png";
import ecLogo from "../images/ec-logo-horiz_en.png";
import wikiLogo from "../images/wikipedia_logo_icon_144738.webp";
import whoLogo from "../images/who-logo.png";

/* ── Content parser ───────────────────────────────────────── */
const parseContent = (text) =>
    text.split("\n").map((line, i) => {
        if (line.startsWith("### "))
            return { type: "h3", text: line.slice(4), key: i };
        if (line.startsWith("## "))
            return { type: "h2", text: line.slice(3), key: i };
        if (line.startsWith("- ")) {
            const parts = line
                .slice(2)
                .split(/(\*\*.*?\*\*)/g)
                .map((p, j) =>
                    /^\*\*.*\*\*$/.test(p) ? (
                        <strong key={j}>{p.slice(2, -2)}</strong>
                    ) : (
                        p
                    ),
                );
            return { type: "li", content: parts, key: i };
        }
        if (line.trim() === "") return { type: "space", key: i };
        const parts = line
            .split(/(\*\*.*?\*\*)/g)
            .map((p, j) =>
                /^\*\*.*\*\*$/.test(p) ? <strong key={j}>{p.slice(2, -2)}</strong> : p,
            );
        return { type: "p", content: parts, key: i };
    });

const renderBlocks = (blocks, listClass, h2Class, pClass) => {
    const result = [];
    let listItems = [];
    const flushList = () => {
        if (listItems.length) {
            result.push(
                <ul key={`ul-${listItems[0].key}`} className={listClass}>
                    {listItems}
                </ul>,
            );
            listItems = [];
        }
    };
    blocks.forEach((b) => {
        if (b.type === "li") {
            listItems.push(<li key={b.key}>{b.content}</li>);
        } else {
            flushList();
            if (b.type === "h2")
                result.push(
                    <h3 key={b.key} className={h2Class}>
                        {b.text}
                    </h3>,
                );
            else if (b.type === "h3")
                result.push(
                    <h4 key={b.key} className={h2Class}>
                        {b.text}
                    </h4>,
                );
            else if (b.type === "p")
                result.push(
                    <p key={b.key} className={pClass}>
                        {b.content}
                    </p>,
                );
            else result.push(<div key={b.key} className="block-spacer" />);
        }
    });
    flushList();
    return result;
};

/* ── 1. PUBMED style ─────────────────────────────────────── */
const PubmedPage = ({ res }) => {
    const blocks = parseContent(res.fullContent);
    return (
        <div className="art-pubmed">
            <header className="art-pubmed-header">
                <div className="art-pubmed-header-top">
                    <span className="art-pm-ncbi">NIH</span>
                    <span className="art-pm-nlm">National Library of Medicine</span>
                </div>
                <div className="art-pubmed-header-main">
                    <img src={pubmedLogo} alt="PubMed" className="art-pm-logo" />
                </div>
            </header>
            <div className="art-pubmed-body">
                <div className="art-pm-main">
                    <div className="art-pm-source">
                        {res.journal} · {res.year}
                    </div>
                    <h1 className="art-pm-title">{res.title}</h1>
                    <div className="art-pm-authors">{res.authors}</div>
                    <div className="art-pm-meta">
                        <span>DOI: {res.doi}</span>
                        {res.volume && (
                            <span>
                                {" "}
                                · Vol {res.volume}({res.issue}): {res.pages}
                            </span>
                        )}
                        <span className="art-pm-badge art-pm-badge--free">
                            Free Article
                        </span>
                    </div>
                    <section className="art-pm-section">
                        <h2 className="art-pm-sec-title">Abstract</h2>
                        <div className="art-pm-content">
                            {renderBlocks(blocks, "art-pm-list", "art-pm-h3", "art-pm-p")}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

/* ── 2. EC LAYMAN style ─────────────────────────────────── */
const EuLaymanPage = ({ res }) => {
    const blocks = parseContent(res.fullContent);
    return (
        <div className="art-eu-layman">
            <header className="art-eu-l-header">
                <div className="art-eu-l-header-inner">
                    <div className="art-eu-l-brand">
                        <img
                            src={ecLogo}
                            alt="European Commission"
                            className="art-eu-l-logo"
                        />
                    </div>
                </div>
            </header>
            <div className="art-eu-l-subheader">
                <div className="art-eu-l-header-inner">
                    <div className="art-eu-l-site">
                        Public Health / Scientific Committees
                    </div>
                </div>
            </div>
            <div className="art-eu-l-nav">
                <div className="art-eu-l-header-inner">
                    <span className="art-eu-crumb">Opinions</span>{" "}
                    <span className="art-eu-sep">›</span>{" "}
                    <span className="art-eu-crumb">Zinc Oxide</span>{" "}
                    <span className="art-eu-sep">›</span>
                    <span className="art-eu-crumb active">Layman summary</span>
                </div>
            </div>
            <div className="art-eu-l-body">
                <div className="art-eu-l-header-inner layout-split">
                    <div className="art-eu-l-sidebar">
                        <div className="art-eu-l-toc">
                            <div className="art-eu-l-toc-header">PAGE CONTENTS</div>
                            <ul>
                                <li>1. Introduction</li>
                                <li>2. Dermal Exposure</li>
                                <li>3. Inhalation Risk</li>
                                <li>4. Final Conclusion</li>
                            </ul>
                        </div>
                    </div>
                    <div className="art-eu-l-main">
                        <div className="art-eu-l-id">Reference: {res.doi}</div>
                        <h1 className="art-eu-l-title">{res.title}</h1>
                        <div className="art-eu-l-content">
                            {renderBlocks(
                                blocks,
                                "art-eu-l-list",
                                "art-eu-l-h3",
                                "art-eu-l-p",
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ── 3. WIKIPEDIA style ─────────────────────────────────── */
const WikipediaPage = ({ res }) => {
    const blocks = parseContent(res.fullContent);
    return (
        <div className="art-wiki">
            <div className="art-wiki-sidebar">
                <div className="art-wiki-logo-container">
                    <img src={wikiLogo} alt="Wikipedia" className="art-wiki-logo-img" />
                </div>
                <ul className="art-wiki-nav">
                    <li>Main page</li>
                    <li>Contents</li>
                    <li>Current events</li>
                    <li>Random article</li>
                </ul>
            </div>
            <div className="art-wiki-body">
                <div className="art-wiki-tabs">
                    <span className="art-wiki-tab art-wiki-tab--active">Article</span>
                    <span className="art-wiki-tab">Talk</span>
                    <div className="art-wiki-actions">
                        <span>Read</span>
                        <span>Edit</span>
                        <span>View history</span>
                    </div>
                </div>
                <div className="art-wiki-main">
                    <h1 className="art-wiki-title">{res.title}</h1>
                    <div className="art-wiki-subtitle">
                        From Wikipedia, the free encyclopedia
                    </div>
                    <div className="art-wiki-content-row">
                        <div className="art-wiki-content">
                            <p className="art-wiki-intro">
                                <strong>{res.title.split(":")[0]}</strong> is an article
                                covering {res.snippet.toLowerCase()}
                            </p>
                            {renderBlocks(
                                blocks,
                                "art-wiki-list",
                                "art-wiki-h2",
                                "art-wiki-p",
                            )}
                        </div>
                        <aside className="art-wiki-infobox">
                            <div className="art-wiki-ib-head">{res.title.split(":")[0]}</div>
                            <div className="art-wiki-ib-img">🔬</div>
                            <table className="art-wiki-ib-table">
                                <tbody>
                                    <tr>
                                        <th>Subject</th>
                                        <td>Nanomaterials</td>
                                    </tr>
                                    <tr>
                                        <th>Classification</th>
                                        <td>Inorganic filter</td>
                                    </tr>
                                    <tr>
                                        <th>Usage</th>
                                        <td>Sunscreen</td>
                                    </tr>
                                    <tr>
                                        <th>Regulatory status</th>
                                        <td>Approved (SCCS)</td>
                                    </tr>
                                </tbody>
                            </table>
                        </aside>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ── 4. THE GUARDIAN style ─────────────────────────────── */
const GuardianPage = ({ res }) => {
    const blocks = parseContent(res.fullContent);
    return (
        <div className="art-guardian">
            {/* Header / Masthead */}
            <header className="art-g-header">
                <div className="art-g-header-top">
                    <div className="art-g-header-inner">
                        <div className="art-g-support">Support us</div>
                        <div className="art-g-header-links">
                            <span>Print subscriptions</span>
                            <span>Search jobs</span>
                            <span>Sign in</span>
                        </div>
                    </div>
                </div>
                <div className="art-g-masthead">
                    <div className="art-g-header-inner">
                        <img
                            src={guardianLogo}
                            alt="The Guardian"
                            className="art-g-logo-img"
                        />
                    </div>
                </div>
                <nav className="art-g-nav">
                    <div className="art-g-header-inner">
                        <div className="art-g-nav-item art-g-nav-news active">News</div>
                        <div className="art-g-nav-item art-g-nav-opinion">Opinion</div>
                        <div className="art-g-nav-item art-g-nav-sport">Sport</div>
                        <div className="art-g-nav-item art-g-nav-culture">Culture</div>
                        <div className="art-g-nav-item art-g-nav-lifestyle">Lifestyle</div>
                    </div>
                </nav>
            </header>

            <div className="art-g-body">
                {/* Article Top Section */}
                <div className="art-g-kicker">Wellness / Well actually</div>
                <h1 className="art-g-title">{res.title}</h1>
                <div className="art-g-standfirst">
                    Skin cancer is the most common cancer in the US and while sunscreen
                    abounds in aisles, many aren’t applying it correctly
                </div>

                <div className="art-g-meta-row">
                    <div className="art-g-author-box">
                        <img
                            src={authorImage}
                            alt="Madeline Aggeler"
                            className="art-g-author-img"
                        />
                        <div className="art-g-author-info">
                            <div className="art-g-byline">Madeline Aggeler</div>
                            <div className="art-g-author-meta">Tue 4 Jun 2024 11.00 CEST</div>
                        </div>
                    </div>
                    <div className="art-g-social">
                        <div className="art-g-social-icon">f</div>
                        <div className="art-g-social-icon">𝕏</div>
                        <div className="art-g-social-icon">✉</div>
                    </div>
                </div>

                {/* Hero Image */}
                <figure className="art-g-figure">
                    <img
                        src={heroImage}
                        alt="Sunscreen application"
                        className="art-g-hero"
                    />
                    <figcaption className="art-g-caption">
                        <span className="art-g-camera-icon">📷</span> Many of us miss the
                        bits around our ears or on our eyelids. Photograph: Westend61/Getty
                        Images
                    </figcaption>
                </figure>

                <div className="art-g-main-layout">
                    <div className="art-g-content">
                        {renderBlocks(blocks, "art-g-list", "art-g-h2", "art-g-p")}
                    </div>

                    <aside className="art-g-aside">
                        <div className="art-g-aside-section">
                            <h3 className="art-g-aside-title">Most viewed</h3>
                            <ul className="art-g-aside-list">
                                <li>
                                    <span className="art-g-aside-num">1</span>
                                    Is titanium dioxide safe? Experts clarify the risks
                                </li>
                                <li>
                                    <span className="art-g-aside-num">2</span>
                                    Top 10 mineral sunscreens for sensitive skin
                                </li>
                                <li>
                                    <span className="art-g-aside-num">3</span>
                                    Why zinc oxide is clear now: the science of nanoparticles
                                </li>
                                <li>
                                    <span className="art-g-aside-num">4</span>
                                    The environmental impact of chemical sunscreens
                                </li>
                            </ul>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

/* ── 5. SCIENCEDIRECT style ────────────────────────────── */
const ScienceDirectPage = ({ res }) => {
    const blocks = parseContent(res.fullContent);

    /* Extract structured abstract sub-headings from blocks */
    const highlights = [
        "Evaluates UV-protective efficacy and skin penetration of nanoparticulate mineral sunscreens",
        "Nanoparticle formulations confined to stratum corneum on intact skin",
        "Higher SPF and broader UVA protection compared to micronized formulations",
        "Caution advised for application on severely damaged skin barriers",
    ];

    const keywords = [
        "Nanoparticles",
        "Zinc oxide",
        "Titanium dioxide",
        "Sunscreen",
        "SPF",
        "Skin penetration",
        "UV protection",
    ];

    return (
        <div className="art-sd">
            {/* ── Top header bar ── */}
            <header className="art-sd-header">
                <div className="art-sd-header-inner">
                    <div className="art-sd-logo">
                        <img src={sdLogo} alt="ScienceDirect" className="art-sd-logo-img" />
                    </div>
                    <nav className="art-sd-nav">
                        <span className="art-sd-nav-item">Journals &amp; Books</span>
                        <span className="art-sd-nav-item">Search</span>
                    </nav>
                    <div className="art-sd-user">
                        <div className="art-sd-user-item">
                            <span className="art-sd-user-link">Register</span>
                        </div>
                        <div className="art-sd-user-item">
                            <span className="art-sd-user-link art-sd-signin">Sign in</span>
                            <svg
                                className="art-sd-header-icon"
                                viewBox="0 0 24 24"
                                width="20"
                                height="20"
                            >
                                <path
                                    fill="currentColor"
                                    d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                                />
                            </svg>
                        </div>
                        <div className="art-sd-user-item art-sd-inst-item">
                            <svg
                                className="art-sd-header-icon"
                                viewBox="0 0 24 24"
                                width="20"
                                height="20"
                            >
                                <path
                                    fill="currentColor"
                                    d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </header>

            {/* ── Journal sub-header ── */}
            <div className="art-sd-journal-bar">
                <div className="art-sd-journal-bar-inner">
                    <div className="art-sd-journal-icon">📖</div>
                    <div>
                        <div className="art-sd-journal-name">{res.journal}</div>
                        <div className="art-sd-journal-vol">
                            Volume {res.volume}, Issue {res.issue}, {res.year}, Pages{" "}
                            {res.pages}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Body ── */}
            <div className="art-sd-body">
                <div className="art-sd-main">
                    <div className="art-sd-top-row">
                        <img
                            src={elsevierLogo}
                            alt="Elsevier"
                            className="art-sd-elsevier-logo"
                        />
                        <div className="art-sd-article-type">Research Article</div>
                    </div>

                    <h1 className="art-sd-title">{res.title}</h1>

                    {/* Authors with superscripts */}
                    <div className="art-sd-authors">
                        {res.authors.split(", ").map((author, i) => (
                            <span key={i} className="art-sd-author">
                                {author}
                                <sup className="art-sd-aff-sup">
                                    {String.fromCharCode(97 + i)}
                                </sup>
                                {i < res.authors.split(", ").length - 1 && ", "}
                            </span>
                        ))}
                    </div>

                    {/* Affiliations */}
                    <div className="art-sd-affiliations">
                        <div className="art-sd-aff-item">
                            <sup>a</sup> Department of Dermatology, College of Veterinary
                            Medicine, North Carolina State University, Raleigh, NC, USA
                        </div>
                    </div>

                    {/* Date and DOI */}
                    <div className="art-sd-dates">
                        <span>Received 15 March {res.year}</span>
                        <span className="art-sd-date-sep">•</span>
                        <span>Revised 2 May {res.year}</span>
                        <span className="art-sd-date-sep">•</span>
                        <span>Accepted 10 May {res.year}</span>
                        <span className="art-sd-date-sep">•</span>
                        <span>Available online 24 May {res.year}</span>
                    </div>

                    <div className="art-sd-doi">
                        <span className="art-sd-doi-icon">🔗</span>
                        <a href={`https://doi.org/${res.doi}`} className="art-sd-doi-link">
                            https://doi.org/{res.doi}
                        </a>
                    </div>

                    <div className="art-sd-license">
                        <span className="art-sd-cc-badge">⊛</span> Under a Creative Commons
                        license
                        <span className="art-sd-open-access">open access</span>
                    </div>

                    <hr className="art-sd-divider" />

                    {/* Highlights */}
                    <section className="art-sd-highlights">
                        <h2 className="art-sd-section-title">Highlights</h2>
                        <ul className="art-sd-highlights-list">
                            {highlights.map((h, i) => (
                                <li key={i}>{h}</li>
                            ))}
                        </ul>
                    </section>

                    <hr className="art-sd-divider" />

                    {/* Abstract */}
                    <section className="art-sd-abstract-section">
                        <h2 className="art-sd-section-title">Abstract</h2>
                        <div className="art-sd-content">
                            {renderBlocks(blocks, "art-sd-list", "art-sd-h3", "art-sd-p")}
                        </div>
                    </section>

                    <hr className="art-sd-divider" />

                    {/* Keywords */}
                    <section className="art-sd-keywords-section">
                        <h2 className="art-sd-kw-label">Keywords</h2>
                        <div className="art-sd-kw-chips">
                            {keywords.map((kw, i) => (
                                <span key={i} className="art-sd-kw-chip">
                                    {kw}
                                </span>
                            ))}
                        </div>
                    </section>
                </div>

                {/* ── Sidebar ── */}
                <aside className="art-sd-aside">
                    <button className="art-sd-download-btn">⬇ Download PDF</button>

                    <div className="art-sd-aside-section">
                        <div className="art-sd-aside-heading">Article outline</div>
                        <ul className="art-sd-outline-list">
                            <li className="art-sd-outline-active">Abstract</li>
                            <li>Introduction</li>
                            <li>Methodology</li>
                            <li>Results</li>
                            <li>Conclusion</li>
                            <li>Keywords</li>
                        </ul>
                    </div>

                    <div className="art-sd-aside-section">
                        <div className="art-sd-aside-heading">
                            Cited by ({Math.floor(Math.random() * 80) + 30})
                        </div>
                        <div className="art-sd-metrics-row">
                            <div className="art-sd-metric-badge">
                                <div className="art-sd-metric-num">
                                    {Math.floor(Math.random() * 40) + 10}
                                </div>
                                <div className="art-sd-metric-label">Mendeley</div>
                            </div>
                        </div>
                    </div>

                    <div className="art-sd-aside-section">
                        <div className="art-sd-aside-heading">Recommended articles</div>
                        <div className="art-sd-rec-entry">
                            <div className="art-sd-rec-title">
                                Nanoparticle sunscreen safety: A review
                            </div>
                            <div className="art-sd-rec-journal">
                                Int. J. Cosmetic Sci., 2020
                            </div>
                        </div>
                        <div className="art-sd-rec-entry">
                            <div className="art-sd-rec-title">
                                Dermal absorption of titanium dioxide
                            </div>
                            <div className="art-sd-rec-journal">Toxicology Letters, 2018</div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

/* ── 6. WHO style ────────────────────────────────────────── */
const WhoPage = ({ res }) => {
    const blocks = parseContent(res.fullContent);
    return (
        <div className="art-who">
            <header className="art-who-header">
                <div className="art-who-header-top">
                    <div className="art-who-header-inner-top">
                        <span>Home</span>
                        <span>Health topics</span>
                        <span>Countries</span>
                        <span>Newsroom</span>
                        <span>Emergencies</span>
                        <span>Data</span>
                        <span>About WHO</span>
                    </div>
                </div>
                <div className="art-who-header-main">
                    <div className="art-who-header-inner">
                        <img src={whoLogo} alt="World Health Organization" className="art-who-logo" />
                    </div>
                </div>
            </header>
            <div className="art-who-nav-banner">
                <div className="art-who-header-inner">
                    <div className="art-who-crumb">Newsroom</div>
                    <div className="art-who-crumb-sep">&gt;</div>
                    <div className="art-who-crumb">Fact sheets</div>
                    <div className="art-who-crumb-sep">&gt;</div>
                    <div className="art-who-crumb">Detail</div>
                    <div className="art-who-crumb-sep">&gt;</div>
                    <div className="art-who-crumb active">Ultraviolet radiation</div>
                </div>
            </div>
            <div className="art-who-body">
                <div className="art-who-doctype">
                    Technical Report · {res.doi} · {res.year}
                </div>
                <h1 className="art-who-title">{res.title}</h1>
                <div className="art-who-attribution">Published by: {res.authors}</div>
                <div className="art-who-highlight-box">
                    <div className="art-who-highlight-icon">ℹ</div>
                    <p>{res.snippet}</p>
                </div>
                <div className="art-who-content">
                    {renderBlocks(blocks, "art-who-list", "art-who-h3", "art-who-p")}
                </div>
                <div className="art-who-licence">
                    © World Health Organization {res.year}. Some rights reserved.
                </div>
            </div>
        </div>
    );
};

/* ── Router ──────────────────────────────────────────────── */
const STYLE_MAP = {
    pubmed: PubmedPage,
    ec_layman: EuLaymanPage,
    wikipedia: WikipediaPage,
    guardian: GuardianPage,
    sciencedirect: ScienceDirectPage,
    who: WhoPage,
};

const ArticlePage = () => {
    const { id } = useParams();
    const idx = parseInt(id, 10) - 1;
    const res = CURATED_RESULTS[idx];

    if (!res) {
        return (
            <div
                style={{ padding: 60, textAlign: "center", fontFamily: "sans-serif" }}
            >
                <h2>Article not found</h2>
                <Link to="/">← Back to search</Link>
            </div>
        );
    }

    const PageComponent = STYLE_MAP[res.articleStyle] || PubmedPage;

    return (
        <div className="art-wrapper">
            <div className="art-back-bar">
                <button onClick={() => window.history.back()} className="art-back-btn">
                    ✕ Close
                </button>
                <span className="art-back-crumb">Study Reference Material</span>
            </div>
            <PageComponent res={res} />
        </div>
    );
};

export default ArticlePage;
