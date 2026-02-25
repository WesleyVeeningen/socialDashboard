import Link from "next/link";

export default function PlatformCard({ name, href, color, icon, followers, posts, engagement, connected }) {
  return (
    <>
      <Link href={href} className="platform-card">
        <div className="platform-header" style={{ borderColor: color }}>
          <span className="platform-icon" style={{ color, background: `${color}22` }}>
            {icon}
          </span>
          <div>
            <p className="platform-name">{name}</p>
            <p className={`platform-status ${connected ? "connected" : "disconnected"}`}>
              {connected ? "● Connected" : "○ Not connected"}
            </p>
          </div>
        </div>
        <div className="platform-stats">
          <div className="pstat">
            <span className="pstat-label">Followers</span>
            <span className="pstat-value">{followers !== undefined ? followers.toLocaleString() : "—"}</span>
          </div>
          <div className="pstat">
            <span className="pstat-label">Posts</span>
            <span className="pstat-value">{posts !== undefined ? posts.toLocaleString() : "—"}</span>
          </div>
          <div className="pstat">
            <span className="pstat-label">Eng. Rate</span>
            <span className="pstat-value">{engagement !== undefined ? `${engagement}%` : "—"}</span>
          </div>
        </div>
        <span className="platform-link">View details →</span>
      </Link>

      <style>{`
        .platform-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          text-decoration: none;
          transition: background 0.15s ease, transform 0.15s ease;
          cursor: pointer;
        }
        .platform-card:hover {
          background: var(--bg-card-hover);
          transform: translateY(-2px);
        }
        .platform-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 14px;
          border-bottom: 1px solid var(--border);
        }
        .platform-icon {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .platform-name {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
        }
        .platform-status {
          font-size: 12px;
          margin-top: 2px;
        }
        .platform-status.connected {
          color: var(--success);
        }
        .platform-status.disconnected {
          color: var(--text-secondary);
        }
        .platform-stats {
          display: flex;
          justify-content: space-between;
          gap: 8px;
        }
        .pstat {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .pstat-label {
          font-size: 11px;
          color: var(--text-secondary);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .pstat-value {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
        }
        .platform-link {
          font-size: 13px;
          color: var(--accent-blue);
          font-weight: 500;
        }
      `}</style>
    </>
  );
}
