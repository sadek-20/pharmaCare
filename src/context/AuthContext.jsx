"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing session on app start
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const token = localStorage.getItem("pharma_token");
        const userData = localStorage.getItem("pharma_user");

        if (token && userData) {
          setUser(JSON.parse(userData));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);

      // Simulate API call - Replace with actual authentication
      if (email === "admin@pharmacare.com" && password === "admin123") {
        const userData = {
          id: 1,
          name: "Admin User",
          email: email,
          role: "admin",
          pharmacy: "PharmaCare Main Branch",
        };

        const token = "pharma_jwt_token_" + Date.now();

        // Store in localStorage
        localStorage.setItem("pharma_token", token);
        localStorage.setItem("pharma_user", JSON.stringify(userData));

        setUser(userData);
        setIsAuthenticated(true);

        return { success: true, user: userData };
      } else {
        return {
          success: false,
          error: "Invalid credentials. Use admin@pharmacare.com / admin123",
        };
      }
    } catch (error) {
      return { success: false, error: "Login failed. Please try again." };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("pharma_token");
    localStorage.removeItem("pharma_user");
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
