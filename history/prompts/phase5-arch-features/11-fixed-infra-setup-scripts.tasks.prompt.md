---
id: 10
title: "Fixed Infra Setup Scripts"
stage: tasks
date_iso: 2026-01-16
surface: agent
model: Qwen
feature: phase5-arch-features
branch: main
user: PMLS
command: "/sp.implement"
labels: ["implementation", "infrastructure", "dapr", "kafka", "redpanda", "kubernetes", "scripts"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - "scripts/setup-local-infra.sh"
  - "scripts/setup-local-infra.ps1"
tests_yaml: []
prompt_text: |
  **Task:** Fix setup-local-infra script
  
  **Context:**
  The previous script failed because:
  1. It tried to install a specific version of Redpanda (`v0.6.10`) which doesn't exist.
  2. It lacked error handling (it said "Success" even when it failed).
  
  **Directive:**
  Update `scripts/setup-local-infra.ps1` (and .sh) with these fixes:
  1.  **Redpanda:** Change the Helm install command to use the latest version (remove `--version` flag) or use the correct chart name `redpanda/operator`. Let's use `redpanda/redpanda` chart without version constraint for simplicity.
  2.  **Dapr:** Add a check to see if `dapr` command exists before running it. If not, print "Please install Dapr CLI first".
  3.  **Wait:** Add a command `kubectl rollouts status statefulset/redpanda --namespace kafka` to wait until Redpanda is actually ready before applying Dapr components.
  
  **Output:**
  Rewrite the infrastructure setup scripts.
response_text: |
  Successfully fixed the infrastructure setup scripts:
  - Removed the version constraint from the Redpanda Helm installation
  - Added error handling and existence checks for the Dapr CLI
  - Added proper wait command for Redpanda readiness using kubectl rollout status
  - Improved error reporting and success messages
  - Both PowerShell and bash scripts now have proper error handling
outcome: |
  The infrastructure setup scripts have been successfully updated with proper error handling and corrected commands.
evaluation: |
  The implementation successfully addressed all the issues mentioned in the directive. The scripts now properly handle errors and have corrected the Redpanda installation command.
---

# Fixed Infrastructure Setup Scripts

This PHR documents the fixes applied to the infrastructure setup scripts for Phase 5.2.