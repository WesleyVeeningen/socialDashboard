import { getFacebookData } from "@/lib/facebook";
import StatCard from "@/components/StatCard";
import EngagementChart from "@/components/EngagementChart";
import PostCard from "@/components/PostCard";

const chartLines = [
  { dataKey: "followers", name: "Followers", color: "var(--facebook)" },
  { dataKey: "engagement", name: "Engagements", color: "var(--accent-blue)" },
];

export default async function FacebookPage() {
  const data = await getFacebookData();

  return (
    <>
      <div className="page-header">
        <div className="platform-title">
          <span className="platform-dot" style={{ background: "var(--facebook)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
            </svg>
          </span>
          <div>
            <h1 className="page-title">Facebook</h1>
            <p className="page-subtitle">{data.name ?? "Page Analytics"}</p>
          </div>
        </div>
        <span className={`status-pill ${data.connected ? "connected" : "demo"}`}>
          {data.connected ? "● Live Data" : "● Demo Data"}
        </span>
      </div>

      <div className="stats-grid">
        <StatCard title="Total Followers" value={data.followers ?? 0} change={2.3} icon="👥" color="var(--facebook)" />
        <StatCard title="Page Likes" value={data.likes ?? 0} change={1.8} icon="👍" color="var(--facebook)" />
        <StatCard title="Posts" value={data.posts ?? 0} icon="📝" color="var(--accent-blue)" />
        <StatCard title="Engagement Rate" value={data.engagement ?? 0} suffix="%" change={0.4} icon="📈" color="var(--success)" />
        <StatCard title="Reach This Month" value={data.reachThisMonth ?? 0} change={5.1} icon="🌐" color="var(--accent-purple)" />
        <StatCard title="Impressions" value={data.impressions ?? 0} change={3.7} icon="👁️" color="var(--warning)" />
      </div>

      {data.chartData && (
        <div className="section">
          <EngagementChart
            title="Followers & Engagement (Last 6 Months)"
            data={data.chartData}
            lines={chartLines}
          />
        </div>
      )}

      {data.recentPosts?.length > 0 && (
        <div className="section">
          <h2 className="section-title">Recent Posts</h2>
          <div className="posts-grid">
            {data.recentPosts.map((post) => (
              <PostCard
                key={post.id}
                platform="Facebook"
                message={post.message}
                date={post.created_time}
                likes={post.likes}
                comments={post.comments}
                shares={post.shares}
                color="var(--facebook)"
              />
            ))}
          </div>
        </div>
      )}

      <style>{`
        .page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .platform-title { display: flex; align-items: center; gap: 14px; }
        .platform-dot {
          width: 44px; height: 44px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .page-title { font-size: 24px; font-weight: 700; color: var(--text-primary); }
        .page-subtitle { font-size: 13px; color: var(--text-secondary); margin-top: 2px; }
        .status-pill { padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .status-pill.connected { background: rgba(52,199,138,.15); color: var(--success); }
        .status-pill.demo { background: rgba(143,148,192,.15); color: var(--text-secondary); }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(200px,1fr)); gap: 14px; margin-bottom: 24px; }
        .section { margin-bottom: 24px; }
        .section-title { font-size: 16px; font-weight: 600; color: var(--text-primary); margin-bottom: 14px; }
        .posts-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(300px,1fr)); gap: 14px; }
      `}</style>
    </>
  );
}
