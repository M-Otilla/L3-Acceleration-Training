# Daily Log — Week 2

Participant: Michael Roy M. Otilla
Track: Developers
Primary tool: Co-pilot
Second tool (cross-check): ---

Git Repo: `https://github.com/M-Otilla/L3-Acceleration-Training`

Copy this file into your Google Drive folder (see the folder structure in
`shared/tracker-template.md`) and fill in one entry per day. Five entries by
end of week, logged the same day as the work — both are Floor items for
`week2/activity1/README.md`.

Week 2 is about validation, so each entry records an AI-generated artifact
and what checking it actually found. "Checked" is not an outcome; name what
each check turned up. An entry where every check passed is still a valid
entry — but if nothing was caught all week, the checks weren't real.

The 6 checks: **Source, Scope, Spec, Cross-check, Run, Log.**

---

## Entry 1 — 2026-09-16
- **AI-generated artifact (what it produced, for what real task):** Added a duplicate-email guard to the newsletter forms on both website pages. Used localStorage as a pretend database, normalized emails by trimming whitespace and lowercasing, and added duplicate, success, and storage-error feedback. Also produced seven regression tests, updated `README.md`, and recorded verification in `CHECKS.md`.
- **Tool that generated it:** OpenCode
- **Checks I ran (which of the 6):** Source, Scope, Spec, Cross-check, Run, and Log.
- **What they found:** The implementation matched the clarified browser-only demo requirement. All seven regression tests, both JavaScript syntax checks, and the commit whitespace check passed. No blocking defects were found for sequential signups. Corrupted-storage recovery guidance could be clearer, real-browser testing remains outstanding, and simultaneous cross-tab submissions are not atomic.
- **Verdict — accepted / fixed / rejected / re-prompted:** Accepted for demo use, with the documented limitations and browser-testing gap.
- **Evidence link:** `https://github.com/M-Otilla/L3-Acceleration-Training/blob/main/CHECKS.md`

---

## Entry 2 — 2026-09-17

- **AI-generated artifact (what it produced, for what real task):** Added a favourites feature to the restaurant menu: heart-icon controls for all 16 dishes, browser LocalStorage persistence, a Favourites navigation tag, and a filtered view showing all saved menu items.
- **Tool that generated it:** Copilot VS code Chat
- **Checks I ran (which of the 6):** Source, Scope, Spec, Cross-check, Run, and Log.
- **What they found:** Source review confirmed the feature was wired across `menu.html`, `script.js`, and `styles.css`. Scope review found only the intended menu files changed and all 16 dishes had stable IDs. Spec and cross-check review confirmed consistent LocalStorage usage, accessible heart-button state, and `#favorites` navigation. JavaScript syntax, diff, workspace diagnostics, and browser checks passed. The available newsletter test file had no runnable tests, so no dedicated automated favourites test suite was available.
- **Verdict — accepted / fixed / rejected / re-prompted:** Accepted after a small accessibility fix that updated the heart button's `aria-label` when a dish was selected or removed.
- **Evidence link:** `personal approach/favourite-feature-check.md`

---

## Entry 3 — 2026-09-18

- **AI-generated artifact (what it produced, for what real task):** Created a per-user favourites profile for the La Tavola menu so different users can keep separate saved dishes, with a themed login popup, user-specific LocalStorage keys, and a one-week expiry reset for each profile.


- **Tool that generated it:** Copilot AI assistant
- **Checks I ran (which of the 6):** None (I am not satisfied with the output checks)
- **What they found:** The implementation of favourites using a 7-day expiry logic works as intended, but the user-specific implementation of the expiry logic is not yet up to my satisfaction and would need refinement to better meet the intended experience.
- **Verdict — accepted / fixed / rejected / re-prompted:** re-prompted
- **Evidence link:**: N/A

---

## Entry 4 — 2026-09-21

- **AI-generated artifact (what it produced, for what real task):** Added a registration/login flow to the restaurant site, including a header-based auth modal with Full Name, Mobile Number, and Email Address fields, a welcome state that changes to `Welcome ${LastName}` after login, and a sticky right-side Reserve a Table CTA. The work also removed the duplicate reserve link in the hero section and updated the logged-in header button styling to remove the red background and add an underline.
- **Tool that generated it:** Copilot
- **Checks I ran (which of the 6):** Source, Scope, Spec, Cross-check, Run, and Log.
- **What they found:** Source review confirmed the changes were in `index.html`, `script.js`, and `styles.css`. Scope review showed only app-level UI files changed. Spec review showed the required fields, header login behavior, welcome-state logic, sticky CTA placement, and 7-day favourites logic remained aligned with the request. Cross-check confirmed the auth modal, session storage keys, and button styling were consistent across files. Browser run checks confirmed the modal opened, registration accepted the required fields, the logged-in state switched to `Welcome Doe`, and the sticky reserve button rendered on the right without the duplicate hero link. A syntax check also passed for the JavaScript file.
- **Verdict — accepted / fixed / rejected / re-prompted:** Accepted and fixed after verifying the logged-in button styling and sticky reserve CTA behavior in the browser.
- **Evidence link:** `personal approach/Profiles.md`

---

## Entry 5 — YYYY-MM-DD

- **AI-generated artifact (what it produced, for what real task):**
- **Tool that generated it:**
- **Checks I ran (which of the 6):**
- **What they found:**
- **Verdict — accepted / fixed / rejected / re-prompted:**
- **Evidence link:**

---

## This week's full Validation Checklist run (Activity 1)

All 6 checks against one real AI-generated artifact from your own work — not
a demo example. Each check needs a documented outcome, and at least one of
them has to have actually caught something.

- **Documented in entry #:**
- **The artifact, and the real task it was for:**
- **Tool that generated it:**
- **Source — where the output came from, what it was based on:**
- **Scope — what it touches, what it does not:**
- **Spec — checked against the real docs/types; what they say:**
- **Cross-check — second tool used, and what it said:**
- **Run — what happened when it actually ran:**
- **Log — where this is recorded, logged same day (Y/N):**
- **Which check caught something, and what:**
- **What I did as a result:**

---

## This week's AI-wrong case (Activity 2)

Brought to Wednesday's group share. The exact output, not a paraphrase from
memory.

- **Documented in entry #:**
- **What AI was helping with:**
- **Exact AI output that was wrong (quoted verbatim):**
- **What was actually true, with evidence (docs, types, test run):**
- **How I caught it (which check, what tipped me off):**
- **What I did differently — fixed / rejected / re-prompted:**
- **What I'd change up front next time so it doesn't happen again:**

---

## This week's pre-acceptance check (Activity 3)

One real destructive or high-stakes action — a migration, a deploy, a bulk
data change, a customer-facing fix — checked *before* it ran.

- **Documented in entry #:**
- **The action, and whether it was AI-generated or AI-assisted:**
- **"What exactly will this do, and to what?" — answered before it ran:**
- **Blast radius (rows, users, environments, customers affected):**
- **What the check caught, or confirmed was safe:**
- **Did it change what I did (Y/N), and how:**

---

## Gate readiness (self-check before Friday)

- **6-check checklist recited from memory, unaided (Y/N):**
- **≥1 concrete AI-wrong case documented (Y/N):**
- **Have not used the phrase "AI has never been wrong" this week (Y/N):**
- **All outputs uploaded to my Drive folder (Y/N):**
