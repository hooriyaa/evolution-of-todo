# Tasks: REST API Specification for Todo App

**Input**: Design documents from `/specs/api/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

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

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize backend directory structure with uv init in backend/
- [x] T002 [P] Install dependencies: fastapi, uvicorn, sqlmodel, psycopg2-binary, python-jose, python-multipart
- [x] T003 [P] Create backend/src directory structure as defined in plan.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [x] T004 Setup database connection in backend/src/db.py using SQLModel and DATABASE_URL env var
- [x] T005 [P] Create Task model in backend/src/models.py with foreign key to User from Better Auth
- [x] T006 Create JWT authentication middleware in backend/src/auth.py to verify Authorization headers using BETTER_AUTH_SECRET
- [x] T007 Setup CORS configuration in backend/src/main.py to allow requests from localhost:3000
- [x] T008 Create Pydantic schemas for Task entity that align with SQLModel models in backend/src/schemas.py

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View My Tasks (Priority: P1) 🎯 MVP

**Goal**: Allow users to view all their tasks so that they can manage and prioritize them effectively

**Independent Test**: The system can be fully tested by having a user with tasks log in and verify that they can see all their tasks but not others' tasks

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T009 [P] [US1] Contract test for GET /{user_id}/tasks endpoint in backend/tests/contract/test_tasks.py
- [ ] T010 [P] [US1] Integration test for user task viewing flow in backend/tests/integration/test_tasks.py

### Implementation for User Story 1

- [x] T011 [P] [US1] Create GET /{user_id}/tasks route in backend/src/routes/tasks.py
- [x] T012 [US1] Implement query parameter validation for status and sort in backend/src/routes/tasks.py
- [x] T013 [US1] Add user_id validation to ensure URL user_id matches JWT token user_id in backend/src/routes/tasks.py
- [x] T014 [US1] Implement database query to fetch user's tasks with filtering and sorting in backend/src/routes/tasks.py

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Create New Task (Priority: P2)

**Goal**: Allow users to create new tasks so that they can keep track of things they need to do

**Independent Test**: Can be tested by having a user submit a POST request to create a new task and verifying it appears in their task list

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [ ] T015 [P] [US2] Contract test for POST /{user_id}/tasks endpoint in backend/tests/contract/test_tasks.py
- [ ] T016 [P] [US2] Integration test for task creation flow in backend/tests/integration/test_tasks.py

### Implementation for User Story 2

- [x] T017 [P] [US2] Create POST /{user_id}/tasks route in backend/src/routes/tasks.py
- [x] T018 [US2] Add request body validation for title and description in backend/src/routes/tasks.py
- [x] T019 [US2] Implement task creation in database with user_id association in backend/src/routes/tasks.py
- [x] T020 [US2] Add user_id validation to ensure URL user_id matches JWT token user_id in backend/src/routes/tasks.py

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Update Task Details (Priority: P3)

**Goal**: Allow users to update their tasks so that they can modify their details as needed

**Independent Test**: Can be tested by having a user update a task and verifying that the changes are saved and reflected in the system

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

- [ ] T021 [P] [US3] Contract test for PUT /{user_id}/tasks/{task_id} endpoint in backend/tests/contract/test_tasks.py
- [ ] T022 [P] [US3] Contract test for PATCH /{user_id}/tasks/{task_id}/complete endpoint in backend/tests/contract/test_tasks.py
- [ ] T023 [P] [US3] Integration test for task update flow in backend/tests/integration/test_tasks.py

### Implementation for User Story 3

- [x] T024 [P] [US3] Create GET /{user_id}/tasks/{task_id} route in backend/src/routes/tasks.py
- [x] T025 [P] [US3] Create PUT /{user_id}/tasks/{task_id} route in backend/src/routes/tasks.py
- [x] T026 [P] [US3] Create PATCH /{user_id}/tasks/{task_id}/complete route in backend/src/routes/tasks.py
- [x] T027 [US3] Create DELETE /{user_id}/tasks/{task_id} route in backend/src/routes/tasks.py
- [x] T028 [US3] Implement validation for all routes to ensure user_id in URL matches JWT token user_id
- [x] T029 [US3] Implement proper error handling for 404 (task not found) and 403 (forbidden access) responses

**Checkpoint**: All user stories should now be independently functional

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T030 [P] Documentation updates in backend/README.md
- [ ] T031 Error handling and logging implementation across all routes
- [ ] T032 Performance optimization for database queries
- [ ] T033 [P] Additional unit tests in backend/tests/unit/
- [ ] T034 Security hardening and input validation
- [ ] T035 Run quickstart validation to ensure all endpoints work as expected

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
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services (if applicable)
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
# Launch all tests for User Story 1 together (if tests requested):
T009 [P] [US1] Contract test for GET /{user_id}/tasks endpoint in backend/tests/contract/test_tasks.py
T010 [P] [US1] Integration test for user task viewing flow in backend/tests/integration/test_tasks.py

# Launch route implementation and validation together:
T011 [P] [US1] Create GET /{user_id}/tasks route in backend/src/routes/tasks.py
T012 [US1] Implement query parameter validation for status and sort in backend/src/routes/tasks.py
T013 [US1] Add user_id validation to ensure URL user_id matches JWT token user_id in backend/src/routes/tasks.py
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

1. Team completes Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
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