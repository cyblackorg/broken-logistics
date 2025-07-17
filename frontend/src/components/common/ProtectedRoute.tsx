import React, { ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-red-600">Access Denied</h2>
        <p className="mt-2">Please log in to access this page.</p>
      </div>
    );
  }

  // Vulnerable: Role check can be bypassed (intentional vulnerability)
  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-red-600">Insufficient Permissions</h2>
        <p className="mt-2">Your role: {user.role}</p>
        <p className="text-sm text-gray-500">Required: {allowedRoles.join(', ')}</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute; 