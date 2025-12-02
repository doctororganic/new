# Coolify Deployment Setup - Step-by-Step Guide

## 📋 Complete Field-by-Field Configuration

Follow this guide to fill out each field in Coolify's deployment form.

---

## 🚀 Step 1: Create New Application

1. Log into Coolify dashboard
2. Click **"New Resource"** or **"Add Application"**
3. Select **"Docker"** or **"Standalone Docker"** (not Docker Compose unless deploying full stack)

---

## 📝 Step 2: Basic Information

### **Application Name**
```
trae-backend
```
*(or any name you prefer - this is just for identification in Coolify)*

### **Description** (Optional)
```
Trae Nutrition Platform - Backend API
```

---

## 🔗 Step 3: Source Configuration

### **Source Type**
Select: **Git Repository** or **GitHub/GitLab**

### **Repository URL**
```
https://github.com/doctororganic/new.git
```
*(Replace with your actual repository URL if different)*

### **Branch**
```
main
```
*(or `master` if that's your default branch)*

### **Root Directory** (if available)
```
/
```
*(Leave as root, or leave empty)*

---

## 🐳 Step 4: Docker Configuration

### **Dockerfile Path**
```
Dockerfile
```
**⚠️ IMPORTANT:** This is relative to Build Context, NOT repository root! Since Build Context is `backend/`, use just `Dockerfile` (not `backend/Dockerfile`)

### **Build Context**
```
backend/
```
**⚠️ IMPORTANT:** This tells Docker where to look for files. Should match the directory containing your Dockerfile. Dockerfile Path is relative to this directory.

### **Docker Compose File** (if using Docker Compose)
```
docker-compose.yml
```
*(Leave empty if deploying standalone backend)*

---

## 🔌 Step 5: Port Configuration

### **Port**
```
8080
```
*(This is the port your Go application listens on)*

### **Expose Port** (if available)
```
8080
```

---

## 🏥 Step 6: Health Check Configuration

### **Health Check Path**
```
/health
```
*(Your backend has a health endpoint at `/health`)*

### **Health Check Port**
```
8080
```

### **Health Check Interval** (if available)
```
30
```
*(seconds)*

### **Health Check Timeout** (if available)
```
3
```
*(seconds)*

---

## 🔐 Step 7: Environment Variables

Click **"Add Environment Variable"** and add each of these:

### **Required Environment Variables:**

| Variable Name | Value | Description |
|--------------|-------|-------------|
| `PORT` | `8080` | Server port |
| `ENVIRONMENT` | `production` | Environment type |
| `DATABASE_URL` | `postgres://user:password@host:5432/trae_nutrition?sslmode=disable` | PostgreSQL connection string (replace with your actual database) |
| `REDIS_URL` | `redis://host:6379/0` | Redis connection string (replace with your actual Redis) |
| `JWT_SECRET` | `your-super-secret-jwt-key-change-this-in-production` | JWT signing secret (use a strong random string) |

### **Optional Environment Variables:**

| Variable Name | Value | Description |
|--------------|-------|-------------|
| `BCRYPT_COST` | `12` | Password hashing cost |
| `LOG_LEVEL` | `info` | Logging level (debug, info, warn, error) |

**Example of filling environment variables:**
```
PORT=8080
ENVIRONMENT=production
DATABASE_URL=postgres://trae_user:your_password@postgres:5432/trae_nutrition?sslmode=disable
REDIS_URL=redis://redis:6379/0
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
```

---

## 💾 Step 8: Volumes (if needed)

If you need persistent storage for uploads:

### **Volume Mounts** (if available)
```
/root/uploads:/root/uploads
```
*(Maps container uploads directory to host)*

---

## 🔄 Step 9: Build Settings (Advanced)

### **Build Command** (usually auto-detected)
```
Leave empty or default
```

### **Build Arguments** (if needed)
```
Leave empty
```

### **Docker Build Options** (if available)
```
Leave empty or default
```

---

## 🌐 Step 10: Domain/Networking (if applicable)

### **Domain** (if you want custom domain)
```
api.yourdomain.com
```
*(Optional - only if you have a domain)*

### **Expose Publicly**
```
Yes
```
*(or No if only internal access)*

---

## 📊 Step 11: Resource Limits (Optional but Recommended)

### **CPU Limit**
```
1
```
*(or 0.5 for small deployments)*

### **Memory Limit**
```
512M
```
*(or 1G for production)*

### **Restart Policy**
```
unless-stopped
```
*(or always)*

---

## ✅ Step 12: Review and Deploy

1. **Review all settings** - Make sure:
   - ✅ Dockerfile Path: `Dockerfile` (relative to Build Context, not repo root!)
   - ✅ Build Context: `backend/`
   - ✅ Port: `8080`
   - ✅ All environment variables are set
   - ✅ Health check path: `/health`

2. Click **"Save"** or **"Deploy"**

3. Watch the build logs - Click **"Show Debug Logs"** to see progress

---

## 🎯 Complete Configuration Summary

Here's a quick reference of all critical fields:

```
Application Name: trae-backend
Repository: https://github.com/doctororganic/new.git
Branch: main
Dockerfile Path: Dockerfile          ← Relative to Build Context!
Build Context: backend/
Port: 8080
Health Check: /health
Health Check Port: 8080

Environment Variables:
  PORT=8080
  ENVIRONMENT=production
  DATABASE_URL=<your-postgres-url>
  REDIS_URL=<your-redis-url>
  JWT_SECRET=<your-secret-key>
```

---

## 🚨 Common Mistakes to Avoid

1. ❌ **Wrong Dockerfile Path**: Don't use `backend/Dockerfile` when Build Context is `backend/`
   - ✅ Use: `Dockerfile` (relative to Build Context, not repo root!)

2. ❌ **Wrong Build Context**: Don't use `.` when Dockerfile is in subdirectory
   - ✅ Use: `backend/`

3. ❌ **Doubled Path Error**: If you see `backend/backend/Dockerfile` in logs
   - ✅ Fix: Change Dockerfile Path from `backend/Dockerfile` to `Dockerfile`

3. ❌ **Missing Environment Variables**: Database/Redis URLs are required
   - ✅ Add all required env vars before deploying

4. ❌ **Wrong Port**: Make sure port matches your application
   - ✅ Use: `8080` (as defined in your Go code)

5. ❌ **Missing Health Check**: Health checks help Coolify monitor your app
   - ✅ Set: `/health` on port `8080`

---

## 🔍 If Deployment Fails

1. **Check Build Logs**: Click "Show Debug Logs" in Coolify
2. **Verify Repository Access**: Ensure Coolify can access your Git repo
3. **Check Branch Name**: Make sure branch `main` exists
4. **Verify Dockerfile**: Ensure `backend/Dockerfile` exists in your repo
5. **Check Environment Variables**: All required vars must be set

---

## 📝 Example: Database URL Format

If using Coolify's built-in PostgreSQL:
```
DATABASE_URL=postgres://postgres:password@postgres:5432/trae_nutrition?sslmode=disable
```

If using external PostgreSQL:
```
DATABASE_URL=postgres://username:password@your-db-host:5432/trae_nutrition?sslmode=disable
```

---

## 📝 Example: Redis URL Format

If using Coolify's built-in Redis:
```
REDIS_URL=redis://redis:6379/0
```

If using external Redis:
```
REDIS_URL=redis://your-redis-host:6379/0
```

---

## 🎉 After Successful Deployment

1. Check application logs in Coolify
2. Test health endpoint: `http://your-domain:8080/health`
3. Verify API endpoints are accessible
4. Monitor resource usage

---

**Need help?** Check the build logs in Coolify for specific error messages!
