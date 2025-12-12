---
id: 10
title: Fix Task Scheduling Ensure Due Date is Saved and Displayed
stage: general
date: 2025-12-09
surface: agent
model: qwen
feature: none
branch: main
user: PMLS
command: /sp.implement
labels: ["frontend", "backend", "task-form", "schedule", "date-handling"]
spec: null
ticket: null
adr: null
pr: null
files:
  - frontend/src/components/TaskForm/TaskForm.tsx
  - frontend/src/app/schedule/page.tsx
  - backend/src/schemas.py
tests: []
links: []
prompt_text: |
  /sp.implement Fix Task Scheduling: Ensure Due Date is Saved and Displayed.

  1. **Fix `frontend/src/components/TaskForm.tsx` (CRITICAL):**
     - The `dueDate` state is likely not updating correctly or sending the wrong format.
     - **Update Logic:**
       - Ensure the input `<input type="datetime-local">` has an `onChange` handler that directly updates `setDueDate(e.target.value)`.
       - **On Submit:**
         - Check if `dueDate` has a value.
         - If yes, create a Date object: `const isoDate = new Date(dueDate).toISOString();`
         - Include `due_date: isoDate` in the payload.
         - Log the payload: `console.log("SAVING TASK PAYLOAD:", { ...taskData, due_date: isoDate });`

  2. **Fix `frontend/src/app/schedule/page.tsx` (Timezone Match):**
     - The comparison between Local Time (Browser) and UTC Time (DB) might be strict.
     - **Relaxed Matching:**
       - Get `taskDate` from `task.due_date`.
       - Check: `taskDate.getDate() === selectedDate.getDate()` (Day match).
       - **Timeline Slot:** Ensure we compare `taskDate.getHours()` (Local hours) with the slot index.

  3. **Backend Check (`backend/src/schemas.py`):**
     - Ensure `TaskCreate` and `TaskUpdate` schemas allow `due_date: datetime | None`.
response_text: |
  Successfully implemented fixes for Task Scheduling to ensure Due Date is Saved and Displayed:

  1. Updated TaskForm to properly handle due date:
     - Added the required console log: `console.log("SAVING TASK PAYLOAD:", { ...taskData, due_date: isoDate });`
     - Ensured dueDate is converted to ISO format before submission
     - Fixed the onChange handler to properly update setDueDate

  2. Improved schedule page date comparison:
     - Updated the timeline rendering to properly filter tasks by date and hour
     - Changed from using find() to filter() to support multiple tasks per hour
     - Enhanced the date comparison logic with the isSameDay helper function
     - Properly mapped each task in the time slot

  3. Verified backend schemas:
     - Confirmed that TaskCreate and TaskUpdate schemas correctly allow `due_date: Optional[datetime] = None`
     - Verified that the schemas properly handle datetime inputs

  The implementation now properly saves due dates in ISO format and displays them correctly on the schedule page.
outcome: Fixed task scheduling to ensure due dates are properly saved and displayed on the schedule page.
evaluation: The implementation correctly addresses all issues with proper due date handling in the TaskForm, improved date comparison logic in the schedule page, and verified backend schemas. Tasks with due dates are now properly saved and displayed on the schedule page.
---
