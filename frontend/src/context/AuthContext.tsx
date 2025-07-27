import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:5000/api';

interface User {
  id: string;
  email: string;
  role: string;
  name: string;
  customer_type?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role?: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Login function that connects to vulnerable backend
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Connect to vulnerable login endpoint
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      });

      // Backend returns { message, user, token, debug } instead of { success, user, token }
      if (response.data.message === "Login successful" && response.data.user && response.data.token) {
        const { user: backendUser, token } = response.data;
        
        // Transform backend user format to frontend format
        const userData = {
          ...backendUser,
          name: `${backendUser.firstName} ${backendUser.lastName}` // Combine first and last name
        };
        
        // Store user data
        setUser(userData);
        
        // Vulnerable: Store token in localStorage (should use httpOnly cookies)
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(userData));
        
        // Set default auth header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        toast.success(`Welcome back, ${userData.name}!`);
        return true;
      } else {
        toast.error(response.data.message || 'Login failed');
        return false;
      }
    } catch (error: any) {
      // Vulnerable: Expose detailed error information
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Network error during login';
      toast.error(errorMessage);
      
      // Log vulnerability attempts for educational purposes
      if (error.response?.data?.vulnerabilityDetected) {
        console.warn('🔥 Vulnerability attempt detected:', error.response.data.vulnerabilityType);
      }
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Register function that connects to vulnerable backend
  const register = async (name: string, email: string, password: string, role: string = 'customer'): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Split name into first and last name (simple approach)
      const nameParts = name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        firstName,
        lastName,
        email,
        password,
        role
      });

      if (response.data.success) {
        toast.success('Registration successful! Please log in.');
        return true;
      } else {
        toast.error(response.data.message || 'Registration failed');
        return false;
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Network error during registration';
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    delete axios.defaults.headers.common['Authorization'];
    toast.success('Logged out successfully');
  };

  // Vulnerable: Auto-login from localStorage on app load
  React.useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.warn('🔥 Auto-login from localStorage (vulnerable)');
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        logout();
      }
    }
  }, []);

  const isAuthenticated = !!user;

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 