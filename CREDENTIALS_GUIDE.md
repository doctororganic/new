# Credentials & Environment Variables Guide

This document provides a comprehensive guide to all credentials and environment variables needed for Docker Compose deployment.

## 🔐 Required Credentials (MUST CHANGE)

These credentials **MUST** be changed before deploying to production:

### 1. Database Password
```bash
POSTGRES_PASSWORD=your-strong-database-password
```
- **Purpose**: PostgreSQL database authentication
- **Security**: Use a strong password (min 16 characters)
- **Generate**: `openssl rand -base64 24` or use `./scripts/generate-secrets.sh`

### 2. Redis Password
```bash
REDIS_PASSWORD=your-strong-redis-password
```
- **Purpose**: Redis cache authentication
- **Security**: Use a strong password (min 16 characters)
- **Generate**: `openssl rand -base64 24` or use `./scripts/generate-secrets.sh`

### 3. JWT Secret
```bash
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
```
- **Purpose**: Signing JWT tokens for authentication
- **Security**: **CRITICAL** - Must be at least 32 characters, random and secret
- **Generate**: `openssl rand -base64 32` or use `./scripts/generate-secrets.sh`
- **Warning**: Changing this invalidates all existing tokens

## 🌐 Required Configuration

### Frontend API URL
```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
```
- **Development**: `http://localhost:8080`
- **Production**: Your public API URL (e.g., `https://api.yourdomain.com`)
- **Important**: This is exposed to the browser, so use HTTPS in production

## 📋 Complete Environment Variables List

### Database Configuration
```bash
POSTGRES_DB=trae_nutrition              # Database name
POSTGRES_USER=trae_user                  # Database username
POSTGRES_PASSWORD=<REQUIRED>             # Database password (CHANGE THIS)
POSTGRES_PORT=5432                       # Database port
DATABASE_MAX_OPEN_CONNS=25               # Max open connections
DATABASE_MAX_IDLE_CONNS=25               # Max idle connections
DATABASE_CONN_MAX_LIFETIME=5m            # Connection lifetime
```

### Redis Configuration
```bash
REDIS_PASSWORD=<REQUIRED>                # Redis password (CHANGE THIS)
REDIS_DB=0                               # Redis database number
REDIS_PORT=6379                          # Redis port
```

### JWT & Security
```bash
JWT_SECRET=<REQUIRED>                    # JWT secret (CHANGE THIS - min 32 chars)
JWT_EXPIRATION=24h                       # Token expiration
JWT_REFRESH_EXPIRATION=168h              # Refresh token expiration
BCRYPT_COST=12                           # Password hashing cost (higher = more secure, slower)
```

### Application Ports
```bash
BACKEND_PORT=8080                        # Backend API port
FRONTEND_PORT=3000                       # Frontend port
NGINX_HTTP_PORT=80                       # Nginx HTTP port
NGINX_HTTPS_PORT=443                     # Nginx HTTPS port
```

### Frontend Configuration
```bash
NEXT_PUBLIC_API_URL=<REQUIRED>           # Public API URL (CHANGE FOR PRODUCTION)
API_URL=http://backend:8080              # Internal API URL (Docker network)
NEXT_PUBLIC_APP_NAME=Trae Nutrition      # Application name
NEXT_PUBLIC_APP_VERSION=1.0.0            # Application version
NODE_ENV=production                      # Node environment
```

### Environment Settings
```bash
ENVIRONMENT=production                   # Environment (development/production)
```

### Rate Limiting
```bash
RATE_LIMIT_REQUESTS=100                 # Requests per duration
RATE_LIMIT_DURATION=1m                   # Rate limit window
```

### File Upload
```bash
MAX_FILE_SIZE=10485760                   # Max file size (10MB)
UPLOAD_PATH=/app/uploads                 # Upload directory
ALLOWED_FILE_TYPES=jpg,jpeg,png,gif,pdf  # Allowed file types
```

### Email Configuration (Optional)
```bash
SMTP_HOST=                               # SMTP server hostname
SMTP_PORT=587                            # SMTP port
SMTP_USER=                                # SMTP username
SMTP_PASSWORD=                            # SMTP password
SMTP_FROM=noreply@traenutrition.com      # From email address
```

### External APIs (Optional)
```bash
NUTRITIONIX_API_KEY=                     # Nutritionix API key
NUTRITIONIX_APP_ID=                      # Nutritionix App ID
SPOONACULAR_API_KEY=                     # Spoonacular API key
```

### Monitoring & Logging
```bash
LOG_LEVEL=info                           # Log level (debug/info/warn/error)
LOG_FORMAT=json                          # Log format (json/text)
ENABLE_METRICS=true                     # Enable metrics endpoint
METRICS_PORT=9090                        # Metrics port
```

## 🚀 Quick Setup

### Step 1: Generate Secrets

```bash
# Use the provided script
./scripts/generate-secrets.sh

# Or generate manually
openssl rand -base64 32  # For JWT_SECRET
openssl rand -base64 24  # For passwords
```

### Step 2: Create .env File

```bash
# Copy example file
cp .env.docker.example .env

# Edit with your values
nano .env  # or vim, code, etc.
```

### Step 3: Fill Required Values

Minimum required changes:
```bash
POSTGRES_PASSWORD=<generated-password>
REDIS_PASSWORD=<generated-password>
JWT_SECRET=<generated-secret-min-32-chars>
NEXT_PUBLIC_API_URL=<your-api-url>
```

### Step 4: Deploy

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🔒 Security Best Practices

### 1. Strong Passwords
- Minimum 16 characters
- Mix of uppercase, lowercase, numbers, symbols
- Use password generator: `openssl rand -base64 24`

### 2. JWT Secret
- Minimum 32 characters
- Random and unpredictable
- Never reuse across environments
- Rotate periodically

### 3. Environment Files
- **Never commit `.env` to version control**
- Add `.env` to `.gitignore`
- Use different secrets for dev/staging/production
- Store production secrets securely (secrets manager)

### 4. Network Security
- Don't expose database/redis ports publicly
- Use firewall rules
- Use VPN or private networks for database access
- Enable SSL/TLS for production

### 5. Regular Rotation
- Rotate passwords every 90 days
- Rotate JWT secrets (invalidates tokens, plan accordingly)
- Monitor for compromised credentials

## 📝 Example .env File

```bash
# =============================================================================
# REQUIRED CREDENTIALS - CHANGE THESE
# =============================================================================
POSTGRES_PASSWORD=MyStr0ng!DbP@ssw0rd2024
REDIS_PASSWORD=MyStr0ng!RedisP@ss2024
JWT_SECRET=K8j3mN9pQ2rT5vW8xY1zA4bC7dE0fG3hI6jK9lM2nO5pQ8rS1tU4vW7xY0zA

# =============================================================================
# REQUIRED CONFIGURATION
# =============================================================================
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# =============================================================================
# OPTIONAL - USE DEFAULTS OR CUSTOMIZE
# =============================================================================
ENVIRONMENT=production
NODE_ENV=production
BACKEND_PORT=8080
FRONTEND_PORT=3000
```

## 🧪 Testing Credentials

After deployment, test your setup:

```bash
# Test backend health
curl http://localhost:8080/health

# Test database connection (from backend container)
docker-compose -f docker-compose.prod.yml exec backend sh
# Inside container: ping postgres

# Test Redis connection
docker-compose -f docker-compose.prod.yml exec redis redis-cli -a $REDIS_PASSWORD ping
```

## ❓ Troubleshooting

### "Authentication failed" errors
- Check password matches in `.env` and docker-compose
- Verify no extra spaces or quotes
- Check password special characters are escaped if needed

### "Connection refused" errors
- Verify services are running: `docker-compose ps`
- Check ports aren't already in use
- Verify network connectivity between containers

### "Invalid JWT" errors
- Verify JWT_SECRET is set correctly
- Check secret hasn't changed (invalidates tokens)
- Ensure secret is at least 32 characters

## 📚 Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Security](https://www.postgresql.org/docs/current/security.html)
- [Redis Security](https://redis.io/topics/security)
- [JWT Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)
