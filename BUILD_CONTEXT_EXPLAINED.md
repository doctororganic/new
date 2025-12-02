# Build Context Explained - Docker & Coolify

## 🎯 What is "Build Context"?

**Build Context** = **Base Directory** (NOT the build stage target)

The Build Context is the **directory path** that Docker uses as the **root/base** when building your image. It's the folder that gets sent to the Docker daemon and where Docker looks for files referenced in your Dockerfile.

---

## 📁 Build Context vs Build Stage Target

### ❌ Build Context is NOT:
- The Docker build stage target (like `FROM golang:1.21-alpine AS builder`)
- The target stage name in multi-stage builds
- The `--target` flag in `docker build --target builder`

### ✅ Build Context IS:
- The **base directory** where Docker starts looking for files
- The **root path** for `COPY` commands in your Dockerfile
- The **folder** that contains the files Docker needs to build

---

## 🔍 How It Works

### Example 1: Your Current Setup

**Repository Structure:**
```
your-repo/
├── backend/
│   ├── Dockerfile          ← Dockerfile is here
│   ├── go.mod
│   ├── cmd/server/main.go
│   └── ...
├── frontend/
└── README.md
```

**Your Dockerfile (in `backend/Dockerfile`):**
```dockerfile
COPY go.mod go.sum ./        ← Looks for go.mod in build context root
COPY . .                     ← Copies everything from build context
COPY cmd/server/main.go ...  ← Looks for cmd/server/ in build context
```

**Build Context = `backend/`** means:
- Docker uses `backend/` as the base directory
- `COPY go.mod` looks for `backend/go.mod` ✅
- `COPY cmd/server/main.go` looks for `backend/cmd/server/main.go` ✅
- Dockerfile path: `backend/Dockerfile` ✅

**If Build Context = `.` (root):**
- Docker uses repository root as base
- `COPY go.mod` would look for `go.mod` at root ❌ (doesn't exist!)
- `COPY go.mod` should be `COPY backend/go.mod` ❌ (Dockerfile would need changes)

---

## 🐳 Docker Build Command Equivalent

When you set:
- **Dockerfile Path**: `backend/Dockerfile`
- **Build Context**: `backend/`

Coolify runs equivalent to:
```bash
docker build -f backend/Dockerfile backend/
```

Where:
- `-f backend/Dockerfile` = path to Dockerfile
- `backend/` = build context (base directory)

---

## 📊 Visual Explanation

### Scenario 1: Build Context = `backend/` ✅ (Correct)

```
Repository Root: /workspace
Build Context: backend/

Docker sees:
backend/                    ← This is the root for Docker
├── Dockerfile              ← Found via -f backend/Dockerfile
├── go.mod                 ← COPY go.mod finds this ✅
├── go.sum
├── cmd/
│   └── server/
│       └── main.go        ← COPY cmd/server/main.go finds this ✅
└── .env.example
```

### Scenario 2: Build Context = `.` (root) ❌ (Wrong for your setup)

```
Repository Root: /workspace
Build Context: .

Docker sees:
.                           ← This is the root for Docker
├── backend/
│   ├── Dockerfile
│   ├── go.mod             ← COPY go.mod can't find this at root ❌
│   └── cmd/server/main.go
├── frontend/
└── README.md
```

**Problem**: Your Dockerfile says `COPY go.mod` but `go.mod` is in `backend/`, not at root!

---

## ✅ Correct Coolify Configuration

For your project structure:

```
┌─────────────────────────────────────┐
│ Dockerfile Path                     │
│ backend/Dockerfile                  │ ← Path to Dockerfile from repo root
├─────────────────────────────────────┤
│ Build Context                       │
│ backend/                            │ ← Base directory for Docker build
└─────────────────────────────────────┘
```

**What this means:**
- Coolify finds Dockerfile at: `repository-root/backend/Dockerfile`
- Docker uses `backend/` as the base directory
- All `COPY` commands in Dockerfile work relative to `backend/`

---

## 🔄 Build Stage Target (Different Concept)

**Build Stage Target** is about multi-stage builds:

```dockerfile
# Stage 1: Builder
FROM golang:1.21-alpine AS builder    ← Stage name: "builder"
...

# Stage 2: Runtime
FROM alpine:latest                    ← Stage name: "runtime"
...
```

If you wanted to build only the builder stage:
```bash
docker build --target builder -f backend/Dockerfile backend/
```

But **Coolify's "Build Context" field is NOT for this**. It's for the base directory.

---

## 📝 Summary Table

| Field | What It Is | Example Value |
|-------|------------|---------------|
| **Build Context** | Base directory for Docker build | `backend/` |
| **Dockerfile Path** | Path to Dockerfile from repo root | `backend/Dockerfile` |
| **Build Stage Target** | Multi-stage build target (different!) | `builder` or `runtime` |

---

## 🎯 For Your Coolify Setup

**Fill these fields:**

```
Dockerfile Path: backend/Dockerfile
Build Context: backend/
```

**Translation:**
- "Use `backend/Dockerfile` as the Dockerfile"
- "Use `backend/` folder as the base directory for the build"
- "All COPY commands in Dockerfile are relative to `backend/`"

---

## ⚠️ Common Confusion

**Question**: "Is Build Context the base directory or the build stage target?"

**Answer**: **Base Directory** ✅

The Build Context is always a **directory path**, not a build stage name. It tells Docker "start looking for files from this folder."

---

## 🔍 How to Verify

After setting Build Context to `backend/`, check the build logs. You should see:
```
Step 1/10 : COPY go.mod go.sum ./
 ---> Using cache
```

If it works, your Build Context is correct! If you see "file not found" errors, the Build Context is wrong.

---

**TL;DR**: Build Context = Base Directory (the folder Docker uses as root), NOT the build stage target.
