import type { MenuItem, UserRole } from "../types";

// Navigation menu items for different roles
export const MENU_ITEMS: Record<UserRole, MenuItem[]> = {
  admin: [
    {
      id: "home",
      label: "Home",
      icon: "pi pi-home",
      path: "/home",
      roles: ["admin"],
    },
    {
      id: "turf-management",
      label: "Turf Management",
      icon: "pi pi-map-marker",
      path: "/admin/turfs",
      roles: ["admin"],
    },
    {
      id: "my-bookings",
      label: "My Bookings",
      icon: "pi pi-calendar",
      path: "/bookings",
      roles: ["admin"],
    },
    {
      id: "turf-bookings",
      label: "Turf Bookings",
      icon: "pi pi-calendar-plus",
      path: "/admin/bookings",
      roles: ["admin"],
    },
  ],
  customer: [
    {
      id: "home",
      label: "Home",
      icon: "pi pi-home",
      path: "/home",
      roles: ["customer"],
    },
    {
      id: "my-bookings",
      label: "My Bookings",
      icon: "pi pi-calendar",
      path: "/bookings",
      roles: ["customer"],
    },
  ],
  vendor: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "pi pi-home",
      path: "/dashboard/vendor",
      roles: ["vendor"],
    },
    {
      id: "my-turfs",
      label: "My Turfs",
      icon: "pi pi-map-marker",
      path: "/vendor/turfs",
      roles: ["vendor"],
    },
    {
      id: "bookings",
      label: "Bookings",
      icon: "pi pi-calendar",
      path: "/vendor/bookings",
      roles: ["vendor"],
    },
    {
      id: "profile",
      label: "Profile",
      icon: "pi pi-user",
      path: "/profile",
      roles: ["vendor"],
    },
  ],
};

// Public menu items (visible to all users)
export const PUBLIC_MENU_ITEMS: MenuItem[] = [
  {
    id: "home",
    label: "Home",
    icon: "pi pi-home",
    path: "/home",
    roles: ["admin", "customer", "vendor"],
  },
  {
    id: "turfs",
    label: "Turfs",
    icon: "pi pi-map-marker",
    path: "/turfs",
    roles: ["admin", "customer", "vendor"],
  },
];

// User menu items (dropdown in header)
export const USER_MENU_ITEMS: MenuItem[] = [
  {
    id: "profile",
    label: "Profile",
    icon: "pi pi-user",
    path: "/profile",
    roles: ["admin", "customer", "vendor"],
  },
  {
    id: "change-password",
    label: "Change Password",
    icon: "pi pi-lock",
    path: "/change-password",
    roles: ["admin", "customer", "vendor"],
  },
  {
    id: "logout",
    label: "Logout",
    icon: "pi pi-sign-out",
    path: "/logout",
    roles: ["admin", "customer", "vendor"],
  },
];

// Helper function to get menu items for a specific role
export const getMenuItemsForRole = (role: UserRole): MenuItem[] => {
  return MENU_ITEMS[role] || [];
};

// Helper function to get all menu items for a role (including public)
export const getAllMenuItemsForRole = (role: UserRole): MenuItem[] => {
  return [...PUBLIC_MENU_ITEMS, ...getMenuItemsForRole(role)];
};
