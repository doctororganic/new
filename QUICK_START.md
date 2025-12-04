# Quick Start Guide - Trae Nutrition Platform

## Prerequisites

- Node.js 18+ (`node -v`)
- Go 1.21+ (`go version`)
- npm (`npm -v`)
- Docker & Docker Compose (optional, recommended)

## 1. Clone and Setup

```bash
# Clone repository
git clone <repository-url>
cd trae-nutrition-platform

# Copy environment files
cp .env.example .env
cp backend/.env.example backend/.env

# Edit .env files with your configuration
nano .env
nano backend/.env
```

## 2. Install Dependencies

```bash
# Backend dependencies
cd backend
go mod download
cd ..

# Frontend dependencies
cd frontend
npm install
cd ..
```

## 3. Verify Setup

```bash
# Run verification script
./verify-deployment.sh
```

## 4. Deploy

### Option A: Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Option B: Manual Deployment

```bash
# Full deployment
./deploy.sh deploy

# Or step by step:
./deploy.sh setup   # Build everything
./deploy.sh start   # Start services
./deploy.sh health  # Check health
```

## 5. Verify Deployment

```bash
# Check backend
curl http://localhost:8080/health

# Check frontend
curl http://localhost:3000

# Check API status
curl http://localhost:8080/api/status
```

## 6. Access Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080
- **Via Nginx:** http://localhost (if Nginx is running)

## Common Commands

```bash
# Start services
./deploy.sh start

# Stop services
./deploy.sh stop

# Restart services
./deploy.sh restart

# View logs
./deploy.sh logs

# Health check
./deploy.sh health

# Verify deployment
./verify-deployment.sh
```

## Troubleshooting

### Port conflicts
```bash
# Check what's using ports
lsof -i :8080
lsof -i :3000
```

### Rebuild services
```bash
# Docker
docker-compose down
docker-compose up -d --build

# Manual
./deploy.sh stop
./deploy.sh setup
./deploy.sh start
```

### Database issues
```bash
# Check PostgreSQL logs
docker-compose logs postgres

# Access database
docker-compose exec postgres psql -U trae_user -d trae_nutrition
```

## Next Steps

1. Review `DEPLOYMENT_STATUS.md` for detailed status
2. Review `PROJECT_OVERVIEW.md` for architecture details
3. Implement API handlers (currently returning mock data)
4. Build frontend UI components
5. Set up production environment variables
6. Configure SSL certificates for production
