# NA AI Systems 🌿🤖

**AI-Powered Sustainable Commerce Platform**

A production-ready full-stack SaaS platform that transforms sustainable commerce with AI-powered product categorization, B2B proposal generation, ESG impact reporting, and intelligent customer support.

---

## 🚀 Features

| Feature | Description |
|---|---|
| 🏷️ AI Product Analyzer | Auto-categorize products with SEO tags, eco scores & sustainability filters |
| 📋 B2B Proposal Generator | AI-generated proposals with ROI estimates, budget allocation & PDF export |
| 🌱 ESG Impact Reports | Carbon reduction, plastic savings, eco scores & ESG summaries |
| 💬 AI Support Bot | 24/7 GPT-4 powered chat with FAQ automation & order support |
| 📊 Admin Dashboard | Full analytics, user management, AI logs & contact management |
| 🔒 Enterprise Security | JWT auth, rate limiting, Helmet, Cloudflare SSL |

---

## 🛠️ Tech Stack

**Frontend:** React 18 · Vite · Tailwind CSS · Framer Motion · Recharts · React Router DOM · Axios

**Backend:** Node.js · Express.js · MongoDB Atlas · Mongoose · JWT · bcryptjs · Helmet · OpenAI API

**Infrastructure:** AWS EC2 · AWS S3 · AWS CloudFront · Cloudflare CDN/SSL · MongoDB Atlas · PM2

---

## 📁 Project Structure

```
na-ai-systems/
├── client/                    # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── landing/       # Navbar, Hero, Features, FAQ, Contact, Footer
│   │   │   ├── ui/            # Reusable UI components
│   │   │   ├── dashboard/     # Dashboard-specific components
│   │   │   └── ai/            # AI tool components
│   │   ├── pages/
│   │   │   ├── auth/          # Login, Register
│   │   │   └── dashboard/     # Dashboard, Products, Proposals, Impact, Chat, Admin
│   │   ├── layouts/           # PublicLayout, DashboardLayout
│   │   ├── context/           # AuthContext, ThemeContext
│   │   ├── hooks/             # useProducts, useProposals, useCountUp
│   │   ├── services/          # API service layer (Axios)
│   │   └── utils/             # Utility helpers
│   └── public/
├── server/                    # Node.js + Express backend
│   ├── config/                # DB, Cloudinary, OpenAI config
│   ├── controllers/           # Auth, Product, Proposal, Dashboard, Contact
│   ├── middleware/            # Auth, ErrorHandler, Upload, Validate
│   ├── models/                # User, Product, Proposal, AILog, Contact, ChatMessage
│   ├── routes/                # auth, products, proposals, dashboard, support
│   ├── services/              # aiService (OpenAI integration)
│   ├── utils/                 # logger, jwt, response helpers
│   ├── validations/           # express-validator schemas
│   └── index.js               # Express app entry point
├── ecosystem.config.js        # PM2 configuration
├── nginx.conf                 # Nginx reverse proxy config
├── deploy.sh                  # EC2 deployment script
├── deploy-frontend.sh         # S3 + CloudFront deployment script
└── README.md
```

---

## ⚡ Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- OpenAI API key
- Cloudinary account

### 1. Clone & Install

```bash
git clone https://github.com/your-org/na-ai-systems.git
cd na-ai-systems

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Configure Environment Variables

```bash
# Server
cp server/.env.example server/.env
# Edit server/.env with your values

# Client
cp client/.env.example client/.env
```

**server/.env required values:**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/na-ai-systems
JWT_SECRET=your_32_char_minimum_secret_key
CLIENT_URL=http://localhost:5173
OPENAI_API_KEY=sk-your-openai-key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Create Admin User

After starting the server, register via the UI at `/register`, then manually update the user role in MongoDB Atlas:
```javascript
// In MongoDB Atlas Data Explorer or Compass
db.users.updateOne({ email: "admin@naaisystems.com" }, { $set: { role: "admin" } })
```

### 4. Run Development Servers

```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

---

## ☁️ AWS Deployment Guide

### Backend — AWS EC2

**1. Launch EC2 Instance**
- AMI: Ubuntu 22.04 LTS
- Instance type: t3.small (minimum) or t3.medium (recommended)
- Security Group: Allow ports 22 (SSH), 80 (HTTP), 443 (HTTPS), 5000 (API)

**2. Run Deployment Script**
```bash
# SSH into your EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Upload and run deploy script
scp deploy.sh ubuntu@your-ec2-ip:~/
chmod +x deploy.sh && ./deploy.sh
```

**3. Configure Environment**
```bash
nano /var/www/na-ai-systems/server/.env
# Fill in all production values
pm2 restart na-ai-systems-api
```

### Frontend — AWS S3 + CloudFront

**1. Create S3 Bucket**
```bash
aws s3 mb s3://na-ai-systems-frontend --region us-east-1
aws s3 website s3://na-ai-systems-frontend --index-document index.html --error-document index.html
```

**2. Create CloudFront Distribution**
- Origin: Your S3 bucket
- Default root object: `index.html`
- Error pages: 404 → `/index.html` (for React Router)
- Price class: Use All Edge Locations

**3. Deploy Frontend**
```bash
# Update CLOUDFRONT_DIST_ID in deploy-frontend.sh
chmod +x deploy-frontend.sh && ./deploy-frontend.sh
```

### AWS Elastic Beanstalk (Alternative)

```bash
# Install EB CLI
pip install awsebcli

# Initialize and deploy
cd na-ai-systems
eb init na-ai-systems --platform node.js --region us-east-1
eb create production --instance-type t3.small
eb setenv NODE_ENV=production PORT=5000 MONGODB_URI=... JWT_SECRET=...
eb deploy
```

---

## 🌐 Cloudflare Configuration

### DNS Setup
```
Type    Name    Content              Proxy
A       @       your-ec2-ip          ✅ Proxied
A       www     your-ec2-ip          ✅ Proxied
CNAME   api     your-ec2-ip          ✅ Proxied
```

### SSL/TLS Settings
- **Mode:** Full (Strict) — requires Cloudflare Origin Certificate on server
- **Min TLS Version:** TLS 1.2
- **Always Use HTTPS:** ON
- **HSTS:** Enable with 6-month max-age

### Performance Settings
- **Auto Minify:** JavaScript ✅ CSS ✅ HTML ✅
- **Brotli Compression:** ON
- **Rocket Loader:** ON
- **HTTP/2:** ON

### Cache Rules
```
# Cache static assets for 1 year
URL Pattern: *.naaisystems.com/assets/*
Cache Level: Cache Everything
Edge Cache TTL: 1 year

# Never cache API routes
URL Pattern: *.naaisystems.com/api/*
Cache Level: Bypass
```

### Security Settings
- **WAF:** Enable Cloudflare Managed Ruleset
- **Bot Fight Mode:** ON
- **Rate Limiting:** 100 req/10min per IP on `/api/*`
- **DDoS Protection:** ON (automatic)

---

## 🔌 API Documentation

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |
| PUT | `/api/auth/profile` | Update profile | ✅ |

### Products (AI Categorization)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/products/analyze` | Analyze product with AI | ✅ |
| GET | `/api/products` | Get all user products | ✅ |
| GET | `/api/products/:id` | Get single product | ✅ |
| DELETE | `/api/products/:id` | Delete product | ✅ |

### Proposals (B2B Generator)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/proposals` | Generate B2B proposal | ✅ |
| GET | `/api/proposals` | Get all proposals | ✅ |
| GET | `/api/proposals/:id` | Get single proposal | ✅ |
| DELETE | `/api/proposals/:id` | Delete proposal | ✅ |

### Dashboard & Reports

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/dashboard/stats` | Get user dashboard stats | ✅ |
| POST | `/api/dashboard/impact-report` | Generate ESG report | ✅ |
| GET | `/api/dashboard/admin/stats` | Admin overview stats | 🔐 Admin |
| GET | `/api/dashboard/admin/users` | List all users | 🔐 Admin |
| PUT | `/api/dashboard/admin/users/:id/toggle` | Toggle user status | 🔐 Admin |
| GET | `/api/dashboard/admin/contacts` | Get contact submissions | 🔐 Admin |

### Support

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/support/contact` | Submit contact form | ❌ |
| POST | `/api/support/chat` | Send chat message | ❌ |
| GET | `/api/support/chat/:sessionId` | Get chat history | ✅ |

### Example API Request

```bash
# Register
curl -X POST https://api.naaisystems.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@company.com","password":"secret123"}'

# Analyze Product (with auth token)
curl -X POST https://api.naaisystems.com/api/products/analyze \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "title=Bamboo Water Bottle" \
  -F "description=Eco-friendly 500ml bamboo bottle with stainless steel interior"
```

---

## 🔒 Security Features

- **JWT Authentication** — Stateless token-based auth with 7-day expiry
- **Password Hashing** — bcryptjs with salt rounds of 12
- **Rate Limiting** — 100 req/15min global, 10 req/min on AI endpoints
- **Helmet.js** — Sets 15+ security HTTP headers
- **CORS** — Configured for specific origins only
- **Input Validation** — express-validator on all endpoints
- **MongoDB Injection Prevention** — Mongoose schema validation
- **Error Sanitization** — Production errors don't expose stack traces
- **Cloudflare WAF** — DDoS protection and bot filtering

---

## 📊 Architecture Overview

```
                    ┌─────────────────┐
                    │   Cloudflare    │
                    │  CDN + WAF + SSL│
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
    ┌─────────▼──────────┐      ┌──────────▼──────────┐
    │   AWS CloudFront   │      │     AWS EC2          │
    │   + S3 Bucket      │      │   Node.js + PM2      │
    │   React Frontend   │      │   Express API        │
    └────────────────────┘      └──────────┬──────────┘
                                           │
                              ┌────────────┴────────────┐
                              │                         │
                   ┌──────────▼──────┐      ┌──────────▼──────┐
                   │  MongoDB Atlas  │      │   Cloudinary     │
                   │  (Database)     │      │  (Image Storage) │
                   └─────────────────┘      └─────────────────┘
                                                      │
                                           ┌──────────▼──────┐
                                           │   OpenAI API    │
                                           │   GPT-4o-mini   │
                                           └─────────────────┘
```

---

## 🧪 Demo Credentials

After seeding or manual setup:
- **Admin:** admin@naaisystems.com / admin123
- **User:** user@naaisystems.com / user123

---

## 📸 Screenshots

| Page | Description |
|------|-------------|
| Landing Page | Hero, Features, Metrics, Testimonials, FAQ, Contact |
| Dashboard | Analytics overview with charts and quick actions |
| Product Analyzer | AI categorization form + results with eco scores |
| Proposal Generator | B2B proposal form + expandable proposal cards with charts |
| Impact Reports | ESG metrics with radar and bar charts |
| AI Chat Support | Real-time chat interface with FAQ suggestions |
| Admin Panel | User management, AI logs, contact submissions |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

**Built with ❤️ by NA AI Systems Team**

*Transforming Sustainable Commerce with AI*
