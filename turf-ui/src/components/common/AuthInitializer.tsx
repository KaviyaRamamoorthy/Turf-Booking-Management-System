import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from '../../store/slices/authSlice';
import { fetchCategories } from '../../store/slices/categorySlice';
import type { RootState } from '../../types';
import type { AppDispatch } from '../../store';
import { localStorageUtil } from '../../utils/localStorage';

interface AuthInitializerProps {
  children: React.ReactNode;
}

const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { categories } = useSelector((state: RootState) => state.category);

  useEffect(() => {
    const initializeAuth = async () => {
      // Check if there's a stored token
      const storedToken = localStorageUtil.getToken();
      
      if (storedToken && !isAuthenticated) {
        try {
          // Try to get current user data using the stored token
          await dispatch(getCurrentUser()).unwrap();
        } catch (error) {
          console.error('Failed to restore authentication:', error);
          // Clear invalid auth data
          localStorageUtil.clearAuthData();
        }
      }
    };

    initializeAuth();
  }, [dispatch, isAuthenticated]);

  // Fetch categories when user is authenticated and categories are not loaded
  useEffect(() => {
    if (isAuthenticated && categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, isAuthenticated, categories.length]);

  return <>{children}</>;
};

export default AuthInitializer; 