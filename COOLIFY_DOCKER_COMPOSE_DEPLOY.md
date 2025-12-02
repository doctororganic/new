# Coolify Docker Compose Deployment Guide

## 🚀 Quick Deploy - Copy & Paste Ready

### Option 1: Backend Only (Recommended for Coolify)

Use this if you have external database/Redis or want to deploy backend separately.

**File:** `docker-compose.coolify.yml`

```yaml
version: '3.8'

services:
  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: trae-backend
    restart: unless-stopped
    environment:
      PORT: ${PORT:-8080}
      ENVIRONMENT: ${ENVIRONMENT:-production}
      DATABASE_URL: ${DATABASE_URL}
      REDIS_URL: ${REDIS_URL}
      JWT_SECRET: ${JWT_SECRET}
      BCRYPT_COST: ${BCRYPT_COST:-12}
    ports:
      - "${PORT:-8080}:8080"
    volumes:
      - backend_uploads:/root/uploads
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

volumes:
  backend_uploads:
```

---

### Option 2: Full Stack (Backend + Database + Redis)

Use this if you want everything in one deployment.

**File:** `docker-compose.fullstack.yml`

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: trae-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${POSTGRES_DB:-trae_nutrition}
      POSTGRES_USER: ${POSTGRES_USER:-trae_user}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "${POSTGRES_PORT:-5432}:5432"
    networks:
      - trae-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-trae_user}"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: trae-redis
    restart: unless-stopped
    command: redis-server --appendonly yes ${REDIS_PASSWORD:+--requirepass $REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    ports:
      - "${REDIS_PORT:-6379}:6379"
    networks:
      - trae-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: trae-backend
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    environment:
      PORT: ${PORT:-8080}
      ENVIRONMENT: ${ENVIRONMENT:-production}
      DATABASE_URL: ${DATABASE_URL:-postgres://${POSTGRES_USER:-trae_user}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB:-trae_nutrition}?sslmode=disable}
      REDIS_URL: ${REDIS_URL:-redis://redis:6379/0}
      JWT_SECRET: ${JWT_SECRET}
      BCRYPT_COST: ${BCRYPT_COST:-12}
    ports:
      - "${PORT:-8080}:8080"
    volumes:
      - backend_uploads:/root/uploads
    networks:
      - trae-network
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

networks:
  trae-network:
    driver: bridge

volumes:
  postgres_data:
  redis_data:
  backend_uploads:
```

---

## 📋 Coolify Configuration Steps

### Step 1: Choose Deployment Type

In Coolify dashboard:
1. Click **"New Resource"**
2. Select **"Docker Compose"** (not "Docker")

### Step 2: Basic Settings

```
Application Name: trae-nutrition
Repository: https://github.com/doctororganic/new.git
Branch: main
```

### Step 3: Docker Compose Configuration

**For Backend Only:**
```
Docker Compose File: docker-compose.coolify.yml
```

**For Full Stack:**
```
Docker Compose File: docker-compose.fullstack.yml
```

### Step 4: Environment Variables

Add these environment variables in Coolify:

#### Required (Backend Only):
```
PORT=8080
ENVIRONMENT=production
DATABASE_URL=postgres://user:password@host:5432/trae_nutrition?sslmode=disable
REDIS_URL=redis://host:6379/0
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
```

#### Required (Full Stack):
```
PORT=8080
ENVIRONMENT=production
POSTGRES_DB=trae_nutrition
POSTGRES_USER=trae_user
POSTGRES_PASSWORD=your-secure-password-here
POSTGRES_PORT=5432
REDIS_PORT=6379
DATABASE_URL=postgres://trae_user:your-secure-password-here@postgres:5432/trae_nutrition?sslmode=disable
REDIS_URL=redis://redis:6379/0
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
```

#### Optional:
```
BCRYPT_COST=12
REDIS_PASSWORD=your-redis-password-if-needed
```

### Step 5: Port Configuration

**For Backend Only:**
- Port: `8080`
- Health Check: `/health`

**For Full Stack:**
- Backend Port: `8080`
- PostgreSQL Port: `5432` (internal)
- Redis Port: `6379` (internal)

### Step 6: Deploy

1. Click **"Save"** or **"Deploy"**
2. Watch the build logs
3. Wait for all services to start

---

## 🔧 Configuration Options Explained

### Backend Only (`docker-compose.coolify.yml`)

**Use when:**
- ✅ You have external PostgreSQL/Redis
- ✅ You want simpler deployment
- ✅ You're deploying backend separately

**Pros:**
- Simpler configuration
- Faster deployment
- Less resources needed

**Cons:**
- Requires external database/Redis setup

---

### Full Stack (`docker-compose.fullstack.yml`)

**Use when:**
- ✅ You want everything in one deployment
- ✅ You don't have external database/Redis
- ✅ You want self-contained setup

**Pros:**
- Everything included
- No external dependencies
- Easy to test locally

**Cons:**
- More complex
- Uses more resources
- All services restart together

---

## 🔐 Security Notes

1. **JWT_SECRET**: Use a strong random string (minimum 32 characters)
   ```bash
   openssl rand -base64 32
   ```

2. **POSTGRES_PASSWORD**: Use a strong password
   ```bash
   openssl rand -base64 24
   ```

3. **Environment Variables**: Never commit secrets to git!

---

## 🚨 Troubleshooting

### Issue: Services won't start

**Check:**
- All environment variables are set
- Ports aren't conflicting
- Database/Redis URLs are correct

### Issue: Backend can't connect to database

**Fix:**
- Verify `DATABASE_URL` format
- Check database is accessible
- Ensure network connectivity

### Issue: Build fails

**Fix:**
- Ensure `go.sum` exists in `backend/` directory
- Check Dockerfile paths are correct
- Verify repository structure

---

## 📊 Service Health Checks

All services include health checks:

- **Backend**: `http://localhost:8080/health`
- **PostgreSQL**: `pg_isready` command
- **Redis**: `redis-cli ping`

Coolify will automatically restart unhealthy services.

---

## 🎯 Recommended Setup

**For Production:**
- Use **Backend Only** (`docker-compose.coolify.yml`)
- Use managed PostgreSQL/Redis (Coolify's built-in or external)
- Set strong passwords and secrets
- Enable SSL/TLS

**For Development:**
- Use **Full Stack** (`docker-compose.fullstack.yml`)
- Easy local testing
- Everything in one place

---

## ✅ Quick Checklist

Before deploying:

- [ ] Choose deployment type (Backend Only or Full Stack)
- [ ] Copy the appropriate docker-compose file
- [ ] Set all required environment variables
- [ ] Generate strong secrets (JWT_SECRET, POSTGRES_PASSWORD)
- [ ] Verify repository access
- [ ] Check port availability
- [ ] Review health check endpoints

---

## 🚀 Deploy Now!

1. Copy `docker-compose.coolify.yml` or `docker-compose.fullstack.yml`
2. In Coolify: New Resource → Docker Compose
3. Paste the compose file content
4. Set environment variables
5. Deploy!

**That's it!** Your application will be deployed automatically.
