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
let activeFilter = "all";
let currentFavorites = new Set();

if (filters && filterStatus && categories.length) {
  const buttons = [...filters.querySelectorAll("[data-filter]")];

  function filterMenu(category) {
    let count = 0;
    for (const section of categories) {
      const sectionCards = [...section.querySelectorAll(".menu-card")];
      section.hidden = category !== "all" && category !== "favorites" && section.id !== category;
      for (const card of sectionCards) {
        card.hidden = category === "favorites" && !currentFavorites.has(card.dataset.dishId);
      }
      if (!section.hidden) {
        const visibleCards = sectionCards.filter((card) => !card.hidden);
        if (category === "favorites" && visibleCards.length === 0) section.hidden = true;
        count += visibleCards.length;
      }
    }
    activeFilter = category;
    for (const button of buttons) {
      button.setAttribute("aria-pressed", String(button.dataset.filter === category));
    }
    const label = buttons.find((button) => button.dataset.filter === category).textContent.trim();
    filterStatus.textContent = category === "favorites"
      ? `Showing ${count} favourited dishes.`
      : `Showing ${count} dishes: ${label === "All" ? "all categories" : label}.`;
  }

  function filterFromHash() {
    if (window.location.hash === "#favorites") {
      filterMenu("favorites");
      return;
    }
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

const favoriteCards = [...document.querySelectorAll(".menu-card[data-dish-id]")];
const favoritesStatus = document.getElementById("favorites-status");
const favoriteUserTrigger = document.getElementById("favorite-user-trigger");
const favoriteUserModal = document.getElementById("favorite-user-modal");
const favoriteUserCloseButton = document.getElementById("favorite-user-close");
const favoriteUserNameInput = document.getElementById("favorite-user-name");
const favoriteUserLoginButton = document.getElementById("favorite-user-login");
const favoriteUserLogoutButton = document.getElementById("favorite-user-logout");
const favoriteUserStatus = document.getElementById("favorite-user-status");
const currentUserNameKey = "la-tavola-current-user-name";

function normalizeUserKey(value) {
  return String(value ?? "guest")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "guest";
}

function getCurrentUserName() {
  const saved = window.localStorage.getItem(currentUserNameKey);
  return saved ? saved.trim() : "guest";
}

function getFavoritesStorageKeyForUser(userName = getCurrentUserName()) {
  return `la-tavola-menu-favorites-${normalizeUserKey(userName)}`;
}

if (favoriteCards.length && favoritesStatus) {
  const buttons = new Map();
  // Configure the favorites expiry window here: 7 days = 1 week.
  const favoritesExpiryMs = 7 * 24 * 60 * 60 * 1000;

  function saveFavorites(favorites, userName = getCurrentUserName()) {
    const storageKey = getFavoritesStorageKeyForUser(userName);
    const payload = {
      ids: [...favorites],
      expiresAt: Date.now() + favoritesExpiryMs,
    };
    window.localStorage.setItem(storageKey, JSON.stringify(payload));
  }

  function readFavorites(userName = getCurrentUserName()) {
    const storageKey = getFavoritesStorageKeyForUser(userName);
    const saved = window.localStorage.getItem(storageKey);
    if (saved === null) return { favorites: new Set(), expired: false };

    let parsed;
    try {
      parsed = JSON.parse(saved);
    } catch {
      throw new Error("Invalid favorites storage");
    }

    const ids = Array.isArray(parsed) ? parsed : parsed?.ids;
    const expiresAt = typeof parsed?.expiresAt === "number" ? parsed.expiresAt : null;

    if (!Array.isArray(ids) || !ids.every((id) => typeof id === "string" && id.length > 0)) {
      throw new Error("Invalid favorites storage");
    }

    if (expiresAt !== null && Date.now() > expiresAt) {
      window.localStorage.removeItem(storageKey);
      return { favorites: new Set(), expired: true };
    }

    if (Array.isArray(parsed) || expiresAt === null) {
      saveFavorites(new Set(ids), userName);
    }

    return { favorites: new Set(ids), expired: false };
  }

  function renderFavorites(favorites) {
    currentFavorites = favorites;
    for (const [id, { button, name }] of buttons) {
      const selected = favorites.has(id);
      button.setAttribute("aria-pressed", String(selected));
      button.setAttribute("aria-label", selected ? `Remove ${name} from favorites` : `Add ${name} to favorites`);
      button.textContent = selected ? "Favorited" : "Favorite";
    }
    if (activeFilter === "favorites") filterMenu("favorites");
  }

  function applyUserLoginState() {
    const userName = getCurrentUserName();
    const isGuest = userName === "guest" || userName.trim() === "";
    if (favoriteUserTrigger) {
      favoriteUserTrigger.textContent = isGuest ? "Favourites profile" : `Profile: ${userName}`;
    }
    if (favoriteUserNameInput) {
      favoriteUserNameInput.value = isGuest ? "" : userName;
    }
    if (favoriteUserStatus) {
      favoriteUserStatus.textContent = isGuest
        ? "Signed in as guest. Favorites are stored separately for each user."
        : `Signed in as ${userName}. Your favourites stay separate from other accounts.`;
    }
    if (favoriteUserLogoutButton) {
      favoriteUserLogoutButton.hidden = isGuest;
    }
  }

  function openLoginModal() {
    if (!favoriteUserModal) return;
    favoriteUserModal.hidden = false;
    requestAnimationFrame(() => {
      favoriteUserNameInput?.focus();
      favoriteUserNameInput?.select();
    });
  }

  function closeLoginModal() {
    if (!favoriteUserModal) return;
    favoriteUserModal.hidden = true;
  }

  function loadFavoritesForCurrentUser() {
    const userName = getCurrentUserName();
    const { favorites, expired } = readFavorites(userName);
    renderFavorites(favorites);
    if (expired) {
      favoritesStatus.textContent = `Your favourites for ${userName} expired after one week and have been reset.`;
      return;
    }
    favoritesStatus.textContent = userName === "guest"
      ? "Favorites are saved under the current guest profile. Log in with a name to keep a separate list."
      : `Favorites for ${userName} loaded.`;
  }

  for (const card of favoriteCards) {
    const id = card.dataset.dishId;
    const name = card.querySelector("h3").textContent.trim();
    const button = document.createElement("button");
    button.type = "button";
    button.className = "favorite-button";
    button.textContent = "Favorite";
    button.setAttribute("aria-label", `Favorite ${name}`);
    button.setAttribute("aria-pressed", "false");
    button.addEventListener("click", () => {
      try {
        const userName = getCurrentUserName();
        const { favorites } = readFavorites(userName);
        const remove = button.getAttribute("aria-pressed") === "true";
        if (remove) favorites.delete(id);
        else favorites.add(id);
        saveFavorites(favorites, userName);
        renderFavorites(favorites);
        favoritesStatus.textContent = `${name} ${remove ? "removed from" : "saved to"} ${userName === "guest" ? "the guest" : userName + "'s"} favourites.`;
      } catch {
        favoritesStatus.textContent = "Favorites could not be saved. Browser storage may be blocked, full, or damaged; see the README for recovery steps.";
      }
    });
    buttons.set(id, { button, name });
    card.append(button);
  }

  if (favoriteUserTrigger) {
    favoriteUserTrigger.addEventListener("click", openLoginModal);
  }

  if (favoriteUserCloseButton) {
    favoriteUserCloseButton.addEventListener("click", closeLoginModal);
  }

  if (favoriteUserModal) {
    favoriteUserModal.addEventListener("click", (event) => {
      if (event.target.dataset.closeModal === "true") closeLoginModal();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !favoriteUserModal.hidden) closeLoginModal();
    });
  }

  if (favoriteUserLoginButton) {
    favoriteUserLoginButton.addEventListener("click", () => {
      const enteredName = favoriteUserNameInput?.value.trim();
      if (!enteredName) {
        favoritesStatus.textContent = "Enter a name before logging in to create a separate favourites list.";
        return;
      }

      try {
        window.localStorage.setItem(currentUserNameKey, enteredName);
        applyUserLoginState();
        loadFavoritesForCurrentUser();
        closeLoginModal();
      } catch {
        favoritesStatus.textContent = "The user login could not be saved. Browser storage may be blocked or damaged.";
      }
    });
  }

  if (favoriteUserLogoutButton) {
    favoriteUserLogoutButton.addEventListener("click", () => {
      try {
        window.localStorage.removeItem(currentUserNameKey);
        applyUserLoginState();
        loadFavoritesForCurrentUser();
        closeLoginModal();
      } catch {
        favoritesStatus.textContent = "The user could not be switched back to guest mode.";
      }
    });
  }

  favoritesStatus.hidden = false;
  applyUserLoginState();
  try {
    loadFavoritesForCurrentUser();
  } catch {
    favoritesStatus.textContent = "Favorites could not be loaded. Browser storage may be blocked or damaged; see the README for recovery steps.";
  }

  window.addEventListener("storage", (event) => {
    if (event.key !== null && event.key !== currentUserNameKey && event.key !== getFavoritesStorageKeyForUser(getCurrentUserName())) return;
    try {
      if (event.storageArea !== window.localStorage) return;
      applyUserLoginState();
      const { favorites, expired } = readFavorites(getCurrentUserName());
      renderFavorites(favorites);
      favoritesStatus.textContent = expired
        ? `Your favourites for ${getCurrentUserName()} expired after one week and have been reset.`
        : `Favorites updated for ${getCurrentUserName()}.`;
    } catch {
      favoritesStatus.textContent = "Favorites could not be refreshed. Browser storage may be blocked or damaged; see the README for recovery steps.";
    }
  });
}
