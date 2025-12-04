#!/bin/bash

# Trae Nutrition Platform - Deployment Verification Script
# Verifies that all components are ready for deployment

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0
WARNINGS=0

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
    PASSED=$((PASSED + 1))
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
    FAILED=$((FAILED + 1))
}

log_warn() {
    echo -e "${YELLOW}[!]${NC} $1"
    WARNINGS=$((WARNINGS + 1))
}

# Header
echo "=========================================="
echo "  Trae Nutrition Platform"
echo "  Deployment Verification"
echo "=========================================="
echo ""

# 1. Check Required Files
log_info "Checking required files..."
REQUIRED_FILES=(
    "README.md"
    ".env.example"
    "docker-compose.yml"
    "deploy.sh"
    "backend/go.mod"
    "backend/Dockerfile"
    "backend/cmd/server/main.go"
    "backend/.env.example"
    "frontend/package.json"
    "frontend/Dockerfile"
    "frontend/next.config.js"
    "nginx/nginx.conf"
    "backend/data/init.sql"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        log_success "Found: $file"
    else
        log_error "Missing: $file"
    fi
done

# 2. Check Frontend Structure
log_info "Checking frontend structure..."
FRONTEND_FILES=(
    "frontend/app/layout.tsx"
    "frontend/app/page.tsx"
    "frontend/app/globals.css"
)

for file in "${FRONTEND_FILES[@]}"; do
    if [ -f "$file" ]; then
        log_success "Found: $file"
    else
        log_warn "Missing: $file (frontend may not be fully functional)"
    fi
done

# 3. Check Dependencies
log_info "Checking dependencies..."

# Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -ge 18 ]; then
        log_success "Node.js $(node -v) is installed"
    else
        log_error "Node.js version is too old. Required: 18+, Found: $(node -v)"
    fi
else
    log_error "Node.js is not installed"
fi

# Go
if command -v go &> /dev/null; then
    GO_VERSION=$(go version | awk '{print $3}' | sed 's/go//')
    GO_MAJOR=$(echo $GO_VERSION | cut -d'.' -f1)
    GO_MINOR=$(echo $GO_VERSION | cut -d'.' -f2)
    if [ "$GO_MAJOR" -gt 1 ] || ([ "$GO_MAJOR" -eq 1 ] && [ "$GO_MINOR" -ge 21 ]); then
        log_success "Go $(go version | awk '{print $3}') is installed"
    else
        log_error "Go version is too old. Required: 1.21+, Found: $GO_VERSION"
    fi
else
    log_error "Go is not installed"
fi

# npm
if command -v npm &> /dev/null; then
    log_success "npm $(npm -v) is installed"
else
    log_error "npm is not installed"
fi

# Docker (optional but recommended)
if command -v docker &> /dev/null; then
    log_success "Docker $(docker --version | awk '{print $3}' | cut -d',' -f1) is installed"
    if command -v docker-compose &> /dev/null; then
        log_success "Docker Compose is installed"
    else
        log_warn "Docker Compose not found (may use 'docker compose' instead)"
    fi
else
    log_warn "Docker is not installed (manual deployment will be used)"
fi

# 4. Check Go Dependencies
log_info "Checking Go dependencies..."
if [ -f "backend/go.mod" ]; then
    cd backend
    if go mod verify &> /dev/null; then
        log_success "Go dependencies are verified"
    else
        log_error "Go dependencies verification failed"
    fi
    if [ -f "go.sum" ]; then
        log_success "go.sum file exists"
    else
        log_warn "go.sum file missing (run 'go mod tidy')"
    fi
    cd ..
fi

# 5. Check Frontend Dependencies
log_info "Checking frontend dependencies..."
if [ -f "frontend/package.json" ]; then
    if [ -d "frontend/node_modules" ]; then
        log_success "Frontend node_modules directory exists"
    else
        log_warn "Frontend node_modules missing (run 'npm install' in frontend/)"
    fi
fi

# 6. Check Configuration Files
log_info "Checking configuration files..."

# Backend .env
if [ -f "backend/.env" ]; then
    log_success "Backend .env file exists"
else
    if [ -f "backend/.env.example" ]; then
        log_warn "Backend .env missing (copy from .env.example)"
    else
        log_error "Backend .env.example missing"
    fi
fi

# Root .env
if [ -f ".env" ]; then
    log_success "Root .env file exists"
else
    if [ -f ".env.example" ]; then
        log_warn "Root .env missing (copy from .env.example)"
    else
        log_error "Root .env.example missing"
    fi
fi

# 7. Check Docker Compose Configuration
log_info "Checking Docker Compose configuration..."
if command -v docker-compose &> /dev/null || docker compose version &> /dev/null; then
    if docker-compose config &> /dev/null 2>&1 || docker compose config &> /dev/null 2>&1; then
        log_success "Docker Compose configuration is valid"
    else
        log_error "Docker Compose configuration has errors"
    fi
else
    log_warn "Cannot validate Docker Compose (docker-compose not available)"
fi

# 8. Check Dockerfile Syntax (basic check)
log_info "Checking Dockerfiles..."

if [ -f "backend/Dockerfile" ]; then
    if grep -q "FROM" backend/Dockerfile && grep -q "WORKDIR" backend/Dockerfile; then
        log_success "Backend Dockerfile structure looks valid"
    else
        log_error "Backend Dockerfile appears incomplete"
    fi
fi

if [ -f "frontend/Dockerfile" ]; then
    if grep -q "FROM" frontend/Dockerfile && grep -q "WORKDIR" frontend/Dockerfile; then
        log_success "Frontend Dockerfile structure looks valid"
    else
        log_error "Frontend Dockerfile appears incomplete"
    fi
fi

# 9. Check Database Initialization Script
log_info "Checking database initialization script..."
if [ -f "backend/data/init.sql" ]; then
    if grep -q "CREATE TABLE" backend/data/init.sql; then
        log_success "Database init.sql contains table definitions"
    else
        log_warn "Database init.sql may be incomplete"
    fi
else
    log_error "Database init.sql is missing"
fi

# 10. Check Nginx Configuration
log_info "Checking Nginx configuration..."
if [ -f "nginx/nginx.conf" ]; then
    if grep -q "upstream" nginx/nginx.conf || grep -q "proxy_pass" nginx/nginx.conf; then
        log_success "Nginx configuration appears valid"
    else
        log_warn "Nginx configuration may be incomplete"
    fi
else
    log_error "Nginx configuration file is missing"
fi

# 11. Check Deployment Script
log_info "Checking deployment script..."
if [ -f "deploy.sh" ]; then
    if [ -x "deploy.sh" ]; then
        log_success "deploy.sh is executable"
    else
        log_warn "deploy.sh is not executable (run 'chmod +x deploy.sh')"
    fi
    if grep -q "docker-compose\|docker compose" deploy.sh; then
        log_success "deploy.sh includes Docker support"
    fi
else
    log_error "deploy.sh is missing"
fi

# 12. Check Port Availability (if services aren't running)
log_info "Checking port availability..."
if command -v lsof &> /dev/null || command -v netstat &> /dev/null; then
    # Check port 8080 (backend)
    if lsof -i :8080 &> /dev/null || netstat -tuln 2>/dev/null | grep -q ":8080"; then
        log_warn "Port 8080 is already in use (backend may be running)"
    else
        log_success "Port 8080 is available"
    fi
    
    # Check port 3000 (frontend)
    if lsof -i :3000 &> /dev/null || netstat -tuln 2>/dev/null | grep -q ":3000"; then
        log_warn "Port 3000 is already in use (frontend may be running)"
    else
        log_success "Port 3000 is available"
    fi
    
    # Check port 5432 (PostgreSQL)
    if lsof -i :5432 &> /dev/null || netstat -tuln 2>/dev/null | grep -q ":5432"; then
        log_warn "Port 5432 is already in use (PostgreSQL may be running)"
    else
        log_success "Port 5432 is available"
    fi
else
    log_warn "Cannot check port availability (lsof/netstat not available)"
fi

# Summary
echo ""
echo "=========================================="
echo "  Verification Summary"
echo "=========================================="
echo -e "${GREEN}Passed:${NC} $PASSED"
echo -e "${YELLOW}Warnings:${NC} $WARNINGS"
echo -e "${RED}Failed:${NC} $FAILED"
echo ""

if [ $FAILED -eq 0 ]; then
    if [ $WARNINGS -eq 0 ]; then
        echo -e "${GREEN}✓ All checks passed! Ready for deployment.${NC}"
        exit 0
    else
        echo -e "${YELLOW}⚠ Checks passed with warnings. Review warnings before deployment.${NC}"
        exit 0
    fi
else
    echo -e "${RED}✗ Some checks failed. Please fix errors before deployment.${NC}"
    exit 1
fi
