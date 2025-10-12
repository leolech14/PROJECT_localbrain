# 🔌 PLUGGY IMPLEMENTATION GUIDE
**Production-Ready Integration Blueprint**

Date: 2025-10-01
Based on: Official Pluggy API Reference

---

## 🎯 **COMPLETE API STRUCTURE**

### **Authentication Endpoints**

```typescript
// 1. Create API Key (Backend Only - 2-hour lifetime)
POST https://api.pluggy.ai/auth
Headers:
  accept: application/json
  content-type: application/json
Body:
  {
    "clientId": "uuid",      // From dashboard.pluggy.ai
    "clientSecret": "string" // From dashboard.pluggy.ai
  }
Response:
  { "apiKey": "long_token_string..." }

// 2. Create Connect Token (Frontend - 30-min lifetime)
POST https://api.pluggy.ai/connect/token
Headers:
  X-API-KEY: {apiKey from step 1}
  content-type: application/json
Body:
  {
    "itemId": null,  // null for new connection
    "options": {
      "clientUserId": "leonardo-entity-001",
      "connectorId": 201,  // Optional: specific bank
      "webhookUrl": "https://yourapp.com/webhooks/pluggy",
      "includeSandbox": true
    }
  }
Response:
  {
    "accessToken": "connect_token...",
    "connectUrl": "https://connect.pluggy.ai/connect?token=..."
  }
```

---

## 🏦 **COMPLETE ENDPOINT CATALOG**

### **Category 1: Connectors (Banks)**

```bash
# List all connectors
GET /connectors?countries=BR&sandbox=true

# Get specific connector
GET /connectors/{connectorId}
```

### **Category 2: Items (Connections)**

```bash
# Create connection (via Connect Token flow)
POST /items

# List user's connections
GET /items

# Get connection details
GET /items/{itemId}

# Update/refresh connection (RATE LIMIT: 20/min!)
PATCH /items/{itemId}

# Delete connection
DELETE /items/{itemId}
```

### **Category 3: Accounts**

```bash
# List accounts for a connection
GET /accounts?itemId={itemId}

# Get specific account
GET /accounts/{accountId}
```

### **Category 4: Transactions (RATE LIMIT: 360/min)**

```bash
# List transactions for account
GET /transactions?accountId={accountId}
Query params:
  - from: ISO8601 date (default: 12 months ago)
  - to: ISO8601 date (default: today)
  - pageSize: 1-500 (default: 500)
  - page: integer

# Get specific transaction
GET /transactions/{transactionId}
```

### **Category 5: Investments**

```bash
GET /investments?itemId={itemId}
GET /investments/{investmentId}
GET /investments/{investmentId}/transactions
```

### **Category 6: Identity**

```bash
GET /identity?itemId={itemId}
```

### **Category 7: Loans**

```bash
GET /loans?itemId={itemId}
GET /loans/{loanId}
```

### **Category 8: Bills (Credit Cards)**

```bash
GET /bills?accountId={accountId}
GET /bills/{billId}
```

### **Category 9: Categories**

```bash
GET /categories
# Requires Pro subscription for transaction categorization
```

### **Category 10: Enrichment API**

```bash
POST /enrichment/categorize    # Categorize transaction
POST /enrichment/behavior      # Behavior analysis
POST /enrichment/recurring     # Detect recurring payments
```

### **Category 11: Payment Initiation**

```bash
# Payment Customers
POST /payment-customers
GET /payment-customers

# Payment Recipients
POST /payment-recipients
GET /payment-recipients

# Payment Requests
POST /payment-requests
GET /payment-requests

# Payment Schedules
POST /payment-schedules
GET /payment-schedules

# Payment Intents
POST /payment-intents
GET /payment-intents
```

### **Category 12: Automatic PIX (Beta)**

```bash
POST /automatic-pix/payment-requests
POST /automatic-pix/schedules
GET /automatic-pix/schedules
GET /automatic-pix/schedules/{id}
POST /automatic-pix/schedules/{id}/cancel
POST /automatic-pix/consents/{id}/cancel
POST /automatic-pix/schedules/{id}/retry
```

### **Category 13: Smart Transfers**

```bash
GET /smart-transfers/preauthorizations
POST /smart-transfers/preauthorizations
GET /smart-transfers/preauthorizations/{id}
POST /smart-transfers/payments
GET /smart-transfers/payments/{id}
```

### **Category 14: Boleto Management**

```bash
POST /boleto/credentials
POST /boleto/items
POST /boleto/issue
POST /boleto/cancel
GET /boleto/{boletoId}
```

### **Category 15: Consent Management**

```bash
GET /consents?itemId={itemId}
POST /consents
DELETE /consents/{consentId}
```

### **Category 16: Webhooks**

```bash
POST /webhooks
GET /webhooks
DELETE /webhooks/{webhookId}
```

---

## 🔄 **COMPLETE INTEGRATION FLOW**

### **Flow 1: Initial Bank Connection**

```typescript
// Backend: /api/open-finance/initiate
async function initiateConnection(entityId: string) {
  // Step 1: Generate API Key
  const authResponse = await fetch('https://api.pluggy.ai/auth', {
    method: 'POST',
    headers: {
      'X-API-KEY': process.env.PLUGGY_CLIENT_ID,
      'X-CLIENT-SECRET': process.env.PLUGGY_CLIENT_SECRET,
      'Content-Type': 'application/json'
    }
  })
  const { apiKey } = await authResponse.json()

  // Step 2: Create Connect Token
  const connectResponse = await fetch('https://api.pluggy.ai/connect/token', {
    method: 'POST',
    headers: {
      'X-API-KEY': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      itemId: null,
      options: {
        clientUserId: entityId,
        webhookUrl: `${process.env.APP_URL}/webhooks/pluggy`,
        includeSandbox: process.env.NODE_ENV !== 'production'
      }
    })
  })
  const { connectUrl, accessToken } = await connectResponse.json()

  // Step 3: Return connect URL to frontend
  return { connectUrl, apiKey } // Store apiKey for later use
}

// Frontend: Open OAuth
window.location.href = connectUrl

// User completes OAuth at bank → Redirects back with itemId

// Backend: /api/open-finance/callback
async function handleCallback(itemId: string, apiKey: string) {
  // Fetch accounts immediately
  const accountsResponse = await fetch(
    `https://api.pluggy.ai/accounts?itemId=${itemId}`,
    {
      headers: { 'X-API-KEY': apiKey }
    }
  )
  const accounts = await accountsResponse.json()

  // Fetch 12 months of transactions for each account
  for (const account of accounts.results) {
    const transactionsResponse = await fetch(
      `https://api.pluggy.ai/transactions?accountId=${account.id}`,
      {
        headers: { 'X-API-KEY': apiKey }
      }
    )
    const transactions = await transactionsResponse.json()

    // Insert into Data Pool
    await dataPool.insertTransactions(transactions.results, {
      source: 'pluggy',
      entityId: entityId,
      accountId: account.id
    })
  }

  // Store connection info (encrypted)
  await tokenBroker.storeConnection({
    provider: 'pluggy',
    itemId: itemId,
    entityId: entityId,
    connectedAt: new Date()
  })

  return { success: true, accounts: accounts.results.length }
}
```

---

## 🔔 **WEBHOOK INTEGRATION**

### **Setup Webhook Endpoint**

```typescript
// Backend: /api/webhooks/pluggy
import { NextApiRequest, NextApiResponse } from 'next'

const PLUGGY_WEBHOOK_IP = '177.71.238.212'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Verify source IP
  const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress
  if (clientIP !== PLUGGY_WEBHOOK_IP) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  // Parse webhook event
  const event = req.body as PluggyWebhookEvent

  switch (event.event) {
    case 'transactions/created':
      await handleNewTransactions(event.data)
      break

    case 'item/updated':
      await handleConnectionRefresh(event.data)
      break

    case 'item/error':
      await handleConnectionError(event.data)
      break

    case 'item/waiting_user_input':
      await notifyUserActionRequired(event.data)
      break

    default:
      console.log('Unhandled webhook event:', event.event)
  }

  // Always return 200 within 30s to avoid retry
  res.status(200).json({ received: true })
}

async function handleNewTransactions(data: any) {
  // Fetch new transactions
  const apiKey = await generateAPIKey()
  const response = await fetch(
    `https://api.pluggy.ai/transactions?accountId=${data.accountId}`,
    { headers: { 'X-API-KEY': apiKey } }
  )
  const transactions = await response.json()

  // Insert to Data Pool
  await dataPool.insertTransactions(transactions.results)

  // Publish real-time event
  await redis.publish('transactions.new', {
    entityId: data.entityId,
    count: transactions.results.length
  })
}
```

### **Webhook Event Types**

```typescript
interface PluggyWebhookEvent {
  event:
    | 'item/created'
    | 'item/updated'
    | 'item/deleted'
    | 'item/error'
    | 'item/waiting_user_input'
    | 'connector/status_updated'
    | 'transactions/created'
    | 'transactions/updated'
    | 'transactions/deleted'
    | 'payment_intent/created'
    | 'payment_intent/completed'
    | 'payment_intent/error'
    | 'scheduled_payment/created'
    | 'scheduled_payment/completed'
    | 'automatic_pix_payment/created'
    | 'automatic_pix_payment/completed'

  eventId: string
  clientId: string
  triggeredBy: 'USER' | 'CLIENT' | 'SYNC'
  data: {
    itemId?: string
    accountId?: string
    transactionId?: string
    // Event-specific data
  }
}

// Retry policy
const WEBHOOK_RETRY = {
  attempts: 3,
  interval: '1 minute',
  // ⚠️ After 3 failures, notification LOST!
}
```

---

## ⚡ **RATE LIMITS & OPTIMIZATION**

### **Rate Limits by Endpoint**

```typescript
const PLUGGY_RATE_LIMITS = {
  'POST /auth': 360,                    // per minute
  'GET /transactions': 360,              // per minute
  'GET /investments': 360,               // per minute
  'GET /investments/{id}/transactions': 360,
  'PATCH /items': 20,                    // ⚠️ Lower limit!
}

// Rate limit error (429)
interface RateLimitHeaders {
  'RateLimit-Limit': '360'        // Max requests/minute
  'RateLimit-Reset': '42'         // Seconds until reset
  'Retry-After': '60'             // Always 60 seconds
}
```

### **Optimization Strategies**

```typescript
// ✅ Best Practices
class PluggyRateLimitHandler {
  private apiKeyCache: { key: string; expiresAt: Date } | null = null

  async getAPIKey(): Promise<string> {
    // Reuse API key until 10 min before expiry
    if (this.apiKeyCache && this.apiKeyCache.expiresAt > new Date(Date.now() + 10 * 60 * 1000)) {
      return this.apiKeyCache.key
    }

    // Generate new API key
    const response = await fetch('https://api.pluggy.ai/auth', {
      method: 'POST',
      headers: {
        'X-API-KEY': process.env.PLUGGY_CLIENT_ID!,
        'X-CLIENT-SECRET': process.env.PLUGGY_CLIENT_SECRET!,
        'Content-Type': 'application/json'
      }
    })
    const { apiKey } = await response.json()

    // Cache for 2 hours
    this.apiKeyCache = {
      key: apiKey,
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000)
    }

    return apiKey
  }

  async fetchWithRateLimit<T>(
    url: string,
    options: RequestInit
  ): Promise<T> {
    try {
      const response = await fetch(url, options)

      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After') || '60'
        console.log(`Rate limited. Waiting ${retryAfter}s...`)

        await this.sleep(parseInt(retryAfter) * 1000)
        return this.fetchWithRateLimit(url, options) // Retry
      }

      return await response.json()
    } catch (error) {
      throw error
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// ✅ DO: Use auto-sync for daily updates (instead of polling)
// ✅ DO: Batch operations with delays
// ❌ DON'T: Make parallel calls to same endpoint
// ❌ DON'T: Poll for updates (use webhooks)
```

---

## 📝 **COMPLETE DATA STRUCTURES**

### **Account Types**

```typescript
interface PluggyAccount {
  id: string
  itemId: string
  type: 'BANK' | 'CREDIT'
  subtype: 'CHECKING_ACCOUNT' | 'SAVINGS_ACCOUNT' | 'CREDIT_CARD'

  // Basic information
  name: string
  number: string
  balance: number
  currencyCode: string
  owner: string
  taxNumber: string  // CPF or CNPJ

  // Bank-specific data
  bankData?: {
    transferNumber?: string
    closingBalance?: number
    overdraftLimit?: number
  }

  // Credit card-specific data
  creditData?: {
    level?: 'PLATINUM' | 'GOLD' | 'STANDARD' | 'MASTERCARD' | 'VISA'
    brand?: string
    availableCredit?: number
    balanceCloseDate?: string
    balanceDueDate?: string
    minimumPayment?: number
    balanceForeignCurrency?: number
  }

  // Metadata
  createdAt: string
  updatedAt: string
}
```

### **Transaction Structure**

```typescript
interface PluggyTransaction {
  // Core fields (always present)
  id: string
  accountId: string
  date: string            // ISO8601 UTC
  description: string
  amount: number
  currencyCode: string    // 'BRL'
  status: 'PENDING' | 'POSTED'
  type: 'DEBIT' | 'CREDIT'

  // Optional fields
  balance?: number
  category?: string       // Requires Pro subscription
  categoryId?: string

  // Payment data (Brazilian-specific)
  paymentData?: {
    payer?: string
    payee?: string
    paymentMethod?: 'PIX' | 'TED' | 'DOC' | 'BOLETO' | 'TRANSFERENCIA_MESMA_INSTITUICAO'
    reason?: string
  }

  // Merchant information
  merchant?: {
    name?: string
    businessName?: string
    cnpj?: string
  }

  // Credit card metadata
  creditCardMetadata?: {
    installmentNumber?: number
    totalInstallments?: number
    payeeDocument?: string
  }

  // Metadata
  createdAt: string
  updatedAt: string
}
```

---

## 🧪 **SANDBOX TESTING PROTOCOL**

### **Test Credentials**

```typescript
const SANDBOX_TEST_USERS = {
  // Success scenarios
  SUCCESS: {
    username: 'user-ok',
    password: 'password-ok',
    mfaToken: '123456',
    expectedResult: 'Successful connection with data'
  },

  // Error scenarios
  ALREADY_LOGGED: {
    username: 'user-logged',
    password: 'password-ok',
    expectedResult: 'Already logged in error'
  },

  ACCOUNT_LOCKED: {
    username: 'user-locked',
    password: 'password-ok',
    expectedResult: 'Account locked error'
  },

  INVALID_CREDENTIALS: {
    username: 'user-ok',
    password: 'wrong-password',
    expectedResult: 'INVALID_CREDENTIALS error'
  }
}

const SANDBOX_INSTITUTION = {
  id: '201',
  name: 'Nubank',
  type: 'sandbox'
}
```

### **Sandbox Test Scenarios**

```bash
# 1. Basic flow test
✓ Generate API key
✓ Create connect token
✓ Complete OAuth with user-ok/password-ok
✓ Fetch accounts
✓ Fetch transactions

# 2. MFA flow test
✓ Connect token with MFA requirement
✓ Enter MFA token: 123456
✓ Complete connection

# 3. Error handling test
✓ Try invalid credentials (user-ok/wrong-password)
✓ Verify INVALID_CREDENTIALS error
✓ Handle gracefully

# 4. Webhook test
✓ Setup webhook URL (use ngrok for local testing)
✓ Complete connection
✓ Verify webhook delivery for item/created
✓ Verify webhook for transactions/created
```

---

## ⚠️ **ERROR HANDLING COMPLETE GUIDE**

### **Error Categories & Actions**

```typescript
interface PluggyErrorHandling {
  // Category 1: Login Errors
  'INVALID_CREDENTIALS': {
    httpStatus: 401
    userAction: 'Re-enter credentials'
    systemAction: 'Show error message to user'
    retryable: true
    message: 'Credenciais inválidas. Verifique seu login e senha.'
  }

  'USER_AUTHORIZATION_NOT_GRANTED': {
    httpStatus: 403
    userAction: 'Grant consent at bank'
    systemAction: 'Explain consent requirement'
    retryable: true
    message: 'Autorização não concedida. Complete a autorização no seu banco.'
  }

  'USER_AUTHORIZATION_REVOKED': {
    httpStatus: 403
    userAction: 'Reconnect account'
    systemAction: 'Mark connection as revoked, notify user'
    retryable: true
    message: 'Autorização revogada. Reconecte sua conta para continuar.'
  }

  // Category 2: Connection Errors (Status: OUTDATED)
  'USER_INPUT_TIMEOUT': {
    itemStatus: 'OUTDATED'
    systemAction: 'Auto-retry 5x with 1-hour intervals'
    retryable: true
    alertInternal: true
  }

  'SITE_NOT_AVAILABLE': {
    itemStatus: 'OUTDATED'
    systemAction: 'Auto-retry 5x, alert internal team'
    retryable: true
    userMessage: 'Banco temporariamente indisponível. Tentaremos novamente automaticamente.'
  }

  'CONNECTION_ERROR': {
    itemStatus: 'OUTDATED'
    systemAction: 'Auto-retry 5x'
    retryable: true
  }

  // Category 3: Partial Success
  'PARTIAL_SUCCESS': {
    itemStatus: 'PARTIAL_SUCCESS'
    systemAction: 'Fetch available products, check warnings, alert if critical'
    retryable: true
    message: 'Alguns dados foram sincronizados com sucesso. Tentando novamente...'
  }

  // Category 4: Rate Limit
  '429_TOO_MANY_REQUESTS': {
    httpStatus: 429
    systemAction: 'Wait RateLimit-Reset seconds, then retry'
    retryable: true
    preventable: 'Avoid parallel calls, reuse API keys'
  }
}
```

### **Retry Strategy Implementation**

```typescript
class PluggyRetryHandler {
  async executeWithRetry<T>(
    operation: () => Promise<T>,
    errorType: string
  ): Promise<T> {
    const strategy = this.getRetryStrategy(errorType)

    for (let attempt = 1; attempt <= strategy.maxAttempts; attempt++) {
      try {
        return await operation()
      } catch (error) {
        if (attempt === strategy.maxAttempts) {
          throw error // Max retries reached
        }

        // Wait before retry
        await this.sleep(strategy.intervalMs)

        // Alert internal team if needed
        if (strategy.alertInternal) {
          await this.alerting.send({
            severity: 'warning',
            message: `Pluggy retry attempt ${attempt}/${strategy.maxAttempts}`,
            context: { errorType, attempt }
          })
        }
      }
    }

    throw new Error('Retry logic failed')
  }

  private getRetryStrategy(errorType: string) {
    switch (errorType) {
      case 'OUTDATED':
        return { maxAttempts: 5, intervalMs: 60 * 60 * 1000, alertInternal: true } // 1 hour
      case 'RATE_LIMIT':
        return { maxAttempts: 3, intervalMs: 60 * 1000, alertInternal: false } // 1 minute
      case 'CONNECTION_ERROR':
        return { maxAttempts: 3, intervalMs: 5 * 1000, alertInternal: false } // 5 seconds
      default:
        return { maxAttempts: 1, intervalMs: 0, alertInternal: false }
    }
  }
}
```

---

## 🎯 **INTEGRATION WITH OUR ARCHITECTURE**

### **How Pluggy Fits Our Modules**

```typescript
// mod.16_OPEN_FINANCE.md maps to Pluggy as:

// OAuth Flow → Pluggy Connect Token + OAuth
initiateConnection() → POST /connect/token → connectUrl → User OAuth

// Token Management → Pluggy API Key (2h) stored in Token Broker
storeTokens() → Encrypt API Key → Store in KMS Token Broker

// Account Sync → Pluggy Accounts API
syncAccountData() → GET /accounts?itemId={itemId}

// Transaction Fetch → Pluggy Transactions API (12 months)
fetchTransactions() → GET /transactions?accountId={id}&from={12MonthsAgo}

// Real-Time Updates → Pluggy Webhooks
handleWebhook() → Receive event → Fetch new data → Publish to Nervous System

// Transaction Normalization → Our enrichment on top of Pluggy data
normalizeTransaction() → Parse Pluggy format → Brazilian patterns → Data Pool format
```

---

## ✅ **IMMEDIATE TEST COMMANDS**

Once you have credentials, run these in order:

```bash
# Set credentials (from dashboard.pluggy.ai)
export PLUGGY_CLIENT_ID="your_client_id"
export PLUGGY_CLIENT_SECRET="your_client_secret"

# Test 1: Generate API Key
curl -X POST https://api.pluggy.ai/auth \
  -H "X-API-KEY: $PLUGGY_CLIENT_ID" \
  -H "X-CLIENT-SECRET: $PLUGGY_CLIENT_SECRET" \
  -H "Content-Type: application/json" \
  | jq

# Save the apiKey, then:
export API_KEY="paste_api_key_here"

# Test 2: List Sandbox Banks
curl -X GET "https://api.pluggy.ai/connectors?countries=BR&sandbox=true" \
  -H "X-API-KEY: $API_KEY" \
  | jq '.results[] | {id, name}' | head -20

# Test 3: Get Nubank Details
curl -X GET "https://api.pluggy.ai/connectors/201" \
  -H "X-API-KEY: $API_KEY" \
  | jq

# Test 4: Create Connect Token
curl -X POST https://api.pluggy.ai/connect/token \
  -H "X-API-KEY: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "itemId": null,
    "options": {
      "clientUserId": "leonardo-test-001",
      "connectorId": 201,
      "includeSandbox": true
    }
  }' \
  | jq

# This gives you connectUrl - open in browser to complete OAuth!
```

---

## 🚀 **READY TO TEST!**

**What you need:**
1. Go to https://dashboard.pluggy.ai → Get credentials (2 min)
2. Export credentials to terminal (30 sec)
3. Run test commands above (5 min)

**Tell me when you have credentials and I'll help you test live!** 🎯

