# Advanced Tasks Features Specification

## Overview
This document defines the advanced task management features for the Cloud Native Todo Chatbot, including recurring tasks, reminders, and organization capabilities.

## Database Schema Updates
- **Schema Compatibility**: New columns will be added to the existing `tasks` table to maintain backward compatibility
- **New Columns**:
  - `priority`: VARCHAR(10) with values 'Low', 'Medium', 'High'
  - `recurring_rule`: JSONB field storing recurrence pattern (frequency, interval, end conditions)
  - `tags`: JSONB array storing tag identifiers associated with the task
  - `due_date`: TIMESTAMP with timezone for task deadline
  - `created_at`: TIMESTAMP defaulting to current time
  - `updated_at`: TIMESTAMP automatically updated on modification
- **Migration Strategy**:
  - Add columns with NULL or appropriate default values
  - Existing tasks will have NULL/default values for new fields
  - No data loss during migration
- **Indexing**:
  - Index on `due_date` for efficient date-based queries
  - Index on `priority` for priority-based sorting
  - GIN index on `tags` for efficient tag-based filtering

## Recurring Tasks

### Logic Flow
- **Trigger**: Task Completed Event
- **Process**: Calculate Next Due Date based on recurrence pattern
- **Action**: Create New Task with same properties and new due date
- **Recurrence Patterns**:
  - Daily: Same time every day
  - Weekly: Same day of week
  - Monthly: Same day of month
  - Yearly: Same date every year
  - Custom: User-defined intervals

### Configuration
- **Recurrence Options**: Available when creating/editing tasks
- **End Conditions**: 
  - After specified number of occurrences
  - On specific end date
  - Never (until manually stopped)

## Reminders

### Logic Flow
- **Trigger**: Due Date Set on task
- **Process**: When task due date approaches, Reminder Service publishes Reminder Event to `reminders` topic
- **Action**: Notification Service consumes event and sends appropriate notification to user
- **Complete Flow**: Task Due Date Approaches -> Reminder Service Publishes Reminder Event -> Notification Service Consumes Event and Sends Notification to User
- **Notification Types**:
  - Push notifications
  - Email notifications
  - In-app notifications

### Timing Options
- **At due time**: Notification sent exactly when task is due
- **Custom offset**: Notification sent X minutes/hours/days before due time
- **Multiple reminders**: Series of notifications leading up to due time

## Organization Features

### Priorities
- **Values**: High, Medium, Low
- **Visual Indicators**: Color coding and icons for priority levels
- **Sorting**: Ability to sort tasks by priority
- **Filtering**: Show only tasks of specific priority levels

### Tags/Categories
- **Management**: Create, edit, and delete tags
- **Assignment**: Assign multiple tags to a single task
- **Color Coding**: Visual indication of tag categories
- **Filtering**: Show only tasks with specific tags

### Sorting
- **Options**:
  - By due date (ascending/descending)
  - By priority
  - By creation date
  - By title (alphabetical)
  - By custom order (manual drag-and-drop)

### Filtering
- **Criteria**:
  - By completion status
  - By priority
  - By tags
  - By due date range
  - By creation date range
  - By search keywords in title/description
- **Combination**: Ability to apply multiple filters simultaneously