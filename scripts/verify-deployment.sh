#!/bin/bash

# Deployment Verification Script
# Verifies all services are running correctly after deployment

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

COMPOSE_FILE="docker-compose.prod.yml"
FAILED=0
PASSED=0

echo -e "${BLUE}🔍 Trae Nutrition Deployment Verification${NC}"
echo "=========================================="
echo ""

# Function to check service health
check_service() {
    local service=$1
    local check_cmd=$2
    
    echo -n "Checking $service... "
    if eval "$check_cmd" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ PASS${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC}"
        ((FAILED++))
        return 1
    fi
}

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ docker-compose not found${NC}"
    exit 1
fi

# Check if services are running
echo -e "${BLUE}1. Service Status Checks${NC}"
echo "---------------------------"

check_service "PostgreSQL" "docker-compose -f $COMPOSE_FILE exec -T postgres pg_isready -U \${POSTGRES_USER:-trae_user}"
check_service "Redis" "docker-compose -f $COMPOSE_FILE exec -T redis redis-cli -a \${REDIS_PASSWORD} ping"
check_service "Backend Health" "curl -sf http://localhost:8080/health"
check_service "Frontend" "curl -sf http://localhost:3000"

echo ""

# Check environment variables
echo -e "${BLUE}2. Environment Variable Checks${NC}"
echo "---------------------------"

check_env_var() {
    local var=$1
    local required=$2
    
    if [ -z "${!var}" ] && [ "$required" = "true" ]; then
        echo -e "${RED}❌ $var is not set (REQUIRED)${NC}"
        ((FAILED++))
        return 1
    elif [ -z "${!var}" ]; then
        echo -e "${YELLOW}⚠️  $var is not set (optional)${NC}"
        return 0
    else
        if [ "$var" = "POSTGRES_PASSWORD" ] || [ "$var" = "REDIS_PASSWORD" ] || [ "$var" = "JWT_SECRET" ]; then
            echo -e "${GREEN}✅ $var is set${NC}"
        else
            echo -e "${GREEN}✅ $var is set${NC}"
        fi
        ((PASSED++))
        return 0
    fi
}

# Load .env file if it exists
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

check_env_var "POSTGRES_PASSWORD" "true"
check_env_var "REDIS_PASSWORD" "true"
check_env_var "JWT_SECRET" "true"
check_env_var "NEXT_PUBLIC_API_URL" "true"

echo ""

# Check API endpoints
echo -e "${BLUE}3. API Endpoint Checks${NC}"
echo "---------------------------"

check_endpoint() {
    local name=$1
    local url=$2
    
    echo -n "Testing $name... "
    if curl -sf "$url" > /dev/null; then
        echo -e "${GREEN}✅ PASS${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC}"
        ((FAILED++))
        return 1
    fi
}

check_endpoint "Backend Health" "http://localhost:8080/health"
check_endpoint "Backend Status" "http://localhost:8080/api/status"
check_endpoint "Frontend" "http://localhost:3000"

echo ""

# Check network connectivity
echo -e "${BLUE}4. Network Connectivity Checks${NC}"
echo "---------------------------"

check_network() {
    local service=$1
    local target=$2
    
    echo -n "Checking $service → $target... "
    if docker-compose -f $COMPOSE_FILE exec -T $service ping -c 1 $target > /dev/null 2>&1; then
        echo -e "${GREEN}✅ PASS${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC}"
        ((FAILED++))
        return 1
    fi
}

check_network "backend" "postgres"
check_network "backend" "redis"
check_network "frontend" "backend"

echo ""

# Check volumes
echo -e "${BLUE}5. Volume Checks${NC}"
echo "---------------------------"

check_volume() {
    local volume=$1
    
    echo -n "Checking volume $volume... "
    if docker volume inspect trae-nutrition_${volume} > /dev/null 2>&1; then
        echo -e "${GREEN}✅ EXISTS${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${YELLOW}⚠️  NOT FOUND (may be created on first run)${NC}"
        return 0
    fi
}

check_volume "postgres_data"
check_volume "redis_data"

echo ""

# Summary
echo "=========================================="
echo -e "${BLUE}Verification Summary${NC}"
echo "=========================================="
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed! Deployment looks good.${NC}"
    exit 0
else
    echo -e "${RED}❌ Some checks failed. Please review the errors above.${NC}"
    exit 1
fi
