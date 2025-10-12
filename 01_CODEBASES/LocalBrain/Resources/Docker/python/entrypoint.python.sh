#!/bin/bash
#
#  Python Container Entrypoint
#  LocalBrain - Secure Python Execution Environment
#
#  Created by Claude Code Team
#  Date: 2025-10-05
#

set -euo pipefail

# Log startup
echo "🐍 LocalBrain Python container starting..."

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
export PYTHONPATH="/workspace/code:$PYTHONPATH"
export PYTHONIOENCODING="utf-8"
export PYTHONDONTWRITEBYTECODE="1"
export PYTHONUNBUFFERED="1"

# Security: Limit Python path to workspace
export PYTHONPATH="/workspace/code"

# Log success
echo "✅ Python container ready"
echo "📍 Working directory: $(pwd)"
echo "👤 User: $(whoami)"
echo "🐍 Python version: $(python3 --version)"

# Execute the command or default to Python REPL
if [[ $# -eq 0 ]]; then
    echo "🎯 No command specified, starting Python REPL..."
    exec python3
else
    echo "🎯 Executing: $*"
    exec "$@"
fi