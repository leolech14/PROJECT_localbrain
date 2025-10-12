#!/bin/bash
# Agent Auto-Dispatch Setup Script
# Makes any agent operational in 30 seconds

set -e

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 AGENT AUTO-DISPATCH - 30 SECOND SETUP"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if agent ID provided
if [ -z "$1" ]; then
  echo "❌ Error: Agent ID required"
  echo ""
  echo "Usage: ./setup-agent.sh [AGENT_ID]"
  echo ""
  echo "Available agents:"
  echo "  A - UI Velocity Specialist (GLM-4.6)"
  echo "  B - Design System Specialist (Sonnet-4.5)"
  echo "  C - Backend Services Specialist (GLM-4.6)"
  echo "  D - Integration Specialist (Sonnet-4.5)"
  echo "  E - Ground Supervisor (Gemini 2.5 Pro)"
  echo "  F - Strategic Supervisor (ChatGPT-5)"
  echo ""
  echo "Example: ./setup-agent.sh C"
  echo ""
  exit 1
fi

AGENT_ID=$1

# Validate agent ID
if [[ ! "$AGENT_ID" =~ ^[A-F]$ ]]; then
  echo "❌ Error: Invalid agent ID '$AGENT_ID'"
  echo "   Must be A, B, C, D, E, or F"
  exit 1
fi

# Get agent name
case $AGENT_ID in
  A) AGENT_NAME="UI Velocity Specialist (GLM-4.6)" ;;
  B) AGENT_NAME="Design System Specialist (Sonnet-4.5)" ;;
  C) AGENT_NAME="Backend Services Specialist (GLM-4.6)" ;;
  D) AGENT_NAME="Integration Specialist (Sonnet-4.5)" ;;
  E) AGENT_NAME="Ground Supervisor (Gemini 2.5 Pro)" ;;
  F) AGENT_NAME="Strategic Supervisor (ChatGPT-5)" ;;
esac

echo "Setting up: Agent $AGENT_ID - $AGENT_NAME"
echo ""

# Step 1: Install dependencies (if needed)
echo "📦 Step 1/3: Installing dependencies..."
cd agent-dispatch
if [ ! -d "node_modules" ]; then
  npm install --silent
  echo "   ✅ Dependencies installed"
else
  echo "   ✅ Dependencies already installed"
fi

# Step 2: Build system
echo "🔨 Step 2/3: Building auto-dispatch system..."
npm run build --silent
echo "   ✅ Build complete"

# Step 3: Set environment and test
echo "🎯 Step 3/3: Configuring Agent $AGENT_ID..."
export AGENT_ID=$AGENT_ID

# Add to shell profile
SHELL_RC=""
if [ -f "$HOME/.zshrc" ]; then
  SHELL_RC="$HOME/.zshrc"
elif [ -f "$HOME/.bashrc" ]; then
  SHELL_RC="$HOME/.bashrc"
fi

if [ -n "$SHELL_RC" ]; then
  # Check if already configured
  if ! grep -q "AGENT_ID=$AGENT_ID" "$SHELL_RC"; then
    echo "" >> "$SHELL_RC"
    echo "# Agent Auto-Dispatch (Agent $AGENT_ID)" >> "$SHELL_RC"
    echo "export AGENT_ID=$AGENT_ID" >> "$SHELL_RC"
    echo "alias task='cd $PWD && node dist/cli.js'" >> "$SHELL_RC"
    echo "alias tasks='cd $PWD && node dist/cli.js --list'" >> "$SHELL_RC"
    echo "   ✅ Added to $SHELL_RC"
  else
    echo "   ✅ Already configured in $SHELL_RC"
  fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ SETUP COMPLETE!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Agent $AGENT_ID is ready to work!"
echo ""
echo "📋 NEXT STEPS:"
echo ""
echo "1. Reload your shell:"
echo "   source $SHELL_RC"
echo ""
echo "2. See your current task:"
echo "   task"
echo ""
echo "3. See all your tasks:"
echo "   tasks"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎯 YOUR CURRENT TASK:"
echo ""

# Show current task
node dist/cli.js

echo ""
echo "Ready to work! 🚀"
echo ""
