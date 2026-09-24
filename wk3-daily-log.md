# Daily Log — Week 3

Participant: Track: Developers

Copy this file into your Google Drive folder and fill in one entry per day. Five entries by the end of week, logged the same day as the work.

### Branches: 
* Oneshot (Published)
* Multi-turn (WIP)

---

## Entry 1 — 2026- 09-24

- **Activity:** 

---
AI model used: GitHub Copilot

Task: One-shot conversion of the static website into a dynamic full-stack Next.js app using a single prompt.

Issues encountered:
* The one-shot prompt generated an outdated frontend stack and a Tailwind/PostCSS setup that did not match the current Tailwind v4 requirement, causing build errors until the config was updated to use the new `@tailwindcss/postcss` package.
* The generated output did not consistently preserve the original static HTML design; layout styling and visual structure needed manual correction to better match the provided restaurant branding and page hierarchy.
* The initial implementation lacked a fully functional backend layer; MongoDB connectivity was only partially scaffolded, so additional debugging and coding were required to complete the data model and server actions.
* The conversion required compatibility fixes for modern Next.js versions, including updates to config conventions and cookie handling in server actions/components.
* The single prompt consumed a high amount of token usage quickly, increasing from roughly 20% to 50% for a single conversion task, which is more than the typical weekly allowance for a small task.
* Because the prompt was broad and the app requirements were complex, more iterative prompting and manual review were needed to produce a working result.

Takeaway:
A one-shot prompt can be useful for rapid scaffolding and initial project generation, but it is not reliable for production-quality conversion work without follow-up fixes. For this project, the initial one-shot attempt introduced outdated dependencies, incomplete backend wiring, and design drift, which required additional debugging, verification, and refinement. Multi-turn prompting is more efficient and cost-effective for complex migrations like this.

Prompt used:
```
Role & Goal:
  Act as an expert Full-Stack Next.js Developer. Convert my project files
  (located in \personal approach folder) from static HTML website into a dynamic
  full-stack Next.js (App Router) application. Create an admin page that will
  manage both Category and Products. The admin page should be protected by a
  simple login page using env var. Next.js app should be on the root level
  directory and there should be no old files from static HTML website left
  after the conversion.

  Tech Stack:
  - Framework: Next.js (App Router, Server Components, Server Actions)
  - Database: MongoDB
  - Styling: Tailwind CSS (match the provided design exactly)
```

Result:
The one-shot output was rejected as incomplete because the generated design drifted away from the original UI and the backend/data layer was not fully functional. Additional prompt refinement and direct code changes were needed to finish the project but i didnt proceed with it and moved on to the Multi turn Prompt to save tokens.

## Entry 2 — YYYY-MM-DD

- **Activity:** 

---

## Entry 3 — YYYY-MM-DD

- **Activity:** 

---

## Entry 4 — YYYY-MM-DD

- **Activity:** 

---

## Entry 5 — YYYY-MM-DD

- **Activity:** 