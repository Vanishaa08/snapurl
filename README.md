# ⚡ SnapURL

Production-Grade Distributed URL Shortener

<div align="center">

[![Demo](https://img.shields.io/badge/demo-live-00c853?style=for-the-badge)](https://snapurl-jet.vercel.app)
[![API](https://img.shields.io/badge/api-online-00c853?style=for-the-badge)](https://snapurl-api.onrender.com)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)

</div>

---

## Links

| Resource | URL |
|----------|-----|
| Frontend | https://snapurl-jet.vercel.app |
| Backend API | https://snapurl-api.onrender.com |
| GitHub | https://github.com/Vanishaa08/snapurl |

---

## Features

### User Features
- Instant URL shortening to 7-character codes
- QR code generation for every short URL
- One-click copy to clipboard
- Anonymous history (last 5 links in browser)
- Expiry countdown timer

### Authentication
- Email + password registration and login
- JWT access tokens with refresh token rotation
- Auto token refresh via Axios interceptor
- Optional auth (anonymous users can shorten URLs)

### URL Management
- Anonymous shortening (no login required)
- Custom aliases (e.g., snapurl/my-brand)
- URL expiry (set time-to-live)
- Soft delete with cache invalidation
- Per-URL analytics

### Analytics Dashboard
- Total clicks tracking
- Clicks over time (last 7 days chart)
- Geographic distribution (top countries)
- Device breakdown (mobile, desktop, tablet)
- Referrer tracking

### Real-Time Dashboard
- Live updates via Socket.io
- Auto-refresh on every click
- No manual refresh needed

### Security
- Token bucket rate limiting (100 requests/min per IP)
- Joi input validation
- Helmet security headers
- CORS configuration
- Morgan request logging
- Health check endpoint

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js + Vite |
| Charts | Recharts |
| Real-time | Socket.io-client |
| HTTP Client | Axios |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas |
| Cache + Queue | Redis (Upstash) |
| Auth | JWT |
| Validation | Joi |
| ID Generation | Snowflake ID + Base62 |
| Containerization | Docker + Docker Compose |
| Reverse Proxy | Nginx |
| CI/CD | GitHub Actions |
| Frontend Deploy | Vercel |
| Backend Deploy | Render |

---

## Architecture

```
┌─────────────────────────────────────────────┐
│              CLIENT (React)                  │
│        Vite · Recharts · Socket.io           │
└──────────────────┬──────────────────────────┘
                   │ HTTPS
┌──────────────────▼──────────────────────────┐
│                   NGINX                       │
│           Reverse Proxy · SSL                │
└────────┬───────────────────────┬────────────┘
         │ /api/*                │ /*
┌────────▼──────────┐  ┌─────────▼────────────┐
│  EXPRESS API      │  │  REACT STATIC BUILD   │
│ Auth · URLs       │  │  Served by Nginx      │
└────────┬──────────┘  └────────────────────────┘
         │
    ┌────┼────┐
    │    │    │
┌───▼──┐ ┌▼───────────────────┐
│REDIS │ │   MONGODB ATLAS     │
│Cache │ │ Users · URLs        │
│Queue │ │ Analytics           │
└───┬──┘ └─────────────────────┘
    │
    │ BLPOP
┌───▼──────────────────────────┐
│     ANALYTICS WORKER          │
│  geoip · ua-parser · Socket   │
└───────────────────────────────┘
```

---

## System Design

### Write Path (Shorten URL)
```
User → Rate Limiter → Validation → Snowflake ID → Base62 Encode → 
Save to MongoDB → Warm Redis Cache → Return Short URL
```

### Read Path (Redirect)
```
User → Redis Lookup → 
  HIT: Redirect (2-5ms) + Async Analytics
  MISS: MongoDB Lookup → Warm Redis → Redirect + Async Analytics
```

### Analytics Path
```
Click → RPUSH to Redis Queue → BLPOP Worker → 
geoip → ua-parser → MongoDB → Socket.io → Dashboard Update
```

---

## Installation

### Prerequisites
- Node.js 20+
- Docker (optional)
- MongoDB Atlas account
- Upstash Redis account

### Clone & Install

```bash
git clone https://github.com/Vanishaa08/snapurl.git
cd snapurl

# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```

---

## Environment Variables

### Backend (`server/.env`)

```bash
PORT=5000
MONGO_URI=mongodb+srv://...
REDIS_URL=rediss://...
JWT_ACCESS_SECRET=your_secret
JWT_REFRESH_SECRET=your_secret
JWT_ACCESS_EXPIRY=7d
JWT_REFRESH_EXPIRY=7d
MACHINE_ID=1
BASE_URL=https://snapurl-api.onrender.com
CLIENT_URL=https://snapurl-jet.vercel.app
```

```bash
cp server/.env.example server/.env
```

---

## Running the Project

### Local Development

```bash
# Backend
cd server
npm run dev

# Frontend
cd client
npm run dev
```

### Docker

```bash
docker compose up --build
# Open http://localhost
```

---

## API Documentation

### Auth Endpoints

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | `/api/auth/register` | `{ email, password }` | `{ accessToken, refreshToken }` |
| POST | `/api/auth/login` | `{ email, password }` | `{ accessToken, refreshToken }` |
| POST | `/api/auth/refresh` | `{ refreshToken }` | `{ accessToken, refreshToken }` |

### URL Endpoints

| Method | Endpoint | Auth | Body | Response |
|--------|----------|------|------|----------|
| POST | `/api/urls` | Optional | `{ originalUrl, customAlias?, expiresAt? }` | `{ shortCode, shortUrl }` |
| GET | `/api/urls/my` | Required | - | Array of URLs |
| DELETE | `/api/urls/:shortCode` | Required | - | `{ message }` |
| GET | `/:shortCode` | None | - | 302 Redirect |

### Analytics Endpoints

| Method | Endpoint | Auth | Response |
|--------|----------|------|----------|
| GET | `/api/analytics/:shortCode` | Required | `{ totalClicks, clicksByDay, byCountry, byDevice, byReferrer }` |
| GET | `/health` | None | `{ status, uptime }` |

### Error Codes

| Code | Meaning |
|------|---------|
| 400 | Validation error |
| 401 | Invalid token |
| 403 | Forbidden |
| 404 | Not found |
| 409 | Already exists |
| 410 | Expired |
| 429 | Rate limit exceeded |
| 500 | Server error |

---

## Database Schema

### User

```javascript
{
  _id: ObjectId,
  email: String,
  passwordHash: String,
  refreshToken: String,
  createdAt: Date,
  updatedAt: Date
}
```

### URL

```javascript
{
  _id: ObjectId,
  shortCode: String,
  originalUrl: String,
  customAlias: String,
  userId: ObjectId,
  expiresAt: Date,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Analytics

```javascript
{
  _id: ObjectId,
  shortCode: String,
  ip: String,
  country: String,
  city: String,
  referrer: String,
  device: String,
  userAgent: String,
  createdAt: Date
}
```

---

## Redis Keys

| Key | Value | TTL | Purpose |
|-----|-------|-----|---------|
| `url:{shortCode}` | `{ originalUrl, expiresAt }` | URL expiry | Cache |
| `ratelimit:{ip}` | `{ tokens, lastRefill }` | 120s | Rate limiting |
| `analytics:queue` | Event array | None | Analytics queue |

---

## Performance

| Metric | Value |
|--------|-------|
| Redirect (cache hit) | 2-5ms |
| Redirect (cache miss) | 15-20ms |
| Cache hit rate | ~95% |
| Unique codes | 3.5 trillion |
| Rate limit | 100/min per IP |

---

## Deployment

### Vercel (Frontend)
- Root: `client`
- Auto-deploys on push to main

### Render (Backend)
- Root: `server`
- Start: `node src/index.js`
- Auto-deploys on push to main

---

## License

MIT License

---

<div align="center">

Built with ❤️ by **Vanisha Raj Tanwar**

⭐ Star this repo if you found it helpful!

</div>