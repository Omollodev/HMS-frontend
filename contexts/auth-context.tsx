"use client";

import type React from "react";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { login, refreshToken, getUserProfile } from "@/services/auth-service";

type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  profile_picture?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // Get user profile
        const userData = await getUserProfile();
        setUser(userData);
      } catch (error) {
        // Try to refresh token
        try {
          const refreshTokenStr = localStorage.getItem("refreshToken");
          if (refreshTokenStr) {
            const { access } = await refreshToken(refreshTokenStr);
            localStorage.setItem("accessToken", access);
            const userData = await getUserProfile();
            setUser(userData);
          }
        } catch (refreshError) {
          // If refresh fails, log out
          handleLogout();
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { access, refresh, user } = await login(email, password);
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      setUser(user);
      router.push("/dashboard");
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.first_name}!`,
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    router.push("/login");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login: handleLogin,
        logout: handleLogout,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
