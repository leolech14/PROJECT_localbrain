# 🧠 Brain CLI - Central Intelligence Command Line Interface

> **Beautiful, Doppler-simple CLI for universal agent orchestration**

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/localbrain/brain-cli)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org)

## 🚀 Quick Start

### Installation

```bash
# Install globally
npm install -g @lech/brain-cli

# Verify installation
brain --version
```

### One-Time Setup

```bash
# Authenticate
brain auth login

# Connect and discover your environment
brain connect
```

### Daily Workflow

```bash
# View available tasks
brain task list

# Claim a task
brain task claim T020

# Update progress
brain task update T020 50% --notes "JWT implementation complete"

# Complete task
brain task complete T020
```

## ✨ Features

- 🔐 **Simple Authentication** - API key-based auth with secure storage
- 🔍 **Auto-Discovery** - Automatically discovers project, context, and agent role
- 📋 **Task Management** - Claim, update, and complete tasks with ease
- 👥 **Team Coordination** - View team status and agent activities
- ⏱️ **Keep-in-Touch** - Automated check-in system for quality assurance
- 🎨 **Beautiful UI** - Colorful, intuitive terminal interface
- 📚 **Context Aware** - Automatically loads project documentation and specs
- 🚀 **High Performance** - WebSocket-based real-time communication

## 📖 Commands

### Authentication

```bash
brain auth login              # Authenticate with API key
brain auth logout             # Logout and clear credentials
brain auth status             # Check authentication status
```

### Connection

```bash
brain connect                 # Connect and discover environment
brain connect --project /path # Connect from specific directory
```

### Task Management

```bash
brain task list               # List all available tasks
brain task list --ready       # Show only ready tasks (no blockers)
brain task list --priority P0 # Filter by priority
brain task claim T020         # Claim a task
brain task update T020 75%    # Update task progress
brain task complete T020      # Complete a task
```

### Configuration

```bash
brain config show             # Show current configuration
brain config set key value   # Set configuration value
brain config get key         # Get specific config value
brain config reset           # Reset to defaults
```

### Agent & Team

```bash
brain agent status           # View your agent status
brain agent status B         # View another agent's status
brain agent checkin "msg"    # Send keep-in-touch check-in
brain team                   # View team dashboard
```

### Project Management

```bash
brain project list           # List all projects
brain project switch NAME    # Switch to different project
```

### Context Management

```bash
brain context list           # List context files
brain context search "auth"  # Search context
brain context sync           # Sync local changes
```

## 🔧 Configuration

Configuration is stored in `~/.brain/config.json` and can be managed via:

- CLI commands (`brain config set`)
- Environment variables (takes precedence)
- Direct file editing

### Environment Variables

```bash
export BRAIN_API_KEY="brain_xxxxxxxxxxxxxx"  # API key
export BRAIN_SERVER_URL="ws://localhost:3000" # MCP server URL
export BRAIN_TRACKING_ID="uuid"              # Agent tracking ID
```

### Configuration Options

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `apiKey` | string | - | Authentication API key |
| `trackingId` | string | - | Unique agent tracking ID |
| `serverUrl` | string | ws://localhost:3000 | MCP server URL |
| `checkinInterval` | number | 30 | Check-in interval in minutes |
| `autoContextSync` | boolean | true | Auto-sync context files |
| `theme` | string | dark | CLI theme (dark/light) |
| `notificationLevel` | string | normal | Notification verbosity |

## 🎯 Workflow Examples

### Starting Your Day

```bash
# 1. Connect to Central Intelligence
brain connect

# 2. View available tasks
brain task list --ready

# 3. Claim highest priority task
brain task claim T020

# 4. Work on the task...

# 5. Check in periodically (every 30 min)
brain agent checkin "Implemented JWT auth, writing tests"

# 6. Update progress
brain task update T020 75% --files "auth.ts,auth.test.ts"

# 7. Complete when done
brain task complete T020
```

### Multi-Project Work

```bash
# List all your projects
brain project list

# Switch to different project
brain project switch AudioAnalyzer

# Connect to load new context
brain connect

# Work on tasks in new project
brain task list
```

### Team Collaboration

```bash
# View team dashboard
brain team

# Check another agent's status
brain agent status B

# View all agents
brain agent list
```

## 🏗️ Architecture

The Brain CLI connects to the Central Intelligence MCP server via WebSocket, providing:

1. **Discovery Engine** - Automatic environment detection
2. **Task Registry** - SQLite-backed task management
3. **Agent Recognition** - Persistent agent identity across sessions
4. **Context Extraction** - Intelligent file categorization
5. **Job Proposals** - AI-powered task recommendations

## 🐛 Troubleshooting

### Can't connect?

```bash
# Check authentication
brain auth status

# Verify server is running
brain ping

# Check configuration
brain config show
```

### Task completion blocked?

```bash
# Check keep-in-touch status
brain agent status

# Send check-in if needed
brain agent checkin "Ready to complete"
```

### Context not loading?

```bash
# List current context
brain context list

# Force sync
brain context sync
```

## 📚 Documentation

- [Quick Reference Guide](../../04_AGENT_FRAMEWORK/CENTRAL_INTELLIGENCE_QUICK_REFERENCE.md)
- [MCP System Architecture](../../04_AGENT_FRAMEWORK/MCP_SYSTEM_ARCHITECTURE.md)
- [Task Registry](../../04_AGENT_FRAMEWORK/CENTRAL_TASK_REGISTRY.md)

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines and submit PRs.

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details.

## 🙏 Credits

Built with love by **Agent A (UI Specialist)** as part of the LocalBrain Central Intelligence System.

Special thanks to the team:
- Agent B (Design Specialist)
- Agent C (Backend Specialist)
- Agent D (Integration Specialist)
- Agent E (Supervisor)
- Agent F (Strategic)

---

**Remember**: Brain is as simple as Doppler - one command connects you, identifies your role, loads your context, and gets you working!