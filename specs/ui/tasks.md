# Tasks: Frontend UI for Todo App

**Input**: Design documents from `/specs/ui/`
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

- [x] T001 Update tailwind.config.ts to add custom colors (indigo-600 primary, slate-50 background, etc.) as named variables
- [x] T002 [P] Create directory structure in frontend/src: app/, components/, lib/, styles/
- [x] T003 [P] Create lib/api.ts with axios instance and JWT token interceptor
- [x] T004 [P] Create lib/auth-client.ts with Better Auth client configuration

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [x] T005 Create base layout in frontend/src/app/layout.tsx with Tailwind styling
- [x] T006 Create constants/types file in frontend/src/lib/types.ts for Task and User TypeScript interfaces
- [x] T007 [P] Create reusable UI components directory in frontend/src/components/ui/
- [x] T008 Implement global loading and error state management in frontend/src/lib/utils.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - User Authentication (Priority: P1) 🎯 MVP

**Goal**: Allow a new user to easily sign in to the application so that they can access their tasks and data

**Independent Test**: The system can be fully tested by verifying a user can successfully log in using either GitHub or email/password with custom login forms built using auth-client hooks and gain access to the dashboard

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T009 [P] [US1] Unit test for auth-client.ts authentication functions in frontend/tests/unit/auth-client.test.ts
- [ ] T010 [P] [US1] Integration test for login page functionality in frontend/tests/integration/login.test.ts

### Implementation for User Story 1

- [x] T011 [P] [US1] Create login page component at frontend/src/app/login/page.tsx
- [x] T012 [US1] Implement centered login card with GitHub and email/password options
- [x] T013 [US1] Connect login form to Better Auth hooks for authentication
- [x] T014 [US1] Implement error handling and display for invalid credentials

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - View and Manage Tasks (Priority: P2)

**Goal**: Allow logged-in users to view and manage their tasks in a clean, organized interface so they can stay productive

**Independent Test**: Can be tested by verifying a user can view their tasks, mark them as complete, and see visual feedback for task status

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [ ] T015 [P] [US2] Unit test for TaskCard component in frontend/tests/unit/TaskCard.test.ts
- [ ] T016 [US2] Integration test for dashboard task list in frontend/tests/integration/dashboard.test.ts

### Implementation for User Story 2

- [x] T017 [P] [US2] Create TaskCard component at frontend/src/components/TaskCard/TaskCard.tsx
- [x] T018 [P] [US2] Create Sidebar component at frontend/src/components/Sidebar/Sidebar.tsx
- [x] T019 [US2] Implement responsive navigation with hamburger menu for mobile
- [x] T020 [US2] Create dashboard page at frontend/src/app/dashboard/page.tsx
- [ ] T021 [US2] Implement task list fetching with loading states using API client
- [ ] T022 [US2] Display tasks using TaskCard component with proper styling
- [ ] T023 [US2] Implement completion toggle functionality with API connection
- [ ] T024 [US2] Implement delete functionality with API connection
- [ ] T025 [US2] Implement logout functionality in sidebar using Better Auth

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Add New Tasks (Priority: P3)

**Goal**: Allow logged-in users to easily add new tasks so that they can keep track of things they need to do

**Independent Test**: Can be tested by verifying a user can open the modal task form, enter details, and see the new task appear in their list

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

- [ ] T026 [P] [US3] Unit test for TaskForm component in frontend/tests/unit/TaskForm.test.ts
- [ ] T027 [P] [US3] Integration test for task creation flow in frontend/tests/integration/task-creation.test.ts

### Implementation for User Story 3

- [ ] T028 [P] [US3] Create TaskForm component at frontend/src/components/TaskForm/TaskForm.tsx as modal
- [ ] T029 [US3] Implement form validation for task fields
- [ ] T030 [US3] Connect TaskForm to API for creating new tasks
- [ ] T031 [US3] Add floating "Add Task" button to dashboard that opens TaskForm
- [ ] T032 [US3] Implement toast notifications for success/error messages
- [ ] T033 [US3] Update task list after successful task creation

**Checkpoint**: All user stories should now be independently functional

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T034 [P] Implement skeleton loaders for task list in frontend/src/components/ui/Skeleton.tsx
- [ ] T035 [P] Add accessibility features and ARIA attributes to all components
- [ ] T036 Implement proper error boundaries for the application
- [ ] T037 Add loading states to all API calls
- [ ] T038 [P] Documentation updates in frontend/README.md
- [ ] T039 Performance optimization using React.memo for appropriate components
- [ ] T040 Run quickstart validation to ensure all components work as expected

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
- Models (interfaces/types) before services
- Services before components
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 2

```bash
# Launch all tests for User Story 2 together (if tests requested):
T015 [P] [US2] Unit test for TaskCard component in frontend/tests/unit/TaskCard.test.ts
T016 [US2] Integration test for dashboard task list in frontend/tests/integration/dashboard.test.ts

# Launch component implementation together:
T017 [P] [US2] Create TaskCard component at frontend/src/components/TaskCard/TaskCard.tsx
T018 [P] [US2] Create Sidebar component at frontend/src/components/Sidebar/Sidebar.tsx

# Launch page implementation and API integration:
T020 [US2] Create dashboard page at frontend/src/app/dashboard/page.tsx
T021 [US2] Implement task list fetching with loading states using API client
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