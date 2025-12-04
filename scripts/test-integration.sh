#!/bin/bash

# Backend-Frontend Integration Test Script
# This script tests if the backend is accessible and responding correctly

set -e

BACKEND_URL="${BACKEND_URL:-http://localhost:8080}"
FRONTEND_URL="${FRONTEND_URL:-http://localhost:3000}"

echo "🔍 Testing Backend-Frontend Integration"
echo "========================================"
echo "Backend URL: $BACKEND_URL"
echo "Frontend URL: $FRONTEND_URL"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Backend Health Check
echo "1. Testing backend health endpoint..."
if curl -s -f "$BACKEND_URL/health" > /dev/null; then
    echo -e "${GREEN}✅ Backend is running${NC}"
    HEALTH_RESPONSE=$(curl -s "$BACKEND_URL/health")
    echo "   Response: $HEALTH_RESPONSE"
else
    echo -e "${RED}❌ Backend is not accessible at $BACKEND_URL${NC}"
    echo "   Make sure the backend is running: cd backend && go run cmd/server/main.go"
    exit 1
fi
echo ""

# Test 2: API Status
echo "2. Testing API status endpoint..."
if curl -s -f "$BACKEND_URL/api/status" > /dev/null; then
    echo -e "${GREEN}✅ API status endpoint is working${NC}"
    STATUS_RESPONSE=$(curl -s "$BACKEND_URL/api/status")
    echo "   Response: $STATUS_RESPONSE"
else
    echo -e "${RED}❌ API status endpoint failed${NC}"
    exit 1
fi
echo ""

# Test 3: CORS Headers
echo "3. Testing CORS configuration..."
CORS_HEADERS=$(curl -s -I -X OPTIONS -H "Origin: $FRONTEND_URL" "$BACKEND_URL/api/v1/meals" | grep -i "access-control")
if [ -n "$CORS_HEADERS" ]; then
    echo -e "${GREEN}✅ CORS headers are present${NC}"
    echo "   $CORS_HEADERS"
else
    echo -e "${YELLOW}⚠️  CORS headers not found (may still work)${NC}"
fi
echo ""

# Test 4: API Endpoints
echo "4. Testing API endpoints..."
ENDPOINTS=(
    "/api/v1/meals"
    "/api/v1/workouts"
    "/api/v1/progress/weight"
    "/api/v1/progress/measurements"
)

for endpoint in "${ENDPOINTS[@]}"; do
    if curl -s -f "$BACKEND_URL$endpoint" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ $endpoint${NC}"
    else
        echo -e "${RED}❌ $endpoint${NC}"
    fi
done
echo ""

# Test 5: Frontend (if running)
echo "5. Testing frontend accessibility..."
if curl -s -f "$FRONTEND_URL" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend is running${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend is not running at $FRONTEND_URL${NC}"
    echo "   Start it with: cd frontend && npm run dev"
fi
echo ""

echo "========================================"
echo -e "${GREEN}✅ Integration tests completed!${NC}"
echo ""
echo "Next steps:"
echo "1. Start frontend: cd frontend && npm run dev"
echo "2. Visit http://localhost:3000/api-test for detailed integration tests"
echo "3. Check browser console for API logs"
