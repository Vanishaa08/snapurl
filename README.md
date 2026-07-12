SnapURL - Production-Grade Distributed URL Shortener
<div align="center">
https://via.placeholder.com/1200x300/0a0a0a/ffffff?text=SnapURL

⚡ Shorten URLs to 7-character codes · Sub-10ms redirects via Redis · Real-time analytics dashboard

https://img.shields.io/badge/demo-live-00c853?style=for-the-badge
https://img.shields.io/badge/api-online-00c853?style=for-the-badge
https://img.shields.io/badge/license-MIT-blue?style=for-the-badge
https://img.shields.io/badge/PRs-welcome-brightgreen?style=for-the-badge

https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white
https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js&logoColor=white
https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white
https://img.shields.io/badge/Redis-Upstash-DC382D?logo=redis&logoColor=white
https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white
https://img.shields.io/badge/Frontend-Vercel-000000?logo=vercel&logoColor=white
https://img.shields.io/badge/Backend-Render-46E3B7?logo=render&logoColor=white

Shorten, track, and analyze URLs with enterprise-grade performance and real-time insights

</div>
📋 Table of Contents
<details> <summary><b>Click to expand</b></summary>
Demo

Features

Architecture

Tech Stack

System Design

Folder Structure

Installation

Environment Variables

Running the Project

API Documentation

Request Flows

Database Schema

Redis Usage

Authentication

Analytics Pipeline

Real-Time Communication

Caching Strategy

Rate Limiting

Design Decisions

Performance

Security

Deployment

Future Improvements

Challenges Faced

Learning Outcomes

License

</details>
🌐 Demo
Resource	URL
Frontend	https://snapurl-jet.vercel.app
Backend API	https://snapurl-api.onrender.com
Health Check	https://snapurl-api.onrender.com/health
GitHub	https://github.com/Vanishaa08/snapurl
✨ Features
👤 User Features
⚡ Instant Shortening - Convert any URL to a 7-character code in milliseconds

📱 QR Code Generation - Every short URL includes a scannable QR code

📋 One-Click Copy - Copy short URLs to clipboard with toast notifications

📜 Anonymous History - Last 5 links stored locally in browser

⏱️ Expiry Countdown - Visual timer showing when links will expire

🔐 Authentication
📝 Email + Password - Register and login securely

🎫 JWT Access Tokens - Stateless authentication with rotating refresh tokens

🔄 Auto Token Refresh - Axios interceptor handles token rotation transparently

🎭 Optional Auth - Anonymous users can shorten; registered users get full features

🔗 URL Management
🔓 Anonymous Shortening - No login required to create short URLs

🏷️ Custom Aliases - Choose your own slug (e.g., snapurl/my-brand)

⏳ URL Expiry - Set time-to-live for temporary links

🗑️ Soft Delete - Deactivate links with immediate cache invalidation

📊 Per-URL Analytics - Detailed metrics for each shortened link

📈 Analytics Dashboard
👆 Total Clicks - Track overall engagement

📅 Clicks Over Time - Line chart showing last 7 days of activity

🌍 Top Countries - Geographic distribution of clicks (bar chart)

📱 Device Breakdown - Mobile, desktop, and tablet usage (pie chart)

🔗 Referrer Tracking - See where your traffic comes from

📡 Real-Time Dashboard
🔴 Live Updates - Socket.io pushes new click events instantly

🔄 Auto-Refresh - Dashboard fetches new analytics on every click

🚀 Zero Manual Refresh - Always up-to-date without reloading

🛡️ Security & Reliability
🪣 Token Bucket Rate Limiting - 100 requests/min per IP

✅ Joi Input Validation - All routes protected from injection

🛡️ Helmet Security Headers - Protection against common web vulnerabilities

🌐 CORS Configuration - Controlled cross-origin access

📝 Morgan Request Logging - Comprehensive request tracking

❤️ Health Check Endpoint - Monitor service status

🏗️ Architecture






















Data Flow Overview




























🛠️ Tech Stack
Layer	Technology	Purpose
Frontend	React.js + Vite	Component-based UI, fast HMR
Charts	Recharts	Analytics visualizations
Real-time (client)	Socket.io-client	Live dashboard updates
HTTP Client	Axios + interceptors	API calls + auto token refresh
Backend	Node.js + Express.js	REST API server
Database	MongoDB Atlas	Persistent storage
Cache + Queue	Redis (Upstash)	URL cache, rate limits, analytics queue
Auth	JWT	Stateless authentication
Validation	Joi	Input schema validation
Logging	Morgan	HTTP request logging
Real-time (server)	Socket.io	Push analytics to dashboard
ID Generation	Snowflake ID + Base62	Collision-free short codes
Containerization	Docker + Docker Compose	Full stack in one command
Reverse Proxy	Nginx	Traffic routing + static serving
CI/CD	GitHub Actions	Auto-check on every push
Frontend Deploy	Vercel	Global CDN
Backend Deploy	Render	Auto-deploy from GitHub
🔧 System Design
High-Level Architecture





















Write Path (URL Shortening)
Read Path (Redirect)
Analytics Pipeline
















Database Schema Relationships




























































📁 Folder Structure



















































⚙️ Installation
Prerequisites
Node.js 20+

Docker (for Docker setup)

MongoDB Atlas account (free tier)

Upstash Redis account (free tier)

Clone
bash
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

Deployment Flow


















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
Complete System Flow




























Token Refresh Flow
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
Redis Key Architecture
Key Design Principles
Namespace all keys: url:, ratelimit:, analytics: — scannable with SCAN url:*

Store JSON values: One GET gives all needed data

TTL on cache keys matches URL expiry: No separate cleanup needed

Explicit DEL on every URL update or delete: Cache invalidation

3-second timeout wrapper on all Redis ops: Redis failure never hangs a redirect

🔐 Authentication
Authentication Flow





























📊 Analytics Pipeline
Analytics Data Flow




























📡 Real-Time Communication
Socket.io Architecture
⚡ Caching Strategy
Cache Flow Decision Tree
🛡️ Rate Limiting
Token Bucket Algorithm
🎯 Design Decisions
Comparative Analysis

















📈 Performance
Performance Metrics
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
Security Layers






















🚢 Deployment
CI/CD Pipeline



















🔮 Future Improvements
📧 Email verification — confirm email before account activation

🌐 Custom domains — users bring their own domain (e.g., go.mybrand.com)

📤 Bulk URL import — CSV upload for multiple URLs at once

👑 Admin dashboard — system-wide analytics and user management

🔑 API keys — programmatic access for developers

🖼️ Link preview — OG tag scraping for rich share previews

🔄 Password reset — email-based reset flow

📊 Redis Streams — replace Redis list queue with Streams for replay capability

🌸 Bloom filter — pre-screen invalid short codes before hitting cache or DB

📈 Monitoring — Prometheus + Grafana for production observability

🔴 Redis Cluster — high availability for cache layer

📨 Kafka — replace Redis queue with Kafka at very high analytics volume

😤 Challenges Faced


















Cache invalidation: Getting the three-layer hybrid TTL (TTL sync + read-time check + explicit DEL) right took multiple iterations. The hardest case: a user deactivates a link — Redis keeps serving it until TTL expires unless you explicitly delete the key on every write.

Redis connection on deployment: Upstash free tier databases expire after inactivity. Learned to use the rediss:// (TLS) scheme and wrap all Redis operations in a timeout promise so a slow Redis never hangs a redirect.

Socket.io CORS: Different ports in development (5173, 5174, 5175...) required a dynamic CORS origin array. Production required adding the Vercel domain explicitly.

JWT state across navigation: React's useState resets on navigation. Using localStorage as the source of truth for auth state (read on every mount) solved the "logged in but dashboard shows 401" bug.

Redirect route order: /:shortCode must be registered after all /api/* routes. Express matches routes top-to-bottom — a misplaced dynamic route silently swallows all API calls.

Snowflake ID with BigInt: JavaScript's Number type can't represent 64-bit integers without precision loss. Snowflake requires BigInt arithmetic, which doesn't play well with Math.floor. Required careful casting between BigInt and Number at encode time.

📚 Learning Outcomes
System design thinking: Designing for scale (even when building for portfolio) forces better architectural decisions — separating concerns, thinking about bottlenecks, choosing the right data store for each job.

Redis beyond caching: Using Redis as a cache, rate limiter, and message queue showed how a single infrastructure component can serve multiple purposes.

Async processing patterns: The fire-and-forget pattern with BLPOP is a simplified version of what production systems like Uber and Twitter use for analytics ingestion.

JWT security: Understanding why rotation matters, why refresh tokens must be stored server-side, and how auto-refresh via interceptors works transparently.

Docker multi-stage builds: Building the React app in one stage and serving it from Nginx in another reduces the final image size significantly.

Nginx as a reverse proxy: Routing, SSL termination, and static file serving — three jobs in one config file.

CI/CD fundamentals: Automating build checks on every push prevents shipping broken code.

📜 License
MIT License — see LICENSE for details.

<div align="center">
Built with ❤️ by Vanisha Raj Tanwar
⭐ Star this repo if you found it helpful! ⭐

</div>