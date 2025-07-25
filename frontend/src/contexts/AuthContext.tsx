import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { jwtDecode } from 'jwt-decode';


interface DecodedToken {
  id: number;
  email: string;
  // Add more fields if needed (like username, etc.)
  exp: number; // expiration
  iat: number; // issued at
}

interface AuthContextType {
  token: string | null;
  currentUser: DecodedToken | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
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
  // Clear any existing token on app start to force login screen
  useEffect(() => {
    localStorage.removeItem('token');
  }, []);

  const [token, setToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<DecodedToken | null>(null);

  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
    setCurrentUser(jwtDecode<DecodedToken>(newToken));
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  const value = {
    token,
    currentUser,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
