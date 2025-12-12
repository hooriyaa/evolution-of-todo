---
id: 1
title: Fix-TaskForm-Date-Saving-Issue
stage: refactor
date: 2025-12-09
surface: agent
model: Qwen
feature: task-management
branch: main
user: PMLS
command: /sp.implement Fix TaskForm Date Saving Issue
labels: ["bug-fix", "date-handling", "frontend"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - C:\Users\PMLS\OneDrive\Desktop\hackathon2\frontend\src\components\TaskForm\TaskForm.tsx
 - C:\Users\PMLS\OneDrive\Desktop\hackathon2\frontend\src\app\dashboard\page.tsx
 - C:\Users\PMLS\OneDrive\Desktop\hackathon2\frontend\src\lib\types.ts
tests:
 - null
---

## Prompt

$ARGUMENTS

Context: Tasks are being saved with `due_date: null`, which breaks the Schedule page. The form input is not updating the state correctly or sending the wrong format.

1. **Update `frontend/src/components/TaskForm.tsx`:**
   - **State Initialization:** Ensure `dueDate` state is initialized with `""` (empty string), never undefined.
   - **Input Handler:**
     - The `onChange` for the datetime input must directly set the state: `onChange={(e) => setDueDate(e.target.value)}`.
   - **Submit Handler (Crucial):**
     - Before calling API, check if `dueDate` is valid.
     - If valid, convert to ISO string: `const isoDate = new Date(dueDate).toISOString();`
     - **Explicitly log** the payload before sending: `console.log("PAYLOAD SENDING:", { ...taskData, due_date: isoDate })`.
     - Send `due_date` in the API call.

2. **Validation:**
   - Ensure the input type remains `datetime-local`.
   - Ensure `value={dueDate}` is passed to the input.

## Response snapshot

Fixed the TaskForm date saving issue by ensuring:

1. The dueDate state is properly initialized with an empty string
2. The input handler directly updates the state
3. The submit handler properly converts the date to ISO format and sends it as 'due_date' to match backend schema
4. Added explicit logging to verify the payload
5. Updated the parent component (dashboard) to properly handle the payload with the correct field names

## Outcome

- ✅ Impact: Fixed TaskForm date saving issue preventing null due_date values
- 🧪 Tests: Manual verification needed
- 📁 Files: Updated TaskForm.tsx, dashboard/page.tsx, and types.ts
- 🔁 Next prompts: Verify functionality on Schedule page
- 🧠 Reflection: Field name mismatches between frontend and backend schemas can cause subtle bugs

## Evaluation notes (flywheel)

- Failure modes observed: Date field not being sent properly due to field name mismatch
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Run the app to verify the fix works end-to-end
