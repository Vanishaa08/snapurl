# ⚡ SnapURL - Production-Grade Distributed URL Shortener

<div align="center">

Shorten URLs to 7-character codes · Sub-10ms redirects via Redis · Real-time analytics dashboard

[![demo](https://img.shields.io/badge/demo-live-00c853?style=for-the-badge)](https://snapurl-jet.vercel.app)
[![api](https://img.shields.io/badge/api-online-00c853?style=for-the-badge)](https://snapurl-api.onrender.com)
[![license](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)
[![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen?style=for-the-badge)](https://github.com/Vanishaa08/snapurl/pulls)

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Redis](https://img.shields.io/badge/Redis-Upstash-DC382D?logo=redis&logoColor=white)](https://upstash.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)

Shorten, track, and analyze URLs with enterprise-grade performance and real-time insights

</div>

---

## 📋 Table of Contents

<details>
<summary><b>Click to expand</b></summary>

- [Demo](#demo)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [System Design](#system-design)
- [Folder Structure](#folder-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [API Documentation](#api-documentation)
- [Request Flows](#request-flows)
- [Database Schema](#database-schema)
- [Redis Usage](#redis-usage)
- [Authentication](#authentication)
- [Analytics Pipeline](#analytics-pipeline)
- [Real-Time Communication](#real-time-communication)
- [Caching Strategy](#caching-strategy)
- [Rate Limiting](#rate-limiting)
- [Design Decisions](#design-decisions)
- [Performance](#performance)
- [Security](#security)
- [Deployment](#deployment)
- [Future Improvements](#future-improvements)
- [Challenges Faced](#challenges-faced)
- [Learning Outcomes](#learning-outcomes)
- [License](#license)

</details>

---

## 🌐 Demo

| Resource | URL |
|----------|-----|
| Frontend | https://snapurl-jet.vercel.app |
| Backend API | https://snapurl-api.onrender.com |
| Health Check | https://snapurl-api.onrender.com/health |
| GitHub | https://github.com/Vanishaa08/snapurl |

---

## ✨ Features

### 👤 User Features

- **⚡ Instant Shortening** - Convert any URL to a 7-character code in milliseconds
- **📱 QR Code Generation** - Every short URL includes a scannable QR code
- **📋 One-Click Copy** - Copy short URLs to clipboard with toast notifications
- **📜 Anonymous History** - Last 5 links stored locally in browser
- **⏱️ Expiry Countdown** - Visual timer showing when links will expire

### 🔐 Authentication

- **📝 Email + Password** - Register and login securely
- **🎫 JWT Access Tokens** - Stateless authentication with rotating refresh tokens
- **🔄 Auto Token Refresh** - Axios interceptor handles token rotation transparently
- **🎭 Optional Auth** - Anonymous users can shorten; registered users get full features

### 🔗 URL Management

- **🔓 Anonymous Shortening** - No login required to create short URLs
- **🏷️ Custom Aliases** - Choose your own slug (e.g., snapurl/my-brand)
- **⏳ URL Expiry** - Set time-to-live for temporary links
- **🗑️ Soft Delete** - Deactivate links with immediate cache invalidation
- **📊 Per-URL Analytics** - Detailed metrics for each shortened link

### 📈 Analytics Dashboard

- **👆 Total Clicks** - Track overall engagement
- **📅 Clicks Over Time** - Line chart showing last 7 days of activity
- **🌍 Top Countries** - Geographic distribution of clicks (bar chart)
- **📱 Device Breakdown** - Mobile, desktop, and tablet usage (pie chart)
- **🔗 Referrer Tracking** - See where your traffic comes from

### 📡 Real-Time Dashboard

- **🔴 Live Updates** - Socket.io pushes new click events instantly
- **🔄 Auto-Refresh** - Dashboard fetches new analytics on every click
- **🚀 Zero Manual Refresh** - Always up-to-date without reloading

### 🛡️ Security & Reliability

- **🪣 Token Bucket Rate Limiting** - 100 requests/min per IP
- **✅ Joi Input Validation** - All routes protected from injection
- **🛡️ Helmet Security Headers** - Protection against common web vulnerabilities
- **🌐 CORS Configuration** - Controlled cross-origin access
- **📝 Morgan Request Logging** - Comprehensive request tracking
- **❤️ Health Check Endpoint** - Monitor service status

---

## 🏗️ Architecture
┌─────────────────────────────────────────────────────────────────────────────┐
│ CLIENT (React) │
│ Vite · Recharts · Socket.io · Axios │
└───────────────────────────────┬───────────────────────────────────────────┘
│ HTTPS
┌───────────────────────────────▼───────────────────────────────────────────┐
│ NGINX │
│ Reverse Proxy · SSL · Static Files │
└───────────────┬─────────────────────────────────────┬─────────────────────┘
│ /api/* │ /*
┌───────────────▼────────────┐ ┌────────────────▼────────────────────┐
│ EXPRESS API SERVER │ │ REACT STATIC BUILD │
│ Auth · URLs · Redirect │ │ Served by Nginx │
└───────────────┬────────────┘ └─────────────────────────────────────┘
│
┌───────┼───────────────┐
│ │ │
┌───────▼───┐ ┌▼───────────────▼──────────────────────────────────────────┐
│ REDIS │ │ MONGODB ATLAS │
│ Cache │ │ Users · URLs · Analytics Collections │
│ Queue │ └────────────────────────────────────────────────────────────┘
│ Limits │
└───────────┘
│
│ BLPOP
┌───────▼──────────────────────────────────────────────────────────────────┐
│ ANALYTICS WORKER │
│ geoip · ua-parser · Socket.io emit │
└──────────────────────────────────────────────────────────────────────────┘

text

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | React.js + Vite | Component-based UI, fast HMR |
| Charts | Recharts | Analytics visualizations |
| Real-time (client) | Socket.io-client | Live dashboard updates |
| HTTP Client | Axios + interceptors | API calls + auto token refresh |
| Backend | Node.js + Express.js | REST API server |
| Database | MongoDB Atlas | Persistent storage |
| Cache + Queue | Redis (Upstash) | URL cache, rate limits, analytics queue |
| Auth | JWT | Stateless authentication |
| Validation | Joi | Input schema validation |
| Logging | Morgan | HTTP request logging |
| Real-time (server) | Socket.io | Push analytics to dashboard |
| ID Generation | Snowflake ID + Base62 | Collision-free short codes |
| Containerization | Docker + Docker Compose | Full stack in one command |
| Reverse Proxy | Nginx | Traffic routing + static serving |
| CI/CD | GitHub Actions | Auto-check on every push |
| Frontend Deploy | Vercel | Global CDN |
| Backend Deploy | Render | Auto-deploy from GitHub |

---

## 🔧 System Design

### High Level Design

The system is split into two main paths:

#### Write Path (Shorten URL)
User → Rate Limiter → Joi Validation → Snowflake ID → Base62 Encode →
Save to MongoDB → Warm Redis Cache → Return Short URL

text

#### Read Path (Redirect)
User → Redis Lookup →
HIT: Redirect (2–5ms) + Fire analytics event (async, non-blocking)
MISS: MongoDB Lookup → Warm Redis → Redirect + Fire analytics event

text

#### Analytics Path (Background)
Click → RPUSH to Redis List → BLPOP Worker wakes up →
geoip lookup → ua-parser → Write to MongoDB →
Socket.io emit → Dashboard updates live

text

### Why This Architecture?

- **Redis-first reads**: 95% of redirects never touch MongoDB. At scale this is the difference between 2ms and 50ms.
- **Async analytics**: Decouples tracking from the user-facing redirect. Analytics DB going slow/down has zero impact on users.
- **Snowflake IDs**: No central counter, no DB uniqueness check, works across distributed servers.
- **Optional auth**: Removing login friction for anonymous users increases adoption while registered users get the full feature set.

---

## 📁 Folder Structure
snapurl/
├── .github/
│ └── workflows/
│ └── ci.yml # GitHub Actions — runs on every push
├── nginx/
│ └── nginx.conf # Reverse proxy config (Docker only)
├── docker-compose.yml # Full stack: server + client + nginx
│
├── server/ # Express backend
│ ├── Dockerfile
│ ├── .env.example
│ └── src/
│ ├── config/
│ │ ├── db.js # MongoDB connection with crash-on-fail
│ │ └── redis.js # Redis client + getRedis() singleton
│ ├── controllers/
│ │ ├── auth.controller.js # register, login, refresh
│ │ ├── url.controller.js # shorten, redirect, getUserUrls, delete
│ │ └── analytics.controller.js # aggregation pipelines
│ ├── middleware/
│ │ ├── auth.middleware.js # JWT verify — blocks unauthenticated
│ │ ├── optionalAuth.middleware.js # JWT verify — passes through anonymous
│ │ ├── ratelimit.middleware.js # Token bucket per IP
│ │ ├── validate.middleware.js # Joi schema validation
│ │ └── error.middleware.js # Global error handler (4-param)
│ ├── models/
│ │ ├── User.js # email, passwordHash, refreshToken
│ │ ├── Url.js # shortCode, originalUrl, userId, expiresAt
│ │ └── Analytics.js # shortCode, country, device, referrer, timestamp
│ ├── routes/
│ │ ├── auth.routes.js
│ │ ├── url.routes.js
│ │ └── analytics.routes.js
│ ├── services/
│ │ ├── snowflake.service.js # 64-bit ID generation
│ │ ├── base62.service.js # Integer → 7-char string
│ │ └── cache.service.js # Redis ops with 3s timeout wrapper
│ ├── workers/
│ │ └── analytics.worker.js # BLPOP consumer loop
│ ├── app.js # Express setup (no listen)
│ └── index.js # Server start + Socket.io + Worker init
│
└── client/ # React frontend
├── Dockerfile # Multi-stage: Node build → Nginx serve
└── src/
├── hooks/
│ ├── useAuth.js # Login/register/logout state
│ └── useSocket.js # Socket.io connection per shortCode
├── pages/
│ ├── Home.jsx # URL form + QR code + anonymous history
│ ├── Login.jsx # Register + Login toggle
│ ├── Dashboard.jsx # User's URLs + expiry countdown
│ └── Analytics.jsx # Charts + real-time Socket.io updates
├── services/
│ └── api.js # Axios instance + JWT interceptors
└── App.jsx # React Router with auth guards

text

---

## ⚙️ Installation

### Prerequisites

- Node.js 20+
- Docker (for Docker setup)
- MongoDB Atlas account (free tier)
- Upstash Redis account (free tier)

### Clone

```bash
git clone https://github.com/Vanishaa08/snapurl.git
cd snapurl
Install Dependencies
bash
# Backend
cd server && npm install

# Frontend
cd ../client && npm install
🔐 Environment Variables
Backend (server/.env)
Variable	Example	Purpose
PORT	5000	Express server port
MONGO_URI	mongodb+srv://...	MongoDB Atlas connection string
REDIS_URL	rediss://default:...@....upstash.io:6379	Upstash Redis URL (TLS)
JWT_ACCESS_SECRET	your_secret	Signs access tokens
JWT_REFRESH_SECRET	your_secret	Signs refresh tokens
JWT_ACCESS_EXPIRY	7d	Access token lifetime
JWT_REFRESH_EXPIRY	7d	Refresh token lifetime
MACHINE_ID	1	Snowflake ID machine identifier (0–1023)
BASE_URL	https://snapurl-api.onrender.com	Prefix for generated short URLs
CLIENT_URL	https://snapurl-jet.vercel.app	Allowed CORS origin
bash
cp server/.env.example server/.env
🚀 Running the Project
Local Development
bash
# Terminal 1 — Backend
cd server
npm run dev
# → MongoDB connected
# → Redis connected
# → Server running on port 5000

# Terminal 2 — Frontend
cd client
npm run dev
# → http://localhost:5173
Docker (Recommended — One Command)
bash
# From repo root
docker compose up --build
# Open http://localhost
Docker Compose starts:

snapurl-server — Express API on port 5000

snapurl-client — React build served by Nginx on port 80

snapurl-nginx — Reverse proxy on port 80

📡 API Documentation
Auth Endpoints
Method	Endpoint	Auth	Body	Response
POST	/api/auth/register	None	{ email, password }	{ accessToken, refreshToken }
POST	/api/auth/login	None	{ email, password }	{ accessToken, refreshToken }
POST	/api/auth/refresh	None	{ refreshToken }	{ accessToken, refreshToken }
URL Endpoints
Method	Endpoint	Auth	Body/Params	Response
POST	/api/urls	Optional	{ originalUrl, customAlias?, expiresAt? }	{ shortCode, shortUrl, originalUrl }
GET	/api/urls/my	Required	—	Array of user's URLs
DELETE	/api/urls/:shortCode	Required	—	{ message }
GET	/:shortCode	None	—	302 redirect
Analytics Endpoints
Method	Endpoint	Auth	Response
GET	/api/analytics/:shortCode	Required	{ totalClicks, clicksByDay, byCountry, byDevice, byReferrer }
GET	/health	None	{ status, uptime }
Error Responses
Code	Meaning
400	Validation error (Joi)
401	Invalid or missing token
403	Forbidden (not your resource)
404	Short URL not found
409	Email or alias already taken
410	URL has expired
429	Rate limit exceeded
500	Internal server error
🔄 Request Flows
Login Flow
text
1. User submits email + password
2. Joi validates body
3. Find user in MongoDB by email
4. bcrypt.compare(password, passwordHash)
5. Sign access token (JWT, 7d)
6. Sign refresh token (JWT, 7d)
7. Save refresh token to user document
8. Return both tokens to client
9. Axios stores tokens in localStorage
URL Shortening Flow
text
1. User submits long URL
2. optionalAuth reads JWT if present (sets req.user)
3. Joi validates { originalUrl: uri().required() }
4. Rate limiter checks Redis token bucket for req.ip
5. Snowflake ID generated (timestamp | machineId | sequence)
6. Base62 encode → 7-character shortCode
7. Save to MongoDB { shortCode, originalUrl, userId, expiresAt }
8. Warm Redis cache: SET url:{shortCode} { originalUrl, expiresAt } EX 86400
9. Return { shortCode, shortUrl, originalUrl }
Redirect Flow
text
1. User hits /{shortCode}
2. Redis GET url:{shortCode}
3. HIT: 
   - Check expiresAt (read-time validation)
   - If expired → DEL key → 410 Gone
   - Else → fireAnalytics() (non-blocking) → 302 Redirect (2–5ms)
4. MISS:
   - MongoDB findOne({ shortCode, isActive: true, expiresAt: { $gt: now } })
   - Not found → 404
   - Found → SET url:{shortCode} in Redis (cache warming)
   - fireAnalytics() (non-blocking) → 302 Redirect (15–20ms)
Analytics Flow
fireAnalytics() called after redirect (non-blocking, no await):

text
1. RPUSH analytics:queue { shortCode, ip, referrer, userAgent, timestamp }
2. User already redirected — they don't wait for this

Analytics Worker (BLPOP loop):
1. BLPOP analytics:queue 0 (blocks until item arrives)
2. geoip.lookup(ip) → { country, city }
3. UAParser(userAgent) → { device.type }
4. Analytics.create({ shortCode, country, city, device, referrer })
5. io.emit(analytics:${shortCode}, { country, device })
6. React dashboard receives event → refetches analytics → charts update
🗄️ Database Schema
User Collection
javascript
{
  _id: ObjectId,
  email: String,          // unique index, lowercase
  passwordHash: String,   // bcrypt hash (12 rounds)
  refreshToken: String,   // current valid refresh token (rotated on use)
  createdAt: Date,
  updatedAt: Date
}
URL Collection
javascript
{
  _id: ObjectId,
  shortCode: String,      // unique index — primary lookup key
  originalUrl: String,    // the destination URL
  customAlias: String,    // null if auto-generated
  userId: ObjectId,       // null for anonymous URLs
  expiresAt: Date,        // null = no expiry; TTL index auto-deletes expired docs
  isActive: Boolean,      // false = soft deleted
  createdAt: Date,
  updatedAt: Date
}
// Indexes: { shortCode: 1 } unique, { expiresAt: 1 } TTL
Analytics Collection
javascript
{
  _id: ObjectId,
  shortCode: String,      // index — links to URL
  ip: String,             // raw IP for geoip lookup
  country: String,        // from geoip-lite
  city: String,           // from geoip-lite
  referrer: String,       // HTTP Referer header or 'Direct'
  device: String,         // 'mobile', 'desktop', 'tablet' from ua-parser
  userAgent: String,      // raw user agent string
  createdAt: Date         // index — for time-range aggregations
}
// Compound index: { shortCode: 1, createdAt: -1 }
Why separate collections? URLs are written once and read millions of times. Analytics are written on every click. Keeping them separate avoids write contention on the URL document and allows independent scaling.

🔴 Redis Usage
Key Patterns
Key Pattern	Value	TTL	Purpose
url:{shortCode}	{ originalUrl, expiresAt } (JSON)	Matches URL expiry (default 86400s)	Fast redirect cache
ratelimit:{ip}	{ tokens, lastRefill } (JSON)	120s	Token bucket per IP
analytics:queue	Array of event JSON strings	None (consumed by worker)	Async analytics queue
Key Design Principles
Namespace all keys: url:, ratelimit:, analytics: — scannable with SCAN url:*

Store JSON values: One GET gives all needed data

TTL on cache keys matches URL expiry: No separate cleanup needed

Explicit DEL on every URL update or delete: Cache invalidation

3-second timeout wrapper on all Redis ops: Redis failure never hangs a redirect

🔐 Authentication
Register
text
POST /api/auth/register { email, password } → 
  bcrypt.hash(password, 12) → 
  User.create({ email, passwordHash }) → 
  Sign accessToken + refreshToken → 
  Save refreshToken to user document → 
  Return both tokens
Login
text
POST /api/auth/login { email, password } → 
  Find user by email → 
  bcrypt.compare(password, passwordHash) → 
  Sign new accessToken + refreshToken → 
  Rotate refreshToken in DB → 
  Return both tokens
Protected Request
text
Authorization: Bearer {accessToken} → 
  auth.middleware.js: jwt.verify(token, JWT_ACCESS_SECRET) → 
  Sets req.user = { userId } → 
  next() → 
  controller runs
Token Refresh (Automatic)
text
Axios interceptor catches 401 → 
  POST /api/auth/refresh { refreshToken } → 
  Verify refreshToken signature → 
  Check refreshToken matches DB (prevents replay attacks) → 
  Issue new accessToken + refreshToken → 
  Retry original request transparently
Optional Auth
text
optionalAuth.middleware.js reads token if present → 
  Valid token: sets req.user → 
  No token / invalid token: passes through (req.user = undefined) → 
  Controller checks req.user?.userId ?? null
📊 Analytics Pipeline
Why Async?
Redirect must complete in <10ms.

DB writes take 20–100ms.

Making the user wait for analytics is unacceptable.

Solution: fire-and-forget.

How it Works
After redirect response is sent:

javascript
cache.pushAnalyticsEvent({ shortCode, ip, referrer, userAgent })
  → redis.rpush('analytics:queue', JSON.stringify(event))
  → .catch(console.error) // never lets analytics crash the redirect
Analytics Worker (runs in same Node process):

javascript
while (true) {
  const result = await redis.blpop('analytics:queue', 0) 
  // BLPOP blocks until an item arrives — zero CPU when idle
  const event = JSON.parse(result[1])
  const geo = geoip.lookup(event.ip)
  const ua = UAParser(event.userAgent)
  await Analytics.create({ ... })
  io.emit(`analytics:${event.shortCode}`, { ... })
}
MongoDB Aggregation Pipelines:

Clicks by day: $match → $group by date → $sort → $limit 7

Top countries: $match → $group by country → $sort → $limit 5

Device split: $match → $group by device → $sort

📡 Real-Time Communication
How it Works
Server (Socket.io):

javascript
Worker writes to MongoDB → 
  io.emit(`analytics:${shortCode}`, { country, device, timestamp })
Client (useSocket hook):

javascript
const socket = io('https://snapurl-api.onrender.com')
socket.on(`analytics:${shortCode}`, (data) => {
  fetchData() // refetch full analytics → charts update
})

// Cleanup: socket.disconnect() on component unmount
Events
Event	Direction	Payload	When
analytics:{shortCode}	Server → Client	{ shortCode, country, device, timestamp }	After every click processed by worker
⚡ Caching Strategy
Cache Hit (fast path — ~2–5ms total)
text
GET url:{shortCode} from Redis → 
  Key exists → 
  Check expiresAt > now (read-time validation) → 
  Valid: fireAnalytics() + return 302
Cache Miss (slow path — ~15–20ms total)
text
GET url:{shortCode} from Redis → 
  Key missing → 
  MongoDB findOne({ shortCode, isActive: true, expiresAt > now }) → 
  Not found: 404 → 
  Found: SET url:{shortCode} in Redis (cache warming) → 
  fireAnalytics() + return 302
Cache Invalidation (on write)
text
User deletes URL → 
  URL.findOneAndUpdate({ isActive: false }) → 
  redis.del(`url:${shortCode}`) // must happen AFTER DB write
TTL Sync
text
On cache set: TTL = Math.floor((expiresAt - Date.now()) / 1000)
No expiry: TTL = 86400 (24h default)
Why three layers? TTL alone fails when user updates expiry after caching. Read-time check catches expired keys before serving stale data. Explicit DEL ensures deactivated links stop working immediately.

🛡️ Rate Limiting
Algorithm: Token Bucket
Why not fixed window? Fixed window flaw: 100 requests at 11:59:59 + 100 at 12:00:01 = 200 requests in 2 seconds. The window resets but the user abused it.

Token Bucket Implementation
Each IP gets a bucket: { tokens: 100, lastRefill: timestamp }
Stored in Redis key: ratelimit:{ip}

On each request:

GET ratelimit:{ip} from Redis

No key → create { tokens: 99, lastRefill: now } → ALLOW

elapsed >= 60s → refill to 100, subtract 1 → ALLOW

tokens > 0 → subtract 1, save → ALLOW

tokens == 0 → return 429 Too Many Requests

Config: 100 requests per 60 seconds per IP

🎯 Design Decisions
Decision	Why
Snowflake ID + Base62	Random strings need a DB uniqueness check (birthday problem at scale). MD5/SHA hashing can produce the same first 7 chars. Auto-increment needs a central counter (SPOF). Snowflake embeds machine ID — two servers can generate IDs simultaneously without coordination and never collide. Base62 encodes 64-bit integer to exactly 7 chars: 62^7 = 3.5T unique codes.
Redis-first caching	1000:1 read/write ratio. Without caching, every redirect hits MongoDB. With Redis, 95%+ redirects resolve in memory under 5ms. Redis also handles rate limiting and analytics queue — one component, three purposes.
Token bucket over fixed window	Fixed window allows bursting at boundaries (2x limit over 2 seconds). Token bucket tracks exact refill timestamp, making bursting impossible regardless of request timing.
Async analytics	Redirect must complete in <10ms. MongoDB write takes 20–100ms. Making user wait for analytics would 10x perceived latency. Fire-and-forget decouples tracking from user experience entirely.
BLPOP over polling	setInterval polling wastes CPU checking empty queue every N ms. BLPOP blocks and sleeps until item arrives — zero CPU when idle, near-zero latency when event arrives.
302 over 301	301 (permanent) gets cached by browser indefinitely — never asks your server again. If user updates short link destination, visitors with cached 301 go to old URL forever. 302 (temporary) always checks server, allowing dynamic updates.
Optional auth middleware	Requiring login creates friction reducing adoption. Optional auth lets anonymous users shorten immediately while authenticated users get URLs saved to account. Same route, two behaviors.
MongoDB over PostgreSQL	Analytics is write-heavy with flexible, evolving schema (new device types, geo fields). Aggregation pipeline handles $match → $group → $sort → $limit cleanly. Document model means URL and metadata are one read.
Docker + Nginx	Docker ensures environment parity. Nginx provides single entry point, handles SSL termination, serves React build as static files (removing need for Node.js to serve frontend), and can load balance across multiple Express instances.
JWT with refresh tokens	Short-lived access tokens limit damage if stolen — expires in minutes. Long-lived refresh tokens stored server-side can be revoked (logout invalidates refresh token in DB). Rotation on refresh means stolen refresh token can only be used once before replaced.
📈 Performance
Metric	Value
Redirect latency — cache hit	~2–5ms
Redirect latency — cache miss	~15–20ms
MongoDB reads saved per redirect	~95% (Redis cache hit rate)
Max unique short codes	3,521,614,606,208 (62^7)
Rate limit	100 requests/min per IP
Redis TTL (default)	86,400 seconds (24 hours)
Analytics processing delay	<1 second (BLPOP wake-up)
Short code length	7 characters
🔒 Security
Concern	Solution
Password storage	bcrypt with 12 salt rounds
API authentication	JWT (RS256-equivalent via HMAC-SHA256)
Token theft mitigation	Short access token expiry + server-side refresh token storage
Brute force	Token bucket rate limiting (100 req/min per IP)
Input injection	Joi validation on all routes rejects malformed input
XSS via headers	Helmet sets X-Content-Type-Options, X-Frame-Options, CSP
Cross-origin abuse	CORS whitelist (only allowed origins can call API)
Secret exposure	Environment variables, never committed to repo
Stale redirects	Hybrid TTL + read-time expiry + explicit cache invalidation
🚢 Deployment
Architecture
text
Vercel (Frontend)                  Render (Backend)
snapurl-jet.vercel.app      →      snapurl-api.onrender.com
React build (CDN)                  Express + Node.js

Both connect to:
  MongoDB Atlas (ap-south-1)
  Upstash Redis (ap-south-1)
Frontend — Vercel
Connected to GitHub repo

Root directory: client

Auto-deploys on every push to main

Backend — Render
Connected to GitHub repo

Root directory: server

Start command: node src/index.js

Environment variables set in Render dashboard

Auto-deploys on every push to main

CI/CD — GitHub Actions
yaml
Runs on every push to main
jobs:
  server-check: # npm install + verify app.js loads
  client-check: # npm install + npm run build
Local Docker
bash
docker compose up --build
# Starts: server + client + nginx
# Access: http://localhost
🔮 Future Improvements
Area	Feature	Benefit
Features	Email verification	Confirm email before account activation
Custom domains	Users bring their own domain (e.g., go.mybrand.com)
Bulk URL import	CSV upload for multiple URLs at once
Admin dashboard	System-wide analytics and user management
API keys	Programmatic access for developers
Link preview	OG tag scraping for rich share previews
Password reset	Email-based reset flow
Infrastructure	Redis Streams	Replace list queue with Streams for replay capability
Bloom filter	Pre-screen invalid short codes before hitting cache/DB
Prometheus + Grafana	Production observability and monitoring
Redis Cluster	High availability for cache layer
Kafka	Replace Redis queue at very high analytics volume
😤 Challenges Faced
Challenge	Solution
Cache invalidation	Getting the three-layer hybrid TTL (TTL sync + read-time check + explicit DEL) right took multiple iterations. The hardest case: a user deactivates a link — Redis keeps serving it until TTL expires unless you explicitly delete the key on every write.
Redis connection on deployment	Upstash free tier databases expire after inactivity. Learned to use the rediss:// (TLS) scheme and wrap all Redis operations in a timeout promise so a slow Redis never hangs a redirect.
Socket.io CORS	Different ports in development (5173, 5174, 5175...) required a dynamic CORS origin array. Production required adding the Vercel domain explicitly.
JWT state across navigation	React's useState resets on navigation. Using localStorage as the source of truth for auth state (read on every mount) solved the "logged in but dashboard shows 401" bug.
Redirect route order	/:shortCode must be registered after all /api/* routes. Express matches routes top-to-bottom — a misplaced dynamic route silently swallows all API calls.
Snowflake ID with BigInt	JavaScript's Number type can't represent 64-bit integers without precision loss. Snowflake requires BigInt arithmetic, which doesn't play well with Math.floor. Required careful casting between BigInt and Number at encode time.
📚 Learning Outcomes
Area	Key Learnings
System Design	Designing for scale (even when building for portfolio) forces better architectural decisions — separating concerns, thinking about bottlenecks, choosing the right data store for each job.
Redis	Using Redis as a cache, rate limiter, and message queue showed how a single infrastructure component can serve multiple purposes.
Async Processing	The fire-and-forget pattern with BLPOP is a simplified version of what production systems like Uber and Twitter use for analytics ingestion.
JWT Security	Understanding why rotation matters, why refresh tokens must be stored server-side, and how auto-refresh via interceptors works transparently.
Docker	Multi-stage builds: building the React app in one stage and serving it from Nginx in another reduces the final image size significantly.
Nginx	As a reverse proxy: routing, SSL termination, and static file serving — three jobs in one config file.
CI/CD	Automating build checks on every push prevents shipping broken code.
📜 License
MIT License — see LICENSE for details.

<div align="center">
Built with ❤️ by Vanisha Raj Tanwar

⭐ Star this repo if you found it helpful! ⭐

</div> ```