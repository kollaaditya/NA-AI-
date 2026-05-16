# NA AI Systems — Local Setup Guide

Complete step-by-step instructions to get the platform running locally in under 10 minutes.

---

## Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| Node.js | 18 LTS or 20 LTS | https://nodejs.org |
| Git | Any | https://git-scm.com |
| MongoDB Atlas account | Free tier works | https://cloud.mongodb.com |
| OpenAI account | Pay-as-you-go | https://platform.openai.com |
| Cloudinary account | Free tier works | https://cloudinary.com |

---

## Step 1 — Install Dependencies

Open a terminal in the project root (`na-ai-systems/`):

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

---

## Step 2 — Configure Environment Variables

The file `server/.env` has already been created with a secure JWT secret.
You only need to fill in 5 values:

```
na-ai-systems/
└── server/
    └── .env   ← open this file now
```

### 2a — MongoDB Atlas URI

1. Go to https://cloud.mongodb.com
2. Create a free M0 cluster (or use existing)
3. Click **Connect** → **Drivers** → copy the connection string
4. Replace the placeholder in `server/.env`:

```env
MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.abc12.mongodb.net/na-ai-systems?retryWrites=true&w=majority
```

> Make sure your IP is whitelisted in Atlas → Network Access → Add IP Address → Allow from Anywhere (0.0.0.0/0) for dev.

### 2b — OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Click **Create new secret key**
3. Copy and paste into `server/.env`:

```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> The platform uses `gpt-4o-mini` which costs ~$0.00015 per 1K input tokens — very cheap for development.

### 2c — Cloudinary Credentials

1. Go to https://cloudinary.com → sign in → Dashboard
2. Copy **Cloud Name**, **API Key**, **API Secret**
3. Paste into `server/.env`:

```env
CLOUDINARY_CLOUD_NAME=my_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
```

> Cloudinary is only used when uploading product images. The analyzer works without it if no image is attached.

### Final server/.env should look like:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/na-ai-systems?retryWrites=true&w=majority
JWT_SECRET=db5b5211b4ad69a6c75ae79330848080582382ec4f3a5b5f68a35ab52bb7c794
CLIENT_URL=http://localhost:5173
OPENAI_API_KEY=sk-proj-your-key-here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
LOG_LEVEL=info
```

---

## Step 3 — Seed the Database

This creates the admin user and demo user automatically:

```bash
# From the project root
cd server
npm run seed
```

Expected output:
```
  Connecting to MongoDB Atlas...
  Connected.

  Admin  -> admin@naaisystems.com | role: admin
  Demo   -> demo@naaisystems.com  | role: user
  Sample contact created.

  Seed complete!
  Admin  -> admin@naaisystems.com  /  Admin@123
  Demo   -> demo@naaisystems.com   /  Demo@123
```

---

## Step 4 — Start Development Servers

Open **two separate terminals**:

**Terminal 1 — Backend API:**
```bash
cd na-ai-systems/server
npm run dev
```

Expected output:
```
[nodemon] starting `node index.js`
info: MongoDB Connected: cluster0.xxxxx.mongodb.net
info: Server running on port 5000 in development mode
```

**Terminal 2 — Frontend:**
```bash
cd na-ai-systems/client
npm run dev
```

Expected output:
```
  VITE v8.x.x  ready in 300ms

  Local:   http://localhost:5173/
  Network: http://192.168.x.x:5173/
```

---

## Step 5 — Open the App

| URL | Description |
|-----|-------------|
| http://localhost:5173 | Landing page |
| http://localhost:5173/login | Login |
| http://localhost:5173/register | Register new account |
| http://localhost:5173/dashboard | Main dashboard (requires login) |
| http://localhost:5000/health | API health check |

**Login with seeded credentials:**
- Admin: `admin@naaisystems.com` / `Admin@123`
- Demo:  `demo@naaisystems.com`  / `Demo@123`

---

## Step 6 — Verify Everything Works

Run through this checklist after logging in:

- [ ] Landing page loads with animations
- [ ] Register a new account at `/register`
- [ ] Login redirects to `/dashboard`
- [ ] Dashboard shows stats and chart
- [ ] Product Analyzer: submit a product title + description → AI returns JSON result
- [ ] Proposal Generator: enter company name, budget, industry → AI generates proposal
- [ ] Impact Report: click Generate → AI returns ESG metrics with charts
- [ ] AI Chat: send a message → bot replies
- [ ] Contact form on landing page submits successfully
- [ ] Admin panel visible when logged in as `admin@naaisystems.com`

---

## Troubleshooting

### "MongoDB connection error"
- Check your `MONGODB_URI` in `server/.env`
- Ensure your IP is whitelisted in MongoDB Atlas → Network Access
- Verify the database user password has no special characters that need URL-encoding

### "OpenAI API error"
- Verify `OPENAI_API_KEY` starts with `sk-`
- Check you have credits at https://platform.openai.com/usage
- The app uses `gpt-4o-mini` — ensure your account has access

### "CORS error" in browser console
- Ensure `CLIENT_URL=http://localhost:5173` in `server/.env`
- Ensure the backend is running on port 5000
- Hard-refresh the browser (Ctrl+Shift+R)

### Port already in use
```bash
# Kill process on port 5000 (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Kill process on port 5173 (Windows)
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Nodemon not found
```bash
cd server
npm install --save-dev nodemon
```

---

## AWS Deployment (Production)

See the full deployment guide in `README.md`:
- Backend → AWS EC2 + PM2 + Nginx
- Frontend → AWS S3 + CloudFront
- DNS + SSL → Cloudflare

Quick production checklist:
1. Set `NODE_ENV=production` in server `.env`
2. Set `CLIENT_URL=https://yourdomain.com` in server `.env`
3. Update `VITE_API_URL=https://api.yourdomain.com/api` in client `.env`
4. Run `npm run build` in `client/`
5. Run `pm2 start ecosystem.config.js --env production`

---

## Project Structure Quick Reference

```
na-ai-systems/
├── client/src/
│   ├── pages/
│   │   ├── LandingPage.jsx          ← public homepage
│   │   ├── auth/LoginPage.jsx       ← login
│   │   ├── auth/RegisterPage.jsx    ← register
│   │   └── dashboard/
│   │       ├── DashboardPage.jsx    ← overview + charts
│   │       ├── ProductAnalyzerPage  ← AI product tool
│   │       ├── ProposalGeneratorPage← AI B2B proposals
│   │       ├── ImpactReportPage     ← ESG reports
│   │       ├── ChatSupportPage      ← AI chat bot
│   │       └── AdminPage            ← admin panel
│   ├── context/AuthContext.jsx      ← auth state
│   └── services/api.js              ← axios + interceptors
│
└── server/
    ├── index.js                     ← express entry point
    ├── routes/                      ← auth, products, proposals, dashboard, support
    ├── controllers/                 ← business logic
    ├── models/                      ← mongoose schemas
    ├── services/aiService.js        ← OpenAI integration
    ├── middleware/                  ← auth, errors, upload, validate
    └── scripts/seed.js              ← database seeder
```
