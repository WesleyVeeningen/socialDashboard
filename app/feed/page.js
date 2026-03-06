import { getFacebookData } from "@/lib/facebook";
import { getTwitterData } from "@/lib/twitter";
import FeedView from "@/components/FeedView";

export const metadata = {
  title: "Feed – Social Dashboard",
};

export default async function FeedPage() {
  const [fb, tw] = await Promise.all([getFacebookData(), getTwitterData()]);

  const posts = [
    ...(fb.recentPosts ?? []).map((p) => ({
      id: p.id,
      platform: "Facebook",
      message: p.message,
      date: p.created_time,
      likes: p.likes,
      comments: p.comments,
      shares: p.shares,
      postUrl: p.url,
      color: "var(--facebook)",
    })),
    ...(tw.recentTweets ?? []).map((t) => ({
      id: t.id,
      platform: "Twitter / X",
      message: t.text,
      date: t.created_at,
      likes: t.public_metrics?.like_count,
      comments: t.public_metrics?.reply_count,
      shares: t.public_metrics?.retweet_count,
      postUrl: t.url,
      color: "var(--twitter)",
    })),
  ].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));

  return (
    <>
      <div className="page-header no-print">
        <div>
          <h1 className="page-title">Feed</h1>
          <p className="page-subtitle">Alle berichten van Facebook en Twitter, gefilterd op periode of tag.</p>
        </div>
      </div>

      <FeedView posts={posts} title="Social Media Feed" />

      <style>{`
        .page-header {
          margin-bottom: 20px;
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
      `}</style>
    </>
  );
}
