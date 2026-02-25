"use client";

import { useState, useEffect } from "react";

export default function CommentsPanel({ postId, platform, color }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const platformPath =
    platform === "Facebook"
      ? "facebook"
      : platform === "Instagram"
      ? "instagram"
      : "twitter";

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/social/${platformPath}/posts/${postId}/comments`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setComments(data.comments ?? []);
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load comments.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [postId, platformPath]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/social/${platformPath}/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: reply }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error ?? "Failed to post reply.");
      } else {
        setReply("");
        setSuccessMsg("Reply posted!");
        setTimeout(() => setSuccessMsg(null), 3000);
        // Refresh comments
        const refreshRes = await fetch(`/api/social/${platformPath}/posts/${postId}/comments`);
        const refreshData = await refreshRes.json();
        setComments(refreshData.comments ?? []);
      }
    } catch {
      setError("Failed to post reply.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="cp-panel">
        <div className="cp-list">
          {loading ? (
            <p className="cp-empty">Loading comments…</p>
          ) : comments.length === 0 ? (
            <p className="cp-empty">No comments yet. Be the first!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="cp-comment">
                <div className="cp-comment-header">
                  <span className="cp-author">{comment.author}</span>
                  <span className="cp-time">
                    {new Date(comment.created_time ?? comment.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <p className="cp-text">{comment.text}</p>
                {comment.likes > 0 && (
                  <span className="cp-likes">❤️ {comment.likes}</span>
                )}
              </div>
            ))
          )}
        </div>

        <form className="cp-form" onSubmit={handleSubmit}>
          <textarea
            className="cp-input"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Write a reply…"
            rows={2}
          />
          {error && <p className="cp-error">{error}</p>}
          {successMsg && <p className="cp-success">{successMsg}</p>}
          <button
            type="submit"
            className="cp-submit"
            style={{ background: color }}
            disabled={submitting || !reply.trim()}
          >
            {submitting ? "Posting…" : "Post Reply"}
          </button>
        </form>
      </div>

      <style>{`
        .cp-panel { padding-top: 12px; border-top: 1px solid var(--border); }
        .cp-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; max-height: 220px; overflow-y: auto; }
        .cp-comment { background: var(--bg-secondary); border-radius: 8px; padding: 10px 12px; }
        .cp-comment-header { display: flex; justify-content: space-between; margin-bottom: 4px; }
        .cp-author { font-size: 12px; font-weight: 600; color: var(--text-primary); }
        .cp-time { font-size: 11px; color: var(--text-secondary); }
        .cp-text { font-size: 13px; color: var(--text-primary); line-height: 1.5; }
        .cp-likes { font-size: 11px; color: var(--text-secondary); margin-top: 4px; display: inline-block; }
        .cp-empty { font-size: 13px; color: var(--text-secondary); text-align: center; padding: 8px 0; }
        .cp-form { display: flex; flex-direction: column; gap: 8px; }
        .cp-input {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 8px 12px;
          color: var(--text-primary);
          font-size: 13px;
          resize: vertical;
          font-family: inherit;
          width: 100%;
        }
        .cp-input:focus { outline: none; border-color: var(--accent-blue); }
        .cp-error { font-size: 12px; color: var(--danger); }
        .cp-success { font-size: 12px; color: var(--success); }
        .cp-submit {
          padding: 7px 16px;
          border: none;
          border-radius: 8px;
          color: white;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.15s;
          align-self: flex-end;
        }
        .cp-submit:disabled { opacity: 0.5; cursor: default; }
      `}</style>
    </>
  );
}
