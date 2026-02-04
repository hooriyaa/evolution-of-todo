# Data Model: Phase 5 - Advanced Cloud Deployment

## Task Entity

### Fields
- **id**: UUID (Primary Key)
- **title**: String (Required, Max length: 255)
- **description**: Text (Optional)
- **completed**: Boolean (Default: false)
- **priority**: String (Enum: 'Low', 'Medium', 'High', Default: 'Medium')
- **due_date**: DateTime (Optional, with timezone)
- **recurring_rule**: JSONB (Optional, stores recurrence pattern)
  - frequency: String ('daily', 'weekly', 'monthly', 'yearly', 'custom')
  - interval: Integer (e.g., every 2 weeks)
  - end_condition: Object
    - type: String ('after_occurrences', 'on_date', 'never')
    - value: Integer or Date
- **tags**: JSONB Array (Array of tag objects)
  - id: UUID
  - name: String
  - color: String (Hex color code)
- **created_at**: DateTime (Auto-generated)
- **updated_at**: DateTime (Auto-generated)
- **user_id**: UUID (Foreign Key to User)

### Relationships
- **User**: Many-to-One (Many tasks belong to one user)
- **Attachments**: One-to-Many (One task can have many attachments)

### Validation Rules
- Title must not be empty
- Priority must be one of 'Low', 'Medium', 'High'
- Due date must be in the future if provided
- Recurring rule must follow the defined schema if provided
- Tags must be an array of valid tag objects

### State Transitions
- **Created**: When task is first created
- **Updated**: When any field except completion status is modified
- **Completed**: When task completion status is set to true
- **Reopened**: When completed task is set back to incomplete
- **Deleted**: When task is soft deleted

## User Entity

### Fields
- **id**: UUID (Primary Key)
- **email**: String (Unique, Required)
- **name**: String (Required, Max length: 255)
- **preferences**: JSONB (Optional, stores user preferences)
- **created_at**: DateTime (Auto-generated)
- **updated_at**: DateTime (Auto-generated)

### Relationships
- **Tasks**: One-to-Many (One user can have many tasks)

## Tag Entity

### Fields
- **id**: UUID (Primary Key)
- **name**: String (Required, Unique, Max length: 100)
- **color**: String (Hex color code, Default: '#000000')
- **user_id**: UUID (Foreign Key to User)
- **created_at**: DateTime (Auto-generated)
- **updated_at**: DateTime (Auto-generated)

### Relationships
- **User**: Many-to-One (Many tags belong to one user)
- **Tasks**: Many-to-Many (Many tags can be assigned to many tasks)

## Event Schema

### Task Event
- **id**: String (Event unique identifier)
- **type**: String (Enum: 'task.created', 'task.updated', 'task.deleted', 'task.completed')
- **source**: String (Service that generated the event)
- **timestamp**: DateTime (When the event occurred)
- **data**: Object (Task data at the time of the event)
  - task_id: UUID
  - user_id: UUID
  - changes: Object (Fields that changed)

### Reminder Event
- **id**: String (Event unique identifier)
- **type**: String (Enum: 'reminder.scheduled', 'reminder.triggered', 'reminder.dismissed')
- **source**: String (Service that generated the event)
- **timestamp**: DateTime (When the event occurred)
- **data**: Object (Reminder data)
  - task_id: UUID
  - user_id: UUID
  - due_date: DateTime
  - notification_method: String (Enum: 'push', 'email', 'in_app')

## Recurring Task Schedule

### Fields
- **id**: UUID (Primary Key)
- **original_task_id**: UUID (Foreign Key to Task)
- **next_due_date**: DateTime
- **last_occurrence**: DateTime (When the last occurrence was created)
- **occurrence_count**: Integer (How many times the task has recurred)
- **active**: Boolean (Whether the recurring rule is still active)
- **created_at**: DateTime (Auto-generated)
- **updated_at**: DateTime (Auto-generated)

### Relationships
- **Original Task**: One-to-One (Each schedule corresponds to one original task)
- **Generated Tasks**: One-to-Many (Schedule can generate many task instances)