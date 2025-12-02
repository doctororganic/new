# Coolify Deployment Guide

## 🚨 Quick Fix

**If you're seeing this error:**
```
ERROR: failed to build: resolve : lstat /artifacts/.../nutrition-platform: no such file or directory
```

**Immediate Solution:**
1. Go to Coolify → Your Application → Settings
2. Set **Dockerfile Path**: `backend/Dockerfile`
3. Set **Build Context**: `backend/`
4. Set **Port**: `8080`
5. Save and redeploy

---

## 🔧 Fixing the Build Context Error

The error you're encountering:
```
ERROR: failed to build: resolve : lstat /artifacts/dg8ww84wwggwc40s4c0k00o8/nutrition-platform: no such file or directory
```

This occurs because Coolify can't find the expected build context. Here's how to fix it:

## ✅ Solution 1: Configure Build Context in Coolify (Recommended)

### For Backend Deployment:

1. **In Coolify Dashboard:**
   - Go to your application settings
   - Navigate to **Build Settings** or **Docker Settings**
   - Set the following:
     - **Dockerfile Path**: `backend/Dockerfile`
     - **Build Context**: `backend/` (or `.` if deploying from root)
     - **Docker Compose File**: Leave empty (unless using docker-compose)

2. **Repository Settings:**
   - Ensure the repository URL is correct
   - Branch should be `main` (or your default branch)
   - Root directory should be `/` (repository root)

3. **Application Configuration:**
   - **Port**: `8080`
   - **Health Check Path**: `/health`
   - **Health Check Port**: `8080`

### For Frontend Deployment:

If deploying frontend separately:
- **Dockerfile Path**: `frontend/Dockerfile` (you'll need to create this)
- **Build Context**: `frontend/`
- **Port**: `3000`

## ✅ Solution 2: Create Root-Level Dockerfile (Alternative)

If Coolify requires a Dockerfile at the root, create one:

### Option A: Backend Only (Root Dockerfile)

Create `Dockerfile` at the root with:

```dockerfile
# Build stage
FROM golang:1.21-alpine AS builder

WORKDIR /app

# Install dependencies
RUN apk add --no-cache git

# Copy go mod files
COPY backend/go.mod backend/go.sum ./
RUN go mod download

# Copy source code
COPY backend/ .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main cmd/server/main.go

# Final stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Copy the binary from builder
COPY --from=builder /app/main .

# Copy environment file
COPY --from=builder /app/.env.example .env

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Run the application
CMD ["./main"]
```

Then in Coolify:
- **Dockerfile Path**: `Dockerfile`
- **Build Context**: `.` (root)

## ✅ Solution 3: Use Docker Compose (For Full Stack)

If deploying the entire stack:

1. **In Coolify:**
   - Select **Docker Compose** deployment type
   - **Docker Compose File**: `docker-compose.yml`
   - **Build Context**: `.` (root)

2. **Ensure docker-compose.yml is configured correctly** (already done in your project)

## 🔍 Troubleshooting Steps

### Step 1: Verify Repository Structure

Ensure your repository has this structure:
```
your-repo/
├── backend/
│   ├── Dockerfile
│   ├── go.mod
│   └── cmd/server/main.go
├── frontend/
├── docker-compose.yml
└── README.md
```

### Step 2: Check Coolify Build Settings

In Coolify dashboard, verify:
- ✅ **Source**: Correct Git repository URL
- ✅ **Branch**: `main` (or your default branch)
- ✅ **Dockerfile Path**: `backend/Dockerfile` (relative to repo root)
- ✅ **Build Context**: `backend/` or `.` depending on your setup
- ✅ **Port**: `8080`

### Step 3: Check Application Name

The error mentions `nutrition-platform`. Ensure:
- The application name in Coolify matches your repository name
- Or update the application name in Coolify to match your actual repo

### Step 4: Verify Environment Variables

Set these in Coolify:
```
PORT=8080
ENVIRONMENT=production
DATABASE_URL=postgres://user:password@host:5432/dbname
REDIS_URL=redis://host:6379/0
JWT_SECRET=your-secret-key
```

### Step 5: Check Build Logs

In Coolify, click **Show Debug Logs** to see:
- What directory structure Coolify sees
- Where it's looking for files
- Any permission issues

## 📋 Recommended Coolify Configuration

### Backend Application:

```
Application Name: trae-backend (or your preferred name)
Source: https://github.com/doctororganic/new.git
Branch: main
Dockerfile Path: backend/Dockerfile
Build Context: backend/
Port: 8080
Health Check: /health
Health Check Port: 8080
```

### Environment Variables:
```
PORT=8080
ENVIRONMENT=production
DATABASE_URL=<your-postgres-url>
REDIS_URL=<your-redis-url>
JWT_SECRET=<your-jwt-secret>
```

## 🚀 Quick Fix Checklist

- [ ] Verify repository URL in Coolify
- [ ] Set Dockerfile Path to `backend/Dockerfile`
- [ ] Set Build Context to `backend/`
- [ ] Ensure port is set to `8080`
- [ ] Add all required environment variables
- [ ] Check that the branch name matches (usually `main`)
- [ ] Verify application name doesn't conflict with directory structure
- [ ] Review build logs for specific errors

## 🔗 Additional Resources

- [Coolify Documentation](https://coolify.io/docs)
- Check Coolify logs for more detailed error messages
- Ensure your repository is accessible and the branch exists

## 💡 Common Mistakes

1. **Wrong Build Context**: Setting build context to `.` when Dockerfile expects `backend/`
2. **Missing Dockerfile Path**: Not specifying the relative path to Dockerfile
3. **Port Mismatch**: Application runs on 8080 but Coolify expects different port
4. **Missing Environment Variables**: Database/Redis URLs not configured
5. **Application Name Mismatch**: Name in Coolify doesn't match repository structure

---

**Most Common Fix**: Set **Dockerfile Path** to `backend/Dockerfile` and **Build Context** to `backend/` in Coolify settings.
