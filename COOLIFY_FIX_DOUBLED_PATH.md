# Fix: Coolify Doubled Path Error

## 🚨 The Problem

Your build log shows:
```
-f /artifacts/go00cwc08k00kow4c44kosco/backend/backend/Dockerfile
```

Notice: `backend/backend/` - the path is **doubled**!

**Error:**
```
lstat /artifacts/go00cwc08k00kow4c44kosco/backend/backend: no such file or directory
```

---

## ✅ The Solution

**Dockerfile Path should be relative to Build Context, not repository root!**

### ❌ Wrong Configuration:
```
Dockerfile Path: backend/Dockerfile    ← Wrong! This is relative to repo root
Build Context: backend/                ← This is correct
```

Coolify combines them: `backend/` + `backend/Dockerfile` = `backend/backend/Dockerfile` ❌

### ✅ Correct Configuration:
```
Dockerfile Path: Dockerfile            ← Correct! Relative to Build Context
Build Context: backend/                ← This is correct
```

Coolify combines them: `backend/` + `Dockerfile` = `backend/Dockerfile` ✅

---

## 🎯 Correct Coolify Settings

Update your Coolify configuration:

```
┌─────────────────────────────────────┐
│ Dockerfile Path                     │
│ Dockerfile                          │ ← Just "Dockerfile", not "backend/Dockerfile"
├─────────────────────────────────────┤
│ Build Context                       │
│ backend/                            │ ← Keep this as "backend/"
└─────────────────────────────────────┘
```

---

## 📝 Explanation

**How Coolify builds the Dockerfile path:**

1. **Build Context** = Base directory: `backend/`
2. **Dockerfile Path** = Path relative to Build Context: `Dockerfile`
3. **Final path** = Build Context + Dockerfile Path = `backend/Dockerfile` ✅

**If you set Dockerfile Path to `backend/Dockerfile`:**
1. **Build Context** = `backend/`
2. **Dockerfile Path** = `backend/Dockerfile` (treated as relative to Build Context)
3. **Final path** = `backend/` + `backend/Dockerfile` = `backend/backend/Dockerfile` ❌

---

## 🔍 Visual Example

### Your Repository Structure:
```
your-repo/
├── backend/
│   ├── Dockerfile          ← This is the file
│   ├── go.mod
│   └── ...
└── frontend/
```

### Coolify's Perspective:

**When Build Context = `backend/`:**
- Coolify sets the base directory to `backend/`
- Dockerfile Path should be relative to this base
- So: `Dockerfile` (not `backend/Dockerfile`)

**Think of it like this:**
```
cd backend/                    ← Build Context sets this as working directory
docker build -f Dockerfile .   ← Dockerfile Path is relative to current directory
```

---

## ✅ Updated Configuration Summary

### In Coolify Dashboard:

| Field | Value | Notes |
|-------|-------|-------|
| **Dockerfile Path** | `Dockerfile` | Just the filename, relative to Build Context |
| **Build Context** | `backend/` | The directory containing Dockerfile |
| **Port** | `8080` | Your application port |
| **Health Check Path** | `/health` | Health endpoint |

---

## 🔄 Quick Fix Steps

1. Go to Coolify → Your Application → Settings
2. Find **"Dockerfile Path"** field
3. Change from `backend/Dockerfile` to `Dockerfile`
4. Keep **Build Context** as `backend/`
5. Save and redeploy

---

## 📊 Before vs After

### Before (Wrong):
```
Dockerfile Path: backend/Dockerfile
Build Context: backend/
Result: backend/backend/Dockerfile ❌
```

### After (Correct):
```
Dockerfile Path: Dockerfile
Build Context: backend/
Result: backend/Dockerfile ✅
```

---

## 🎯 Key Takeaway

**Dockerfile Path is relative to Build Context, not repository root!**

- If Build Context = `backend/`
- Then Dockerfile Path = `Dockerfile` (not `backend/Dockerfile`)

---

## ✅ Final Configuration

```
Application Name: trae-backend
Repository: https://github.com/doctororganic/new.git
Branch: main
Dockerfile Path: Dockerfile          ← Changed!
Build Context: backend/              ← Keep this
Port: 8080
Health Check Path: /health
```

---

**This should fix your doubled path error!**
