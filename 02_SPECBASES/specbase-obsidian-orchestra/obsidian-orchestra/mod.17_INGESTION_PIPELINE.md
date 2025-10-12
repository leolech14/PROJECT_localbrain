---
# ===== MODULE IDENTITY =====
title: "Ingestion Pipeline - OCR + Storage + Pub/Sub"
module_id: "ingestion_pipeline"
type: "primitive"
category: "primitive"

# ===== SYSTEMATIC SCAFFOLDING =====
lifecycle: "dev"
state: "minimal"
seat: "mvp"

# ===== AVAILABILITY AND ACCESS =====
phase_availability: "always"
priority: "critical"
agent_accessible: true
user_configurable: false

# ===== PROMOTION GATES =====
promotion_gates:
  to_intermediate_i1:
    - "Core OCR processing functional"
    - "Cloud storage operational"
    - "Pub/Sub event delivery working"
  to_intermediate_i2:
    - "Multi-format support complete"
    - "Performance optimization implemented"
    - "Error handling robust"
  to_intermediate_i3:
    - "ML enhancement active"
    - "Advanced deduplication working"
    - "Complete monitoring operational"
  to_complete:
    - "Production deployment validated"
    - "All formats supported"
    - "Performance SLA met"

# ===== OBSERVABILITY =====
observability:
  metrics:
    - "ingestion_pipeline.ocr_accuracy"
    - "ingestion_pipeline.processing_time_ms"
    - "ingestion_pipeline.storage_success_rate"
  alerts:
    - "ingestion_pipeline.ocr_failure_high"
    - "ingestion_pipeline.storage_error"
    - "ingestion_pipeline.pubsub_lag"
  dashboards:
    - "ingestion_pipeline_health"
    - "ingestion_pipeline_performance"

# ===== SECURITY REQUIREMENTS =====
security:
  authentication_required: true
  authorization_level: "system"
  data_classification: "confidential"
  encryption_at_rest: true
  encryption_in_transit: true
  audit_logging: true
  rate_limiting: true
  input_validation: "strict"

# ===== TECHNICAL METADATA =====
dependencies: ["cloud_storage", "ocr_service", "pubsub"]
integrations: ["minio", "tesseract", "google_vision", "redis"]
api_contracts: ["/api/ingest/upload", "/api/ingest/process"]
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
  allowed_operations: ["upload_document", "check_status"]
  forbidden_operations: ["delete_original", "modify_metadata"]
  escalation_triggers: ["ocr_failure_rate_high", "storage_corruption"]
---

# 17 Ingestion Pipeline - OCR + Storage + Pub/Sub

## Purpose

The Ingestion Pipeline is the 8th primitive component enabling document-based financial data entry through OCR processing, secure cloud storage, and event-driven fan-out to downstream systems. It processes PDFs, images, and receipts into structured financial data without manual entry.

## Primary Features

- **PDF/Image OCR Processing:** Tesseract + Google Cloud Vision for text extraction
- **Multi-format Support:** PDF, PNG, JPG, HEIC receipt processing
- **Cloud Storage Integration:** MinIO/S3 with signed URLs and encryption
- **Pub/Sub Event Fan-Out:** Redis Pub/Sub for downstream processing triggers
- **Automatic Deduplication:** Prevent duplicate document processing
- **Metadata Extraction:** Date, amount, merchant, category from receipts

## Architecture

### Ingestion Flow

```
User Upload → Upload API → Cloud Storage → OCR Processing → Normalization → Pub/Sub Fan-Out
     ↓            ↓              ↓               ↓               ↓              ↓
  Web UI      Validation    MinIO/S3      Tesseract/      Canonical     Redis Events
              Security                  Cloud Vision       Format      (multiple subs)
```

### Core Components

1. **Upload Handler**
   - Multipart file upload endpoint
   - File type validation (PDF, images)
   - Size limits and virus scanning
   - Presigned URL generation

2. **OCR Engine**
   - Tesseract for offline processing
   - Google Cloud Vision for accuracy
   - Confidence scoring per field
   - Layout analysis for receipts

3. **Storage Manager**
   - MinIO/S3 bucket organization
   - Encryption at rest (AES-256)
   - Lifecycle policies (retention)
   - Signed URL generation for access

4. **Pub/Sub Publisher**
   - Redis Pub/Sub for real-time
   - Event payload standardization
   - Delivery guarantees (at-least-once)
   - Dead letter queue for failures

5. **Normalization Engine**
   - Extract structured data from OCR text
   - Amount parsing (R$ 123,45 formats)
   - Date extraction (Brazilian formats)
   - Merchant name normalization

## Contracts

### Upload API

```typescript
interface DocumentUploadRequest {
  entityId: string
  file: File
  type: 'receipt' | 'invoice' | 'statement' | 'other'
  metadata?: {
    expectedDate?: Date
    expectedAmount?: number
    category?: string
  }
}

interface DocumentUploadResponse {
  documentId: string
  storageUrl: string
  processingStatus: 'queued' | 'processing' | 'completed' | 'failed'
  estimatedCompletionMs: number
}
```

### OCR Processing

```typescript
interface OCRRequest {
  documentId: string
  storageUrl: string
  documentType: 'receipt' | 'invoice' | 'statement'
  language: 'pt-BR' | 'en'
}

interface OCRResult {
  documentId: string
  extractedText: string
  structuredData: {
    amount?: number
    date?: Date
    merchant?: string
    category?: string
    taxId?: string // CNPJ/CPF
    invoiceNumber?: string
  }
  confidence: {
    overall: number
    amount: number
    date: number
    merchant: number
  }
  requiresReview: boolean
}
```

### Storage Operations

```typescript
interface StorageContract {
  upload(file: Buffer, metadata: FileMetadata): Promise<StorageResult>
  download(documentId: string): Promise<Buffer>
  generateSignedUrl(documentId: string, expiryMs: number): Promise<string>
  delete(documentId: string): Promise<void>
}

interface FileMetadata {
  entityId: string
  documentType: string
  contentType: string
  size: number
  checksum: string
}

interface StorageResult {
  documentId: string
  bucket: string
  key: string
  url: string
  encryptionKey: string
}
```

### Pub/Sub Events

```typescript
interface IngestionEvents {
  'document.uploaded': {
    documentId: string
    entityId: string
    type: string
    timestamp: Date
  }

  'document.ocr_completed': {
    documentId: string
    extractedData: OCRResult
    confidence: number
    requiresReview: boolean
  }

  'document.normalized': {
    documentId: string
    transaction?: Transaction
    invoice?: Invoice
    insertedToPool: boolean
  }

  'document.failed': {
    documentId: string
    error: string
    retryable: boolean
  }
}
```

## Production Implementation

### OCR Processing Engine

```typescript
export class DocumentOCREngine {
  constructor(
    private tesseract: TesseractClient,
    private vision: VisionClient,
    private storage: StorageClient
  ) {}

  async processDocument(request: OCRRequest): Promise<OCRResult> {
    // Download from storage
    const fileBuffer = await this.storage.download(request.documentId)

    // Try Tesseract first (free, offline)
    const tesseractResult = await this.tesseract.recognize(fileBuffer, {
      lang: request.language
    })

    // If confidence low, use Cloud Vision
    let finalResult = tesseractResult
    if (tesseractResult.confidence.overall < 0.85) {
      const visionResult = await this.vision.detectText(fileBuffer)
      finalResult = this.mergeResults(tesseractResult, visionResult)
    }

    // Extract structured data from text
    const structured = await this.extractStructuredData(
      finalResult.text,
      request.documentType
    )

    return {
      documentId: request.documentId,
      extractedText: finalResult.text,
      structuredData: structured,
      confidence: finalResult.confidence,
      requiresReview: finalResult.confidence.overall < 0.90
    }
  }

  private async extractStructuredData(
    text: string,
    type: string
  ): Promise<StructuredData> {
    // Brazilian receipt patterns
    const patterns = {
      amount: /(?:R\$|RS)\s*(\d{1,3}(?:\.\d{3})*(?:,\d{2}))/gi,
      date: /(\d{2})[\/\-](\d{2})[\/\-](\d{4})/g,
      cnpj: /(\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2})/g,
      cpf: /(\d{3}\.\d{3}\.\d{3}\-\d{2})/g
    }

    const amounts = text.match(patterns.amount)
    const dates = text.match(patterns.date)
    const cnpjs = text.match(patterns.cnpj)

    return {
      amount: amounts ? this.parseBRL(amounts[0]) : undefined,
      date: dates ? this.parseBRDate(dates[0]) : undefined,
      taxId: cnpjs ? cnpjs[0] : undefined,
      merchant: this.extractMerchant(text)
    }
  }

  private parseBRL(value: string): number {
    return parseFloat(
      value.replace(/[R$\s]/g, '')
           .replace(/\./g, '')
           .replace(',', '.')
    )
  }
}
```

### Cloud Storage Manager

```typescript
export class CloudStorageManager implements StorageContract {
  constructor(private minio: MinioClient) {}

  async upload(file: Buffer, metadata: FileMetadata): Promise<StorageResult> {
    const documentId = generateUUID()
    const bucket = `entity-${metadata.entityId}`
    const key = `documents/${documentId}`

    // Ensure bucket exists
    await this.ensureBucket(bucket)

    // Generate encryption key
    const encryptionKey = await generateAESKey()

    // Encrypt file
    const encryptedFile = await encrypt(file, encryptionKey)

    // Upload to MinIO
    await this.minio.putObject(bucket, key, encryptedFile, {
      'Content-Type': metadata.contentType,
      'x-amz-server-side-encryption': 'AES256',
      'x-entity-id': metadata.entityId,
      'x-document-type': metadata.documentType
    })

    // Store encryption key in Token Broker
    await this.tokenBroker.storeKey(documentId, encryptionKey)

    return {
      documentId,
      bucket,
      key,
      url: await this.generateSignedUrl(documentId, 3600000), // 1 hour
      encryptionKey: documentId // Reference only
    }
  }

  async generateSignedUrl(documentId: string, expiryMs: number): Promise<string> {
    const { bucket, key } = await this.getDocumentLocation(documentId)
    return this.minio.presignedGetObject(bucket, key, expiryMs / 1000)
  }
}
```

### Pub/Sub Event Publisher

```typescript
export class IngestionEventPublisher {
  constructor(private redis: RedisClient) {}

  async publishDocumentProcessed(result: OCRResult): Promise<void> {
    const event: IngestionEvents['document.ocr_completed'] = {
      documentId: result.documentId,
      extractedData: result,
      confidence: result.confidence.overall,
      requiresReview: result.requiresReview
    }

    // Publish to Redis Pub/Sub
    await this.redis.publish('ingestion.document.ocr_completed', JSON.stringify(event))

    // Also add to outbox for guaranteed delivery
    await this.outbox.add({
      topic: 'ingestion.document.ocr_completed',
      payload: event,
      timestamp: new Date()
    })
  }

  async publishToDataPool(transaction: Transaction): Promise<void> {
    await this.redis.publish('data_pool.transaction.ingested', JSON.stringify({
      transactionId: transaction.id,
      source: 'document_ingestion',
      entityId: transaction.entityId
    }))
  }
}
```

## Success Criteria, Performance & Observability

| Metric | Target | Window | Source |
|--------|--------|--------|--------|
| OCR Accuracy | >90% | Per document | OCR confidence scores |
| Processing Time | <10s p95 | Per document | Processing logs |
| Storage Upload Success | >99.9% | 5 min | Storage API metrics |
| Pub/Sub Delivery | <100ms | Per event | Redis metrics |
| End-to-End Latency | <30s p95 | Upload to Data Pool | Full pipeline trace |

**SLOs:**
- OCR accuracy: >90% for receipts, >95% for invoices
- Processing time: <10s for images, <30s for multi-page PDFs
- Storage reliability: >99.9% upload success rate
- Event delivery: <100ms pub/sub propagation

**Dashboards:**
- Ingestion Pipeline Health: Processing rates, error rates, latency
- OCR Quality: Accuracy by document type, confidence distribution
- Storage Status: Upload success, storage utilization, encryption health

## Testing Strategy

1. **OCR Accuracy Test:** Verify text extraction quality
   - Given: Sample receipts with known values (amount, date, merchant)
   - When: OCR processing executed
   - Then: Extracted values match expected with >90% accuracy
   - Command: `npm test -- ingestion.ocr.spec.ts`

2. **Storage Integrity Test:** Verify upload/download cycle
   - Given: Test document uploaded
   - When: Document downloaded via signed URL
   - Then: Content matches original, encryption/decryption works
   - Command: `npm test -- ingestion.storage.spec.ts`

3. **Pub/Sub Delivery Test:** Verify event fan-out
   - Given: Multiple subscribers listening
   - When: Document processed event published
   - Then: All subscribers receive event within 100ms
   - Command: `npm test -- ingestion.pubsub.spec.ts`

4. **End-to-End Pipeline Test:** Verify complete flow
   - Given: Receipt image uploaded
   - When: Pipeline processes document
   - Then: Transaction appears in Data Pool within 30s
   - Command: `npm test -- ingestion.e2e.spec.ts`

## Agent Integration

**Agent Capabilities:**
- Agents can trigger document uploads (photo capture, file selection)
- Agents can review OCR results for accuracy
- Agents can correct extracted data via Change-Set proposals
- Agents cannot access raw storage or modify documents directly

**Agent Boundaries:**
- Cannot bypass OCR confidence thresholds
- Cannot delete original documents (audit trail)
- Cannot access documents from other entities
- Cannot modify Pub/Sub event payloads

**Approval Workflow:**
- Low confidence (<90%): Requires human review via Approval Tray
- High confidence (>90%): Auto-approved, logged in audit trail
- Agent corrections: Require Change-Set approval

## Security

**Document Security:**
- AES-256 encryption at rest in cloud storage
- TLS 1.3 for all file transfers
- Signed URLs with short expiry (1 hour default)
- Encryption keys stored in Token Broker (KMS)

**LGPD Compliance:**
- Original documents retained for 7 years (tax compliance Lei 8.137/1990)
- User can request document deletion after retention period
- Document access logged in audit trail
- OCR data subject to same LGPD rights as manual data

**Data Validation:**
- File type validation (whitelist: PDF, PNG, JPG, HEIC)
- Size limits (10 MB per file)
- Virus scanning before OCR processing
- Content validation (must contain financial data)

## Integrations

## State Progression Scaffolding

### Current State: minimal

### Minimal State
**Definition:** Basic upload and OCR with manual review
**Requirements:**
- [ ] File upload endpoint operational
- [ ] Basic OCR processing (Tesseract)
- [ ] Simple storage (local or MinIO)
- [ ] Manual review workflow

### Intermediate I1 State
**Definition:** Automated pipeline with cloud integration
**Requirements:**
- [ ] Cloud storage (MinIO production-ready)
- [ ] Dual OCR (Tesseract + Cloud Vision)
- [ ] Pub/Sub event delivery
- [ ] Automatic Data Pool insertion
- [ ] Confidence-based approval routing

### Intermediate I2 State
**Definition:** Advanced processing with ML enhancement
**Requirements:**
- [ ] ML model for merchant recognition
- [ ] Advanced layout analysis (multi-column receipts)
- [ ] Batch processing support
- [ ] Performance optimization (<10s p95)
- [ ] Enhanced deduplication

### Intermediate I3 State
**Definition:** Production-grade with full monitoring
**Requirements:**
- [ ] Complete monitoring and alerting
- [ ] Multi-language OCR (Portuguese + English)
- [ ] Invoice format recognition (NFS-e, etc.)
- [ ] Advanced error recovery
- [ ] Comprehensive audit trail

### Complete State
**Definition:** Enterprise-grade document processing
**Requirements:**
- [ ] Support for all Brazilian receipt formats
- [ ] Real-time processing (<5s)
- [ ] 95%+ OCR accuracy
- [ ] Complete LGPD compliance
- [ ] Enterprise SLA met

## Related Modules

### **Dependencies:**
- **Core Infrastructure:** [[15_SECURITY_FABRIC]], [[14_NERVOUS_SYSTEM]]
- **Required Services:** [[10_DATA_POOL]], Cloud storage, OCR services

### **Data Flows:**
- **Receives Upload From:** [[01_HEADER_COMPONENT]] (upload button), [[33_TRANSACTION_VIEWER]]
- **Sends Extracted Data To:** [[10_DATA_POOL]], [[33_TRANSACTION_VIEWER]], [[31_EXPENSE_ANALYSIS]]

### **Agent Coordination:**
- **Orchestrated By:** [[0.3_ORCHESTRATOR_MAESTRO]]
- **Coordinates With:** [[53_INTELLIGENCE_LAYER]] (categorization), [[22_APPROVAL_TRAY]] (low confidence review)

### **User Journey:**
- **Previous Step:** User has receipt/document to upload
- **Next Step:** [[22_APPROVAL_TRAY]] (review) or [[33_TRANSACTION_VIEWER]] (auto-inserted)

### **Implementation Order:**
- **Build After:** [[15_SECURITY_FABRIC]], [[14_NERVOUS_SYSTEM]], [[10_DATA_POOL]]
- **Build Before:** Advanced financial features relying on document uploads

## See Also
- **Architecture:** [[gov.PROJECT_ARCHITECTURE]]
- **Security:** [[cfg.POLICY_AS_CODE]], [[gov.SECURITY_TESTING]]
- **Implementation:** [[gov.IMPLEMENTATION_ROADMAP]]

---
