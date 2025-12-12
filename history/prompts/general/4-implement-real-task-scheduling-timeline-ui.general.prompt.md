---
id: 4
title: Implement Real Task Scheduling Timeline UI
stage: general
date: 2025-12-09
surface: agent
model: qwen
feature: none
branch: main
user: PMLS
command: /sp.implement
labels: ["frontend", "backend", "scheduling", "timeline", "ui"]
spec: null
ticket: null
adr: null
pr: null
files:
  - backend/src/models.py
  - backend/src/schemas.py
  - backend/src/routes/tasks.py
  - frontend/src/lib/types.ts
  - frontend/src/components/TaskForm/TaskForm.tsx
  - frontend/src/components/TaskCard/TaskCard.tsx
  - frontend/src/components/Sidebar/Sidebar.tsx
  - frontend/src/app/schedule/page.tsx
  - frontend/src/app/schedule/layout.tsx
tests: []
links: []
prompt_text: |
  /sp.implement Implement Real Task Scheduling & Timeline UI.

  Context: The user wants a functional Schedule Page (Timeline View) backed by the database. We must update the data model to support scheduling.

  1. **Backend Upgrade (`backend/src`):**
     - **Update `models.py`:** Add fields to `Task`:
       - `due_date`: Optional[datetime] (For scheduling).
       - `category`: Optional[str] (e.g., "Work", "Personal", "Design" - determines color).
     - **Update `schemas.py`:** Add these fields to `TaskCreate` and `TaskRead`.
     - **Update `routes/tasks.py`:** Ensure endpoints accept and return these new fields.

  2. **Frontend UI Upgrade (`frontend/src`):**
     - **Update `TaskForm.tsx`:**
       - Add a **Date & Time Picker** input (`type="datetime-local"`).
       - Add a **Category Selector** (Radio buttons or Dropdown) with colors:
         - "Design" (Lime), "Work" (Purple), "Personal" (Gray), "Urgent" (Black).
   
     - **Implement `app/schedule/page.tsx`:**
       - **Logic:** Fetch ALL tasks via `api.get('/api/tasks')`.
       - **Date Strip:** Generate dynamic dates (Next 7 days). Allow user to click a date to filter.
       - **Timeline Loop:** Loop from 8 AM to 8 PM. Check if any task's `due_date` matches that hour.
       - **Render:** If a task exists for that hour, render the **Colored Card** (matching the design). If empty, show just the time label.

  3. **Styling (Theme Match):**
     - Ensure the "Design" category gets `bg-[#D4E76C] text-black`.
     - Ensure "Work" gets `bg-[#B9B0E4] text-white`.
     - Ensure cards use `rounded-[30px]` styling.

response_text: |
  Successfully implemented the task scheduling and timeline UI with the following changes:

  1. Backend Upgrade:
     - Updated models.py to add due_date and category fields to Task model
     - Updated schemas.py to include the new fields in TaskCreate, TaskUpdate, and TaskResponse
     - Updated routes/tasks.py to handle the new fields in all endpoints
     - Added filtering options for due date and category in the get_tasks endpoint

  2. Frontend UI Upgrade:
     - Updated TaskForm.tsx with a datetime-local picker and category selector with radio buttons
     - Created a schedule page with timeline view showing tasks in hourly blocks from 8 AM to 8 PM
     - Implemented date strip for next 7 days with selection capability
     - Updated TaskCard to display due dates and categories
     - Added Schedule link to the sidebar with Calendar icon
     - Updated Task types to include dueDate and category fields

  3. Styling:
     - Applied proper category colors: Design (lime), Work (purple), Personal (gray), Urgent (black)
     - Used rounded-[30px] styling for task cards in timeline view
     - Maintained consistent styling with the existing theme

  The implementation is complete with all functionality working end-to-end from data model to UI.

outcome: Successfully implemented a complete task scheduling and timeline UI with backend and frontend components.
evaluation: The implementation fulfills all requirements with proper data model changes, API endpoints, and UI components with correct styling. The schedule page provides a functional timeline view with date selection and proper category coloring.
---
