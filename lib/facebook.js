// Mock data used when no API credentials are configured
const MOCK_FACEBOOK = {
  name: "My Facebook Page",
  followers: 12847,
  likes: 11923,
  posts: 248,
  engagement: 3.8,
  reachThisMonth: 48200,
  impressions: 124500,
  connected: false,
  chartData: [
    { label: "Jan", followers: 11200, engagement: 420 },
    { label: "Feb", followers: 11580, engagement: 390 },
    { label: "Mar", followers: 11940, engagement: 510 },
    { label: "Apr", followers: 12100, engagement: 465 },
    { label: "May", followers: 12380, engagement: 540 },
    { label: "Jun", followers: 12847, engagement: 488 },
  ],
  recentPosts: [
    {
      id: "1",
      message:
        "Excited to share our latest update with the community! Big things are coming this summer. Stay tuned for announcements!",
      created_time: "2024-06-10T14:00:00Z",
      likes: 214,
      comments: 38,
      shares: 52,
    },
    {
      id: "2",
      message:
        "Thank you for 12,000 followers! We truly appreciate every single one of you. Here's a little throwback to where it all started.",
      created_time: "2024-06-05T10:30:00Z",
      likes: 389,
      comments: 61,
      shares: 88,
    },
    {
      id: "3",
      message:
        "Check out our latest blog post on digital marketing trends for 2024. Link in bio!",
      created_time: "2024-05-28T09:00:00Z",
      likes: 142,
      comments: 24,
      shares: 31,
    },
  ],
};

export async function getFacebookData() {
  const token = process.env.FACEBOOK_ACCESS_TOKEN;
  const pageId = process.env.FACEBOOK_PAGE_ID;

  if (!token || !pageId) {
    return { ...MOCK_FACEBOOK, connected: false };
  }

  try {
    const fields =
      "name,fan_count,followers_count,posts{message,created_time,likes.summary(true),comments.summary(true),shares}";
    const url = `https://graph.facebook.com/v19.0/${encodeURIComponent(pageId)}?fields=${fields}&access_token=${token}`;

    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("Facebook API error:", err);
      return { ...MOCK_FACEBOOK, connected: false, error: err?.error?.message };
    }

    const data = await res.json();
    const postsRaw = data.posts?.data ?? [];

    const recentPosts = postsRaw.map((p) => ({
      id: p.id,
      message: p.message ?? "",
      created_time: p.created_time,
      likes: p.likes?.summary?.total_count ?? 0,
      comments: p.comments?.summary?.total_count ?? 0,
      shares: p.shares?.count ?? 0,
    }));

    return {
      name: data.name,
      followers: data.followers_count ?? 0,
      likes: data.fan_count ?? 0,
      posts: postsRaw.length,
      engagement: MOCK_FACEBOOK.engagement,
      reachThisMonth: MOCK_FACEBOOK.reachThisMonth,
      impressions: MOCK_FACEBOOK.impressions,
      connected: true,
      chartData: MOCK_FACEBOOK.chartData,
      recentPosts,
    };
  } catch (err) {
    console.error("Failed to fetch Facebook data:", err);
    return { ...MOCK_FACEBOOK, connected: false };
  }
}
