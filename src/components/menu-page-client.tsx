"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { menuCategories } from "@/lib/menu-data";

const CURRENT_USER_NAME_KEY = "la-tavola-current-user-name";
const FAVORITES_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

function normalizeUserKey(value: string) {
  return String(value ?? "guest")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "guest";
}

function getCurrentUserName() {
  if (typeof window === "undefined") {
    return "guest";
  }

  const saved = window.localStorage.getItem(CURRENT_USER_NAME_KEY);
  return saved ? saved.trim() : "guest";
}

function getFavoritesStorageKeyForUser(userName = getCurrentUserName()) {
  return `la-tavola-menu-favorites-${normalizeUserKey(userName)}`;
}

function readFavorites(userName = getCurrentUserName()) {
  if (typeof window === "undefined") {
    return { favorites: new Set<string>(), expired: false };
  }

  const storageKey = getFavoritesStorageKeyForUser(userName);
  const saved = window.localStorage.getItem(storageKey);
  if (saved === null) {
    return { favorites: new Set<string>(), expired: false };
  }

  try {
    const parsed = JSON.parse(saved);
    const ids = Array.isArray(parsed) ? parsed : parsed?.ids;
    const expiresAt = typeof parsed?.expiresAt === "number" ? parsed.expiresAt : null;

    if (!Array.isArray(ids) || !ids.every((id) => typeof id === "string" && id.length > 0)) {
      throw new Error("Invalid favorites storage");
    }

    if (expiresAt !== null && Date.now() > expiresAt) {
      window.localStorage.removeItem(storageKey);
      return { favorites: new Set<string>(), expired: true };
    }

    if (Array.isArray(parsed) || expiresAt === null) {
      const nextSet = new Set(ids as string[]);
      window.localStorage.setItem(
        storageKey,
        JSON.stringify({ ids: [...nextSet], expiresAt: Date.now() + FAVORITES_EXPIRY_MS }),
      );
    }

    return { favorites: new Set(ids as string[]), expired: false };
  } catch {
    throw new Error("Invalid favorites storage");
  }
}

function saveFavorites(favorites: Set<string>, userName = getCurrentUserName()) {
  if (typeof window === "undefined") {
    return;
  }

  const storageKey = getFavoritesStorageKeyForUser(userName);
  const payload = {
    ids: [...favorites],
    expiresAt: Date.now() + FAVORITES_EXPIRY_MS,
  };
  window.localStorage.setItem(storageKey, JSON.stringify(payload));
}

function getInitialFavoritesState(userName: string) {
  try {
    const { favorites, expired } = readFavorites(userName);
    return {
      favorites,
      message:
        expired
          ? `Your favourites for ${userName} expired after one week and have been reset.`
          : userName === "guest"
            ? "Favorites are saved under the current guest profile. Log in with a name to keep a separate list."
            : `Favorites for ${userName} loaded.`,
    };
  } catch {
    return {
      favorites: new Set<string>(),
      message:
        "Favorites could not be loaded. Browser storage may be blocked or damaged; see the README for recovery steps.",
    };
  }
}

const filterOptions = [
  { id: "all", label: "All" },
  { id: "favorites", label: "Favourites" },
  { id: "pasta", label: "Pasta" },
  { id: "pizza", label: "Pizza" },
  { id: "antipasti", label: "Antipasti & Salads" },
  { id: "desserts", label: "Desserts" },
] as const;

export function MenuPageClient() {
  const initialUserName = getCurrentUserName();
  const initialFavoritesState = getInitialFavoritesState(initialUserName);
  const [activeFilter, setActiveFilter] = useState(() => {
    if (typeof window === "undefined") {
      return "all";
    }

    const hash = window.location.hash.slice(1);
    if (hash === "favorites") {
      return "favorites";
    }

    return menuCategories.some((category) => category.id === hash) ? hash : "all";
  });
  const [favorites, setFavorites] = useState<Set<string>>(initialFavoritesState.favorites);
  const [favoritesStatus, setFavoritesStatus] = useState(initialFavoritesState.message);
  const [favoriteUserName, setFavoriteUserName] = useState(initialUserName === "guest" ? "" : initialUserName);
  const [favoriteUserModalOpen, setFavoriteUserModalOpen] = useState(false);

  const filterStatus = useMemo(() => {
    const allCount = menuCategories.reduce((total, category) => total + category.items.length, 0);
    const visibleCount =
      activeFilter === "all"
        ? allCount
        : activeFilter === "favorites"
          ? favorites.size
          : menuCategories.find((category) => category.id === activeFilter)?.items.length ?? 0;

    const filterLabel = filterOptions.find((option) => option.id === activeFilter)?.label ?? "All";
    return activeFilter === "favorites"
      ? `Showing ${visibleCount} favourited dishes.`
      : `Showing ${visibleCount} dishes: ${filterLabel === "All" ? "all categories" : filterLabel}.`;
  }, [activeFilter, favorites]);

  const syncFavoritesFromUser = (userName: string) => {
    try {
      const { favorites: loaded, expired } = readFavorites(userName);
      setFavorites(loaded);
      if (expired) {
        setFavoritesStatus(`Your favourites for ${userName} expired after one week and have been reset.`);
        return;
      }

      setFavoritesStatus(
        userName === "guest"
          ? "Favorites are saved under the current guest profile. Log in with a name to keep a separate list."
          : `Favorites for ${userName} loaded.`,
      );
    } catch {
      setFavoritesStatus(
        "Favorites could not be loaded. Browser storage may be blocked or damaged; see the README for recovery steps.",
      );
    }
  };

  useEffect(() => {
    const applyHash = () => {
      const currentHash = window.location.hash.slice(1);
      if (currentHash === "favorites") {
        setActiveFilter("favorites");
        return;
      }

      const nextFilter = menuCategories.some((category) => category.id === currentHash)
        ? currentHash
        : "all";
      setActiveFilter(nextFilter);
    };

    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  useEffect(() => {
    const syncStorage = (event: StorageEvent) => {
      if (
        event.key !== null &&
        event.key !== CURRENT_USER_NAME_KEY &&
        event.key !== getFavoritesStorageKeyForUser(getCurrentUserName())
      ) {
        return;
      }

      const currentName = getCurrentUserName();
      setFavoriteUserName(currentName === "guest" ? "" : currentName);

      try {
        const { favorites: nextFavorites, expired } = readFavorites(currentName);
        setFavorites(nextFavorites);
        setFavoritesStatus(
          expired
            ? `Your favourites for ${currentName} expired after one week and have been reset.`
            : `Favorites updated for ${currentName}.`,
        );
      } catch {
        setFavoritesStatus(
          "Favorites could not be refreshed. Browser storage may be blocked or damaged; see the README for recovery steps.",
        );
      }
    };

    window.addEventListener("storage", syncStorage);
    return () => window.removeEventListener("storage", syncStorage);
  }, []);

  const handleFavoriteToggle = (itemId: string, itemName: string, selected: boolean) => {
    try {
      const currentName = getCurrentUserName();
      const currentFavorites = readFavorites(currentName).favorites;
      const nextFavorites = new Set(currentFavorites);

      if (selected) {
        nextFavorites.delete(itemId);
      } else {
        nextFavorites.add(itemId);
      }

      saveFavorites(nextFavorites, currentName);
      setFavorites(nextFavorites);
      setFavoritesStatus(
        `${itemName} ${selected ? "removed from" : "saved to"} ${currentName === "guest" ? "the guest" : `${currentName}'s`} favourites.`,
      );
    } catch {
      setFavoritesStatus(
        "Favorites could not be saved. Browser storage may be blocked, full, or damaged; see the README for recovery steps.",
      );
    }
  };

  const handleUserLogin = () => {
    const enteredName = favoriteUserName.trim();
    if (!enteredName) {
      setFavoritesStatus("Enter a name before logging in to create a separate favourites list.");
      return;
    }

    try {
      window.localStorage.setItem(CURRENT_USER_NAME_KEY, enteredName);
      setFavoriteUserName(enteredName);
      syncFavoritesFromUser(enteredName);
      setFavoriteUserModalOpen(false);
    } catch {
      setFavoritesStatus("The user login could not be saved. Browser storage may be blocked or damaged.");
    }
  };

  const handleUserLogout = () => {
    try {
      window.localStorage.removeItem(CURRENT_USER_NAME_KEY);
      setFavoriteUserName("");
      syncFavoritesFromUser("guest");
      setFavoriteUserModalOpen(false);
    } catch {
      setFavoritesStatus("The user could not be switched back to guest mode.");
    }
  };

  const visibleCategories = menuCategories.filter((category) => {
    if (activeFilter === "all") {
      return true;
    }

    if (activeFilter === "favorites") {
      return category.items.some((item) => favorites.has(item.id));
    }

    return category.id === activeFilter;
  });

  return (
    <div className="container menu-content">
      {favoriteUserModalOpen ? (
        <div className="favorites-login-modal" role="dialog" aria-modal="true" aria-labelledby="favorite-user-modal-title">
          <div
            className="favorites-login-backdrop"
            data-close-modal="true"
            onClick={() => setFavoriteUserModalOpen(false)}
          />
          <div className="favorites-login-dialog">
            <button
              type="button"
              className="favorites-login-close"
              aria-label="Close favourites profile"
              onClick={() => setFavoriteUserModalOpen(false)}
            >
              &times;
            </button>
            <p className="eyebrow">Welcome to the table</p>
            <h2 id="favorite-user-modal-title">Choose a favourites profile</h2>
            <label htmlFor="favorite-user-name">Your name</label>
            <input
              id="favorite-user-name"
              type="text"
              value={favoriteUserName}
              onChange={(event) => setFavoriteUserName(event.target.value)}
              placeholder="Enter your name"
              autoComplete="name"
            />
            <div className="favorite-user-actions">
              <button type="button" className="button" onClick={handleUserLogin}>
                Log in
              </button>
              {favoriteUserName ? (
                <button type="button" className="button button-outline" onClick={handleUserLogout}>
                  Log out
                </button>
              ) : null}
            </div>
            <p id="favorite-user-status" aria-live="polite">
              {favoriteUserName
                ? `Signed in as ${favoriteUserName}. Your favourites stay separate from other accounts.`
                : "Signed in as guest. Favorites are stored separately for each user."}
            </p>
          </div>
        </div>
      ) : null}

      <nav className="category-nav" aria-label="Menu categories">
        <ul>
          <li>
            <Link href="/menu#favorites">
              <span aria-hidden="true">&hearts;</span> Favourites
            </Link>
          </li>
          {menuCategories.map((category) => (
            <li key={category.id}>
              <Link href={`/menu#${category.id}`}>
                <span aria-hidden="true">{category.number}</span> {category.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="menu-filters" role="group" aria-label="Filter menu by category">
        {filterOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            data-filter={option.id}
            aria-pressed={activeFilter === option.id}
            onClick={() => {
              const nextValue = option.id;
              setActiveFilter(nextValue);
              if (nextValue === "all") {
                window.history.replaceState({}, "", "/menu");
                return;
              }

              if (nextValue === "favorites") {
                window.history.replaceState({}, "", "/menu#favorites");
                return;
              }

              window.history.replaceState({}, "", `/menu#${nextValue}`);
            }}
          >
            {option.label}
          </button>
        ))}
      </div>

      <p className="filter-status" role="status" aria-live="polite" aria-atomic="true">
        {filterStatus}
      </p>
      <p id="favorites-status" className="favorites-status" role="status" aria-live="polite" aria-atomic="true">
        {favoritesStatus}
      </p>
      <p className="preview-note">
        <strong>A taste of what&apos;s to come.</strong> This is a sample menu. All dishes, prices in PHP, and badges are placeholders pending confirmation.
      </p>

      {visibleCategories.map((category) => (
        <section key={category.id} id={category.id} className="menu-category" aria-labelledby={`${category.id}-heading`}>
          <div className="category-heading">
            <span className="category-number" aria-hidden="true">
              {category.number}
            </span>
            <div>
              <h2 id={`${category.id}-heading`}>{category.title}</h2>
              <p>{category.subtitle}</p>
            </div>
            <span className="category-aside" aria-hidden="true">
              {category.aside}
            </span>
          </div>

          <ul className="menu-grid">
            {category.items.map((item) => {
              const selected = favorites.has(item.id);
              const shouldHide = activeFilter === "favorites" && !selected;

              return (
                <li key={item.id} className="menu-card" data-dish-id={item.id} hidden={shouldHide}>
                  <div className="item-heading">
                    <h3>{item.name}</h3>
                    <span className="price">{item.price}</span>
                  </div>
                  <p>{item.description}</p>
                  {item.badges?.map((badge) => (
                    <span
                      key={`${item.id}-${badge.label}`}
                      className={`badge ${badge.variant === "special" ? "badge-special" : ""} ${badge.variant === "spicy" ? "badge-spicy" : ""}`}
                    >
                      {badge.label}
                    </span>
                  ))}
                  <button
                    type="button"
                    className="favorite-button"
                    aria-label={selected ? `Remove ${item.name} from favorites` : `Add ${item.name} to favorites`}
                    aria-pressed={selected}
                    onClick={() => handleFavoriteToggle(item.id, item.name, selected)}
                  >
                    {selected ? "Favorited" : "Favorite"}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <p className="allergy-note">
        <strong>A note for your table.</strong> Please discuss allergies and dietary requirements with the restaurant before ordering. Sample badges are not verified dietary or allergen guarantees.
      </p>
      <aside className="menu-invitation" aria-labelledby="invitation-heading">
        <div>
          <p className="eyebrow">Make an occasion of it</p>
          <h2 id="invitation-heading">Your table is waiting.</h2>
        </div>
        <Link className="button" href="/#reservations">
          Reserve a Table <span aria-hidden="true">&nearr;</span>
        </Link>
      </aside>

      <button
        type="button"
        className="button button-small favorite-profile-trigger"
        onClick={() => setFavoriteUserModalOpen(true)}
      >
        Favourites profile
      </button>
    </div>
  );
}

