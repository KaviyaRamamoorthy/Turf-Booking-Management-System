import { apiPost, apiGet } from '../utils/apiInterceptor';
import { localStorageUtil } from '../utils/localStorage';
import type { ApiResponse } from '../types';

// Auth API interfaces
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    phone?: string;
  };
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
}

export interface RegisterResponse {
  message: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

class AuthService {
  // Login user
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      // API returns { success: boolean, message: string, data: string }
      const response = await apiPost<{ success: boolean; message: string; data: string }>('/auth/login', credentials);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Login failed - no token received');
      }

      const token = response.data;

      // Store token in localStorage immediately
      localStorageUtil.setToken(token);
      console.log('Token stored in localStorage:', token);
      
      // Get user data using the token
      const userData = await this.getCurrentUser(token);
      
      // Store user data in localStorage
      localStorageUtil.setUserData({
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
      });

      return {
        token,
        user: userData,
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Register user
  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response: ApiResponse<string> = await apiPost<ApiResponse<string>>('/auth/register', userData);
      
      if (!response.success) {
        throw new Error(response.message || 'Registration failed');
      }

      return {
        message: response.message || 'Registration successful',
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Get current user profile
  async getCurrentUser(token?: string): Promise<LoginResponse['user']> {
    try {
      // If no token provided, try to get from localStorage
      const authToken = token || localStorageUtil.getToken();
      
      if (!authToken) {
        throw new Error('No authentication token found');
      }

      // According to API docs, use /users/me endpoint
      const response = await apiGet<{ success: boolean; message: string; data: any }>('/users/me');
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to get user data');
      }

      const userData = response.data;
      
      // Map backend user data to frontend format
      return {
        id: userData.id,
        email: userData.email,
        name: userData.fullName || userData.email.split('@')[0],
        role: userData.role?.toLowerCase() || 'customer',
        phone: userData.phoneNumber,
      };
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  // Forgot password
  async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      const response: ApiResponse<string> = await apiPost<ApiResponse<string>>('/auth/forgot-password', { email });
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to send reset email');
      }

      return {
        message: response.message || 'Reset email sent successfully',
      };
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }

  // Reset password
  async resetPassword(resetData: ResetPasswordRequest): Promise<{ message: string }> {
    try {
      const response: ApiResponse<string> = await apiPost<ApiResponse<string>>('/auth/reset-password', resetData);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to reset password');
      }

      return {
        message: response.message || 'Password reset successfully',
      };
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  // Verify OTP
  async verifyOtp(email: string, otp: string): Promise<{ message: string }> {
    try {
      const response: ApiResponse<string> = await apiPost<ApiResponse<string>>('/auth/verify-otp', { email, otp });
      
      if (!response.success) {
        throw new Error(response.message || 'Invalid OTP');
      }

      return {
        message: response.message || 'OTP verified successfully',
      };
    } catch (error) {
      console.error('Verify OTP error:', error);
      throw error;
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      // Clear local storage
      localStorageUtil.clearAuthData();
      
      // Optionally make a logout API call to invalidate token on server
      // await apiPost('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API call fails, clear local storage
      localStorageUtil.clearAuthData();
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return localStorageUtil.isAuthenticated();
  }

  // Get stored token
  getToken(): string | null {
    return localStorageUtil.getToken();
  }

  // Get stored user data
  getUserData() {
    return localStorageUtil.getUserData();
  }
}

export const authService = new AuthService(); 