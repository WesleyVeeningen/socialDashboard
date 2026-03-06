"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import CommentsPanel from "./CommentsPanel";

export default function PostCard({ platform, message, date, likes, comments, shares, imageUrl, color, postId, postUrl }) {
  const [showComments, setShowComments] = useState(false);
  const [localCommentCount, setLocalCommentCount] = useState(comments ?? 0);

  useEffect(() => {
    setLocalCommentCount(comments ?? 0);
  }, [comments]);

  const handleCommentAdded = () => setLocalCommentCount((c) => c + 1);
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "";

  const truncated = message && message.length > 200;
  const displayMsg = truncated ? message.slice(0, 200) + "…" : message;

  return (
    <>
      <div className="post-card">
        {/* Top accent bar */}
        <div className="post-accent" style={{ background: color }} />

        <div className="post-inner">
          {/* Meta row */}
          <div className="post-meta">
            <span className="post-platform-badge" style={{ background: `${color}20`, color, borderColor: `${color}40` }}>
              {platform}
            </span>
            <span className="post-date">{formattedDate}</span>
          </div>

          {/* Image */}
          {imageUrl && (
            <div className="post-image-wrap">
              <Image
                src={imageUrl}
                alt="post media"
                className="post-image"
                width={600}
                height={220}
                unoptimized
                style={{ width: "100%", height: "auto", maxHeight: 220, objectFit: "cover", borderRadius: 8 }}
              />
            </div>
          )}

          {/* Message */}
          {message && <p className="post-message">{displayMsg}</p>}

          {/* Stats row */}
          <div className="post-stats">
            <div className="post-stat-group">
              <span className="post-stat" title="Likes">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#f45b69" }}>
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                <span>{(likes ?? 0).toLocaleString()}</span>
              </span>

              <span className="post-stat" title="Comments">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent-blue)" }}>
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
                <span>{localCommentCount.toLocaleString()}</span>
              </span>

              {shares !== undefined && (
                <span className="post-stat" title="Shares">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--success)" }}>
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                  <span>{shares.toLocaleString()}</span>
                </span>
              )}
            </div>

            <div className="post-action-group">
              {postId && (
                <button
                  className="post-action-btn"
                  style={showComments ? { color, borderColor: `${color}60`, background: `${color}12` } : {}}
                  onClick={() => setShowComments((v) => !v)}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                  </svg>
                  {showComments ? "Hide" : "Comments"}
                </button>
              )}
              {postUrl && (
                <a
                  href={postUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="post-action-btn post-view-link"
                  style={{ color }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  View post
                </a>
              )}
            </div>
          </div>

          {/* Comments panel */}
          {showComments && postId && (
            <CommentsPanel postId={postId} platform={platform} color={color} postUrl={postUrl} onCommentAdded={handleCommentAdded} />
          )}
        </div>
      </div>

      <style>{`
        .post-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 14px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: box-shadow 0.2s ease, transform 0.15s ease;
        }
        .post-card:hover {
          box-shadow: 0 4px 20px rgba(0,0,0,0.25);
          transform: translateY(-1px);
        }
        .post-accent {
          height: 3px;
          width: 100%;
          flex-shrink: 0;
        }
        .post-inner {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex: 1;
        }
        .post-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .post-platform-badge {
          font-size: 11px;
          font-weight: 700;
          padding: 3px 9px;
          border-radius: 6px;
          border: 1px solid transparent;
          text-transform: uppercase;
          letter-spacing: 0.6px;
        }
        .post-date {
          font-size: 12px;
          color: var(--text-secondary);
        }
        .post-image-wrap {
          border-radius: 8px;
          overflow: hidden;
        }
        .post-message {
          font-size: 14px;
          color: var(--text-primary);
          line-height: 1.65;
          word-break: break-word;
        }
        .post-stats {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding-top: 8px;
          border-top: 1px solid var(--border);
          flex-wrap: wrap;
        }
        .post-stat-group {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .post-stat {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 13px;
          color: var(--text-secondary);
          font-weight: 500;
        }
        .post-action-group {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .post-action-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          background: none;
          border: 1px solid var(--border);
          border-radius: 7px;
          color: var(--text-secondary);
          font-size: 12px;
          font-weight: 600;
          padding: 5px 10px;
          cursor: pointer;
          transition: all 0.15s;
          text-decoration: none;
          white-space: nowrap;
          font-family: inherit;
        }
        .post-action-btn:hover {
          border-color: var(--text-secondary);
          color: var(--text-primary);
        }
        .post-view-link:hover {
          border-color: currentColor;
          text-decoration: none;
        }
      `}</style>
    </>
  );
}
