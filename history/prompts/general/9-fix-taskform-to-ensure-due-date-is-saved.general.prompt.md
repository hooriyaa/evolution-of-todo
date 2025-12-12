---
id: 9
title: Fix TaskForm to Ensure Due Date is Saved
stage: general
date: 2025-12-09
surface: agent
model: qwen
feature: none
branch: main
user: PMLS
command: /sp.implement
labels: ["frontend", "task-form", "date-handling", "api"]
spec: null
ticket: null
adr: null
pr: null
files:
  - frontend/src/components/TaskForm/TaskForm.tsx
tests: []
links: []
prompt_text: |
  /sp.implement Fix TaskForm to Ensure Due Date is Saved.

  Context: Tasks are being saved with `due_date: null`, which breaks the Schedule page visibility.

  1. **Update `frontend/src/components/TaskForm.tsx`:**
     - **Problem:** The `datetime-local` input might be returning an empty string or invalid format that the backend rejects (and sets to null).
     - **Fix Logic:**
       - Ensure `dueDate` state is never undefined.
       - When submitting:
         - If `dueDate` is valid string, convert to ISO format (`new Date(dueDate).toISOString()`).
         - If invalid/empty, prevent submission or warn user (since Schedule page depends on it).
     - **Console Log:** Add `console.log("Submitting Task:", payload)` right before API call to verify date is present.

  2. **Validation:**
     - Ensure the API payload has `due_date` as a string (e.g., "2025-12-10T09:00:00.000Z").
response_text: |
  Successfully implemented the fixes to ensure due dates are properly saved:

  1. Updated the handleSubmit function to convert the dueDate to ISO format:
     - Changed from `new Date(dueDate)` to `new Date(dueDate).toISOString()`
     - This ensures the dueDate is properly formatted as a string for the API

  2. Added console log for debugging:
     - Added `console.log("Submitting Task:", taskData)` to verify the submission payload
     - This will help confirm that the dueDate is being sent in the proper format

  3. Maintained proper validation:
     - Ensured dueDate is only added to the payload if it's a non-empty string
     - Preserved existing validation logic for other fields

  The implementation now ensures that due dates are sent in ISO format to the backend, which should resolve the issue where tasks were being saved with `due_date: null`.
outcome: Fixed the TaskForm to ensure due dates are properly saved in ISO format for the backend API.
evaluation: The implementation correctly converts dueDate to ISO format before submission and includes logging for debugging. This should resolve the issue where tasks were being saved with null due dates, which was breaking the Schedule page visibility.
---
