const MOCK_TWITTER = {
  name: "My Twitter Account",
  username: "my_twitter",
  bio: "Tweeting about tech, design, and the occasional dad joke. 🛠️",
  followers: 5284,
  following: 348,
  tweetCount: 1092,
  listedCount: 42,
  engagement: 2.1,
  connected: false,
  chartData: [
    { label: "Jan", followers: 4600, impressions: 12000 },
    { label: "Feb", followers: 4780, impressions: 11500 },
    { label: "Mar", followers: 4920, impressions: 15200 },
    { label: "Apr", followers: 5040, impressions: 13800 },
    { label: "May", followers: 5180, impressions: 17400 },
    { label: "Jun", followers: 5284, impressions: 16200 },
  ],
  recentTweets: [
    {
      id: "1",
      text: "Just shipped a new feature that cuts load times by 40%. The secret? Stop doing unnecessary work 😅 #webdev #performance",
      created_at: "2024-06-13T15:20:00Z",
      public_metrics: { like_count: 184, reply_count: 22, retweet_count: 61 },
    },
    {
      id: "2",
      text: "Hot take: the best code is the code you don't write. Simplicity > cleverness every time.",
      created_at: "2024-06-09T11:00:00Z",
      public_metrics: { like_count: 312, reply_count: 45, retweet_count: 98 },
    },
    {
      id: "3",
      text: "Excited to be speaking at @TechConf2024 next month! My talk is on building maintainable frontend architectures. Register now!",
      created_at: "2024-06-02T09:30:00Z",
      public_metrics: { like_count: 97, reply_count: 14, retweet_count: 38 },
    },
  ],
};

export async function getTwitterData() {
  const bearerToken = process.env.TWITTER_BEARER_TOKEN;
  const userId = process.env.TWITTER_USER_ID;

  if (!bearerToken || !userId) {
    return { ...MOCK_TWITTER, connected: false };
  }

  try {
    const userFields =
      "name,username,description,public_metrics,profile_image_url";
    const userUrl = `https://api.twitter.com/2/users/${encodeURIComponent(userId)}?user.fields=${userFields}`;

    const userRes = await fetch(userUrl, {
      headers: { Authorization: `Bearer ${bearerToken}` },
      next: { revalidate: 300 },
    });

    if (!userRes.ok) {
      const err = await userRes.json().catch(() => ({}));
      console.error("Twitter API error:", err);
      return {
        ...MOCK_TWITTER,
        connected: false,
        error: err?.detail ?? "API error",
      };
    }

    const { data: user } = await userRes.json();
    const metrics = user.public_metrics ?? {};

    const tweetsUrl = `https://api.twitter.com/2/users/${encodeURIComponent(userId)}/tweets?max_results=5&tweet.fields=created_at,public_metrics`;
    const tweetsRes = await fetch(tweetsUrl, {
      headers: { Authorization: `Bearer ${bearerToken}` },
      next: { revalidate: 300 },
    });
    const tweetsJson = tweetsRes.ok ? await tweetsRes.json() : { data: [] };

    return {
      name: user.name,
      username: user.username,
      bio: user.description ?? "",
      followers: metrics.followers_count ?? 0,
      following: metrics.following_count ?? 0,
      tweetCount: metrics.tweet_count ?? 0,
      listedCount: metrics.listed_count ?? 0,
      engagement: MOCK_TWITTER.engagement,
      connected: true,
      chartData: MOCK_TWITTER.chartData,
      recentTweets: tweetsJson.data ?? [],
    };
  } catch (err) {
    console.error("Failed to fetch Twitter data:", err);
    return { ...MOCK_TWITTER, connected: false };
  }
}
