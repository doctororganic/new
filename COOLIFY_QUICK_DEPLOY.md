# 🚀 Quick Deploy to Coolify - Copy & Paste

## Option 1: Backend Only (Recommended)

### In Coolify:
1. **New Resource** → **Docker Compose**
2. **Docker Compose File**: `docker-compose.coolify.yml`
3. **Environment Variables** (add these):

```
PORT=8080
ENVIRONMENT=production
DATABASE_URL=postgres://user:password@host:5432/trae_nutrition?sslmode=disable
REDIS_URL=redis://host:6379/0
JWT_SECRET=your-secret-key-here-minimum-32-chars
```

4. **Deploy!**

---

## Option 2: Full Stack (Backend + DB + Redis)

### In Coolify:
1. **New Resource** → **Docker Compose**
2. **Docker Compose File**: `docker-compose.fullstack.yml`
3. **Environment Variables** (add these):

```
PORT=8080
ENVIRONMENT=production
POSTGRES_DB=trae_nutrition
POSTGRES_USER=trae_user
POSTGRES_PASSWORD=your-secure-password
DATABASE_URL=postgres://trae_user:your-secure-password@postgres:5432/trae_nutrition?sslmode=disable
REDIS_URL=redis://redis:6379/0
JWT_SECRET=your-secret-key-here-minimum-32-chars
```

4. **Deploy!**

---

## 📋 Files Created

- ✅ `docker-compose.coolify.yml` - Backend only
- ✅ `docker-compose.fullstack.yml` - Full stack
- ✅ `COOLIFY_DOCKER_COMPOSE_DEPLOY.md` - Full guide

**Just copy the compose file content and paste in Coolify!**
