import { getInstagramData } from "@/lib/instagram";
import StatCard from "@/components/StatCard";
import EngagementChart from "@/components/EngagementChart";
import PostCard from "@/components/PostCard";

const chartLines = [
  { dataKey: "followers", name: "Followers", color: "var(--instagram)" },
  { dataKey: "likes", name: "Avg. Likes", color: "var(--accent-purple)" },
];

export default async function InstagramPage() {
  const data = await getInstagramData();

  return (
    <>
      <div className="page-header">
        <div className="platform-title">
          <span className="platform-dot" style={{ background: "var(--instagram)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </span>
          <div>
            <h1 className="page-title">Instagram</h1>
            <p className="page-subtitle">{data.username ? `@${data.username}` : "Profile Analytics"}</p>
          </div>
        </div>
        <span className={`status-pill ${data.connected ? "connected" : "demo"}`}>
          {data.connected ? "● Live Data" : "● Demo Data"}
        </span>
      </div>

      {data.bio && <p className="bio-text">{data.bio}</p>}

      <div className="stats-grid">
        <StatCard title="Followers" value={data.followers ?? 0} change={3.1} icon="👥" color="var(--instagram)" />
        <StatCard title="Following" value={data.following ?? 0} icon="➕" color="var(--accent-blue)" />
        <StatCard title="Total Posts" value={data.mediaCount ?? 0} icon="🖼️" color="var(--accent-purple)" />
        <StatCard title="Engagement Rate" value={data.engagement ?? 0} suffix="%" change={0.6} icon="📈" color="var(--success)" />
      </div>

      {data.chartData && (
        <div className="section">
          <EngagementChart
            title="Followers & Likes (Last 6 Months)"
            data={data.chartData}
            lines={chartLines}
          />
        </div>
      )}

      {data.recentMedia?.length > 0 && (
        <div className="section">
          <h2 className="section-title">Recent Posts</h2>
          <div className="posts-grid">
            {data.recentMedia.map((post) => (
              <PostCard
                key={post.id}
                platform="Instagram"
                message={post.caption}
                date={post.timestamp}
                likes={post.like_count}
                comments={post.comments_count}
                imageUrl={post.media_url}
                color="var(--instagram)"
              />
            ))}
          </div>
        </div>
      )}

      <style>{`
        .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 12px; }
        .platform-title { display: flex; align-items: center; gap: 14px; }
        .platform-dot { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .page-title { font-size: 24px; font-weight: 700; color: var(--text-primary); }
        .page-subtitle { font-size: 13px; color: var(--text-secondary); margin-top: 2px; }
        .status-pill { padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .status-pill.connected { background: rgba(52,199,138,.15); color: var(--success); }
        .status-pill.demo { background: rgba(143,148,192,.15); color: var(--text-secondary); }
        .bio-text { font-size: 14px; color: var(--text-secondary); margin-bottom: 20px; line-height: 1.6; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(200px,1fr)); gap: 14px; margin-bottom: 24px; }
        .section { margin-bottom: 24px; }
        .section-title { font-size: 16px; font-weight: 600; color: var(--text-primary); margin-bottom: 14px; }
        .posts-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(300px,1fr)); gap: 14px; }
      `}</style>
    </>
  );
}
