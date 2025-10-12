#!/bin/bash

# Test script for Brain CLI
# ========================

echo "🧠 Testing Brain CLI Installation..."
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${RED}✗ Failed to install dependencies${NC}"
    exit 1
fi

echo ""

# Step 2: Build TypeScript
echo "🔨 Building TypeScript..."
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Build successful${NC}"
else
    echo -e "${RED}✗ Build failed${NC}"
    exit 1
fi

echo ""

# Step 3: Test CLI commands
echo "🧪 Testing CLI commands..."
echo ""

# Test version
echo "Testing: brain --version"
node dist/cli.js --version
echo ""

# Test help
echo "Testing: brain --help"
node dist/cli.js --help | head -20
echo ""

# Test auth status (should show not authenticated)
echo "Testing: brain auth status"
node dist/cli.js auth status
echo ""

# Test config show
echo "Testing: brain config show"
node dist/cli.js config show
echo ""

echo "===================================="
echo -e "${GREEN}✅ All tests passed!${NC}"
echo ""
echo "To use the CLI globally:"
echo -e "${YELLOW}npm link${NC}"
echo ""
echo "Then you can use:"
echo -e "${YELLOW}brain --help${NC}"
echo ""
echo "Or run locally with:"
echo -e "${YELLOW}node dist/cli.js --help${NC}"