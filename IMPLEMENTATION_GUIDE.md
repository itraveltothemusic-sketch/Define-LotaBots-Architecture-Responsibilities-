# LotaBots Implementation Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Bot Deployment](#bot-deployment)
6. [Testing](#testing)
7. [Monitoring](#monitoring)
8. [Troubleshooting](#troubleshooting)
9. [Best Practices](#best-practices)

## Getting Started

This guide will walk you through implementing the LotaBots system for the Equity Builders platform.

### Architecture Overview

The LotaBots system consists of:
- **Message Queue Infrastructure**: RabbitMQ or Apache Kafka
- **Bot Runtime**: Containerized bots running on Kubernetes
- **Configuration Management**: YAML-based configuration
- **Monitoring Stack**: Prometheus + Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)

## Prerequisites

### Required Software
- Docker >= 20.10
- Kubernetes >= 1.20 (or similar orchestrator)
- Node.js >= 16.0 (for JavaScript bots)
- Python >= 3.8 (for Python bots)
- Git >= 2.30

### Required Services
- Message Queue (RabbitMQ or Kafka)
- Object Storage (S3 or compatible)
- Container Registry (ECR, Docker Hub, or private registry)
- Monitoring System (Prometheus)
- Log Aggregation (ELK or similar)

### Access Requirements
- Kubernetes cluster admin access
- Cloud provider credentials (AWS, GCP, or Azure)
- Git repository access
- Container registry access

## Installation

### Step 1: Infrastructure Setup

#### Deploy Message Queue
```bash
# Using RabbitMQ
kubectl apply -f infrastructure/rabbitmq/

# Or using Kafka
kubectl apply -f infrastructure/kafka/
```

#### Deploy Monitoring Stack
```bash
# Prometheus
kubectl apply -f infrastructure/prometheus/

# Grafana
kubectl apply -f infrastructure/grafana/
```

#### Deploy Logging Stack
```bash
kubectl apply -f infrastructure/logging/
```

### Step 2: Bot Runtime Setup

#### Create Namespace
```bash
kubectl create namespace lotabots
```

#### Deploy Shared Resources
```bash
# ConfigMaps for shared configuration
kubectl apply -f k8s/configmaps/

# Secrets for credentials
kubectl apply -f k8s/secrets/

# Service Accounts
kubectl apply -f k8s/serviceaccounts/
```

### Step 3: Build Bot Images

```bash
# Build all bot images
./scripts/build-all-bots.sh

# Or build individual bots
docker build -t buildbot:1.0.0 -f bots/buildbot/Dockerfile .
docker build -t testbot:1.0.0 -f bots/testbot/Dockerfile .
docker build -t deploybot:1.0.0 -f bots/deploybot/Dockerfile .
```

### Step 4: Push Images to Registry

```bash
# Tag images
docker tag buildbot:1.0.0 your-registry.com/buildbot:1.0.0

# Push images
docker push your-registry.com/buildbot:1.0.0
```

## Configuration

### Bot Configuration

Each bot requires a YAML configuration file. See `bot-config-schema.yaml` for the complete schema.

#### Example: Configuring BuildBot

1. Copy the template:
```bash
cp bots/buildbot.yaml.template bots/buildbot.yaml
```

2. Edit configuration:
```yaml
bot:
  name: "BuildBot"
  version: "1.0.0"
  enabled: true
  
triggers:
  - type: "event"
    pattern: "code.committed"
    
# ... additional configuration
```

3. Validate configuration:
```bash
./scripts/validate-config.sh bots/buildbot.yaml
```

### Environment-Specific Configuration

Create separate configurations for each environment:

```
configs/
  ├── development/
  │   ├── buildbot.yaml
  │   ├── testbot.yaml
  │   └── deploybot.yaml
  ├── staging/
  │   └── ...
  └── production/
      └── ...
```

### Secret Management

Use Kubernetes secrets or external secret managers:

```bash
# Create secret
kubectl create secret generic bot-credentials \
  --from-literal=github-token=YOUR_TOKEN \
  --from-literal=aws-access-key=YOUR_KEY \
  -n lotabots
```

## Bot Deployment

### Phase 1: Core Bots (Week 1-2)

Deploy in this order:

1. **BuildBot**
```bash
kubectl apply -f k8s/deployments/buildbot.yaml
```

2. **TestBot**
```bash
kubectl apply -f k8s/deployments/testbot.yaml
```

3. **MonitorBot**
```bash
kubectl apply -f k8s/deployments/monitorbot.yaml
```

4. **NotificationBot**
```bash
kubectl apply -f k8s/deployments/notificationbot.yaml
```

### Phase 2: Supporting Bots (Week 3-4)

5. **SecurityBot**
```bash
kubectl apply -f k8s/deployments/securitybot.yaml
```

6. **LintBot**
```bash
kubectl apply -f k8s/deployments/lintbot.yaml
```

7. **DeployBot**
```bash
kubectl apply -f k8s/deployments/deploybot.yaml
```

### Phase 3: Advanced Bots (Week 5-6)

8. Deploy remaining specialized bots based on needs

### Verification

After each deployment, verify the bot is running:

```bash
# Check pod status
kubectl get pods -n lotabots

# Check logs
kubectl logs -f deployment/buildbot -n lotabots

# Check health endpoint
kubectl port-forward deployment/buildbot 8080:8080 -n lotabots
curl http://localhost:8080/health
```

## Testing

### Unit Tests

Each bot should have unit tests:

```bash
# Run unit tests for a bot
cd bots/buildbot
npm test

# Run all unit tests
./scripts/test-all-bots.sh
```

### Integration Tests

Test bot-to-bot communication:

```bash
# Run integration tests
./scripts/integration-tests.sh
```

### End-to-End Tests

Simulate complete workflows:

```bash
# Simulate a full build-test-deploy cycle
./scripts/e2e-test.sh
```

### Chaos Testing

Test system resilience:

```bash
# Randomly disable bots and inject failures
./scripts/chaos-test.sh
```

## Monitoring

### Metrics

Key metrics to monitor:

- **Bot Health**: Active/Inactive status
- **Message Rate**: Messages processed per second
- **Error Rate**: Failed operations per second
- **Latency**: Time to process messages
- **Queue Depth**: Pending messages

### Dashboards

Import Grafana dashboards:

```bash
# Import bot dashboard
kubectl apply -f monitoring/dashboards/lotabots-overview.json
```

Access Grafana:
```bash
kubectl port-forward svc/grafana 3000:3000 -n monitoring
# Open http://localhost:3000
```

### Alerts

Configure alerts for critical conditions:

```yaml
# prometheus-rules.yaml
groups:
  - name: lotabots
    rules:
      - alert: BotDown
        expr: up{job="lotabots"} == 0
        for: 5m
        annotations:
          summary: "Bot {{ $labels.bot_name }} is down"
```

### Logging

Access logs through Kibana:

```bash
kubectl port-forward svc/kibana 5601:5601 -n logging
# Open http://localhost:5601
```

Create log queries:
```
bot_name:"BuildBot" AND level:"error"
```

## Troubleshooting

### Common Issues

#### Bot Not Starting

**Symptom**: Pod in CrashLoopBackOff
**Solution**:
```bash
# Check logs
kubectl logs deployment/buildbot -n lotabots

# Check configuration
kubectl describe configmap buildbot-config -n lotabots

# Verify secrets
kubectl get secret bot-credentials -n lotabots
```

#### Message Queue Issues

**Symptom**: Messages not being processed
**Solution**:
```bash
# Check RabbitMQ status
kubectl exec -it rabbitmq-0 -n lotabots -- rabbitmqctl status

# Check queue depth
kubectl exec -it rabbitmq-0 -n lotabots -- rabbitmqctl list_queues
```

#### High Memory Usage

**Symptom**: Bot OOMKilled
**Solution**:
```bash
# Increase memory limits
kubectl edit deployment buildbot -n lotabots

# Add resource limits
spec:
  containers:
  - name: buildbot
    resources:
      limits:
        memory: "4Gi"
      requests:
        memory: "2Gi"
```

#### Slow Processing

**Symptom**: High queue depth, slow message processing
**Solution**:
```bash
# Scale up bot replicas
kubectl scale deployment buildbot --replicas=3 -n lotabots

# Check resource constraints
kubectl top pods -n lotabots
```

### Debug Mode

Enable debug logging:

```yaml
# Update ConfigMap
monitoring:
  logging:
    level: "debug"
```

Apply and restart:
```bash
kubectl rollout restart deployment/buildbot -n lotabots
```

### Health Checks

Manual health check:
```bash
kubectl exec -it deployment/buildbot -n lotabots -- curl localhost:8080/health
```

## Best Practices

### 1. Configuration Management

- **Version Control**: Store all configurations in Git
- **Environment Separation**: Separate configs for dev/staging/prod
- **Secret Management**: Never commit secrets, use Kubernetes secrets or vault
- **Validation**: Always validate configs before deployment

### 2. Deployment Strategy

- **Gradual Rollout**: Deploy to dev → staging → production
- **Canary Deployments**: Test with subset of traffic first
- **Blue-Green**: Maintain previous version for quick rollback
- **Health Checks**: Wait for health checks before routing traffic

### 3. Monitoring and Alerting

- **Proactive Monitoring**: Monitor before issues occur
- **Alert Fatigue**: Only alert on actionable items
- **Runbooks**: Document response procedures
- **Post-Mortems**: Learn from incidents

### 4. Security

- **Least Privilege**: Give bots minimal required permissions
- **Credential Rotation**: Rotate credentials regularly
- **Audit Logging**: Log all bot actions
- **Vulnerability Scanning**: Scan bot images regularly

### 5. Performance

- **Resource Limits**: Set appropriate CPU/memory limits
- **Auto-Scaling**: Configure HPA for dynamic scaling
- **Circuit Breakers**: Prevent cascading failures
- **Caching**: Cache frequently accessed data

### 6. Maintenance

- **Regular Updates**: Keep bot versions up to date
- **Dependency Updates**: Update libraries regularly
- **Cleanup**: Remove unused bots and configurations
- **Documentation**: Keep docs in sync with implementation

### 7. Testing

- **Test Pyramid**: More unit tests, fewer integration tests
- **Test Coverage**: Aim for >80% coverage
- **Automated Testing**: Run tests in CI/CD
- **Production Testing**: Use canary deployments for prod testing

### 8. Documentation

- **Code Comments**: Document complex logic
- **Configuration Docs**: Document all config options
- **Runbooks**: Create operational runbooks
- **Architecture Diagrams**: Keep diagrams updated

## Next Steps

1. Review the [Architecture Document](LOTABOTS_ARCHITECTURE.md)
2. Configure your first bot following this guide
3. Deploy to development environment
4. Run tests and verify functionality
5. Deploy to staging for validation
6. Roll out to production incrementally

## Support and Resources

- **Documentation**: See `docs/` directory
- **Examples**: See `examples/` directory
- **Issues**: File issues in GitHub
- **Discussions**: Join team chat for questions

## Appendix

### Useful Commands

```bash
# List all bots
kubectl get deployments -n lotabots

# Check bot logs
kubectl logs -f -l app=lotabots -n lotabots

# Restart all bots
kubectl rollout restart deployments -n lotabots

# Scale a bot
kubectl scale deployment buildbot --replicas=5 -n lotabots

# Get bot metrics
kubectl top pods -n lotabots

# Port forward for debugging
kubectl port-forward deployment/buildbot 8080:8080 -n lotabots
```

### Configuration Templates

See `templates/` directory for:
- Kubernetes manifests
- Bot configurations
- Monitoring dashboards
- Alert rules

### Version Compatibility Matrix

| Component       | Minimum Version | Recommended Version |
|----------------|----------------|---------------------|
| Kubernetes     | 1.20           | 1.25+               |
| Docker         | 20.10          | 23.0+               |
| RabbitMQ       | 3.8            | 3.11+               |
| Prometheus     | 2.30           | 2.40+               |
| Grafana        | 8.0            | 9.0+                |
