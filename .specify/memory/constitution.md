
<!--
Sync Impact Report:
- Version change: N/A → 1.0.0 (initial constitution)
- Added principles: SDD, Technology Stack, Storage Constraint, Coding Standards, Modular Architecture, Deliverable Assurance
- Added sections: Additional Requirements, Development Workflow
- Templates requiring updates: N/A (initial constitution)
- Follow-up TODOs: None
-->
# Hackathon II: The Evolution of Todo Constitution

## Core Principles

### Spec-Driven Development (SDD)
The System Architect (User) provides Specifications. The Implementation Engine (AI) executes from these Specs. Golden Rule: Do NOT write or modify code without a corresponding update in the Specification Markdown files. Code must always reflect the Specs.

### Technology Stack Standardization
Language: Python 3.13+, Dependency Manager: UV (uv pip install ...), Testing Framework: pytest, UI Framework: Console/CLI using 'rich' or standard input/output.

### Phase I Storage Constraint
Storage Strategy: In-Memory Storage ONLY. Forbidden: Do NOT use SQLite, JSON files, or any external database for persistence in this phase. Data Structures: Use Python Lists or Dictionaries to store Task objects.

### Coding Standards & Quality
Style Guide: Adhere strictly to PEP 8. Type Safety: MANDATORY Python Type Hints for all function arguments and return values. Documentation: Every class and function must have a docstring explaining its purpose, arguments, and returns. Error Handling: Implement robust try-except blocks. The app should never crash; it should display user-friendly error messages.

### Modular Architecture Design
Pattern: Modular Design (Separation of Concerns). Folder Structure: /specs (Documentation & Requirements), /src (Source Code - separate main.py, logic, and models), /tests (Unit Tests). Imports: Use absolute imports. Avoid circular dependencies.

### Deliverable Assurance
Ensure the app can: Add, Delete, Update, View, and Mark Tasks as Complete. Each feature must be tested before implementation is considered complete.

## Additional Requirements
All components must be testable in isolation. Performance requirements include responsive CLI interactions with no noticeable lag. Security considerations include input validation and protection against injection attacks.

## Development Workflow
All code submissions must include corresponding tests. Code reviews must verify compliance with all constitution principles. Development follows an iterative approach with frequent testing and validation.

## Governance
Constitution supersedes all other practices. Amendments require formal documentation and approval. All PRs/reviews must verify compliance with constitution principles. Breaking changes must follow semantic versioning.

**Version**: 1.0.0 | **Ratified**: 2025-12-06 | **Last Amended**: 2025-12-06
