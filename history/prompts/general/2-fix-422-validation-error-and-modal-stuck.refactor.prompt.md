---
id: 2
title: Fix-422-Validation-Error-And-Modal-Stuck-Issue
stage: refactor
date: 2025-12-09
surface: agent
model: Qwen
feature: task-management
branch: main
user: PMLS
command: /sp.implement Fix 422 Validation Error and Modal Stuck Issue
labels: ["bug-fix", "validation", "frontend", "backend"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - C:\Users\PMLS\OneDrive\Desktop\hackathon2\frontend\src\components\TaskForm\TaskForm.tsx
 - C:\Users\PMLS\OneDrive\Desktop\hackathon2\backend\src\schemas.py
tests:
 - null
---

## Prompt

$ARGUMENTS

Context: User gets a 422 error when saving a task because the frontend sends empty strings for date, which the backend rejects. Also, input text visibility needs to be ensured.

1. **Fix `frontend/src/components/TaskForm.tsx` (Payload Logic):**
   - In `handleSubmit`:
     - Create a clean payload object.
     - **Date Logic:** `due_date: dueDate ? new Date(dueDate).toISOString() : null`. (CRITICAL: Send `null`, not `""`).
     - **Category Logic:** `category: category || "Personal"`.
   - **Input Styling:** Ensure all `<input>` and `<textarea>` have explicit `text-gray-900 bg-white border-gray-300` classes so user can see what they type.

2. **Fix `backend/src/schemas.py` (Validation):**
   - Relax constraints:
     ```python
     class TaskCreate(TaskBase):
         title: str
         description: Optional[str] = None
         due_date: Optional[datetime] = None
         category: Optional[str] = "Personal"
     ```

3. **Fix `backend/src/routes/tasks.py`:**
   - Ensure the POST endpoint uses `TaskCreate` schema.

## Response snapshot

Fixed the 422 validation error and modal stuck issue by:

1. Updating the TaskForm to send null instead of empty string for due_date when no date is selected
2. Ensuring category defaults to "Personal" if not provided
3. Updating input styling to ensure text is visible with proper contrast
4. Relaxing backend schema validation to make the category field default to "Personal"

## Outcome

- ✅ Impact: Fixed 422 validation error when saving tasks
- 🧪 Tests: Manual verification needed
- 📁 Files: Updated TaskForm.tsx and schemas.py
- 🔁 Next prompts: Verify functionality end-to-end
- 🧠 Reflection: Proper null handling prevents validation errors in API calls

## Evaluation notes (flywheel)

- Failure modes observed: 422 validation errors due to empty string values
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Test the task creation flow end-to-end
