# Fix: Coolify .env Template Error

## 🚨 The Problem

Error:
```
failed to read .env: Invalid template: "postgres://${POSTGRES_USER:-trae_user"
```

**Cause:** Coolify doesn't support `${VAR:-default}` syntax in `.env` file values. When you set environment variables in Coolify, you must provide **complete values**, not templates.

---

## ✅ Solution: Set Complete Values in Coolify

### Step 1: Use Simple Docker Compose

**File:** `docker-compose.simple.yml`

```yaml
version: '3.8'

services:
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

### Step 2: Set Environment Variables in Coolify

**⚠️ IMPORTANT:** Set **complete values**, not templates!

#### ✅ Correct Way (Set Complete Values):

```
PORT=8080
ENVIRONMENT=production
DATABASE_URL=postgres://trae_user:mypassword123@postgres:5432/trae_nutrition?sslmode=disable
REDIS_URL=redis://redis:6379/0
JWT_SECRET=my-super-secret-jwt-key-minimum-32-characters-long
BCRYPT_COST=12
```

#### ❌ Wrong Way (Don't Use Templates):

```
DATABASE_URL=postgres://${POSTGRES_USER:-trae_user}:${POSTGRES_PASSWORD}@postgres:5432/trae_nutrition?sslmode=disable
```

---

## 📋 Complete Environment Variables Setup

### For Backend Only Deployment:

In Coolify, add these environment variables **one by one** with **complete values**:

| Variable | Value (Example) | Notes |
|----------|----------------|-------|
| `PORT` | `8080` | Port number |
| `ENVIRONMENT` | `production` | Environment type |
| `DATABASE_URL` | `postgres://user:password@host:5432/trae_nutrition?sslmode=disable` | **Complete connection string** |
| `REDIS_URL` | `redis://host:6379/0` | **Complete connection string** |
| `JWT_SECRET` | `your-secret-key-here-minimum-32-characters` | Strong random string |
| `BCRYPT_COST` | `12` | Password hashing cost |

### Example Values:

```
PORT=8080
ENVIRONMENT=production
DATABASE_URL=postgres://trae_user:SecurePass123!@postgres:5432/trae_nutrition?sslmode=disable
REDIS_URL=redis://redis:6379/0
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
BCRYPT_COST=12
```

---

## 🔧 For Full Stack Deployment

If using `docker-compose.fullstack.yml`, set these:

```
PORT=8080
ENVIRONMENT=production
POSTGRES_DB=trae_nutrition
POSTGRES_USER=trae_user
POSTGRES_PASSWORD=SecurePass123!
POSTGRES_PORT=5432
REDIS_PORT=6379
DATABASE_URL=postgres://trae_user:SecurePass123!@postgres:5432/trae_nutrition?sslmode=disable
REDIS_URL=redis://redis:6379/0
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
BCRYPT_COST=12
```

**Note:** `DATABASE_URL` must be a **complete string**, not a template!

---

## 🎯 Quick Fix Steps

1. **In Coolify Dashboard:**
   - Go to your application
   - Click **"Environment Variables"** or **"Settings"**
   - **Delete** any `DATABASE_URL` that has `${POSTGRES_USER:-trae_user}` syntax
   - **Add new** `DATABASE_URL` with complete value:
     ```
     DATABASE_URL=postgres://trae_user:yourpassword@postgres:5432/trae_nutrition?sslmode=disable
     ```

2. **Replace all template values** with actual values:
   - ❌ Remove: `${POSTGRES_USER:-trae_user}`
   - ✅ Use: `trae_user` (or your actual username)

3. **Save and redeploy**

---

## 🔐 Generate Secure Values

```bash
# Generate JWT Secret (32+ characters)
openssl rand -base64 32

# Generate PostgreSQL Password
openssl rand -base64 24
```

---

## ✅ Checklist

Before deploying:

- [ ] Use `docker-compose.simple.yml` (or fixed fullstack version)
- [ ] Set `DATABASE_URL` as **complete string** (no `${}` templates)
- [ ] Set `REDIS_URL` as **complete string** (no `${}` templates)
- [ ] All other variables have **actual values** (not templates)
- [ ] No `${VAR:-default}` syntax in any environment variable values

---

## 💡 Key Point

**Coolify environment variables = Actual values, NOT templates!**

- ✅ `DATABASE_URL=postgres://user:pass@host:5432/db`
- ❌ `DATABASE_URL=postgres://${USER}:${PASS}@host:5432/db`

The `${VAR}` syntax in docker-compose.yml is fine - that's for Docker Compose to substitute. But the **values you set in Coolify** must be complete strings!

---

**Fix:** Delete the old `DATABASE_URL` with template syntax and set it with a complete connection string!
