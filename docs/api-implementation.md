# Turf Booking Platform – MVP API Implementation Plan

## 1. API Standards & Conventions

- **Base URL:** `/api/v1`
- **Authentication:** Bearer Token (JWT)
- **Content-Type:** `application/json`
- **URL Structure:**  
  `/api/v1/{feature}/{resource}[/{id}][/{action}]`

### Standard Response Format
```json
// Success
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { /* ... */ }
}
// Error
{
  "success": false,
  "message": "Error description",
  "errors": { /* ... */ }
}
// Paginated
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [ /* ... */ ],
  "total": 150,
  "page": 1,
  "limit": 20,
  "totalPages": 8
}
```

---

## 2. Database Schema (MVP Focus)

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role user_role NOT NULL DEFAULT 'customer',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE user_role AS ENUM ('customer', 'admin');
```

### Turfs Table
```sql
CREATE TABLE turfs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    sport_type sport_category NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'India',
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    slot_interval INTEGER NOT NULL DEFAULT 60,
    price_per_slot DECIMAL(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    admin_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE sport_category AS ENUM ('football', 'cricket', 'badminton', 'volleyball', 'tennis', 'basketball');
```

### Bookings Table
```sql
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    turf_id UUID NOT NULL REFERENCES turfs(id),
    customer_id UUID NOT NULL REFERENCES users(id),
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status booking_status DEFAULT 'confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
```

---

## 3. Feature Implementation Plan (MVP)

### 1. User Registration & Login

#### Register
- **POST** `/api/v1/auth/register`
- **Request:**  
  `{ email, password, firstName, lastName, phone?, role? }`
- **Response:**  
  Standard success/error, JWT token on success
- **AI Prompt:**  
  ```
  Implement user registration API. Validate email uniqueness, hash password, assign role (default: customer), and return JWT on success.
  ```

#### Login
- **POST** `/api/v1/auth/login`
- **Request:**  
  `{ email, password }`
- **Response:**  
  JWT token, user info
- **AI Prompt:**  
  ```
  Implement login API. Validate credentials, check user status, return JWT and user profile.
  ```

#### Get/Update Profile
- **GET** `/api/v1/users/profile`
- **PUT** `/api/v1/users/profile`
- **AI Prompt:**  
  ```
  Implement user profile fetch and update APIs. Require authentication. Allow update of name, phone.
  ```

---

### 2. Turf Creation & Listing

#### Create Turf (Admin Only)
- **POST** `/api/v1/turfs`
- **Request:**  
  `{ name, description, sportType, addressLine1, city, state, country, startTime, endTime, slotInterval, pricePerSlot }`
- **Response:**  
  Turf object
- **AI Prompt:**  
  ```
  Implement create turf API. Validate all fields, assign admin_id from JWT, insert into turfs.
  ```

#### List Turfs
- **GET** `/api/v1/turfs`
- **Query:**  
  `sportType, city, state, page, limit`
- **Response:**  
  Paginated list of turfs
- **AI Prompt:**  
  ```
  Implement turf listing API with filtering and pagination.
  ```

#### Turf Details
- **GET** `/api/v1/turfs/{id}`
- **Response:**  
  Turf details
- **AI Prompt:**  
  ```
  Implement turf detail API. Return all turf info.
  ```

---

### 3. Turf Booking

#### List My Bookings
- **GET** `/api/v1/bookings`
- **Query:**  
  `status, startDate, endDate, page, limit`
- **Response:**  
  Paginated list of bookings for authenticated user
- **AI Prompt:**  
  ```
  Implement booking list API for authenticated user. Join with turf info.
  ```

#### Create Booking
- **POST** `/api/v1/bookings`
- **Request:**  
  `{ turfId, bookingDate, startTime, endTime }`
- **Response:**  
  Booking confirmation
- **AI Prompt:**  
  ```
  Implement booking creation API. Validate slot availability, prevent double-booking, create booking, return confirmation.
  ```

#### Booking Details/Cancel
- **GET** `/api/v1/bookings/{id}`
- **PUT** `/api/v1/bookings/{id}/cancel`
- **AI Prompt:**  
  ```
  Implement booking detail and cancel APIs. Only booking owner or admin can cancel. Update status.
  ```

---

## 4. Implementation Order (MVP)

1. **User Registration, Login, Profile**
2. **Turf Creation, Listing, Details**
3. **Booking Creation, Listing, Details, Cancel**

---

## 5. Coding Standards & Feature-Driven Structure

- **Organize code by feature:**  
  `/features/auth`, `/features/turf`, `/features/booking`
- **Use schema validation** (e.g., Zod/Joi) for all endpoints
- **Consistent error handling** and response format
- **RBAC:** Only admins can create turfs; only owners can cancel bookings

---

**Save this as `@api-implementation.md` and use the AI prompts for each feature as you implement.**
If you need code templates, folder structure, or want to expand to more features, just ask!
