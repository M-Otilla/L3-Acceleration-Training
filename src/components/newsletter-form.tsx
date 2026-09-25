"use client";

import { type FormEvent, useState } from "react";

const NEWSLETTER_KEY = "la-tavola-newsletter-emails";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = email.trim().toLowerCase();

    if (!normalized || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      setStatus("Please enter a valid email address.");
      return;
    }

    try {
      const saved = window.localStorage.getItem(NEWSLETTER_KEY);
      const emails = saved === null ? [] : JSON.parse(saved);
      if (!Array.isArray(emails) || !emails.every((item) => typeof item === "string")) {
        throw new Error("Invalid newsletter storage");
      }

      if (emails.some((item) => item.trim().toLowerCase() === normalized)) {
        setStatus("This email is already registered in this browser's demo list.");
        return;
      }

      emails.push(normalized);
      window.localStorage.setItem(NEWSLETTER_KEY, JSON.stringify(emails));
      setStatus("Email saved to this browser's demo list. No real subscription was created.");
      setEmail("");
    } catch {
      setStatus(
        "Could not access the browser's demo list. Your email was not saved. Check browser storage settings and try again.",
      );
    }
  };

  return (
    <div className="newsletter">
      <h2>A Little Taste of Italy</h2>
      <p>Seasonal specials and news from our table to yours.</p>
      <form onSubmit={handleSubmit} aria-label="Newsletter signup" aria-describedby="newsletter-note" noValidate>
        <fieldset>
          <legend className="visually-hidden">Demo newsletter signup</legend>
          <label htmlFor="newsletter-email">Your email address</label>
          <div className="newsletter-row">
            <input
              id="newsletter-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setStatus("");
              }}
            />
            <button type="submit">
              Subscribe <span aria-hidden="true">&rarr;</span>
            </button>
          </div>
        </fieldset>
      </form>
      <p id="newsletter-note" className="footer-note">
        Demo only. Emails are stored in this browser, not sent to a newsletter service. Use a test address.
      </p>
      <p id="newsletter-status" className="footer-note" role="status" aria-live="polite" aria-atomic="true">
        {status}
      </p>
      <noscript>
        <p className="footer-note">Enable JavaScript to try the demo signup.</p>
      </noscript>
    </div>
  );
}
