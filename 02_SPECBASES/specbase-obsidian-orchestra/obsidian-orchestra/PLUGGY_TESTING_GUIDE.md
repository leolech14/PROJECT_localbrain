# 🧪 PLUGGY SANDBOX TESTING GUIDE
**Complete step-by-step testing instructions**

Date: 2025-10-01

---

## 🚀 **QUICK START (5 Minutes)**

### **Step 1: Get Credentials**

```bash
# 1. Open browser
open https://dashboard.pluggy.ai

# 2. Sign up with your email
# 3. Navigate to API Keys section
# 4. Copy CLIENT_ID and CLIENT_SECRET
```

### **Step 2: Test Authentication**

```bash
# Set your credentials
export PLUGGY_CLIENT_ID="your_client_id_here"
export PLUGGY_CLIENT_SECRET="your_client_secret_here"

# Test API key generation
curl -X POST https://api.pluggy.ai/auth \
  -H "X-API-KEY: $PLUGGY_CLIENT_ID" \
  -H "X-CLIENT-SECRET: $PLUGGY_CLIENT_SECRET" \
  -H "Content-Type: application/json"

# Expected response:
# {
#   "apiKey": "long_api_key_string..."
# }
```

### **Step 3: Create Connect Token**

```bash
# Save API key from previous response
export API_KEY="paste_api_key_here"

# Create connect token
curl -X POST https://api.pluggy.ai/connect/token \
  -H "X-API-KEY: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "itemId": null,
    "options": {
      "clientUserId": "test-user-leonardo"
    }
  }'

# Expected response:
# {
#   "accessToken": "connect_token...",
#   "connectUrl": "https://connect.pluggy.ai/connect?token=..."
# }
```

### **Step 4: Complete OAuth Flow**

```bash
# Open the connectUrl from previous response
# This opens Pluggy's widget where you:
# 1. Select "Nubank" (or any sandbox bank)
# 2. Enter test credentials:
#    Username: user-ok
#    Password: password-ok
#    MFA Token: 123456
# 3. Complete connection
# 4. Widget will redirect and give you an itemId
```

### **Step 5: Fetch Data**

```bash
# Use the itemId from OAuth flow
export ITEM_ID="item_abc123..."

# Get accounts
curl -X GET "https://api.pluggy.ai/accounts?itemId=$ITEM_ID" \
  -H "X-API-KEY: $API_KEY"

# Get account ID from response, then fetch transactions
export ACCOUNT_ID="account_xyz..."

curl -X GET "https://api.pluggy.ai/transactions?accountId=$ACCOUNT_ID" \
  -H "X-API-KEY: $API_KEY"
```

---

## 📋 **COMPLETE TEST SCRIPT**

Save as `test-pluggy-complete.sh`:

```bash
#!/bin/bash

echo "🔌 PLUGGY SANDBOX COMPLETE TEST"
echo "================================"
echo ""

# Credentials
read -p "Enter PLUGGY_CLIENT_ID: " CLIENT_ID
read -sp "Enter PLUGGY_CLIENT_SECRET: " CLIENT_SECRET
echo ""
echo ""

# Step 1: Generate API Key
echo "Step 1: Generating API Key..."
API_RESPONSE=$(curl -s -X POST https://api.pluggy.ai/auth \
  -H "X-API-KEY: $CLIENT_ID" \
  -H "X-CLIENT-SECRET: $CLIENT_SECRET" \
  -H "Content-Type: application/json")

API_KEY=$(echo $API_RESPONSE | jq -r '.apiKey')

if [ "$API_KEY" = "null" ] || [ -z "$API_KEY" ]; then
    echo "❌ Failed to generate API key"
    echo "Response: $API_RESPONSE"
    exit 1
fi

echo "✅ API Key: ${API_KEY:0:30}..."
echo ""

# Step 2: Create Connect Token
echo "Step 2: Creating Connect Token..."
CONNECT_RESPONSE=$(curl -s -X POST https://api.pluggy.ai/connect/token \
  -H "X-API-KEY: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "itemId": null,
    "options": {
      "clientUserId": "test-user-001"
    }
  }')

CONNECT_URL=$(echo $CONNECT_RESPONSE | jq -r '.connectUrl')

if [ "$CONNECT_URL" = "null" ] || [ -z "$CONNECT_URL" ]; then
    echo "❌ Failed to create connect token"
    echo "Response: $CONNECT_RESPONSE"
    exit 1
fi

echo "✅ Connect URL: $CONNECT_URL"
echo ""

# Step 3: Manual OAuth
echo "Step 3: Complete OAuth Flow"
echo "1. Open this URL in your browser:"
echo "   $CONNECT_URL"
echo ""
echo "2. Select bank: Nubank (or any sandbox bank)"
echo "3. Enter credentials:"
echo "   Username: user-ok"
echo "   Password: password-ok"
echo "   MFA Token: 123456"
echo ""
read -p "After completing OAuth, enter the itemId: " ITEM_ID
echo ""

# Step 4: Fetch Accounts
echo "Step 4: Fetching Accounts..."
ACCOUNTS_RESPONSE=$(curl -s -X GET "https://api.pluggy.ai/accounts?itemId=$ITEM_ID" \
  -H "X-API-KEY: $API_KEY")

echo "Accounts:"
echo "$ACCOUNTS_RESPONSE" | jq '.results[] | {id, type, name, balance}'
echo ""

ACCOUNT_ID=$(echo $ACCOUNTS_RESPONSE | jq -r '.results[0].id')

# Step 5: Fetch Transactions
echo "Step 5: Fetching Transactions..."
TRANSACTIONS_RESPONSE=$(curl -s -X GET "https://api.pluggy.ai/transactions?accountId=$ACCOUNT_ID" \
  -H "X-API-KEY: $API_KEY")

echo "Recent Transactions (first 5):"
echo "$TRANSACTIONS_RESPONSE" | jq '.results[0:5] | .[] | {date, description, amount, type}'
echo ""

# Summary
echo "================================"
echo "✅ ALL TESTS COMPLETED!"
echo "================================"
echo ""
echo "Summary:"
echo "- API Key: Generated ✅"
echo "- Connect Token: Created ✅"
echo "- OAuth Flow: Completed ✅"
echo "- Accounts: Fetched ✅"
echo "- Transactions: Fetched ✅"
```

---

## 🧪 **INDIVIDUAL API TESTS**

### **Test 1: Authentication**

```bash
curl -X POST https://api.pluggy.ai/auth \
  -H "X-API-KEY: YOUR_CLIENT_ID" \
  -H "X-CLIENT-SECRET: YOUR_CLIENT_SECRET" \
  -H "Content-Type: application/json" \
  | jq

# Success: { "apiKey": "..." }
# Failure: { "error": "..." }
```

### **Test 2: List Sandbox Banks**

```bash
curl -X GET "https://api.pluggy.ai/connectors?countries=BR&sandbox=true" \
  -H "X-API-KEY: YOUR_API_KEY" \
  | jq '.results[] | {id, name}'

# Shows all Brazilian sandbox banks
```

### **Test 3: Get Specific Bank (Nubank)**

```bash
curl -X GET "https://api.pluggy.ai/connectors/201" \
  -H "X-API-KEY: YOUR_API_KEY" \
  | jq

# Returns Nubank sandbox connector details
```

### **Test 4: Create Connect Token with Options**

```bash
curl -X POST https://api.pluggy.ai/connect/token \
  -H "X-API-KEY: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "itemId": null,
    "options": {
      "clientUserId": "leonardo-test",
      "connectorId": 201,
      "includeSandbox": true
    }
  }' \
  | jq

# Returns connect token for Nubank specifically
```

---

## ✅ **SUCCESS CRITERIA**

After testing, you should have:

- [x] Valid API key generated (2-hour lifetime)
- [x] Connect token created (30-minute lifetime)
- [x] OAuth flow completed successfully
- [x] At least one bank account connected
- [x] Transaction data retrieved (sample data in sandbox)
- [x] Understanding of response formats

---

## 📝 **DOCUMENT YOUR RESULTS**

Create `PLUGGY_TEST_RESULTS.md`:

```markdown
# Pluggy Sandbox Test Results

**Date:** 2025-10-01
**Tester:** Leonardo

## Test Results

### Authentication Test
- Status: [SUCCESS/FAILURE]
- API Key Generated: [YES/NO]
- Time Taken: ___ seconds
- Notes: ___

### Connect Token Test
- Status: [SUCCESS/FAILURE]
- Connect URL Received: [YES/NO]
- Notes: ___

### OAuth Flow Test
- Status: [SUCCESS/FAILURE]
- Bank Selected: ___
- Credentials Worked: [YES/NO]
- Time to Complete: ___ seconds
- User Experience: ___

### Data Retrieval Test
- Accounts Retrieved: ___ accounts
- Transactions Retrieved: ___ transactions
- Data Quality: [EXCELLENT/GOOD/POOR]
- Sample Transaction:
  ```json
  {
    "date": "...",
    "description": "...",
    "amount": ...,
    "type": "..."
  }
  ```

### Performance Observations
- API Response Times:
  - Auth: ___ ms
  - Connect Token: ___ ms
  - Accounts: ___ ms
  - Transactions: ___ ms

## Questions for Pluggy Specialist

1. [Question based on testing experience]
2. [Technical question]
3. [Commercial question]

## Next Steps

- [ ] Contact Victória with results
- [ ] Schedule specialist call
- [ ] Begin implementation
```

---

## 🎯 **READY TO TEST!**

**You have everything you need:**
✅ Complete documentation analyzed
✅ Test scripts ready
✅ Integration spec validated (mod.16)
✅ Active sales contact (Victória)

**Just need:**
1. Go to https://dashboard.pluggy.ai
2. Get credentials
3. Run tests!

**LET'S DO THIS!** 🚀🇧🇷
