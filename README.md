# Trae Nutrition Platform - Full Stack

Complete nutrition and health tracking platform with frontend and backend.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Go 1.21+
- PostgreSQL 14+
- Redis 6+

### Installation

```bash
# Clone and setup
git clone https://github.com/doctororganic/new.git
cd "Desktop/trae new healthy1"

# Frontend setup
npm run frontend:install
npm run frontend:dev

# Backend setup  
npm run backend:build
npm run backend:start

# Full stack
npm run dev     # Both frontend + backend
npm run build   # Production build
npm run start   # Production start
```

## 📁 Project Structure

```
├── frontend/                    # Next.js React frontend
├── backend/                     # Go Echo backend API
│   ├── cmd/server/             # Backend entry point
│   ├── data/                   # Database initialization scripts
│   └── Dockerfile              # Backend Docker image
├── nginx/                       # Nginx reverse proxy configuration
├── scripts/                     # Deployment and setup scripts
├── .github/workflows/          # CI/CD pipelines
├── docker-compose.yml          # Docker Compose configuration
├── deploy.sh                   # Main deployment script
├── verify-deployment.sh        # Deployment verification script
└── Documentation:
    ├── DETAILED_DEPLOYMENT_GUIDE.md  # Complete deployment guide
    ├── DEPLOYMENT_CHECKLIST.md       # Deployment checklist
    ├── DEPLOYMENT_STATUS.md          # Current status
    ├── QUICK_START.md                # Quick start guide
    └── PROJECT_OVERVIEW.md           # Architecture overview
```

## 🔧 Environment Setup

Copy `.env.example` to `.env` and configure:
- Database connection
- Redis connection  
- JWT secrets
- API keys

## 🚀 Deployment

**Complete deployment documentation:**

- 📘 **[DETAILED_DEPLOYMENT_GUIDE.md](DETAILED_DEPLOYMENT_GUIDE.md)** - Complete step-by-step deployment guide (1700+ lines)
- ✅ **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Quick reference checklist
- 📊 **[DEPLOYMENT_STATUS.md](DEPLOYMENT_STATUS.md)** - Current deployment status and next steps
- 🚀 **[QUICK_START.md](QUICK_START.md)** - Quick start guide for immediate deployment
- 🔍 **[verify-deployment.sh](verify-deployment.sh)** - Automated verification script

**Quick deployment:**
```bash
# Verify setup
./verify-deployment.sh

# Deploy with Docker Compose (recommended)
docker-compose up -d --build

# Or use deployment script
./deploy.sh deploy
```

## 📋 Features

- ✅ Nutrition tracking
- ✅ Meal planning
- ✅ Workout management
- ✅ Health condition support
- ✅ Progress monitoring
- ✅ User authentication
- ✅ Real-time updates