"use client";

import { useState, useEffect, useCallback } from "react";

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function CommentItem({ comment, color, onReply, replyingTo, replyText, setReplyText, replySubmitting, replyError, onSubmitReply, onCancelReply }) {
  const isReplying = replyingTo === comment.id;

  return (
    <div className="ci-wrap">
      <div className="ci-row">
        <div className="ci-avatar" style={{ background: `${color}33`, color }}>
          {getInitials(comment.author)}
        </div>
        <div className="ci-body">
          <div className="ci-header">
            <span className="ci-author">{comment.author}</span>
            <span className="ci-time">{timeAgo(comment.created_time ?? comment.created_at)}</span>
          </div>
          <p className="ci-text">{comment.text}</p>
          <div className="ci-actions">
            {comment.likes > 0 && (
              <span className="ci-likes">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#f45b69" }}>
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                {comment.likes}
              </span>
            )}
            <button
              className="ci-reply-btn"
              style={isReplying ? { color } : {}}
              onClick={() => (isReplying ? onCancelReply() : onReply(comment.id))}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 17 4 12 9 7" />
                <path d="M20 18v-2a4 4 0 00-4-4H4" />
              </svg>
              {isReplying ? "Cancel" : "Reply"}
            </button>
          </div>

          {isReplying && (
            <form
              className="ci-reply-form"
              onSubmit={(e) => onSubmitReply(e, comment.id)}
            >
              <textarea
                className="ci-reply-input"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Reply to ${comment.author}…`}
                rows={2}
                autoFocus
              />
              {replyError && <p className="ci-reply-error">{replyError}</p>}
              <div className="ci-reply-btns">
                <button
                  type="button"
                  className="ci-cancel-btn"
                  onClick={onCancelReply}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ci-submit-btn"
                  style={{ background: color }}
                  disabled={replySubmitting || !replyText.trim()}
                >
                  {replySubmitting ? "Posting…" : "Post Reply"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CommentsPanel({ postId, platform, color, postUrl }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Per-comment reply state
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [replyError, setReplyError] = useState(null);

  const platformPath =
    platform === "Facebook"
      ? "facebook"
      : platform === "Instagram"
      ? "instagram"
      : "twitter";

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`/api/social/${platformPath}/posts/${postId}/comments`);
      const data = await r.json();
      setComments(data.comments ?? []);
    } catch {
      setError("Failed to load comments.");
    } finally {
      setLoading(false);
    }
  }, [postId, platformPath]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/social/${platformPath}/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newComment }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error ?? "Failed to post comment.");
      } else {
        setNewComment("");
        setSuccessMsg("Comment posted!");
        setTimeout(() => setSuccessMsg(null), 3000);
        await fetchComments();
      }
    } catch {
      setError("Failed to post comment.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReplySubmit = async (e, commentId) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setReplySubmitting(true);
    setReplyError(null);
    try {
      const res = await fetch(`/api/social/${platformPath}/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: replyText, replyTo: commentId }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setReplyError(data.error ?? "Failed to post reply.");
      } else {
        setReplyText("");
        setReplyingTo(null);
        setSuccessMsg("Reply posted!");
        setTimeout(() => setSuccessMsg(null), 3000);
        await fetchComments();
      }
    } catch {
      setReplyError("Failed to post reply.");
    } finally {
      setReplySubmitting(false);
    }
  };

  const handleStartReply = (commentId) => {
    setReplyingTo(commentId);
    setReplyText("");
    setReplyError(null);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyText("");
    setReplyError(null);
  };

  return (
    <>
      <div className="cp-panel">
        {/* Header */}
        <div className="cp-header">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
          <span>{loading ? "Loading…" : `${comments.length} comment${comments.length !== 1 ? "s" : ""}`}</span>
          {postUrl && (
            <a
              href={postUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cp-platform-link"
              style={{ color }}
            >
              Open on {platform} ↗
            </a>
          )}
        </div>

        {/* Comment list */}
        <div className="cp-list">
          {loading ? (
            <div className="cp-empty">
              <div className="cp-spinner" style={{ borderTopColor: color }} />
              <span>Loading comments…</span>
            </div>
          ) : error ? (
            <p className="cp-error-msg">{error}</p>
          ) : comments.length === 0 ? (
            <p className="cp-empty-text">No comments yet. Be the first!</p>
          ) : (
            comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                color={color}
                onReply={handleStartReply}
                replyingTo={replyingTo}
                replyText={replyText}
                setReplyText={setReplyText}
                replySubmitting={replySubmitting}
                replyError={replyError}
                onSubmitReply={handleReplySubmit}
                onCancelReply={handleCancelReply}
              />
            ))
          )}
        </div>

        {/* New comment form */}
        <form className="cp-new-form" onSubmit={handleSubmit}>
          <textarea
            className="cp-new-input"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment…"
            rows={2}
          />
          <div className="cp-new-footer">
            <div>
              {error && <p className="cp-form-error">{error}</p>}
              {successMsg && <p className="cp-form-success">{successMsg}</p>}
            </div>
            <button
              type="submit"
              className="cp-post-btn"
              style={{ background: color }}
              disabled={submitting || !newComment.trim()}
            >
              {submitting ? "Posting…" : "Post Comment"}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .cp-panel {
          margin-top: 12px;
          border-top: 1px solid var(--border);
          padding-top: 14px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .cp-header {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .cp-platform-link {
          margin-left: auto;
          font-size: 12px;
          font-weight: 600;
          text-decoration: underline;
          text-underline-offset: 2px;
          white-space: nowrap;
        }
        .cp-list {
          display: flex;
          flex-direction: column;
          gap: 2px;
          max-height: 320px;
          overflow-y: auto;
          padding-right: 2px;
        }
        .cp-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 20px 0;
          color: var(--text-secondary);
          font-size: 13px;
        }
        .cp-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid var(--border);
          border-top-color: transparent;
          border-radius: 50%;
          animation: cp-spin 0.8s linear infinite;
        }
        @keyframes cp-spin { to { transform: rotate(360deg); } }
        .cp-empty-text {
          font-size: 13px;
          color: var(--text-secondary);
          text-align: center;
          padding: 16px 0;
        }
        .cp-error-msg {
          font-size: 13px;
          color: var(--danger);
          padding: 8px 0;
        }

        /* Comment item */
        .ci-wrap {
          padding: 8px 0;
          border-bottom: 1px solid var(--border);
        }
        .ci-wrap:last-child { border-bottom: none; }
        .ci-row {
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }
        .ci-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
          flex-shrink: 0;
          letter-spacing: 0.5px;
        }
        .ci-body { flex: 1; min-width: 0; }
        .ci-header {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 3px;
        }
        .ci-author {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
        }
        .ci-time {
          font-size: 11px;
          color: var(--text-secondary);
        }
        .ci-text {
          font-size: 13px;
          color: var(--text-primary);
          line-height: 1.55;
          word-break: break-word;
        }
        .ci-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 5px;
        }
        .ci-likes {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: var(--text-secondary);
        }
        .ci-reply-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          background: none;
          border: none;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-secondary);
          padding: 0;
          cursor: pointer;
          transition: color 0.15s;
        }
        .ci-reply-btn:hover { color: var(--text-primary); }

        /* Inline reply form */
        .ci-reply-form {
          margin-top: 8px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          animation: cp-fadein 0.15s ease;
        }
        @keyframes cp-fadein { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: none; } }
        .ci-reply-input {
          width: 100%;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 8px 10px;
          color: var(--text-primary);
          font-size: 13px;
          resize: vertical;
          font-family: inherit;
          transition: border-color 0.15s;
        }
        .ci-reply-input:focus { outline: none; border-color: var(--accent-blue); }
        .ci-reply-error { font-size: 12px; color: var(--danger); }
        .ci-reply-btns {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }
        .ci-cancel-btn {
          background: none;
          border: 1px solid var(--border);
          border-radius: 7px;
          color: var(--text-secondary);
          font-size: 12px;
          font-weight: 600;
          padding: 5px 12px;
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
        }
        .ci-cancel-btn:hover { border-color: var(--text-secondary); color: var(--text-primary); }
        .ci-submit-btn {
          border: none;
          border-radius: 7px;
          color: white;
          font-size: 12px;
          font-weight: 600;
          padding: 5px 14px;
          cursor: pointer;
          transition: opacity 0.15s;
        }
        .ci-submit-btn:disabled { opacity: 0.45; cursor: default; }

        /* New comment form */
        .cp-new-form {
          display: flex;
          flex-direction: column;
          gap: 8px;
          border-top: 1px solid var(--border);
          padding-top: 12px;
        }
        .cp-new-input {
          width: 100%;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 9px 12px;
          color: var(--text-primary);
          font-size: 13px;
          resize: vertical;
          font-family: inherit;
          transition: border-color 0.15s;
        }
        .cp-new-input:focus { outline: none; border-color: var(--accent-blue); }
        .cp-new-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }
        .cp-form-error { font-size: 12px; color: var(--danger); }
        .cp-form-success { font-size: 12px; color: var(--success); }
        .cp-post-btn {
          padding: 7px 16px;
          border: none;
          border-radius: 8px;
          color: white;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.15s;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .cp-post-btn:disabled { opacity: 0.45; cursor: default; }
      `}</style>
    </>
  );
}
