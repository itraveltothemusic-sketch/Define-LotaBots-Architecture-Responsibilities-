# LotaBots Message Protocol Specification

## Version: 1.0.0

## Overview

This document defines the standard message format and communication protocol for all LotaBots. All bots MUST adhere to this specification to ensure proper system interoperability.

## Message Format

### Standard Message Structure

All messages exchanged between bots follow this JSON structure:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "version": "1.0.0",
  "timestamp": "2026-02-10T16:46:31.466Z",
  "source": {
    "bot_name": "BuildBot",
    "bot_version": "1.0.0",
    "instance_id": "buildbot-7d8f9c-xk2p9"
  },
  "destination": {
    "bot_name": "TestBot",
    "routing_key": "test.unit"
  },
  "type": "build.completed",
  "payload": {
    "build_id": "build-12345",
    "branch": "main",
    "commit_sha": "a1b2c3d4e5f6",
    "artifact_url": "s3://artifacts/build-12345.tar.gz",
    "build_duration": 125.5,
    "status": "success"
  },
  "metadata": {
    "priority": "high",
    "ttl": 3600,
    "correlation_id": "workflow-abc123",
    "trace_id": "trace-xyz789"
  }
}
```

### Field Descriptions

#### Required Fields

- **id** (string, UUID): Unique message identifier
- **version** (string): Protocol version (semantic versioning)
- **timestamp** (string, ISO-8601): Message creation timestamp
- **source** (object): Source bot information
  - **bot_name** (string): Name of the sending bot
  - **bot_version** (string): Version of the sending bot
  - **instance_id** (string): Unique instance identifier
- **type** (string): Message type (event name)
- **payload** (object): Message-specific data

#### Optional Fields

- **destination** (object): Target bot information
  - **bot_name** (string): Name of the receiving bot
  - **routing_key** (string): Message routing key
- **metadata** (object): Additional message metadata
  - **priority** (string): Message priority (critical, high, medium, low)
  - **ttl** (integer): Time-to-live in seconds
  - **correlation_id** (string): Correlation identifier for related messages
  - **trace_id** (string): Distributed tracing identifier

## Message Types

### Event Categories

Events are categorized by domain and action:

Format: `{domain}.{action}`

Examples:
- `build.started`
- `build.completed`
- `build.failed`
- `test.started`
- `test.completed`
- `test.failed`

### Standard Event Types

#### Build Events
- `build.started` - Build process initiated
- `build.completed` - Build successfully completed
- `build.failed` - Build process failed
- `build.cancelled` - Build cancelled by user

#### Test Events
- `test.started` - Test execution started
- `test.completed` - All tests passed
- `test.failed` - One or more tests failed
- `test.skipped` - Tests skipped

#### Deploy Events
- `deploy.requested` - Deployment requested
- `deploy.started` - Deployment initiated
- `deploy.completed` - Deployment successful
- `deploy.failed` - Deployment failed
- `deploy.rolled_back` - Deployment rolled back

#### Security Events
- `security.scan_started` - Security scan initiated
- `security.scan_completed` - Security scan completed
- `security.vulnerabilities_found` - Vulnerabilities detected
- `security.secrets_found` - Secrets detected in code
- `security.compliance_violated` - Compliance violation detected

#### Monitor Events
- `monitor.health_check_passed` - Health check successful
- `monitor.health_check_failed` - Health check failed
- `monitor.alert_triggered` - Alert condition met
- `monitor.alert_resolved` - Alert condition resolved
- `monitor.anomaly_detected` - Anomaly in metrics detected

#### Notification Events
- `notification.sent` - Notification delivered
- `notification.failed` - Notification delivery failed
- `notification.acknowledged` - Notification acknowledged

#### Incident Events
- `incident.created` - New incident created
- `incident.updated` - Incident status updated
- `incident.resolved` - Incident resolved
- `incident.escalated` - Incident escalated

## Communication Patterns

### 1. Point-to-Point

Direct message from one bot to another:

```
BuildBot → [Queue: testbot.inbox] → TestBot
```

### 2. Publish-Subscribe

One bot publishes, multiple bots subscribe:

```
BuildBot → [Topic: build.completed] → TestBot
                                    → SecurityBot
                                    → NotificationBot
```

### 3. Request-Response

Bot sends request and waits for response:

```
DeployBot → [Queue: deploybot.requests] → "deploy.requested"
          ← [Queue: deploybot.responses] ← "deploy.completed"
```

### 4. Workflow/Chain

Sequential processing through multiple bots:

```
BuildBot → TestBot → SecurityBot → DeployBot
```

## Message Exchange Patterns

### Fire-and-Forget

Sender publishes message and doesn't wait for acknowledgment:

```javascript
{
  "type": "build.completed",
  "metadata": {
    "priority": "low",
    "ttl": 300
  }
}
```

### Guaranteed Delivery

Message requires acknowledgment:

```javascript
{
  "type": "deploy.started",
  "metadata": {
    "priority": "critical",
    "ttl": 3600,
    "requires_ack": true
  }
}
```

### Correlated Messages

Messages that are part of a workflow:

```javascript
// First message
{
  "type": "build.started",
  "metadata": {
    "correlation_id": "workflow-12345"
  }
}

// Related message
{
  "type": "build.completed",
  "metadata": {
    "correlation_id": "workflow-12345"
  }
}
```

## Priority Levels

### Critical
- Immediate processing required
- Queue TTL: 5 minutes
- Use cases: Security alerts, production incidents

### High
- Prioritized processing
- Queue TTL: 30 minutes
- Use cases: Production deployments, critical builds

### Medium (Default)
- Normal processing
- Queue TTL: 2 hours
- Use cases: Regular builds, tests

### Low
- Best-effort processing
- Queue TTL: 24 hours
- Use cases: Scheduled tasks, batch jobs

## Error Handling

### Error Message Format

```json
{
  "type": "bot.error",
  "payload": {
    "error_code": "BUILD_FAILED",
    "error_message": "Compilation failed: syntax error",
    "error_details": {
      "file": "src/main.js",
      "line": 42,
      "column": 15
    },
    "original_message_id": "550e8400-e29b-41d4-a716-446655440000",
    "retry_count": 2,
    "max_retries": 3
  }
}
```

### Standard Error Codes

- `INVALID_MESSAGE` - Message format invalid
- `MISSING_FIELD` - Required field missing
- `TIMEOUT` - Operation timed out
- `DEPENDENCY_UNAVAILABLE` - Required service unavailable
- `VALIDATION_FAILED` - Input validation failed
- `PERMISSION_DENIED` - Insufficient permissions
- `RESOURCE_EXHAUSTED` - Resource limit exceeded

## Dead Letter Queue

Messages that cannot be processed are sent to a dead letter queue:

```
Failed Message → [Dead Letter Queue] → Manual Review
```

Dead letter message format:
```json
{
  "original_message": { /* original message */ },
  "failure_reason": "MAX_RETRIES_EXCEEDED",
  "failure_timestamp": "2026-02-10T16:46:31.466Z",
  "retry_history": [
    {
      "attempt": 1,
      "timestamp": "2026-02-10T16:45:00.000Z",
      "error": "TIMEOUT"
    },
    {
      "attempt": 2,
      "timestamp": "2026-02-10T16:46:00.000Z",
      "error": "TIMEOUT"
    }
  ]
}
```

## Message Validation

All messages MUST be validated before processing:

### Schema Validation
- Required fields present
- Field types correct
- Format specifications met

### Business Logic Validation
- Payload data is valid
- References exist
- Permissions verified

### Example Validation

```javascript
function validateMessage(message) {
  // Check required fields
  if (!message.id || !message.type || !message.source) {
    throw new Error('MISSING_FIELD');
  }
  
  // Validate UUID format
  if (!isValidUUID(message.id)) {
    throw new Error('INVALID_MESSAGE');
  }
  
  // Validate timestamp
  if (!isValidISO8601(message.timestamp)) {
    throw new Error('INVALID_MESSAGE');
  }
  
  // Validate event type
  if (!isValidEventType(message.type)) {
    throw new Error('INVALID_MESSAGE');
  }
  
  return true;
}
```

## Message Routing

### Routing Keys

Messages are routed using dot-separated routing keys:

Format: `{domain}.{action}.{qualifier}`

Examples:
- `build.completed.success`
- `build.completed.failure`
- `test.completed.success`
- `deploy.started.production`

### Routing Patterns

Subscribers can use wildcards:

- `*` matches exactly one word
- `#` matches zero or more words

Examples:
- `build.*` - All build events
- `*.completed` - All completion events
- `build.#` - All build-related events
- `#.failed` - All failure events

## Message Retention

### Retention Policies

- **Critical Messages**: 365 days
- **High Priority**: 90 days
- **Medium Priority**: 30 days
- **Low Priority**: 7 days

### Archival

Messages older than retention period are:
1. Archived to object storage (S3)
2. Removed from active queues
3. Indexed for historical queries

## Security Considerations

### Message Encryption

All messages containing sensitive data MUST be encrypted:

```json
{
  "type": "deploy.credentials",
  "payload": {
    "encrypted": true,
    "algorithm": "AES-256-GCM",
    "data": "encrypted-base64-string",
    "key_id": "key-12345"
  }
}
```

### Message Signing

Critical messages MUST be signed:

```json
{
  "type": "deploy.started",
  "payload": { /* payload */ },
  "signature": {
    "algorithm": "RSA-SHA256",
    "value": "signature-base64-string",
    "key_id": "signing-key-67890"
  }
}
```

### Access Control

- Messages must include sender authentication
- Receivers must verify sender identity
- Sensitive messages require encryption

## Performance Considerations

### Message Size Limits

- **Maximum message size**: 256 KB
- **Recommended size**: < 64 KB
- **Large payloads**: Use reference URLs

### Batching

For high-volume scenarios, use batch messages:

```json
{
  "type": "batch.messages",
  "payload": {
    "batch_id": "batch-12345",
    "message_count": 100,
    "messages": [
      { /* message 1 */ },
      { /* message 2 */ }
    ]
  }
}
```

### Compression

Large messages can be compressed:

```json
{
  "type": "test.results",
  "payload": {
    "compressed": true,
    "algorithm": "gzip",
    "data": "compressed-base64-string"
  }
}
```

## Monitoring and Observability

### Message Metrics

Track these metrics for all messages:

- **Message count**: Total messages processed
- **Processing time**: Time to process message
- **Queue depth**: Messages waiting in queue
- **Error rate**: Failed message percentage
- **Throughput**: Messages per second

### Distributed Tracing

Use trace_id for distributed tracing:

```json
{
  "metadata": {
    "trace_id": "trace-abc123",
    "span_id": "span-def456",
    "parent_span_id": "span-ghi789"
  }
}
```

## Version Compatibility

### Protocol Versioning

Protocol follows semantic versioning (MAJOR.MINOR.PATCH):

- **MAJOR**: Breaking changes
- **MINOR**: Backward-compatible features
- **PATCH**: Bug fixes

### Backward Compatibility

Bots MUST support at least one previous major version:

- Current version: 1.0.0
- Must support: 0.x.x (if exists)

### Version Negotiation

Bots advertise supported versions:

```json
{
  "type": "bot.capabilities",
  "payload": {
    "supported_protocol_versions": ["1.0.0", "0.9.0"],
    "preferred_version": "1.0.0"
  }
}
```

## Appendix

### Complete Example: Build-Test-Deploy Flow

```json
// 1. Build started
{
  "id": "msg-001",
  "type": "build.started",
  "timestamp": "2026-02-10T16:00:00.000Z",
  "source": {
    "bot_name": "BuildBot",
    "bot_version": "1.0.0"
  },
  "metadata": {
    "correlation_id": "workflow-001",
    "priority": "high"
  }
}

// 2. Build completed
{
  "id": "msg-002",
  "type": "build.completed",
  "timestamp": "2026-02-10T16:05:00.000Z",
  "source": {
    "bot_name": "BuildBot"
  },
  "destination": {
    "bot_name": "TestBot"
  },
  "payload": {
    "build_id": "build-12345",
    "artifact_url": "s3://artifacts/build-12345.tar.gz"
  },
  "metadata": {
    "correlation_id": "workflow-001",
    "priority": "high"
  }
}

// 3. Tests completed
{
  "id": "msg-003",
  "type": "test.completed",
  "timestamp": "2026-02-10T16:15:00.000Z",
  "source": {
    "bot_name": "TestBot"
  },
  "destination": {
    "bot_name": "DeployBot"
  },
  "payload": {
    "total_tests": 247,
    "passed_tests": 247,
    "coverage": 85.5
  },
  "metadata": {
    "correlation_id": "workflow-001",
    "priority": "high"
  }
}

// 4. Deploy completed
{
  "id": "msg-004",
  "type": "deploy.completed",
  "timestamp": "2026-02-10T16:20:00.000Z",
  "source": {
    "bot_name": "DeployBot"
  },
  "payload": {
    "environment": "production",
    "version": "v1.2.3"
  },
  "metadata": {
    "correlation_id": "workflow-001",
    "priority": "high"
  }
}
```

## References

- [LotaBots Architecture](LOTABOTS_ARCHITECTURE.md)
- [Implementation Guide](IMPLEMENTATION_GUIDE.md)
- [Bot Configuration Schema](bot-config-schema.yaml)
