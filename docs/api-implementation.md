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
- **Query Parameters:**
  - `sportType` (string): Filter by sport category
  - `city` (string): Filter by city
  - `state` (string): Filter by state
  - `isActive` (boolean): Filter by active status (default: true)
  - `sortBy` (string): Sort by name, price, rating, createdAt (default: createdAt)
  - `sortOrder` (string): asc, desc (default: desc)
  - `page` (number): Page number (default: 1)
  - `limit` (number): Items per page (default: 20, max: 50)

**Sample Request:**

```http
GET /api/v1/turfs?city=bangalore&sportType=football&sortBy=price&sortOrder=asc&page=1&limit=10
```

**Sample Response (Success):**

```json
{
  "success": true,
  "message": "Turfs retrieved successfully",
  "data": [
    {
      "id": "turf_001",
      "name": "Elite Football Arena",
      "description": "Premium football ground with artificial grass and professional floodlights. Perfect for competitive matches and training sessions.",
      "category": "football",
      "location": {
        "address": "123 Sports Complex, Koramangala 4th Block",
        "city": "Bangalore",
        "state": "Karnataka",
        "zipCode": "560034",
        "coordinates": {
          "latitude": 12.9352,
          "longitude": 77.6245
        }
      },
      "pricing": {
        "hourlyRate": 1500,
        "currency": "INR",
        "weekendSurcharge": 300,
        "peakHourSurcharge": 200
      },
      "amenities": [
        {
          "id": "amenity_1",
          "name": "Floodlights",
          "icon": "pi pi-sun",
          "description": "High-quality LED floodlights for evening matches"
        },
        {
          "id": "amenity_2",
          "name": "Parking",
          "icon": "pi pi-car",
          "description": "Free parking space for 50+ vehicles"
        },
        {
          "id": "amenity_3",
          "name": "Changing Rooms",
          "icon": "pi pi-home",
          "description": "Clean changing rooms with lockers"
        },
        {
          "id": "amenity_4",
          "name": "Artificial Grass",
          "icon": "pi pi-circle",
          "description": "FIFA approved artificial grass surface"
        }
      ],
      "images": [
        {
          "id": "img_1",
          "url": "https://example.com/turf1_main.jpg",
          "alt": "Elite Football Arena - Main View",
          "isPrimary": true
        },
        {
          "id": "img_2",
          "url": "https://example.com/turf1_night.jpg",
          "alt": "Elite Football Arena - Night View",
          "isPrimary": false
        }
      ],
      "operatingHours": {
        "monday": { "open": "06:00", "close": "22:00", "isOpen": true },
        "tuesday": { "open": "06:00", "close": "22:00", "isOpen": true },
        "wednesday": { "open": "06:00", "close": "22:00", "isOpen": true },
        "thursday": { "open": "06:00", "close": "22:00", "isOpen": true },
        "friday": { "open": "06:00", "close": "22:00", "isOpen": true },
        "saturday": { "open": "06:00", "close": "23:00", "isOpen": true },
        "sunday": { "open": "06:00", "close": "23:00", "isOpen": true }
      },
      "slotDuration": 60,
      "advanceBookingDays": 30,
      "cancellationPolicy": {
        "allowCancellation": true,
        "freeCancel": 24,
        "partialRefundHours": 12,
        "noRefundHours": 2
      },
      "rating": 4.5,
      "reviewCount": 128,
      "totalBookings": 1256,
      "vendorId": "vendor_001",
      "vendorName": "Sports Arena Pvt Ltd",
      "vendorPhone": "+91 9876543210",
      "vendorEmail": "contact@sportsarena.com",
      "isActive": true,
      "isFeatured": true,
      "createdAt": "2024-01-10T08:00:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    },
    {
      "id": "turf_002",
      "name": "Green Valley Football Club",
      "description": "Natural grass football field in a serene environment. Ideal for weekend matches and football training academies.",
      "category": "football",
      "location": {
        "address": "456 Garden Road, Whitefield Tech Park",
        "city": "Bangalore",
        "state": "Karnataka",
        "zipCode": "560066",
        "coordinates": {
          "latitude": 12.9698,
          "longitude": 77.75
        }
      },
      "pricing": {
        "hourlyRate": 1200,
        "currency": "INR",
        "weekendSurcharge": 200,
        "peakHourSurcharge": 150
      },
      "amenities": [
        {
          "id": "amenity_5",
          "name": "Natural Grass",
          "icon": "pi pi-circle",
          "description": "Well-maintained natural grass field"
        },
        {
          "id": "amenity_6",
          "name": "Changing Rooms",
          "icon": "pi pi-home",
          "description": "Basic changing rooms with benches"
        },
        {
          "id": "amenity_7",
          "name": "Water Cooler",
          "icon": "pi pi-chart-bar",
          "description": "Free drinking water facility"
        }
      ],
      "images": [
        {
          "id": "img_3",
          "url": "https://example.com/turf2_main.jpg",
          "alt": "Green Valley Football Club - Main View",
          "isPrimary": true
        }
      ],
      "operatingHours": {
        "monday": { "open": "06:00", "close": "21:00", "isOpen": true },
        "tuesday": { "open": "06:00", "close": "21:00", "isOpen": true },
        "wednesday": { "open": "06:00", "close": "21:00", "isOpen": true },
        "thursday": { "open": "06:00", "close": "21:00", "isOpen": true },
        "friday": { "open": "06:00", "close": "21:00", "isOpen": true },
        "saturday": { "open": "06:00", "close": "22:00", "isOpen": true },
        "sunday": { "open": "06:00", "close": "22:00", "isOpen": true }
      },
      "slotDuration": 60,
      "advanceBookingDays": 15,
      "cancellationPolicy": {
        "allowCancellation": true,
        "freeCancel": 48,
        "partialRefundHours": 24,
        "noRefundHours": 6
      },
      "rating": 4.2,
      "reviewCount": 95,
      "totalBookings": 876,
      "vendorId": "vendor_002",
      "vendorName": "Green Valley Sports",
      "vendorPhone": "+91 9876543211",
      "vendorEmail": "info@greenvalleysports.com",
      "isActive": true,
      "isFeatured": false,
      "createdAt": "2024-01-08T09:15:00Z",
      "updatedAt": "2024-01-12T14:20:00Z"
    },
    {
      "id": "turf_003",
      "name": "Champions Cricket Ground",
      "description": "Professional cricket ground with proper pitch and boundary markings. Suitable for T20 matches and cricket tournaments.",
      "category": "cricket",
      "location": {
        "address": "789 Stadium Road, Indiranagar",
        "city": "Bangalore",
        "state": "Karnataka",
        "zipCode": "560038",
        "coordinates": {
          "latitude": 12.9716,
          "longitude": 77.6412
        }
      },
      "pricing": {
        "hourlyRate": 2000,
        "currency": "INR",
        "weekendSurcharge": 400,
        "peakHourSurcharge": 300
      },
      "amenities": [
        {
          "id": "amenity_8",
          "name": "Professional Pitch",
          "icon": "pi pi-circle",
          "description": "Professionally maintained cricket pitch"
        },
        {
          "id": "amenity_9",
          "name": "Boundary Markings",
          "icon": "pi pi-map",
          "description": "Proper boundary markings and sight screens"
        },
        {
          "id": "amenity_10",
          "name": "Pavilion",
          "icon": "pi pi-building",
          "description": "Covered pavilion for spectators"
        }
      ],
      "images": [
        {
          "id": "img_4",
          "url": "https://example.com/turf3_main.jpg",
          "alt": "Champions Cricket Ground - Main View",
          "isPrimary": true
        }
      ],
      "operatingHours": {
        "monday": { "open": "06:00", "close": "20:00", "isOpen": true },
        "tuesday": { "open": "06:00", "close": "20:00", "isOpen": true },
        "wednesday": { "open": "06:00", "close": "20:00", "isOpen": true },
        "thursday": { "open": "06:00", "close": "20:00", "isOpen": true },
        "friday": { "open": "06:00", "close": "20:00", "isOpen": true },
        "saturday": { "open": "06:00", "close": "21:00", "isOpen": true },
        "sunday": { "open": "06:00", "close": "21:00", "isOpen": true }
      },
      "slotDuration": 180,
      "advanceBookingDays": 45,
      "cancellationPolicy": {
        "allowCancellation": true,
        "freeCancel": 72,
        "partialRefundHours": 48,
        "noRefundHours": 12
      },
      "rating": 4.7,
      "reviewCount": 203,
      "totalBookings": 567,
      "vendorId": "vendor_003",
      "vendorName": "Champions Sports Complex",
      "vendorPhone": "+91 9876543212",
      "vendorEmail": "bookings@championsports.com",
      "isActive": true,
      "isFeatured": true,
      "createdAt": "2024-01-05T07:30:00Z",
      "updatedAt": "2024-01-18T16:45:00Z"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  },
  "filters": {
    "appliedFilters": {
      "city": "bangalore",
      "sportType": "football",
      "sortBy": "price",
      "sortOrder": "asc"
    },
    "availableFilters": {
      "sportTypes": [
        "football",
        "cricket",
        "tennis",
        "basketball",
        "volleyball"
      ],
      "cities": ["Bangalore", "Mumbai", "Delhi", "Chennai", "Pune"],
      "states": ["Karnataka", "Maharashtra", "Delhi", "Tamil Nadu"],
      "priceRange": {
        "min": 500,
        "max": 3000
      }
    }
  }
}
```

**Empty Response:**

```json
{
  "success": true,
  "message": "No turfs found matching your criteria",
  "data": [],
  "pagination": {
    "total": 0,
    "page": 1,
    "limit": 10,
    "totalPages": 0,
    "hasNext": false,
    "hasPrev": false
  },
  "filters": {
    "appliedFilters": {
      "city": "pune",
      "sportType": "tennis"
    },
    "suggestions": [
      "Try removing some filters to see more results",
      "Check nearby cities: Mumbai, Nashik",
      "Browse other sports categories available"
    ]
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Invalid request parameters",
  "errors": {
    "limit": "Limit must be between 1 and 50",
    "sortBy": "Invalid sort field. Allowed values: name, price, rating, createdAt",
    "page": "Page must be a positive integer"
  }
}
```

- **AI Prompt:**
  ```
  Implement turf listing API with comprehensive filtering, sorting, and pagination. Include detailed turf information with amenities, pricing, operating hours, and vendor details.
  ```

#### Turf Details

- **GET** `/api/v1/turfs/{id}`
- **Response:**  
  Turf details
- **AI Prompt:**
  ```
  Implement turf detail API. Return all turf info.
  ```

#### Search Turfs

- **GET** `/api/v1/turfs/search`
- **Query Parameters:**
  - `q` (string): Search query for name, description, location
  - `category` (string): Filter by sport category
  - `city` (string): Filter by city
  - `state` (string): Filter by state
  - `minPrice` (number): Minimum price per hour
  - `maxPrice` (number): Maximum price per hour
  - `sortBy` (string): Sort by price, rating, name, newest
  - `sortOrder` (string): asc, desc
  - `page` (number): Page number (default: 1)
  - `limit` (number): Items per page (default: 20)

**Sample Request:**

```http
GET /api/v1/turfs/search?q=football&city=bangalore&sortBy=price&sortOrder=asc&page=1&limit=10
```

**Sample Response:**

```json
{
  "success": true,
  "message": "Turfs retrieved successfully",
  "data": [
    {
      "id": "turf_001",
      "name": "Elite Football Arena",
      "description": "Premium football ground with artificial grass and floodlights",
      "category": "football",
      "location": {
        "address": "123 Sports Complex, Koramangala",
        "city": "Bangalore",
        "state": "Karnataka",
        "zipCode": "560034",
        "coordinates": {
          "lat": 12.9352,
          "lng": 77.6245
        }
      },
      "pricing": {
        "hourlyRate": 1500,
        "currency": "INR"
      },
      "amenities": [
        {
          "id": "amenity_1",
          "name": "Floodlights",
          "icon": "pi pi-sun"
        },
        {
          "id": "amenity_2",
          "name": "Parking",
          "icon": "pi pi-car"
        }
      ],
      "images": [
        "https://example.com/turf1_1.jpg",
        "https://example.com/turf1_2.jpg"
      ],
      "availability": [
        {
          "dayOfWeek": 1,
          "isOpen": true,
          "slots": [
            {
              "startTime": "06:00",
              "endTime": "07:00",
              "isAvailable": true,
              "price": 1500
            },
            {
              "startTime": "07:00",
              "endTime": "08:00",
              "isAvailable": false,
              "price": 1500
            }
          ]
        }
      ],
      "rating": 4.5,
      "reviewCount": 128,
      "vendorId": "vendor_001",
      "createdAt": "2024-01-10T08:00:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    },
    {
      "id": "turf_002",
      "name": "Green Valley Football Club",
      "description": "Natural grass football field in the heart of the city",
      "category": "football",
      "location": {
        "address": "456 Garden Road, Whitefield",
        "city": "Bangalore",
        "state": "Karnataka",
        "zipCode": "560066",
        "coordinates": {
          "lat": 12.9698,
          "lng": 77.75
        }
      },
      "pricing": {
        "hourlyRate": 1200,
        "currency": "INR"
      },
      "amenities": [
        {
          "id": "amenity_3",
          "name": "Natural Grass",
          "icon": "pi pi-circle"
        },
        {
          "id": "amenity_4",
          "name": "Changing Rooms",
          "icon": "pi pi-home"
        }
      ],
      "images": ["https://example.com/turf2_1.jpg"],
      "availability": [
        {
          "dayOfWeek": 1,
          "isOpen": true,
          "slots": [
            {
              "startTime": "06:00",
              "endTime": "07:00",
              "isAvailable": true,
              "price": 1200
            }
          ]
        }
      ],
      "rating": 4.2,
      "reviewCount": 95,
      "vendorId": "vendor_002",
      "createdAt": "2024-01-08T09:15:00Z",
      "updatedAt": "2024-01-12T14:20:00Z"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  },
  "filters": {
    "appliedFilters": {
      "q": "football",
      "city": "bangalore",
      "sortBy": "price",
      "sortOrder": "asc"
    },
    "availableFilters": {
      "categories": [
        "football",
        "cricket",
        "tennis",
        "basketball",
        "volleyball"
      ],
      "cities": ["Bangalore", "Mumbai", "Delhi", "Chennai"],
      "priceRange": {
        "min": 500,
        "max": 3000
      }
    }
  }
}
```

**Empty Search Response:**

```json
{
  "success": true,
  "message": "No turfs found matching your criteria",
  "data": [],
  "pagination": {
    "total": 0,
    "page": 1,
    "limit": 10,
    "totalPages": 0,
    "hasNext": false,
    "hasPrev": false
  },
  "filters": {
    "appliedFilters": {
      "q": "cricket",
      "city": "pune"
    },
    "suggestions": [
      "Try searching in nearby cities: Mumbai, Nashik",
      "Remove filters to see all available turfs",
      "Search for other sports: football, tennis, basketball"
    ]
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Invalid search parameters",
  "errors": {
    "sortBy": "Invalid sort field. Allowed values: price, rating, name, newest",
    "limit": "Limit must be between 1 and 50"
  }
}
```

- **AI Prompt:**
  ```
  Implement turf search API with full-text search, filtering by category/location/price, sorting options, and pagination. Include search suggestions for empty results.
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
- **Authentication:** Required (Bearer Token)
- **Request Body:**
  ```json
  {
    "turfId": "string (required)",
    "bookingDate": "string (required, YYYY-MM-DD format)",
    "startTime": "string (required, HH:MM format)",
    "endTime": "string (required, HH:MM format)"
  }
  ```

**Sample Request:**

```http
POST /api/v1/bookings
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "turfId": "turf_001",
  "bookingDate": "2024-01-25",
  "startTime": "18:00",
  "endTime": "19:00"
}
```

**Sample Response (Success):**

```json
{
  "success": true,
  "message": "Booking confirmed successfully",
  "data": {
    "id": "booking_12345",
    "turfId": "turf_001",
    "customerId": "user_789",
    "bookingDate": "2024-01-25",
    "startTime": "18:00",
    "endTime": "19:00",
    "duration": 60,
    "status": "confirmed",
    "totalAmount": 1500,
    "currency": "INR",
    "paymentStatus": "pending",
    "paymentMethod": null,
    "transactionId": null,
    "turf": {
      "id": "turf_001",
      "name": "Elite Football Arena",
      "category": "football",
      "location": {
        "address": "123 Sports Complex, Koramangala 4th Block",
        "city": "Bangalore",
        "state": "Karnataka",
        "zipCode": "560034"
      },
      "pricing": {
        "hourlyRate": 1500,
        "currency": "INR"
      },
      "vendorName": "Sports Arena Pvt Ltd",
      "vendorPhone": "+91 9876543210"
    },
    "customer": {
      "id": "user_789",
      "firstName": "Rajesh",
      "lastName": "Kumar",
      "email": "rajesh.kumar@example.com",
      "phone": "+91 9876543210"
    },
    "bookingReference": "TBA001250124001",
    "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "cancellationPolicy": {
      "allowCancellation": true,
      "freeCancel": 24,
      "partialRefundHours": 12,
      "noRefundHours": 2
    },
    "instructions": [
      "Please arrive 10 minutes before your scheduled time",
      "Bring your own sports equipment",
      "Follow COVID-19 safety protocols"
    ],
    "createdAt": "2024-01-20T10:30:00Z",
    "updatedAt": "2024-01-20T10:30:00Z"
  }
}
```

**Sample Response (Slot Already Booked):**

```json
{
  "success": false,
  "message": "Selected time slot is no longer available",
  "errors": {
    "slot": "Time slot 18:00-19:00 on 2024-01-25 is already booked"
  },
  "data": {
    "availableSlots": [
      {
        "startTime": "17:00",
        "endTime": "18:00",
        "price": 1500,
        "available": true
      },
      {
        "startTime": "19:00",
        "endTime": "20:00",
        "price": 1500,
        "available": true
      },
      {
        "startTime": "20:00",
        "endTime": "21:00",
        "price": 1500,
        "available": true
      }
    ]
  }
}
```

**Sample Response (Turf Not Available):**

```json
{
  "success": false,
  "message": "Turf is not available for booking",
  "errors": {
    "turf": "Turf is temporarily closed for maintenance"
  },
  "data": {
    "alternativeTurfs": [
      {
        "id": "turf_002",
        "name": "Green Valley Football Club",
        "distance": "2.5 km",
        "pricing": {
          "hourlyRate": 1200,
          "currency": "INR"
        }
      }
    ]
  }
}
```

**Sample Response (Past Date):**

```json
{
  "success": false,
  "message": "Invalid booking date",
  "errors": {
    "bookingDate": "Cannot book for past dates",
    "startTime": "Start time must be in the future"
  }
}
```

**Sample Response (Invalid Time Range):**

```json
{
  "success": false,
  "message": "Invalid time range",
  "errors": {
    "startTime": "Start time must be during operating hours (06:00-22:00)",
    "endTime": "End time must be after start time",
    "duration": "Minimum booking duration is 60 minutes"
  }
}
```

**Sample Response (User Not Authenticated):**

```json
{
  "success": false,
  "message": "Authentication required",
  "errors": {
    "auth": "Please login to make a booking"
  }
}
```

**Sample Response (Insufficient Balance - if payment required):**

```json
{
  "success": false,
  "message": "Payment processing failed",
  "errors": {
    "payment": "Insufficient balance in wallet",
    "required": "₹1,500",
    "available": "₹800"
  },
  "data": {
    "paymentOptions": [
      {
        "method": "card",
        "label": "Credit/Debit Card",
        "processingFee": 30
      },
      {
        "method": "upi",
        "label": "UPI Payment",
        "processingFee": 0
      },
      {
        "method": "netbanking",
        "label": "Net Banking",
        "processingFee": 20
      }
    ]
  }
}
```

**Validation Rules:**

- `turfId`: Must be a valid existing turf ID
- `bookingDate`: Must be today or future date (max 30 days advance)
- `startTime`: Must be within turf operating hours
- `endTime`: Must be after startTime, minimum 60 minutes duration
- User must be authenticated
- Time slot must be available
- Turf must be active and available

**Business Logic:**

1. Validate request parameters
2. Check user authentication
3. Verify turf exists and is active
4. Check slot availability
5. Calculate total amount (including surcharges)
6. Create booking record
7. Generate booking reference and QR code
8. Send confirmation email/SMS
9. Return booking details

- **AI Prompt:**
  ```
  Implement booking creation API with comprehensive validation, slot availability checking, payment processing, and detailed response with booking confirmation details.
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
