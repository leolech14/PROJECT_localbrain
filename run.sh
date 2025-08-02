#!/bin/bash

# LocalBrain Run Script with Doppler Secret Management
echo "🧠 Starting LocalBrain with Doppler secrets..."

# Run with Doppler to inject all secrets as environment variables
doppler run -- pnpm --filter=desktop tauri:dev