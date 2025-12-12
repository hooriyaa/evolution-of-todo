---
id: 4
title: Fix-Schedule-Page-Task-Visibility-Issue-2
stage: refactor
date: 2025-12-09
surface: agent
model: Qwen
feature: schedule-page
branch: main
user: PMLS
command: /sp.implement Fix Schedule page task visibility issue part 2
labels: ["bug-fix", "field-mapping", "frontend"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - C:\Users\PMLS\OneDrive\Desktop\hackathon2\frontend\src\lib\types.ts
 - C:\Users\PMLS\OneDrive\Desktop\hackathon2\frontend\src\app\schedule\page.tsx
 - C:\Users\PMLS\OneDrive\Desktop\hackathon2\frontend\src\components\TaskCard\TaskCard.tsx
tests:
 - null
---

## Prompt

still koi task show nhi ho raha schedule mai

## Response snapshot

Fixed the Schedule page task visibility issue by addressing the field name mismatch between frontend and backend. The backend was returning `due_date` (snake_case) but the frontend was expecting `dueDate` (camelCase).

## Outcome

- ✅ Impact: Fixed task visibility on Schedule page by handling both field naming conventions
- 🧪 Tests: Manual verification needed
- 📁 Files: Updated types.ts, schedule/page.tsx, and TaskCard.tsx
- 🔁 Next prompts: Verify functionality end-to-end
- 🧠 Reflection: Field name consistency between frontend and backend is critical

## Evaluation notes (flywheel)

- Failure modes observed: Field name mismatch causing undefined values
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Test the schedule page with various due dates
