# socialDashboard

A **Next.js** social media dashboard that lets you track **Facebook**, **Instagram**, and **Twitter / X** metrics from a single interface.

## Features

- 📊 Unified overview of all three platforms
- 📈 Follower growth & engagement charts (Recharts)
- 🗂 Recent posts / tweets feed per platform
- 🔑 Real API integration with graceful fallback to demo data when no keys are provided
- 🌙 Dark-mode UI

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure API keys

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `FACEBOOK_ACCESS_TOKEN` | Facebook Page access token (from Meta Developer Portal) |
| `FACEBOOK_PAGE_ID` | ID of the Facebook Page to track |
| `INSTAGRAM_ACCESS_TOKEN` | Instagram Graph API access token |
| `INSTAGRAM_USER_ID` | Instagram Business/Creator user ID |
| `TWITTER_BEARER_TOKEN` | Twitter / X API v2 Bearer Token |
| `TWITTER_USER_ID` | Numeric Twitter user ID to track |

> **Note:** If no credentials are provided the app runs entirely on demo data so you can explore the UI immediately.

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Routes

| Route | Description |
|---|---|
| `GET /api/social/facebook` | Facebook page metrics & recent posts |
| `GET /api/social/instagram` | Instagram profile metrics & recent media |
| `GET /api/social/twitter` | Twitter account metrics & recent tweets |

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [Recharts](https://recharts.org/) – chart library
- Facebook Graph API v19
- Instagram Graph API (via Meta)
- Twitter / X API v2
