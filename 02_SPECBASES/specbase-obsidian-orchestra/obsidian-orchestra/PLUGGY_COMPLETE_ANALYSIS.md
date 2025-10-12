# 🔌 PLUGGY PLATFORM - COMPLETE ANALYSIS
**Comprehensive Documentation Analysis for Integration**

Generated: 2025-10-01
Based on: Official Pluggy Documentation (docs.pluggy.ai)

---

## 📊 **EXECUTIVE SUMMARY**

**Pluggy is the perfect fit for our Open Finance integration!**

✅ **Complete Brazilian Coverage:** Open Finance Brasil certified
✅ **12-Month Transaction History:** Exactly what we need
✅ **Real-Time Webhooks:** <100ms update capability
✅ **Sandbox Testing:** Free testing environment available
✅ **2-Hour Token Lifetime:** Manageable with Token Broker
✅ **PIX Support:** Native Brazilian instant payments
✅ **LGPD Compliant:** Built-in consent management

---

## 🎯 **CORE CAPABILITIES**

### **1. Financial Data Aggregation**

**Available Data Types:**
- ✅ Bank Accounts (checking, savings)
- ✅ Credit Cards (with bills and statements)
- ✅ Transactions (up to 12 months, 500 per request)
- ✅ Investments (portfolio data)
- ✅ Loans (debt tracking)
- ✅ Identity verification
- ✅ Payment initiation (PIX, boleto)

### **2. Supported Brazilian Banks**

**Major Banks Confirmed:**
- Nubank (Institution ID: 201 in sandbox)
- Itaú
- Bradesco
- C6 Bank
- Inter
- Plus 100+ other institutions via Open Finance

**Coverage:** Complete Brazilian financial ecosystem

---

## 🔐 **AUTHENTICATION ARCHITECTURE**

### **Token System (2-Tier)**

```typescript
// 1. API Key (Backend)
interface APIKey {
  lifetime: '2 hours'
  purpose: 'Server-side data access'
  permissions: 'Full API access'
  generation: 'POST /auth with CLIENT_ID + CLIENT_SECRET'
}

// 2. Connect Token (Frontend)
interface ConnectToken {
  lifetime: '30 minutes'
  purpose: 'User OAuth flow'
  permissions: 'Limited to connection creation'
  generation: 'POST /connect/token with API Key'
  recommended: '1-per-connection (create new each time)'
}
```

### **Security Requirements**

```bash
# Credentials (obtained from dashboard.pluggy.ai)
CLIENT_ID="your_client_id"
CLIENT_SECRET="your_client_secret"

# CRITICAL: Keep server-side only!
# ❌ NEVER expose in frontend code
# ✅ Store in Doppler or environment variables
```

### **Token Lifecycle**

```
User Initiates Connection
    ↓
Backend: Generate API Key (2h lifetime)
    ↓
Backend: Create Connect Token (30min lifetime)
    ↓
Frontend: Use Connect Token for OAuth
    ↓
User Completes OAuth at Bank
    ↓
Pluggy Returns Item ID + Access Token
    ↓
Backend: Store in Token Broker (encrypted)
    ↓
Backend: Use API Key for data sync
```

---

## 🔄 **OAUTH FLOW (Step-by-Step)**

### **Phase 1: Initiate Connection**

```typescript
// Backend endpoint: /api/open-finance/initiate
POST https://api.pluggy.ai/connect/token
Headers:
  X-API-KEY: ${CLIENT_ID}
  X-CLIENT-SECRET: ${CLIENT_SECRET}
Body:
  {
    "itemId": null,  // null for new connection
    "options": {
      "institution": "201",  // Bank ID (Nubank sandbox)
      "oauthRedirectUrl": "https://yourapp.com/callback"
    }
  }

Response:
  {
    "accessToken": "connect_token_xyz...",
    "connectUrl": "https://connect.pluggy.ai/connect?token=xyz..."
  }
```

### **Phase 2: User Authorization**

```typescript
// Frontend: Redirect user to connectUrl
window.location.href = connectUrl

// User experience:
// 1. Selects their bank
// 2. Redirected to bank's login page
// 3. Enters credentials (bank's native page)
// 4. Completes 2FA if required
// 5. Grants consent for data sharing
// 6. Redirected back to your app with code
```

### **Phase 3: Connection Complete**

```typescript
// Pluggy redirects to: https://yourapp.com/callback?itemId=item_abc123

// Backend: /api/open-finance/callback
const { itemId } = req.query

// Item is now connected! You can fetch data:
GET https://api.pluggy.ai/accounts?itemId=${itemId}
GET https://api.pluggy.ai/transactions?accountId=${accountId}
```

---

## 📡 **REAL-TIME WEBHOOKS**

### **Available Events**

```typescript
// Connection Events
'item/created'           // New bank connected
'item/updated'           // Connection refreshed
'item/deleted'           // User disconnected bank
'item/error'             // Connection failed
'item/waiting_user_input' // Requires user action (MFA)
'connector/status_updated' // Bank connector status changed

// Data Events
'transactions/created'   // New transactions synced
'transactions/updated'   // Transaction modified
'transactions/deleted'   // Transaction removed

// Payment Events
'payment_intent/created'
'payment_intent/completed'
'payment_intent/error'
```

### **Webhook Configuration**

```typescript
// Setup webhook when creating connect token
POST /connect/token
Body:
  {
    "webhookUrl": "https://yourapp.com/webhooks/pluggy",
    "events": ["all"], // or specific events
    "headers": {
      "Authorization": "Bearer your_webhook_secret"
    }
  }
```

### **Webhook Security**

```typescript
// Whitelist Pluggy IP
const PLUGGY_WEBHOOK_IP = '177.71.238.212'

// Webhook payload format
interface WebhookPayload {
  event: string
  eventId: string
  clientId: string
  triggeredBy: 'USER' | 'CLIENT' | 'SYNC'
  data: {
    // Event-specific data
    itemId?: string
    transactionId?: string
    // ...
  }
}

// Retry Policy
const WEBHOOK_RETRIES = 3
const WEBHOOK_RETRY_INTERVAL = '1 minute'
// ⚠️ After 3 failures, notification is lost!
```

---

## 💳 **TRANSACTION DATA STRUCTURE**

### **Transaction Fields**

```typescript
interface PluggyTransaction {
  // Required fields
  id: string
  date: string // ISO8601 UTC
  description: string
  amount: number
  currencyCode: string // 'BRL'
  status: 'PENDING' | 'POSTED'
  type: 'DEBIT' | 'CREDIT'

  // Optional fields
  balance?: number
  category?: string // Requires "Pro" subscription
  categoryId?: string

  // Brazilian-specific
  paymentData?: {
    payer?: string
    payee?: string
    paymentMethod?: 'PIX' | 'TED' | 'DOC' | 'BOLETO'
    reason?: string
  }

  // Merchant details
  merchant?: {
    name?: string
    businessName?: string
    cnpj?: string
  }

  // Credit card specific
  creditCardMetadata?: {
    installmentNumber?: number
    totalInstallments?: number
    payeeDocument?: string
  }
}
```

### **Transaction Retrieval**

```typescript
// Fetch transactions (up to 12 months)
GET /transactions?accountId={accountId}
Query params:
  - from: ISO8601 date (default: 12 months ago)
  - to: ISO8601 date (default: today)
  - pageSize: 1-500 (default: 500)
  - page: integer

Response:
  {
    "results": Transaction[],
    "page": 1,
    "totalPages": 10,
    "total": 4523
  }

// ⚠️ Maximum: 500 transactions per request
// ⚠️ Maximum history: 12 months
```

### **Brazilian Transaction Types**

```
PIX                          // Instant payment
TED                          // Bank transfer (different bank)
DOC                          // Bank transfer (older system)
BOLETO                       // Payment slip
TRANSFERENCIA_MESMA_INSTITUICAO // Internal transfer (same bank)
DEBITO_AUTOMATICO           // Automatic debit
DEPOSITO                     // Deposit
SAQUE                        // Withdrawal
PAGAMENTO_CONTA             // Bill payment
```

---

## 🏦 **ACCOUNT DATA STRUCTURE**

### **Account Types**

```typescript
interface PluggyAccount {
  id: string
  type: 'BANK' | 'CREDIT'
  subtype:
    | 'CHECKING_ACCOUNT'
    | 'SAVINGS_ACCOUNT'
    | 'CREDIT_CARD'

  // Basic info
  name: string
  number: string
  balance: number
  currencyCode: string
  owner: string
  taxNumber: string // CPF/CNPJ

  // Bank account specific
  bankData?: {
    transferNumber?: string
    closingBalance?: number
    overdraftLimit?: number
  }

  // Credit card specific
  creditData?: {
    level?: 'PLATINUM' | 'GOLD' | 'STANDARD'
    brand?: 'MASTERCARD' | 'VISA' | 'ELO'
    availableCredit?: number
    balanceCloseDate?: string
    balanceDueDate?: string
    minimumPayment?: number
    balanceForeignCurrency?: number
  }
}
```

### **Balance Interpretation**

```typescript
// Bank Account Balance
balance > 0  // Available funds
balance < 0  // Overdraft used

// Credit Card Balance
balance > 0  // Amount owed
balance < 0  // Credit (refund/overpayment)
```

---

## ⚠️ **ERROR HANDLING**

### **Error Categories**

```typescript
// 1. LOGIN_ERROR
type LoginErrors =
  | 'INVALID_CREDENTIALS'
  | 'USER_AUTHORIZATION_NOT_GRANTED'
  | 'USER_AUTHORIZATION_REVOKED'

// Action: Prompt user to re-enter credentials

// 2. CONNECTION_ERROR (Status: OUTDATED)
type ConnectionErrors =
  | 'USER_INPUT_TIMEOUT'
  | 'SITE_NOT_AVAILABLE'
  | 'CONNECTION_ERROR'

// Action: Auto-retry up to 5 times (1-hour intervals)

// 3. PARTIAL_SUCCESS
// Cause: Rate limits or temporary institution issues
// Action: Fetch successfully updated products, retry later

// 4. RATE_LIMIT_ERROR
type RateLimitError = '429 Too Many Requests'
// Response headers:
//   RateLimit-Limit: 360 (requests/minute)
//   RateLimit-Reset: 42 (seconds until reset)
//   Retry-After: 60 (standard retry delay)
```

### **Error Handling Strategy**

```typescript
interface ErrorHandlingStrategy {
  'INVALID_CREDENTIALS': {
    action: 'Show error to user'
    message: 'Credenciais inválidas. Por favor, tente novamente.'
    requiresUserAction: true
  }

  'SITE_NOT_AVAILABLE': {
    action: 'Auto-retry'
    retries: 5
    interval: '1 hour'
    alertInternal: true
  }

  'PARTIAL_SUCCESS': {
    action: 'Fetch available products'
    checkWarnings: true
    alertIfCritical: true
  }

  '429 Too Many Requests': {
    action: 'Wait and retry'
    waitTime: 'RateLimit-Reset header'
    avoidParallelCalls: true
  }
}
```

---

## 🚦 **RATE LIMITS**

### **API Rate Limits**

```typescript
const PLUGGY_RATE_LIMITS = {
  'POST /auth': 360,  // requests/minute
  'GET /transactions': 360,
  'GET /investments': 360,
  'GET /investments/{id}/transactions': 360,
  'PATCH /items': 20,  // ⚠️ Lower limit!
}

// Rate limit error response
interface RateLimitResponse {
  status: 429
  headers: {
    'RateLimit-Limit': '360'
    'RateLimit-Reset': '42'  // seconds until reset
    'Retry-After': '60'      // always 60 seconds
  }
}
```

### **Best Practices**

```typescript
// ✅ DO:
✓ Reuse API keys between calls (don't regenerate)
✓ Add waits between batch operations
✓ Use auto-sync feature for daily updates
✓ Contact support if consistently hitting limits

// ❌ DON'T:
✗ Make parallel calls to same endpoint
✗ Poll for updates (use webhooks instead)
✗ Regenerate API key for each request
✗ Ignore rate limit headers
```

---

## 🧪 **SANDBOX ENVIRONMENT**

### **Access**

```bash
# Same API endpoints as production
BASE_URL="https://api.pluggy.ai"

# Use sandbox connectors (separate from live)
# Available in dashboard: Live vs Sandbox toggle
```

### **Test Credentials**

```typescript
// Sandbox test users
const SANDBOX_CREDENTIALS = {
  // Success scenarios
  'user-ok': {
    password: 'password-ok',
    mfaToken: '123456',
    result: 'Successful connection'
  },

  // Error scenarios
  'user-logged': {
    password: 'password-ok',
    result: 'Already logged in error'
  },

  'user-locked': {
    password: 'password-ok',
    result: 'Account locked error'
  },

  // Invalid credentials
  'user-ok': {
    password: 'wrong-password',
    result: 'INVALID_CREDENTIALS error'
  }
}

// Test institution (Nubank sandbox)
const TEST_INSTITUTION_ID = '201'
```

### **Sandbox Capabilities**

```typescript
// Can simulate:
✅ Basic login flow
✅ Multi-factor authentication (1-step and 2-step)
✅ Joint account connections
✅ QR code login
✅ Open Finance flows
✅ Connection errors and intermediate states
✅ Various user scenarios (locked, logged, etc.)
```

### **Sandbox Limitations**

```typescript
⚠️ Simulated data (not real transactions)
⚠️ Limited to predefined test scenarios
⚠️ Test institution coverage may differ from production
```

---

## 📊 **CATEGORIZATION (Pro Feature)**

### **Transaction Categorization**

```typescript
// Requires "Pro" subscription level
interface TransactionCategory {
  id: string
  description: string
  parentId?: string
  parentDescription?: string
}

// Categories provided automatically by Pluggy
// Brazilian merchant pattern recognition
// Enrichment API available for enhanced categorization
```

---

## 🔌 **API ENDPOINT CATEGORIES**

### **Complete Endpoint List**

```typescript
// 1. Auth
POST /auth                     // Generate API key

// 2. Connector
GET /connectors                // List available banks
GET /connectors/{id}           // Get bank details

// 3. Webhook
POST /webhooks                 // Create webhook
GET /webhooks                  // List webhooks
DELETE /webhooks/{id}          // Delete webhook

// 4. Items (Connections)
POST /items                    // Create connection
GET /items                     // List connections
GET /items/{id}                // Get connection details
PATCH /items/{id}              // Update connection
DELETE /items/{id}             // Delete connection

// 5. Consent
GET /consents                  // List consents
POST /consents                 // Create consent
DELETE /consents/{id}          // Revoke consent

// 6. Accounts
GET /accounts                  // List accounts
GET /accounts/{id}             // Get account details

// 7. Transactions
GET /transactions              // List transactions
GET /transactions/{id}         // Get transaction details

// 8. Investment
GET /investments               // List investments
GET /investments/{id}          // Get investment details
GET /investments/{id}/transactions // Investment transactions

// 9. Identity
GET /identity                  // Get user identity data

// 10. Category
GET /categories                // List transaction categories

// 11. Loan
GET /loans                     // List loans
GET /loans/{id}                // Get loan details

// 12. Bill (Credit Card)
GET /bills                     // List credit card bills
GET /bills/{id}                // Get bill details

// 13. Enrichment API
POST /enrichment/categorize    // Categorize transaction

// 14. Payment Initiation
POST /payment-intents          // Create payment

// 15. Automatic PIX (Beta)
POST /automatic-pix            // Schedule automatic PIX

// 16. Smart Transfers
POST /smart-transfers          // Initiate smart transfer

// 17. Boleto Management
POST /boletos                  // Generate boleto
GET /boletos/{id}              // Get boleto status
```

---

## 💰 **PRICING CONSIDERATIONS**

### **Questions for Victória (Pluggy Sales)**

```markdown
1. **Pricing Model:**
   - Per connection? Per API call? Tiered pricing?
   - Startup discounts available?
   - Free tier for testing/MVP?

2. **Subscription Levels:**
   - What's included in basic vs Pro?
   - Categorization requires Pro - cost?
   - Payment initiation pricing?

3. **SLA & Support:**
   - Uptime guarantee?
   - Support response time?
   - Technical onboarding included?

4. **Rate Limits:**
   - Production limits vs sandbox?
   - Can limits be increased?
   - Overage pricing?

5. **Compliance & Certification:**
   - Open Finance Brasil certification level?
   - LGPD compliance documentation?
   - Security certifications (ISO, SOC2)?
```

---

## 🎯 **INTEGRATION CHECKLIST**

### **Phase 1: Sandbox Testing (This Week)**

```markdown
- [ ] Create Pluggy account at dashboard.pluggy.ai
- [ ] Generate CLIENT_ID and CLIENT_SECRET
- [ ] Store credentials in Doppler
- [ ] Test POST /auth (API key generation)
- [ ] Test POST /connect/token (Connect token)
- [ ] Complete OAuth flow with test bank (ID: 201)
- [ ] Fetch test accounts
- [ ] Fetch test transactions
- [ ] Test webhook delivery (use ngrok for local)
- [ ] Document results and questions
```

### **Phase 2: Call with Specialist (Next Week)**

```markdown
- [ ] Schedule call with Victória
- [ ] Discuss pricing and commercial terms
- [ ] Review technical questions from testing
- [ ] Understand production onboarding process
- [ ] Clarify webhook reliability and latency
- [ ] Discuss rate limits and scaling
- [ ] Ask about Brazilian merchant patterns
```

### **Phase 3: Implementation (Weeks 3-4)**

```markdown
- [ ] Implement OAuth flow (mod.16 spec)
- [ ] Setup Token Broker integration (KMS encryption)
- [ ] Implement webhook endpoint
- [ ] Setup Redis Pub/Sub for event fan-out
- [ ] Implement transaction normalization
- [ ] Setup error recovery and retry logic
- [ ] Configure monitoring and alerting
```

### **Phase 4: Production (Weeks 5-8)**

```markdown
- [ ] Complete homologation process
- [ ] Setup production credentials
- [ ] Configure production webhooks
- [ ] Test with real bank connections
- [ ] Validate LGPD compliance
- [ ] Deploy to staging
- [ ] Production deployment
```

---

## ✅ **VALIDATION AGAINST OUR SPEC (mod.16_OPEN_FINANCE.md)**

### **Spec Completeness Check**

```typescript
// Our spec has: ✅
✓ OAuth flow detailed (matches Pluggy exactly!)
✓ Token management (API Key + Connect Token = correct!)
✓ Transaction fetching (12 months = matches Pluggy!)
✓ Webhook setup (events match Pluggy events!)
✓ Error handling (need to add Pluggy error codes)
✓ Brazilian patterns (PIX, TED, DOC all supported!)
✓ LGPD compliance (Pluggy has consent management!)

// Needs updating: ⚠️
⚠️ Add specific Pluggy error codes
⚠️ Add rate limit handling (360/min)
⚠️ Add pagination logic (500 transactions/request)
⚠️ Add Pro subscription requirement for categorization
⚠️ Update token lifetimes (2h API key, 30min Connect)
```

---

## 🚀 **READY TO BUILD!**

### **What We Have:**

✅ **Complete documentation** ingested and analyzed
✅ **Integration spec** (mod.16_OPEN_FINANCE.md) validated
✅ **Active sales contact** (Victória waiting for test)
✅ **Clear timeline** (Final de Novembro = 8 weeks)
✅ **Sandbox access** available now
✅ **Webhook support** for real-time updates
✅ **Brazilian compliance** built-in

### **Next Steps:**

1. **TODAY:** Test Pluggy sandbox (2 hours)
2. **TOMORROW:** Contact Victória with results
3. **THIS WEEK:** Schedule specialist call
4. **NEXT WEEK:** Begin implementation
5. **WEEK 4:** Production deployment

---

## 📞 **CONTACT INFO**

**Pluggy Sales:**
- Contact: Victória
- Channel: WhatsApp
- Status: Awaiting our sandbox test
- Next Action: Schedule specialist call after testing

**Resources:**
- Dashboard: https://dashboard.pluggy.ai
- Docs: https://docs.pluggy.ai
- API Reference: https://docs.pluggy.ai/reference

---

**PLUGGY ANALYSIS COMPLETE!**
**READY FOR SANDBOX TESTING!** 🚀🇧🇷

---

Generated by: Trinity Intelligence Development Team
Project: Orchestra.blue
Date: October 1, 2025
