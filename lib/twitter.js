// Mock reply data per tweet
const MOCK_TWITTER_REPLIES = {
  "1": [
    { id: "r1", author: "devguru99", text: "What was the biggest optimization you made? Asking for a friend 😅", created_at: "2024-06-13T16:00:00Z", likes: 10 },
    { id: "r2", author: "webdev_daily", text: "40% improvement is no joke! Great work 🔥", created_at: "2024-06-13T17:00:00Z", likes: 22 },
  ],
  "2": [
    { id: "r3", author: "code_phil", text: "100% agree. Less code = fewer bugs = happier devs.", created_at: "2024-06-09T12:00:00Z", likes: 45 },
    { id: "r4", author: "softarch_fan", text: "Controversial but correct. YAGNI principle ftw!", created_at: "2024-06-09T13:00:00Z", likes: 31 },
  ],
  "3": [
    { id: "r5", author: "tech_enthusiast", text: "Just registered! Looking forward to your talk 🎤", created_at: "2024-06-02T10:00:00Z", likes: 8 },
  ],
};

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

export async function getTwitterReplies(tweetId) {
  const bearerToken = process.env.TWITTER_BEARER_TOKEN;

  if (!bearerToken) {
    return { comments: MOCK_TWITTER_REPLIES[tweetId] ?? [], connected: false };
  }

  try {
    const query = encodeURIComponent(`conversation_id:${tweetId} is:reply`);
    const url = `https://api.twitter.com/2/tweets/search/recent?query=${query}&tweet.fields=created_at,public_metrics,author_id&max_results=10`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${bearerToken}` },
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      return { comments: MOCK_TWITTER_REPLIES[tweetId] ?? [], connected: false };
    }
    const data = await res.json();
    const comments = (data.data ?? []).map((t) => ({
      id: t.id,
      author: t.author_id,
      text: t.text,
      created_at: t.created_at,
      likes: t.public_metrics?.like_count ?? 0,
    }));
    return { comments, connected: true };
  } catch (err) {
    console.error("Failed to fetch Twitter replies:", err);
    return { comments: MOCK_TWITTER_REPLIES[tweetId] ?? [], connected: false };
  }
}

export async function postTwitterReply(tweetId, text) {
  const userAccessToken = process.env.TWITTER_USER_ACCESS_TOKEN;

  if (!userAccessToken) {
    return { success: true, demo: true };
  }

  try {
    const res = await fetch("https://api.twitter.com/2/tweets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userAccessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, reply: { in_reply_to_tweet_id: tweetId } }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err?.detail ?? "Failed to post reply" };
    }
    const data = await res.json();
    return { success: true, id: data.data?.id };
  } catch (err) {
    console.error("Failed to post Twitter reply:", err);
    return { success: false, error: "Failed to post reply" };
  }
}
