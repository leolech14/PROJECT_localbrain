---
title: "Monitoring Setup - Sentry & Error Boundaries"
type: "operations"
category: "monitoring"
last_updated: "2025-10-01"
version: "1.0.0"
---

# ops.MONITORING_SETUP - Sentry & Error Boundaries

## Purpose

Monitoring Setup specification defines how to configure Sentry for error tracking, crash reporting, and performance monitoring with React error boundaries for graceful failure handling.

## Configuration Requirements

### Sentry Integration

**DSN Configuration:**
```typescript
// sentry.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,

  // Release tracking
  release: process.env.NEXT_PUBLIC_APP_VERSION,

  // Performance monitoring
  tracesSampleRate: 1.0, // 100% in dev, 0.1 (10%) in prod

  // Error filtering
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'Non-Error promise rejection captured'
  ],

  // User context
  beforeSend(event, hint) {
    // Strip PII before sending to Sentry
    if (event.user) {
      delete event.user.email
      delete event.user.ip_address
    }
    return event
  }
})
```

**Environment Variables:**
```bash
# .env.local
NEXT_PUBLIC_SENTRY_DSN=https://[key]@[org].ingest.sentry.io/[project]
SENTRY_AUTH_TOKEN=[auth_token] # For source maps upload
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Error Boundaries

**Global Error Boundary:**
```typescript
// components/ErrorBoundary.tsx
import { ErrorBoundary as SentryErrorBoundary } from '@sentry/nextjs'

export function GlobalErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <SentryErrorBoundary
      fallback={({ error, resetError }) => (
        <div className="error-container">
          <h1>Algo deu errado</h1>
          <p>Desculpe, encontramos um erro inesperado.</p>
          <details>
            <summary>Detalhes técnicos</summary>
            <pre>{error.message}</pre>
          </details>
          <button onClick={resetError}>Tentar novamente</button>
        </div>
      )}
      onError={(error, errorInfo) => {
        // Additional logging
        console.error('Error boundary caught:', error, errorInfo)
      }}
    >
      {children}
    </SentryErrorBoundary>
  )
}
```

**Module-Level Error Boundaries:**
```typescript
// Wrap each major module
export function AgentConsole() {
  return (
    <ErrorBoundary
      fallback={<AgentConsoleError />}
      onError={(error) => {
        Sentry.captureException(error, {
          tags: { module: 'agent_console' }
        })
      }}
    >
      <AgentConsoleContent />
    </ErrorBoundary>
  )
}
```

## Performance Monitoring

### Transaction Tracking

```typescript
// Track critical operations
import { startTransaction } from '@sentry/nextjs'

async function processTransaction(data: TransactionData) {
  const transaction = Sentry.startTransaction({
    name: 'process_transaction',
    op: 'data_processing'
  })

  try {
    const span = transaction.startChild({ op: 'normalize' })
    const normalized = await normalizeTransaction(data)
    span.finish()

    const span2 = transaction.startChild({ op: 'insert' })
    await dataPool.insert(normalized)
    span2.finish()

    transaction.setStatus('ok')
  } catch (error) {
    transaction.setStatus('error')
    throw error
  } finally {
    transaction.finish()
  }
}
```

### Custom Metrics

```typescript
// Track custom business metrics
Sentry.metrics.increment('transaction.ingested', 1, {
  tags: {
    source: 'open_finance',
    entity_type: 'personal'
  }
})

Sentry.metrics.distribution('agent.execution_time_ms', executionTime, {
  tags: { agent_type: 'budget_agent' }
})
```

## Deployment Integration

### CI/CD Configuration

```yaml
# .github/workflows/deploy.yml
- name: Create Sentry Release
  run: |
    sentry-cli releases new ${{ github.sha }}
    sentry-cli releases set-commits ${{ github.sha }} --auto
    sentry-cli releases finalize ${{ github.sha }}

- name: Upload Source Maps
  run: |
    sentry-cli sourcemaps upload --release ${{ github.sha }} .next/
```

## Success Criteria

| Metric | Target | Source |
|--------|--------|--------|
| Error Capture Rate | 100% | Sentry dashboard |
| Performance Sample Rate | 10% in prod | Sentry config |
| Error Boundary Coverage | 100% of modules | Code review |
| Release Tracking | All deploys | Sentry releases |

## Testing Strategy

1. **Error Capture Test:** Trigger error, verify Sentry receives
2. **Boundary Test:** Crash component, verify UI remains functional
3. **Performance Test:** Verify transactions tracked
4. **Release Test:** Deploy, verify release appears in Sentry

---
