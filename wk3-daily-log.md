# Daily Log — Week 3

Participant: Track: Developers

Copy this file into your Google Drive folder and fill in one entry per day. Five entries by the end of week, logged the same day as the work.

### Repo:
- https://github.com/M-Otilla/L3-Acceleration-Training
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

## Entry 2 — 2026-09-25

- **Activity:** Multi-turn conversion planning and root-level scaffolding for the La Tavola restaurant website. The work focused on preserving the static Week 2 reference as a design source while building a clean Next.js App Router foundation in the repository root. The day included reviewing the live restaurant experience, confirming project structure and dependency choices, generating the root configuration, and validating that the app compiled before moving into feature implementation.

---
AI model used: GitHub Copilot

Task: Shift from the failed one-shot conversion approach to a more controlled multi-turn build strategy for the restaurant website, creating a root-level Next.js application while keeping the original static source intact for reference.

Issues encountered:
* The initial one-shot conversion had already shown that broad, single-prompt generation could drift away from the original design and fail to preserve branding or page hierarchy.
* The project required a careful decision on scope: the static Week 2 files needed to remain untouched while the new app was scaffolded in the repo root.
* The generated stack had to match current tooling requirements, including the correct Tailwind/PostCSS integration and modern Next.js conventions.
* The repo needed a proper App Router structure (`src/app`, `src/components`, `src/DB`, `src/API`, `src/lib`, etc.) with matching configuration and dependency setup before development could continue.
* Linting initially flagged the legacy static folder because the new ESLint configuration was scanning too broadly, which required narrowing validation to the active app scope rather than modifying the original reference implementation.
* Even with a cleaner multi-turn approach, there was still a need to verify build stability, dependency correctness, and file placement before feature work began.

Takeaway:
A multi-turn workflow is significantly more reliable for converting an existing static site into a complex app than a single all-at-once prompt. In this project, the better approach was to first establish a solid root-level foundation, preserve the original La Tavola design as a reference, and validate the scaffold before implementing any dynamic functionality. This reduces design drift, dependency mismatch, and rebuild issues while staying aligned with the original restaurant branding and structure.

Prompt used:
```
User: You are a senior FullStack Next.js Developer.
There will be 10 or more steps that we will go through in converting this Static HTML into a fully dynamic Next.js Application

Tech Stack to be used:
* Framework: Next.js (App Router, Server Components, Server Actions)
* Database: NoSQL (MongoDB)
* Styling: Tailwind (Match the Design that's provided in Week2 Folder)
Step 1:

* Initialize a Next.js Project in the root folder
* Include in the package.json additional tools for MongoDB, Tailwind, and Any necessary package that will be used for this project
* Outline the Project folders under src/(components, action, DB, API, APP, lib )
```

Result:
The multi-turn approach was successful in creating a stable root project scaffold without deleting or altering the static Week 2 site. The repo now includes a Next.js App Router setup with TypeScript, Tailwind, ESLint, MongoDB/Mongoose packages, and the required folder structure. Build and configuration checks passed, and the project is ready for the next stages of implementation and feature migration.

---

## Entry 3 — YYYY-MM-DD

- **Activity:** 

---

## Entry 4 — YYYY-MM-DD

- **Activity:** 

---

## Entry 5 — YYYY-MM-DD

- **Activity:** 