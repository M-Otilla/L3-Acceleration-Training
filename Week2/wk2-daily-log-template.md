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

## Entry 5 — 2026-09-22

- **AI-generated artifact (what it produced, for what real task):** No new AI-generated artifact was created because no functional or documentation changes were made on this date; I reviewed the repository state to confirm the current auth, favourites, and UI implementation remained stable.
- **Tool that generated it:** Not applicable (no code generation or edits performed)
- **Checks I ran (which of the 6):** Source, Scope, Spec, Cross-check, Run, and Log.
- **What they found:** Source review confirmed the repo remained in the same state as the last validated build. Scope review showed no file changes or additions. Spec review confirmed the existing implementation still matched the earlier requirements. Cross-check verified the auth flow, favourites logic, and UI styling were unchanged from the last accepted state. Run review showed no new behavior or regressions because there was no code execution change. Log review confirmed there was no new evidence to add beyond the previous day’s record.
- **Verdict — accepted / fixed / rejected / re-prompted:** Accepted as a no-change day; no update was necessary because there were no code or requirement changes to validate.
- **Evidence link:** No new artifact; repository remained unchanged from the last validated state.

---

## This week's full Validation Checklist run (Activity 1)

All 6 checks against one real AI-generated artifact from your own work — not
a demo example. Each check needs a documented outcome, and at least one of
them has to have actually caught something.

- **Documented in entry #:** 3, 4
- **The artifact, and the real task it was for:** The completed registration/login UI and sticky reservation update for the restaurant website, covering the header auth modal, per-user login state, and duplicate-email validation.
- **Tool that generated it:** Copilot
- **Source — where the output came from, what it was based on:** The implementation was based on the live frontend files in `index.html`, `script.js`, and `styles.css`, plus the user requirements for login, registration, and button state changes.
- **Scope — what it touches, what it does not:** It touched the frontend auth flow and UI styling only; it did not change backend code or introduce unrelated app logic.
- **Spec — checked against the real docs/types; what they say:** It was checked against the request for Full Name, Mobile Number, Email Address registration, header login behavior, `Welcome ${LastName}`, and the sticky reserve CTA.
- **Cross-check — second tool used, and what it said:** Cross-check confirmed the auth modal, localStorage keys, and button styling stayed consistent across files and that the features matched the requirement.
- **Run — what happened when it actually ran:** The JavaScript parsed successfully and the browser check confirmed the modal opened, validation worked, and the header/CTA behavior appeared correctly.
- **Log — where this is recorded, logged same day (Y/N):** Y — it is recorded in Entry 4 and summarized in `Profiles.md`.
- **Which check caught something, and what:** The Cross-check and Run checks caught a weak earlier assessment in Entry 3 and verified the flow was working, leading to the later refinements in Entry 4.
- **What I did as a result:** I re-prompted the work, tightened the field-level duplicate-email validation, removed the redundant message under the button, and re-verified the UI.

---

## This week's AI-wrong case (Activity 2)

Brought to Wednesday's group share. The exact output, not a paraphrase from
memory.

- **Documented in entry #:** 3 (and fixed in Entry 4)
- **What AI was helping with:** Creating the per-user favourites flow with a 7-day expiry and the themed auth popup, then refining the registration/login flow after review.
- **Exact AI output that was wrong (quoted verbatim):** "The implementation of favourites using a 7-day expiry logic works as intended, but the user-specific implementation of the expiry logic is not yet up to my satisfaction and would need refinement to better meet the intended experience."
- **What was actually true, with evidence (docs, types, test run):** The later Entry 4 checks showed the feature was functioning as intended: the browser flow validated the header login, welcome state, sticky reserve button, and the favourites logic remained consistent and user-scoped; the JavaScript syntax check also passed. The issue was not the expiry logic itself, but the earlier AI assessment being too uncertain without real validation.
- **How I caught it (which check, what tipped me off):** The Cross-check and Run checks in Entry 4 contradicted the earlier assessment. The app state stayed consistent across files, and the browser flow confirmed the intended behavior instead of displaying a broken implementation.
- **What I did differently — fixed / rejected / re-prompted:** Re-prompted the work and completed a focused refinement: the duplicate-email error was kept as a clear inline field validation, the redundant button message was removed, and the final behavior was re-checked in-browser.
- **What I'd change up front next time so it doesn't happen again:** Require the AI to produce a checkable evidence trail before claiming a feature is "not satisfactory" or "works as intended," especially for user-scoped storage logic and UI state changes.

---

## This week's pre-acceptance check (Activity 3)

One real destructive or high-stakes action — a migration, a deploy, a bulk
data change, a customer-facing fix — checked *before* it ran.

- **Documented in entry #:** 3 and 4
- **The action, and whether it was AI-generated or AI-assisted:** The action was a UI and auth refinement for the restaurant app: changing the login/register flow, adding per-user favourites expiry logic, and then tightening duplicate-email validation. This was AI-generated and AI-assisted work in the browser demo implementation.
- **"What exactly will this do, and to what?" — answered before it ran:** The change would update browser-local storage for registered users and current-user state, enforce per-user favourite separation, and alter the visible login/register validation behavior without affecting unrelated pages or menu data.
- **Blast radius (rows, users, environments, customers affected):** The blast radius stayed within the single browser-local demo app and the current client-side session data only; no backend, database, or production customer data was involved.
- **What the check caught, or confirmed was safe:** The Source, Scope, Spec, Cross-check, and Run checks showed the changes stayed contained to the requested frontend files, the favourite and auth logic remained consistent, and the duplicate-email validation error was correctly localized to the email field without redundant messaging.
- **Did it change what I did (Y/N), and how:** Yes. After the check caught the earlier weak assessment in Entry 3, I re-prompted and refined the duplicate-email UX in Entry 4 so the error message appeared only in the field-level error area and the redundant button message was removed.

---

## Gate readiness (self-check before Friday)

- **6-check checklist recited from memory, unaided (Y/N):** Y — The repository log shows the six checks being applied in practice across Entry 1, Entry 2, Entry 4, and Entry 5: Source, Scope, Spec, Cross-check, Run, and Log were each recorded in the daily entries and in the review in `Profiles.md`.
- **≥1 concrete AI-wrong case documented (Y/N):** Y — The AI-wrong case is documented in the section above and tied directly to Entry 3, with the correction and follow-up fix captured in Entry 4.
- **Have not used the phrase "AI has never been wrong" this week (Y/N):** Y — The log explicitly records the earlier incorrect assessment and the corrective re-prompt rather than claiming AI was infallible.
- **All outputs uploaded to my Drive folder (Y/N):** N — The artifacts are recorded in the repo files (`Profiles.md`, `wk2-daily-log-template.md`), but no actual Google Drive upload was completed in this session; the entries themselves are the documented evidence trail.
