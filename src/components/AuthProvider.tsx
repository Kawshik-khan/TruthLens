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
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
  hydrate: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate auth state from server-verified session via /api/auth/me
  const hydrate = async () => {
    try {
      console.log('[AuthProvider] Starting hydration...');
      const response = await fetch("/api/auth/me", {
        credentials: "include", // Include httpOnly cookies
        cache: 'no-store', // Force fresh request, don't use cache
      });

      console.log('[AuthProvider] /api/auth/me response status:', response.status);
      
      if (response.ok) {
        const userData = await response.json();
        console.log('[AuthProvider] ✅ Hydration successful, user:', userData.email);
        setUser(userData);
      } else {
        const errorData = await response.json();
        console.warn('[AuthProvider] ❌ /api/auth/me returned', response.status, errorData);
        setUser(null);
      }
    } catch (error) {
      console.error('[AuthProvider] ❌ Hydration failed:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Hydrate on mount
  useEffect(() => {
    hydrate();
  }, []);

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        logout,
        hydrate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
