import { getTwitterData } from "@/lib/twitter";
import StatCard from "@/components/StatCard";
import EngagementChart from "@/components/EngagementChart";
import PostCard from "@/components/PostCard";

const chartLines = [
  { dataKey: "followers", name: "Followers", color: "var(--twitter)" },
  { dataKey: "impressions", name: "Impressions", color: "var(--accent-blue)" },
];

export default async function TwitterPage() {
  const data = await getTwitterData();

  return (
    <>
      <div className="page-header">
        <div className="platform-title">
          <span className="platform-dot" style={{ background: "var(--twitter)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </span>
          <div>
            <h1 className="page-title">Twitter / X</h1>
            <p className="page-subtitle">{data.username ? `@${data.username}` : "Account Analytics"}</p>
          </div>
        </div>
        <span className={`status-pill ${data.connected ? "connected" : "demo"}`}>
          {data.connected ? "● Live Data" : "● Demo Data"}
        </span>
      </div>

      {data.bio && <p className="bio-text">{data.bio}</p>}

      <div className="stats-grid">
        <StatCard title="Followers" value={data.followers ?? 0} change={1.9} icon="👥" color="var(--twitter)" />
        <StatCard title="Following" value={data.following ?? 0} icon="➕" color="var(--accent-blue)" />
        <StatCard title="Total Tweets" value={data.tweetCount ?? 0} icon="🐦" color="var(--twitter)" />
        <StatCard title="Listed Count" value={data.listedCount ?? 0} icon="📋" color="var(--accent-purple)" />
        <StatCard title="Engagement Rate" value={data.engagement ?? 0} suffix="%" change={0.3} icon="📈" color="var(--success)" />
      </div>

      {data.chartData && (
        <div className="section">
          <EngagementChart
            title="Followers & Impressions (Last 6 Months)"
            data={data.chartData}
            lines={chartLines}
          />
        </div>
      )}

      {data.recentTweets?.length > 0 && (
        <div className="section">
          <h2 className="section-title">Recent Tweets</h2>
          <div className="posts-grid">
            {data.recentTweets.map((tweet) => (
              <PostCard
                key={tweet.id}
                platform="Twitter / X"
                message={tweet.text}
                date={tweet.created_at}
                likes={tweet.public_metrics?.like_count}
                comments={tweet.public_metrics?.reply_count}
                shares={tweet.public_metrics?.retweet_count}
                color="var(--twitter)"
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
