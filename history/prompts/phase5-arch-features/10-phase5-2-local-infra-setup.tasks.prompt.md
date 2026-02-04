---
id: 9
title: "Phase5.2 Local Infra Setup"
stage: tasks
date_iso: 2026-01-16
surface: agent
model: Qwen
feature: phase5-arch-features
branch: main
user: PMLS
command: "/sp.implement"
labels: ["implementation", "infrastructure", "dapr", "kafka", "redpanda", "kubernetes"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - "infra/local/dapr-components/kafka-pubsub.yaml"
  - "infra/local/dapr-components/postgres-statestore.yaml"
  - "infra/local/dapr-components/reminder-cron.yaml"
  - "infra/local/redpanda-values.yaml"
  - "scripts/setup-local-infra.sh"
  - "scripts/setup-local-infra.ps1"
tests_yaml: []
prompt_text: |
  **Task:** Phase 5.2 - Setup Local Event-Driven Infrastructure (Configuration)
  
  **Context:**
  We are moving to Phase 5.2. [cite_start]We need to deploy Redpanda (Kafka) and Dapr on the local Minikube cluster[cite: 534, 538].
  We need the Kubernetes manifests and Helm configurations to set this up.
  
  **Directive:**
  Create the following infrastructure files in a new folder `infra/local/`:
  
  1.  **Dapr Components (`infra/local/dapr-components/`):**
      * [cite_start]`kafka-pubsub.yaml`: Configure `pubsub.kafka` component pointing to the local Redpanda service (`redpanda.kafka.svc.cluster.local:9093`)[cite: 733, 831].
      * [cite_start]`postgres-statestore.yaml`: Configure `state.postgresql` pointing to the local Postgres/Neon DB[cite: 768, 831].
      * [cite_start]`reminder-cron.yaml`: Configure `bindings.cron` for scheduled reminders (e.g., every 1 minute)[cite: 790, 831].
  
  2.  **Redpanda Helm Config (`infra/local/redpanda-values.yaml`):**
      * Create a `values.yaml` optimized for local Minikube (disable heavy resources, enable external access for testing).
  
  3.  **Setup Script (`scripts/setup-local-infra.sh` or `.ps1`):**
      * A script to:
          * Add Redpanda Helm repo (`https://charts.redpanda.com`).
          * Install Redpanda release named `redpanda` in namespace `kafka`.
          * Initialize Dapr on Kubernetes (`dapr init -k`).
          * Apply the Dapr components (`kubectl apply -f infra/local/dapr-components/`).
  
  **Output:**
  Generate these files so we can run the setup script immediately.
response_text: |
  Successfully implemented Phase 5.2 - Setup Local Event-Driven Infrastructure:
  - Created Dapr components for Kafka pubsub, PostgreSQL state store, and reminder cron
  - Created Redpanda Helm values optimized for local Minikube
  - Created both bash and PowerShell setup scripts
  - All files are ready to execute the local infrastructure setup
outcome: |
  Phase 5.2 local infrastructure setup has been successfully implemented with all required configuration files.
evaluation: |
  The implementation successfully fulfilled all requirements. The local event-driven infrastructure is ready to be deployed.
---

# Phase 5.2 Local Infrastructure Setup

This PHR documents the implementation of Phase 5.2: Local Event-Driven Infrastructure Configuration.