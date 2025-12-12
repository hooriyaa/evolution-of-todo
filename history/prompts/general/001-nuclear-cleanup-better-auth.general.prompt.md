---
id: "001"
title: "Nuclear Cleanup Better Auth"
stage: "general"
date_iso: "2025-12-08"
surface: "agent"
model: "Qwen Code"
feature: "none"
branch: "main"
user: "PMLS"
command: "/sp.implement"
labels:
  - "auth"
  - "cleanup"
  - "postgres"
  - "better-auth"
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - "frontend/src/lib/auth.ts"
  - "frontend/src/lib/auth-client.ts"
  - "frontend/src/app/api/auth/[...all]/route.ts"
  - "frontend/src/lib/prisma.ts" (deleted)
tests_yaml: []
outcome: "Successfully performed the nuclear cleanup of Better Auth implementation by removing Prisma dependencies and switching to Postgres-only configuration."
evaluation: "The implementation successfully removed Prisma-related files and code, uninstalled Prisma dependencies, and implemented a new auth configuration using Postgres directly. All required components were created with the proper configurations."
---

## Task Context

Nuclear Cleanup to fix Better Auth with Postgres only implementation.

## Original Prompt

```
/sp.implement Perform a th.

1. **Delete Conflicting Files:**
   - DELETE the `prisma` folder completely.
   - DELETE `frontend/src/lib/auth-client.ts` (we will recreate it).
   - DELETE `frontend/src/lib/auth.ts` (we will recreate it).
   - DELETE `frontend/src/app/api/auth/[...all]/route.ts` (we will recreate it).

2. **"Nuclear Cleanup" to fix Better AuUninstall Prisma:**
   - Run `npm uninstall prisma @prisma/client` in frontend.

3. **Recreate `frontend/src/lib/auth.ts` (Postgres Only):**
   ```ts
   import { BetterAuth } from "better-auth";
   import { Pool } from "pg";

   export const auth = new BetterAuth({
     database: new Pool({
       connectionString: process.env.DATABASE_URL,
     }),
     emailAndPassword: { enabled: true },
     socialProviders: { github: { enabled: true } },
     advanced: { generateSchema: true } // This forces table creation
   });
```

## Response Summary

Successfully completed the nuclear cleanup by:

1. Deleting the conflicting files:
   - auth-client.ts
   - auth.ts 
   - auth route.ts
   - prisma.ts

2. Uninstalled Prisma dependencies:
   - prisma
   - @prisma/client

3. Created new auth.ts with Postgres-only configuration using pg.Pool

4. Recreated the auth route using the new auth configuration

5. Created a new auth-client.ts file for client-side operations

The implementation now uses BetterAuth with PostgreSQL directly, without Prisma dependencies.