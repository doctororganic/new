# Fix: "open dockerfile: no such file or directory" Error

## 🚨 The Problem

Error message:
```
ERROR: failed to build: failed to solve: failed to read dockerfile: open dockerfile: no such file or directory
```

This means Docker can't find the Dockerfile. Possible causes:

---

## ✅ Solution 1: Check Case Sensitivity

Docker is case-sensitive! Your file is `Dockerfile` (capital D), but Docker might be looking for `dockerfile` (lowercase).

### Fix Options:

**Option A: Use exact case in Coolify**
```
Dockerfile Path: Dockerfile          ← Capital D!
Build Context: backend/
```

**Option B: If Coolify forces lowercase, rename the file**
- Rename `backend/Dockerfile` to `backend/dockerfile` (lowercase)
- Then use: `Dockerfile Path: dockerfile`

---

## ✅ Solution 2: Verify Build Context

The Build Context must point to the directory that **contains** the Dockerfile.

### Check Your Structure:
```
your-repo/
├── backend/
│   ├── Dockerfile          ← File exists here
│   ├── go.mod
│   └── ...
```

### Correct Settings:
```
Dockerfile Path: Dockerfile          ← Just filename (relative to Build Context)
Build Context: backend/              ← Directory containing Dockerfile
```

---

## ✅ Solution 3: Use Full Path from Repository Root

If relative paths aren't working, try:

```
Dockerfile Path: backend/Dockerfile
Build Context: .                     ← Repository root
```

**Note**: If you do this, you'll need to update your Dockerfile's COPY commands to include `backend/` prefix, OR use the root Dockerfile we created earlier.

---

## ✅ Solution 4: Use Root Dockerfile (Easiest Fix)

We already created a root-level `Dockerfile` for you. Use this configuration:

```
Dockerfile Path: Dockerfile
Build Context: .                     ← Repository root
```

This uses the `Dockerfile` at the repository root, which is already configured to build from `backend/`.

---

## 🔍 Debugging Steps

### Step 1: Check Build Logs

Look for the actual docker build command in Coolify logs. It should show:
```
docker build -f <path-to-dockerfile> <build-context>
```

### Step 2: Verify File Exists

Check that `backend/Dockerfile` exists in your repository:
```bash
ls -la backend/Dockerfile
```

### Step 3: Check Case

Dockerfile should be exactly `Dockerfile` (capital D, rest lowercase):
```bash
ls -la backend/ | grep -i dockerfile
```

---

## 🎯 Recommended Solutions (In Order)

### Solution A: Use Root Dockerfile (Recommended)

```
Dockerfile Path: Dockerfile
Build Context: .
```

**Pros**: Simple, uses the root Dockerfile we created
**Cons**: None

### Solution B: Fix Case in Coolify

```
Dockerfile Path: Dockerfile          ← Make sure it's capital D
Build Context: backend/
```

**Pros**: Uses existing backend Dockerfile
**Cons**: Must ensure exact case match

### Solution C: Use Full Path

```
Dockerfile Path: backend/Dockerfile
Build Context: .
```

**Pros**: Explicit path
**Cons**: May need to adjust Dockerfile COPY commands

---

## 📋 Complete Configuration Options

### Option 1: Root Dockerfile (Easiest)
```
Dockerfile Path: Dockerfile
Build Context: .
Port: 8080
```

### Option 2: Backend Dockerfile (If Solution 1 doesn't work)
```
Dockerfile Path: Dockerfile          ← Capital D, relative to Build Context
Build Context: backend/
Port: 8080
```

### Option 3: Full Path (If others fail)
```
Dockerfile Path: backend/Dockerfile
Build Context: .
Port: 8080
```

---

## ⚠️ Important Notes

1. **Case Sensitivity**: Linux/Docker is case-sensitive. `Dockerfile` ≠ `dockerfile` ≠ `DOCKERFILE`

2. **Build Context**: This is where Docker looks for files. If Build Context = `backend/`, then:
   - Dockerfile Path should be relative to `backend/`
   - `COPY go.mod` looks for `backend/go.mod`

3. **Full Path**: If Build Context = `.` (root), then:
   - Dockerfile Path can be `backend/Dockerfile`
   - `COPY` commands in Dockerfile need to account for `backend/` prefix

---

## 🔧 Quick Fix Checklist

- [ ] Verify `backend/Dockerfile` exists in your repository
- [ ] Check file name is exactly `Dockerfile` (capital D)
- [ ] Try Solution A first (root Dockerfile)
- [ ] If that fails, try Solution B (backend Dockerfile with correct case)
- [ ] Check build logs for the actual docker command being run
- [ ] Verify Build Context directory exists and contains Dockerfile

---

## 🚀 Try This First

**Use the root Dockerfile we created:**

1. In Coolify, set:
   ```
   Dockerfile Path: Dockerfile
   Build Context: .
   ```

2. This uses `/workspace/Dockerfile` which we already created

3. Save and redeploy

This should work immediately!
