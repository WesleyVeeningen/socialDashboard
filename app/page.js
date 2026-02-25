import { getFacebookData } from "@/lib/facebook";
import { getInstagramData } from "@/lib/instagram";
import { getTwitterData } from "@/lib/twitter";
import PlatformCard from "@/components/PlatformCard";

const FacebookIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
  </svg>
);
const InstagramIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
const TwitterIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default async function OverviewPage() {
  const [fb, ig, tw] = await Promise.all([
    getFacebookData(),
    getInstagramData(),
    getTwitterData(),
  ]);

  const totalFollowers = (fb.followers ?? 0) + (ig.followers ?? 0) + (tw.followers ?? 0);
  const connectedCount = [fb, ig, tw].filter((d) => d.connected).length;
  const avgEngagement = (((fb.engagement ?? 0) + (ig.engagement ?? 0) + (tw.engagement ?? 0)) / 3).toFixed(1);

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Overview</h1>
          <p className="page-subtitle">Monitor all your social media accounts in one place.</p>
        </div>
        <div className="header-badge">
          <span className="badge-dot" style={{ background: connectedCount > 0 ? "var(--success)" : "var(--text-secondary)" }} />
          <span>{connectedCount} / 3 Connected</span>
        </div>
      </div>

      <div className="summary-strip">
        <div className="summary-item">
          <span className="summary-label">Total Followers</span>
          <span className="summary-value">{totalFollowers.toLocaleString()}</span>
        </div>
        <div className="summary-divider" />
        <div className="summary-item">
          <span className="summary-label">Platforms</span>
          <span className="summary-value">3</span>
        </div>
        <div className="summary-divider" />
        <div className="summary-item">
          <span className="summary-label">Connected</span>
          <span className="summary-value">{connectedCount}</span>
        </div>
        <div className="summary-divider" />
        <div className="summary-item">
          <span className="summary-label">Avg Engagement</span>
          <span className="summary-value">{avgEngagement}%</span>
        </div>
      </div>

      {connectedCount === 0 && (
        <div className="demo-notice">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>
            Showing <strong>demo data</strong>. Add your API keys to{" "}
            <code>.env.local</code> (see <code>.env.example</code>) to connect live accounts.
          </span>
        </div>
      )}

      <h2 className="section-title">Platforms</h2>
      <div className="platform-grid">
        <PlatformCard
          name="Facebook"
          href="/facebook"
          color="var(--facebook)"
          icon={<FacebookIcon />}
          followers={fb.followers}
          posts={fb.posts}
          engagement={fb.engagement}
          connected={fb.connected}
        />
        <PlatformCard
          name="Instagram"
          href="/instagram"
          color="var(--instagram)"
          icon={<InstagramIcon />}
          followers={ig.followers}
          posts={ig.mediaCount}
          engagement={ig.engagement}
          connected={ig.connected}
        />
        <PlatformCard
          name="Twitter / X"
          href="/twitter"
          color="var(--twitter)"
          icon={<TwitterIcon />}
          followers={tw.followers}
          posts={tw.tweetCount}
          engagement={tw.engagement}
          connected={tw.connected}
        />
      </div>

      <style>{`
        .page-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .page-title {
          font-size: 26px;
          font-weight: 700;
          color: var(--text-primary);
        }
        .page-subtitle {
          font-size: 14px;
          color: var(--text-secondary);
          margin-top: 4px;
        }
        .header-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 8px 14px;
          font-size: 13px;
          color: var(--text-secondary);
        }
        .badge-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .summary-strip {
          display: flex;
          align-items: center;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 20px 28px;
          margin-bottom: 24px;
          gap: 0;
          flex-wrap: wrap;
        }
        .summary-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
          min-width: 100px;
        }
        .summary-label {
          font-size: 12px;
          color: var(--text-secondary);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.6px;
        }
        .summary-value {
          font-size: 22px;
          font-weight: 700;
          color: var(--text-primary);
        }
        .summary-divider {
          width: 1px;
          height: 40px;
          background: var(--border);
          margin: 0 24px;
        }
        .demo-notice {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #1a2a3a;
          border: 1px solid #2a4a6a;
          border-radius: 10px;
          padding: 12px 16px;
          font-size: 13px;
          color: #7ab4e0;
          margin-bottom: 24px;
        }
        .demo-notice code {
          background: rgba(255,255,255,0.1);
          padding: 1px 6px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 12px;
        }
        .section-title {
          font-size: 17px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 16px;
        }
        .platform-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }
      `}</style>
    </>
  );
}
