import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import type { RootState, UserRole } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles: UserRole[];
  fallback?: React.ComponentType;
}

const Unauthorized: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <div className="text-6xl text-red-500 mb-4">
        <i className="pi pi-lock"></i>
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
      <p className="text-gray-600 mb-4">
        You don't have permission to access this page.
      </p>
      <p className="text-sm text-gray-500">
        Please contact your administrator if you believe this is an error.
      </p>
    </div>
  </div>
);

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRoles, 
  fallback: FallbackComponent = Unauthorized 
}) => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Check if user is authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Check if user has required role
  if (!requiredRoles.includes(user.role)) {
    return <FallbackComponent />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 