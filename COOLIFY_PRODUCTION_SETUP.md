# Production Docker Compose Setup for Coolify

## 🚀 Ready-to-Deploy Configuration

### Option 1: Backend Only (Use External DB/Redis)

**File:** `docker-compose.backend-only.yml`

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
      PORT: ${PORT}
      ENV: ${ENV}
      DOMAIN: ${DOMAIN}
      DB_HOST: ${DB_HOST}
      DB_PORT: ${DB_PORT}
      DB_NAME: ${DB_NAME}
      DB_USER: ${DB_USER}
      DB_PASSWORD: ${DB_PASSWORD}
      DB_SSL_MODE: ${DB_SSL_MODE}
      DATABASE_URL: postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:5432/${DB_NAME}?sslmode=${DB_SSL_MODE}
      REDIS_HOST: ${REDIS_HOST}
      REDIS_PORT: ${REDIS_PORT}
      REDIS_PASSWORD: ${REDIS_PASSWORD}
      REDIS_URL: redis://:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}/0
      JWT_SECRET: ${JWT_SECRET}
      API_KEY_SECRET: ${API_KEY_SECRET}
      SESSION_SECRET: ${SESSION_SECRET}
      CORS_ORIGIN: ${CORS_ORIGIN}
      CORS_CREDENTIALS: ${CORS_CREDENTIALS}
    ports:
      - "${PORT}:8080"
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

### Option 2: Full Stack (Backend + PostgreSQL + Redis)

**File:** `docker-compose.production.yml`

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: trae-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "${DB_PORT}:5432"
    networks:
      - trae-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: trae-redis
    restart: unless-stopped
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    ports:
      - "${REDIS_PORT}:6379"
    networks:
      - trae-network
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "${REDIS_PASSWORD}", "ping"]
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
      PORT: ${PORT}
      ENV: ${ENV}
      DOMAIN: ${DOMAIN}
      DB_HOST: ${DB_HOST}
      DB_PORT: ${DB_PORT}
      DB_NAME: ${DB_NAME}
      DB_USER: ${DB_USER}
      DB_PASSWORD: ${DB_PASSWORD}
      DB_SSL_MODE: ${DB_SSL_MODE}
      DATABASE_URL: postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:5432/${DB_NAME}?sslmode=${DB_SSL_MODE}
      REDIS_HOST: ${REDIS_HOST}
      REDIS_PORT: ${REDIS_PORT}
      REDIS_PASSWORD: ${REDIS_PASSWORD}
      REDIS_URL: redis://:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}/0
      JWT_SECRET: ${JWT_SECRET}
      API_KEY_SECRET: ${API_KEY_SECRET}
      SESSION_SECRET: ${SESSION_SECRET}
      CORS_ORIGIN: ${CORS_ORIGIN}
      CORS_CREDENTIALS: ${CORS_CREDENTIALS}
    ports:
      - "${PORT}:8080"
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

## 📋 Environment Variables for Coolify

**Copy and paste these into Coolify Environment Variables section:**

```
PORT=8080
ENV=production
DOMAIN=doctorhealthy1.com
DB_HOST=postgres
DB_PORT=5432
DB_NAME=nutrition_platform
DB_USER=postgres
DB_PASSWORD=1be1723ba0ab757509d20e28b6d6a7ef
DB_SSL_MODE=require
JWT_SECRET=33caea9e4154a7dd56a1c5fb7a92c9abbab0e10bb5ecda2dc54903933c404f97
API_KEY_SECRET=bb13a433948cabb8096c6c50bd3b47c6f9316c7294a8b86f0c65fdd0413544d1
SESSION_SECRET=d329651ebda4923ec819baa046802248
CORS_ORIGIN=https://doctorhealthy1.com,https://www.doctorhealthy1.com
CORS_CREDENTIALS=true
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=8ed9d9310c8d192dd993702d08759eae
```

---

## 🚀 Deployment Steps

### Step 1: Choose Compose File

- **Backend Only**: Use `docker-compose.backend-only.yml` (if you have external DB/Redis)
- **Full Stack**: Use `docker-compose.production.yml` (if you want everything in one deployment)

### Step 2: In Coolify

1. **New Resource** → **Docker Compose**
2. **Docker Compose File**: 
   - `docker-compose.backend-only.yml` OR
   - `docker-compose.production.yml`
3. **Repository**: `https://github.com/doctororganic/new.git`
4. **Branch**: `main`

### Step 3: Set Environment Variables

Copy all the environment variables from above and paste them into Coolify's Environment Variables section.

**Important:** 
- Set each variable **one by one** in Coolify
- Use **exact values** as shown above
- No `${}` templates in the values!

### Step 4: Deploy

Click **Deploy** and wait for the build to complete.

---

## ✅ What's Configured

- ✅ Server port: 8080
- ✅ Production environment
- ✅ Domain: doctorhealthy1.com
- ✅ PostgreSQL database connection
- ✅ Redis cache with password
- ✅ JWT authentication secrets
- ✅ CORS configuration for your domain
- ✅ SSL mode for database
- ✅ Health checks for all services

---

## 🔍 Notes

1. **DATABASE_URL** is automatically built from individual DB variables
2. **REDIS_URL** is automatically built from Redis variables (includes password)
3. **CORS_ORIGIN** allows requests from your domain
4. **DB_SSL_MODE** is set to `require` for secure connections

---

## 🎯 Quick Copy-Paste for Coolify

**Docker Compose File:** `docker-compose.production.yml` (or `docker-compose.backend-only.yml`)

**Environment Variables:**
```
PORT=8080
ENV=production
DOMAIN=doctorhealthy1.com
DB_HOST=postgres
DB_PORT=5432
DB_NAME=nutrition_platform
DB_USER=postgres
DB_PASSWORD=1be1723ba0ab757509d20e28b6d6a7ef
DB_SSL_MODE=require
JWT_SECRET=33caea9e4154a7dd56a1c5fb7a92c9abbab0e10bb5ecda2dc54903933c404f97
API_KEY_SECRET=bb13a433948cabb8096c6c50bd3b47c6f9316c7294a8b86f0c65fdd0413544d1
SESSION_SECRET=d329651ebda4923ec819baa046802248
CORS_ORIGIN=https://doctorhealthy1.com,https://www.doctorhealthy1.com
CORS_CREDENTIALS=true
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=8ed9d9310c8d192dd993702d08759eae
```

**That's it! Deploy and you're done!** 🚀
