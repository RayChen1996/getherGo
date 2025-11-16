import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types/user';

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (userData?: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const login = (userData?: User) => {
    setIsLoggedIn(true);
    if (userData) {
      setUser(userData);
    } else {
      // 默认假数据
      setUser({
        id: '1',
        name: '测试用户',
        email: 'test@example.com',
      });
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

