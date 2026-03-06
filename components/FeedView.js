"use client";

import { useState, useMemo } from "react";
import PostCard from "./PostCard";

export default function FeedView({ posts, title = "Feed", reportLabel = "" }) {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [keyword, setKeyword] = useState("");
  const [platforms, setPlatforms] = useState({ Facebook: true }); // Twitter: true 

  const togglePlatform = (name) =>
    setPlatforms((prev) => ({ ...prev, [name]: !prev[name] }));

  const clearFilters = () => {
    setFromDate("");
    setToDate("");
    setKeyword("");
    setPlatforms({ Facebook: true, Twitter: true });
  };

  const filtered = useMemo(() => {
    const kwLower = keyword.trim().toLowerCase();
    const fromTs = fromDate ? new Date(fromDate).getTime() : null;
    const toTs = toDate ? new Date(toDate + "T23:59:59").getTime() : null;
    return posts.filter((p) => {
      const platformKey = p.platform === "Twitter / X" ? "Twitter" : p.platform;
      if (!platforms[platformKey]) return false;
      if (p.date) {
        const postTs = new Date(p.date).getTime();
        if (fromTs !== null && postTs < fromTs) return false;
        if (toTs !== null && postTs > toTs) return false;
      }
      if (kwLower && !(p.message ?? "").toLowerCase().includes(kwLower)) return false;
      return true;
    });
  }, [posts, platforms, fromDate, toDate, keyword]);

  const activeFilters = fromDate || toDate || keyword.trim();

  const handlePrint = () => window.print();

  const printSubtitle = [
    fromDate && toDate
      ? `${fromDate} – ${toDate}`
      : fromDate
      ? `vanaf ${fromDate}`
      : toDate
      ? `tot ${toDate}`
      : "",
    keyword.trim() ? `tag: "${keyword.trim()}"` : "",
  ]
    .filter(Boolean)
    .join("  ·  ");

  return (
    <>
      {/* Print header – hidden on screen, shown in print */}
      <div className="print-header">
        <div className="print-logo">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4f8ef7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          <span className="print-logo-text">mijnzetel.nl</span>
        </div>
        <div className="print-meta">
          <h1 className="print-title">{title}</h1>
          {printSubtitle && <p className="print-subtitle">{printSubtitle}</p>}
          <p className="print-date">Gegenereerd op: {new Date().toLocaleDateString("nl-NL", { year: "numeric", month: "long", day: "numeric" })}</p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="feed-filters no-print">
        <div className="filter-row">
          <div className="filter-group">
            <label className="filter-label">Van</label>
            <input
              type="date"
              className="filter-input"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label className="filter-label">Tot</label>
            <input
              type="date"
              className="filter-input"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <div className="filter-group filter-grow">
            <label className="filter-label">Zoekterm / Tag</label>
            <input
              type="text"
              className="filter-input"
              placeholder="bijv. VVD, Rutte, klimaat…"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
        </div>
        <div className="filter-row filter-row-bottom">
          <div className="platform-toggles">
            {["Facebook"].map((name) => ( // "Twitter" can be added back when Twitter/X API access is set up
              <button
                key={name}
                className={`platform-toggle ${platforms[name] ? "active" : ""}`}
                style={platforms[name] ? { borderColor: name === "Facebook" ? "var(--facebook)" : "var(--twitter)", color: name === "Facebook" ? "var(--facebook)" : "var(--twitter)" } : {}}
                onClick={() => togglePlatform(name)}
              >
                {name}
              </button>
            ))}
          </div>
          <div className="filter-actions">
            {activeFilters && (
              <button className="btn-clear" onClick={clearFilters}>
                Wis filters
              </button>
            )}
            <button className="btn-print" onClick={handlePrint}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              Print rapport
            </button>
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="feed-count no-print">
        {filtered.length} {filtered.length === 1 ? "bericht" : "berichten"}
        {activeFilters ? " gevonden" : " totaal"}
      </p>

      {/* Posts */}
      {filtered.length === 0 ? (
        <div className="feed-empty">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <p>Geen berichten gevonden voor deze filters.</p>
        </div>
      ) : (
        <div className="posts-grid">
          {filtered.map((p) => (
            <PostCard
              key={`${p.platform}-${p.id}`}
              platform={p.platform}
              message={p.message}
              date={p.date}
              likes={p.likes}
              comments={p.comments}
              shares={p.shares}
              color={p.color}
              postId={p.id}
              postUrl={p.postUrl}
            />
          ))}
        </div>
      )}

      <style>{`
        /* Print header – hidden on screen */
        .print-header {
          display: none;
          align-items: center;
          gap: 20px;
          padding-bottom: 20px;
          border-bottom: 2px solid #cccccc;
          margin-bottom: 24px;
        }
        .print-logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .print-logo-text {
          font-size: 22px;
          font-weight: 800;
          color: #1a2a6e;
        }
        .print-meta { flex: 1; }
        .print-title { font-size: 20px; font-weight: 700; color: #111; }
        .print-subtitle { font-size: 13px; color: #555; margin-top: 3px; }
        .print-date { font-size: 11px; color: #888; margin-top: 4px; }

        /* Filters */
        .feed-filters {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 16px 18px;
          margin-bottom: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .filter-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          align-items: flex-end;
        }
        .filter-row-bottom {
          justify-content: space-between;
          align-items: center;
        }
        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 140px;
        }
        .filter-grow { flex: 1; }
        .filter-label {
          font-size: 11px;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.6px;
        }
        .filter-input {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 8px 10px;
          color: var(--text-primary);
          font-size: 13px;
          font-family: inherit;
          width: 100%;
        }
        .filter-input:focus { outline: none; border-color: var(--accent-blue); }
        .filter-input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.7); }

        .platform-toggles {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .platform-toggle {
          padding: 6px 14px;
          border-radius: 20px;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text-secondary);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
        }
        .platform-toggle.active {
          background: rgba(79,142,247,0.1);
        }

        .filter-actions {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .btn-clear {
          background: none;
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text-secondary);
          font-size: 13px;
          padding: 7px 14px;
          cursor: pointer;
          transition: all 0.15s;
        }
        .btn-clear:hover { border-color: var(--danger); color: var(--danger); }
        .btn-print {
          display: flex;
          align-items: center;
          gap: 7px;
          background: var(--accent-blue);
          border: none;
          border-radius: 8px;
          color: white;
          font-size: 13px;
          font-weight: 600;
          padding: 8px 16px;
          cursor: pointer;
          transition: opacity 0.15s;
        }
        .btn-print:hover { opacity: 0.85; }

        .feed-count {
          font-size: 13px;
          color: var(--text-secondary);
          margin-bottom: 14px;
        }
        .posts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 14px;
        }
        .feed-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 60px 20px;
          color: var(--text-secondary);
          text-align: center;
          font-size: 14px;
        }
      `}</style>
    </>
  );
}
