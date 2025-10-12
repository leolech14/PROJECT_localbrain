#!/bin/bash
# PLUGGY API TESTING SCRIPT
# Test Pluggy sandbox integration step-by-step

echo "🔌 PLUGGY API SANDBOX TESTING"
echo "=============================="
echo ""

# Check credentials
if [ -z "$PLUGGY_CLIENT_ID" ] || [ -z "$PLUGGY_CLIENT_SECRET" ]; then
    echo "❌ ERROR: Credentials not set!"
    echo ""
    echo "Please set:"
    echo "  export PLUGGY_CLIENT_ID=\"your_client_id\""
    echo "  export PLUGGY_CLIENT_SECRET=\"your_client_secret\""
    exit 1
fi

echo "✅ Credentials loaded"
echo "   CLIENT_ID: ${PLUGGY_CLIENT_ID:0:10}..."
echo ""

# Test 1: Generate API Key
echo "📝 TEST 1: Generate API Key"
echo "----------------------------"
API_KEY_RESPONSE=$(curl -s -X POST https://api.pluggy.ai/auth \
  -H "X-API-KEY: $PLUGGY_CLIENT_ID" \
  -H "X-CLIENT-SECRET: $PLUGGY_CLIENT_SECRET" \
  -H "Content-Type: application/json")

echo "Response: $API_KEY_RESPONSE"
API_KEY=$(echo $API_KEY_RESPONSE | grep -o '"apiKey":"[^"]*"' | cut -d'"' -f4)

if [ -z "$API_KEY" ]; then
    echo "❌ Failed to generate API key"
    echo "Check your credentials!"
    exit 1
fi

echo "✅ API Key generated: ${API_KEY:0:20}..."
echo ""

# Test 2: Create Connect Token
echo "📝 TEST 2: Create Connect Token"
echo "--------------------------------"
CONNECT_TOKEN_RESPONSE=$(curl -s -X POST https://api.pluggy.ai/connect/token \
  -H "X-API-KEY: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "itemId": null,
    "options": {
      "clientUserId": "test-user-001"
    }
  }')

echo "Response: $CONNECT_TOKEN_RESPONSE"
CONNECT_TOKEN=$(echo $CONNECT_TOKEN_RESPONSE | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

if [ -z "$CONNECT_TOKEN" ]; then
    echo "❌ Failed to create connect token"
    exit 1
fi

echo "✅ Connect Token created: ${CONNECT_TOKEN:0:20}..."
echo ""

# Test 3: List Available Connectors (Banks)
echo "📝 TEST 3: List Available Banks"
echo "--------------------------------"
CONNECTORS_RESPONSE=$(curl -s -X GET "https://api.pluggy.ai/connectors?countries=BR&sandbox=true" \
  -H "X-API-KEY: $API_KEY")

echo "Available sandbox banks:"
echo "$CONNECTORS_RESPONSE" | grep -o '"name":"[^"]*"' | head -5
echo ""

# Test 4: Get Nubank Sandbox Connector Details
echo "📝 TEST 4: Get Nubank Sandbox Details"
echo "--------------------------------------"
NUBANK_DETAILS=$(curl -s -X GET "https://api.pluggy.ai/connectors/201" \
  -H "X-API-KEY: $API_KEY")

echo "Nubank (ID: 201) details:"
echo "$NUBANK_DETAILS" | grep -o '"name":"[^"]*"'
echo ""

# Summary
echo "=============================="
echo "✅ ALL TESTS PASSED!"
echo "=============================="
echo ""
echo "Next steps:"
echo "1. Use Connect Token to initiate OAuth flow"
echo "2. Open Connect URL in browser: https://connect.pluggy.ai/connect?token=$CONNECT_TOKEN"
echo "3. Complete connection with test credentials:"
echo "   - Username: user-ok"
echo "   - Password: password-ok"
echo "   - MFA Token: 123456"
echo ""
echo "After OAuth completes, you'll receive an itemId to fetch data!"
