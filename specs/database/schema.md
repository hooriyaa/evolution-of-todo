# Feature Specification: Database Schema for Todo Web App

**Feature Branch**: `1-db-schema-todo`
**Created**: 2025-12-07
**Status**: Draft
**Input**: User description: "Create a new specification file at @specs/database/schema.md. Title: Database Schema for Todo Web App (Phase II) Goal: Define the data models for Neon PostgreSQL using SQLModel. Requirements: 1. **User Model** (Managed by Better Auth): - We need to reference the `users` table created by Better Auth. - Fields: id (String, PK), email (String), name (String). 2. **Task Model** (Main Entity): - Table Name: `tasks` - Fields: - `id`: Integer (Primary Key, Auto-increment). - `user_id`: String (Foreign Key linking to `users.id`). This is CRITICAL for multi-tenancy (User Isolation). - `title`: String (Not Null, 1-200 chars). - `description`: Text (Nullable). - `completed`: Boolean (Default: False). - `created_at`: Timestamp (Default: Current Time). - `updated_at`: Timestamp (Default: Current Time, Auto-update). 3. **Performance (Indexes)**: - Create an index on `tasks.user_id` because we will always filter by user (e.g., `SELECT * FROM tasks WHERE user_id = ?`). - Create an index on `tasks.completed`. 4. **Relationships**: - A User has many Tasks. - A Task belongs to exactly one User."

## Clarifications

### Session 2025-12-07
- Q: Should the spec explicitly acknowledge that the users table is managed by Better Auth? → A: Yes
- Q: Should the spec explicitly mention using SQLModel for Python code generation? → A: Yes

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create and Manage Tasks (Priority: P1)

As a registered user of the Todo Web App, I want to create, view, update, and delete my tasks in a way that ensures my data is isolated from other users.

**Why this priority**: This is the core functionality of a todo application - users must be able to manage their tasks effectively and securely.

**Independent Test**: The system can be fully tested by creating multiple user accounts, having each user create tasks, and verifying that users can only access their own tasks (multi-tenancy is working).

**Acceptance Scenarios**:

1. **Given** a user is logged into the application, **When** they create a new task, **Then** the task is saved and associated with their account only
2. **Given** a user has multiple tasks, **When** they view their task list, **Then** only tasks belonging to the current user are displayed
3. **Given** a user has tasks created by other users, **When** they query for their tasks, **Then** they cannot access or see tasks from other users

---

### User Story 2 - User Authentication and Data Association (Priority: P2)

As a user of the Todo Web App, I want my tasks to be automatically associated with my account when I create them, so I can access them when I log in again.

**Why this priority**: Essential for data persistence and user experience - tasks must be properly linked to users.

**Independent Test**: Can be tested by creating tasks as different users and validating that the relationship between users and their tasks is properly maintained.

**Acceptance Scenarios**:

1. **Given** a user logs into the application, **When** they create a task, **Then** the task is automatically linked to their user ID
2. **Given** a user has logged out and back in, **When** they view their tasks, **Then** they see the same tasks they previously created

---

### User Story 3 - Efficient Task Querying (Priority: P3)

As a user with many tasks, I want to be able to efficiently filter and view my tasks (e.g., completed vs incomplete), so I can manage them effectively.

**Why this priority**: Performance is crucial for user experience, especially as users accumulate more tasks over time.

**Independent Test**: Can be tested by creating many tasks for a user and measuring the response time for queries filtered by completion status.

**Acceptance Scenarios**:

1. **Given** a user has many tasks, **When** they filter to see only completed tasks, **Then** the results return quickly (under 1 second)

### Edge Cases

- What happens when a user account is deleted? Tasks associated with the user should also be deleted to ensure privacy.
- How does the system handle users with a very large number of tasks (tens of thousands)?
- What if two users try to access the same task ID (should not be possible due to user_id filter)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide data models for users and tasks in a persistent data store using SQLModel for Python code generation
- **FR-002**: System MUST link each task to exactly one user through a user identifier
- **FR-003**: System MUST ensure data isolation so that users can only access their own tasks
- **FR-004**: System MUST provide efficient querying of tasks by user and completion status
- **FR-005**: System MUST maintain data integrity with proper relationships between entities
- **FR-006**: System MUST validate that task titles are between 1 and 200 characters
- **FR-007**: System MUST automatically set created timestamp when a task is created
- **FR-008**: System MUST automatically update the updated timestamp when a task is modified
- **FR-009**: System MUST default the completed status to false when creating a new task
- **FR-010**: System MUST delete all tasks associated with a user when that user's account is deleted

### Key Entities *(include if feature involves data)*

- **User**: The account entity managed by Better Auth, with attributes: id (String, Primary Key), email (String), name (String). This table is created and managed by Better Auth.
- **Task**: The main todo entity, with attributes: id (Integer, Primary Key, Auto-increment), user_id (String, Foreign Key), title (String, 1-200 chars), description (Text, optional), completed (Boolean, default False), created_at (Timestamp, default current time), updated_at (Timestamp, auto-updating). This entity uses SQLModel for Python code generation.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create tasks that are securely associated with their account and inaccessible to other users
- **SC-002**: Querying tasks by user account returns results in under 1 second even with 10,000+ tasks per user
- **SC-003**: Task creation, update, and deletion operations complete within 500ms
- **SC-004**: 100% of task queries correctly return only tasks belonging to the authenticated user (no cross-user data leakage)
- **SC-005**: Task titles are properly validated to be between 1 and 200 characters with appropriate error messages for invalid inputs