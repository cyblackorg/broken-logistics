import React, { ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-red-600">Access Denied</h2>
        <p className="mt-2">Please log in to access this page.</p>
      </div>
    );
  }

  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-red-600">Insufficient Permissions</h2>
        <p className="mt-2">You don't have the required role to access this page.</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute; 