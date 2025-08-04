# Docker Deployment Guide for Turf Booking Management

This guide explains how to deploy the Turf Booking Management system using Docker and Docker Compose.

## Prerequisites

- Docker installed (version 20.10+)
- Docker Compose installed (version 2.0+)
- At least 2GB of available RAM
- At least 5GB of available disk space

## Quick Start

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd Turf-Booking-Management
```

### 2. Configure Environment

```bash
# Copy environment template
cp docker.env.example .env

# Edit environment variables
nano .env  # or use your preferred editor
```

**Required Environment Variables:**

```bash
# Database
POSTGRES_PASSWORD=your_secure_database_password

# Admin Account
ADMIN_PASSWORD=your_admin_password

# Email (for OTP functionality)
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_gmail_app_password

# Frontend URL (update with your actual domain)
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
```

### 3. Deploy with Docker Compose

#### Development Deployment

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### Production Deployment

```bash
# Build and start production services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down
```

## Services Overview

### PostgreSQL Database

- **Container**: `turf-postgres`
- **Port**: `5432`
- **Volume**: `postgres_data` (persistent storage)
- **Health Check**: Automatic PostgreSQL readiness check

### Spring Boot Backend

- **Container**: `turf-backend`
- **Port**: `8080`
- **Health Check**: `/actuator/health` endpoint
- **Logs**: Mounted to `./turf-core/logs/`

## Configuration Details

### Backend Configuration

The backend uses different Spring profiles:

- **Development**: `application.properties`
- **Docker**: `application-docker.properties`
- **Production**: `application-docker.properties` with `prod` profile

### Database Setup

The database is automatically initialized with:

- Database schema creation
- Initial admin user setup
- Sample data (if configured)

### Health Monitoring

Both services include health checks:

- **Database**: PostgreSQL connection test
- **Backend**: Spring Actuator health endpoint

## Environment Variables Reference

| Variable               | Description                 | Default          | Required |
| ---------------------- | --------------------------- | ---------------- | -------- |
| `POSTGRES_DB`          | Database name               | `turf_booking`   | No       |
| `POSTGRES_USER`        | Database user               | `postgres`       | No       |
| `POSTGRES_PASSWORD`    | Database password           | -                | **Yes**  |
| `ADMIN_EMAIL`          | Admin user email            | `admin@turf.com` | No       |
| `ADMIN_PASSWORD`       | Admin user password         | -                | **Yes**  |
| `MAIL_HOST`            | SMTP server                 | `smtp.gmail.com` | No       |
| `MAIL_PORT`            | SMTP port                   | `587`            | No       |
| `MAIL_USERNAME`        | Email username              | -                | **Yes**  |
| `MAIL_PASSWORD`        | Email password/app password | -                | **Yes**  |
| `CORS_ALLOWED_ORIGINS` | Allowed frontend URLs       | localhost URLs   | No       |

## Docker Commands Reference

### Basic Operations

```bash
# Build services
docker-compose build

# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f [service_name]

# Restart a service
docker-compose restart [service_name]
```

### Maintenance Commands

```bash
# Update and rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Access database
docker-compose exec postgres psql -U postgres -d turf_booking

# Access backend container
docker-compose exec backend bash

# View backend logs
docker-compose logs -f backend
```

### Data Management

```bash
# Backup database
docker-compose exec postgres pg_dump -U postgres turf_booking > backup.sql

# Restore database
docker-compose exec -T postgres psql -U postgres turf_booking < backup.sql

# Reset database (WARNING: destroys all data)
docker-compose down -v
docker volume prune
docker-compose up -d
```

## Production Considerations

### Security

1. **Change Default Passwords**: Update all default passwords
2. **Use HTTPS**: Configure SSL/TLS certificates
3. **Network Security**: Use Docker networks and firewall rules
4. **Regular Updates**: Keep Docker images updated

### Performance

1. **Resource Limits**: Configure memory and CPU limits
2. **Database Tuning**: Optimize PostgreSQL configuration
3. **JVM Tuning**: Adjust Java heap size for backend
4. **Monitoring**: Set up logging and monitoring

### Scaling

```bash
# Scale backend instances
docker-compose up -d --scale backend=3

# Use load balancer (nginx)
docker-compose --profile production up -d
```

## Troubleshooting

### Common Issues

#### Backend Won't Start

```bash
# Check backend logs
docker-compose logs backend

# Common issues:
# 1. Database not ready - wait for health check
# 2. Port already in use - check port 8080
# 3. Environment variables missing
```

#### Docker Build Fails - Maven Wrapper Not Found

If you see errors like "mvnw not found" or ".mvn not found":

```bash
# This is expected - the current Dockerfile uses system Maven instead
# The error occurs if you're using an old Dockerfile version

# Solution 1: Use the updated Dockerfile (recommended)
# The current Dockerfile uses system Maven, no wrapper needed

# Solution 2: Generate Maven wrapper (if you prefer wrapper)
cd turf-core
mvn wrapper:wrapper
# Then use Dockerfile.with-wrapper instead
```

#### Docker Build Fails - Image Not Found

If you see errors like "maven:X.X.X-openjdk-XX-slim: not found":

```bash
# This means the specific Maven/OpenJDK version combination isn't available
# The current Dockerfile uses maven:3.8-openjdk-17-slim which is stable and widely available

# To check available Maven images:
# https://hub.docker.com/_/maven/tags

# Common working combinations:
# maven:3.8-openjdk-17-slim (current)
# maven:3.8-openjdk-11-slim
# maven:latest (uses latest versions)

# Current setup uses Java 17 for both build and runtime
# pom.xml has been updated to match this version
```

#### Database Connection Issues

```bash
# Check database logs
docker-compose logs postgres

# Test database connection
docker-compose exec postgres psql -U postgres -d turf_booking -c "SELECT 1;"
```

#### Out of Memory

```bash
# Check container resource usage
docker stats

# Increase Docker memory allocation
# Update docker-compose.yml with resource limits
```

### Debugging Commands

```bash
# Check container status
docker-compose ps

# Check container resource usage
docker-compose top

# Inspect container configuration
docker-compose config

# View container logs with timestamps
docker-compose logs -t backend
```

## API Endpoints

After deployment, the API will be available at:

- **Health Check**: `http://localhost:8080/actuator/health`
- **API Base**: `http://localhost:8080/api/`
- **Swagger UI**: `http://localhost:8080/swagger-ui.html` (if enabled)

## Integration with Frontend

Update your frontend environment to point to the Docker backend:

```bash
# .env.production
VITE_API_URL=http://localhost:8080
```

For production deployment, use your actual domain:

```bash
# .env.production
VITE_API_URL=https://api.your-domain.com
```

## Monitoring and Logs

### Log Locations

- **Backend Logs**: `./turf-core/logs/turf-booking.log`
- **Container Logs**: `docker-compose logs [service]`

### Health Monitoring

- **Backend Health**: `http://localhost:8080/actuator/health`
- **Database Health**: Built into Docker health checks

## Support

For issues related to Docker deployment:

1. Check the logs: `docker-compose logs -f`
2. Verify environment variables in `.env`
3. Ensure all required ports are available
4. Check Docker and Docker Compose versions
