---
title: "Design Quality Gates - APCA Contrast Validation"
type: "operations"
category: "quality_assurance"
last_updated: "2025-10-01"
version: "1.0.0"
---

# ops.DESIGN_QUALITY_GATES - APCA Contrast CI Validation

## Purpose

Design Quality Gates specification defines automated validation of OKLCH color tokens for APCA contrast compliance (>83 Lc), preventing accessibility regressions in CI/CD pipeline.

## APCA Contrast Requirements

### Minimum Contrast Ratios (APCA)

```yaml
apca_requirements:
  body_text:
    minimum_lc: 60
    target_lc: 75
    context: "Regular body text (16px+)"

  small_text:
    minimum_lc: 75
    target_lc: 90
    context: "Small text (<16px)"

  ui_components:
    minimum_lc: 60
    target_lc: 83
    context: "Buttons, inputs, interactive elements"

  decorative:
    minimum_lc: 30
    target_lc: 45
    context: "Non-critical visual elements"
```

## CI Gate Implementation

### Pre-Commit Hook

```bash
#!/bin/bash
# .git/hooks/pre-commit

# Check if design tokens changed
if git diff --cached --name-only | grep -q "tokens.css\|oklch"; then
  echo "🎨 Design tokens changed - running APCA validation..."

  npm run validate:apca

  if [ $? -ne 0 ]; then
    echo "❌ APCA validation failed!"
    echo "Some color combinations don't meet contrast requirements."
    echo "Run 'npm run validate:apca --verbose' for details."
    exit 1
  fi

  echo "✅ APCA validation passed!"
fi
```

### CI Workflow

```yaml
# .github/workflows/design-quality.yml
name: Design Quality Gates

on:
  pull_request:
    paths:
      - 'styles/tokens.css'
      - 'tailwind.config.ts'
      - 'components/**/*.tsx'

jobs:
  apca-validation:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install APCA Calculator
        run: npm install apca-w3

      - name: Run APCA Validation
        run: npm run validate:apca

      - name: Generate Preview
        run: npm run tokens:preview

      - name: Upload Preview
        uses: actions/upload-artifact@v3
        with:
          name: token-preview
          path: preview.html

      - name: Comment on PR
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs')
            const results = JSON.parse(fs.readFileSync('apca-results.json'))

            const failures = results.filter(r => r.passed === false)

            if (failures.length > 0) {
              github.rest.issues.createComment({
                issue_number: context.issue.number,
                owner: context.repo.owner,
                repo: context.repo.repo,
                body: `❌ APCA validation failed for ${failures.length} color pairs:\n\n${failures.map(f => `- ${f.combo}: Lc ${f.lc} (min: ${f.min})`).join('\n')}`
              })
            }
```

## APCA Validation Script

```typescript
// scripts/validate-apca.ts
import { APCAcontrast } from 'apca-w3'
import { oklchToRgb } from './color-utils'

interface TokenPair {
  name: string
  foreground: string // OKLCH
  background: string // OKLCH
  minimumLc: number
  context: string
}

const tokenPairs: TokenPair[] = [
  {
    name: 'body-text-on-surface',
    foreground: 'oklch(20% 0.02 240)', // Dark text
    background: 'oklch(98% 0.01 240)', // Light surface
    minimumLc: 75,
    context: 'Body text'
  },
  {
    name: 'button-text-on-primary',
    foreground: 'oklch(98% 0.01 240)', // Light text
    background: 'oklch(45% 0.15 240)', // Primary button
    minimumLc: 83,
    context: 'Button text'
  },
  // ... all token combinations
]

function validateAPCA(): boolean {
  let allPassed = true
  const results = []

  for (const pair of tokenPairs) {
    const fgRgb = oklchToRgb(pair.foreground)
    const bgRgb = oklchToRgb(pair.background)

    const lc = APCAcontrast(fgRgb, bgRgb)

    const passed = Math.abs(lc) >= pair.minimumLc

    results.push({
      combo: pair.name,
      lc: Math.abs(lc),
      min: pair.minimumLc,
      passed,
      context: pair.context
    })

    if (!passed) {
      console.error(`❌ ${pair.name}: Lc ${lc.toFixed(1)} < ${pair.minimumLc}`)
      allPassed = false
    } else {
      console.log(`✅ ${pair.name}: Lc ${lc.toFixed(1)} >= ${pair.minimumLc}`)
    }
  }

  // Save results
  fs.writeFileSync('apca-results.json', JSON.stringify(results, null, 2))

  return allPassed
}

if (!validateAPCA()) {
  process.exit(1)
}
```

## Token Preview Generator

```typescript
// Generate visual preview of all tokens
export function generateTokenPreview(): string {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>OKLCH Token Preview</title>
  <style>
    ${generateTokenCSS()}
  </style>
</head>
<body>
  <h1>OKLCH Design Tokens - APCA Validated</h1>

  ${tokenPairs.map(pair => `
    <div class="token-preview">
      <div class="preview-box" style="
        color: ${pair.foreground};
        background: ${pair.background};
      ">
        ${pair.context}: Lc ${calculateLc(pair)}
      </div>
      <div class="token-info">
        <code>${pair.name}</code>
        <span class="${pair.passed ? 'pass' : 'fail'}">
          ${pair.passed ? '✅ PASS' : '❌ FAIL'}
        </span>
      </div>
    </div>
  `).join('\n')}
</body>
</html>
  `

  fs.writeFileSync('preview.html', html)
  return html
}
```

## Incident Runbooks

### DQ Incident: Categorization Accuracy Drop

```markdown
# RUNBOOK: Data Quality - Categorization Accuracy <90%

## Symptoms
- Categorization confidence scores declining
- More transactions requiring manual review
- User complaints about incorrect categories

## Investigation

1. Check ML model version and deployment time
2. Review recent merchant patterns (new merchants?)
3. Check training data freshness
4. Verify Intelligence Layer health

## Resolution

Short-term:
- Increase manual review threshold (confidence >0.95)
- Add new merchant patterns manually
- Flag affected transactions for correction

Long-term:
- Retrain model with recent data (1-2 weeks)
- Improve feature engineering
- Add merchant database updates

## Prevention

- Scheduled model retraining (monthly)
- Merchant pattern monitoring
- User feedback loop for corrections
```

### Webhook Lag Runbook

```markdown
# RUNBOOK: Webhook Lag >1s

## Symptoms
- Dashboard not updating in real-time
- Users reporting delayed transaction visibility
- Webhook latency metrics elevated

## Investigation

1. Check Redis Pub/Sub health
2. Check WebSocket server load
3. Review network latency (Redis ↔ App)
4. Check subscriber count (connection leak?)

## Resolution

Immediate:
- Scale WebSocket servers (add instances)
- Restart Redis if degraded
- Clear stuck consumers

Investigation:
- Review consumer code (performance regression?)
- Check Redis memory usage
- Verify network path (VPC, security groups)

Prevention:
- Implement consumer auto-scaling
- Add Redis monitoring alerts
- Optimize message payload size
```

## Success Criteria

| Metric | Target | Source |
|--------|--------|--------|
| Dashboard Availability | 100% | Grafana uptime |
| Alert Precision | >80% | False positive rate |
| Runbook Coverage | 100% P1/P2 | Documentation |
| MTTR with Runbooks | <30min | Incident tracker |
| APCA Validation | 100% pass | CI logs |

---
