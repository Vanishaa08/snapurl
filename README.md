# SnapURL — Distributed URL Shortener with Real-Time Analytics

A production-grade URL shortener with sub-10ms redirects, real-time analytics, and QR code generation.

![Tech Stack](https://img.shields.io/badge/Node.js-Express-green) ![MongoDB](https://img.shields.io/badge/Database-MongoDB-green) ![Redis](https://img.shields.io/badge/Cache-Redis-red) ![Docker](https://img.shields.io/badge/Container-Docker-blue)

## Features
- Shorten any URL to a 7-character code
- Sub-10ms redirects via Redis-first caching
- Real-time analytics dashboard (clicks, geography, device, referrer)
- QR code generation for every short URL
- JWT authentication (anonymous + registered users)
- Token bucket rate limiting (100 req/min per IP)
- Custom alias support for registered users
- URL expiry with TTL-based invalidation
- Fully containerized with Docker Compose

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Vite, Recharts, Socket.io-client |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Cache + Queue | Redis (Upstash) |
| Real-time | Socket.io |
| Auth | JWT (access + refresh tokens) |
| Validation | Joi |
| Containerization | Docker + Docker Compose |
| Reverse Proxy | Nginx |

## Architecture
Client (React) → Nginx → Express API → MongoDB
↓
Redis (cache + rate limit + queue)
↓
Analytics Worker (BLPOP)
↓
Socket.io → Dashboard

## Key Design Decisions
- **Snowflake ID + Base62**: Collision-free 7-char codes supporting 3.5 trillion URLs
- **Redis-first caching**: 95% of redirects never touch MongoDB
- **Hybrid TTL**: Redis TTL + read-time expiry check for correctness
- **Async analytics**: Fire-and-forget pipeline keeps redirect latency under 10ms
- **Token bucket**: Prevents fixed-window boundary exploits
- **AP over CP**: Redis serves as availability buffer during MongoDB downtime

## Quick Start

### Local Development
```bash
# Clone the repo
git clone https://github.com/Vanishaa08/snapurl.git
cd snapurl

# Setup server
cd server
cp .env.example .env
# Add your MongoDB and Redis credentials to .env
npm install
npm run dev

# Setup client (new terminal)
cd client
npm install
npm run dev
Docker (Recommended)
bash
# Clone and configure
git clone https://github.com/Vanishaa08/snapurl.git
cd snapurl

# Add your credentials to .env
cp server/.env.example .env

# Run everything
docker compose up --build
Open http://localhost in your browser.

API Reference
POST /api/auth/register Register new user
POST /api/auth/login Login
POST /api/auth/refresh Refresh access token
POST /api/urls Shorten URL (anonymous or auth)
GET /api/urls/my Get user's URLs (auth required)
DELETE /api/urls/:shortCode Delete URL (auth required)
GET /:shortCode Redirect to original URL
GET /api/analytics/:shortCode Get analytics data
GET /health Health check

Environment Variables
PORT=5000
MONGO_URI=your_mongodb_uri
REDIS_URL=your_redis_url
JWT_ACCESS_SECRET=your_secret
JWT_REFRESH_SECRET=your_secret
JWT_ACCESS_EXPIRY=7d
JWT_REFRESH_EXPIRY=7d
MACHINE_ID=1
BASE_URL=http://localhost:5000
CLIENT_URL=http://localhost:3000

GitHub
github.com/Vanishaa08/snapurl
