# Docker Compose Deployment Guide

This guide explains how to deploy the Trae Nutrition platform using Docker Compose with all required credentials and environment variables.

## Prerequisites

- Docker 20.10+ installed
- Docker Compose 2.0+ installed
- At least 2GB RAM available
- Ports 80, 443, 3000, 5432, 6379, 8080 available (or configure custom ports)

## Quick Start

### 1. Clone and Setup

```bash
git clone <repository-url>
cd trae-nutrition
```

### 2. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.docker.example .env

# Edit .env with your actual credentials
nano .env  # or use your preferred editor
```

### 3. Required Credentials to Change

**CRITICAL: Change these before deploying to production!**

```bash
# Database Password (REQUIRED)
POSTGRES_PASSWORD=your-strong-database-password-here

# Redis Password (REQUIRED)
REDIS_PASSWORD=your-strong-redis-password-here

# JWT Secret (REQUIRED - Generate with: openssl rand -base64 32)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# API URL (REQUIRED for production)
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
# OR for local/internal use:
NEXT_PUBLIC_API_URL=http://your-server-ip:8080
```

### 4. Generate Secure Secrets

```bash
# Generate JWT Secret
openssl rand -base64 32

# Generate Database Password
openssl rand -base64 24

# Generate Redis Password
openssl rand -base64 24
```

### 5. Deploy

```bash
# Build and start all services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Check status
docker-compose -f docker-compose.prod.yml ps
```

## Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `POSTGRES_PASSWORD` | PostgreSQL database password | `StrongP@ssw0rd123!` |
| `REDIS_PASSWORD` | Redis authentication password | `RedisP@ss123!` |
| `JWT_SECRET` | Secret key for JWT tokens (min 32 chars) | `openssl rand -base64 32` |
| `NEXT_PUBLIC_API_URL` | Public API URL for frontend | `https://api.example.com` |

### Database Configuration

```bash
POSTGRES_DB=trae_nutrition          # Database name
POSTGRES_USER=trae_user              # Database user
POSTGRES_PASSWORD=<REQUIRED>         # Database password
POSTGRES_PORT=5432                   # Database port
```

### Redis Configuration

```bash
REDIS_PASSWORD=<REQUIRED>            # Redis password
REDIS_DB=0                           # Redis database number
REDIS_PORT=6379                      # Redis port
```

### JWT & Security

```bash
JWT_SECRET=<REQUIRED>                # JWT signing secret (min 32 chars)
JWT_EXPIRATION=24h                   # Token expiration time
JWT_REFRESH_EXPIRATION=168h          # Refresh token expiration
BCRYPT_COST=12                       # Password hashing cost
```

### Frontend Configuration

```bash
NEXT_PUBLIC_API_URL=<REQUIRED>       # Public API URL
API_URL=http://backend:8080          # Internal API URL
NEXT_PUBLIC_APP_NAME=Trae Nutrition  # App name
NEXT_PUBLIC_APP_VERSION=1.0.0        # App version
```

### Optional Configuration

#### Email (SMTP)

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@traenutrition.com
```

#### External APIs

```bash
NUTRITIONIX_API_KEY=your_key
NUTRITIONIX_APP_ID=your_app_id
SPOONACULAR_API_KEY=your_key
```

#### Ports

```bash
BACKEND_PORT=8080
FRONTEND_PORT=3000
NGINX_HTTP_PORT=80
NGINX_HTTPS_PORT=443
```

## Production Deployment Checklist

- [ ] Generate strong passwords for PostgreSQL, Redis, and JWT
- [ ] Update `NEXT_PUBLIC_API_URL` to your production domain
- [ ] Set `ENVIRONMENT=production` and `NODE_ENV=production`
- [ ] Configure SSL certificates for HTTPS (if using nginx)
- [ ] Set up firewall rules to restrict database/redis ports
- [ ] Configure backup strategy for PostgreSQL data
- [ ] Set up monitoring and logging
- [ ] Review and adjust rate limiting settings
- [ ] Configure email settings (if needed)
- [ ] Set up external API keys (if needed)
- [ ] Test all endpoints after deployment
- [ ] Set up health checks and alerts

## Service URLs

After deployment, services will be available at:

- **Frontend**: http://localhost:3000 (or your configured port)
- **Backend API**: http://localhost:8080 (or your configured port)
- **PostgreSQL**: localhost:5432 (internal only)
- **Redis**: localhost:6379 (internal only)
- **Nginx** (if enabled): http://localhost:80, https://localhost:443

## Common Commands

```bash
# Start services
docker-compose -f docker-compose.prod.yml up -d

# Stop services
docker-compose -f docker-compose.prod.yml down

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# View specific service logs
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend

# Restart a service
docker-compose -f docker-compose.prod.yml restart backend

# Rebuild and restart
docker-compose -f docker-compose.prod.yml up -d --build

# Stop and remove volumes (WARNING: deletes data)
docker-compose -f docker-compose.prod.yml down -v

# Execute commands in containers
docker-compose -f docker-compose.prod.yml exec backend sh
docker-compose -f docker-compose.prod.yml exec postgres psql -U trae_user -d trae_nutrition
```

## Troubleshooting

### Services Won't Start

1. Check if ports are already in use:
   ```bash
   lsof -i :8080
   lsof -i :3000
   lsof -i :5432
   ```

2. Check logs:
   ```bash
   docker-compose -f docker-compose.prod.yml logs
   ```

3. Verify environment variables:
   ```bash
   docker-compose -f docker-compose.prod.yml config
   ```

### Database Connection Issues

1. Verify PostgreSQL is healthy:
   ```bash
   docker-compose -f docker-compose.prod.yml exec postgres pg_isready -U trae_user
   ```

2. Check database credentials in `.env` file

3. Verify network connectivity:
   ```bash
   docker-compose -f docker-compose.prod.yml exec backend ping postgres
   ```

### Frontend Can't Connect to Backend

1. Check `NEXT_PUBLIC_API_URL` in `.env`
2. Verify backend is running: `curl http://localhost:8080/health`
3. Check CORS configuration in backend
4. Review browser console for errors

### Redis Connection Issues

1. Verify Redis is running:
   ```bash
   docker-compose -f docker-compose.prod.yml exec redis redis-cli ping
   ```

2. Check Redis password in `.env`

### Security Best Practices

1. **Never commit `.env` file** - Add to `.gitignore`
2. **Use strong passwords** - Minimum 16 characters, mix of letters, numbers, symbols
3. **Rotate secrets regularly** - Especially JWT_SECRET
4. **Limit database access** - Don't expose PostgreSQL port publicly
5. **Use HTTPS in production** - Configure SSL certificates
6. **Regular backups** - Backup PostgreSQL data regularly
7. **Monitor logs** - Set up log aggregation and monitoring

## Backup and Restore

### Backup PostgreSQL

```bash
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U trae_user trae_nutrition > backup.sql
```

### Restore PostgreSQL

```bash
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U trae_user trae_nutrition < backup.sql
```

### Backup Redis

```bash
docker-compose -f docker-compose.prod.yml exec redis redis-cli --rdb /data/dump.rdb
```

## Scaling

To scale services:

```bash
# Scale backend (example: 3 instances)
docker-compose -f docker-compose.prod.yml up -d --scale backend=3

# Scale frontend (example: 2 instances)
docker-compose -f docker-compose.prod.yml up -d --scale frontend=2
```

Note: For production scaling, consider using Docker Swarm or Kubernetes instead of simple docker-compose scaling.

## Monitoring

Health checks are configured for all services. Check health status:

```bash
docker-compose -f docker-compose.prod.yml ps
```

All services should show "healthy" status.

## Support

For issues or questions:
1. Check logs: `docker-compose -f docker-compose.prod.yml logs`
2. Verify environment variables
3. Check service health status
4. Review this documentation
