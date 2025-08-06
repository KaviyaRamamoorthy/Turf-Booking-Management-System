# Turf Management System - Architecture Document

## 1. System Architecture Overview

### 1.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                    CLIENT LAYER                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   React.js SPA  │  │  Mobile Web     │  │  Admin Panel    │  │  PWA        │ │
│  │  (Customer UI)  │  │  (Responsive)   │  │  (Turf Owner)   │  │  (Offline)  │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────┘ │
│         │                       │                       │                       │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │                              API Gateway Layer                              │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │ │
│  │  │   Rate      │  │   Auth      │  │   CORS      │  │   Request/Response  │ │ │
│  │  │  Limiting   │  │  Middleware │  │   Handler   │  │     Logging         │ │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                  APPLICATION LAYER                              │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   Auth Service  │  │  Booking Service│  │  Turf Service   │  │  User       │ │
│  │  (JWT/OAuth2)   │  │  (Slot Mgmt)    │  │  (CRUD Ops)     │  │  Service    │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────┘ │
│         │                       │                       │                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │  Search Service │  │  Notification   │  │  Payment        │  │  Analytics  │ │
│  │  (Elasticsearch)│  │  Service        │  │  Service        │  │  Service    │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                   DATA LAYER                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │  PostgreSQL     │  │  Redis Cache    │  │  Elasticsearch  │  │  File       │ │
│  │  (Primary DB)   │  │  (Session/Slot) │  │  (Search Index) │  │  Storage    │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────┘ │
│         │                       │                       │                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │  Backup DB      │  │  CDN            │  │  Message Queue  │  │  Monitoring │ │
│  │  (Read Replica) │  │  (Static Assets)│  │  (RabbitMQ)     │  │  (Prometheus)│ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Technology Stack

**Frontend:**
- React.js 18+ with TypeScript
- Tailwind CSS for styling
- PrimeReact for UI components
- React Query for state management
- React Router for navigation
- Axios for API communication

**Backend:**
- java springboot
- Express.js framework
- PostgreSQL as primary database
- Redis for caching and sessions
- JWT for authentication
- bcrypt for password hashing

**Infrastructure:**
- Docker for containerization
- Nginx as reverse proxy
- AWS/DigitalOcean for hosting
- Elasticsearch for search functionality
- RabbitMQ for message queuing

## 2. Database Schema Design

### 2.1 Entity Relationship Diagram

```sql
-- Users Table (Authentication & Authorization)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role user_role NOT NULL DEFAULT 'customer',
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Roles Enum
CREATE TYPE user_role AS ENUM ('customer', 'admin');

-- Turfs Table (Core Business Entity)
CREATE TABLE turfs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    sport_type sport_category NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'India',
    postal_code VARCHAR(20),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    slot_interval INTEGER NOT NULL DEFAULT 60, -- in minutes
    price_per_slot DECIMAL(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    admin_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sport Categories Enum
CREATE TYPE sport_category AS ENUM ('football', 'cricket', 'badminton', 'volleyball', 'tennis', 'basketball');

-- Bookings Table (Core Transaction Entity)
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    turf_id UUID NOT NULL REFERENCES turfs(id),
    customer_id UUID NOT NULL REFERENCES users(id),
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status booking_status DEFAULT 'confirmed',
    payment_status payment_status DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Booking Status Enum
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');

-- Turf Images Table
CREATE TABLE turf_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    turf_id UUID NOT NULL REFERENCES turfs(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    alt_text VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Sessions Table (for JWT blacklisting)
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs Table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2.2 Indexes for Performance

```sql
-- Performance Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_turfs_admin_id ON turfs(admin_id);
CREATE INDEX idx_turfs_sport_type ON turfs(sport_type);
CREATE INDEX idx_turfs_city_state ON turfs(city, state);
CREATE INDEX idx_turfs_location ON turfs(latitude, longitude);
CREATE INDEX idx_turfs_active ON turfs(is_active) WHERE is_active = true;
CREATE INDEX idx_bookings_turf_date ON bookings(turf_id, booking_date);
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_date_range ON bookings(booking_date, start_time, end_time);
CREATE INDEX idx_audit_logs_user_action ON audit_logs(user_id, action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

## 3. API Endpoint Specifications

### 3.1 Authentication Endpoints

```typescript
// POST /api/auth/register
interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: 'customer' | 'admin';
}

// POST /api/auth/login
interface LoginRequest {
  email: string;
  password: string;
}

// POST /api/auth/logout
// POST /api/auth/refresh-token
// POST /api/auth/forgot-password
// POST /api/auth/reset-password
```

### 3.2 Turf Management Endpoints

```typescript
// GET /api/turfs - List all turfs with filtering
interface TurfListQuery {
  sportType?: string;
  city?: string;
  state?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'price' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

// GET /api/turfs/:id - Get turf details
// POST /api/turfs - Create new turf (Admin only)
interface CreateTurfRequest {
  name: string;
  description?: string;
  sportType: 'football' | 'cricket' | 'badminton' | 'volleyball' | 'tennis' | 'basketball';
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  slotInterval: 30 | 60 | 90 | 120; // minutes
  pricePerSlot: number;
}

// PUT /api/turfs/:id - Update turf (Admin only)
// DELETE /api/turfs/:id - Delete turf (Admin only)
// GET /api/turfs/:id/availability - Get availability for specific date
```

### 3.3 Booking Management Endpoints

```typescript
// GET /api/bookings - Get user's bookings
interface BookingListQuery {
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// POST /api/bookings - Create new booking
interface CreateBookingRequest {
  turfId: string;
  bookingDate: string; // YYYY-MM-DD format
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  notes?: string;
}

// GET /api/bookings/:id - Get booking details
// PUT /api/bookings/:id/cancel - Cancel booking
// GET /api/admin/bookings - Admin: Get all bookings for their turfs
```

### 3.4 User Management Endpoints

```typescript
// GET /api/users/profile - Get current user profile
// PUT /api/users/profile - Update user profile
// GET /api/admin/users - Admin: List all users (Admin only)
// PUT /api/admin/users/:id - Admin: Update user (Admin only)
```

### 3.5 Search Endpoints

```typescript
// GET /api/search/turfs - Advanced search
interface SearchQuery {
  q?: string; // Search term
  sportType?: string[];
  city?: string;
  state?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  date?: string;
  time?: string;
  page?: number;
  limit?: number;
}
```

## 4. Performance Optimization Plan

### 4.1 Database Optimization

**Indexing Strategy:**
- Composite indexes for common query patterns
- Partial indexes for active records
- Spatial indexes for location-based queries
- Full-text search indexes for turf names and descriptions

**Query Optimization:**
- Use connection pooling (pg-pool)
- Implement query result caching
- Optimize N+1 queries with eager loading
- Use database views for complex aggregations

**Database Scaling:**
- Read replicas for read-heavy operations
- Sharding strategy for future growth
- Database partitioning by date for bookings table

### 4.2 Caching Strategy

**Redis Caching Layers:**
```typescript
// Cache Keys Structure
const CACHE_KEYS = {
  // Turf data caching
  TURF_DETAILS: 'turf:details:{turfId}',
  TURF_LIST: 'turf:list:{filters}',
  TURF_AVAILABILITY: 'turf:availability:{turfId}:{date}',
  
  // User session caching
  USER_SESSION: 'session:{userId}',
  USER_PROFILE: 'user:profile:{userId}',
  
  // Booking caching
  BOOKING_DETAILS: 'booking:details:{bookingId}',
  USER_BOOKINGS: 'user:bookings:{userId}',
  
  // Search results caching
  SEARCH_RESULTS: 'search:results:{queryHash}',
  
  // API rate limiting
  RATE_LIMIT: 'rate:limit:{userId}:{endpoint}'
};

// Cache TTL Configuration
const CACHE_TTL = {
  TURF_DETAILS: 3600, // 1 hour
  TURF_LIST: 1800,    // 30 minutes
  TURF_AVAILABILITY: 300, // 5 minutes
  USER_SESSION: 86400, // 24 hours
  SEARCH_RESULTS: 900, // 15 minutes
  RATE_LIMIT: 60      // 1 minute
};
```

### 4.3 API Performance Optimization

**Response Optimization:**
- Implement pagination for all list endpoints
- Use field selection to reduce payload size
- Compress responses using gzip
- Implement conditional requests (ETags)

**Rate Limiting:**
```typescript
const RATE_LIMITS = {
  AUTH: {
    login: { window: '15m', max: 5 },
    register: { window: '1h', max: 3 }
  },
  BOOKING: {
    create: { window: '1m', max: 10 },
    list: { window: '1m', max: 100 }
  },
  TURF: {
    list: { window: '1m', max: 200 },
    details: { window: '1m', max: 300 }
  }
};
```

### 4.4 Frontend Performance

**Code Splitting:**
- Route-based code splitting
- Component lazy loading
- Vendor bundle optimization

**State Management:**
- React Query for server state
- Zustand for client state
- Optimistic updates for better UX

**Asset Optimization:**
- Image optimization and lazy loading
- CSS/JS minification
- CDN for static assets
- Service Worker for caching

### 4.5 Monitoring and Alerting

**Performance Metrics:**
- API response times (p95, p99)
- Database query performance
- Cache hit rates
- Error rates and types
- User session duration

**Infrastructure Monitoring:**
- CPU and memory usage
- Disk I/O and network latency
- Database connection pool status
- Redis memory usage

**Business Metrics:**
- Booking conversion rates
- User engagement metrics
- Turf utilization rates
- Revenue per user

### 4.6 Scalability Considerations

**Horizontal Scaling:**
- Load balancer for multiple API instances
- Database read replicas
- Redis cluster for high availability
- CDN for global content delivery

**Microservices Architecture (Future):**
- Separate services for auth, booking, turf management
- Event-driven architecture with message queues
- API gateway for service discovery
- Distributed tracing for debugging

**Auto-scaling:**
- Kubernetes for container orchestration
- Horizontal Pod Autoscaler (HPA)
- Database auto-scaling based on load
- Cache auto-scaling

## 5. Security Implementation

### 5.1 Authentication & Authorization
- JWT tokens with refresh mechanism
- Role-based access control (RBAC)
- Session management with Redis
- Password hashing with bcrypt

### 5.2 Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF tokens
- Rate limiting and DDoS protection

### 5.3 API Security
- HTTPS enforcement
- CORS configuration
- API key management
- Request/response logging
- Audit trails for sensitive operations

## 6. Deployment Architecture

### 6.1 Containerization
```dockerfile
# Multi-stage build for optimization
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

### 6.2 Environment Configuration
```typescript
// Environment variables structure
interface Environment {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  DATABASE_URL: string;
  REDIS_URL: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  ELASTICSEARCH_URL: string;
  RABBITMQ_URL: string;
  AWS_S3_BUCKET: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
}
```

This architecture provides a solid foundation for a scalable, performant turf management system that can handle 10,000+ users while maintaining security and reliability standards. 