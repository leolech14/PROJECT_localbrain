# 🧠 LocalBrain Enterprise — AI-Powered Local Environment Command-Centre

LocalBrain is a privacy-first macOS desktop application that gives power-users voice, chat and graphical control over their computer. It blends secure file operations, a multi-tab terminal, AI orchestration and rich visual tooling inside an ultra-light Tauri 2 shell. Everything runs locally by default; cloud AI services are opt-in and strictly scoped.

![LocalBrain Screenshot](docs/images/localbrain-hero.png)

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| **🎤 Voice Interface** | Always-listening wake-word ("Hey Brain"), streaming STT with OpenAI Whisper API or on-device whisper.cpp fallback |
| **🧩 Context-Aware Chat** | Voice transcripts feed into chat and recent terminal output is included for richer responses |
| **🤖 AI Orchestration** | Unified capability layer routes prompts to OpenAI gpt-4o or Ollama local models. Offline mode blocks all network AI calls |
| **💻 Terminal Integration** | Multi-tab xterm.js front-end bridged to a secure Rust PTY (tokio-pty-process) |
| **📁 File Management** | Explorer with read, diff-preview write, Git-status colouring and scoped access to user-granted roots only |
| **🔧 Knowledge & Tooling** | Context-manager for prompt libraries, Agents-canvas for visual orchestration, Toolkit library and Knowledge-base browser |
| **🔌 Extensibility** | Hot-load plugins written as Rust dylibs or WebAssembly modules, each sandboxed by permission ACL |
| **🔒 Enterprise Security** | Encrypted sqlcipher settings, audit log, SSO via OIDC, optional Sentry crash capture (PII scrubbed, opt-in) |

## 🏗️ Technical Stack

| Layer | Technology |
|-------|------------|
| **Desktop Shell** | Tauri 2 (Rust 1.78, WKWebView) |
| **Frontend** | React 18 · Vite 5 · TypeScript 5 · TailwindCSS 3 (dark theme) |
| **State Management** | Zustand · sqlcipher via @tauri-apps/plugin-sqlite, validated with Zod |
| **Editor** | Monaco Editor 0.51 |
| **Terminal** | xterm.js 5 ↔ Rust PTY (tokio-pty-process 0.5+) |
| **Package Manager** | pnpm workspaces 8 |
| **AI Providers** | ① OpenAI (Whisper, TTS, GPT-4o) ② Local (whisper.cpp, Piper TTS, Ollama) |

## 🚀 Quick Start

### Prerequisites

- macOS 12.0 or later
- Xcode Command Line Tools
- Node.js 18+
- Rust 1.78+

### Automated Setup

```bash
# Clone the repository
git clone https://github.com/your-org/LocalBrain.git
cd LocalBrain

# Run the setup script
./scripts/setup.sh
```

### Manual Setup

```bash
# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
nano .env

# Start development
cd apps/desktop
pnpm tauri dev
```

## 🔧 Development Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm --filter=desktop dev

# Build for production
pnpm --filter=desktop build

# Run tests
pnpm test

# Run linting
pnpm lint

# Security audit
pnpm audit && cargo audit

# Build signed DMG (macOS)
pnpm --filter=desktop build:mac
```

## 📁 Project Structure

```
LocalBrain/
├── apps/
│   └── desktop/           # Main Tauri application
│       ├── src/          # React frontend
│       └── src-tauri/    # Rust backend
├── packages/
│   ├── core/             # Core capabilities & API
│   ├── ui/               # Shared UI components
│   └── types/            # TypeScript type definitions
├── plugins/              # Plugin examples
├── tests/                # Test suites
├── scripts/              # Build & deployment scripts
├── docs/                 # Documentation
└── .claude/              # AI agent configurations
    └── agents/           # Specialized AI agents
```

## 🤖 AI Agent System

LocalBrain includes a sophisticated agent system with 13 specialized agents:

### Core Agents
- **health-monitor** - System health tracking
- **task-router** - Intelligent request routing
- **quality-gate** - Quality standards enforcement

### Execution Agents
- **quick-task** - Simple operations handler
- **team-lead** - Multi-agent coordinator
- **wave-orchestrator** - Complex workflow manager

### Specialist Agents
- **code-expert** - Development and debugging
- **git-workflow-assistant** - Git operations
- **error-stack-translator** - Error interpretation
- **mock-hunter** - Mock detection and removal
- **localbrain-expert** - Tauri 2 + voice/terminal specialist
- **performance-guardian** - Resource optimization
- **security-compliance** - Security enforcement

## 🔒 Security & Privacy

- **Default Offline** - First-run wizard asks before enabling cloud AI
- **Zero Telemetry** - No data collection unless explicitly opted in
- **Sandboxed File Access** - Restricted to user-approved directories
- **Audit Logging** - Immutable, encrypted action logs
- **Plugin Sandboxing** - ACL-based permission system for plugins

## 🔌 Plugin Development

Create plugins in Rust or WebAssembly:

```rust
// plugin.rs
use localbrain_plugin_api::*;

#[plugin_export]
fn process_text(input: String) -> PluginResult<String> {
    Ok(format!("Processed: {}", input))
}
```

## 📊 Testing

```bash
# Unit tests
pnpm test

# Integration tests
pnpm test:integration

# E2E tests with Playwright
pnpm test:e2e

# Rust tests
cd apps/desktop/src-tauri && cargo test

# Coverage report
pnpm test:coverage
```

## 🚢 Deployment

### Development Builds

```bash
pnpm tauri build --debug
```

### Production Builds

```bash
# macOS (signed & notarized)
pnpm tauri build

# With custom signing
APPLE_CERTIFICATE="..." pnpm tauri build
```

### Auto-Updates

LocalBrain supports automatic updates via GitHub Releases:

1. Tag a new version: `git tag v1.0.1`
2. Push tags: `git push --tags`
3. GitHub Actions builds and publishes release
4. App auto-updates on next launch

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `pnpm test`
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Style

- TypeScript: ESLint + Prettier
- Rust: rustfmt + clippy
- Commits: Conventional Commits format

## 📚 Documentation

- [Architecture Overview](docs/ARCHITECTURE.md)
- [API Reference](docs/API.md)
- [Plugin Development Guide](docs/PLUGINS.md)
- [Security Model](docs/SECURITY.md)
- [Agent System Guide](docs/AGENTS.md)

## 🐛 Troubleshooting

### Common Issues

**Build fails with "command not found: cargo-tauri"**
```bash
cargo install tauri-cli --version "^2.0.0-alpha"
```

**Voice features not working**
- Check microphone permissions in System Preferences
- Verify OpenAI API key in .env file
- Try offline mode with local Whisper

**Terminal not launching**
- Verify shell path in settings
- Check file permissions for shell executable

### Getting Help

- [GitHub Issues](https://github.com/your-org/LocalBrain/issues)
- [Discussions](https://github.com/your-org/LocalBrain/discussions)
- [Discord Community](https://discord.gg/localbrain)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Tauri](https://tauri.app/) - Cross-platform desktop framework
- [OpenAI](https://openai.com/) - AI models and APIs
- [Ollama](https://ollama.ai/) - Local AI model runner
- [xterm.js](https://xtermjs.org/) - Terminal emulator
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Code editor

---

**Built with ❤️ for power users who value privacy and control.**
