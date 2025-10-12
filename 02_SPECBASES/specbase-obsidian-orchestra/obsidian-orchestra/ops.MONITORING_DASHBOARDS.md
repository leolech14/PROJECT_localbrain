---
title: "Monitoring Dashboards & Incident Runbooks"
type: "operations"
category: "observability"
last_updated: "2025-10-01"
version: "1.0.0"
---

# ops.MONITORING_DASHBOARDS - Dashboards & Runbooks

## Purpose

Monitoring Dashboards specification defines Grafana dashboards, alert configurations, and incident response runbooks for operational excellence and rapid problem resolution.

## Dashboard Specifications

### 1. Platform Health Dashboard

**Metrics:**
```yaml
platform_health_dashboard:
  panels:
    - system_uptime:
        query: "avg(up{job='app'}) * 100"
        target: ">99.9%"
        alert: "<99.5%"

    - error_rate:
        query: "rate(http_requests_total{status=~'5..'}[5m])"
        target: "<0.1%"
        alert: ">1%"

    - response_time:
        query: "histogram_quantile(0.95, http_request_duration_ms)"
        target: "<100ms p95"
        alert: ">500ms"

    - active_users:
        query: "count(active_sessions)"
        info_only: true
```

### 2. Ingestion Pipeline Dashboard

```yaml
ingestion_dashboard:
  panels:
    - ingestion_lag:
        query: "time() - max(last_ingestion_timestamp)"
        target: "<60s"
        alert: ">300s"

    - ingestion_throughput:
        query: "rate(transactions_ingested_total[5m])"
        target: ">10/sec"
        alert: "<1/sec"

    - ocr_accuracy:
        query: "avg(ocr_confidence_score)"
        target: ">90%"
        alert: "<80%"

    - webhook_delivery:
        query: "histogram_quantile(0.95, webhook_latency_ms)"
        target: "<100ms p95"
        alert: ">1000ms"
```

### 3. Agent Performance Dashboard

```yaml
agent_dashboard:
  panels:
    - active_agents:
        query: "count(agents{status='active'})"
        info_only: true

    - agent_success_rate:
        query: "rate(agent_actions{status='success'}[5m]) / rate(agent_actions[5m])"
        target: ">95%"
        alert: "<90%"

    - policy_violations:
        query: "rate(policy_violations_total[5m])"
        target: "0"
        alert: ">0.01/min"

    - kill_switch_response:
        query: "histogram_quantile(0.99, kill_switch_response_ms)"
        target: "<300ms p99"
        alert: ">500ms"
```

### 4. Data Quality Dashboard

```yaml
data_quality_dashboard:
  panels:
    - duplicate_rate:
        query: "rate(duplicates_detected[5m])"
        target: "<1%"
        alert: ">5%"

    - categorization_accuracy:
        query: "avg(categorization_confidence)"
        target: ">95%"
        alert: "<90%"

    - reconciliation_gaps:
        query: "count(unreconciled_transactions)"
        target: "0"
        alert: ">10"

    - data_freshness:
        query: "time() - max(last_sync_timestamp) by (account_id)"
        target: "<5min"
        alert: ">15min"
```

## Incident Runbooks

### Runbook 1: High Error Rate

```markdown
# RUNBOOK: High Error Rate (>1%)

## Trigger
Alert: error_rate > 1% for 5 minutes

## Severity
🔴 P1 (Critical) - Immediate response required

## Investigation Steps

1. **Check Error Types**
   ```
   Grafana → Error Rate panel → Drill down by error type
   Sentry → Issues → Sort by frequency
   ```

2. **Identify Affected Module**
   ```
   Filter errors by:
   - URL path (/api/*, /dashboard/*, etc.)
   - Module tags (agent_runtime, data_pool, etc.)
   ```

3. **Check Recent Deployments**
   ```
   git log --since="1 hour ago"
   Vercel deployments dashboard
   ```

4. **Review Logs**
   ```
   # CloudWatch/Axiom query
   level:error | timestamp > now-5m
   ```

## Resolution Actions

**If deployment-related:**
- Rollback to previous version immediately
- Investigate issue in staging
- Fix and redeploy

**If external service:**
- Check Open Finance API status
- Check database connectivity
- Enable fallback mechanisms

**If code bug:**
- Apply hotfix if critical
- Create incident ticket
- Schedule proper fix

## Communication

- Update #incidents Slack channel
- Notify on-call engineer
- Update status page if user-facing

## Post-Incident

- Write incident report
- Conduct blameless postmortem
- Create action items to prevent recurrence
```

### Runbook 2: Webhook Delivery Lag

```markdown
# RUNBOOK: Webhook Delivery Lag (>1s)

## Trigger
Alert: webhook_delivery_p95 > 1000ms

## Severity
🟡 P2 (High) - Response within 30 minutes

## Investigation

1. **Check Redis Pub/Sub Health**
   ```
   redis-cli PING
   redis-cli INFO stats | grep pubsub
   ```

2. **Check Subscriber Backlog**
   ```
   # Count pending messages
   redis-cli PUBSUB NUMSUB transactions.new
   ```

3. **Review Consumer Lag**
   ```
   # Check if consumers are processing slowly
   Grafana → Consumer Lag panel
   ```

## Resolution

**If Redis issue:**
- Restart Redis (if single instance)
- Failover to replica (if clustered)
- Check memory usage (may need scaling)

**If consumer slow:**
- Scale consumers (add more workers)
- Optimize consumer code
- Increase batch size

**If network issue:**
- Check VPC connectivity
- Verify security groups
- Test Redis endpoint reachability

## Prevention

- Implement consumer auto-scaling
- Add Redis cluster mode
- Set up Redis memory alerts
```

### Runbook 3: Data Quality Incident

```markdown
# RUNBOOK: Data Quality Incident

## Trigger
Alert: categorization_accuracy < 90%

## Severity
🟡 P2 (High) - Impacts user experience

## Investigation

1. **Identify Affected Transactions**
   ```sql
   SELECT * FROM transactions
   WHERE categorization_confidence < 0.9
   AND created_at > NOW() - INTERVAL '1 hour'
   LIMIT 100;
   ```

2. **Check ML Model Status**
   ```
   # Verify model version
   curl https://api/ml/model/status

   # Check prediction latency
   Grafana → ML Model Performance panel
   ```

3. **Review Recent Merchant Patterns**
   ```
   # New merchants causing low confidence?
   SELECT merchant, AVG(confidence)
   FROM transactions
   WHERE created_at > NOW() - INTERVAL '1 day'
   GROUP BY merchant
   HAVING AVG(confidence) < 0.9;
   ```

## Resolution

**If model degradation:**
- Retrain model with recent data
- Deploy new model version
- Monitor improvement

**If new merchant patterns:**
- Add patterns to normalization
- Update categorization rules
- Backfill affected transactions

**If data quality issue:**
- Review ingestion pipeline
- Check OCR confidence scores
- Flag transactions for manual review

## Communication

- Notify data team
- Update affected users (if significant)
- Document new patterns learned
```

## Alert Configuration

### Critical Alerts (P1 - Immediate)

```yaml
critical_alerts:
  - name: "System Down"
    condition: "uptime < 95%"
    duration: "1 minute"
    channels: ["pagerduty", "slack-critical", "sms"]

  - name: "Kill-Switch Performance Violation"
    condition: "kill_switch_response_p99 > 500ms"
    duration: "1 minute"
    channels: ["pagerduty", "slack-critical"]

  - name: "Data Loss Detected"
    condition: "rate(transactions_lost[5m]) > 0"
    duration: "immediate"
    channels: ["pagerduty", "slack-critical", "email"]
```

### High Priority Alerts (P2 - 30min response)

```yaml
high_priority_alerts:
  - name: "Error Rate High"
    condition: "error_rate > 1%"
    duration: "5 minutes"
    channels: ["slack-ops", "email"]

  - name: "Webhook Lag"
    condition: "webhook_delivery_p95 > 1000ms"
    duration: "5 minutes"
    channels: ["slack-ops"]

  - name: "Agent Failure Rate High"
    condition: "agent_success_rate < 90%"
    duration: "10 minutes"
    channels: ["slack-ops"]
```

## Success Criteria

| Metric | Target | Source |
|--------|--------|--------|
| Dashboard Coverage | 100% of SLIs | Grafana |
| Alert Response Time | P1 <5min, P2 <30min | PagerDuty |
| Runbook Completeness | All P1/P2 scenarios | Docs |
| MTTR | <30min for P1 | Incident tracker |

---
