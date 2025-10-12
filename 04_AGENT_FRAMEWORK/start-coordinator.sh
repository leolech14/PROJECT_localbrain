#!/bin/bash
# Start Central Coordinator Server

set -e

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧠 STARTING CENTRAL COORDINATOR"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd central-coordinator

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install --silent
fi

# Build if needed
if [ ! -d "dist" ]; then
  echo "🔨 Building coordinator..."
  npm run build --silent
fi

echo "✅ Starting server..."
echo ""

# Start server
npm start
