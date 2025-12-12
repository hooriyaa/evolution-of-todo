---
id: 8
title: Fix Schedule Page Task Visibility Date Matching
stage: general
date: 2025-12-09
surface: agent
model: qwen
feature: none
branch: main
user: PMLS
command: /sp.implement
labels: ["frontend", "schedule", "date-handling", "task-visibility"]
spec: null
ticket: null
adr: null
pr: null
files:
  - frontend/src/app/schedule/page.tsx
tests: []
links: []
prompt_text: |
  /sp.implement Fix Schedule Page Task Visibility (Date Matching).

  Target: `frontend/src/app/schedule/page.tsx`

  1. **Implement Robust Date Helper:**
     - Create a helper function inside the file:
       ```ts
       const isSameDay = (d1: Date, d2: Date) => {
         return d1.getFullYear() === d2.getFullYear() &&
                d1.getMonth() === d2.getMonth() &&
                d1.getDate() === d2.getDate();
       };
       ```

  2. **Update Filtering Logic:**
     - When fetching tasks, filter `todaysTasks` using this helper:
       ```ts
       const todaysTasks = tasks.filter(task => {
         if (!task.due_date) return false;
         const taskDate = new Date(task.due_date);
         return isSameDay(taskDate, selectedDate);
       });
       ```

  3. **Update Timeline Slot Logic:**
     - Loop from `8` to `20` (8 AM to 8 PM).
     - Find task for that hour:
       ```ts
       const taskForHour = todaysTasks.find(t => new Date(t.due_date).getHours() === hour);
       ```
     - If found, render the `TaskCard`.

  4. **Debug Logs:**
     - Add `console.log("Selected Date:", selectedDate);`
     - Add `console.log("All Tasks:", tasks);`
     - This will help us see in the browser console (F12) what dates are actually coming from the backend.
response_text: |
  Successfully implemented the fixes for Schedule Page Task Visibility:

  1. Added a robust `isSameDay` helper function to properly compare dates by year, month, and day (not time)
     - Function correctly compares dates using getFullYear(), getMonth(), and getDate()

  2. Updated the timeline slot logic to use the `isSameDay` helper function
     - Modified the getTasksForHour function to use the isSameDay helper
     - Ensured date comparison is based only on year, month, and day

  3. Updated timeline slot logic to loop from 8 to 20 (8 AM to 8 PM)
     - Used tasks.find() to locate task for each specific hour
     - Implemented proper logic to match task hours with timeline slots
     - Rendered tasks in the appropriate timeline slot when found

  4. Added debug logs for troubleshooting:
     - Added console.log for selected date
     - Added console.log for all tasks
     - These will help diagnose date-related issues in the future

  The implementation now properly matches tasks to their correct dates and hours on the schedule page.
outcome: Fixed the schedule page task visibility by implementing robust date comparison and proper timeline slot logic.
evaluation: The implementation correctly compares dates using the isSameDay helper function and properly displays tasks in their corresponding time slots from 8 AM to 8 PM. Debug logs have been added to assist with any future troubleshooting.
---
