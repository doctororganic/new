# Quick Credentials Reference

## 🔴 MUST CHANGE (Required for Production)

```bash
POSTGRES_PASSWORD=<generate-strong-password>
REDIS_PASSWORD=<generate-strong-password>
JWT_SECRET=<generate-32-char-secret>
NEXT_PUBLIC_API_URL=<your-production-api-url>
```

## Quick Generate Commands

```bash
# Generate all secrets at once
./scripts/generate-secrets.sh

# Or generate individually:
openssl rand -base64 32  # JWT_SECRET (32+ chars)
openssl rand -base64 24  # Passwords (24 chars)
```

## Minimum .env Setup

```bash
# Copy template
cp .env.docker.example .env

# Edit and set these 4 required values:
POSTGRES_PASSWORD=<your-password>
REDIS_PASSWORD=<your-password>
JWT_SECRET=<your-32-char-secret>
NEXT_PUBLIC_API_URL=http://localhost:8080  # Change for production
```

## Deploy

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Full Documentation

- **Complete Guide**: See `CREDENTIALS_GUIDE.md`
- **Deployment Guide**: See `DOCKER_DEPLOYMENT.md`
- **Integration Guide**: See `INTEGRATION.md`
