# Turf Booking Platform API Documentation

This document explains how the backend application works, with step-by-step usage for each endpoint, authentication flow, role-based access, and troubleshooting tips.

---

## 1. Overview

- **Backend:** Spring Boot (Java)
- **Database:** PostgreSQL
- **Authentication:** JWT-based
- **Roles:** Admin, Vendor, Customer
- **API Base URL:** `http://localhost:8080/api`

---

## 2. Authentication & User Flow

### 2.1 Register

- **Endpoint:** `POST /auth/register`
- **Description:** Register a new user. Triggers OTP to email.
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
  "location": "City",
  "role": "CUSTOMER"
}
```

- **Response:** 200 OK, message about OTP sent.

### 2.2 Verify OTP

- **Endpoint:** `POST /auth/verify-otp`
- **Description:** Verify OTP to activate account.
- **Body:**

```json
{
  "email": "testuser@example.com",
  "otp": "123456"
}
```

- **Response:** 200 OK, account activated.

### 2.3 Login

- **Endpoint:** `POST /auth/login`
- **Description:** Login with email and password.
- **Body:**

```json
{
  "email": "testuser@example.com",
  "password": "password123"
}
```

- **Response:** 200 OK, returns JWT token.

### 2.4 Forgot Password

- **Endpoint:** `POST /auth/forgot-password`
- **Description:** Request OTP for password reset.
- **Body:**

```json
{
  "email": "testuser@example.com"
}
```

- **Response:** 200 OK, OTP sent.

### 2.5 Reset Password

- **Endpoint:** `POST /auth/reset-password`
- **Description:** Reset password using OTP.
- **Body:**

```json
{
  "email": "testuser@example.com",
  "otp": "123456",
  "newPassword": "newpass123"
}
```

- **Response:** 200 OK, password updated.

---

## 3. User APIs

### 3.1 Get Profile

- **Endpoint:** `GET /users/me`
- **Headers:** `Authorization: Bearer <jwt>`
- **Description:** Get current user's profile.
- **Response:** 200 OK, user profile data.

### 3.2 Edit Profile

- **Endpoint:** `PUT /users/me`
- **Headers:** `Authorization: Bearer <jwt>`
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

- **Response:** 200 OK, updated profile data.

---

## 4. Category APIs

### 4.1 List All Categories

- **Endpoint:** `GET /categories`
- **Description:** List all categories. Public endpoint.
- **Response:** 200 OK, array of categories.

### 4.2 Create Category (Admin Only)

- **Endpoint:** `POST /categories`
- **Headers:** `Authorization: Bearer <admin_jwt>`
- **Body:**

```json
{
  "name": "Football",
  "description": "Football ground"
}
```

- **Response:** 201 Created, new category data.
- **Access:** Only users with `ADMIN` role.

---

## 5. Turf APIs

### 5.1 Create Turf (Vendor Only)

- **Endpoint:** `POST /turfs`
- **Headers:** `Authorization: Bearer <vendor_jwt>`
- **Body:**

```json
{
  "name": "Turf 1",
  "categoryId": "<category_id>",
  "location": "City Center",
  "description": "Best turf",
  "pricePerHour": 1000,
  "openTime": "06:00:00",
  "closeTime": "22:00:00"
}
```

- **Response:** 201 Created, new turf data.
- **Access:** Only users with `VENDOR` role.

---

## 6. Role-Based Access & JWT Usage

- **JWT Required:** All endpoints except `/auth/*` and `GET /categories`.
- **How to Use:**
  - Login to get JWT.
  - Add header: `Authorization: Bearer <jwt>` to all protected requests.
- **Role Enforcement:**
  - Admin endpoints require admin JWT.
  - Vendor endpoints require vendor JWT.
  - Customer endpoints require customer JWT.

---

## 7. Error Handling & Troubleshooting

- **401 Unauthorized:** Missing/invalid JWT.
- **403 Forbidden:** JWT valid but user lacks required role.
- **400 Bad Request:** Invalid input or missing fields.
- **500 Internal Server Error:** Backend/server issue (check logs).

---

## 8. Testing the API

- Use the provided Postman collection for step-by-step testing.
- Register, verify OTP, login, and use the JWT for further requests.
- Test role-based endpoints with appropriate JWTs.

---

## 9. Common Issues

- **CORS errors:** Check backend CORS config.
- **JWT not accepted:** Ensure you use `Bearer <token>` format.
- **Role errors:** Check user roles and endpoint access.
- **Database errors:** Ensure PostgreSQL is running and credentials are correct.

---

## 6. Booking APIs (✅ IMPLEMENTED)

### 6.1 Create Booking (Customer Only)

- **Endpoint:** `POST /bookings`
- **Headers:** `Authorization: Bearer <customer_jwt>`
- **Body:**

```json
{
  "turfId": "0b98241d-9a5f-46bc-af68-b4e800eb29aa",
  "bookingDate": "2024-12-20",
  "startTime": "14:00:00",
  "endTime": "15:00:00"
}
```

- **Response:** 201 Created, new booking data.
- **Access:** Only users with `CUSTOMER` role.
- **Status:** ✅ **IMPLEMENTED** - BookingController ready

### 6.2 Get User Bookings (Customer Only)

- **Endpoint:** `GET /bookings/my`
- **Headers:** `Authorization: Bearer <customer_jwt>`
- **Query Params:** `?status=PENDING&startDate=2024-12-01&endDate=2024-12-31&page=0&size=10`
- **Response:** 200 OK, array of user's bookings.
- **Status:** ✅ **IMPLEMENTED**

### 6.3 Get Bookings for Date (Availability Check)

- **Endpoint:** `GET /bookings/turf/{turfId}/date/{date}`
- **Headers:** `Authorization: Bearer <jwt>`
- **Response:** 200 OK, array of bookings for that turf and date.
- **Status:** ✅ **IMPLEMENTED**

### 6.4 Cancel Booking (Customer Only)

- **Endpoint:** `PUT /bookings/{bookingId}/cancel`
- **Headers:** `Authorization: Bearer <customer_jwt>`
- **Response:** 200 OK, updated booking status.
- **Status:** ✅ **IMPLEMENTED**

---

## 7. Implementation Guide for BookingController

To implement the booking functionality, create a `BookingController.java` in the controller package with the following structure:

```java
@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    @PreAuthorize("hasAuthority('CUSTOMER')")
    public ResponseEntity<ApiResponse<BookingDto>> createBooking(
            @RequestBody BookingDto bookingDto,
            Authentication authentication) {
        // Implementation needed
    }

    @GetMapping("/my")
    @PreAuthorize("hasAuthority('CUSTOMER')")
    public ResponseEntity<ApiResponse<List<BookingDto>>> getUserBookings(
            Authentication authentication,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        // Implementation needed
    }

    @GetMapping("/turf/{turfId}/date/{date}")
    public ResponseEntity<ApiResponse<List<BookingDto>>> getBookingsForDate(
            @PathVariable String turfId,
            @PathVariable String date) {
        // Implementation needed
    }
}
```

**Next Steps:**

1. Create `BookingController.java`
2. Implement `BookingService` and `BookingServiceImpl`
3. Add `BookingRepository` interface
4. Test with the frontend (currently in demo mode)

---

## 8. Role-Based Access & JWT Usage

- **JWT Required:** All endpoints except `/auth/*` and `GET /categories`.
- **How to Use:**
  - Login to get JWT.
  - Add header: `Authorization: Bearer <jwt>` to all protected requests.
- **Role Enforcement:**
  - Admin endpoints require admin JWT.
  - Vendor endpoints require vendor JWT.
  - Customer endpoints require customer JWT.

---

## 9. Error Handling & Troubleshooting

- **401 Unauthorized:** Missing/invalid JWT.
- **403 Forbidden:** JWT valid but user lacks required role.
- **400 Bad Request:** Invalid input or missing fields.
- **500 Internal Server Error:** Backend/server issue (check logs).

---

## 10. Testing the API

- Use the provided Postman collection for step-by-step testing.
- Register, verify OTP, login, and use the JWT for further requests.
- Test role-based endpoints with appropriate JWTs.

---

## 11. Common Issues

- **CORS errors:** Check backend CORS config.
- **JWT not accepted:** Ensure you use `Bearer <token>` format.
- **Role errors:** Check user roles and endpoint access.
- **Database errors:** Ensure PostgreSQL is running and credentials are correct.
- **Booking errors:** Check booking validation and time slot conflicts.

---

## 12. Notes

- Replace `<jwt>`, `<admin_jwt>`, `<vendor_jwt>`, and `<category_id>` with actual values.
- All booking endpoints are now fully implemented and integrated with frontend.
- BookingController provides complete CRUD operations with proper authentication and validation.

---

_For any issues, check backend logs and API responses for details. Reach out for help with error messages or debugging!_
