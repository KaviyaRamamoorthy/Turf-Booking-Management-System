import { apiPost, apiGet, apiPut } from "../utils/apiInterceptor";
import { localStorageUtil } from "../utils/localStorage";
import type {
  ApiResponse,
  User,
  AuthRequest,
  OtpRequest,
  UserRole,
} from "../types";

// Auth API interfaces - aligned with backend
export interface LoginRequest extends AuthRequest {
  // email and password from AuthRequest
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  fullName: string; // matches backend UserDto
  email: string;
  phoneNumber: string; // matches backend UserDto
  passwordHash: string; // matches backend UserDto field name
  role?: string;
  // Optional address fields from backend UserDto

}

export interface RegisterResponse {
  message: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOtpRequest extends OtpRequest {
  // email and otp from OtpRequest
}

export interface ResetPasswordRequest extends OtpRequest {
  // email, otp, and newPassword from OtpRequest
}

class AuthService {
  // Login user - matches backend /api/auth/login
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      // Backend returns ApiResponse<string> where data is the JWT token
      const response = await apiPost<ApiResponse<string>>("/auth/login", {
        email: credentials.email,
        password: credentials.password,
      });

      if (!response.success || !response.data) {
        throw new Error(response.message || "Login failed - no token received");
      }

      const token = response.data;

      // Store token in localStorage immediately
      localStorageUtil.setToken(token);
      console.log("Token stored in localStorage:", token);

      // Get user data using the token
      const userData = await this.getCurrentUser();

      console.log("Login - user data after getCurrentUser:", userData);

      // Store user data in localStorage with backward compatibility
      localStorageUtil.setUserData({
        id: userData.id,
        email: userData.email,
        name: userData.fullName, // backward compatibility
        fullName: userData.fullName,
        role: userData.role, // already converted to lowercase by getCurrentUser
        phoneNumber: userData.phoneNumber,
        phone: userData.phoneNumber, // backward compatibility
      });

      return {
        token,
        user: userData,
      };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  // Send OTP for registration
  async sendOtp(email: string): Promise<{ message: string }> {
    try {
      const response = await apiPost<ApiResponse<string>>(
        "/auth/send-otp",
        {
          email,
        },
        true
      ); // Mark this as a public route

      if (!response.success) {
        throw new Error(response.message || "Failed to send OTP");
      }

      return {
        message: response.message || "OTP sent successfully",
      };
    } catch (error) {
      console.error("Send OTP error:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  // Register user - matches backend /api/auth/register
  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await apiPost<ApiResponse<string>>(
        "/auth/register",
        userData,
        true
      ); // Mark this as a public route

      if (!response.success) {
        throw new Error(response.message || "Registration failed");
      }

      return {
        message:
          response.message ||
          "Registration successful. You can now login with your credentials.",
      };
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  // Verify OTP - matches backend /api/auth/verify-otp
  async verifyOtp(otpData: VerifyOtpRequest): Promise<{ message: string }> {
    try {
      const response = await apiPost<ApiResponse<string>>(
        "/auth/verify-otp",
        {
          email: otpData.email,
          otp: otpData.otp,
        },
        true
      ); // Mark this as a public route

      if (!response.success) {
        throw new Error(response.message || "OTP verification failed");
      }

      return {
        message: response.message || "OTP verified successfully",
      };
    } catch (error) {
      console.error("OTP verification error:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  // Forgot password - matches backend /api/auth/forgot-password
  async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      const response = await apiPost<ApiResponse<string>>(
        "/auth/forgot-password",
        { email }
      );

      if (!response.success) {
        throw new Error(response.message || "Failed to send reset email");
      }

      return {
        message: response.message || "Reset email sent successfully",
      };
    } catch (error) {
      console.error("Forgot password error:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  // Reset password - matches backend /api/auth/reset-password
  async resetPassword(
    resetData: ResetPasswordRequest
  ): Promise<{ message: string }> {
    try {
      const response = await apiPost<ApiResponse<string>>(
        "/auth/reset-password",
        {
          email: resetData.email,
          otp: resetData.otp,
          newPassword: resetData.newPassword,
        }
      );

      if (!response.success) {
        throw new Error(response.message || "Password reset failed");
      }

      return {
        message: response.message || "Password reset successful",
      };
    } catch (error) {
      console.error("Reset password error:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  // Get current user - matches backend /api/users/me
  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiGet<ApiResponse<User>>("/users/me");

      console.log("getCurrentUser API response:", response);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to get user data");
      }

      // Add backward compatibility fields and convert role to lowercase
      const user = response.data;
      console.log("Raw user data from backend:", user);

      user.name = user.fullName; // for backward compatibility
      user.phone = user.phoneNumber; // for backward compatibility

      // Role is now directly available as a string field from backend

      // Convert to lowercase and ensure we have a valid role
      const roleString = user.role?.toLowerCase() || "customer";
      const validRoles: UserRole[] = ["admin", "customer", "vendor"];
      user.role = validRoles.includes(roleString as UserRole)
        ? (roleString as UserRole)
        : "customer";

      user.preferences = user.preferences || {
        // Add default preferences
        theme: "light",
        language: "en",
        notifications: true,
      };

      console.log("Processed user data with role:", user);
      return user;
    } catch (error) {
      console.error("Get current user error:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  // Update user profile - matches backend /api/users/me
  async updateProfile(profileData: Partial<User>): Promise<User> {
    try {
      // Remove computed fields before sending to backend
      const updateData = { ...profileData };
      delete updateData.name; // computed field
      delete updateData.phone; // computed field
      // role field is handled directly by backend
      delete updateData.id; // backend determines this from token

      const response = await apiPut<ApiResponse<User>>(
        "/users/me",
        updateData
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to update profile");
      }

      // Add backward compatibility fields
      const user = response.data;
      user.name = user.fullName;
      user.phone = user.phoneNumber;

      // Update localStorage
      localStorageUtil.setUserData({
        id: user.id,
        email: user.email,
        name: user.fullName,
        fullName: user.fullName,
        role: user.role || "",
        phoneNumber: user.phoneNumber,
        phone: user.phoneNumber,
      });

      return user;
    } catch (error) {
      console.error("Update profile error:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  // Logout user
  logout(): void {
    localStorageUtil.clearAuthData();
    console.log("User logged out and localStorage cleared");
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorageUtil.getToken();
    return !!token;
  }

  // Get stored user data
  getStoredUserData(): User | null {
    const storedData = localStorageUtil.getUserData();
    if (!storedData) return null;

    // Convert StoredUserData to User with proper mapping
    return {
      id: storedData.id,
      email: storedData.email,
      fullName: storedData.fullName || storedData.name || "",
      phoneNumber: storedData.phoneNumber || storedData.phone || "",
      role: storedData.role as UserRole,
      
      isVerified: storedData.isVerified || false,
      isActive: storedData.isActive || false,
      vendorApprovalStatus: storedData.vendorApprovalStatus,
      // Backward compatibility fields
      name: storedData.fullName || storedData.name,
      phone: storedData.phoneNumber || storedData.phone,
      // Default preferences for frontend
      preferences: {
        theme: "light",
        language: "en",
        notifications: true,
      },
    };
  }

  // Get stored token
  getStoredToken(): string | null {
    return localStorageUtil.getToken();
  }
}

export const authService = new AuthService();
