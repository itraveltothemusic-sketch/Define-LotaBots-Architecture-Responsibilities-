# LotaBots Quick Reference

A quick reference guide for the LotaBots system. For detailed information, see [LOTABOTS_ARCHITECTURE.md](LOTABOTS_ARCHITECTURE.md).

## Bot Overview

| Bot Name | Category | Purpose | Input | Output |
|----------|----------|---------|-------|--------|
| BuildBot | Development | Build and compile code | `code.committed` | `build.completed` |
| TestBot | Development | Run automated tests | `build.completed` | `test.completed` |
| DeployBot | Operations | Deploy applications | `test.completed` | `deploy.completed` |
| MonitorBot | Operations | Monitor system health | Schedule (5 min) | `alert.triggered` |
| SecurityBot | Security | Security scanning | `code.committed` | `security.scan_completed` |
| LintBot | Development | Code quality checks | `code.committed` | `lint.completed` |
| ReviewBot | Development | Code review assistance | `pr.created` | Review comments |
| DatabaseBot | Data | Database operations | `migration.requested` | `migration.completed` |
| DocumentationBot | Development | Generate docs | `code.committed` | Docs updated |
| NotificationBot | Operations | Send notifications | All events | Notifications |
| ScalingBot | Operations | Auto-scale resources | Metrics | `scaling.completed` |
| BackupBot | Data | Data backup | Schedule | `backup.completed` |
| LogBot | Operations | Log aggregation | All logs | Indexed logs |
| ComplianceBot | Security | Compliance checks | Schedule | `compliance.report` |
| IncidentBot | Operations | Incident management | `alert.triggered` | Incident tickets |

## Common Event Types

### Build Events
- `build.started` - Build initiated
- `build.completed` - Build succeeded
- `build.failed` - Build failed

### Test Events
- `test.started` - Tests started
- `test.completed` - Tests passed
- `test.failed` - Tests failed

### Deploy Events
- `deploy.requested` - Deployment requested
- `deploy.started` - Deployment initiated
- `deploy.completed` - Deployment succeeded
- `deploy.failed` - Deployment failed
- `deploy.rolled_back` - Rollback executed

### Security Events
- `security.scan_started` - Security scan initiated
- `security.scan_completed` - Scan completed
- `security.vulnerabilities_found` - Vulnerabilities detected
- `security.secrets_found` - Secrets detected

### Monitor Events
- `alert.triggered` - Alert raised
- `alert.resolved` - Alert resolved
- `anomaly.detected` - Anomaly found

### Incident Events
- `incident.created` - New incident
- `incident.updated` - Incident updated
- `incident.resolved` - Incident resolved

## Message Priority Levels

| Priority | TTL | Use Case |
|----------|-----|----------|
| Critical | 5 min | Security alerts, production incidents |
| High | 30 min | Production deployments, critical builds |
| Medium | 2 hours | Regular builds, tests |
| Low | 24 hours | Scheduled tasks, batch jobs |

## Common Workflows

### 1. Standard Deployment
```
Code Push → BuildBot → TestBot → SecurityBot → DeployBot → MonitorBot
```

### 2. Hotfix
```
Incident → Manual Fix → BuildBot → TestBot (minimal) → DeployBot → MonitorBot
```

### 3. Database Migration
```
Migration Script → DatabaseBot → BackupBot → DeployBot → TestBot → MonitorBot
```

### 4. Security Alert
```
CVE Alert → SecurityBot → Manual Patch → BuildBot → TestBot → DeployBot
```

## Configuration Quick Reference

### Minimal Bot Configuration
```yaml
bot:
  name: "BotName"
  version: "1.0.0"
  enabled: true
  description: "Description"
  category: "development"

triggers:
  - type: "event"
    pattern: "some.event"

actions:
  - name: "action"
    type: "execute"
    command: "do-something"
```

### Message Format
```json
{
  "id": "uuid",
  "type": "event.type",
  "timestamp": "ISO-8601",
  "source": {"bot_name": "SourceBot"},
  "destination": {"bot_name": "DestBot"},
  "payload": { /* data */ }
}
```

## Validation

```bash
# Validate single config
python3 scripts/validate-config.py bots/botname.yaml

# Validate all configs
python3 scripts/validate-config.py --all
```

## Bot Categories

- **Infrastructure**: System infrastructure, deployment, monitoring
- **Development**: Code quality, testing, build processes
- **Operations**: Runtime operations, scaling, incident response
- **Data**: Data processing, storage, analytics
- **Security**: Security scanning, compliance, threat detection

## Resource Limits

### Recommended Defaults
```yaml
constraints:
  max_concurrent_jobs: 5
  timeout: 3600
  retry_policy:
    max_attempts: 3
    backoff: "exponential"
  resource_limits:
    cpu: "2000m"
    memory: "4Gi"
```

## Bot Dependencies

### Common Patterns
- BuildBot → TestBot (tests require build artifacts)
- TestBot → DeployBot (deploy requires passing tests)
- DeployBot → MonitorBot (monitor after deployment)
- SecurityBot → DeployBot (security approval required)

### Dependency Rules
- **Required**: Bot cannot function without dependency
- **Optional**: Bot works better with dependency
- **Conflicts**: Bot cannot run with conflicting bot

## Security Best Practices

### Permissions
```yaml
security:
  permissions:
    - resource: "resource-name"
      actions: ["read", "write"]
```

### Encryption
```yaml
security:
  encryption:
    enabled: true
    algorithm: "AES-256"
```

### Authentication
```yaml
security:
  authentication:
    method: "token"  # or "certificate", "oauth"
```

## Monitoring Metrics

### Key Metrics to Track
- **Bot Health**: Up/Down status
- **Message Rate**: Messages/second
- **Error Rate**: Failed operations/total
- **Response Time**: Processing duration
- **Queue Depth**: Pending messages

### Health Check
```yaml
monitoring:
  health_check:
    enabled: true
    interval: 30
    endpoint: "/health"
```

## Troubleshooting

### Common Issues

| Issue | Symptom | Solution |
|-------|---------|----------|
| Bot not starting | CrashLoopBackOff | Check logs and config |
| Messages not processing | Growing queue | Check bot health, scale up |
| High error rate | Many failures | Check logs, validate inputs |
| Slow processing | High latency | Scale up, optimize actions |

### Debug Commands
```bash
# Check bot status
kubectl get pods -n lotabots

# View bot logs
kubectl logs -f deployment/buildbot -n lotabots

# Check queue depth
# (depends on message queue implementation)
```

## File Structure

```
.
├── README.md                    # Overview
├── LOTABOTS_ARCHITECTURE.md     # Detailed architecture
├── IMPLEMENTATION_GUIDE.md      # Implementation guide
├── MESSAGE_PROTOCOL.md          # Message specification
├── WORKFLOW_EXAMPLES.md         # Example workflows
├── CONTRIBUTING.md              # Contribution guide
├── bot-config-schema.yaml       # Configuration schema
├── bots/                        # Bot configurations
│   ├── buildbot.yaml
│   ├── testbot.yaml
│   ├── deploybot.yaml
│   ├── monitorbot.yaml
│   └── securitybot.yaml
└── scripts/                     # Utility scripts
    └── validate-config.py       # Config validator
```

## Version Compatibility

| Component | Min Version | Recommended |
|-----------|-------------|-------------|
| Kubernetes | 1.20 | 1.25+ |
| Docker | 20.10 | 23.0+ |
| RabbitMQ | 3.8 | 3.11+ |
| Prometheus | 2.30 | 2.40+ |

## Next Steps

1. Read [Architecture Document](LOTABOTS_ARCHITECTURE.md) for system overview
2. Follow [Implementation Guide](IMPLEMENTATION_GUIDE.md) to deploy
3. Review [Workflow Examples](WORKFLOW_EXAMPLES.md) for common patterns
4. Check [Contributing Guide](CONTRIBUTING.md) to contribute

## Support

- **Documentation**: See docs/ directory
- **Issues**: File on GitHub
- **Questions**: Create discussion

---

**Remember**: Each bot has a single responsibility. Respect boundaries!
