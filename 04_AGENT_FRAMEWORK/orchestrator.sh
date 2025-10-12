#!/bin/bash
# LocalBrain Multi-Agent Orchestrator
# Opens multiple terminal windows, one agent per window
# Supervisor agent coordinates from main terminal

set -e

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧠 LOCALBRAIN MULTI-AGENT ORCHESTRATOR"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Launching 6-agent coordination system..."
echo "Each agent in separate terminal window"
echo ""

# Base directory
BASE_DIR="/Users/lech/PROJECTS_all/LocalBrain/04_AGENT_FRAMEWORK"
DISPATCH_DIR="$BASE_DIR/agent-dispatch"

# Ensure system is built
cd "$DISPATCH_DIR"
if [ ! -d "dist" ]; then
  echo "🔨 Building auto-dispatch system..."
  npm install --silent
  npm run build --silent
  echo "✅ Build complete"
fi

# Function to open terminal with agent
open_agent_terminal() {
  local AGENT_ID=$1
  local AGENT_NAME=$2
  local COLOR=$3

  # Create AppleScript to open terminal with specific agent
  osascript <<EOF
    tell application "Terminal"
      do script "cd $DISPATCH_DIR && export AGENT_ID=$AGENT_ID && clear && echo '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n🎯 AGENT $AGENT_ID - $AGENT_NAME\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' && node dist/cli.js && echo '\n\n💡 Commands:\n   task   - Show current task\n   tasks  - List all tasks\n   exit   - Close this window\n' && exec bash"

      -- Set window title
      set custom title of front window to "Agent $AGENT_ID - $AGENT_NAME"

      -- Position windows in grid
      set bounds of front window to {$4, $5, $6, $7}
    end tell
EOF
}

echo "🚀 Opening agent terminals..."
echo ""

# Terminal window positions (x1, y1, x2, y2)
# Grid layout: 3 columns x 2 rows

# Row 1: Agents A, B, C
echo "   Agent A (UI Specialist)..."
open_agent_terminal "A" "UI VELOCITY SPECIALIST" "cyan" 0 0 640 400

sleep 0.5
echo "   Agent B (Design Specialist)..."
open_agent_terminal "B" "DESIGN SYSTEM SPECIALIST" "green" 640 0 1280 400

sleep 0.5
echo "   Agent C (Backend Specialist)..."
open_agent_terminal "C" "BACKEND SERVICES SPECIALIST" "yellow" 1280 0 1920 400

sleep 0.5

# Row 2: Agents D, E, Supervisor
echo "   Agent D (Integration Specialist)..."
open_agent_terminal "D" "INTEGRATION SPECIALIST" "blue" 0 400 640 800

sleep 0.5
echo "   Agent E (Ground Supervisor)..."
open_agent_terminal "E" "GROUND SUPERVISOR" "magenta" 640 400 1280 800

sleep 0.5

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ ALL AGENTS LAUNCHED"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎯 AGENT WINDOWS OPENED:"
echo ""
echo "   Row 1: A (UI)  |  B (Design)  |  C (Backend)"
echo "   Row 2: D (Integration)  |  E (Supervisor)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🧠 SUPERVISOR TERMINAL (This Window)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Monitor all agents from here:"
echo ""
echo "Commands:"
echo "  watch-all     Monitor all agent progress"
echo "  status        Show current task status"
echo "  list-tasks    Show all tasks across agents"
echo "  shutdown      Close all agent terminals"
echo ""

# Start supervisor mode
export AGENT_ID=F
cd "$DISPATCH_DIR"

# Create supervisor dashboard
cat <<'SUPERVISOR_DASHBOARD'

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧠 LOCALBRAIN SUPERVISOR DASHBOARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Current System Status:

SUPERVISOR_DASHBOARD

# Show stats for all agents
for agent in A B C D E; do
  echo "Agent $agent:"
  AGENT_ID=$agent node dist/cli.js 2>/dev/null | grep -E "(CURRENT TASK|YOUR TASKS)" | head -2 || echo "  No active task"
  echo ""
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 Ready to supervise! All agents are working independently."
echo "   Each agent sees their task and can start immediately."
echo ""
echo "🔧 Supervisor commands available:"
echo "   - Type 'help' for all commands"
echo "   - Type 'status' for current progress"
echo "   - Type 'exit' to keep agents running but close supervisor"
echo ""

# Keep supervisor terminal open
exec bash
