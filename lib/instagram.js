const MOCK_INSTAGRAM = {
  username: "my_instagram",
  bio: "Sharing moments that matter. 📸 Creator & Storyteller.",
  followers: 8420,
  following: 512,
  mediaCount: 186,
  engagement: 4.2,
  connected: false,
  chartData: [
    { label: "Jan", followers: 7100, likes: 310 },
    { label: "Feb", followers: 7450, likes: 290 },
    { label: "Mar", followers: 7820, likes: 420 },
    { label: "Apr", followers: 8050, likes: 380 },
    { label: "May", followers: 8240, likes: 460 },
    { label: "Jun", followers: 8420, likes: 405 },
  ],
  recentMedia: [
    {
      id: "1",
      caption: "Golden hour never disappoints 🌅 #photography #sunset",
      timestamp: "2024-06-12T18:30:00Z",
      like_count: 542,
      comments_count: 47,
      media_type: "IMAGE",
      media_url: null,
    },
    {
      id: "2",
      caption:
        "Behind the scenes of our latest shoot. Hard work + great team = magic ✨",
      timestamp: "2024-06-07T12:00:00Z",
      like_count: 318,
      comments_count: 28,
      media_type: "IMAGE",
      media_url: null,
    },
    {
      id: "3",
      caption:
        "New month, new goals. What are you working towards? Drop it in the comments 👇",
      timestamp: "2024-06-01T08:00:00Z",
      like_count: 276,
      comments_count: 63,
      media_type: "IMAGE",
      media_url: null,
    },
  ],
};

export async function getInstagramData() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;

  if (!token || !userId) {
    return { ...MOCK_INSTAGRAM, connected: false };
  }

  try {
    const userFields =
      "username,biography,followers_count,follows_count,media_count";
    const userUrl = `https://graph.facebook.com/v19.0/${encodeURIComponent(userId)}?fields=${userFields}&access_token=${token}`;

    const userRes = await fetch(userUrl, { next: { revalidate: 300 } });
    if (!userRes.ok) {
      const err = await userRes.json().catch(() => ({}));
      console.error("Instagram API error:", err);
      return {
        ...MOCK_INSTAGRAM,
        connected: false,
        error: err?.error?.message,
      };
    }

    const user = await userRes.json();

    const mediaFields =
      "id,caption,timestamp,like_count,comments_count,media_type,media_url,thumbnail_url";
    const mediaUrl = `https://graph.facebook.com/v19.0/${encodeURIComponent(userId)}/media?fields=${mediaFields}&limit=6&access_token=${token}`;

    const mediaRes = await fetch(mediaUrl, { next: { revalidate: 300 } });
    const mediaData = mediaRes.ok ? await mediaRes.json() : { data: [] };

    return {
      username: user.username,
      bio: user.biography ?? "",
      followers: user.followers_count ?? 0,
      following: user.follows_count ?? 0,
      mediaCount: user.media_count ?? 0,
      engagement: MOCK_INSTAGRAM.engagement,
      connected: true,
      chartData: MOCK_INSTAGRAM.chartData,
      recentMedia: mediaData.data ?? [],
    };
  } catch (err) {
    console.error("Failed to fetch Instagram data:", err);
    return { ...MOCK_INSTAGRAM, connected: false };
  }
}
