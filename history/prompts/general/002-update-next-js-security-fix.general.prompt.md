---
id: "002"
title: "Update-Next-js-Security-Fix"
stage: "general"
date_iso: "2025-12-14"
surface: "agent"
model: "Qwen Code"
feature: "none"
branch: "main"
user: "PMLS"
command: "npm install next@latest"
labels:
  - "security"
  - "update"
  - "nextjs"
  - "deployment"
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - "frontend/package.json"
tests_yaml: []
---

## Prompt Text
depolyment mai ya error araha hai 19:40:36.819 
├ ○ /schedule
19:40:36.819 
├ ○ /settings
19:40:36.819 
└ ○ /signup
19:40:36.819 
19:40:36.819 
19:40:36.819 
○  (Static)  prerendered as static content
19:40:36.819 
19:40:37.210 
Traced Next.js server files in: 34.179ms
19:40:37.358 
Created all serverless functions in: 147.864ms
19:40:37.366 
Collected static files (public/, static/, .next/static): 3.05ms
19:40:37.453 
Build Completed in /vercel/output [30s]
19:40:37.773 
Error: Vulnerable version of Next.js detected, please update immediately. Learn More: https://vercel.link/CVE-2025-66478

## Response Text
Updated Next.js to the latest version (16.0.10) to address the security vulnerability CVE-2025-66478. Also updated other dependencies. The build now completes successfully with the patched version of Next.js.

## Outcome/Validation
Next.js was updated from version 16.0.0 to 16.0.10 to address security vulnerability CVE-2025-66478. The build now completes successfully without security warnings.