// User and Authentication Types
export type UserRole = "admin" | "customer" | "vendor" | "ADMIN" | "CUSTOMER" | "VENDOR";

// Import StatusCounts from admin booking service
import type { StatusCounts } from "../services/adminBookingService";

// Backend-aligned User types based on simplified UserDto
export interface User {
  id: string; // UUID from backend
  fullName: string; // matches backend field name
  email: string;
  phoneNumber: string; // matches backend field name
  role: UserRole; // Simplified to single role field
  firstName?: string; // Legacy compatibility
  lastName?: string; // Legacy compatibility
  isVerified: boolean;
  isActive: boolean;
  vendorApprovalStatus?: string;
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
  // Frontend-only fields for compatibility
  name?: string; // computed from fullName for backwards compatibility
  phone?: string; // computed from phoneNumber for backwards compatibility
  preferences?: UserPreferences; // Frontend-only for UI settings
}

// Backend RoleDto structure
export interface RoleDto {
  id: string;
  name: string;
  description?: string;
}

// Backend-aligned API User interface
export interface ApiUser extends User {
  // Same structure since backend uses DTOs directly
}

export interface UserPreferences {
  theme: "light" | "dark";
  language: string;
  notifications: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Backend-aligned Category types based on CategoryDto
export interface Category {
  id: string; // UUID from backend
  name: string;
  description?: string;
}

export interface CategoryState {
  categories: Category[];
  selectedCategory: Category | null;
  isLoading: boolean;
  error: string | null;
}

// Backend-aligned Turf types based on TurfDto
export interface Turf {
  id: string; // UUID from backend
  name: string;
  vendorId: string; // UUID from backend
  categoryId: string; // UUID from backend
  location: any; // Accept both string and object for compatibility
  description?: string;
  pricePerHour: number; // BigDecimal from backend as number
  openTime: string; // LocalTime from backend as HH:MM:SS
  closeTime: string; // LocalTime from backend as HH:MM:SS
  // Legacy/extended fields for compatibility
  createdAt?: string;
  updatedAt?: string;
  // Frontend computed fields for UI
  category?: any; // Flexible - can be a string or Category object
  locationData?: Location; // parsed from location string for display
  pricing?: PricingInfo; // computed from pricePerHour
  images?: string[]; // frontend-only for now
  rating?: number; // frontend-only for now
  reviewCount?: number; // frontend-only for now
  amenities?: Amenity[]; // frontend-only for now
  availability?: AvailabilitySchedule[]; // frontend-only for now
}

// Legacy pricing structure for UI compatibility
export interface PricingInfo {
  hourlyRate: number;
  currency: string;
  discounts?: {
    type: "percentage" | "fixed";
    value: number;
    minHours?: number;
  }[];
}

// Backend-aligned API Turf interface
export interface ApiTurf extends Turf {
  // Same structure since backend uses DTOs directly
}

export interface TurfState {
  turfs: Turf[];
  selectedTurf: Turf | null;
  isLoading: boolean;
  error: string | null;
  isError: boolean;
  filters: TurfFilters;
}

export interface TurfFilters {
  keyword?: string; // matches backend SearchFilter
  startDate?: string; // matches backend SearchFilter
  endDate?: string; // matches backend SearchFilter
  status?: string; // matches backend SearchFilter
  page?: number; // matches backend SearchFilter
  size?: number; // matches backend SearchFilter
}

// Backend-aligned Booking types based on BookingDto
export interface Booking {
  id: string; // UUID from backend
  customerId: string; // UUID from backend
  turfId: string; // UUID from backend
  turfName?: string; // Direct from backend
  turfLocation?: string; // Direct from backend
  categoryName?: string; // Direct from backend
  customerName?: string; // Direct from backend
  customerEmail?: string; // Direct from backend
  bookingDate: string; // LocalDate from backend as YYYY-MM-DD
  date?: string; // Legacy compatibility (alias for bookingDate)
  startTime: string; // LocalTime from backend as HH:MM:SS
  endTime: string; // LocalTime from backend as HH:MM:SS
  timeSlot?: string; // Legacy single timeslot string
  totalAmount: number; // BigDecimal from backend as number
  bookingReference?: string; // Reference code
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
  status: BookingStatus;
  // Frontend computed fields (for backward compatibility)
  turf?: Turf; // populated from turfId
  customer?: User; // populated from customerId
}

export type BookingStatus =
  | "PENDING"
  | "pending"
  | "CONFIRMED"
  | "confirmed"
  | "CANCELLED"
  | "cancelled"
  | "COMPLETED"
  | "completed"
  | "REJECTED"
  | "rejected";

// Backend-aligned API Booking interface
export interface ApiBooking extends Booking {
  // Same structure since backend uses DTOs directly
}

export interface BookingState {
  bookings: Booking[];
  selectedBooking: Booking | null;
  isLoading: boolean;
  error: string | null;
  filters: BookingFilters;
}

export interface BookingFilters {
  status?: BookingStatus;
  bookingDate?: string; // Specific date filter
  startDate?: string;
  endDate?: string;
  turfId?: string;
  customerId?: string;
  page?: number;
  size?: number;
}

// Legacy types for UI compatibility
export interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  price: number;
}

export interface PaymentInfo {
  id: string;
  amount: number;
  currency: string;
  method: "card" | "cash" | "online";
  status: "pending" | "completed" | "failed" | "refunded";
  transactionId?: string;
  paidAt?: string;
}

export interface ApiPaymentInfo {
  id: string;
  amount: number;
  currency: string;
  method: "card" | "cash" | "online";
  status: "pending" | "completed" | "failed" | "refunded";
  transactionId?: string;
  paidAt?: Date;
}

// UI State Types
export interface UIState {
  sidebar: {
    isCollapsed: boolean;
    isOpen: boolean;
  };
  modals: {
    [key: string]: boolean;
  };
  toast: {
    messages: ToastMessage[];
  };
  loading: {
    [key: string]: boolean;
  };
  theme: "light" | "dark";
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  duration?: number;
}

// Admin State Types
export interface AdminStats {
  totalUsers: number;
  totalTurfs: number;
  totalBookings: number;
  totalRevenue: number;
  monthlyStats: {
    month: string;
    bookings: number;
    revenue: number;
  }[];
}

export interface AdminState {
  stats: AdminStats | null;
  isLoading: boolean;
  error: string | null;
}

// Root State
export interface RootState {
  auth: AuthState;
  ui: UIState;
  booking: BookingState;
  turf: TurfState;
  user: UserState;
  admin: AdminState;
  category: CategoryState;
  adminBooking: {
    bookings: Booking[];
    selectedBooking: Booking | null;
    statusCounts: StatusCounts | null;
    isLoading: boolean;
    error: string | null;
    filters: BookingFilters;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// User State (separate from auth for profile management)
export interface UserState {
  profile: User | null;
  isLoading: boolean;
  error: string | null;
}

// Backend-aligned API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types - updated to match backend structure
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  fullName: string; // matches backend UserDto
  email: string;
  phoneNumber: string; // matches backend UserDto
  passwordHash: string; // matches backend UserDto field name
  role?: string;
  // Address fields matching backend structure
  doorNo?: string;
  street?: string;
  locality?: string;
  location?: string;
}

export interface BookingForm {
  turfId: string;
  bookingDate: string; // YYYY-MM-DD format for backend
  startTime: string; // HH:MM:SS format for backend
  endTime: string; // HH:MM:SS format for backend
}

export interface ProfileForm {
  fullName: string;
  phoneNumber: string;
}

// Turf form data for frontend forms
export interface TurfFormData {
  name: string;
  description: string;
  category: string; // Category ID
  location: string; // Single address field instead of object
  pricing: {
    hourlyRate: number;
    currency: string;
  };
  startTime: string;
  endTime: string;
  slotInterval: number;
}

// Backend request/response interfaces
export interface AuthRequest {
  email: string;
  password: string;
}

export interface OtpRequest {
  email: string;
  otp: string;
  newPassword?: string;
}

export interface SearchFilter {
  keyword?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  page?: number;
  size?: number;
}

// Additional backend-aligned types
export interface ModuleDto {
  id: string;
  name: string;
  description?: string;
}

// Legacy compatibility types (for gradual migration)
export interface Amenity {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface AvailabilitySchedule {
  dayOfWeek: number;
  slots: TimeSlot[];
  isOpen: boolean;
}

export interface Location {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// ----------------------------------
// UI Helper & Legacy Compatibility Types
// ----------------------------------

// Generic navigation menu item used across sidebar, header etc.
export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  path: string;
  roles: UserRole[];
}

// Breadcrumb element for page navigation trails
export interface BreadcrumbItem {
  label: string;
  path: string;
  isActive: boolean;
}

// Flexible turf category type (string id or full object)
export type TurfCategory = Category | string;

