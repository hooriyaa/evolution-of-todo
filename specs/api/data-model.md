# Data Model: Todo App API

## Task Entity

### Fields
- `id`: Integer (Primary Key, Auto-increment)
- `user_id`: String (Foreign Key, links to users.id from Better Auth)
- `title`: String (1-200 characters, Not Null)
- `description`: Text (Optional)
- `completed`: Boolean (Default: False)
- `created_at`: Timestamp (Default: Current Time)
- `updated_at`: Timestamp (Default: Current Time, Auto-update)

### Relationships
- **Task** belongs to exactly one **User** 
- **User** has many **Tasks**

### State Transitions
- `completed` field can transition from `False` to `True` (via PATCH /complete endpoint)
- `completed` field can transition from `True` to `False` (via PATCH /complete endpoint)

### Validation Rules
- `title` must be between 1 and 200 characters
- `user_id` must match the authenticated user's ID
- `user_id` in URL must match `user_id` in JWT token

## User Entity

### Fields
- `id`: String (Primary Key, from Better Auth)
- `email`: String (from Better Auth)
- `name`: String (from Better Auth)

### Note
- This entity is managed by Better Auth
- The system only references the user_id from this table
- No direct modification of user data through our API