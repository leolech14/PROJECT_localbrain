# LocalBrain OPERATIONS Universal Template

---
## ===== OPERATIONS IDENTITY =====
title: "[Operation Name] - [Domain Description]"
ops_id: "[unique_identifier]"
type: "operations"
category: "[build|test|deploy|monitor|maintain]"

## ===== OPERATIONS SCOPE =====
automation_level: "[fully_automated|semi_automated|manual]"
frequency: "[continuous|daily|weekly|on_demand]"
run_environment: "[local|ci_cd|production]"

## ===== SYSTEMATIC SCAFFOLDING =====
lifecycle: "prod"
state: "complete"
seat: "mvp"

## ===== AVAILABILITY AND ACCESS =====
phase_availability: "always"
priority: "critical"
access_required: "[developer|ci_cd|admin]"
tools_required: []  # Xcode, xcodebuild, etc.

## ===== PROMOTION GATES =====
promotion_gates:
  to_intermediate_i1:
    - "Manual process documented"
    - "Initial automation working"
    - "Success criteria defined"
  to_intermediate_i2:
    - "Full automation implemented"
    - "Error handling robust"
    - "Monitoring in place"
  to_intermediate_i3:
    - "Self-healing capabilities"
    - "Advanced metrics tracked"
    - "SLA compliance achieved"
  to_complete:
    - "Zero-touch operation"
    - "Continuous improvement active"
    - "Runbooks comprehensive"

## ===== OBSERVABILITY =====
observability:
  metrics:
    - "[operation].duration_ms"
    - "[operation].success_rate"
    - "[operation].error_count"
  alerts:
    - "[operation].failed"
    - "[operation].degraded"
  dashboards:
    - "[operation]_health"

## ===== SECURITY REQUIREMENTS =====
security:
  credentials_required: []
  access_control: "role_based"
  audit_logging: true
  secrets_management: "keychain"

## ===== TECHNICAL METADATA =====
dependencies: []  # Tools, services required
integrations: []  # CI/CD, monitoring systems
runbook_location: "ops/runbooks/[operation].md"
last_updated: "YYYY-MM-DD"
version: "1.0.0"
maintainer: "LocalBrain Operations Team"

## ===== AGENTIC INTEGRATION =====
agent_capabilities:
  can_read: true
  can_write: false
  can_propose_changes: true
  can_trigger: false  # Most ops require human approval

agent_boundaries:
  allowed_operations: ["read_metrics", "read_logs", "propose_improvement"]
  forbidden_operations: ["deploy", "modify_production", "access_secrets"]
  escalation_triggers: ["operation_failed", "sla_breach"]
---

# [Operation Name] - [Domain Description]

## Purpose

**What operational capability this provides and why it matters.**

**Must contain:**
- Problem being solved by this operation
- Impact of this operation (what breaks if it fails)
- Operational boundaries (what this does vs doesn't do)

**Must NOT contain:**
- Implementation details of modules (go in module specs)
- Governance standards (go in governance specs)

**Format:** 1-2 paragraphs + bullets for "out of scope"

---

## Primary Features

**Operational capabilities and guarantees.**

**Must contain:**
- Automation level (manual → semi → fully automated)
- Reliability guarantees (uptime, success rate)
- Performance targets (duration, throughput)
- Error handling and recovery

**Format:**
```markdown
- **Capability Name:** Description of operational capability
- **Automation Level:** Manual | Semi-automated | Fully automated
- **Reliability:** Success rate, error handling
- **Performance:** Duration targets, throughput
```

---

## Architecture

**Operational workflow and system interactions.**

**Must contain:**
- Process flow diagram
- System dependencies
- Error handling and recovery paths
- Rollback procedures

**Format:**
```markdown
[1 paragraph overview]

\`\`\`mermaid
graph TD
  A[Trigger] --> B[Pre-checks]
  B --> C[Execute]
  C --> D{Success?}
  D -->|Yes| E[Verify]
  D -->|No| F[Rollback]
  E --> G[Complete]
  F --> H[Alert]
\`\`\`

**Process Steps:**
1. **Trigger:** How operation starts (manual, scheduled, event-driven)
2. **Pre-checks:** Validation before execution
3. **Execute:** Core operation logic
4. **Verify:** Post-execution validation
5. **Rollback:** Recovery on failure

**System Dependencies:**
- Xcode: Version requirements
- macOS: Version requirements
- External services: APIs, tools
```

---

## Contracts

**Operational interfaces and data formats.**

**Format:**
```swift
// Operation Interface
protocol Operation {
    func execute() async throws -> OperationResult
    func validate() throws
    func rollback() async throws
}

struct OperationResult {
    let success: Bool
    let duration: TimeInterval
    let artifacts: [URL]
    let logs: [String]
}

// Configuration
struct OperationConfig: Codable {
    let environment: Environment
    let timeout: TimeInterval
    let retryPolicy: RetryPolicy

    enum Environment: String, Codable {
        case development
        case staging
        case production
    }

    struct RetryPolicy: Codable {
        let maxAttempts: Int
        let backoff: TimeInterval
    }
}
```

**Shell Scripts:**
```bash
#!/bin/bash
# operation_name.sh
# Purpose: [Description]
# Usage: ./operation_name.sh [args]

set -euo pipefail  # Exit on error, undefined vars, pipe failures

# Configuration
ENVIRONMENT="${1:-development}"
TIMEOUT="${2:-300}"

# Pre-checks
function validate() {
    # Validation logic
}

# Execute
function execute() {
    # Main operation
}

# Verify
function verify() {
    # Post-execution checks
}

# Rollback
function rollback() {
    # Recovery logic
}

# Main
validate
execute
verify || rollback
```

---

## Sub-Components & Behavior

**Operational subsystems and their behaviors.**

**Format:**
```markdown
### Pre-Flight Checks

- **Purpose:** Validate environment before operation
- **Behavior:** Check dependencies, permissions, resources
- **Failure Mode:** Block operation, alert operator
- **Recovery:** None (fix issues manually)

### Execution Engine

- **Purpose:** Perform core operation
- **Behavior:** Execute steps with logging and monitoring
- **Failure Mode:** Retry with exponential backoff
- **Recovery:** Rollback on max retries exceeded

### Post-Execution Verification

- **Purpose:** Validate operation succeeded
- **Behavior:** Run smoke tests, check health endpoints
- **Failure Mode:** Trigger rollback if verification fails
- **Recovery:** Automatic rollback + alert

### Rollback Handler

- **Purpose:** Restore previous state on failure
- **Behavior:** Undo changes, restore from backup
- **Failure Mode:** Manual intervention required
- **Recovery:** Escalate to on-call engineer
```

---

## State Progression & Promotion Gates

**Operational maturity levels.**

**Format:**
```markdown
### Current State: complete

### Minimal State
**Definition:** Manual operation with documentation
**Requirements:**
- [ ] Runbook documented
- [ ] Manual execution tested
- [ ] Success criteria defined

### Intermediate I1 State
**Definition:** Semi-automated with scripts
**Requirements:**
- [ ] Automation scripts written
- [ ] Error handling implemented
- [ ] Logging and monitoring added

### Intermediate I2 State
**Definition:** Fully automated in CI/CD
**Requirements:**
- [ ] CI/CD integration complete
- [ ] Zero-touch execution
- [ ] Automatic rollback working

### Intermediate I3 State
**Definition:** Self-healing and optimized
**Requirements:**
- [ ] Self-healing capabilities
- [ ] Performance optimized
- [ ] SLA compliance achieved

### Complete State
**Definition:** Battle-tested production operation
**Requirements:**
- [ ] Zero production failures
- [ ] Continuous improvement active
- [ ] Comprehensive runbooks

## Promotion Gates
- **Minimal→I1:** Documented + tested + success criteria
- **I1→I2:** Automated + error handling + monitoring
- **I2→I3:** CI/CD + zero-touch + rollback
- **I3→Complete:** Self-healing + optimized + SLA met
```

---

## Production Implementation

**How to execute this operation in production.**

**Format:**
```markdown
### Production-Ready Implementation

**1. Xcode Build Operation:**
\`\`\`bash
#!/bin/bash
# build_localbrain.sh

set -euo pipefail

# Configuration
SCHEME="LocalBrain"
CONFIGURATION="Release"
DERIVED_DATA="./build/DerivedData"

# Clean
xcodebuild clean \
  -scheme "$SCHEME" \
  -configuration "$CONFIGURATION"

# Build
xcodebuild build \
  -scheme "$SCHEME" \
  -configuration "$CONFIGURATION" \
  -derivedDataPath "$DERIVED_DATA" \
  -quiet

# Archive
xcodebuild archive \
  -scheme "$SCHEME" \
  -configuration "$CONFIGURATION" \
  -archivePath "./build/LocalBrain.xcarchive"

echo "✅ Build complete: ./build/LocalBrain.xcarchive"
\`\`\`

**2. Test Operation:**
\`\`\`bash
#!/bin/bash
# test_localbrain.sh

set -euo pipefail

# Unit Tests
xcodebuild test \
  -scheme "LocalBrain" \
  -destination "platform=macOS" \
  -resultBundlePath "./test-results/unit"

# UI Tests
xcodebuild test \
  -scheme "LocalBrainUITests" \
  -destination "platform=macOS" \
  -resultBundlePath "./test-results/ui"

# Spec Tests
export LB_SPEC_COVERAGE_DIR="./spec-coverage"
xcodebuild test \
  -scheme "LocalBrainSpecTests" \
  -destination "platform=macOS"

echo "✅ All tests passed"
\`\`\`

**3. Deploy Operation:**
\`\`\`bash
#!/bin/bash
# deploy_localbrain.sh

set -euo pipefail

# Export for distribution
xcodebuild -exportArchive \
  -archivePath "./build/LocalBrain.xcarchive" \
  -exportPath "./build/export" \
  -exportOptionsPlist "./ExportOptions.plist"

# Sign and notarize
codesign --force --sign "Developer ID Application: ..." \
  "./build/export/LocalBrain.app"

xcrun notarytool submit \
  "./build/export/LocalBrain.zip" \
  --keychain-profile "notary-profile" \
  --wait

# Staple ticket
xcrun stapler staple "./build/export/LocalBrain.app"

echo "✅ Deployment package ready"
\`\`\`

**Environment Variables:**
\`\`\`bash
# Required for build
export XCODE_VERSION="15.0"
export MACOS_VERSION="14.0"

# Required for deploy
export DEVELOPER_ID="Developer ID Application: ..."
export NOTARY_PROFILE="notary-profile"
\`\`\`

**CI/CD Integration (GitHub Actions):**
\`\`\`yaml
name: Build and Test

on: [push, pull_request]

jobs:
  build:
    runs-on: macos-14
    steps:
      - uses: actions/checkout@v4
      - name: Build
        run: ./scripts/build_localbrain.sh
      - name: Test
        run: ./scripts/test_localbrain.sh
      - name: Upload Artifacts
        uses: actions/upload-artifact@v3
        with:
          name: LocalBrain.xcarchive
          path: ./build/LocalBrain.xcarchive
\`\`\`
```

---

## Security & Compliance

**Operational security requirements.**

**Format:**
```markdown
**Security Controls:**
- Code signing: Required for all builds
- Notarization: Required for distribution
- Secrets: Stored in Keychain, never in scripts
- Access control: Role-based (developer/admin)

**Audit Requirements:**
- All operations logged
- Deployments tracked in version control
- Rollbacks documented with reason

**Compliance:**
- macOS Gatekeeper: Full compliance
- App Sandbox: Enabled for distribution
- Hardened Runtime: Enabled
```

---

## Testing Strategy

**How to validate operations work correctly.**

**Format:**
```markdown
**Test Scenarios:**

1. **Scenario: Successful Build**
   - Given: Clean repository state
   - When: Build script executed
   - Then: Build succeeds, archive created
   - Command: `./scripts/build_localbrain.sh`

2. **Scenario: Build Failure**
   - Given: Code with compilation errors
   - When: Build script executed
   - Then: Build fails with clear error message
   - Command: `./scripts/build_localbrain.sh` (expect failure)

3. **Scenario: Rollback**
   - Given: Failed deployment
   - When: Rollback script executed
   - Then: Previous version restored
   - Command: `./scripts/rollback_localbrain.sh`

**Dry Run Testing:**
\`\`\`bash
# Test operation without side effects
DRY_RUN=true ./scripts/deploy_localbrain.sh
\`\`\`
```

---

## Success Criteria, Performance & Observability

**Operational quality metrics.**

**Format:**
```markdown
| Metric | Target | Window | Source |
|--------|--------|--------|--------|
| Build Time | <5 min | Per build | CI/CD logs |
| Test Time | <10 min | Per run | CI/CD logs |
| Deploy Time | <15 min | Per deploy | CI/CD logs |
| Success Rate | >99% | Weekly | CI/CD metrics |
| Rollback Time | <5 min | Per rollback | Operations logs |

**SLOs:**
- Build success rate >99%
- Test success rate >95% (flaky tests allowed)
- Deploy success rate >99%
- Mean time to rollback <5 minutes

**Observability:**
- CI/CD: GitHub Actions logs
- Metrics: Duration, success rate, error count
- Alerts: Build failures, test failures, deploy failures
- Dashboard: Operations health dashboard
```

---

## Agent Integration

**How agents interact with operations.**

**Format:**
```markdown
**Agent Capabilities:**
- Agents can read operation logs
- Agents can read metrics and status
- Agents can propose operational improvements

**Agent Boundaries:**
- Agents CANNOT trigger builds
- Agents CANNOT deploy to production
- Agents CANNOT access secrets
- Agents CANNOT modify CI/CD configuration

**Approval Workflow:**
- Read operations: No approval needed
- Trigger development build: Developer approval
- Trigger production deploy: Multi-signature approval
- Modify CI/CD: Architecture team approval
```

---

## Integrations & References

**Related operations and dependencies.**

**Format:**
```markdown
### Dependencies:
- **Tools:** Xcode 15+, xcodebuild, codesign, notarytool
- **Services:** GitHub Actions, Apple Notary Service
- **Credentials:** Developer ID certificate, notarization profile

### Related Operations:
- **Build:** [[ops.BUILD]]
- **Test:** [[ops.TEST]]
- **Deploy:** [[ops.DEPLOY]]
- **Monitor:** [[ops.MONITORING]]

### Runbooks:
- **Build Failures:** ops/runbooks/build-failures.md
- **Test Failures:** ops/runbooks/test-failures.md
- **Deploy Issues:** ops/runbooks/deploy-issues.md
- **Rollback:** ops/runbooks/rollback.md

### Implementation Order:
- **Build After:** [[gov.BUILD_STANDARDS]]
- **Build Before:** [[ops.DEPLOY]]

### See Also:
- **CI/CD:** [[gov.CICD_STANDARDS]]
- **Security:** [[cfg.CODESIGN_CONFIG]]
- **Monitoring:** [[ops.TELEMETRY]]
```

---

# 📋 OPERATIONS UNIVERSAL TEMPLATE

**This template defines the UNIVERSAL TRUTH for all OPERATIONS specification files in LocalBrain.**

**Use this as:**
- ✅ Template for creating new operational procedures
- ✅ Runbook for executing operations
- ✅ Standard for automation and CI/CD
- ✅ Normative guide for all 5-ops/* files

**Total Standard Sections:** 12
**Required:** Purpose, Workflow, Scripts, Rollback, Monitoring
**macOS-Specific:** Xcode build, codesign, notarization, App Store distribution

---

**This is the CANONICAL OPERATIONS SPECIFICATION TEMPLATE for LocalBrain.** 📋✅
