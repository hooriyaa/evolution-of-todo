---

description: "Task list for Todo List Console Application feature implementation"
---

# Tasks: Todo List Console Application (MVP)

**Input**: Design documents from `/specs/001-console-todo-app/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Tests**: The feature specification requires unit tests for each functionality.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Initialize project with uv
- [X] T002 Create project structure: `src/` and `tests/` directories
- [X] T003 [P] Add empty `__init__.py` files in `src/` and `tests/` directories
- [X] T004 Install dependencies: rich library for table formatting

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 Create Task class definition using Python Data Classes in `src/models.py`
- [X] T006 Implement TaskManager class skeleton in `src/manager.py` with in-memory storage (Python List)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Add New Task (Priority: P1) 🎯 MVP

**Goal**: Enable users to create new tasks to keep track of items they need to complete.

**Independent Test**: Can be fully tested by adding a task with a title and optional description, then verifying it appears in the task list.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T007 [P] [US1] Write test for adding a task with valid title in `tests/test_manager.py`
- [X] T008 [P] [US1] Write test for adding a task with title and description in `tests/test_manager.py`
- [X] T009 [P] [US1] Write test for title validation (1-200 chars) in `tests/test_manager.py`

### Implementation for User Story 1

- [X] T010 [US1] Implement add_task method in TaskManager class in `src/manager.py`
- [X] T011 [US1] Implement auto-incrementing ID assignment in `src/models.py` and `src/manager.py`
- [X] T012 [US1] Add validation for title length (1-200 characters) in `src/manager.py`
- [X] T013 [US1] Add error handling for invalid titles in `src/manager.py`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 6 - Navigate Main Menu (Priority: P1)

**Goal**: Allow users to interact with the system through a simple menu interface.

**Independent Test**: Can be fully tested by navigating through all menu options without the application crashing.

### Tests for User Story 6

- [ ] T014 [P] [US6] Write test for main menu interface in `tests/test_manager.py`
- [ ] T015 [P] [US6] Write test for graceful handling of invalid inputs in `tests/test_manager.py`

### Implementation for User Story 6

- [X] T016 [US6] Create main() function with while True loop in `src/main.py`
- [X] T017 [US6] Implement menu interface with options 1-6 in `src/main.py`
- [X] T018 [US6] Handle invalid user inputs gracefully in `src/main.py`
- [X] T019 [US6] Connect menu options to TaskManager methods in `src/main.py`

**Checkpoint**: At this point, User Stories 1 AND 6 should both work independently

---

## Phase 5: User Story 2 - View Task List (Priority: P1)

**Goal**: Enable users to see all their tasks to know what they need to do.

**Independent Test**: Can be fully tested by viewing the current task list and verifying all tasks are displayed with the correct information.

### Tests for User Story 2

- [X] T020 [P] [US2] Write test for viewing all tasks in `tests/test_manager.py`
- [X] T021 [P] [US2] Write test for viewing empty task list message in `tests/test_manager.py`

### Implementation for User Story 2

- [X] T022 [US2] Implement get_all_tasks method in TaskManager class in `src/manager.py`
- [X] T023 [US2] Implement table formatting using rich library in `src/main.py`
- [X] T024 [US2] Display message for empty task list in `src/main.py`

**Checkpoint**: At this point, User Stories 1, 6, AND 2 should all work independently

---

## Phase 6: User Story 3 - Mark Task as Complete (Priority: P2)

**Goal**: Allow users to mark a task as complete when they finish it.

**Independent Test**: Can be fully tested by marking a pending task as complete and verifying the status change.

### Tests for User Story 3

- [X] T025 [P] [US3] Write test for marking task as complete in `tests/test_manager.py`
- [X] T026 [P] [US3] Write test for handling invalid task ID in `tests/test_manager.py`

### Implementation for User Story 3

- [X] T027 [US3] Implement mark_complete method in TaskManager class in `src/manager.py`
- [X] T028 [US3] Add error handling for invalid task IDs in `src/manager.py`
- [X] T029 [US3] Update menu option 5 to call mark_complete in `src/main.py`

**Checkpoint**: All user stories (1, 6, 2, 3) should now be independently functional

---

## Phase 7: User Story 5 - Delete Task (Priority: P3)

**Goal**: Allow users to permanently remove a task they no longer need.

**Independent Test**: Can be fully tested by deleting a task and verifying it no longer appears in the task list.

### Tests for User Story 5

- [X] T030 [P] [US5] Write test for deleting a task in `tests/test_manager.py`
- [X] T031 [P] [US5] Write test for handling invalid task ID during deletion in `tests/test_manager.py`

### Implementation for User Story 5

- [X] T032 [US5] Implement delete_task method in TaskManager class in `src/manager.py`
- [X] T033 [US5] Add error handling for invalid task IDs in `src/manager.py`
- [X] T034 [US5] Update menu option 4 to call delete_task in `src/main.py`

**Checkpoint**: All user stories (1, 6, 2, 3, 5) should now be independently functional

---

## Phase 8: User Story 4 - Update Task (Priority: P3)

**Goal**: Allow users to modify the title or description of an existing task.

**Independent Test**: Can be fully tested by updating a task's title or description and verifying the changes are saved.

### Tests for User Story 4

- [X] T035 [P] [US4] Write test for updating task title in `tests/test_manager.py`
- [X] T036 [P] [US4] Write test for updating task description in `tests/test_manager.py`
- [X] T037 [P] [US4] Write test for handling invalid task ID during update in `tests/test_manager.py`

### Implementation for User Story 4

- [X] T038 [US4] Implement update_task method in TaskManager class in `src/manager.py`
- [X] T039 [US4] Add validation for updated title length (1-200 characters) in `src/manager.py`
- [X] T040 [US4] Add error handling for invalid task IDs in `src/manager.py`
- [X] T041 [US4] Update menu option 3 to call update_task with separate prompts in `src/main.py`

**Checkpoint**: All user stories (1, 6, 2, 3, 5, 4) should now be independently functional

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T042 Add comprehensive docstrings to all classes and methods in `src/models.py` and `src/manager.py`
- [ ] T043 [P] Add type hints to all functions in `src/models.py`, `src/manager.py`, and `src/main.py`
- [ ] T044 [P] Add error handling throughout the application with user-friendly messages
- [ ] T045 Run all tests and verify they pass
- [ ] T046 Create README.md with project documentation
- [ ] T047 Run quickstart validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 6 (P1)**: Can start after Foundational (Phase 2) - Depends on US1 components
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Depends on US1 components
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Depends on US1 components
- **User Story 5 (P3)**: Can start after Foundational (Phase 2) - Depends on US1 components
- **User Story 4 (P3)**: Can start after Foundational (Phase 2) - Depends on US1 components

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
T007 [P] [US1] Write test for adding a task with valid title in tests/test_manager.py
T008 [P] [US1] Write test for adding a task with title and description in tests/test_manager.py
T009 [P] [US1] Write test for title validation (1-200 chars) in tests/test_manager.py

# Then implement the functionality:
T010 [US1] Implement add_task method in TaskManager class in src/manager.py
T011 [US1] Implement auto-incrementing ID assignment in src/models.py and src/manager.py
T012 [US1] Add validation for title length (1-200 characters) in src/manager.py
T013 [US1] Add error handling for invalid titles in src/manager.py
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 6 → Test independently → Deploy/Demo
4. Add User Story 2 → Test independently → Deploy/Demo
5. Add User Story 3 → Test independently → Deploy/Demo
6. Add User Story 5 → Test independently → Deploy/Demo
7. Add User Story 4 → Test independently → Deploy/Demo
8. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 6
   - Developer C: User Story 2
   - Continue with P2 and P3 stories
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence