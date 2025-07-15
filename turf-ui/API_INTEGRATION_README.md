# API Integration Documentation

This document describes the API integration setup for the Turf Booking Management frontend with the Spring Boot backend.

## Overview

The frontend has been integrated with the backend API running on `http://localhost:8080` with the `/api` prefix. The integration includes:

1. **Authentication Service** - Handles login, registration, and user profile management
2. **API Interceptor** - Automatically adds authentication tokens to requests and handles responses
3. **LocalStorage Utility** - Manages token and user data storage
4. **Booking Service** - Handles booking-related API calls

## Files Created/Modified

### New Files
- `src/utils/localStorage.ts` - LocalStorage utility for token management
- `src/utils/apiInterceptor.ts` - Request/response interceptor with authentication
- `src/services/authService.ts` - Authentication service for API calls
- `API_INTEGRATION_README.md` - This documentation

### Modified Files
- `src/store/slices/authSlice.ts` - Updated to use real API instead of mock data
- `src/services/bookingService.ts` - Updated to use API interceptor
- `src/pages/auth/LoginPage.tsx` - Removed role parameter from login

## API Endpoints Used

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get current user profile
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/verify-otp` - Verify OTP

### User Management
- `GET /api/users/me` - Get current user profile (alternative endpoint)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/{id}` - Get booking details
- `PUT /api/bookings/{id}/cancel` - Cancel booking

## Usage

### Login Flow
1. User enters email and password
2. Frontend calls `POST /api/auth/login`
3. Backend returns JWT token
4. Frontend stores token in localStorage
5. Frontend calls `GET /api/auth/profile` to get user data
6. User data is stored in Redux state and localStorage

### API Calls with Authentication
All API calls automatically include the JWT token in the Authorization header:
```
Authorization: Bearer <jwt-token>
```

### Error Handling
- 401 Unauthorized: Automatically clears localStorage and redirects to login
- 403 Forbidden: Shows access denied message
- 500+ Server errors: Shows generic server error message

## Configuration

### Backend URL
The API base URL is configured in `src/utils/apiInterceptor.ts`:
```typescript
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080/api',
  TIMEOUT: 10000, // 10 seconds
};
```

### CORS Configuration
The backend is configured to allow requests from `http://localhost:5173` (Vite dev server).

## Testing

To test the integration:

1. Start the backend server on port 8080
2. Start the frontend development server
3. Navigate to the login page
4. Use valid credentials to test login
5. Check browser localStorage for stored token
6. Test protected routes and API calls

## Security Features

- JWT tokens are automatically added to all authenticated requests
- Tokens are stored securely in localStorage
- Automatic token cleanup on logout or 401 errors
- CORS protection on backend
- Role-based access control

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend CORS configuration allows frontend origin
2. **401 Errors**: Check if token is valid and not expired
3. **Network Errors**: Verify backend server is running on correct port
4. **Token Storage Issues**: Check browser localStorage permissions

### Debug Steps

1. Check browser Network tab for API calls
2. Verify token in localStorage
3. Check browser console for errors
4. Verify backend logs for authentication issues 