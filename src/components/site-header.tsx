"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useRef, useState } from "react";

type HeaderPage = "home" | "menu";

type AuthUser = {
  fullName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
};

const AUTH_STORAGE_KEY = "la-tavola-current-user-data";
const AUTH_NAME_STORAGE_KEY = "la-tavola-current-user-name";
const REGISTERED_USERS_KEY = "la-tavola-registered-users";

function getLastName(fullName: string) {
  const names = String(fullName ?? "").trim().split(/\s+/).filter(Boolean);
  return names.length > 1 ? names[names.length - 1] : names[0] || "Guest";
}

function normalizeEmail(email: string) {
  return String(email ?? "").trim().toLowerCase();
}

function getCurrentUser(): AuthUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const saved = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!saved) {
    const fallbackName = window.localStorage.getItem(AUTH_NAME_STORAGE_KEY);
    return fallbackName
      ? { fullName: fallbackName, lastName: getLastName(fallbackName), email: "", mobileNumber: "" }
      : null;
  }

  try {
    const parsed = JSON.parse(saved);
    if (parsed && typeof parsed.fullName === "string") {
      return {
        fullName: parsed.fullName,
        lastName: parsed.lastName || getLastName(parsed.fullName),
        email: typeof parsed.email === "string" ? parsed.email : "",
        mobileNumber: typeof parsed.mobileNumber === "string" ? parsed.mobileNumber : "",
      };
    }
  } catch {
    return null;
  }

  return null;
}

function persistCurrentUser(user: AuthUser | null) {
  if (typeof window === "undefined") {
    return;
  }

  if (!user) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    window.localStorage.removeItem(AUTH_NAME_STORAGE_KEY);
    return;
  }

  const prepared = {
    fullName: user.fullName,
    lastName: user.lastName || getLastName(user.fullName),
    email: user.email,
    mobileNumber: user.mobileNumber || "",
  };

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(prepared));
  window.localStorage.setItem(AUTH_NAME_STORAGE_KEY, prepared.fullName);
}

function getRegisteredUsers(): AuthUser[] {
  if (typeof window === "undefined") {
    return [];
  }

  const saved = window.localStorage.getItem(REGISTERED_USERS_KEY);
  if (!saved) {
    return [];
  }

  try {
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) {
      return [];
    }

    const cleaned: AuthUser[] = [];
    const seen = new Set<string>();

    for (const entry of parsed) {
      if (!entry || typeof entry !== "object") {
        continue;
      }

      const email = normalizeEmail(String(entry.email ?? ""));
      const fullName = String(entry.fullName ?? "").trim();
      if (!email || !fullName || seen.has(email)) {
        continue;
      }

      seen.add(email);
      cleaned.push({
        fullName,
        mobileNumber: String(entry.mobileNumber ?? "").trim(),
        email,
        lastName: entry.lastName || getLastName(fullName),
      });
    }

    if (cleaned.length !== parsed.length) {
      window.localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(cleaned));
    }

    return cleaned;
  } catch {
    return [];
  }
}

function saveRegisteredUsers(users: AuthUser[]) {
  if (typeof window === "undefined") {
    return;
  }

  const deduped: AuthUser[] = [];
  const seen = new Set<string>();

  for (const entry of users) {
    const email = normalizeEmail(entry.email);
    const fullName = String(entry.fullName ?? "").trim();
    if (!email || !fullName || seen.has(email)) {
      continue;
    }

    seen.add(email);
    deduped.push({
      fullName,
      mobileNumber: String(entry.mobileNumber ?? "").trim(),
      email,
      lastName: entry.lastName || getLastName(fullName),
    });
  }

  window.localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(deduped));
}

function AuthModal({
  isOpen,
  onClose,
  onUserChange,
}: {
  isOpen: boolean;
  onClose: () => void;
  onUserChange: (user: AuthUser | null) => void;
}) {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [status, setStatus] = useState("Please log in or create an account.");
  const [registerEmailError, setRegisterEmailError] = useState("");


  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = normalizeEmail(loginEmail);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("Please enter a valid email address.");
      return;
    }

    const user = getRegisteredUsers().find((entry) => normalizeEmail(entry.email) === email);
    if (!user) {
      setStatus("No account was found for that email. Please register first.");
      return;
    }

    persistCurrentUser(user);
    onUserChange(user);
    onClose();
    setLoginEmail("");
    setStatus("Please log in or create an account.");
  };

  const handleRegister = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = fullName.trim();
    const phone = mobileNumber.trim();
    const email = normalizeEmail(registerEmail);

    if (!name || !phone || !email) {
      setStatus("Please complete all three fields: full name, mobile number, and email address.");
      setRegisterEmailError(email ? "" : "Email address is required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("Please enter a valid email address.");
      setRegisterEmailError("Please enter a valid email address.");
      return;
    }

    const users = getRegisteredUsers();
    if (users.some((entry) => normalizeEmail(entry.email) === email)) {
      setStatus("");
      setRegisterEmailError("This email is already registered. Please log in instead.");
      return;
    }

    const user: AuthUser = {
      fullName: name,
      mobileNumber: phone,
      email,
      lastName: getLastName(name),
    };

    saveRegisteredUsers([...users, user]);
    setRegisterEmailError("");
    persistCurrentUser(user);
    onUserChange(user);
    onClose();
    setFullName("");
    setMobileNumber("");
    setRegisterEmail("");
    setStatus("Please log in or create an account.");
  };

  return (
    <div className="auth-modal" aria-modal="true" role="dialog" aria-labelledby="auth-dialog-title">
      <div className="auth-backdrop" data-close-auth="true" onClick={onClose} />
      <div className="auth-dialog">
        <button type="button" className="auth-close" aria-label="Close login" onClick={onClose}>
          &times;
        </button>
        <p className="eyebrow">Welcome back</p>
        <h2 id="auth-dialog-title">Member access</h2>
        <div className="auth-tabs" role="tablist" aria-label="Authentication options">
          <button
            type="button"
            role="tab"
            id="login-tab"
            aria-controls="auth-login-panel"
            className={`auth-tab ${tab === "login" ? "is-active" : ""}`}
            data-auth-tab="login"
            aria-selected={tab === "login"}
            tabIndex={tab === "login" ? 0 : -1}
            onClick={() => setTab("login")}
          >
            Login
          </button>
          <button
            type="button"
            role="tab"
            id="register-tab"
            aria-controls="auth-register-panel"
            className={`auth-tab ${tab === "register" ? "is-active" : ""}`}
            data-auth-tab="register"
            aria-selected={tab === "register"}
            tabIndex={tab === "register" ? 0 : -1}
            onClick={() => setTab("register")}
          >
            Register
          </button>
        </div>

        {tab === "login" ? (
          <form id="auth-login-panel" role="tabpanel" className="auth-form" onSubmit={handleLogin} noValidate>
            <label htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              value={loginEmail}
              onChange={(event) => setLoginEmail(event.target.value)}
              name="email"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              required
            />
            <button className="button" type="submit">
              Continue
            </button>
          </form>
        ) : (
          <form id="auth-register-panel" role="tabpanel" className="auth-form" onSubmit={handleRegister} noValidate>
            <label htmlFor="register-full-name">Full Name</label>
            <input
              id="register-full-name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              name="fullName"
              type="text"
              placeholder="Your full name"
              autoComplete="name"
              required
            />

            <label htmlFor="register-mobile">Mobile Number</label>
            <input
              id="register-mobile"
              value={mobileNumber}
              onChange={(event) => setMobileNumber(event.target.value)}
              name="mobile"
              type="tel"
              placeholder="09XXXXXXXXX"
              inputMode="numeric"
              autoComplete="tel"
              required
            />

            <label htmlFor="register-email">Email Address</label>
            <input
              id="register-email"
              value={registerEmail}
              onChange={(event) => {
                setRegisterEmail(event.target.value);
                setRegisterEmailError("");
                setStatus("Please log in or create an account.");
              }}
              name="email"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              required
              aria-invalid={registerEmailError ? "true" : "false"}
            />
            <p className="field-error" aria-live="polite">
              {registerEmailError}
            </p>

            <button className="button" type="submit">
              Create account
            </button>
          </form>
        )}

        <p className="auth-status" aria-live="polite">
          {status}
        </p>
      </div>
    </div>
  );
}

export function SiteHeader({ currentPage }: { currentPage: HeaderPage }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentUser, setCurrentUserState] = useState<AuthUser | null>(() => getCurrentUser());
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const syncViewport = () => {
      const mobile = mediaQuery.matches;
      setIsSmallScreen(mobile);
      if (!mobile) {
        setMobileMenuOpen(false);
      }
    };

    syncViewport();
    mediaQuery.addEventListener("change", syncViewport);

    return () => mediaQuery.removeEventListener("change", syncViewport);
  }, []);


  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (authOpen) {
          setAuthOpen(false);
        }
        if (dropdownOpen) {
          setDropdownOpen(false);
        }
        if (mobileMenuOpen) {
          setMobileMenuOpen(false);
        }
      }
    };

    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (headerRef.current && !headerRef.current.contains(target)) {
        setDropdownOpen(false);
        if (isSmallScreen && mobileMenuOpen) {
          setMobileMenuOpen(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleDocumentClick);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [authOpen, dropdownOpen, isSmallScreen, mobileMenuOpen]);

  const handleUserChange = (user: AuthUser | null) => {
    setCurrentUserState(user);
    setDropdownOpen(false);
    if (user) {
      setAuthOpen(false);
    }
  };

  const handleLogout = () => {
    persistCurrentUser(null);
    setCurrentUserState(null);
    setDropdownOpen(false);
  };

  const buttonLabel = currentUser ? `Welcome ${currentUser.lastName}` : "Log in";
  const panelHidden = isSmallScreen && !mobileMenuOpen;

  return (
    <>
      <header ref={headerRef} className={`site-header ${mobileMenuOpen ? "navigation-open" : ""} navigation-ready`}>
        <div className="container header-inner">
          <Link className="brand" href="/" aria-label="La Tavola Italiana home">
            La Tavola <span>Italiana</span>
          </Link>

          <button
            className="menu-toggle"
            type="button"
            aria-expanded={mobileMenuOpen}
            aria-controls="header-panel"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileMenuOpen((value) => !value)}
            hidden={!isSmallScreen}
          >
            <span className="hamburger" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            <span>Menu</span>
          </button>

          <div className="header-panel" id="header-panel" hidden={panelHidden}>
            <nav aria-label="Main navigation">
              <ul className="nav-links">
                <li>
                  <Link href="/" aria-current={currentPage === "home" ? "page" : undefined}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/menu" aria-current={currentPage === "menu" ? "page" : undefined}>
                    Menu
                  </Link>
                </li>
                <li>
                  <Link href="/#visit">Visit</Link>
                </li>
              </ul>
            </nav>

            <div className="header-auth-menu">
              <button
                id="header-auth-button"
                className={`button button-small header-auth ${currentUser ? "is-logged-in" : ""}`}
                type="button"
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
                onClick={() => {
                  if (currentUser) {
                    setDropdownOpen((value) => !value);
                    return;
                  }

                  setAuthOpen(true);
                }}
              >
                {buttonLabel}
              </button>
              {currentUser ? (
                <div className="header-auth-dropdown" hidden={!dropdownOpen}>
                  <button type="button" onClick={handleLogout}>
                    Logout?
                  </button>
                </div>
              ) : null}
            </div>

            <Link className="button button-small header-reserve header-reserve-sticky" href="/#reservations">
              Reserve a Table
            </Link>
          </div>
        </div>
      </header>

      <AuthModal key={authOpen ? "auth-open" : "auth-closed"} isOpen={authOpen} onClose={() => setAuthOpen(false)} onUserChange={handleUserChange} />
    </>
  );
}

