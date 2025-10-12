#!/bin/bash
#
#  Node.js Container Entrypoint
#  LocalBrain - Secure Node.js Execution Environment
#
#  Created by Claude Code Team
#  Date: 2025-10-05
#

set -euo pipefail

# Log startup
echo "🟢 LocalBrain Node.js container starting..."

# Validate workspace directory
if [[ ! -d "/workspace" ]]; then
    echo "❌ Workspace directory not found"
    exit 1
fi

# Set up proper permissions
chown -R localbrain:localbrain /workspace

# Create required subdirectories if they don't exist
mkdir -p /workspace/{code,input,output,temp,logs}

# Set environment variables for security
export NODE_ENV="${NODE_ENV:-production}"
export NODE_PATH="/workspace/code/node_modules:$NODE_PATH"
export NODE_OPTIONS="--max-old-space-size=512 --no-deprecation"

# Security: Restrict Node.js access to workspace
export NODE_PATH="/workspace/code/node_modules"

# Log success
echo "✅ Node.js container ready"
echo "📍 Working directory: $(pwd)"
echo "👤 User: $(whoami)"
echo "🟢 Node.js version: $(node --version)"
echo "📦 npm version: $(npm --version)"

# Check if TypeScript is available
if command -v tsc &> /dev/null; then
    echo "📘 TypeScript version: $(tsc --version)"
fi

# Execute the command or default to Node.js REPL
if [[ $# -eq 0 ]]; then
    echo "🎯 No command specified, starting Node.js REPL..."
    exec node
else
    echo "🎯 Executing: $*"
    exec "$@"
fi