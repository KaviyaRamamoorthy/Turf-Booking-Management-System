# Turf Booking Management System - Implementation Plan

## Project Requirements Summary
- **Minimal setup** with easy modification capability
- **Collapsible sidebar** with role-based menus (admin, customer, vendor)
- **Header** with user icon and overlay menu (Change Password, Logout, Profile)
- **Role-based routing** with ProtectedRoute component and Unauthorized page
- **Nested routes** with breadcrumb navigation
- **Complete Redux setup** with all slices and persistence
- **Custom PrimeReact component wrappers** with theme configuration
- **Mock authentication** and services

## Phase-by-Phase Implementation Plan

### Phase 1: Project Foundation & Setup

#### Step 1: Initialize React + TypeScript project with Vite
- Create project with latest React 18+ and TypeScript
- Configure Vite for optimal development experience
- Set up basic project structure

#### Step 2: Install and configure core dependencies
```bash
# Core dependencies
npm install react-router-dom@6
npm install @reduxjs/toolkit react-redux
npm install redux-persist
npm install primereact primeicons
npm install tailwindcss postcss autoprefixer
npm install axios
npm install react-hook-form @hookform/resolvers zod
npm install date-fns

# Development dependencies
npm install -D @types/node
npm install -D eslint prettier
npm install -D @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

#### Step 3: Set up project structure
```
src/
├── components/
│   ├── common/          # Custom PrimeReact wrappers
│   ├── layout/          # Layout components
│   ├── forms/           # Form components
│   └── ui/              # UI components
├── pages/
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # Dashboard pages
│   ├── booking/        # Booking pages
│   ├── admin/          # Admin pages
│   └── public/         # Public pages
├── hooks/              # Custom React hooks
├── services/           # API services (mock)
├── store/              # Redux store
│   ├── slices/         # Redux slices
│   └── middleware/     # Custom middleware
├── utils/              # Utility functions
├── types/              # TypeScript types
├── constants/          # Application constants
├── assets/             # Static assets
└── styles/             # Global styles
```

### Phase 2: Redux Store Setup

#### Step 4: Configure complete Redux store structure
- Set up store with all slices (auth, ui, booking, turf, user, admin)
- Configure Redux Persist for session management
- Create middleware for API calls

#### Step 5: Create authentication slice
```typescript
// Store structure
interface RootState {
  auth: AuthState;           // User authentication & roles
  ui: UIState;              // UI state (sidebar, modals, etc.)
  booking: BookingState;     // Booking management
  turf: TurfState;          // Turf information
  user: UserState;          // User profile and preferences
  admin: AdminState;        // Admin-specific state
}

// Auth slice features
- User login/logout actions
- Role management (admin, customer, vendor)
- Token management
- Mock authentication service
```

### Phase 3: Layout Components

#### Step 6: Create main layout components
- `AppLayout`: Main wrapper with sidebar, header, and content area
- `Header`: With user icon on right side
- `Sidebar`: Collapsible with role-based navigation menus
- `UserMenu`: Overlay with Change Password, Logout, Profile options

#### Step 7: Implement sidebar functionality
- Collapsible/expandable sidebar
- Role-based menu items (static for now)
- Active menu highlighting

**Sidebar Menu Structure:**
```typescript
// Admin Menu
- Dashboard
- Turf Management
- User Management
- Booking Management
- Reports

// Customer Menu
- Dashboard
- My Bookings
- Browse Turfs
- Profile

// Vendor Menu
- Dashboard
- My Turfs
- Bookings
- Profile
```

### Phase 4: Routing & Authorization

#### Step 8: Create role-based route protection component
```typescript
// ProtectedRoute component
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles: UserRole[];
  fallback?: React.ComponentType;
}

// Features:
- Fetch user role from global state
- Return child component if authorized
- Return <Unauthorized/> component if not authorized
- Custom fallback component support
```

#### Step 9: Set up nested routing structure
- Configure React Router with nested routes
- Implement breadcrumb navigation
- Create route guards for authentication

**Route Structure:**
```
/                           # Public - Home
/auth                       # Public - Auth pages
  /login
  /register
/dashboard                  # Protected - Role-based
  /admin                    # Admin only
  /customer                 # Customer only
  /vendor                   # Vendor only
/turfs                      # Public - Turf listing
  /:id                      # Public - Turf details
/booking                    # Protected - Booking flow
  /:turfId
/profile                    # Protected - User profile
/admin                      # Admin only
  /turfs
  /users
  /bookings
  /reports
```

#### Step 10: Create placeholder pages
- Public pages (Home, Turf Listing, Turf Details)
- Role-specific pages (Admin Dashboard, Customer Dashboard, Vendor Dashboard)
- Authentication pages (Login, Register)

### Phase 5: Custom PrimeReact Components

#### Step 11: Create custom component wrappers
```typescript
// Custom components to wrap PrimeReact
- CustomButton: Wrapper for PrimeReact Button
- CustomInput: Wrapper for PrimeReact InputText
- CustomModal: Wrapper for PrimeReact Dialog
- CustomCard: Wrapper for PrimeReact Card
- CustomDataTable: Wrapper for PrimeReact DataTable
- CustomCalendar: Wrapper for PrimeReact Calendar
```

#### Step 12: Set up PrimeReact theme
- Configure theme variables
- Create custom theme overrides
- Ensure responsive design compatibility

**Theme Configuration:**
```typescript
// Theme options
- Light/Dark theme toggle
- Custom color scheme
- PrimeReact theme (Lara, Saga, etc.)
- Responsive breakpoints
```

### Phase 6: Mock Services & Data

#### Step 13: Create mock authentication service
```typescript
// Mock services
- AuthService: login, logout, getCurrentUser
- TurfService: getTurfs, getTurfById, getAvailability
- BookingService: createBooking, getBookings, cancelBooking
- UserService: getProfile, updateProfile, changePassword
- AdminService: getStats, getUsers, getReports
```

**Mock Data Structure:**
```typescript
// Sample mock data
- Users with different roles
- Sample turfs with images and details
- Sample bookings and availability
- Admin dashboard statistics
```

#### Step 14: Create other mock services
- Turf service (get turfs, availability)
- Booking service (create, get bookings)
- User service (profile, preferences)

### Phase 7: UI Components & Styling

#### Step 15: Create common UI components
```typescript
// Common components
- LoadingSpinner: Loading states
- ErrorBoundary: Error handling
- Toast: Notifications
- Breadcrumb: Navigation breadcrumbs
- Unauthorized: Access denied page
- NotFound: 404 page
```

#### Step 16: Implement responsive design
- Mobile-first approach
- Sidebar behavior on different screen sizes
- Touch-friendly interactions

**Responsive Breakpoints:**
```css
/* Tailwind breakpoints */
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
```

### Phase 8: Development Tools & Quality

#### Step 17: Configure development tools
```json
// Configuration files
- .eslintrc.js: ESLint configuration
- .prettierrc: Prettier configuration
- tsconfig.json: TypeScript configuration
- tailwind.config.js: Tailwind configuration
- vite.config.ts: Vite configuration
```

**Development Features:**
- Hot reload with Vite
- TypeScript strict mode
- ESLint and Prettier integration
- Environment-specific configurations

## Implementation Order

### Week 1: Foundation (Phases 1-2)
- Project setup and dependencies
- Redux store configuration
- Basic folder structure

### Week 2: Layout & Routing (Phases 3-4)
- Layout components
- Routing and authorization
- Placeholder pages

### Week 3: Components & Services (Phases 5-6)
- Custom PrimeReact components
- Mock services and data
- Theme configuration

### Week 4: Polish & Quality (Phases 7-8)
- UI components and styling
- Development tools
- Testing and optimization

## Key Features to Implement

### Authentication & Authorization
- JWT-based mock authentication
- Role-based access control (RBAC)
- Protected routes with fallback
- Session persistence

### Navigation & Layout
- Collapsible sidebar with role-based menus
- Header with user menu overlay
- Breadcrumb navigation
- Responsive design

### State Management
- Complete Redux setup with all slices
- Redux Persist for session management
- API middleware for mock services
- Global state for UI management

### UI/UX
- Custom PrimeReact component wrappers
- Consistent theme and styling
- Loading states and error handling
- Toast notifications

### Development Experience
- TypeScript strict mode
- ESLint and Prettier
- Hot reload development
- Environment configurations

## Questions for Clarification

1. **Sidebar Menu Structure**: Should I create different menu structures for each role as outlined above?

2. **Breadcrumb Implementation**: Should breadcrumbs be auto-generated from route structure or manually defined?

3. **Theme Preferences**: Do you want light/dark theme toggle and specific PrimeReact theme?

4. **Mock Data**: Should I create realistic mock data for turfs, bookings, and users?

5. **Error Handling**: Should I implement global error boundary and API error handling with toast notifications?

## Next Steps

1. Review and approve this implementation plan
2. Clarify any questions or requirements
3. Begin Phase 1 implementation
4. Set up development environment
5. Start with project foundation and dependencies 