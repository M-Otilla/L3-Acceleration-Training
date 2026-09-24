# Week 2 Daily Log Explanation

This week’s daily log reflects a focused sequence of changes across the restaurant app: duplicate-email validation, per-user favourites and expiry logic, themed login/register UX, and final review and validation work. The entries were grounded in the actual code changes in the repository and in the browser checks that followed.

## What the logs were tracking

The work covered these main outcomes:

- Duplicate-email protection for browser-local demo data
- User-specific favourites stored separately per profile
- A 7-day expiry reset for saved favourites
- A login/register popup that matches the site theme
- Header login state updates to show `Welcome ${LastName}`
- Sticky reservation CTA and cleanup of duplicate UI controls
- Final validation and issue refinement through the six checks: Source, Scope, Spec, Cross-check, Run, and Log

## Repository history references

### 1) 7-day favourites expiry logic

This is the key expiry behavior added in the menu logic. It stores favourites as a payload with an expiry timestamp and clears them automatically when the week has passed.

```js
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

if (expiresAt !== null && Date.now() > expiresAt) {
  window.localStorage.removeItem(storageKey);
  return { favorites: new Set(), expired: true };
}
```

Source: [script.js](./script.js)

### 2) User-specific auth state and separate favourites profile

The app keeps user state separate by storing a current user and associating favourites with that profile.

```js
const registeredUsersKey = "la-tavola-registered-users";
const currentUserDataKey = "la-tavola-current-user-data";
const currentUserNameKey = "la-tavola-current-user-name";

function setCurrentUser(user) {
  const prepared = {
    fullName: user.fullName,
    lastName: user.lastName || getLastName(user.fullName),
    email: user.email,
    mobileNumber: user.mobileNumber || "",
  };

  window.localStorage.setItem(currentUserDataKey, JSON.stringify(prepared));
  window.localStorage.setItem(currentUserNameKey, prepared.fullName);
}

function updateAuthButton() {
  const user = getCurrentUser();
  if (authButton) {
    const isLoggedIn = Boolean(user);
    authButton.textContent = user ? `Welcome ${user.lastName}` : "Log in";
    authButton.classList.toggle("is-logged-in", isLoggedIn);
  }
}
```

Source: [script.js](./script.js)

### 3) Register form and duplicate-email validation

The registration flow requires Full Name, Mobile Number, and Email Address, and the duplicate-email guard now appears inline under the email field instead of repeating the message below the button.

```js
const users = getRegisteredUsers();
if (users.some((entry) => normalizeEmail(entry.email) === email)) {
  authStatus.textContent = "";
  showFieldError(registerEmailInput, "This email is already registered. Please log in instead.");
  return;
}
```

```html
<label for="register-email">Email Address</label>
<input id="register-email" name="email" type="email" placeholder="name@example.com" autocomplete="email" required aria-invalid="false">
<p class="field-error" id="register-email-error" aria-live="polite"></p>

<button class="button" type="submit">Create account</button>
```

Source: [index.html](./index.html), [script.js](./script.js)

### 4) Login popup and header button behavior

The popup is a modal rather than a page shift, and the button is moved to the header with a welcome-state treatment.

```html
<button id="header-auth-button" class="button button-small header-auth" type="button">Log in</button>
```

```js
function openAuthModal() {
  if (!authModal) return;
  authModal.hidden = false;
  updateAuthButton();
}
```

Source: [index.html](./index.html), [script.js](./script.js)

## Why the daily log entries matter

The ticket history shows a progression from “feature added” to “feature validated” to “feature refined.” The log is not just a list of tasks; it records what the checks actually found. That is why the entries include Source, Scope, Spec, Cross-check, Run, and Log outcomes instead of a generic “done” statement. The key AI-wrong case in the log came from Entry 3, where the tool was too uncertain about the expiry/identity model, and Entry 4 corrects that by verifying the behavior in actual browser checks.

## Prompt snippets used in this session

These are representative prompts from the session that drove the implementation and refinement work.

```text
Add an expiration feature for the favourited menu:
* Create an expiry where the menu will reset after a week
* create a comment where to configure the time
```

```text
Great now create a log in for a different so a different user can have different favourites
```

```text
for the login create a new popup and match the color theme of the website
```

```text
<Registration>
Create a register feature by Email address
For the registration content the requirements should be:
* Full Name
* Mobile Number
* Email Adress
</Registration>
```

```text
<Login>
- For the Login Button move it to the header for a better User experience
- Once the Login button is moved to the top, create a condition to replace the button into Something similar like `Welcome ${user.LastName}`
</Login>
```

```text
Ok Instead of going back to login once you press create account make the "This email is already registered. Please log in instead." stand out more as its an error

Approach to take:
* Make the error message a popup
* Make the error message standout by making the error message appear under the textfield of email address and give the textfield a red borderline
```

## Activity 1 — Full validation checklist

Activity 1 is the formal six-check review: Source, Scope, Spec, Cross-check, Run, and Log. In this project, it was used to review a real artifact from the repository rather than a demo example. The strongest evidence is in Entry 4, where the code was checked against the live frontend files and the browser behavior, and in `Profiles.md`, which records the final validation results.

The purpose of this activity was to prove the generated implementation was not just plausible, but traceable to the source files, limited to the intended scope, aligned with the spec, consistent across related files, and working when run in the browser. This matters because the project involved UI and storage logic, both of which can appear correct in code but fail when the actual browser behavior is checked.

## Activity 2 — AI-wrong case

Activity 2 documents the moment the AI output was not reliable enough to accept without challenge. In this session, that happened in Entry 3: a claim was made that the 7-day favourites expiry logic was not fully satisfactory, even though the subsequent validation work showed the actual logic was working as intended.

This is the exact kind of case that Activity 2 is meant to capture: not a generic mistake, but a concrete wrong conclusion that needed correction. The fix was captured in Entry 4, where the check results contradicted the earlier assessment and the implementation was re-checked until the final behavior matched the request. The log records that the issue was re-prompted and refined instead of being silently accepted.

## Activity 3 — Pre-acceptance check

Activity 3 is the pre-flight safety check before a change is accepted. In this repository, the relevant risk was not a destructive deployment or database migration; instead, it was the client-side auth and validation update that changes local data behavior for new users and duplicate-email handling. Because this was browser-local demo logic, the pre-acceptance check focused on confirming that the change stayed inside the intended frontend files and did not affect unrelated behavior.

The actual pre-acceptance step here was to verify that the login/register updates did not widen the scope beyond the request, and that the duplicate-email validation fix stayed contained to the email field without adding redundant user feedback. That check is reflected in the revised logs and the final validation note: the change was accepted only after confirming the logic remained consistent across `index.html`, `script.js`, and `styles.css` and that the UI behavior was correct in the browser.

## Final note

The Week 2 daily log documents more than just feature creation; it documents the validation process that checked whether the generated code actually matched the requirements and whether the implementation was stable enough to keep. The repository files, especially [wk2-daily-log-template.md](./wk2-daily-log-template.md), [Profiles.md](./Profiles.md), and [script.js](./script.js), together provide a clear record of that process.
