# Deployment Checklist - Trae Nutrition Platform

**Quick Reference Checklist for Complete Deployment**

---

## Pre-Deployment Checklist

### System Requirements
- [ ] **Operating System:** Linux/macOS/Windows with WSL2
- [ ] **Node.js:** Version 18+ installed (`node -v`)
- [ ] **npm:** Version 9+ installed (`npm -v`)
- [ ] **Go:** Version 1.21+ installed (`go version`)
- [ ] **PostgreSQL:** Version 14+ installed (`psql --version`)
- [ ] **Redis:** Version 6+ installed (`redis-cli --version`)
- [ ] **Docker:** Version 20.10+ installed (optional, recommended)
- [ ] **Docker Compose:** Version 2.0+ installed (optional, recommended)

### Port Availability
- [ ] Port **8080** available (Backend)
- [ ] Port **3000** available (Frontend)
- [ ] Port **5432** available (PostgreSQL)
- [ ] Port **6379** available (Redis)
- [ ] Port **80** available (HTTP - Nginx)
- [ ] Port **443** available (HTTPS - Nginx)

### Repository Setup
- [ ] Repository cloned
- [ ] Navigated to project directory
- [ ] Verified project structure exists
- [ ] Ran `./verify-deployment.sh` (all critical files present)

---

## Configuration Checklist

### Environment Files
- [ ] **Root `.env`** created from `.env.example`
- [ ] **Backend `.env`** created from `backend/.env.example`
- [ ] **DATABASE_URL** configured with correct credentials
- [ ] **REDIS_URL** configured correctly
- [ ] **JWT_SECRET** set (minimum 32 characters, use `openssl rand -base64 32`)
- [ ] **NEXT_PUBLIC_API_URL** set correctly
- [ ] **ENVIRONMENT** set (development/production)
- [ ] All required variables filled in

### Database Setup
- [ ] PostgreSQL service running (`sudo systemctl status postgresql`)
- [ ] Database `trae_nutrition` created
- [ ] User `trae_user` created with password
- [ ] Database initialization script run (`backend/data/init.sql`)
- [ ] Tables verified (`psql -U trae_user -d trae_nutrition -c "\dt"`)
- [ ] Database connection tested

### Redis Setup
- [ ] Redis service running (`sudo systemctl status redis-server`)
- [ ] Redis connection tested (`redis-cli ping` returns PONG)
- [ ] Redis password configured (if required)

---

## Backend Setup Checklist

### Dependencies
- [ ] Navigated to `backend/` directory
- [ ] Go dependencies downloaded (`go mod download`)
- [ ] Dependencies verified (`go mod verify`)
- [ ] Dependencies tidied (`go mod tidy`)
- [ ] `go.sum` file exists

### Build
- [ ] Backend built successfully (`go build -o bin/server cmd/server/main.go`)
- [ ] Binary executable (`chmod +x bin/server`)
- [ ] Binary file exists (`ls -lh bin/server`)

### Testing
- [ ] Backend starts without errors
- [ ] Health endpoint responds (`curl http://localhost:8080/health`)
- [ ] API status endpoint responds (`curl http://localhost:8080/api/status`)
- [ ] No critical errors in logs

---

## Frontend Setup Checklist

### Dependencies
- [ ] Navigated to `frontend/` directory
- [ ] npm dependencies installed (`npm install`)
- [ ] `node_modules` directory exists
- [ ] `package-lock.json` exists
- [ ] No installation errors

### Build
- [ ] Frontend built successfully (`npm run build`)
- [ ] `.next` directory created
- [ ] Build completes without errors
- [ ] No TypeScript/compilation errors

### Testing
- [ ] Frontend starts (`npm run start`)
- [ ] Frontend accessible (`curl http://localhost:3000`)
- [ ] Homepage loads in browser
- [ ] No console errors

---

## Docker Setup Checklist (Optional)

### Docker Installation
- [ ] Docker installed and running (`docker ps`)
- [ ] Docker Compose installed (`docker compose version`)
- [ ] User added to docker group (if needed)
- [ ] Docker daemon running

### Docker Build
- [ ] Docker Compose config valid (`docker compose config`)
- [ ] Backend image builds (`docker compose build backend`)
- [ ] Frontend image builds (`docker compose build frontend`)
- [ ] All images built successfully

---

## Deployment Checklist

### Method Selection
Choose one deployment method:
- [ ] **Docker Compose** (Recommended)
- [ ] **Manual Deployment**
- [ ] **Deployment Script**

### Docker Compose Deployment
- [ ] All services started (`docker compose up -d`)
- [ ] All containers running (`docker compose ps`)
- [ ] No container errors
- [ ] Logs reviewed (`docker compose logs`)

### Manual Deployment
- [ ] PostgreSQL service started
- [ ] Redis service started
- [ ] Backend started (nohup or systemd)
- [ ] Frontend started (nohup or systemd)
- [ ] Processes running (`ps aux | grep`)

### Deployment Script
- [ ] Script executable (`chmod +x deploy.sh`)
- [ ] Full deployment run (`./deploy.sh deploy`)
- [ ] Setup completed
- [ ] Services started
- [ ] Health checks passed

---

## Verification Checklist

### Service Health
- [ ] **Backend Health:** `curl http://localhost:8080/health` returns OK
- [ ] **Frontend Health:** `curl http://localhost:3000` returns HTML
- [ ] **API Status:** `curl http://localhost:8080/api/status` returns JSON
- [ ] **Database:** `psql -U trae_user -d trae_nutrition -c "SELECT 1;"` succeeds
- [ ] **Redis:** `redis-cli ping` returns PONG

### Verification Script
- [ ] Ran `./verify-deployment.sh`
- [ ] All critical checks passed (30+)
- [ ] Warnings reviewed and addressed (if any)
- [ ] Zero failures

### End-to-End Testing
- [ ] Frontend accessible in browser
- [ ] Backend API endpoints respond
- [ ] Database queries work
- [ ] Redis operations work
- [ ] No errors in browser console
- [ ] No errors in server logs

### Nginx (if configured)
- [ ] Nginx service running
- [ ] Configuration valid (`nginx -t`)
- [ ] Frontend accessible via Nginx
- [ ] Backend API accessible via Nginx
- [ ] SSL configured (if production)

---

## Production Deployment Checklist

### Security
- [ ] **JWT_SECRET** changed from default (strong random value)
- [ ] **Database password** strong and secure
- [ ] **Environment** set to `production`
- [ ] **DEBUG** set to `false`
- [ ] **Firewall** configured (UFW or iptables)
- [ ] **SSL certificates** installed (Let's Encrypt or custom)
- [ ] **HTTPS** enabled and working
- [ ] **HTTP** redirects to HTTPS

### Server Configuration
- [ ] Systemd services configured (if manual deployment)
- [ ] Services enabled to start on boot
- [ ] Log rotation configured
- [ ] Backup script created and scheduled
- [ ] Monitoring set up (optional)

### Performance
- [ ] Database indexes verified
- [ ] Connection pooling configured
- [ ] Rate limiting configured
- [ ] Caching configured (Redis)
- [ ] Static assets optimized

### Monitoring
- [ ] Logs accessible and monitored
- [ ] Error tracking set up (optional)
- [ ] Health check endpoint monitored
- [ ] Disk space monitored
- [ ] Resource usage monitored

---

## Post-Deployment Checklist

### Documentation
- [ ] Deployment documented
- [ ] Environment variables documented
- [ ] Access credentials secured
- [ ] Team members informed

### Testing
- [ ] All API endpoints tested
- [ ] Frontend pages tested
- [ ] Authentication flow tested (when implemented)
- [ ] Database operations tested
- [ ] Error handling tested

### Maintenance
- [ ] Backup schedule configured
- [ ] Update procedure documented
- [ ] Rollback procedure documented
- [ ] Support contacts identified

---

## Quick Command Reference

```bash
# Verify setup
./verify-deployment.sh

# Deploy
./deploy.sh deploy

# Start services
./deploy.sh start

# Stop services
./deploy.sh stop

# Health check
./deploy.sh health

# View logs
./deploy.sh logs

# Docker Compose
docker compose up -d
docker compose logs -f
docker compose down
```

---

## Troubleshooting Quick Reference

| Issue | Solution |
|-------|----------|
| Port in use | `sudo lsof -i :PORT` then `kill PID` |
| Database connection failed | Check PostgreSQL running, verify DATABASE_URL |
| Build fails | Clear cache, reinstall dependencies |
| Service won't start | Check logs, verify environment variables |
| Docker issues | `docker compose down` then `docker compose up -d --build` |

---

## Success Criteria

✅ **Deployment is successful when:**
1. All services are running
2. Health endpoints respond correctly
3. Frontend loads in browser
4. Backend API responds
5. Database connection works
6. Redis connection works
7. Verification script passes
8. No critical errors in logs

---

**For detailed instructions, see:** `DETAILED_DEPLOYMENT_GUIDE.md`
