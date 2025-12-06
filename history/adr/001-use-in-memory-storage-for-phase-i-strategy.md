# ADR-001: Use In-Memory Storage for Phase I Strategy

**Status:** Accepted
**Date:** 2025-12-06

## Context
The Hackathon Phase I requirements specify building a Console App to demonstrate core logic. We need a storage mechanism that is quick to implement and requires no external setup. The project constitution also explicitly states the Phase I Storage Constraint: "Storage Strategy: In-Memory Storage ONLY. Forbidden: Do NOT use SQLite, JSON files, or any external database for persistence in this phase. Data Structures: Use Python Lists or Dictionaries to store Task objects."

## Decision
We will use a global Python List (In-Memory) to store Task objects during the runtime session. We will NOT use SQLite or JSON files for this phase. This aligns with both the hackathon requirements and the project constitution.

## Consequences
- Positive: Zero external dependencies, faster implementation, easier to test logic, simpler deployment for Phase I
- Negative: Lack of persistence; all data will be lost when the application closes (Intentional for Phase I)

## Alternatives
- File-based storage (JSON, CSV): Would provide persistence but violates Phase I constraints and adds complexity
- SQLite database: Would provide persistence and querying capabilities but violates Phase I constraints
- In-memory storage with auto-save: Would provide some persistence but violates Phase I constraints

## References
- Project constitution Phase I Storage Constraint
- Feature specification requirements for Phase I