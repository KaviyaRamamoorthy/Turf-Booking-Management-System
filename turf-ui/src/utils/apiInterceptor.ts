import { localStorageUtil } from './localStorage';

// Base API configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'https://turf-booking-managements.onrender.com/api',
  TIMEOUT: 10000, // 10 seconds
};

// Request interceptor to add auth token
export const requestInterceptor = (config: RequestInit): RequestInit => {
  const token = localStorageUtil.getToken();
  
  // Add authorization header if token exists
  if (token) {
    config.headers = {
      ...config.headers,
      'Authorization': `Bearer ${token}`,
    };
    console.log('Adding Authorization header with token:', token.substring(0, 20) + '...');
  }

  // Add default headers
  config.headers = {
    'Content-Type': 'application/json',
    ...config.headers,
  };

  return config;
};

// Response interceptor to handle common response patterns
export const responseInterceptor = async (response: Response): Promise<Response> => {
  // Handle 401 Unauthorized - clear auth data and redirect to login
  if (response.status === 401) {
    localStorageUtil.clearAuthData();
    // You can add redirect logic here if needed
    window.location.href = '/auth/login';
    throw new Error('Unauthorized access. Please login again.');
  }

  // Handle 403 Forbidden
  if (response.status === 403) {
    throw new Error('Access forbidden. You do not have permission to perform this action.');
  }

  // Handle 500 Internal Server Error
  if (response.status >= 500) {
    throw new Error('Server error. Please try again later.');
  }

  return response;
};

// Generic API request function with interceptors
export const apiRequest = async <T>(
  url: string,
  options: RequestInit = {},
  isPublic = false
): Promise<T> => {
  const fullUrl = `${API_CONFIG.BASE_URL}${url}`;

  let requestOptions = { ...options };

  if (!isPublic) {
    // Apply request interceptor for non-public routes
    requestOptions = requestInterceptor(requestOptions);
  } else {
    // For public routes, just ensure default headers are present
    requestOptions.headers = {
      "Content-Type": "application/json",
      ...requestOptions.headers,
    };
  }

  try {
    console.log("Making API request to:", fullUrl);
    console.log("Request options:", requestOptions);
    const response = await fetch(fullUrl, requestOptions);
    
    // Apply response interceptor
    const interceptedResponse = await responseInterceptor(response);

    if (!interceptedResponse.ok) {
      // Try to parse error message from response
      let errorMessage = `HTTP error! status: ${interceptedResponse.status}`;
      try {
        const errorData = await interceptedResponse.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // If parsing fails, use default error message
      }
      throw new Error(errorMessage);
    }

    const data = await interceptedResponse.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Helper functions for common HTTP methods
export const apiGet = <T>(url: string): Promise<T> => {
  return apiRequest<T>(url, { method: 'GET' });
};

export const apiPost = <T>(
  url: string,
  data?: any,
  isPublic = false
): Promise<T> => {
  return apiRequest<T>(
    url,
    {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    },
    isPublic
  );
};

export const apiPut = <T>(url: string, data?: any): Promise<T> => {
  return apiRequest<T>(url, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
};

export const apiDelete = <T>(url: string): Promise<T> => {
  return apiRequest<T>(url, { method: 'DELETE' });
};

export const apiPatch = <T>(url: string, data?: any): Promise<T> => {
  return apiRequest<T>(url, {
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  });
}; 