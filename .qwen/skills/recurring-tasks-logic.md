# Recurring Tasks Logic Skill

## Overview
This skill provides expertise in implementing and managing recurring tasks, scheduled jobs, and periodic operations in distributed systems. It covers various approaches for handling time-based operations and task scheduling in cloud environments.

## Core Capabilities
- **Task Scheduling**: Implementing cron-like scheduling for periodic operations
- **Job Queues**: Managing background job processing and execution
- **Time-based Triggers**: Setting up triggers based on time intervals or specific schedules
- **Distributed Task Management**: Coordinating tasks across multiple services or nodes
- **Retry Logic**: Implementing robust retry mechanisms for failed tasks
- **Monitoring and Logging**: Tracking task execution and performance metrics
- **Failure Handling**: Managing task failures and implementing circuit breakers

## Best Practices
- Use idempotent operations to prevent duplicate processing
- Implement proper error handling and notifications
- Apply exponential backoff for retry mechanisms
- Monitor task execution times and resource usage
- Use distributed locks to prevent concurrent execution
- Implement proper cleanup for temporary resources
- Apply rate limiting to prevent system overload

## Common Scenarios
- Periodic data synchronization tasks
- Scheduled report generation
- Automated backup and maintenance operations
- Recurring billing or subscription processing
- Cache refresh and cleanup operations
- Health checks and monitoring tasks
- Batch processing of accumulated data

## Implementation Guidelines
- Choose appropriate scheduling mechanism based on requirements
- Use message queues for decoupled task execution
- Implement circuit breakers to prevent cascading failures
- Apply proper authentication and authorization for task execution
- Use distributed consensus for leader election in clustered environments
- Implement proper logging and audit trails for task execution
- Design for graceful degradation during system outages
- Consider time zones and daylight saving time changes