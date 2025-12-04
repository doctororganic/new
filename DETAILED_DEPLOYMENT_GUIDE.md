# Detailed Deployment Guide - Trae Nutrition Platform

**Complete Step-by-Step Instructions for 100% Working Deployment**

---

## Table of Contents

1. [Prerequisites & System Requirements](#1-prerequisites--system-requirements)
2. [Initial Setup & Repository Clone](#2-initial-setup--repository-clone)
3. [System Dependencies Installation](#3-system-dependencies-installation)
4. [Environment Configuration](#4-environment-configuration)
5. [Database Setup](#5-database-setup)
6. [Backend Setup & Build](#6-backend-setup--build)
7. [Frontend Setup & Build](#7-frontend-setup--build)
8. [Docker Setup (Optional but Recommended)](#8-docker-setup-optional-but-recommended)
9. [Deployment Methods](#9-deployment-methods)
10. [Verification & Testing](#10-verification--testing)
11. [Production Deployment](#11-production-deployment)
12. [Troubleshooting](#12-troubleshooting)
13. [Maintenance & Updates](#13-maintenance--updates)

---

## 1. Prerequisites & System Requirements

### 1.1 Operating System
- **Linux:** Ubuntu 20.04+ / Debian 11+ / CentOS 8+ / RHEL 8+
- **macOS:** macOS 11+ (Big Sur or later)
- **Windows:** Windows 10/11 with WSL2 (recommended) or native

### 1.2 Required Software Versions

| Software | Minimum Version | Recommended Version | How to Check |
|----------|----------------|---------------------|--------------|
| Node.js | 18.0.0 | 20.x LTS | `node -v` |
| npm | 9.0.0 | 10.x | `npm -v` |
| Go | 1.21.0 | 1.24.x | `go version` |
| PostgreSQL | 14.0 | 15.x | `psql --version` |
| Redis | 6.0 | 7.x | `redis-cli --version` |
| Docker | 20.10+ | Latest stable | `docker --version` |
| Docker Compose | 2.0+ | Latest stable | `docker-compose --version` |

### 1.3 System Resources

**Minimum Requirements:**
- CPU: 2 cores
- RAM: 4GB
- Disk: 20GB free space
- Network: Internet connection for dependencies

**Recommended for Production:**
- CPU: 4+ cores
- RAM: 8GB+
- Disk: 50GB+ SSD
- Network: Stable internet connection

### 1.4 Required Ports

Ensure these ports are available:
- **8080** - Backend API
- **3000** - Frontend
- **5432** - PostgreSQL
- **6379** - Redis
- **80** - HTTP (Nginx)
- **443** - HTTPS (Nginx)

**Check port availability:**
```bash
# Linux/macOS
sudo lsof -i :8080
sudo lsof -i :3000
sudo lsof -i :5432
sudo lsof -i :6379

# Or using netstat
netstat -tuln | grep -E ':(8080|3000|5432|6379)'
```

---

## 2. Initial Setup & Repository Clone

### 2.1 Clone Repository

```bash
# Create project directory
mkdir -p ~/projects
cd ~/projects

# Clone repository
git clone <your-repository-url> trae-nutrition-platform
cd trae-nutrition-platform

# Verify repository structure
ls -la
```

**Expected structure:**
```
trae-nutrition-platform/
├── backend/
├── frontend/
├── nginx/
├── scripts/
├── .env.example
├── docker-compose.yml
├── deploy.sh
└── verify-deployment.sh
```

### 2.2 Verify Repository Contents

```bash
# Check critical files exist
./verify-deployment.sh

# Expected output: All critical files should be present
```

---

## 3. System Dependencies Installation

### 3.1 Install Node.js and npm

**Option A: Using Node Version Manager (nvm) - Recommended**

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell
source ~/.bashrc  # or ~/.zshrc

# Install Node.js LTS
nvm install --lts
nvm use --lts
nvm alias default node

# Verify installation
node -v  # Should show v20.x.x or v18.x.x
npm -v   # Should show 9.x.x or 10.x.x
```

**Option B: Direct Installation (Ubuntu/Debian)**

```bash
# Update package list
sudo apt update

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node -v
npm -v
```

**Option C: macOS (using Homebrew)**

```bash
# Install Homebrew if not installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Verify installation
node -v
npm -v
```

### 3.2 Install Go

**Option A: Official Installer**

```bash
# Download Go (replace version with latest)
wget https://go.dev/dl/go1.24.0.linux-amd64.tar.gz

# Remove old installation (if exists)
sudo rm -rf /usr/local/go

# Extract and install
sudo tar -C /usr/local -xzf go1.24.0.linux-amd64.tar.gz

# Add to PATH (add to ~/.bashrc or ~/.zshrc)
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
source ~/.bashrc

# Verify installation
go version  # Should show go1.24.0 or later
```

**Option B: Using Package Manager (Ubuntu/Debian)**

```bash
# Add Go repository
sudo add-apt-repository ppa:longsleep/golang-backports
sudo apt update

# Install Go
sudo apt install golang-go

# Verify installation
go version
```

**Option C: macOS (using Homebrew)**

```bash
brew install go

# Verify installation
go version
```

### 3.3 Install PostgreSQL

**Ubuntu/Debian:**

```bash
# Update package list
sudo apt update

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify installation
sudo -u postgres psql --version

# Set password for postgres user
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'your-secure-password';"
```

**macOS:**

```bash
# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Verify installation
psql --version
```

**Create Database:**

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE trae_nutrition;
CREATE USER trae_user WITH PASSWORD 'trae_password';
ALTER DATABASE trae_nutrition OWNER TO trae_user;
GRANT ALL PRIVILEGES ON DATABASE trae_nutrition TO trae_user;

# Exit psql
\q
```

### 3.4 Install Redis

**Ubuntu/Debian:**

```bash
# Install Redis
sudo apt install -y redis-server

# Start Redis service
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Verify installation
redis-cli ping  # Should return PONG
```

**macOS:**

```bash
# Install Redis
brew install redis

# Start Redis service
brew services start redis

# Verify installation
redis-cli ping  # Should return PONG
```

### 3.5 Install Docker & Docker Compose (Optional but Recommended)

**Ubuntu/Debian:**

```bash
# Remove old versions
sudo apt remove docker docker-engine docker.io containerd runc

# Install prerequisites
sudo apt update
sudo apt install -y ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Add user to docker group (to run without sudo)
sudo usermod -aG docker $USER

# Log out and back in, or run:
newgrp docker

# Verify installation
docker --version
docker compose version
```

**macOS:**

```bash
# Install Docker Desktop (includes Docker Compose)
# Download from: https://www.docker.com/products/docker-desktop
# Or using Homebrew:
brew install --cask docker

# Start Docker Desktop application
# Verify installation
docker --version
docker compose version
```

---

## 4. Environment Configuration

### 4.1 Create Environment Files

```bash
# Navigate to project root
cd ~/projects/trae-nutrition-platform

# Copy environment templates
cp .env.example .env
cp backend/.env.example backend/.env

# Verify files created
ls -la .env backend/.env
```

### 4.2 Configure Root .env File

Edit `.env` file:

```bash
nano .env
# or
vim .env
# or use your preferred editor
```

**Required Configuration:**

```bash
# SERVER CONFIGURATION
PORT=8080
ENVIRONMENT=development  # Change to 'production' for production
NODE_ENV=development    # Change to 'production' for production

# DATABASE CONFIGURATION
# Update with your actual database credentials
DATABASE_URL=postgres://trae_user:trae_password@localhost:5432/trae_nutrition?sslmode=disable
DATABASE_MAX_OPEN_CONNS=25
DATABASE_MAX_IDLE_CONNS=25
DATABASE_CONN_MAX_LIFETIME=5m

# REDIS CONFIGURATION
REDIS_URL=redis://localhost:6379/0
REDIS_PASSWORD=        # Leave empty if no password
REDIS_DB=0
REDIS_POOL_SIZE=10

# JWT & SECURITY CONFIGURATION
# IMPORTANT: Generate a strong random secret (minimum 32 characters)
# You can generate one with: openssl rand -base64 32
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-minimum-32-characters
JWT_EXPIRATION=24h
JWT_REFRESH_EXPIRATION=168h
BCRYPT_COST=12

# RATE LIMITING
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_DURATION=1m
RATE_LIMIT_BURST=20

# FRONTEND CONFIGURATION
NEXT_PUBLIC_API_URL=http://localhost:8080
API_URL=http://localhost:8080
NEXT_PUBLIC_APP_NAME=Trae Nutrition
NEXT_PUBLIC_APP_VERSION=1.0.0

# LOGGING
LOG_LEVEL=info
LOG_FORMAT=json
ENABLE_METRICS=true
METRICS_PORT=9090
```

**Generate Secure JWT Secret:**

```bash
# Generate a secure random secret
openssl rand -base64 32

# Copy the output and use it as JWT_SECRET in .env
```

### 4.3 Configure Backend .env File

Edit `backend/.env` file:

```bash
nano backend/.env
```

**Required Configuration:**

```bash
# Server Configuration
PORT=8080
ENVIRONMENT=development

# Database Configuration
DATABASE_URL=postgres://trae_user:trae_password@localhost:5432/trae_nutrition?sslmode=disable
DATABASE_MAX_OPEN_CONNS=25
DATABASE_MAX_IDLE_CONNS=25
DATABASE_CONN_MAX_LIFETIME=5m

# Redis Configuration
REDIS_URL=redis://localhost:6379/0
REDIS_PASSWORD=
REDIS_DB=0

# JWT Configuration
# Use the same JWT_SECRET as in root .env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=24h
JWT_REFRESH_EXPIRATION=168h

# Security Configuration
BCRYPT_COST=12
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_DURATION=1m

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
ALLOWED_FILE_TYPES=jpg,jpeg,png,gif,pdf

# Monitoring Configuration
LOG_LEVEL=info
LOG_FORMAT=json
ENABLE_METRICS=true
METRICS_PORT=9090
```

### 4.4 Verify Environment Configuration

```bash
# Check environment files exist
test -f .env && echo "✓ Root .env exists" || echo "✗ Root .env missing"
test -f backend/.env && echo "✓ Backend .env exists" || echo "✗ Backend .env missing"

# Check critical variables are set
grep -q "DATABASE_URL" .env && echo "✓ DATABASE_URL configured" || echo "✗ DATABASE_URL missing"
grep -q "JWT_SECRET" .env && echo "✓ JWT_SECRET configured" || echo "✗ JWT_SECRET missing"
```

---

## 5. Database Setup

### 5.1 Initialize Database Schema

**Option A: Using Docker Compose (if using Docker)**

```bash
# Start only PostgreSQL service
docker-compose up -d postgres

# Wait for PostgreSQL to be ready (about 10 seconds)
sleep 10

# The init.sql script will run automatically on first start
# Verify database was created
docker-compose exec postgres psql -U trae_user -d trae_nutrition -c "\dt"
```

**Option B: Manual Database Initialization**

```bash
# Connect to PostgreSQL
psql -U trae_user -d trae_nutrition -h localhost

# Or if using postgres user
sudo -u postgres psql -d trae_nutrition

# Run initialization script
\i backend/data/init.sql

# Verify tables were created
\dt

# Check specific tables
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

# Exit psql
\q
```

**Option C: Using psql command line**

```bash
# Run SQL script directly
psql -U trae_user -d trae_nutrition -f backend/data/init.sql

# Verify
psql -U trae_user -d trae_nutrition -c "\dt"
```

### 5.2 Verify Database Connection

```bash
# Test connection
psql -U trae_user -d trae_nutrition -h localhost -c "SELECT version();"

# Check tables
psql -U trae_user -d trae_nutrition -h localhost -c "\dt"

# Expected output should show:
# - users
# - meals
# - meal_plans
# - workouts
# - workout_plans
# - weight_progress
# - body_measurements
```

---

## 6. Backend Setup & Build

### 6.1 Navigate to Backend Directory

```bash
cd ~/projects/trae-nutrition-platform/backend
```

### 6.2 Download Go Dependencies

```bash
# Download all dependencies
go mod download

# Verify dependencies
go mod verify

# Tidy dependencies (remove unused, add missing)
go mod tidy

# Check go.sum exists
ls -la go.sum
```

**Expected output:**
- No errors
- `go.sum` file should exist

### 6.3 Build Backend

```bash
# Create bin directory
mkdir -p bin

# Build backend executable
go build -o bin/server cmd/server/main.go

# Make executable
chmod +x bin/server

# Verify build
ls -lh bin/server

# Test run (will start server, press Ctrl+C to stop)
./bin/server
```

**Expected output:**
- Binary file created: `bin/server`
- Server starts without errors
- Health endpoint accessible: `http://localhost:8080/health`

### 6.4 Test Backend Health Endpoint

```bash
# In another terminal, test health endpoint
curl http://localhost:8080/health

# Expected response:
# {"status":"healthy","service":"trae-nutrition-backend","timestamp":"..."}
```

---

## 7. Frontend Setup & Build

### 7.1 Navigate to Frontend Directory

```bash
cd ~/projects/trae-nutrition-platform/frontend
```

### 7.2 Install Frontend Dependencies

```bash
# Install all npm packages
npm install

# Verify installation
ls -la node_modules | head -20

# Check package-lock.json exists
ls -la package-lock.json
```

**Expected output:**
- No errors
- `node_modules` directory created
- `package-lock.json` file exists

**If npm install fails:**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Try again
npm install
```

### 7.3 Build Frontend

```bash
# Build Next.js application
npm run build

# Expected output:
# - .next directory created
# - Build completes successfully
# - No errors
```

**Expected build output:**
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

### 7.4 Test Frontend Build

```bash
# Start production server
npm run start

# In another terminal, test frontend
curl http://localhost:3000

# Expected: HTML response
```

---

## 8. Docker Setup (Optional but Recommended)

### 8.1 Verify Docker Installation

```bash
# Check Docker is running
docker ps

# Check Docker Compose
docker compose version
```

### 8.2 Build Docker Images

```bash
# Navigate to project root
cd ~/projects/trae-nutrition-platform

# Build all images
docker compose build

# Or build specific services
docker compose build backend
docker compose build frontend

# Verify images created
docker images | grep trae
```

**Expected output:**
- Images built successfully
- No build errors

### 8.3 Test Docker Compose Configuration

```bash
# Validate docker-compose.yml
docker compose config

# Expected: Valid YAML output with no errors
```

---

## 9. Deployment Methods

### 9.1 Method 1: Docker Compose Deployment (Recommended)

**Step 1: Start All Services**

```bash
cd ~/projects/trae-nutrition-platform

# Start all services in detached mode
docker compose up -d

# Or with build
docker compose up -d --build
```

**Step 2: Check Service Status**

```bash
# Check all containers are running
docker compose ps

# Expected output: All services should show "Up"
# - trae-postgres
# - trae-redis
# - trae-backend
# - trae-frontend
# - trae-nginx
```

**Step 3: View Logs**

```bash
# View all logs
docker compose logs -f

# View specific service logs
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres
```

**Step 4: Stop Services**

```bash
# Stop all services
docker compose down

# Stop and remove volumes (WARNING: deletes data)
docker compose down -v
```

### 9.2 Method 2: Manual Deployment

**Step 1: Start PostgreSQL and Redis**

```bash
# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Start Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Verify they're running
sudo systemctl status postgresql
sudo systemctl status redis-server
```

**Step 2: Start Backend**

```bash
cd ~/projects/trae-nutrition-platform/backend

# Start backend in background
nohup ./bin/server > backend.log 2>&1 &

# Save PID
echo $! > backend.pid

# Check if running
ps aux | grep server

# Check logs
tail -f backend.log
```

**Step 3: Start Frontend**

```bash
cd ~/projects/trae-nutrition-platform/frontend

# Start frontend in background
nohup npm run start > frontend.log 2>&1 &

# Save PID
echo $! > frontend.pid

# Check if running
ps aux | grep node

# Check logs
tail -f frontend.log
```

**Step 4: Stop Services**

```bash
# Stop backend
if [ -f backend/backend.pid ]; then
    kill $(cat backend/backend.pid)
    rm backend/backend.pid
fi

# Stop frontend
if [ -f frontend/frontend.pid ]; then
    kill $(cat frontend/frontend.pid)
    rm frontend/frontend.pid
fi
```

### 9.3 Method 3: Using Deployment Script

**Step 1: Make Script Executable**

```bash
cd ~/projects/trae-nutrition-platform
chmod +x deploy.sh
chmod +x verify-deployment.sh
```

**Step 2: Run Full Deployment**

```bash
# Full deployment (setup + start + health check)
./deploy.sh deploy
```

**Step 3: Individual Commands**

```bash
# Setup only (build backend and frontend)
./deploy.sh setup

# Start services
./deploy.sh start

# Stop services
./deploy.sh stop

# Restart services
./deploy.sh restart

# Health check
./deploy.sh health

# View logs
./deploy.sh logs
```

---

## 10. Verification & Testing

### 10.1 Run Verification Script

```bash
cd ~/projects/trae-nutrition-platform
./verify-deployment.sh
```

**Expected output:**
- ✅ 30+ checks passed
- ⚠️ 0-5 warnings (acceptable)
- ❌ 0 failures

### 10.2 Test Backend Endpoints

```bash
# Health check
curl http://localhost:8080/health

# Expected response:
# {"status":"healthy","service":"trae-nutrition-backend","timestamp":"..."}

# API status
curl http://localhost:8080/api/status

# Expected response:
# {"status":"online","version":"1.0.0","endpoints":[...]}

# Test API endpoint (returns mock data)
curl http://localhost:8080/api/v1/meals
```

### 10.3 Test Frontend

```bash
# Test frontend homepage
curl http://localhost:3000

# Expected: HTML response with "Trae Nutrition Platform"

# Open in browser
# Linux:
xdg-open http://localhost:3000
# macOS:
open http://localhost:3000
# Windows:
start http://localhost:3000
```

### 10.4 Test Database Connection

```bash
# Test PostgreSQL connection
psql -U trae_user -d trae_nutrition -h localhost -c "SELECT COUNT(*) FROM users;"

# Test Redis connection
redis-cli ping
# Expected: PONG
```

### 10.5 Test Nginx (if running)

```bash
# Test via Nginx
curl http://localhost

# Test backend via Nginx
curl http://localhost/api/status

# Test frontend via Nginx
curl http://localhost
```

### 10.6 Comprehensive Health Check

```bash
# Create test script
cat > test-deployment.sh << 'EOF'
#!/bin/bash
echo "Testing Backend..."
curl -s http://localhost:8080/health | jq . || echo "Backend not responding"

echo "Testing Frontend..."
curl -s http://localhost:3000 | head -5 || echo "Frontend not responding"

echo "Testing Database..."
psql -U trae_user -d trae_nutrition -h localhost -c "SELECT 1;" || echo "Database not accessible"

echo "Testing Redis..."
redis-cli ping || echo "Redis not accessible"
EOF

chmod +x test-deployment.sh
./test-deployment.sh
```

---

## 11. Production Deployment

### 11.1 Production Server Setup

**Step 1: Prepare Server**

```bash
# On production server, run setup script
cd ~/projects/trae-nutrition-platform
bash scripts/setup-server.sh
```

**Step 2: Update Environment Variables**

```bash
# Edit .env for production
nano .env

# Change these values:
ENVIRONMENT=production
NODE_ENV=production
DEBUG=false
HOT_RELOAD=false

# Update database URL for production
DATABASE_URL=postgres://trae_user:STRONG_PASSWORD@localhost:5432/trae_nutrition?sslmode=disable

# Update frontend API URL
NEXT_PUBLIC_API_URL=https://yourdomain.com
API_URL=http://localhost:8080
```

**Step 3: Generate Production JWT Secret**

```bash
# Generate strong secret
openssl rand -base64 64

# Update JWT_SECRET in .env with this value
```

### 11.2 SSL Certificate Setup

**Option A: Using Let's Encrypt (Free)**

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal test
sudo certbot renew --dry-run
```

**Option B: Using Existing Certificates**

```bash
# Create SSL directory
mkdir -p nginx/ssl

# Copy certificates
cp your-cert.pem nginx/ssl/cert.pem
cp your-key.pem nginx/ssl/key.pem

# Update nginx.conf to use SSL
```

### 11.3 Configure Nginx for Production

Edit `nginx/nginx.conf`:

```nginx
# Update server_name
server_name yourdomain.com www.yourdomain.com;

# Enable SSL
listen 443 ssl;
ssl_certificate /etc/nginx/ssl/cert.pem;
ssl_certificate_key /etc/nginx/ssl/key.pem;

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

### 11.4 Set Up Systemd Services (for manual deployment)

**Backend Service:**

```bash
sudo nano /etc/systemd/system/trae-backend.service
```

```ini
[Unit]
Description=Trae Nutrition Backend
After=network.target postgresql.service redis.service

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/opt/trae-nutrition/backend
ExecStart=/opt/trae-nutrition/backend/bin/server
Restart=always
RestartSec=10
EnvironmentFile=/opt/trae-nutrition/.env

[Install]
WantedBy=multi-user.target
```

**Frontend Service:**

```bash
sudo nano /etc/systemd/system/trae-frontend.service
```

```ini
[Unit]
Description=Trae Nutrition Frontend
After=network.target trae-backend.service

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/opt/trae-nutrition/frontend
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=10
EnvironmentFile=/opt/trae-nutrition/.env

[Install]
WantedBy=multi-user.target
```

**Enable and Start Services:**

```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable services
sudo systemctl enable trae-backend
sudo systemctl enable trae-frontend

# Start services
sudo systemctl start trae-backend
sudo systemctl start trae-frontend

# Check status
sudo systemctl status trae-backend
sudo systemctl status trae-frontend
```

### 11.5 Firewall Configuration

```bash
# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow SSH (if not already allowed)
sudo ufw allow 22/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

### 11.6 Set Up Monitoring

**Option A: Basic Log Monitoring**

```bash
# View backend logs
sudo journalctl -u trae-backend -f

# View frontend logs
sudo journalctl -u trae-frontend -f

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

**Option B: Set Up Log Rotation**

```bash
sudo nano /etc/logrotate.d/trae-nutrition
```

```
/opt/trae-nutrition/backend/backend.log
/opt/trae-nutrition/frontend/frontend.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 0640 ubuntu ubuntu
}
```

---

## 12. Troubleshooting

### 12.1 Backend Won't Start

**Problem: Port 8080 already in use**

```bash
# Find process using port
sudo lsof -i :8080
# or
sudo netstat -tulpn | grep :8080

# Kill process
sudo kill -9 <PID>

# Or change port in .env
PORT=8081
```

**Problem: Database connection failed**

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql -U trae_user -d trae_nutrition -h localhost

# Check DATABASE_URL in .env
grep DATABASE_URL backend/.env

# Verify database exists
psql -U postgres -c "\l" | grep trae_nutrition
```

**Problem: Go build fails**

```bash
# Clean and rebuild
cd backend
go clean -cache
go mod tidy
go mod download
go build -o bin/server cmd/server/main.go
```

### 12.2 Frontend Won't Start

**Problem: Port 3000 already in use**

```bash
# Find process
sudo lsof -i :3000

# Kill process
sudo kill -9 <PID>

# Or change port in package.json scripts
```

**Problem: npm install fails**

```bash
# Clear cache
npm cache clean --force

# Remove node_modules
rm -rf node_modules package-lock.json

# Try again
npm install

# If still failing, try with legacy peer deps
npm install --legacy-peer-deps
```

**Problem: Build fails**

```bash
# Check Node.js version
node -v  # Should be 18+

# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build
```

### 12.3 Docker Issues

**Problem: Docker containers won't start**

```bash
# Check Docker is running
sudo systemctl status docker

# View container logs
docker compose logs

# Check docker-compose.yml syntax
docker compose config

# Rebuild containers
docker compose down
docker compose build --no-cache
docker compose up -d
```

**Problem: Database not initializing**

```bash
# Check PostgreSQL logs
docker compose logs postgres

# Manually run init script
docker compose exec postgres psql -U trae_user -d trae_nutrition -f /docker-entrypoint-initdb.d/init.sql

# Or copy script and run manually
docker cp backend/data/init.sql trae-postgres:/tmp/init.sql
docker compose exec postgres psql -U trae_user -d trae_nutrition -f /tmp/init.sql
```

### 12.4 Database Issues

**Problem: Can't connect to database**

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check PostgreSQL is listening
sudo netstat -tulpn | grep 5432

# Test connection
psql -U trae_user -d trae_nutrition -h localhost

# Check pg_hba.conf
sudo nano /etc/postgresql/15/main/pg_hba.conf
# Ensure: host    all    all    127.0.0.1/32    md5

# Restart PostgreSQL
sudo systemctl restart postgresql
```

**Problem: Tables don't exist**

```bash
# Re-run init script
psql -U trae_user -d trae_nutrition -f backend/data/init.sql

# Verify tables
psql -U trae_user -d trae_nutrition -c "\dt"
```

### 12.5 Redis Issues

**Problem: Redis connection failed**

```bash
# Check Redis is running
sudo systemctl status redis-server

# Test connection
redis-cli ping

# Check Redis is listening
sudo netstat -tulpn | grep 6379

# Restart Redis
sudo systemctl restart redis-server
```

### 12.6 Nginx Issues

**Problem: Nginx won't start**

```bash
# Check configuration syntax
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

**Problem: 502 Bad Gateway**

```bash
# Check backend is running
curl http://localhost:8080/health

# Check Nginx can reach backend
curl http://backend:8080/health  # From within Docker network

# Check Nginx upstream configuration
grep -A 5 "upstream" nginx/nginx.conf
```

### 12.7 Common Error Messages

**"module not found" (Go)**
```bash
cd backend
go mod download
go mod tidy
```

**"Cannot find module" (Node.js)**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**"Permission denied"**
```bash
# Make scripts executable
chmod +x deploy.sh verify-deployment.sh

# Check file permissions
ls -la bin/server
chmod +x bin/server
```

**"Connection refused"**
```bash
# Check service is running
sudo systemctl status <service-name>

# Check firewall
sudo ufw status

# Check port is listening
sudo netstat -tulpn | grep <port>
```

---

## 13. Maintenance & Updates

### 13.1 Regular Maintenance Tasks

**Daily:**
- Check service status
- Review error logs
- Monitor disk space

**Weekly:**
- Review access logs
- Check for security updates
- Backup database

**Monthly:**
- Update dependencies
- Review and rotate logs
- Performance review

### 13.2 Database Backups

```bash
# Create backup script
cat > backup-database.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/backups/trae-nutrition"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Backup database
pg_dump -U trae_user -d trae_nutrition > $BACKUP_DIR/backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/backup_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete

echo "Backup completed: backup_$DATE.sql.gz"
EOF

chmod +x backup-database.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add: 0 2 * * * /opt/trae-nutrition/backup-database.sh
```

### 13.3 Updating Dependencies

**Backend:**

```bash
cd backend

# Update all dependencies
go get -u ./...

# Update specific package
go get -u github.com/labstack/echo/v4

# Tidy
go mod tidy

# Rebuild
go build -o bin/server cmd/server/main.go
```

**Frontend:**

```bash
cd frontend

# Check for updates
npm outdated

# Update all packages
npm update

# Update specific package
npm install package-name@latest

# Rebuild
npm run build
```

### 13.4 Application Updates

```bash
# Pull latest code
git pull origin main

# Rebuild backend
cd backend
go mod download
go build -o bin/server cmd/server/main.go
cd ..

# Rebuild frontend
cd frontend
npm install
npm run build
cd ..

# Restart services
./deploy.sh restart

# Or with Docker
docker compose down
docker compose up -d --build
```

### 13.5 Monitoring Health

```bash
# Create health check script
cat > health-check.sh << 'EOF'
#!/bin/bash
BACKEND=$(curl -s http://localhost:8080/health | jq -r '.status')
FRONTEND=$(curl -s http://localhost:3000 | head -1 | grep -q "html" && echo "ok" || echo "fail")
DB=$(psql -U trae_user -d trae_nutrition -h localhost -c "SELECT 1;" > /dev/null 2>&1 && echo "ok" || echo "fail")
REDIS=$(redis-cli ping | grep -q "PONG" && echo "ok" || echo "fail")

echo "Backend: $BACKEND"
echo "Frontend: $FRONTEND"
echo "Database: $DB"
echo "Redis: $REDIS"
EOF

chmod +x health-check.sh

# Run health check
./health-check.sh
```

---

## Quick Reference Commands

### Essential Commands

```bash
# Verify deployment
./verify-deployment.sh

# Full deployment
./deploy.sh deploy

# Start services
./deploy.sh start

# Stop services
./deploy.sh stop

# Health check
./deploy.sh health

# View logs
./deploy.sh logs
```

### Docker Commands

```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down

# View logs
docker compose logs -f

# Rebuild and restart
docker compose up -d --build

# Check status
docker compose ps
```

### Database Commands

```bash
# Connect to database
psql -U trae_user -d trae_nutrition

# List tables
\dt

# Backup database
pg_dump -U trae_user trae_nutrition > backup.sql

# Restore database
psql -U trae_user -d trae_nutrition < backup.sql
```

### Service Management

```bash
# Check service status
sudo systemctl status trae-backend
sudo systemctl status trae-frontend

# Restart services
sudo systemctl restart trae-backend
sudo systemctl restart trae-frontend

# View logs
sudo journalctl -u trae-backend -f
sudo journalctl -u trae-frontend -f
```

---

## Support & Resources

- **Verification Script:** `./verify-deployment.sh`
- **Deployment Script:** `./deploy.sh`
- **Status Document:** `DEPLOYMENT_STATUS.md`
- **Quick Start:** `QUICK_START.md`
- **Project Overview:** `PROJECT_OVERVIEW.md`

---

## Final Checklist

Before considering deployment complete, verify:

- [ ] All prerequisites installed
- [ ] Environment files configured
- [ ] Database initialized
- [ ] Backend builds successfully
- [ ] Frontend builds successfully
- [ ] All services start without errors
- [ ] Health endpoints respond correctly
- [ ] Database connection works
- [ ] Redis connection works
- [ ] Frontend accessible in browser
- [ ] API endpoints respond
- [ ] Verification script passes
- [ ] Logs show no critical errors

**Deployment Complete! 🎉**
