"use client";

import { createContext, type Dispatch, type SetStateAction, useContext, useEffect, useCallback, useState } from "react";

const STORAGE_KEY = "latavola-auth-user";

type AuthUser = {
  [key: string]: unknown;
};

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, mobileNumber: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAdmin: () => Promise<boolean>;
  setUser: Dispatch<SetStateAction<AuthUser | null>>;
}

function loadFromStorage(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

function saveToStorage(user: AuthUser | null): void {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Storage full or disabled — ignore silently.
  }
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  checkAdmin: async () => false,
  setUser: () => {},
});

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}

async function fetchSession(): Promise<AuthUser | null> {
  const res = await fetch("/api/auth/me", { credentials: "include" });
  if (!res.ok) return null;
  const body = await res.json();
  return (body as { data: { user: AuthUser | null } }).data?.user ?? null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(loadFromStorage());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    fetchSession().then((session) => {
      if (!mounted) return;
      if (session) {
        saveToStorage(session);
      } else {
        // Cookie expired or invalid — clear stale storage.
        saveToStorage(null);
        setUser(null);
      }
      setLoading(false);
    }).catch(() => {
      if (!mounted) return;
      // Network error — keep whatever was in storage, don't flash logged out.
      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const login: AuthContextValue["login"] = async (email, password) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.error?.message ?? "Login failed.");
    }

    const respBody = await res.json();
    const user = respBody.data.data.user as AuthUser;
    setUser(user);
    saveToStorage(user);
  };

  const register: AuthContextValue["register"] = async (fullName, mobileNumber, email, password) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, mobileNumber, email, password }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error?.message ?? "Registration failed.");
    }

    const body = await res.json();
    const user = body.data.user as AuthUser;
    setUser(user);
    saveToStorage(user);
  };

  const logout: AuthContextValue["logout"] = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch {
      // Ignore network errors on logout.
    }

    setUser(null);
    saveToStorage(null);
  };

  const isAdmin = !!user && (user.type === "admin");

  const checkAdmin: AuthContextValue["checkAdmin"] = useCallback(async () => {
    return isAdmin;
  }, [isAdmin]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin,
        loading,
        login,
        register,
        logout,
        checkAdmin,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
