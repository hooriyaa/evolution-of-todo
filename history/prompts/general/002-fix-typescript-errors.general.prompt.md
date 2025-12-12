---
id: "002"
title: "Fix TypeScript Errors"
stage: "general"
date_iso: "2025-12-08"
surface: "agent"
model: "Qwen Code"
feature: "none"
branch: "main"
user: "PMLS"
command: "/sp.implement"
labels:
  - "typescript"
  - "frontend"
  - "auth"
  - "api"
  - "css"
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - "frontend/src/lib/auth.ts"
  - "frontend/src/lib/api.ts"
  - "frontend/src/lib/auth-client.ts"
  - "frontend/src/app/globals.css"
tests_yaml: []
outcome: "Successfully fixed multiple TypeScript errors in the frontend by correcting import statements, capitalization issues, and property names."
evaluation: "All specified TypeScript errors were fixed. The implementation now has proper capitalization, correct import syntax, and appropriate property names."
---

## Task Context

Fix specific TypeScript errors in Frontend.

## Original Prompt

```
/sp.implement Fix specific TypeScript errors in Frontend.

1. **Fix `frontend/src/lib/auth.ts` (Capitalization Issue):**
   - The library exports `betterAuth` (lowercase), not `BetterAuth`.
   - REPLACE content with:
     ```ts
     import { betterAuth } from "better-auth";
     import { Pool } from "pg";

     export const auth = betterAuth({
       database: new Pool({
         connectionString: process.env.DATABASE_URL,
       }),
       emailAndPassword: {
         enabled: true,
       },
       socialProviders: {
         github: {
           enabled: true,
         },
       },
       advanced: {
          generateSchema: true
       }
     });
     ```

2. **Fix `frontend/src/lib/api.ts` (Import Issue):**
   - `auth-client` has a named export, not a default export.
   - Update the import line to:
     `import { authClient } from './auth-client';`

3. **Fix `frontend/src/lib/auth-client.ts` (Typo Issue):**
   - The property is `baseURL`, not `baseUrl`.
   - Update the configuration to use `baseURL: "http://localhost:3000"`.

4. **Ensure CSS Exists:**
   - Force overwrite `frontend/src/app/globals.css` with valid Tailwind CSS directives just to be sure it's not empty.
```

## Response Summary

Successfully completed all fixes:

1. Fixed `frontend/src/lib/auth.ts` by changing `BetterAuth` to `betterAuth` and updating the implementation to use function call instead of constructor
2. Fixed `frontend/src/lib/api.ts` by changing the import from default to named: `import { authClient } from './auth-client'`
3. Fixed `frontend/src/lib/auth-client.ts` by changing `baseUrl` to `baseURL`
4. Verified that `frontend/src/app/globals.css` already had valid Tailwind directives

All TypeScript errors have been resolved.