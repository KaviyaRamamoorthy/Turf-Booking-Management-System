# Turf Booking Platform API Endpoints

Below is a list of API endpoints as defined in the Postman collection, including method, URL, required headers, and sample request bodies where applicable.

---

## Auth APIs

### Register
- **Method:** POST
- **URL:** `http://localhost:8080/api/auth/register`
- **Headers:**
  - Content-Type: application/json
- **Body:**
```json
{
  "fullName": "Test User",
  "email": "testuser@example.com",
  "passwordHash": "password123",
  "phoneNumber": "1234567890",
  "dob": "1990-01-01",
  "doorNo": "1A",
  "street": "Main St",
  "locality": "Central",
  "location": "City"
}
```

### Verify OTP
- **Method:** POST
- **URL:** `http://localhost:8080/api/auth/verify-otp`
- **Headers:**
  - Content-Type: application/json
- **Body:**
```json
{
  "email": "testuser@example.com",
  "otp": "123456"
}
```

### Login
- **Method:** POST
- **URL:** `http://localhost:8080/api/auth/login`
- **Headers:**
  - Content-Type: application/json
- **Body:**
```json
{
  "email": "testuser@example.com",
  "password": "password123"
}
```

### Forgot Password
- **Method:** POST
- **URL:** `http://localhost:8080/api/auth/forgot-password`
- **Headers:**
  - Content-Type: application/json
- **Body:**
```json
{
  "email": "testuser@example.com"
}
```

### Reset Password
- **Method:** POST
- **URL:** `http://localhost:8080/api/auth/reset-password`
- **Headers:**
  - Content-Type: application/json
- **Body:**
```json
{
  "email": "testuser@example.com",
  "otp": "123456",
  "newPassword": "newpass123"
}
```

---

## User APIs

### Get Profile
- **Method:** GET
- **URL:** `http://localhost:8080/api/users/me`
- **Headers:**
  - Authorization: Bearer `{{jwt}}`

### Edit Profile
- **Method:** PUT
- **URL:** `http://localhost:8080/api/users/me`
- **Headers:**
  - Authorization: Bearer `{{jwt}}`
  - Content-Type: application/json
- **Body:**
```json
{
  "fullName": "Updated User",
  "phoneNumber": "9876543210",
  "dob": "1991-01-01",
  "doorNo": "2B",
  "street": "Second St",
  "locality": "North",
  "location": "New City"
}
```

---

## Category APIs

### List All Categories
- **Method:** GET
- **URL:** `http://localhost:8080/api/categories`

### Create Category (Admin)
- **Method:** POST
- **URL:** `http://localhost:8080/api/categories`
- **Headers:**
  - Authorization: Bearer `{{admin_jwt}}`
  - Content-Type: application/json
- **Body:**
```json
{
  "name": "Football",
  "description": "Football ground"
}
```

---

## Turf APIs

### Create Turf (Vendor)
- **Method:** POST
- **URL:** `http://localhost:8080/api/turfs`
- **Headers:**
  - Authorization: Bearer `{{vendor_jwt}}`
  - Content-Type: application/json
- **Body:**
```json
{
  "name": "Turf 1",
  "categoryId": "{{category_id}}",
  "location": "City Center",
  "description": "Best turf",
  "pricePerHour": 1000,
  "openTime": "06:00:00",
  "closeTime": "22:00:00"
}
```

---

*Note: Replace `{{jwt}}`, `{{admin_jwt}}`, `{{vendor_jwt}}`, and `{{category_id}}` with actual values as needed.* 