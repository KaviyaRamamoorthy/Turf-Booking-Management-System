// User and Authentication Types
export type UserRole = "admin" | "customer" | "vendor";

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  address?: {
    pincode: string;
    state: string;
    city: string;
  };
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
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

// Turf Types
export type TurfCategory =
  | "football"
  | "cricket"
  | "tennis"
  | "basketball"
  | "volleyball";

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

export interface PricingInfo {
  hourlyRate: number;
  currency: string;
  discounts?: {
    type: "percentage" | "fixed";
    value: number;
    minHours?: number;
  }[];
}

export interface Amenity {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  price: number;
}

export interface AvailabilitySchedule {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  slots: TimeSlot[];
  isOpen: boolean;
}

export interface Turf {
  id: string;
  name: string;
  description: string;
  category: TurfCategory;
  location: Location;
  pricing: PricingInfo;
  amenities: Amenity[];
  images: string[];
  availability: AvailabilitySchedule[];
  rating: number;
  reviewCount: number;
  vendorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TurfState {
  turfs: Turf[];
  selectedTurf: Turf | null;
  isLoading: boolean;
  error: string | null;
  filters: TurfFilters;
}

export interface TurfFilters {
  category?: TurfCategory;
  location?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  date?: Date;
  time?: string;
}

// Booking Types
export type BookingStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "no-show";

export interface PaymentInfo {
  id: string;
  amount: number;
  currency: string;
  method: "card" | "cash" | "online";
  status: "pending" | "completed" | "failed";
  transactionId?: string;
  paidAt?: Date;
}

export interface Booking {
  id: string;
  turfId: string;
  userId: string;
  date: Date;
  timeSlot: TimeSlot;
  status: BookingStatus;
  payment: PaymentInfo;
  totalAmount: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
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
  dateRange?: {
    start: Date;
    end: Date;
  };
  turfId?: string;
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
}

// User State (separate from auth for profile management)
export interface UserState {
  profile: User | null;
  isLoading: boolean;
  error: string | null;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
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

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

export interface BookingForm {
  turfId: string;
  date: Date;
  timeSlot: TimeSlot;
  notes?: string;
}

export interface ProfileForm {
  name: string;
  phone: string;
  address?: {
    pincode: string;
    state: string;
    city: string;
  };
  preferences: UserPreferences;
}

// Navigation Types
export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  roles: UserRole[];
  children?: MenuItem[];
}

export interface BreadcrumbItem {
  label: string;
  path: string;
  isActive: boolean;
}
