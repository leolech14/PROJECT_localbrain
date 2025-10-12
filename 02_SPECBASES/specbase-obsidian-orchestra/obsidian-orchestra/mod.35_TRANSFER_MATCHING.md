---
# ===== MODULE IDENTITY =====
title: "Transfer Matching - Internal Transfer Detection"
module_id: "transfer_matching"
type: "advanced"
category: "advanced"

# ===== SYSTEMATIC SCAFFOLDING =====
lifecycle: "dev"
state: "minimal"
seat: "scale"

# ===== AVAILABILITY AND ACCESS =====
phase_availability: "unlockable"
priority: "medium"
agent_accessible: true
user_configurable: true

# ===== PROMOTION GATES =====
promotion_gates:
  to_intermediate_i1:
    - "Heuristic matching functional"
    - "Basic deduplication working"
    - "Manual review interface operational"
  to_intermediate_i2:
    - "ML model trained and deployed"
    - "Fuzzy matching implemented"
    - "Performance optimization complete"
  to_intermediate_i3:
    - "Advanced matching patterns active"
    - "Multi-account scenarios handled"
    - "Comprehensive testing complete"
  to_complete:
    - "Production deployment validated"
    - "95%+ precision achieved"
    - "Performance SLA met"

# ===== OBSERVABILITY =====
observability:
  metrics:
    - "transfer_matching.precision_rate"
    - "transfer_matching.recall_rate"
    - "transfer_matching.processing_time_ms"
  alerts:
    - "transfer_matching.precision_below_threshold"
    - "transfer_matching.processing_lag"
  dashboards:
    - "transfer_matching_accuracy"
    - "transfer_matching_performance"

# ===== SECURITY REQUIREMENTS =====
security:
  authentication_required: false
  authorization_level: "system"
  data_classification: "internal"
  encryption_at_rest: false
  encryption_in_transit: true
  audit_logging: true
  rate_limiting: false
  input_validation: "strict"

# ===== TECHNICAL METADATA =====
dependencies: []
integrations: []
api_contracts: []
last_updated: "2025-10-01"
version: "1.0.0"
maintainer: "Orchestra.blue Team"

# ===== AGENTIC INTEGRATION =====
agent_capabilities:
  can_read: true
  can_write: false
  can_propose_changes: true
  requires_approval: false

agent_boundaries:
  allowed_operations: ["suggest_matches", "learn_from_corrections"]
  forbidden_operations: ["auto_delete_transfers", "modify_amounts"]
  escalation_triggers: ["precision_drop", "excessive_false_positives"]
---

# 35 Transfer Matching - Internal Transfer Detection

## Purpose

Transfer Matching automatically detects and pairs internal transfers between user's own accounts to eliminate double-counting in financial analysis, using heuristic rules and machine learning for >95% precision.

## Primary Features

- **Heuristic Matching:** Rule-based detection (amount, date, accounts)
- **Fuzzy Matching:** Handle timing differences and fees
- **ML Enhancement:** Learn patterns from user corrections
- **Manual Review Workflow:** Human verification for uncertain matches
- **Transfer Elimination:** Auto-exclude matched pairs from analysis

## Architecture

### Matching Pipeline

```
New Transaction → Candidate Detection → Matching Algorithm → Confidence Scoring → Review/Auto-Apply
       ↓                  ↓                    ↓                    ↓                ↓
   Data Pool        Find Potential      Heuristic + ML        >95% = Auto      <95% = Manual
                    Transfers           Scoring               Apply            Review
```

### Core Components

1. **Candidate Detector**
   - Scan for opposing transactions (debit/credit pairs)
   - Same amount (within tolerance)
   - Close dates (within window)
   - Between user's accounts

2. **Matching Engine**
   - Heuristic rules (exact amount + date)
   - Fuzzy matching (amount ±fees, date ±3 days)
   - ML model for pattern recognition
   - Confidence scoring (0-1)

3. **Review Interface**
   - Show potential matches to user
   - Side-by-side comparison
   - Accept/reject/modify controls
   - Bulk operations for obvious matches

4. **Learning System**
   - Track user corrections
   - Retrain ML model periodically
   - Adjust confidence thresholds
   - Pattern recognition improvement

## Contracts

### Match Candidate

```typescript
interface TransferMatchCandidate {
  candidateId: string
  sourceTransaction: Transaction
  targetTransaction: Transaction
  confidence: number
  matchReasons: MatchReason[]
  differences: MatchDifference[]
}

interface MatchReason {
  type: 'exact_amount' | 'fuzzy_amount' | 'date_proximity' | 'account_pair' | 'ml_pattern'
  weight: number
  evidence: string
}

interface MatchDifference {
  field: 'amount' | 'date' | 'description'
  sourceDelta: number | string
  explanation: string
}
```

### Matching Algorithm

```typescript
interface MatchingConfig {
  amountTolerance: number // 0.01 = 1% difference allowed
  dateDeltaDays: number // 3 = within 3 days
  minimumConfidence: number // 0.95 = 95% threshold
  autoApplyThreshold: number // 0.98 = auto-apply if >98%
}

interface MatchResult {
  matched: boolean
  confidence: number
  reasons: MatchReason[]
  requiresReview: boolean
}
```

### ML Model

```typescript
interface TransferMatchingModel {
  features: FeatureVector
  prediction: MatchProbability
  threshold: number
}

interface FeatureVector {
  amountDelta: number
  dateDelta: number
  accountPairFrequency: number
  descriptionSimilarity: number
  timeOfDayDelta: number
  dayOfWeekMatch: boolean
}

interface MatchProbability {
  isTransferPair: number // 0-1 probability
  confidence: number
  featureImportance: Record<string, number>
}
```

## Production Implementation

### Heuristic Matching Engine

```typescript
export class TransferMatcher {
  constructor(
    private config: MatchingConfig,
    private mlModel?: MLModel
  ) {}

  async findMatches(newTransaction: Transaction): Promise<TransferMatchCandidate[]> {
    // Only check debit/credit pairs
    const oppositeType = newTransaction.type === 'debit' ? 'credit' : 'debit'

    // Find candidates in recent transactions (±7 days)
    const candidates = await this.findCandidates(newTransaction, {
      type: oppositeType,
      dateRange: 7,
      sameEntity: true,
      differentAccount: true
    })

    // Score each candidate
    const scored = await Promise.all(
      candidates.map(c => this.scoreMatch(newTransaction, c))
    )

    // Filter by minimum confidence
    return scored.filter(s => s.confidence >= this.config.minimumConfidence)
  }

  private async scoreMatch(
    tx1: Transaction,
    tx2: Transaction
  ): Promise<TransferMatchCandidate> {
    const reasons: MatchReason[] = []
    let confidence = 0

    // Exact amount match (+40 points)
    if (Math.abs(tx1.amount - tx2.amount) < 0.01) {
      reasons.push({ type: 'exact_amount', weight: 0.4, evidence: 'Amounts match exactly' })
      confidence += 0.4
    }
    // Fuzzy amount (within 1%, account for fees) (+30 points)
    else if (Math.abs(tx1.amount - tx2.amount) / tx1.amount < this.config.amountTolerance) {
      reasons.push({ type: 'fuzzy_amount', weight: 0.3, evidence: 'Amounts within 1% (fees)' })
      confidence += 0.3
    }

    // Date proximity (+30 points for same day, decreasing)
    const dateDelta = Math.abs(
      (tx1.date.getTime() - tx2.date.getTime()) / (1000 * 60 * 60 * 24)
    )
    if (dateDelta <= this.config.dateDeltaDays) {
      const dateScore = 0.3 * (1 - dateDelta / this.config.dateDeltaDays)
      reasons.push({ type: 'date_proximity', weight: dateScore, evidence: `${dateDelta} days apart` })
      confidence += dateScore
    }

    // Account pair frequency (+20 points if common pair)
    const pairFrequency = await this.getAccountPairFrequency(tx1.accountId, tx2.accountId)
    if (pairFrequency > 5) {
      reasons.push({ type: 'account_pair', weight: 0.2, evidence: `${pairFrequency} transfers between these accounts` })
      confidence += 0.2
    }

    // ML model boost (±10 points)
    if (this.mlModel) {
      const mlScore = await this.mlModel.predict(tx1, tx2)
      reasons.push({ type: 'ml_pattern', weight: mlScore.adjustment, evidence: mlScore.explanation })
      confidence += mlScore.adjustment
    }

    // Identify differences
    const differences: MatchDifference[] = []
    if (tx1.amount !== tx2.amount) {
      differences.push({
        field: 'amount',
        delta: tx2.amount - tx1.amount,
        explanation: 'Likely transfer fee'
      })
    }

    return {
      candidateId: generateUUID(),
      sourceTransaction: tx1,
      targetTransaction: tx2,
      confidence: Math.min(confidence, 1.0),
      matchReasons: reasons,
      differences,
      requiresReview: confidence < this.config.autoApplyThreshold
    }
  }
}
```

### Auto-Application Logic

```typescript
export class TransferMatchProcessor {
  async processMatch(candidate: TransferMatchCandidate): Promise<void> {
    if (candidate.confidence >= 0.98) {
      // Auto-apply high-confidence matches
      await this.applyMatch(candidate)
      await this.audit.log({
        action: 'transfer_match_auto_applied',
        candidateId: candidate.candidateId,
        confidence: candidate.confidence
      })
    } else {
      // Send to manual review
      await this.sendToReview(candidate)
    }
  }

  private async applyMatch(candidate: TransferMatchCandidate): Promise<void> {
    // Mark both transactions as internal transfer
    await this.dataPool.updateMany([
      {
        id: candidate.sourceTransaction.id,
        changes: {
          isInternalTransfer: true,
          matchedTransferId: candidate.targetTransaction.id,
          excludeFromAnalysis: true
        }
      },
      {
        id: candidate.targetTransaction.id,
        changes: {
          isInternalTransfer: true,
          matchedTransferId: candidate.sourceTransaction.id,
          excludeFromAnalysis: true
        }
      }
    ])

    // Publish event
    await this.events.publish('transfers.matched', {
      candidateId: candidate.candidateId,
      transactions: [candidate.sourceTransaction.id, candidate.targetTransaction.id]
    })
  }
}
```

## Success Criteria, Performance & Observability

| Metric | Target | Window | Source |
|--------|--------|--------|--------|
| Matching Precision | >95% | Per match | Manual review feedback |
| Matching Recall | >90% | Daily batch | Audit of missed transfers |
| Processing Time | <100ms p95 | Per transaction | Performance logs |
| False Positive Rate | <5% | Weekly | User corrections |
| Auto-Apply Rate | >80% | Daily | Confidence distribution |

**SLOs:**
- Precision: >95% to prevent incorrect eliminations
- Recall: >90% to catch most transfers
- Processing time: <100ms to not slow ingestion
- User review burden: <20% of matches (80% auto-applied)

**Dashboards:**
- Matching Accuracy: Precision/recall trends, confidence distribution
- Processing Performance: Latency, throughput, backlog
- User Feedback: Acceptance rate, correction patterns

## Testing Strategy

1. **Heuristic Matching Test:** Verify rule-based detection
   - Given: Synthetic transfer pairs (exact amount, same day)
   - When: Matching engine processes
   - Then: 100% precision on exact matches
   - Command: `npm test -- transfer-matching.heuristic.spec.ts`

2. **Fuzzy Matching Test:** Verify tolerance handling
   - Given: Transfer pairs with fees (amount differs by <1%)
   - When: Fuzzy matching applied
   - Then: >95% precision, fee difference identified
   - Command: `npm test -- transfer-matching.fuzzy.spec.ts`

3. **ML Model Test:** Verify pattern recognition
   - Given: Test set with known transfer pairs
   - When: ML model predicts
   - Then: >95% precision, >90% recall on test set
   - Command: `npm test -- transfer-matching.ml.spec.ts`

4. **End-to-End Test:** Verify complete workflow
   - Given: User makes internal transfer
   - When: Both transactions ingested
   - Then: Matched within 1 minute, excluded from expense analysis
   - Command: `npm test -- transfer-matching.e2e.spec.ts`

## Agent Integration

**Agent Capabilities:**
- Agents can suggest potential matches (propose via Change-Set)
- Agents can learn from user corrections (improve ML model)
- Agents can flag suspicious non-matches (fraud detection)

**Agent Boundaries:**
- Cannot auto-apply matches (must go through confidence threshold or review)
- Cannot modify match algorithm parameters
- Cannot access unmatched transaction details (privacy)

**Approval Workflow:**
- High confidence (>98%): Auto-apply, notify user
- Medium confidence (90-98%): Propose via Change-Set, require approval
- Low confidence (<90%): Flag for manual review, do not propose

## Related Modules

### **Dependencies:**
- **Core Infrastructure:** [[10_DATA_POOL]], [[14_NERVOUS_SYSTEM]]
- **Required Services:** [[53_INTELLIGENCE_LAYER]] (ML model)

### **Data Flows:**
- **Receives Transactions From:** [[10_DATA_POOL]], [[33_TRANSACTION_VIEWER]]
- **Sends Matched Pairs To:** [[10_DATA_POOL]] (marked as internal), [[31_EXPENSE_ANALYSIS]] (excluded)

### **Agent Coordination:**
- **Orchestrated By:** [[0.3_ORCHESTRATOR_MAESTRO]]
- **Coordinates With:** [[53_INTELLIGENCE_LAYER]] (ML), [[22_APPROVAL_TRAY]] (review)

### **User Journey:**
- **Previous Step:** Transactions ingested from multiple accounts
- **Next Step:** [[31_EXPENSE_ANALYSIS]] (accurate spending, transfers excluded)

### **Implementation Order:**
- **Build After:** [[10_DATA_POOL]], [[33_TRANSACTION_VIEWER]]
- **Build Before:** Accurate financial analysis (prevents double-counting)

## See Also
- **Architecture:** [[gov.PROJECT_ARCHITECTURE]]
- **ML:** [[53_INTELLIGENCE_LAYER]]
- **Implementation:** [[gov.IMPLEMENTATION_ROADMAP]]

---
