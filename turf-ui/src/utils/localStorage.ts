// LocalStorage utility for authentication token management

const AUTH_TOKEN_KEY = 'access_token';
const USER_DATA_KEY = 'userData';

export interface StoredUserData {
  id: string;
  email: string;
  name: string;
  role: string;
}

export const localStorageUtil = {
  // Token management
  getToken: (): string | null => {
    try {
      return localStorage.getItem(AUTH_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token from localStorage:', error);
      return null;
    }
  },

  setToken: (token: string): void => {
    try {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } catch (error) {
      console.error('Error setting token in localStorage:', error);
    }
  },

  removeToken: (): void => {
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    } catch (error) {
      console.error('Error removing token from localStorage:', error);
    }
  },

  // User data management
  getUserData: (): StoredUserData | null => {
    try {
      const userData = localStorage.getItem(USER_DATA_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data from localStorage:', error);
      return null;
    }
  },

  setUserData: (userData: StoredUserData): void => {
    try {
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('Error setting user data in localStorage:', error);
    }
  },

  removeUserData: (): void => {
    try {
      localStorage.removeItem(USER_DATA_KEY);
    } catch (error) {
      console.error('Error removing user data from localStorage:', error);
    }
  },

  // Clear all auth data
  clearAuthData: (): void => {
    localStorageUtil.removeToken();
    localStorageUtil.removeUserData();
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorageUtil.getToken();
  }
}; 