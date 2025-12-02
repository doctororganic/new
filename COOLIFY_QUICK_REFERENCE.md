# Coolify Deployment - Quick Reference Card

## ✅ Fill These Fields (Copy-Paste Ready)

### Basic Settings
```
Application Name: trae-backend
Repository URL: https://github.com/doctororganic/new.git
Branch: main
```

### Docker Settings (CRITICAL - Most Common Error Fix)
```
Dockerfile Path: Dockerfile          ← Relative to Build Context!
Build Context: backend/
Port: 8080
```

### Health Check
```
Health Check Path: /health
Health Check Port: 8080
```

### Environment Variables (Required)
```
PORT=8080
ENVIRONMENT=production
DATABASE_URL=postgres://user:password@host:5432/trae_nutrition?sslmode=disable
REDIS_URL=redis://host:6379/0
JWT_SECRET=your-super-secret-jwt-key-change-this
```

---

## 🎯 Field-by-Field Checklist

Print this and check off as you fill:

- [ ] **Application Name**: `trae-backend`
- [ ] **Repository**: Your GitHub/GitLab URL
- [ ] **Branch**: `main` (or your default branch)
- [ ] **Dockerfile Path**: `Dockerfile` ⚠️ (relative to Build Context!)
- [ ] **Build Context**: `backend/` ⚠️
- [ ] **Port**: `8080`
- [ ] **Health Check Path**: `/health`
- [ ] **Health Check Port**: `8080`
- [ ] **Environment Variable**: `PORT=8080`
- [ ] **Environment Variable**: `ENVIRONMENT=production`
- [ ] **Environment Variable**: `DATABASE_URL=...` (your database)
- [ ] **Environment Variable**: `REDIS_URL=...` (your redis)
- [ ] **Environment Variable**: `JWT_SECRET=...` (strong random string)

---

## ⚠️ Most Important Fields (Fix Your Error)

These 2 fields fix the "no such file or directory" error:

1. **Dockerfile Path**: `Dockerfile` (relative to Build Context!)
2. **Build Context**: `backend/`

**Important**: Dockerfile Path is relative to Build Context, not repository root!

---

## 📋 Screenshot Reference

When you see these fields in Coolify, fill them like this:

```
┌─────────────────────────────────────┐
│ Application Name                    │
│ [trae-backend________________]      │
├─────────────────────────────────────┤
│ Repository                          │
│ [https://github.com/.../new.git]    │
├─────────────────────────────────────┤
│ Branch                              │
│ [main________________________]      │
├─────────────────────────────────────┤
│ Dockerfile Path                     │
│ [Dockerfile_________________]  ⚠️   │ ← Just "Dockerfile"!
├─────────────────────────────────────┤
│ Build Context                       │
│ [backend/____________________]  ⚠️  │
├─────────────────────────────────────┤
│ Port                                │
│ [8080_______________________]       │
└─────────────────────────────────────┘
```

---

## 🔑 Environment Variables Section

In the Environment Variables section, add these one by one:

```
┌─────────────────────────────────────────────┐
│ Environment Variables                        │
├─────────────────────────────────────────────┤
│ Name: PORT                                   │
│ Value: 8080                                  │
│ [Add]                                        │
├─────────────────────────────────────────────┤
│ Name: ENVIRONMENT                            │
│ Value: production                            │
│ [Add]                                        │
├─────────────────────────────────────────────┤
│ Name: DATABASE_URL                           │
│ Value: postgres://user:pass@host:5432/...   │
│ [Add]                                        │
├─────────────────────────────────────────────┤
│ Name: REDIS_URL                              │
│ Value: redis://host:6379/0                   │
│ [Add]                                        │
├─────────────────────────────────────────────┤
│ Name: JWT_SECRET                             │
│ Value: your-secret-key-here                  │
│ [Add]                                        │
└─────────────────────────────────────────────┘
```

---

## 🚀 Deploy Button

After filling all fields:
1. Click **"Save"** or **"Deploy"**
2. Click **"Show Debug Logs"** to watch progress
3. Wait for build to complete

---

## ❌ If You See This Error Again

```
ERROR: failed to build: resolve : lstat /artifacts/.../nutrition-platform: no such file or directory
```

**Double-check these 2 fields:**
- ✅ Dockerfile Path = `Dockerfile` (relative to Build Context, not `backend/Dockerfile`)
- ✅ Build Context = `backend/` (not `.` or empty)

**If you see `backend/backend/Dockerfile` in logs**: Change Dockerfile Path to `Dockerfile`

---

## 📞 Quick Help

**Problem**: Build fails with "no such file or directory"
**Solution**: Set Dockerfile Path to `backend/Dockerfile` and Build Context to `backend/`

**Problem**: Application starts but can't connect to database
**Solution**: Check DATABASE_URL environment variable format

**Problem**: Health check fails
**Solution**: Verify Health Check Path is `/health` and Port is `8080`
