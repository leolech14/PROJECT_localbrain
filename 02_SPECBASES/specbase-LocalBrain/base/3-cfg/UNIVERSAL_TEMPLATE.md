# LocalBrain CONFIGURATION Universal Template

---
## ===== CONFIGURATION IDENTITY =====
title: "[Policy/Config Name] - [Domain Description]"
config_id: "[unique_identifier]"
type: "configuration"
category: "policy"

## ===== CONFIGURATION IMPLEMENTATION =====
config_file: "[Info.plist|config.json|providers.yaml]"
config_location: "[LocalBrain/Resources/|~/.localbrain/]"
runtime_access: "[ProcessInfo|UserDefaults|Keychain|File]"

## ===== SYSTEMATIC SCAFFOLDING =====
lifecycle: "prod"
state: "complete"
seat: "mvp"

## ===== AVAILABILITY AND ACCESS =====
phase_availability: "always"
priority: "critical"
user_configurable: true
requires_restart: false

## ===== PROMOTION GATES =====
promotion_gates:
  to_intermediate_i1:
    - "Configuration schema validated"
    - "Runtime loading tested"
    - "Default values established"
  to_intermediate_i2:
    - "Validation rules enforced"
    - "Error handling complete"
    - "Migration path defined"
  to_intermediate_i3:
    - "Multi-environment support"
    - "Hot reload capability"
    - "Audit trail functional"
  to_complete:
    - "Production deployment validated"
    - "100% configuration coverage"
    - "Security audit passed"

## ===== OBSERVABILITY =====
observability:
  spec_events:
    - "config.loaded"
    - "config.validated"
    - "config.error"
  audit_logging:
    - "config_changes.jsonl"
  spec_validation:
    - "LB-[CONFIG]-XXX.spec.md"

## ===== SECURITY REQUIREMENTS =====
security:
  keychain_required: false
  sensitive_data: false
  encryption_at_rest: false
  encryption_in_transit: false
  audit_logging: true
  validation_required: true

## ===== TECHNICAL METADATA =====
dependencies: []
affects_modules: []  # Modules that consume this config
config_format: "yaml"  # yaml | json | plist | swift
last_updated: "YYYY-MM-DD"
version: "1.0.0"
maintainer: "LocalBrain Team"

## ===== AGENTIC INTEGRATION =====
agent_capabilities:
  can_read: true
  can_write: false
  can_propose_changes: true
  requires_approval: true

agent_boundaries:
  allowed_operations: ["read_config", "propose_change"]
  forbidden_operations: ["modify_config", "bypass_validation"]
  escalation_triggers: ["security_violation", "invalid_config"]
---

# [Policy/Config Name] - [Domain Description]

## Purpose

**What problem this configuration solves and its boundaries.**

**Must contain:**
- Philosophy of configuration (why these settings matter)
- Scope boundaries (what this config controls vs what it doesn't)
- Impact radius (which modules/features depend on this)

**Must NOT contain:**
- Implementation details of modules using config
- Runtime behavior (goes in modules)

**Format:** 1-2 paragraphs + bullets for "out of scope"

---

## Primary Features

**Configuration capabilities and guarantees.**

**Must contain:**
- Validation rules
- Default values
- Supported value ranges
- Hot reload capability

**Format:**
```markdown
- **Feature Name:** Description of config capability
- **Validation:** What checks are enforced
- **Defaults:** Safe fallback values
- **Hot Reload:** Whether changes apply without restart
```

---

## Architecture

**Configuration structure and loading mechanism.**

**Must contain:**
- Configuration schema
- Loading priority (env vars → file → defaults)
- Validation pipeline
- Error handling strategy

**Format:**
```markdown
[1 paragraph overview]

\`\`\`mermaid
graph TD
  A[Load Environment] --> B[Load File]
  B --> C[Apply Defaults]
  C --> D[Validate]
  D --> E[Configuration Object]
\`\`\`

**Loading Order:**
1. Environment variables (highest priority)
2. Configuration file
3. Keychain (for secrets)
4. Built-in defaults (lowest priority)

**Validation Pipeline:**
- Schema validation (structure)
- Value validation (ranges, formats)
- Business rule validation (cross-field)
```

---

## Contracts

**Configuration schema and types.**

**Format:**
```swift
// Configuration Structure
struct ConfigurationName: Codable {
    let setting1: String
    let setting2: Int
    let setting3: ConfigSubtype

    static let `default` = ConfigurationName(
        setting1: "default_value",
        setting2: 100,
        setting3: .defaultMode
    )
}

// Sub-configuration
enum ConfigSubtype: String, Codable {
    case mode1
    case mode2
    case defaultMode
}

// Validation Protocol
protocol ConfigValidator {
    func validate(_ config: ConfigurationName) throws
}

// Environment Access
extension ProcessInfo {
    var configSetting1: String? {
        environment["LB_CONFIG_SETTING1"]
    }
}
```

**YAML Schema (if applicable):**
```yaml
# Configuration file: config.yaml
version: "1.0"
settings:
  setting1: "value"
  setting2: 100
  setting3: "mode1"

# Validation constraints
constraints:
  setting2:
    min: 0
    max: 1000
  setting3:
    enum: ["mode1", "mode2", "defaultMode"]
```

---

## Sub-Components & Behavior

**Configuration subsystems and behaviors.**

**Format:**
```markdown
### ConfigLoader

- **Purpose:** Load and parse configuration from multiple sources
- **Behavior:** Priority-based cascade (env → file → defaults)
- **Swift Type:** Class (singleton)
- **Thread Safety:** Thread-safe via actor isolation

### ConfigValidator

- **Purpose:** Validate configuration values
- **Behavior:** Throws on invalid config, logs warnings for deprecations
- **Swift Type:** Protocol + implementations

### ConfigObserver

- **Purpose:** Notify modules when config changes
- **Behavior:** NotificationCenter broadcast on hot reload
- **Swift Type:** Protocol
```

---

## State Progression & Promotion Gates

**Configuration maturity levels.**

**Format:**
```markdown
### Current State: complete

### Minimal State
**Definition:** Basic config loading works
**Requirements:**
- [ ] Configuration file parsed successfully
- [ ] Default values defined
- [ ] Basic validation working

### Intermediate I1 State
**Definition:** Robust loading with validation
**Requirements:**
- [ ] Multi-source loading (env + file + defaults)
- [ ] Schema validation enforced
- [ ] Error messages helpful

### Intermediate I2 State
**Definition:** Production-ready with hot reload
**Requirements:**
- [ ] Hot reload capability
- [ ] Migration from old versions
- [ ] Audit logging functional

### Intermediate I3 State
**Definition:** Enterprise-grade configuration
**Requirements:**
- [ ] Multi-environment support (dev/staging/prod)
- [ ] Secret management (Keychain integration)
- [ ] Rollback capability

### Complete State
**Definition:** Battle-tested production configuration
**Requirements:**
- [ ] Zero configuration errors in production
- [ ] 100% test coverage
- [ ] Security audit passed

## Promotion Gates
- **Minimal→I1:** Multi-source loading + validation + defaults
- **I1→I2:** Hot reload + migration + audit logging
- **I2→I3:** Multi-env + secrets + rollback
- **I3→Complete:** Production validated + zero errors + security audit
```

---

## Production Implementation

**How to deploy and manage configuration.**

**Format:**
```markdown
### Production-Ready Implementation

\`\`\`swift
// Configuration Manager
@MainActor
class ConfigurationManager: ObservableObject {
    static let shared = ConfigurationManager()

    @Published private(set) var config: ConfigurationName

    private init() {
        self.config = Self.loadConfiguration()
    }

    private static func loadConfiguration() -> ConfigurationName {
        // 1. Try environment variables
        if let envConfig = loadFromEnvironment() {
            return envConfig
        }

        // 2. Try configuration file
        if let fileConfig = loadFromFile() {
            return fileConfig
        }

        // 3. Use defaults
        return .default
    }

    func reload() async throws {
        let newConfig = Self.loadConfiguration()
        try validate(newConfig)
        self.config = newConfig
        await SpecProbe.shared.emit("config.reloaded", [:])
    }

    private func validate(_ config: ConfigurationName) throws {
        // Validation logic
    }
}
\`\`\`

**Configuration Files:**

1. **Info.plist** (app metadata):
   - Bundle identifier
   - Version numbers
   - Permissions/entitlements

2. **config.yaml** (runtime settings):
   - API endpoints
   - Feature flags
   - Performance tuning

3. **Keychain** (secrets):
   - API keys
   - Tokens
   - Credentials

**Environment Variables:**
\`\`\`bash
# Development
export LB_CONFIG_MODE=development
export LB_API_BASE_URL=http://localhost:3000

# Production
export LB_CONFIG_MODE=production
export LB_API_BASE_URL=https://api.localbrain.app
\`\`\`
```

---

## Security & Compliance

**Configuration security and compliance.**

**Format:**
```markdown
**Security Controls:**
- Secrets storage: Keychain only (never in files)
- Configuration files: Read-only after validation
- Environment variables: Validated before use
- Audit logging: All config changes logged

**macOS Security:**
- Keychain Access: Required for API keys
- File Permissions: 0600 for config files
- Sandbox: Configuration files in container

**Compliance:**
- No secrets in version control
- Configuration validation mandatory
- Audit trail for all changes
- Rollback capability required
```

---

## Testing Strategy

**Configuration testing approach.**

**Format:**
```markdown
**Test Scenarios:**

1. **Scenario: Default Configuration**
   - Given: No config file or environment variables
   - When: App launches
   - Then: Default configuration loads successfully
   - Spec: `LB-CONFIG-001.spec.md`

2. **Scenario: Environment Override**
   - Given: Environment variable set
   - When: App loads config
   - Then: Environment value takes precedence
   - Spec: `LB-CONFIG-002.spec.md`

3. **Scenario: Invalid Configuration**
   - Given: Config file with invalid values
   - When: App loads config
   - Then: Validation error thrown, defaults used
   - Spec: `LB-CONFIG-003.spec.md`

4. **Scenario: Hot Reload**
   - Given: App running with initial config
   - When: Config file changes
   - Then: New config loads without restart
   - Spec: `LB-CONFIG-004.spec.md`

**Unit Tests:**
\`\`\`swift
class ConfigurationTests: XCTestCase {
    func testDefaultConfiguration() {
        let config = ConfigurationName.default
        XCTAssertNoThrow(try validate(config))
    }

    func testInvalidConfiguration() {
        let invalid = ConfigurationName(setting2: -1) // Invalid
        XCTAssertThrowsError(try validate(invalid))
    }
}
\`\`\`
```

---

## Success Criteria, Performance & Observability

**Configuration quality metrics.**

**Format:**
```markdown
| Metric | Target | Window | Source |
|--------|--------|--------|--------|
| Load Time | <10ms | On startup | SpecProbe |
| Validation Time | <5ms | Per reload | SpecProbe |
| Error Rate | 0% | Production | Audit logs |
| Hot Reload | <100ms | Per change | SpecProbe |

**SLOs:**
- Configuration loads in <10ms
- Zero invalid configs in production
- Hot reload works 100% of time

**Observability:**
- SpecProbe events: config.loaded, config.validated, config.error
- Audit logs: All configuration changes
- Metrics: Load time, validation time, error count
```

---

## Agent Integration

**How agents interact with configuration.**

**Format:**
```markdown
**Agent Capabilities:**
- Agents can read configuration
- Agents can propose configuration changes
- Agents CANNOT modify configuration directly

**Agent Boundaries:**
- Cannot bypass validation
- Cannot access Keychain secrets directly
- Cannot modify production config without approval

**Approval Workflow:**
- Development config: Auto-approved (logged)
- Staging config: Single approval required
- Production config: Multi-signature approval required

**Policy Constraints:**
| Operation | Approval Level | Audit Required |
|-----------|---------------|----------------|
| Read Config | None | No |
| Propose Change | None | Yes |
| Apply Dev Change | Auto | Yes |
| Apply Prod Change | Multi-sig | Yes |
```

---

## Integrations & References

**Configuration dependencies and impacts.**

**Format:**
```markdown
### Affects Modules:
- **Core Services:** [[mod.ORCHESTRATOR]], [[mod.DATA_POOL]]
- **API Integrations:** [[mod.OPENAI_SERVICE]], [[mod.ANTHROPIC_SERVICE]]

### Configuration Sources:
- **Environment:** ProcessInfo.processInfo.environment
- **Files:** ~/Library/Application Support/LocalBrain/config.yaml
- **Keychain:** Keychain Services API
- **Defaults:** Built into binary

### Implementation Order:
- **Build After:** None (foundation)
- **Build Before:** All modules (everything depends on config)

### See Also:
- **Security:** [[cfg.KEYCHAIN_SECURITY]]
- **Governance:** [[gov.CONFIGURATION_STANDARDS]]
- **Operations:** [[ops.CONFIGURATION_MANAGEMENT]]
```

---

# 📋 CONFIGURATION UNIVERSAL TEMPLATE

**This template defines the UNIVERSAL TRUTH for all CONFIGURATION specification files in LocalBrain.**

**Use this as:**
- ✅ Template for creating new configuration specs
- ✅ Checklist for configuration design
- ✅ Standard for secure configuration management
- ✅ Normative guide for all 3-cfg/* files

**Total Standard Sections:** 12
**Required:** Purpose, Schema, Validation, Loading, Security
**macOS-Specific:** Keychain integration, Info.plist, Sandbox compliance

---

**This is the CANONICAL CONFIGURATION SPECIFICATION TEMPLATE for LocalBrain.** 📋✅
