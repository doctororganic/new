# Fix: "go.mod: not found" Error

## 🚨 The Problem

Error:
```
ERROR: "/go.mod": not found
> [builder 4/7] COPY go.mod go.sum ./
```

This happens because:
1. The Dockerfile is trying to copy `go.mod` from the build context root
2. But `go.mod` is actually in the `backend/` directory
3. The Build Context doesn't match what the Dockerfile expects

---

## ✅ Solution: Match Dockerfile with Build Context

You have TWO options:

### Option 1: Use Root Dockerfile (Recommended)

**Configuration:**
```
Dockerfile Path: Dockerfile
Build Context: .
```

**Why this works:**
- Root `Dockerfile` uses `COPY backend/go.mod backend/go.sum ./`
- Build Context = `.` (root) means `backend/go.mod` exists ✅
- This is the simplest solution

---

### Option 2: Use Backend Dockerfile with Correct Build Context

**Configuration:**
```
Dockerfile Path: Dockerfile          ← Relative to Build Context
Build Context: backend/
```

**Why this works:**
- `backend/Dockerfile` uses `COPY go.mod go.sum ./`
- Build Context = `backend/` means `go.mod` is at the root of build context ✅
- Files are found correctly

---

## 🔍 Understanding the Error

The error shows:
```
COPY go.mod go.sum ./
ERROR: "/go.mod": not found
```

This means:
- Dockerfile is `backend/Dockerfile` (which expects `go.mod` in build context root)
- But Build Context is probably `.` (repository root)
- So Docker looks for `./go.mod` but it's actually at `./backend/go.mod` ❌

---

## ✅ Correct Configurations

### Configuration A: Root Dockerfile
```
┌─────────────────────────────────────┐
│ Dockerfile Path                     │
│ Dockerfile                          │ ← Root Dockerfile
├─────────────────────────────────────┤
│ Build Context                       │
│ .                                   │ ← Repository root
└─────────────────────────────────────┘
```

**Dockerfile used:** `/workspace/Dockerfile`
**Dockerfile content:** `COPY backend/go.mod backend/go.sum ./`
**Build context:** Repository root (contains `backend/` folder)
**Result:** ✅ Works!

---

### Configuration B: Backend Dockerfile
```
┌─────────────────────────────────────┐
│ Dockerfile Path                     │
│ Dockerfile                          │ ← Relative to Build Context
├─────────────────────────────────────┤
│ Build Context                       │
│ backend/                            │ ← Backend directory
└─────────────────────────────────────┘
```

**Dockerfile used:** `/workspace/backend/Dockerfile`
**Dockerfile content:** `COPY go.mod go.sum ./`
**Build context:** `backend/` directory (contains `go.mod` directly)
**Result:** ✅ Works!

---

## ❌ Wrong Configuration (Causes Error)

```
┌─────────────────────────────────────┐
│ Dockerfile Path                     │
│ backend/Dockerfile                  │ ← Full path
├─────────────────────────────────────┤
│ Build Context                       │
│ .                                   │ ← Root
└─────────────────────────────────────┘
```

**Problem:**
- Dockerfile says: `COPY go.mod go.sum ./`
- Build Context = `.` means Docker looks for `./go.mod`
- But `go.mod` is at `./backend/go.mod` ❌
- **Result:** Error!

---

## 🎯 Quick Fix

**Choose ONE of these configurations:**

### Option 1 (Easiest):
```
Dockerfile Path: Dockerfile
Build Context: .
```

### Option 2:
```
Dockerfile Path: Dockerfile
Build Context: backend/
```

**Both will work!** Option 1 is simpler.

---

## ✅ What I Fixed

1. ✅ Generated `go.sum` file (it was missing)
2. ✅ Updated both Dockerfiles to handle the paths correctly
3. ✅ Both Dockerfiles now work with their respective build contexts

---

## 🚀 Next Steps

1. **Commit the `go.sum` file** to your repository:
   ```bash
   git add backend/go.sum
   git commit -m "Add go.sum file"
   git push
   ```

2. **In Coolify, use Configuration A** (easiest):
   ```
   Dockerfile Path: Dockerfile
   Build Context: .
   ```

3. **Save and redeploy**

---

## 📋 Summary

**The Issue:** Build Context didn't match what the Dockerfile expected

**The Fix:** Use matching Dockerfile + Build Context combination:
- Root Dockerfile + Build Context `.` ✅
- Backend Dockerfile + Build Context `backend/` ✅

**Also Fixed:** Generated missing `go.sum` file

---

**Try Configuration A first - it's the simplest!**
