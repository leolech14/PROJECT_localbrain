# LocalBrain GOVERNANCE Universal Template

---
## ===== GOVERNANCE IDENTITY =====
title: "[Governance Topic] - [Domain Description]"
gov_id: "[unique_identifier]"
type: "governance"
category: "architecture"

## ===== GOVERNANCE SCOPE =====
scope: "[project_wide|module_specific|team_practice]"
enforcement: "[mandatory|recommended|advisory]"
audience: "[developers|architects|all]"

## ===== SYSTEMATIC SCAFFOLDING =====
lifecycle: "prod"
state: "complete"
seat: "mvp"

## ===== AVAILABILITY AND ACCESS =====
phase_availability: "always"
priority: "critical"
decision_authority: "[tech_lead|team|consensus]"

## ===== PROMOTION GATES =====
promotion_gates:
  to_intermediate_i1:
    - "Initial standards documented"
    - "Team consensus achieved"
    - "Examples provided"
  to_intermediate_i2:
    - "Enforcement mechanisms in place"
    - "Compliance measured"
    - "Exceptions process defined"
  to_intermediate_i3:
    - "Automated checks implemented"
    - "Team training complete"
    - "Metrics tracked"
  to_complete:
    - "100% compliance achieved"
    - "Continuous monitoring active"
    - "Regular review cadence established"

## ===== OBSERVABILITY =====
observability:
  compliance_metrics:
    - "governance.compliance_rate"
    - "governance.violations.count"
  review_cadence: "quarterly"
  spec_validation:
    - "Automated linting"
    - "Code review checklists"

## ===== SECURITY REQUIREMENTS =====
security:
  security_relevant: true
  audit_required: true
  exception_approval_required: true

## ===== TECHNICAL METADATA =====
related_specs: []
supersedes: []  # Previous governance docs this replaces
last_updated: "YYYY-MM-DD"
version: "1.0.0"
maintainer: "LocalBrain Architecture Team"

## ===== AGENTIC INTEGRATION =====
agent_capabilities:
  can_read: true
  can_write: false
  can_propose_changes: true
  requires_approval: true

agent_boundaries:
  allowed_operations: ["read_governance", "propose_change"]
  forbidden_operations: ["modify_standards", "bypass_governance"]
  escalation_triggers: ["compliance_violation", "standard_conflict"]
---

# [Governance Topic] - [Domain Description]

## Purpose

**Why this governance standard exists and what it governs.**

**Must contain:**
- Problem being solved by this standard
- Scope of governance (what's covered vs not covered)
- Authority and decision-making process

**Must NOT contain:**
- Implementation details (those go in module specs)
- Temporary workarounds or exceptions

**Format:** 1-2 paragraphs + bullets for "scope boundaries"

---

## Primary Standards

**Core standards and principles.**

**Must contain:**
- Mandatory requirements (MUST)
- Recommended practices (SHOULD)
- Advisory guidance (MAY)
- Explicit non-requirements (MUST NOT)

**Format:**
```markdown
### Mandatory Requirements (MUST)
- **Standard Name:** Description and rationale
- **Standard Name:** Description and rationale

### Recommended Practices (SHOULD)
- **Practice Name:** Description and benefit
- **Practice Name:** Description and benefit

### Advisory Guidance (MAY)
- **Guidance Name:** Optional suggestion
- **Guidance Name:** Optional suggestion

### Prohibited Practices (MUST NOT)
- **Anti-Pattern:** Why this is forbidden
- **Anti-Pattern:** Why this is forbidden
```

---

## Architecture

**Structural view of how this governance fits into the system.**

**Must contain:**
- Architectural principles
- Design patterns (encouraged vs discouraged)
- System boundaries and interfaces
- Decision trees for common scenarios

**Format:**
```markdown
[1 paragraph overview]

\`\`\`mermaid
graph TD
  A[Governance Principle] --> B[Architecture Decision]
  B --> C[Implementation Pattern]
  C --> D[Code Practice]
\`\`\`

**Architectural Principles:**
1. **Principle Name:** Description and rationale
2. **Principle Name:** Description and rationale

**Design Patterns:**
- ✅ Encouraged: [List of patterns with rationale]
- ⚠️ Conditional: [List of patterns with conditions]
- ❌ Discouraged: [List of anti-patterns with reasons]

**Decision Framework:**
When choosing between options, prioritize:
1. Security
2. Correctness
3. Performance
4. Developer experience
```

---

## Contracts

**Formal governance contracts and interfaces.**

**Format:**
```swift
// Architectural Contract
protocol GovernedComponent {
    // Required interface
    func conform(to standard: Standard) -> Bool
    func validate() throws
}

// Standard Definition
struct Standard {
    let id: String
    let requirement: Requirement
    let enforcement: EnforcementLevel

    enum Requirement {
        case mandatory
        case recommended
        case advisory
    }

    enum EnforcementLevel {
        case automated  // CI/CD blocks
        case reviewed   // Code review checks
        case advisory   // Team awareness
    }
}

// Example: Swift Actor Standard
protocol ActorGovernance {
    // All long-running operations must be async
    // All state mutations must be isolated
    // All public APIs must be Sendable-safe
}
```

**Compliance Schema:**
```yaml
governance_standard:
  id: "GOV-SWIFT-001"
  title: "Actor Isolation Standard"
  enforcement: "mandatory"

  requirements:
    - id: "REQ-001"
      text: "All shared mutable state must use actor isolation"
      check: "swift_concurrency_lint"

    - id: "REQ-002"
      text: "All async operations must handle cancellation"
      check: "manual_review"
```

---

## Sub-Components & Behavior

**Breakdown of governance areas and their behaviors.**

**Format:**
```markdown
### Governance Area: [Name]

- **Purpose:** What aspect of development this governs
- **Scope:** Files, modules, or patterns affected
- **Enforcement:** How compliance is verified
- **Exceptions:** When and how exceptions are granted

**Example:**

### Governance Area: Swift Concurrency

- **Purpose:** Ensure thread-safe concurrent code
- **Scope:** All actor definitions, async functions
- **Enforcement:**
  - Automated: Swift compiler warnings as errors
  - Manual: Code review checklist
- **Exceptions:** Legacy code migration (documented in JIRA)
```

---

## State Progression & Promotion Gates

**Governance maturity levels.**

**Format:**
```markdown
### Current State: complete

### Minimal State
**Definition:** Standard documented and communicated
**Requirements:**
- [ ] Governance document written
- [ ] Team review complete
- [ ] Examples provided

### Intermediate I1 State
**Definition:** Standard adopted with manual enforcement
**Requirements:**
- [ ] Team trained on standard
- [ ] Code review checklist includes standard
- [ ] Compliance measured manually

### Intermediate I2 State
**Definition:** Standard enforced with automated checks
**Requirements:**
- [ ] Automated linting rules implemented
- [ ] CI/CD blocks non-compliant code
- [ ] Metrics dashboard showing compliance

### Intermediate I3 State
**Definition:** Standard ingrained in team culture
**Requirements:**
- [ ] >95% compliance rate
- [ ] Zero critical violations
- [ ] Regular review and updates

### Complete State
**Definition:** Standard is "just how we do things"
**Requirements:**
- [ ] 100% compliance in new code
- [ ] Legacy code migrated or documented
- [ ] Standard referenced in onboarding

## Promotion Gates
- **Minimal→I1:** Documented + reviewed + examples
- **I1→I2:** Trained + manual checks + metrics
- **I2→I3:** Automated + CI/CD + dashboard
- **I3→Complete:** Cultural + compliant + maintained
```

---

## Production Implementation

**How to implement and enforce this governance.**

**Format:**
```markdown
### Governance Enforcement Implementation

**1. Documentation:**
\`\`\`markdown
# Standard: [Name]
- **ID:** GOV-XXX-001
- **Enforcement:** Mandatory
- **Check:** Automated + Manual

## Compliance Checklist:
- [ ] Requirement 1
- [ ] Requirement 2
- [ ] Requirement 3
\`\`\`

**2. Automated Checks:**
\`\`\`yaml
# .swiftlint.yml
rules:
  - governance_rule_1: error
  - governance_rule_2: warning

# Custom rule example
custom_rules:
  actor_isolation:
    name: "Actor Isolation Required"
    regex: "^\\s*var\\s+\\w+\\s*:\\s*(?!@)\\w+"
    match_kinds: source.lang.swift
    message: "Shared mutable state must use actor isolation"
    severity: error
\`\`\`

**3. Code Review Checklist:**
\`\`\`markdown
## Governance Review Checklist
- [ ] Swift concurrency standards met
- [ ] Security standards followed
- [ ] Performance standards achieved
- [ ] Documentation standards complete
\`\`\`

**4. Metrics Collection:**
\`\`\`swift
// Governance Compliance Tracker
struct ComplianceMetrics {
    let standardId: String
    let totalChecks: Int
    let passedChecks: Int
    var complianceRate: Double {
        Double(passedChecks) / Double(totalChecks)
    }
}
\`\`\`
```

---

## Security & Compliance

**Security implications of governance standards.**

**Format:**
```markdown
**Security Standards:**
- All governance decisions consider security first
- Security exceptions require security team approval
- Security violations block deployment

**Compliance Requirements:**
- Governance standards must be auditable
- All exceptions documented with rationale
- Regular compliance audits required

**Exception Process:**
1. Document exception request with rationale
2. Security team review (if security-relevant)
3. Architecture team approval
4. Time-boxed exception (review in 3 months)
5. Track in exception register
```

---

## Testing Strategy

**How to validate governance compliance.**

**Format:**
```markdown
**Compliance Testing:**

1. **Automated Linting:**
   - Tool: SwiftLint, custom rules
   - Frequency: Every commit (CI/CD)
   - Action: Block merge if violations

2. **Code Review:**
   - Checklist: Governance review template
   - Frequency: Every PR
   - Action: Require approval from architect

3. **Periodic Audit:**
   - Scope: Full codebase scan
   - Frequency: Quarterly
   - Action: Generate compliance report

4. **Metrics Tracking:**
   - Dashboard: Governance compliance metrics
   - Frequency: Real-time
   - Action: Alert on regression

**Test Scenarios:**

1. **Scenario: Standard Compliance**
   - Given: New code submitted
   - When: CI/CD runs
   - Then: All governance checks pass
   - Tool: SwiftLint + custom scripts

2. **Scenario: Exception Handling**
   - Given: Exception request filed
   - When: Review process triggered
   - Then: Exception approved or denied with rationale
   - Tool: JIRA + documentation
```

---

## Success Criteria, Performance & Observability

**Governance quality metrics.**

**Format:**
```markdown
| Metric | Target | Window | Source |
|--------|--------|--------|--------|
| Compliance Rate | >95% | Continuous | CI/CD |
| Critical Violations | 0 | Per release | Audit scan |
| Exception Count | <5 | Per quarter | Exception register |
| Review Time | <1 day | Per PR | GitHub metrics |

**SLOs:**
- >95% compliance rate for all mandatory standards
- Zero critical violations in production releases
- <5 active exceptions at any time
- <1 day governance review time

**Observability:**
- CI/CD: Automated compliance checks
- Dashboard: Real-time compliance metrics
- Reports: Quarterly governance audit
- Trends: Compliance rate over time
```

---

## Agent Integration

**How agents interact with governance standards.**

**Format:**
```markdown
**Agent Capabilities:**
- Agents can read governance standards
- Agents can check compliance programmatically
- Agents can propose standard updates

**Agent Boundaries:**
- Agents CANNOT modify governance standards
- Agents CANNOT grant exceptions
- Agents CANNOT bypass compliance checks

**Approval Workflow:**
- Standard updates: Architecture team approval required
- Exception requests: Security + architecture approval
- Enforcement changes: Team consensus required

**Agent Responsibilities:**
- Auto-check compliance before proposing changes
- Reference governance standards in proposals
- Escalate compliance conflicts to humans
```

---

## Integrations & References

**Related standards and dependencies.**

**Format:**
```markdown
### Related Governance:
- **Architecture:** [[gov.SWIFT_ARCHITECTURE]]
- **Security:** [[gov.SECURITY_STANDARDS]]
- **Testing:** [[gov.TESTING_STANDARDS]]

### Affected Specs:
- **All Modules:** Must follow [[gov.ACTOR_STANDARDS]]
- **All UIs:** Must follow [[gov.SWIFTUI_STANDARDS]]

### External References:
- Swift Evolution Proposals
- Apple Human Interface Guidelines
- OWASP Security Standards

### Implementation Order:
- **Build After:** None (foundation)
- **Build Before:** All implementation work

### See Also:
- **Standards:** Full list in [[gov.STANDARDS_INDEX]]
- **Exceptions:** Current exceptions in [[gov.EXCEPTIONS_REGISTER]]
- **Metrics:** Compliance dashboard in [[ops.GOVERNANCE_METRICS]]
```

---

# 📋 GOVERNANCE UNIVERSAL TEMPLATE

**This template defines the UNIVERSAL TRUTH for all GOVERNANCE specification files in LocalBrain.**

**Use this as:**
- ✅ Template for creating new governance standards
- ✅ Checklist for architectural decisions
- ✅ Standard for team practices and enforcement
- ✅ Normative guide for all 4-gov/* files

**Total Standard Sections:** 12
**Required:** Purpose, Standards, Enforcement, Compliance, Metrics
**Swift-Specific:** Actor patterns, concurrency rules, SwiftUI standards

---

**This is the CANONICAL GOVERNANCE SPECIFICATION TEMPLATE for LocalBrain.** 📋✅
