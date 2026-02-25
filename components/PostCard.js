"use client";

import { useState } from "react";
import Image from "next/image";
import CommentsPanel from "./CommentsPanel";

export default function PostCard({ platform, message, date, likes, comments, shares, imageUrl, color, postId }) {
  const [showComments, setShowComments] = useState(false);
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "";

  return (
    <>
      <div className="post-card">
        <div className="post-meta">
          <span className="post-platform" style={{ background: `${color}22`, color }}>{platform}</span>
          <span className="post-date">{formattedDate}</span>
        </div>
        {message && <p className="post-message">{message.length > 180 ? message.slice(0, 180) + "…" : message}</p>}
        {imageUrl && (
          <Image src={imageUrl} alt="post media" className="post-image" width={600} height={200} unoptimized style={{ width: "100%", height: "auto", maxHeight: 200, objectFit: "cover", borderRadius: 8 }} />
        )}
        <div className="post-stats">
          <span className="post-stat">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            {likes?.toLocaleString() ?? 0}
          </span>
          <span className="post-stat">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
            {comments?.toLocaleString() ?? 0}
          </span>
          {shares !== undefined && (
            <span className="post-stat">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              {shares.toLocaleString()}
            </span>
          )}
          {postId && (
            <button
              className="toggle-comments-btn"
              style={{ color }}
              onClick={() => setShowComments((v) => !v)}
            >
              {showComments ? "Hide Comments" : `View Comments`}
            </button>
          )}
        </div>
        {showComments && postId && (
          <CommentsPanel postId={postId} platform={platform} color={color} />
        )}
      </div>

      <style>{`
        .post-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .post-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .post-platform {
          font-size: 11px;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .post-date {
          font-size: 12px;
          color: var(--text-secondary);
        }
        .post-message {
          font-size: 14px;
          color: var(--text-primary);
          line-height: 1.6;
        }
        .post-stats {
          display: flex;
          gap: 16px;
          padding-top: 6px;
          border-top: 1px solid var(--border);
        }
        .post-stat {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 13px;
          color: var(--text-secondary);
        }
        .toggle-comments-btn {
          margin-left: auto;
          background: none;
          border: none;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
      `}</style>
    </>
  );
}
