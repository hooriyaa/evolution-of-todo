# Kafka Event-Driven Architecture Skill

## Overview
This skill provides expertise in Apache Kafka and event-driven architecture patterns, including topic design, producer/consumer implementations, stream processing, and real-time analytics.

## Core Capabilities
- **Kafka Topics**: Designing and managing topics, partitions, and replication
- **Producers**: Implementing efficient message publishing with proper serialization
- **Consumers**: Building robust consumer applications with proper offset management
- **Consumer Groups**: Managing consumer group lifecycle and rebalancing
- **Stream Processing**: Using Kafka Streams API for real-time data processing
- **Event Sourcing**: Implementing event sourcing patterns with Kafka
- **CQRS**: Applying Command Query Responsibility Segregation with event streams

## Best Practices
- Partition topics appropriately for scalability
- Use proper serialization formats (Avro, JSON, Protobuf)
- Implement idempotent producers and consumers
- Monitor consumer lag and throughput
- Apply proper retention policies
- Use schema registry for data governance
- Handle partition reassignment gracefully

## Common Scenarios
- Real-time data pipeline construction
- Microservice communication via events
- Log aggregation and analysis
- Stream processing and transformation
- Event-driven microservices architecture
- Real-time analytics and monitoring
- Audit logging and compliance tracking

## Implementation Guidelines
- Choose appropriate partitioning strategies
- Configure proper acknowledgment settings
- Implement retry mechanisms and dead letter queues
- Use Kafka Connect for integration with external systems
- Apply exactly-once semantics where needed
- Monitor and alert on key Kafka metrics
- Plan for disaster recovery and backup strategies