// Mock comment data per post
const MOCK_FACEBOOK_COMMENTS = {
  "1": [
    { id: "c1", author: "Alice Johnson", text: "Amazing update! Can't wait to see what's coming 🎉", created_time: "2024-06-10T15:30:00Z", likes: 8 },
    { id: "c2", author: "Bob Smith", text: "This is super exciting! Keep up the great work.", created_time: "2024-06-10T16:00:00Z", likes: 3 },
    { id: "c3", author: "Carol White", text: "Love the direction you're heading!", created_time: "2024-06-10T18:00:00Z", likes: 5 },
  ],
  "2": [
    { id: "c4", author: "David Brown", text: "Congrats on 12k followers! Well deserved 🙌", created_time: "2024-06-05T11:00:00Z", likes: 12 },
    { id: "c5", author: "Emma Davis", text: "I've been following since the beginning, so proud!", created_time: "2024-06-05T12:00:00Z", likes: 7 },
  ],
  "3": [
    { id: "c6", author: "Frank Wilson", text: "Really valuable insights, bookmarking this!", created_time: "2024-05-28T10:00:00Z", likes: 4 },
    { id: "c7", author: "Grace Lee", text: "Would love a follow-up post on this topic.", created_time: "2024-05-28T11:00:00Z", likes: 6 },
  ],
};

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
      url: "https://www.facebook.com/1",
    },
    {
      id: "2",
      message:
        "Thank you for 12,000 followers! We truly appreciate every single one of you. Here's a little throwback to where it all started.",
      created_time: "2024-06-05T10:30:00Z",
      likes: 389,
      comments: 61,
      shares: 88,
      url: "https://www.facebook.com/2",
    },
    {
      id: "3",
      message:
        "Check out our latest blog post on digital marketing trends for 2024. Link in bio!",
      created_time: "2024-05-28T09:00:00Z",
      likes: 142,
      comments: 24,
      shares: 31,
      url: "https://www.facebook.com/3",
    },
  ],
};

function yyyyMmDdUTC(date) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function safeNumber(v) {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "" && Number.isFinite(Number(v))) return Number(v);
  return 0;
}

async function graphGet(url, revalidateSeconds) {
  const res = await fetch(url, { next: { revalidate: revalidateSeconds ?? 300 } });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = err?.error?.message || `Facebook Graph API error (HTTP ${res.status})`;
    throw new Error(msg);
  }
  return res.json();
}

function pickInsight(seriesList, names) {
  return (seriesList || []).find((s) => names.includes(s.name));
}

function sumInsightSeries(series) {
  if (!series?.values?.length) return 0;

  return series.values.reduce((acc, v) => {
    const val = v.value;

    if (typeof val === "number") return acc + val;
    if (typeof val === "string") return acc + safeNumber(val);

    if (val && typeof val === "object") {
      return acc + Object.values(val).reduce((a, b) => a + safeNumber(b), 0);
    }

    return acc;
  }, 0);
}

function buildDailyChart(impressionsSeries, reachSeries) {
  const map = new Map();

  function addSeries(series, key) {
    if (!series?.values?.length) return;

    for (const v of series.values) {
      const date = (v.end_time || "").slice(0, 10);
      if (!date) continue;

      const existing = map.get(date) || { date, reach: 0, impressions: 0 };

      let valueNum = 0;
      const val = v.value;
      if (typeof val === "number") valueNum = val;
      else if (typeof val === "string") valueNum = safeNumber(val);
      else if (val && typeof val === "object") {
        valueNum = Object.values(val).reduce((a, b) => a + safeNumber(b), 0);
      }

      existing[key] = valueNum;
      map.set(date, existing);
    }
  }

  addSeries(impressionsSeries, "impressions");
  addSeries(reachSeries, "reach");

  return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Fetch ONE insights metric safely.
 * If metric is invalid/unsupported, returns null (instead of breaking the whole request).
 */
async function fetchInsightMetricSafe({ pageId, token, metric, period, since, until, revalidateSeconds }) {
  const params = new URLSearchParams({
    metric,
    period,
    since,
    until,
    access_token: token,
  });

  const url =
    `https://graph.facebook.com/v19.0/${encodeURIComponent(pageId)}/insights?` +
    params.toString();

  const res = await fetch(url, { next: { revalidate: revalidateSeconds ?? 300 } });
  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = json?.error?.message || `Insights error for ${metric} (HTTP ${res.status})`;
    // This is the one you're hitting: "(#100) The value must be a valid insights metric"
    if (msg.includes("valid insights metric") || (json?.error?.code === 100)) {
      console.warn(`[FB] Skipping unsupported metric: ${metric}`);
      return null;
    }
    // Other errors should bubble (permissions, token, etc.)
    throw new Error(msg);
  }

  const series = (json?.data || [])[0];
  if (!series) return null;
  return series;
}

export async function getFacebookData() {
  const token = process.env.FACEBOOK_ACCESS_TOKEN; // should be a PAGE access token
  const pageId = process.env.FACEBOOK_PAGE_ID;

  if (!token || !pageId) {
    return { ...MOCK_FACEBOOK, connected: false };
  }

  try {
    // 1) Page basics + latest posts
    const pageFields = [
      "id",
      "name",
      "fan_count",
      "followers_count",
      "posts.limit(10){id,message,created_time,shares,likes.summary(true).limit(0),comments.summary(true).limit(0)}",
    ].join(",");

    const pageUrl =
      `https://graph.facebook.com/v19.0/${encodeURIComponent(pageId)}` +
      `?fields=${encodeURIComponent(pageFields)}` +
      `&access_token=${encodeURIComponent(token)}`;

    const data = await graphGet(pageUrl, 300);
    console.log("Fetched Facebook page data:", data);
    // Pretty-print the fetched page object for easier debugging

    const postsRaw = data.posts?.data ?? [];
    const recentPosts = postsRaw.map((p) => {
      const parts = (p.id || "").split("_");
      const url =
        parts.length === 2
          ? `https://www.facebook.com/${parts[0]}/posts/${parts[1]}`
          : `https://www.facebook.com/${p.id}`;
      return {
        id: p.id,
        message: p.message ?? "",
        created_time: p.created_time,
        likes: p.likes?.summary?.total_count ?? 0,
        comments: p.comments?.summary?.total_count ?? 0,
        shares: p.shares?.count ?? 0,
        url,
      };
    });

    // 2) Page Insights (last 30 days)
    const untilDate = new Date();
    const sinceDate = new Date(untilDate.getTime() - 30 * 24 * 60 * 60 * 1000);

    const since = yyyyMmDdUTC(sinceDate);
    const until = yyyyMmDdUTC(untilDate);
    const period = "day";

    // IMPORTANT:
    // Some older “impressions” metrics have been deprecated/removed, which triggers (#100).
    // Use media/view-style metrics first; skip unsupported ones safely.
    //
    // Meta has advised moving toward media views / view-like metrics (example: page_total_media_view_unique).  [oai_citation:2‡Meta for Developers](https://developers.facebook.com/docs/graph-api/changelog/version25.0/?utm_source=chatgpt.com)
    const metricCandidates = {
      // Prefer newer replacements
      impressions: ["page_total_media_view", "page_media_view", "page_views_total", "page_views"],
      reach: ["page_total_media_view_unique", "page_media_view_unique", "page_views_total_unique", "page_views_unique"],

      // Engagement metrics (these might still work; if not, they’ll be skipped)
      engagedUsers: ["page_engaged_users"],
      postEngagements: ["page_post_engagements"],
    };

    async function firstWorkingMetric(list) {
      for (const metric of list) {
        const s = await fetchInsightMetricSafe({
          pageId,
          token,
          metric,
          period,
          since,
          until,
          revalidateSeconds: 300,
        });
        if (s) return s;
      }
      return null;
    }

    const impressionsSeries = await firstWorkingMetric(metricCandidates.impressions);
    const reachSeries = await firstWorkingMetric(metricCandidates.reach);
    const engagedUsersSeries = await firstWorkingMetric(metricCandidates.engagedUsers);
    const postEngagementsSeries = await firstWorkingMetric(metricCandidates.postEngagements);

    const impressionsTotal = sumInsightSeries(impressionsSeries);
    const reachTotal = sumInsightSeries(reachSeries);

    const engagementScore =
      sumInsightSeries(engagedUsersSeries) + sumInsightSeries(postEngagementsSeries);

    const chartDataDaily = buildDailyChart(impressionsSeries, reachSeries);

    return {
      name: data.name,
      followers: data.followers_count ?? 0,
      likes: data.fan_count ?? 0,
      posts: postsRaw.length,

      engagement: engagementScore,
      reachThisMonth: reachTotal,
      impressions: impressionsTotal,

      connected: true,

      chartData: chartDataDaily.length ? chartDataDaily : MOCK_FACEBOOK.chartData,
      recentPosts,
    };
  } catch (err) {
    console.error("Failed to fetch Facebook data:", err);
    return { ...MOCK_FACEBOOK, connected: false, error: err?.message || "Failed to fetch Facebook data" };
  }
}

export async function getFacebookComments(postId) {
  const token = process.env.FACEBOOK_ACCESS_TOKEN;

  if (!token) {
    return { comments: MOCK_FACEBOOK_COMMENTS[postId] ?? [], connected: false };
  }

  try {
    const fields = "id,message,from,created_time,like_count";
    const url =
      `https://graph.facebook.com/v19.0/${encodeURIComponent(postId)}/comments` +
      `?fields=${encodeURIComponent(fields)}` +
      `&access_token=${encodeURIComponent(token)}`;

    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("Facebook comments API error:", err);
      return { comments: MOCK_FACEBOOK_COMMENTS[postId] ?? [], connected: false, error: err?.error?.message };
    }

    const data = await res.json();
    console.log(`Fetched comments for post ${postId}:`, data);
    const comments = (data.data ?? []).map((c) => ({
      id: c.id,
      author: c.from?.name ?? "Unknown",
      text: c.message ?? "",
      created_time: c.created_time,
      likes: c.like_count ?? 0,
    }));

    return { comments, connected: true };
  } catch (err) {
    console.error("Failed to fetch Facebook comments:", err);
    return { comments: MOCK_FACEBOOK_COMMENTS[postId] ?? [], connected: false, error: err?.message };
  }
}

export async function postFacebookComment(postId, message) {
  const token = process.env.FACEBOOK_ACCESS_TOKEN;

  if (!token) {
    return { success: true, demo: true };
  }

  try {
    const url =
      `https://graph.facebook.com/v19.0/${encodeURIComponent(postId)}/comments` +
      `?access_token=${encodeURIComponent(token)}`;

    const body = new URLSearchParams({ message: String(message || "") }).toString();

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err?.error?.message ?? "Failed to post comment" };
    }

    const data = await res.json();
    return { success: true, id: data.id };
  } catch (err) {
    console.error("Failed to post Facebook comment:", err);
    return { success: false, error: err?.message ?? "Failed to post comment" };
  }
}