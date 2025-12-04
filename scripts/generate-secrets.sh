#!/bin/bash

# Generate secure secrets for Docker Compose deployment
# This script generates random secure passwords and secrets

echo "🔐 Generating Secure Secrets for Trae Nutrition Platform"
echo "========================================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if openssl is available
if ! command -v openssl &> /dev/null; then
    echo -e "${YELLOW}⚠️  openssl not found. Using alternative method.${NC}"
    USE_OPENSSL=false
else
    USE_OPENSSL=true
fi

generate_secret() {
    local length=$1
    if [ "$USE_OPENSSL" = true ]; then
        openssl rand -base64 $length | tr -d '\n' | tr -d '='
    else
        cat /dev/urandom | tr -dc 'a-zA-Z0-9!@#$%^&*' | fold -w $length | head -n 1
    fi
}

echo "Generated secrets (add these to your .env file):"
echo ""
echo -e "${GREEN}# Database Password${NC}"
echo "POSTGRES_PASSWORD=$(generate_secret 32)"
echo ""
echo -e "${GREEN}# Redis Password${NC}"
echo "REDIS_PASSWORD=$(generate_secret 32)"
echo ""
echo -e "${GREEN}# JWT Secret (minimum 32 characters)${NC}"
echo "JWT_SECRET=$(generate_secret 48)"
echo ""
echo "========================================================"
echo -e "${YELLOW}⚠️  IMPORTANT:${NC}"
echo "1. Copy these values to your .env file"
echo "2. Never commit .env to version control"
echo "3. Store backups securely"
echo "4. Rotate secrets regularly in production"
echo ""
