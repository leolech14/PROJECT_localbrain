---
# ===== MODULE IDENTITY =====
title: "Background Jobs - Scheduled Processing"
module_id: "background_jobs"
type: "backend"
category: "backend"

# ===== SYSTEMATIC SCAFFOLDING =====
lifecycle: "dev"
state: "minimal"
seat: "scale"

# ===== AVAILABILITY AND ACCESS =====
phase_availability: "always"
priority: "high"
agent_accessible: true
user_configurable: false

# ===== PROMOTION GATES =====
promotion_gates:
  to_intermediate_i1:
    - "Job scheduler operational"
    - "Basic jobs running reliably"
    - "Monitoring and alerting active"
  to_intermediate_i2:
    - "Job queue management optimized"
    - "Retry logic robust"
    - "Performance at scale validated"
  to_intermediate_i3:
    - "Advanced scheduling features complete"
    - "Job dependencies handled"
    - "Complete observability operational"
  to_complete:
    - "Production deployment validated"
    - "All job types operational"
    - "Performance SLA met"

# ===== OBSERVABILITY =====
observability:
  metrics:
    - "background_jobs.execution_success_rate"
    - "background_jobs.execution_time_ms"
    - "background_jobs.queue_depth"
  alerts:
    - "background_jobs.failure_rate_high"
    - "background_jobs.queue_backlog"
    - "background_jobs.execution_timeout"
  dashboards:
    - "background_jobs_health"
    - "background_jobs_performance"

# ===== SECURITY REQUIREMENTS =====
security:
  authentication_required: false
  authorization_level: "system"
  data_classification: "internal"
  encryption_at_rest: false
  encryption_in_transit: true
  audit_logging: true
  rate_limiting: false
  input_validation: "basic"

# ===== TECHNICAL METADATA =====
dependencies: ["job_scheduler", "redis"]
integrations: ["inngest", "bullmq"]
api_contracts: ["/api/jobs/*"]
last_updated: "2025-10-01"
version: "1.0.0"
maintainer: "Orchestra.blue Team"

# ===== AGENTIC INTEGRATION =====
agent_capabilities:
  can_read: true
  can_write: true
  can_propose_changes: true
  requires_approval: true

agent_boundaries:
  allowed_operations: ["trigger_job", "check_status"]
  forbidden_operations: ["cancel_system_jobs", "modify_schedule"]
  escalation_triggers: ["job_failure_rate_high"]
---

# 54 Background Jobs - Scheduled Processing

## Purpose

Background Jobs provides scheduled and event-driven processing for data synchronization, insight refresh, cleanup tasks, and agent automation without blocking user interactions.

## Primary Features

- **Scheduled Jobs:** Cron-based recurring tasks (daily, weekly, monthly)
- **Event-Driven Jobs:** Triggered by system events (new transaction, sync complete)
- **Job Queue Management:** Prioritization, retry logic, dead letter handling
- **Monitoring & Alerting:** Job health, execution time, failure tracking
- **Agent Job Integration:** Agents can schedule and monitor background tasks

## Architecture

### Job Execution Flow

```
Job Definition → Scheduler → Queue → Worker → Execution → Result → Monitoring
      ↓            ↓          ↓        ↓          ↓          ↓          ↓
   Cron/Event  Inngest/    Redis   Isolated   Business   Success/   Metrics
               BullMQ      Queue   Worker     Logic      Failure    Alerts
```

### Core Components

1. **Job Scheduler**
   - Cron expression parsing
   - Event trigger registration
   - Schedule management
   - Timezone handling (Brazil)

2. **Job Queue**
   - Redis-backed queue (BullMQ/Inngest)
   - Priority levels (critical, high, normal, low)
   - Concurrency control
   - Rate limiting

3. **Job Workers**
   - Isolated execution environment
   - Resource limits (CPU, memory, time)
   - Error handling and retry
   - Progress reporting

4. **Job Monitoring**
   - Execution tracking
   - Performance metrics
   - Failure alerting
   - Historical analysis

## Contracts

### Job Definition

```typescript
interface JobDefinition {
  jobId: string
  name: string
  type: 'scheduled' | 'event_driven' | 'manual'
  schedule?: string // Cron expression
  trigger?: string // Event topic
  handler: JobHandler
  config: JobConfig
}

interface JobConfig {
  priority: 'critical' | 'high' | 'normal' | 'low'
  timeout: number // milliseconds
  maxRetries: number
  retryBackoff: 'exponential' | 'linear' | 'fixed'
  concurrency: number
}

interface JobHandler {
  execute(context: JobContext): Promise<JobResult>
}

interface JobContext {
  jobId: string
  executionId: string
  input: any
  entityId?: string
  userId?: string
}

interface JobResult {
  status: 'success' | 'failure' | 'partial'
  output?: any
  error?: Error
  metrics: {
    duration: number
    recordsProcessed: number
  }
}
```

### Job Types

```typescript
// Insight Freshness Jobs
interface InsightRefreshJob extends JobDefinition {
  schedule: '0 2 * * *' // Daily at 2 AM BRT
  handler: RefreshInsightsHandler
}

// Bank Account Sync Jobs
interface BankSyncJob extends JobDefinition {
  schedule: '*/15 * * * *' // Every 15 minutes
  handler: SyncBankAccountsHandler
}

// Data Cleanup Jobs
interface CleanupJob extends JobDefinition {
  schedule: '0 3 * * 0' // Weekly Sunday 3 AM
  handler: CleanupExpiredDataHandler
}

// Agent Automation Jobs
interface AgentJobDefinition extends JobDefinition {
  agentId: string
  workflow: WorkflowDefinition
  permissions: AgentPermissions
}
```

## Production Implementation

### Job Scheduler with Inngest

```typescript
import { Inngest } from 'inngest'

export const inngest = new Inngest({
  name: 'Orchestra.blue',
  id: process.env.INNGEST_APP_ID
})

// Daily Insight Refresh Job
export const refreshInsights = inngest.createFunction(
  {
    id: 'refresh-insights',
    name: 'Refresh Financial Insights',
  },
  { cron: '0 2 * * *' }, // 2 AM daily (BRT)
  async ({ event, step }) => {
    // Get all entities needing refresh
    const entities = await step.run('fetch-entities', async () => {
      return await db.entities.findMany({
        where: { insightsStale: true }
      })
    })

    // Process each entity
    for (const entity of entities) {
      await step.run(`refresh-entity-${entity.id}`, async () => {
        await intelligenceLayer.refreshInsights(entity.id)
      })
    }

    return { entitiesProcessed: entities.length }
  }
)

// Bank Account Sync Job
export const syncBankAccounts = inngest.createFunction(
  {
    id: 'sync-bank-accounts',
    name: 'Sync Bank Account Balances'
  },
  { cron: '*/15 * * * *' }, // Every 15 minutes
  async ({ event, step }) => {
    const connections = await step.run('fetch-connections', async () => {
      return await db.openFinanceConnections.findMany({
        where: { active: true }
      })
    })

    const results = await step.run('sync-accounts', async () => {
      return await Promise.allSettled(
        connections.map(conn => openFinanceConnector.syncAccountData(conn.id))
      )
    })

    const successful = results.filter(r => r.status === 'fulfilled').length
    const failed = results.filter(r => r.status === 'rejected').length

    return { successful, failed, total: connections.length }
  }
)

// Agent Background Job
export const agentScheduledTask = inngest.createFunction(
  {
    id: 'agent-scheduled-task',
    name: 'Agent Scheduled Automation'
  },
  { event: 'agent.schedule.triggered' },
  async ({ event, step }) => {
    const { agentId, workflowId, entityId } = event.data

    // Execute agent workflow with policy enforcement
    const result = await step.run('execute-workflow', async () => {
      return await agentRuntime.executeWorkflow(agentId, workflowId, {
        entityId,
        triggeredBy: 'schedule',
        timestamp: new Date()
      })
    })

    // Check if requires approval
    if (result.requiresApproval) {
      await step.run('create-approval-request', async () => {
        await nervousSystem.createChangeSetDraft({
          agentId,
          entityId,
          payload: result.actions,
          requiresApproval: true
        })
      })
    }

    return result
  }
)
```

### Job Monitoring

```typescript
export class JobMonitor {
  async trackJobExecution(jobId: string, execution: JobExecution): Promise<void> {
    // Record execution metrics
    await this.metrics.record({
      job: jobId,
      duration: execution.duration,
      status: execution.status,
      recordsProcessed: execution.recordsProcessed
    })

    // Alert on failure
    if (execution.status === 'failure') {
      await this.alerting.send({
        severity: 'high',
        message: `Job ${jobId} failed: ${execution.error}`,
        context: { executionId: execution.id }
      })
    }

    // Track SLA compliance
    const sla = this.getSLA(jobId)
    if (execution.duration > sla.maxDuration) {
      await this.alerting.send({
        severity: 'warning',
        message: `Job ${jobId} exceeded SLA (${execution.duration}ms > ${sla.maxDuration}ms)`
      })
    }
  }
}
```

## Testing Strategy

1. **Scheduled Job Test:** Verify cron execution
   - Given: Job scheduled for specific time
   - When: Time arrives
   - Then: Job executes within 1 minute of scheduled time
   - Command: `npm test -- background-jobs.schedule.spec.ts`

2. **Event-Driven Job Test:** Verify event triggers
   - Given: Job configured for event trigger
   - When: Event published
   - Then: Job executes within 5 seconds
   - Command: `npm test -- background-jobs.event.spec.ts`

3. **Retry Logic Test:** Verify failure recovery
   - Given: Job fails on first attempt
   - When: Retry logic activates
   - Then: Job succeeds within max retries
   - Command: `npm test -- background-jobs.retry.spec.ts`

4. **Performance Test:** Verify execution under load
   - Given: 100 concurrent jobs queued
   - When: Workers process queue
   - Then: All complete within SLA, no failures
   - Command: `npm test -- background-jobs.performance.spec.ts`

## Agent Integration

**Agent Capabilities:**
- Agents can schedule background tasks (automation workflows)
- Agents can monitor job status and results
- Agents can propose job configuration changes

**Agent Boundaries:**
- Cannot cancel system-critical jobs (data sync, cleanup)
- Cannot modify job priorities beyond their permissions
- Cannot access job results from other entities

**Approval Workflow:**
- Agent job scheduling: Requires user approval for first-time schedules
- Job modifications: Require Change-Set approval
- Job cancellation: Agent can cancel own jobs, system jobs require admin

## Related Modules

### **Dependencies:**
- **Core Infrastructure:** [[14_NERVOUS_SYSTEM]], [[15_SECURITY_FABRIC]]
- **Required Services:** [[53_INTELLIGENCE_LAYER]], Redis, Job scheduler

### **Data Flows:**
- **Receives Job Triggers From:** [[14_NERVOUS_SYSTEM]] (events), Cron scheduler
- **Sends Job Results To:** [[10_DATA_POOL]], [[53_INTELLIGENCE_LAYER]], requesting modules

### **Agent Coordination:**
- **Orchestrated By:** [[0.3_ORCHESTRATOR_MAESTRO]]
- **Coordinates With:** [[12_AGENT_LAYER]] (agent workflows), [[51_AGENT_RUNTIME]]

### **User Journey:**
- **Previous Step:** User configures automation or system reaches scheduled time
- **Next Step:** Background processing completes, results available

### **Implementation Order:**
- **Build After:** [[14_NERVOUS_SYSTEM]], [[10_DATA_POOL]]
- **Build Before:** Advanced automation features

## See Also
- **Architecture:** [[gov.PROJECT_ARCHITECTURE]]
- **Implementation:** [[gov.IMPLEMENTATION_ROADMAP]]

---
