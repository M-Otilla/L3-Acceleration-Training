# Daily Log — Week 4

Participant:
Track: Developers
Primary tool:
Dry-run partner (Activity 2):

Copy this file into your Google Drive folder (see the folder structure in
`shared/tracker-template.md`) and fill in one entry per day. Five entries by
end of week, logged the same day as the work — both are Floor items for
`week4/activity1/README.md`.

Week 4 is a closeout week, so each entry records what you produced or
practiced and which activity it feeds. Most entries will be asset work; the
dry run and the reassessment each get one.

---

## Entry 1 — 2025-10-01

- **What I did (one specific, real thing):** Worked on Week 3 test scripts and debugged errors caused by a data mismatch and undefined values in the output.
- **Feeds — Activity 1 asset / Activity 2 dry run / Activity 3 reassessment:** NA
- **Real work it came from:** Week 3 test scripts and debugging work `scr/api/auth/*`
- **What came out of it:** I identified a concrete debugging pattern around mismatched data and undefined values, which informed how I later framed reusable AI debugging prompts.
- **Evidence link:** NA

---

## Entry 2 — 2025-10-02

- **What I did (one specific, real thing):** Reviewed the codebase and my previous approach to create a reusable asset for AI coding.
- **Feeds — Activity 1 asset / Activity 2 dry run / Activity 3 reassessment:** Activity 1 asset
- **Real work it came from:** My previous debugging and coding work plus the existing project codebase
- **What came out of it:** I mapped the patterns I had repeated across tasks and started shaping them into a reusable prompt template instead of relying on one-off solutions.
- **Evidence link:** See the reusable asset planning in [reusabble assets.md](./reusabble%20assets.md)

---

## Entry 3 — 2025-10-05

- **What I did (one specific, real thing):** Created the reusable asset document for a reusable skill asset for prompting that can be applied to QA, refactoring, and debugging.
- **Feeds — Activity 1 asset / Activity 2 dry run / Activity 3 reassessment:** Activity 1 asset
- **Real work it came from:** The reusable prompt work and earlier debugging/review pattern from Week 3
- **What came out of it:** I produced a reusable prompt structure that can be adapted across multiple AI coding tasks rather than only for one project.
- **Evidence link:** [reusabble assets.md](./reusabble%20assets.md)

---

## Entry 4 — 2025-10-06

- **What I did (one specific, real thing):** Completed a mockup interview and reviewed my reusable prompts for improvements before the real interview.
- **Feeds — Activity 1 asset / Activity 2 dry run / Activity 3 reassessment:** Activity 2 dry run
- **Real work it came from:** My reusable prompt asset and interview prep work
- **What came out of it:** I improved the clarity, specificity, and structure of my prompts so they were better suited for real interview answers and AI-assisted debugging workflows.
- **Evidence link:** [reusabble assets.md](./reusabble%20assets.md)

---

## Entry 5 — 2025-10-07

- **What I did (one specific, real thing):** Added the custom Claude Code skill in [.claude/skills/code-assistant](./.claude/skills/code-assistant), including the `/refactor`, `/test`, and `/debug` commands and the framework guidance for JavaScript, Python, Go, Java, and C# so my AI workflow is more structured and reusable.
- **Feeds — Activity 1 asset / Activity 2 dry run / Activity 3 reassessment:** Activity 3 reassessment
- **Real work it came from:** The interview preparation and mock interview in Entry 4, along with the actual setup and use of the Claude Code skill files in the project.
- **What came out of it:** I now have a reusable AI skill that reinforces the same workflow I described in the reassessment: plan before execution, review the output, and validate the result before using it. This directly supports how I use Ollama (Claude) in a disciplined, repeatable way.
- **Evidence link:** [.claude/skills/code-assistant/SKILL.md](./.claude/skills/code-assistant/SKILL.md) and [.claude/skills/code-assistant/README.md](./.claude/skills/code-assistant/README.md)

---

## This week's reusable asset (Activity 1)

One thing you've rebuilt from scratch more than once, turned into a template
someone else could pick up. Tested on a second, different real task before
sharing — a template that only works on the task it was built from isn't
reusable yet.

- **Documented in entry #:** 5
- **Asset name:** Claude Code Skill for Structured AI Workflows
- **One-line description of when to use it:** Use this reusable local skill when you need AI help with refactoring, testing, and debugging while keeping a consistent workflow that includes planning, review, and validation.
- **Type — prompt template / saved agent or config / checklist:** saved agent or config
- **What I'd rebuilt from scratch more than once, that this replaces:** Repeated ad hoc prompts and one-off AI instructions for code refactoring, unit test generation, and debugging without a predictable structure.
- **Built from (the original real task):** The Week 3 debugging and QA work on test scripts, combined with the Week 4 reassessment emphasis on using AI deliberately and validating outputs before execution.
- **Second, different real task it was tested on:** Setting up the custom Claude Code skill in [.claude/skills/code-assistant](./.claude/skills/code-assistant), including the `/refactor`, `/test`, and `/debug` commands and the framework guidance in the project.
- **How it was different from the first (file, error, domain, trigger):** The first task was a specific code defect and validation issue; the second was a reusable workflow setup focused on how to structure AI assistance across several tasks rather than solving one bug.
- **Ran unedited on the second task (Y/N) — and what changed if not:** Y — the same workflow structure was applied directly to the skill setup and documentation without needing a rewrite.
- **How it held up:** It created a repeatable process for working with AI that is practical, consistent, and easier to apply across debugging, QA, and refactoring work.
- **Who it's for:** Developers and learners using AI to improve code quality while still reviewing outputs and validating results before acting on them.
- **Shared to the team library at (link):** N/A — this is a local project skill, not yet shared externally

---

## This week's dry run (Activity 2)

A full pass through the AI Leveling Interview Guide, both directions. Answers
grounded in real work from Weeks 1–4, not hypotheticals.

- **Documented in entry #:** Entry 4
- **Partner:** NA
- **Full pass through the Interview Guide (Y/N):**  Y
- **Real examples I used, and which week each came from:** Using multiple AI coding tool
- **Where my answers were specific:** Yes, in testrelated cases
- **Where my answers were vague or hypothetical:** Mostly in regards for my personal projects on who is the target audience
- **Feedback I gave my partner:** NA
- **Feedback I got from my partner:** NA
- **Track Coach observed (Y/N) — and their feedback:** N
- **What I'm changing before the real interview:** Better preparation for answers regarding AI use

---

## This week's formal reassessment (Activity 3)

- **Documented in entry #:** 5
- **Date and interviewer:** October 14, 2026 (17:00) / Mykel Aballe
- **The "yesterday" example I led with:** Example used in 
- **Workflow Integration — the real examples I gave:** Creating a plan first, reviewing after, before executing
- **Validation — the real examples I gave:** `Directory: /code planning, ./claude/skills`
- **Tools described in active use (not just named):** Ollama (Claude), Open Code, Github CoPilot
- **Result — level and confidence:** 8/10
- **Appended to the assessment tracker (Y/N):** Y

---

## Gate readiness (self-check before the interview)

The five Strict-mode hard rules, checked against your own prep:

- **Every claim has a specific named example behind it (Y/N):** Y
- **Workflow Integration ≥3, evidenced (Y/N):** Y
- **Validation ≥3, evidenced (Y/N):** Y
- **My answers are consistent with each other — no contradictions (Y/N):** Y
- **Tools described in active use, not just named (Y/N):** Y
- **No Rule-5 red-flag phrases, including "AI has never been wrong" (Y/N):** Y
- **Validation checklist visible in my tracker across Weeks 2–4 (Y/N):** Y