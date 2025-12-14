---
id: "001"
title: "Fix-TypeScript-Errors"
stage: "general"
date_iso: "2025-12-14"
surface: "agent"
model: "Qwen Code"
feature: "none"
branch: "main"
user: "PMLS"
command: "npm run build"
labels:
  - "typescript"
  - "build"
  - "frontend"
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - "frontend/src/components/TaskCard/TaskCard.tsx"
  - "frontend/src/components/TaskForm/TaskForm.tsx"
tests_yaml: []
---

## Prompt Text
This is the Qwen Code. We are setting up the context for our chat.
Today's date is Sunday, December 14, 2025 (formatted according to the user's locale).
My operating system is: win32
I'm currently working in the directory: C:\Users\PMLS\OneDrive\Desktop\hackathon2
Here is the folder structure of the current working directories:

Showing up to 20 items (files + folders). Folders or files indicated with ... contain more items not shown, were ignored, or the display limit (20 items) was reached.

C:\Users\PMLS\OneDrive\Desktop\hackathon2\
├───.python-version
├───$null
├───package-lock.json
├───package.json
├───pyproject.toml
├───QWEN.md
├───README.md
├───uv.lock
├───.git\...
├───.pytest_cache\
├───.qwen\
├───.spec-kit\
├───.specify\
├───.venv\
├───backend\
├───frontend\
├───history\
├───node_modules\...
├───specs\
├───src\
└───...
npm brun build run kari tu ya error araha fix this errors PS C:\Users\PMLS\OneDrive\Desktop\hackathon2\frontend> npm run build

> frontend@0.1.0 build
> next build

[baseline-browser-mapping] The data in this module is over two months old.  To ensure accurate Baseline data, please update: `npm i baseline-browser-mapping@latest -D`
 ⚠ Warning: Next.js inferred your workspace root, but it may not be correct.
 We detected multiple lockfiles and selected the directory of C:\Users\PMLS\OneDrive\Desktop\hackathon2\package-lock.json as the root directory.
 To silence this warning, set `turbopack.root` in your Next.js config, or consider removing one of the lockfiles if it's not needed.
   See https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack#root-directory for more information.
 Detected additional lockfiles: 
   * C:\Users\PMLS\OneDrive\Desktop\hackathon2\frontend\package-lock.json

   ▲ Next.js 16.0.0 (Turbopack)
   - Environments: .env.local

   Creating an optimized production build ...
[baseline-browser-mapping] The data in this module is over two months old.  To ensure accurate Baseline data, please update: `npm i baseline-browser-mapping@latest -D`
 ✓ Compiled successfully in 7.9s
   Running TypeScript  .Failed to compile.

./src/components/TaskCard/TaskCard.tsx:77:27
Type error: No overload matches this call.
  Overload 1 of 4, '(value: string | number | Date): Date', gave the following error.       
    Argument of type 'string | Date | undefined' is not assignable to parameter of type 'string | number | Date'.
      Type 'undefined' is not assignable to type 'string | number | Date'.
  Overload 2 of 4, '(value: string | number): Date', gave the following error.
    Argument of type 'string | Date | undefined' is not assignable to parameter of type 'string | number'.
      Type 'undefined' is not assignable to type 'string | number'.

  75 |             {(task.dueDate || task.due_date) && (
  76 |               <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
> 77 |                 {new Date(task.dueDate || task.due_date).toLocaleDateString()} {new Date(task.dueDate || task.due_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
     |                           ^
  78 |               </span>
  79 |             )}
  80 |             {task.category && (
Next.js build worker exited with code: 1 and signal: null

## Response Text
Fixed two TypeScript errors in the frontend:
1. In TaskCard.tsx: Fixed the issue where potentially undefined values were being passed to the Date constructor by checking for undefined before creating Date objects
2. In TaskForm.tsx: Fixed the issue where formatDateForInput function was being used before it was declared by moving the function declaration to the top of the component

The build now completes successfully after these fixes.

## Outcome/Validation
Both TypeScript errors were resolved, and the Next.js build completes successfully without compilation failures.