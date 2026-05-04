"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load auth from both cookies and localStorage on mount
    if (typeof window !== 'undefined') {
      // Try cookie first (server-set), fallback to localStorage
      const getCookie = (name: string) => {
        const cookies = document.cookie.split('; ');
        for (const cookie of cookies) {
          const [cookieName, cookieValue] = cookie.trim().split('=');
          if (cookieName === name) {
            return cookieValue || null;
          }
        }
        return null;
      };
      
      const storedToken = getCookie('token') || localStorage.getItem("auth_token");
      const storedUser = getCookie('user') || localStorage.getItem("auth_user");
      
      // Debug logging
      console.log("AuthProvider - Available cookies:", document.cookie);
      console.log("AuthProvider - Token from cookie:", getCookie('token'));
      console.log("AuthProvider - Token from localStorage:", localStorage.getItem("auth_token"));
      console.log("AuthProvider - User from cookie:", getCookie('user'));
      console.log("AuthProvider - User from localStorage:", localStorage.getItem("auth_user"));
      
      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(typeof storedUser === 'string' ? JSON.parse(storedUser) : storedUser);
          console.log("AuthProvider - Auth state loaded successfully");
        } catch (e) {
          console.error("Failed to parse auth data");
        }
      }
      
      setIsLoading(false);
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    if (typeof window !== 'undefined') {
      // Set both cookie and localStorage for persistence
      localStorage.setItem("auth_token", newToken);
      localStorage.setItem("auth_user", JSON.stringify(newUser));
      
      // Also set cookie for server-side compatibility
      const isProduction = process.env.NODE_ENV === 'production';
      const cookieDomain = process.env.COOKIE_DOMAIN;
      document.cookie = `token=${newToken}; path=/; max-age=86400; ${isProduction ? 'secure;' : ''} ${isProduction && cookieDomain ? `domain=${cookieDomain};` : ''} sameSite=${isProduction ? 'none' : 'lax'}`;
    }
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      // Clear both localStorage and cookies
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      
      // Clear cookie by setting it to expire in the past
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!token && !!user,
      isLoading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
