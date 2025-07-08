import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  User,
  AuthTokens,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from "@shared/auth";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "auth_tokens";
const REFRESH_INTERVAL = 14 * 60 * 1000; // 14 minutes

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);

  // Load tokens from localStorage on mount
  useEffect(() => {
    const storedTokens = localStorage.getItem(TOKEN_KEY);
    if (storedTokens) {
      try {
        const parsedTokens: AuthTokens = JSON.parse(storedTokens);
        setTokens(parsedTokens);
        verifyAndLoadUser(parsedTokens.accessToken);
      } catch (error) {
        console.error("Error parsing stored tokens:", error);
        localStorage.removeItem(TOKEN_KEY);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  // Set up automatic token refresh
  useEffect(() => {
    if (!tokens) return;

    const interval = setInterval(async () => {
      await refreshToken();
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [tokens]);

  // Listen for storage changes (for multi-tab sync)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === TOKEN_KEY) {
        if (e.newValue) {
          try {
            const newTokens: AuthTokens = JSON.parse(e.newValue);
            setTokens(newTokens);
            verifyAndLoadUser(newTokens.accessToken);
          } catch (error) {
            console.error("Error parsing tokens from storage event:", error);
          }
        } else {
          // Tokens were removed in another tab
          setUser(null);
          setTokens(null);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const verifyAndLoadUser = async (accessToken: string) => {
    try {
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        // Token is invalid, try to refresh
        const refreshSuccess = await refreshToken();
        if (!refreshSuccess) {
          logout();
        }
      }
    } catch (error) {
      console.error("Error verifying user:", error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const saveTokens = (newTokens: AuthTokens) => {
    setTokens(newTokens);
    localStorage.setItem(TOKEN_KEY, JSON.stringify(newTokens));
  };

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      // Read response body once and handle both JSON and non-JSON responses
      const responseText = await response.text();

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        // If JSON parsing fails, check what we got instead
        console.error("JSON parsing failed. Response text:", responseText);

        // Check if it looks like an HTML error page
        if (
          responseText.includes("<html") ||
          responseText.includes("<!DOCTYPE")
        ) {
          throw new Error("Server error. Please try again later.");
        }

        // Otherwise it's likely a network/connection issue
        throw new Error(
          "Unable to connect to the server. Please check your connection.",
        );
      }

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      setUser(data.user);
      saveTokens(data.tokens);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      // Read response body once and handle both JSON and non-JSON responses
      const responseText = await response.text();

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        // If JSON parsing fails, check what we got instead
        console.error("JSON parsing failed. Response text:", responseText);

        // Check if it looks like an HTML error page
        if (
          responseText.includes("<html") ||
          responseText.includes("<!DOCTYPE")
        ) {
          throw new Error("Server error. Please try again later.");
        }

        // Otherwise it's likely a network/connection issue
        throw new Error(
          "Unable to connect to the server. Please check your connection.",
        );
      }

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      setUser(data.user);
      saveTokens(data.tokens);
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    if (!tokens?.refreshToken) return false;

    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken: tokens.refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        saveTokens(data.tokens);
        return true;
      } else {
        logout();
        return false;
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      logout();
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setTokens(null);
    localStorage.removeItem(TOKEN_KEY);

    // Optional: Call logout endpoint
    if (tokens?.accessToken) {
      fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }).catch(console.error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
