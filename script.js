"use strict";

const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const headerPanel = document.querySelector(".header-panel");

if (header && menuToggle && headerPanel) {
  const mobile = window.matchMedia("(max-width: 768px)");

  function setNavigation(open, returnFocus = false) {
    const expanded = mobile.matches && open;
    // Move focus before hiding the panel so it never stays in hidden content.
    if (returnFocus) menuToggle.focus({ preventScroll: true });
    menuToggle.setAttribute("aria-expanded", String(expanded));
    menuToggle.setAttribute("aria-label", expanded ? "Close menu" : "Open menu");
    headerPanel.hidden = mobile.matches && !expanded;
    header.classList.toggle("navigation-open", expanded);
  }

  menuToggle.addEventListener("click", () => {
    setNavigation(menuToggle.getAttribute("aria-expanded") !== "true");
  });

  headerPanel.addEventListener("click", (event) => {
    if (mobile.matches && event.target.closest("a")) setNavigation(false, true);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      event.preventDefault();
      setNavigation(false, true);
    }
  });

  document.addEventListener("click", (event) => {
    if (!header.contains(event.target) && menuToggle.getAttribute("aria-expanded") === "true") {
      setNavigation(false, headerPanel.contains(document.activeElement));
    }
  });

  header.addEventListener("focusout", (event) => {
    if (event.relatedTarget && !header.contains(event.relatedTarget)) setNavigation(false);
  });

  mobile.addEventListener("change", () => {
    setNavigation(false, mobile.matches && headerPanel.contains(document.activeElement));
    if (!mobile.matches && document.activeElement === menuToggle) {
      headerPanel.querySelector("a").focus({ preventScroll: true });
    }
  });

  header.classList.add("navigation-ready");
  menuToggle.hidden = false;
  setNavigation(false);
}

const filters = document.querySelector(".menu-filters");
const filterStatus = document.querySelector(".filter-status");
const categories = [...document.querySelectorAll(".menu-category")];

if (filters && filterStatus && categories.length) {
  const buttons = [...filters.querySelectorAll("[data-filter]")];

  function filterMenu(category) {
    let count = 0;
    for (const section of categories) {
      section.hidden = category !== "all" && section.id !== category;
      if (!section.hidden) count += section.querySelectorAll(".menu-card").length;
    }
    for (const button of buttons) {
      button.setAttribute("aria-pressed", String(button.dataset.filter === category));
    }
    const label = buttons.find((button) => button.dataset.filter === category).textContent.trim();
    filterStatus.textContent = `Showing ${count} dishes: ${label === "All" ? "all categories" : label}.`;
  }

  function filterFromHash() {
    const target = document.getElementById(window.location.hash.slice(1));
    const category = target?.closest(".menu-category");
    filterMenu(category ? category.id : "all");
    // Hiding earlier categories changes the target's position on deep-link visits.
    if (category) {
      requestAnimationFrame(() => target.scrollIntoView({ behavior: "instant", block: "start" }));
    }
  }

  for (const button of buttons) {
    button.addEventListener("click", () => filterMenu(button.dataset.filter));
  }
  window.addEventListener("hashchange", filterFromHash);

  // Reveal controls only when their handlers are ready; retain native links without JS.
  document.querySelector(".category-nav").hidden = true;
  filters.hidden = false;
  filterStatus.hidden = false;
  filterFromHash();
}

const newsletterForm = document.querySelector(".newsletter form");
const newsletterStatus = document.getElementById("newsletter-status");

if (newsletterForm && newsletterStatus) {
  const emailInput = newsletterForm.querySelector('[name="email"]');
  const storageKey = "la-tavola-newsletter-emails";

  // Validate after trimming, instead of rejecting surrounding whitespace first.
  newsletterForm.noValidate = true;
  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    newsletterStatus.textContent = "";
    emailInput.value = emailInput.value.trim().toLowerCase();
    if (!newsletterForm.reportValidity()) return;

    try {
      // Read on every submission so navigation and other tabs see saved emails.
      const saved = window.localStorage.getItem(storageKey);
      const emails = saved === null ? [] : JSON.parse(saved);
      if (!Array.isArray(emails) || !emails.every((email) => typeof email === "string")) {
        throw new Error("Invalid newsletter storage");
      }

      if (emails.some((email) => email.trim().toLowerCase() === emailInput.value)) {
        newsletterStatus.textContent = "This email is already registered in this browser's demo list.";
        return;
      }

      emails.push(emailInput.value);
      window.localStorage.setItem(storageKey, JSON.stringify(emails));
      newsletterStatus.textContent = "Email saved to this browser's demo list. No real subscription was created.";
      newsletterForm.reset();
    } catch {
      newsletterStatus.textContent = "Could not access the browser's demo list. Your email was not saved. Check browser storage settings and try again.";
    }
  });

  emailInput.addEventListener("input", () => {
    newsletterStatus.textContent = "";
  });
  newsletterForm.querySelector("fieldset").disabled = false;
}
