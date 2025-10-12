---
# ===== CONFIGURATION IDENTITY =====
title: "Brazilian Compliance - Tax & Regulatory Requirements"
config_id: "brazilian_compliance"
type: "configuration"
category: "compliance"

# ===== SYSTEMATIC SCAFFOLDING =====
lifecycle: "dev"
state: "intermediate_i1"
seat: "mvp"

# ===== AVAILABILITY AND ACCESS =====
phase_availability: "always"
priority: "critical"
agent_accessible: true
user_configurable: false

# ===== PROMOTION GATES =====
promotion_gates:
  to_intermediate_i1:
    - "LGPD framework specified"
    - "Tax calculation schemas defined"
    - "Open Finance compliance documented"
  to_intermediate_i2:
    - "NFS-e integration specified"
    - "SPED export defined"
    - "Municipal tax variations handled"
  to_intermediate_i3:
    - "Multi-jurisdiction support complete"
    - "Compliance automation specified"
    - "Audit trail comprehensive"
  to_complete:
    - "All regulatory requirements met"
    - "Production deployment validated"
    - "Compliance SLA achieved"

# ===== OBSERVABILITY =====
observability:
  metrics:
    - "brazilian_compliance.lgpd_compliance_score"
    - "brazilian_compliance.tax_calculation_accuracy"
  alerts:
    - "brazilian_compliance.lgpd_violation"
    - "brazilian_compliance.tax_deadline_approaching"
  dashboards:
    - "brazilian_compliance_health"

# ===== SECURITY REQUIREMENTS =====
security:
  authentication_required: true
  authorization_level: "system"
  data_classification: "highly_confidential"
  encryption_at_rest: true
  encryption_in_transit: true
  audit_logging: true
  rate_limiting: false
  input_validation: "strict"

# ===== TECHNICAL METADATA =====
dependencies: ["tax_calculation_engine", "lgpd_framework"]
integrations: ["receita_federal", "sped_system", "municipal_tax"]
api_contracts: []
last_updated: "2025-10-01"
version: "1.0.0"
maintainer: "Compliance & Legal Team"

# ===== AGENTIC INTEGRATION =====
agent_capabilities:
  can_read: true
  can_write: false
  can_propose_changes: true
  requires_approval: true

agent_boundaries:
  allowed_operations: ["calculate_tax", "check_compliance", "generate_reports"]
  forbidden_operations: ["modify_tax_rates", "bypass_compliance"]
  escalation_triggers: ["compliance_violation", "calculation_error"]
---

# Brazilian Compliance - Tax & Regulatory Requirements

## Purpose

Brazilian Compliance specification defines all requirements for LGPD data protection, Open Finance Brasil integration, Brazilian tax calculations (IRPF, MEI, ISS, PIS/COFINS), and electronic fiscal documents (NFS-e, SPED) for regulatory compliance.

**Reference Implementation:** See `/implementations/brazilian-fintech/` for production code

## Primary Features

- **LGPD Data Subject Rights:** Export, correction, deletion, portability
- **Open Finance Brasil:** OAuth2 security, consent management, data standards
- **IRPF Tax Engine:** Progressive income tax with 2024 tables
- **MEI DAS Calculation:** Micro-entrepreneur monthly tax (R$ 67.60-71.60)
- **ISS Municipal Tax:** Service tax rates by city (2-5%)
- **NFS-e Electronic Invoices:** XML generation and validation
- **SPED Export:** Brazilian accounting system integration

## Architecture

### Compliance Framework

```
User Data → LGPD Controls → Data Processing → Tax Calculation → Fiscal Documents
     ↓            ↓               ↓                  ↓                ↓
  Personal    Consent Mgmt   Entity-Scoped    IRPF/MEI/ISS      NFS-e/SPED
  Business    Export/Delete  RLS Policies     Calculations       XML/TXT
```

### Core Components

1. **LGPD Compliance Framework**
   - Data subject rights implementation
   - Consent management system
   - Data processing purpose tracking
   - Retention and deletion policies

2. **Tax Calculation Engines**
   - IRPF: Personal income tax (progressive tables)
   - MEI: Micro-entrepreneur fixed monthly
   - ISS: Municipal service tax (varies by city)
   - PIS/COFINS: Federal business taxes

3. **Fiscal Document Systems**
   - NFS-e: Electronic service invoice generation
   - SPED: Export for accounting systems
   - Municipal tax system integrations

4. **Regulatory Monitoring**
   - Compliance score tracking
   - Deadline monitoring (declarations, payments)
   - Audit trail completeness
   - Violation detection and alerting

## Contracts

### LGPD Data Subject Rights

```typescript
interface LGPDDataExportRequest {
  userId: string
  entityId: string
  purpose: 'export' | 'correction' | 'deletion' | 'portability'
  requestDate: Date
  fulfillmentDeadline: Date // 30 days from request
}

interface LGPDDataExport {
  personalData: PersonalDataExport
  financialData: FinancialDataExport
  processingHistory: DataProcessingLog[]
  consents: ConsentRecord[]
  retentionPolicies: RetentionPolicy[]
}

interface DataSubjectRights {
  export(): Promise<LGPDDataExport>
  correct(field: string, newValue: any): Promise<CorrectionResult>
  delete(retentionOverride?: boolean): Promise<DeletionResult>
  portability(format: 'json' | 'csv' | 'ofx'): Promise<Buffer>
  revokeConsent(purpose: string): Promise<void>
}
```

### Tax Calculation Schemas

```typescript
// IRPF - Personal Income Tax (2024 Tables)
interface IRPFCalculation {
  annualIncome: number
  deductions: {
    standard: number // 20% up to R$ 16,754.34
    dependents: number // R$ 2,275.08 per dependent
    health: number // Unlimited with receipts
    education: number // Limited to R$ 3,561.50
    socialSecurity: number // INSS contributions
  }
  taxableIncome: number
  brackets: TaxBracket[]
  totalTax: number
  monthlyWithholding: number
  refundOrOwed: number
}

interface TaxBracket {
  floor: number
  ceiling: number
  rate: number // 0%, 7.5%, 15%, 22.5%, 27.5%
  deduction: number
  taxOnBracket: number
}

// MEI - Micro-Entrepreneur Tax
interface MEICalculation {
  businessType: 'commerce' | 'services' | 'industry'
  monthlyDAS: number // R$ 67.60 (commerce) or R$ 71.60 (services)
  breakdown: {
    inss: number // R$ 66.60 (fixed)
    icms?: number // R$ 1.00 (if commerce)
    iss?: number // R$ 5.00 (if services)
  }
  annualRevenue: number
  revenueLimit: number // R$ 81,000 for 2024
  complianceStatus: 'within_limit' | 'approaching_limit' | 'exceeded'
}

// ISS - Municipal Service Tax
interface ISSCalculation {
  municipality: string
  rate: number // 2-5% depending on city
  serviceCode: string
  invoiceAmount: number
  taxAmount: number
  retentionRequired: boolean // If client is company and amount >R$ 5,000
  paymentDeadline: Date
}
```

### NFS-e Electronic Invoice Schema

```typescript
interface NFSeInvoice {
  header: {
    number: string
    series: string
    emissionDate: Date
    serviceCode: string
    municipality: string
  }
  provider: {
    cnpj: string
    name: string
    address: Address
    municipalRegistration: string
  }
  client: {
    cpfCnpj: string
    name: string
    address: Address
  }
  service: {
    description: string
    quantity: number
    unitValue: number
    totalValue: number
    issRate: number
    issValue: number
  }
  taxes: {
    iss: TaxDetail
    pis?: TaxDetail
    cofins?: TaxDetail
    inss?: TaxDetail
    irrf?: TaxDetail
  }
  xmlSignature: string
}
```

### SPED Export Format

```typescript
interface SPEDExport {
  type: 'EFD_CONTRIBUICOES' | 'ECD' | 'ECF'
  referenceMonth: string // MM/YYYY
  company: {
    cnpj: string
    name: string
    regime: 'simples' | 'presumido' | 'real'
  }
  blocks: SPEDBlock[]
  validation: {
    valid: boolean
    errors: ValidationError[]
    warnings: ValidationWarning[]
  }
}

interface SPEDBlock {
  blockId: string // '0000', '0100', 'C100', etc.
  records: SPEDRecord[]
}

interface SPEDRecord {
  recordType: string
  fields: string[]
  children?: SPEDRecord[]
}
```

## Production Implementation

**See:** `/implementations/brazilian-fintech/` for complete production code

**Key Implementation Files:**
- `tax-engines/irpf.ts` - IRPF progressive calculation
- `tax-engines/mei.ts` - MEI DAS calculation
- `tax-engines/iss.ts` - Municipal tax by city
- `lgpd/data-subject-rights.ts` - LGPD compliance implementation
- `nfse/xml-generator.ts` - NFS-e XML generation
- `sped/export-generator.ts` - SPED file generation

## Success Criteria, Performance & Observability

| Metric | Target | Window | Source |
|--------|--------|--------|--------|
| LGPD Compliance Score | 100% | Continuous | LGPD audit tool |
| Tax Calculation Accuracy | 100% | Per calculation | Manual validation |
| NFS-e Generation Success | >99% | Per invoice | Generation logs |
| SPED Validation Pass Rate | 100% | Per export | SPED validator |
| Data Subject Request Fulfillment | <30 days | Per request | LGPD SLA tracker |

## Testing Strategy

1. **LGPD Compliance Test:** Verify data subject rights
   - Given: User requests data export
   - When: Export generated
   - Then: Complete data provided in <30 days, all processing purposes documented
   - Command: `npm test -- lgpd-compliance.spec.ts`

2. **Tax Calculation Test:** Verify accuracy
   - Given: Known income/expense scenarios
   - When: Tax calculated
   - Then: Results match Receita Federal official calculators (100% accuracy)
   - Command: `npm test -- tax-calculations.spec.ts`

3. **NFS-e Generation Test:** Verify XML validity
   - Given: Service invoice data
   - When: NFS-e XML generated
   - Then: XML validates against municipal schema, signature valid
   - Command: `npm test -- nfse-generation.spec.ts`

4. **SPED Export Test:** Verify format compliance
   - Given: Monthly financial data
   - When: SPED file generated
   - Then: Passes official SPED validator with zero errors
   - Command: `npm test -- sped-export.spec.ts`

## Agent Integration

**Agent Capabilities:**
- Agents can calculate taxes for transactions
- Agents can check compliance status
- Agents can generate compliance reports
- Agents can propose tax optimization strategies

**Agent Boundaries:**
- Cannot modify tax rates (system-defined per regulation)
- Cannot bypass LGPD controls
- Cannot alter fiscal document data after generation
- Cannot access compliance data from other entities

**Approval Workflow:**
- Tax calculations: Auto-executed (deterministic, audited)
- Compliance reports: Auto-generated (read-only)
- LGPD requests: Require human approval (data subject right)
- Fiscal documents: Require review before submission

## Related Modules

### **Dependencies:**
- **Core Infrastructure:** [[15_SECURITY_FABRIC]], [[14_NERVOUS_SYSTEM]]
- **Required Services:** [[16_OPEN_FINANCE_CONNECTOR]], Tax calculation libraries

### **Integrations:**
- **External Services:** Receita Federal APIs, Municipal tax systems, SPED validators
- **Data Sources:** [[10_DATA_POOL]], [[32_BANK_ACCOUNTS]], [[30_REVENUE]], [[31_EXPENSE]]

### **Coordinates With:**
- [[53_INTELLIGENCE_LAYER]] (automated tax categorization)
- [[44_DATABASE_VIEWER]] (compliance reporting)
- [[22_APPROVAL_TRAY]] (LGPD request approvals)

## See Also
- **Implementation Code:** `/implementations/brazilian-fintech/README.md`
- **Architecture:** [[gov.PROJECT_ARCHITECTURE]]
- **Security:** [[gov.SECURITY_TESTING]]
- **Roadmap:** [[gov.IMPLEMENTATION_ROADMAP]]

---
