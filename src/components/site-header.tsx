"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useRef, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";

type HeaderPage = "home" | "menu";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function normalizeEmail(email: string): string {
  return String(email ?? "").trim().toLowerCase();
}

function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("Please log in or create an account.");
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [registerEmailError, setRegisterEmailError] = useState("");
  const { login, register } = useAuth();

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

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = normalizeEmail(loginEmail);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setLoginError("");

    try {
      await login(email, loginPassword);
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Invalid email or password.";
      setStatus("");
      setLoginError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
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

    if (registerPassword !== confirmPassword) {
      setStatus("");
      setRegisterEmailError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await register(name, phone, email, registerPassword);
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed.";
      setStatus("");
      if (message.includes("already exists")) {
        setRegisterEmailError(message);
      } else {
        setRegisterEmailError("");
        setStatus(message);
      }
    } finally {
      setLoading(false);
    }
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

            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              value={loginPassword}
              onChange={(event) => setLoginPassword(event.target.value)}
              name="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />

            <p className="field-error" aria-live="polite">
              {loginError}
            </p>

            <button className="button" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Continue"}
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

            <label htmlFor="register-password">Password</label>
            <input
              id="register-password"
              value={registerPassword}
              onChange={(event) => setRegisterPassword(event.target.value)}
              name="password"
              type="password"
              placeholder="At least 8 characters"
              autoComplete="new-password"
              required
            />

            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              id="confirm-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              name="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              autoComplete="new-password"
              required
            />

            <p className="field-error" aria-live="polite">
              {registerEmailError || status}
            </p>

            <button className="button" type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export function SiteHeader({ currentPage }: { currentPage: HeaderPage }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
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

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
  };

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
                className={`button button-small header-auth ${isAuthenticated ? "is-logged-in" : ""}`}
                type="button"
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
                onClick={() => {
                  if (isAuthenticated) {
                    setDropdownOpen((value) => !value);
                    return;
                  }

                  setAuthOpen(true);
                }}
              >
                {isAuthenticated ? `Welcome ${user?.fullName || "Guest"}` : "Log in"}
              </button>
              {isAuthenticated ? (
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

      <AuthModal key={authOpen ? "auth-open" : "auth-closed"} isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
