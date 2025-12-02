# Fixed Docker Compose Files for Coolify

## ✅ Fixed Issue

**Problem:** Coolify doesn't support nested variable substitution like `${VAR:-default}`

**Solution:** Removed all default values and nested variables. You must set all environment variables in Coolify.

---

## 🚀 Option 1: Backend Only (FIXED)

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
      PORT: ${PORT}
      ENVIRONMENT: ${ENVIRONMENT}
      DATABASE_URL: ${DATABASE_URL}
      REDIS_URL: ${REDIS_URL}
      JWT_SECRET: ${JWT_SECRET}
      BCRYPT_COST: ${BCRYPT_COST}
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

### Required Environment Variables:
```
PORT=8080
ENVIRONMENT=production
DATABASE_URL=postgres://user:password@host:5432/trae_nutrition?sslmode=disable
REDIS_URL=redis://host:6379/0
JWT_SECRET=your-secret-key-minimum-32-characters
BCRYPT_COST=12
```

---

## 🚀 Option 2: Full Stack (FIXED)

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
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "${POSTGRES_PORT}:5432"
    networks:
      - trae-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: trae-redis
    restart: unless-stopped
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    ports:
      - "${REDIS_PORT}:6379"
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
      PORT: ${PORT}
      ENVIRONMENT: ${ENVIRONMENT}
      DATABASE_URL: ${DATABASE_URL}
      REDIS_URL: ${REDIS_URL}
      JWT_SECRET: ${JWT_SECRET}
      BCRYPT_COST: ${BCRYPT_COST}
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

### Required Environment Variables:
```
PORT=8080
ENVIRONMENT=production
POSTGRES_DB=trae_nutrition
POSTGRES_USER=trae_user
POSTGRES_PASSWORD=your-secure-password
POSTGRES_PORT=5432
REDIS_PORT=6379
DATABASE_URL=postgres://trae_user:your-secure-password@postgres:5432/trae_nutrition?sslmode=disable
REDIS_URL=redis://redis:6379/0
JWT_SECRET=your-secret-key-minimum-32-characters
BCRYPT_COST=12
```

---

## 📋 What Changed

1. ✅ Removed all `${VAR:-default}` syntax
2. ✅ Removed nested variable substitution
3. ✅ All variables now use simple `${VAR}` format
4. ✅ You must set ALL environment variables in Coolify

---

## 🎯 Quick Deploy Steps

1. **Copy the fixed compose file** (above)
2. **In Coolify:**
   - New Resource → Docker Compose
   - Paste the compose file
   - Set ALL environment variables (see lists above)
   - Deploy!

---

## ⚠️ Important Notes

- **All environment variables are REQUIRED** - no defaults
- **Set DATABASE_URL** with full connection string
- **Set REDIS_URL** with full connection string
- **Generate strong secrets** for JWT_SECRET and POSTGRES_PASSWORD

---

## 🔐 Generate Secrets

```bash
# JWT Secret (32+ characters)
openssl rand -base64 32

# PostgreSQL Password
openssl rand -base64 24
```

---

**The files are now fixed and ready to deploy!**
