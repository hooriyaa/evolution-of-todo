# Event-Driven Architecture Specification

## Overview
This document defines the event-driven architecture for the Cloud Native Todo Chatbot, utilizing Kafka for event streaming and Dapr for distributed application runtime capabilities.

## Kafka Topics

### `task-events`
- **Purpose**: Handle all task-related CRUD operations
- **Events**:
  - `task.created`: Emitted when a new task is created
  - `task.updated`: Emitted when a task is modified
  - `task.deleted`: Emitted when a task is removed
  - `task.completed`: Emitted when a task status changes to completed
- **Partitioning Strategy**: Partition by user ID to ensure ordering within user contexts
- **Retention Policy**: 7 days for active processing, with compacted storage for latest task states

### `reminders`
- **Purpose**: Handle scheduled notification events
- **Events**:
  - `reminder.scheduled`: Emitted when a reminder is scheduled
  - `reminder.triggered`: Emitted when a reminder is due for notification
  - `reminder.dismissed`: Emitted when a user dismisses a reminder
- **Partitioning Strategy**: Partition by due timestamp ranges
- **Retention Policy**: 24 hours after trigger time

### `task-updates`
- **Purpose**: Handle real-time synchronization of task changes across clients
- **Events**:
  - `task.status.changed`: Emitted when task status changes
  - `task.priority.changed`: Emitted when task priority is updated
  - `task.due.date.changed`: Emitted when task due date is modified
- **Partitioning Strategy**: Partition by task ID
- **Retention Policy**: 1 hour for real-time sync purposes

## Dapr Components

### `pubsub.kafka`
- **Purpose**: Event pub/sub broker for inter-service communication
- **Configuration**:
  - Broker addresses from Redpanda Cloud
  - Consumer group management for service instances
  - Message serialization using JSON format
  - Dead letter queue for failed message handling
  - **Detailed YAML**:
    ```yaml
    apiVersion: dapr.io/v1alpha1
    kind: Component
    metadata:
      name: pubsub.kafka
    spec:
      type: pubsub.kafka
      version: v1
      metadata:
      - name: brokers
        value: "{{ .Values.redpanda.brokers }}"
      - name: authRequired
        value: "true"
      - name: saslUsername
        value: "{{ .Values.redpanda.username }}"
      - name: saslPassword
        value: "{{ .Values.redpanda.password }}"
      - name: saslMechanism
        value: SCRAM-SHA-256
      - name: consumerGroup
        value: "{{ .Release.Name }}-consumer-group"
      - name: clientID
        value: "{{ .Release.Name }}"
      - name: maxMessageBytes
        value: "1048576"
      - name: consumeRetryInterval
        value: "100ms"
    ```

### `state.postgresql`
- **Purpose**: Distributed state management using PostgreSQL
- **Configuration**:
  - Connection to Neon Serverless PostgreSQL
  - State key format: `{user_id}/{entity_type}/{entity_id}`
  - TTL settings for temporary state
  - Transaction support for consistency
  - **Detailed YAML**:
    ```yaml
    apiVersion: dapr.io/v1alpha1
    kind: Component
    metadata:
      name: state.postgresql
    spec:
      type: state.postgresql
      version: v1
      metadata:
      - name: connectionString
        value: "host={{ .Values.postgresql.host }} port={{ .Values.postgresql.port }} user={{ .Values.postgresql.user }} password={{ .Values.postgresql.password }} dbname={{ .Values.postgresql.database }} sslmode=require"
      - name: tableName
        value: "dapr_state_store"
      - name: actorStateStore
        value: "true"
      - name: connectionMaxIdleTime
        value: "0ms"
      - name: connectionMaxLifetime
        value: "0ms"
      - name: connectionHealthInterval
        value: "500ms"
    ```

### `bindings.cron`
- **Purpose**: Scheduled triggers for reminder notifications
- **Configuration**:
  - Cron expressions for periodic checks
  - Integration with reminder service
  - Retry policies for failed executions
  - **Detailed YAML**:
    ```yaml
    apiVersion: dapr.io/v1alpha1
    kind: Component
    metadata:
      name: bindings.cron
    spec:
      type: bindings.cron
      version: v1
      metadata:
      - name: schedule
        value: "*/5 * * * *"  # Check for upcoming reminders every 5 minutes
    ```

### `secretstores.k8s`
- **Purpose**: Secure secret management in Kubernetes
- **Configuration**:
  - Integration with Kubernetes secrets
  - Access controls for different services
  - Rotation policies for sensitive data
  - **Detailed YAML**:
    ```yaml
    apiVersion: dapr.io/v1alpha1
    kind: Component
    metadata:
      name: secretstores.kubernetes
    spec:
      type: secretstores.kubernetes
      version: v1
      metadata: []
    ```

## Service Communication

### Frontend to Backend via Dapr Sidecar
- **Service Invocation**: Frontend communicates with backend services through Dapr sidecars
- **Method**: HTTP/gRPC calls to Dapr service invocation endpoint
- **Authentication**: JWT tokens passed through Dapr middleware
- **Load Balancing**: Automatic service discovery and load balancing by Dapr
- **Security**: mTLS encryption between sidecars