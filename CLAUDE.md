# 🚀 Streamlined Agent System - Active Configuration

This CLAUDE.md file activates a focused agent system with 10 essential agents for efficient development assistance.

## 🤖 System Status: ACTIVE

All agents are loaded from `.claude/agents/` and ready to help.

### Core Foundation Agents (Always Active)
- **health-monitor** - System health tracking (checks hourly)
- **task-router** - Intelligent request routing  
- **quality-gate** - Quality standards enforcement

### Execution Agents (Task-Activated)
- **quick-task** - Simple operations handler
- **team-lead** - Multi-agent coordinator
- **wave-orchestrator** - Complex workflow manager

### Essential Specialist Agents
- **code-expert** - Development and debugging
- **git-workflow-assistant** - Streamlines git operations and prevents mistakes
- **error-stack-translator** - Makes cryptic errors actionable
- **mock-hunter** - Finds and eliminates mock implementations and stubs

### LocalBrain Specialist Agents (NEW)
- **localbrain-expert** - Tauri 2 + voice/terminal integration specialist
- **performance-guardian** - Memory, latency, and resource optimization
- **security-compliance** - Enterprise security and audit enforcement

### Learning Agent
- **pattern-learner** - Success pattern recognition and system improvement

## 📊 System Status

```
Active Agents: 13 ✅
├── Core: 3 agents
├── Execution: 3 agents  
├── Specialists: 7 agents (4 original + 3 LocalBrain)
└── Learning: 1 agent

System: Enhanced for LocalBrain 🚀
Performance: Optimized 🟢
```

## 🎯 How It Works

The system automatically:
1. **Analyzes** every request for complexity and domain
2. **Routes** to the optimal agent or team
3. **Monitors** execution quality and performance
4. **Learns** from successful patterns
5. **Evolves** to improve over time

### Complexity-Based Routing
- **Simple tasks** (< 0.3 complexity) → quick-task
- **Moderate tasks** (0.3-0.7) → team-lead + specialists
- **Complex tasks** (> 0.7) → wave-orchestrator

### Proactive Behaviors
- Health checks run hourly for efficiency
- Quality gates validate all operations
- Pattern learning happens continuously

## 💡 Usage Tips

### Natural Language Works Best
Just describe what you need naturally:
- "Format this function" → quick-task handles it
- "Fix this bug" → code-expert analyzes and fixes
- "Refactor the auth system" → wave-orchestrator manages full process
- "My app looks complete but nothing works" → mock-hunter scans for mocks
- "This error makes no sense" → error-stack-translator explains it
- "Help with git" → git-workflow-assistant guides you

### LocalBrain-Specific Requests
- "Debug voice latency" → localbrain-expert + performance-guardian
- "Implement plugin sandboxing" → security-compliance
- "Fix terminal PTY issues" → localbrain-expert
- "Optimize memory usage" → performance-guardian
- "Audit security compliance" → security-compliance
- "Add Tauri command" → localbrain-expert

### Manual Control Available
```bash
# Force specific agent
/agents code-expert "review this code"

# Hunt for mocks
/agents mock-hunter "scan entire app"
python .claude/agents/specialists/mock-hunter.py quick
```

### Special Agent: Mock Hunter 🔍
The Mock Hunter is particularly useful when:
- Your UI looks complete but functionality doesn't work
- You need to find all TODOs, FIXMEs, and placeholder code
- You want to verify that all features are actually implemented
- You're preparing for production and need to eliminate all mocks

Run a quick scan: `python .claude/agents/specialists/mock-hunter.py`

## 📈 Why This Configuration?

**Focused & Fast**: 10 agents vs 25+ means:
- Faster routing decisions
- Less overhead and complexity
- Clearer agent responsibilities
- Better overall performance

**Essential Coverage**: These agents handle 90% of development tasks:
- Code writing and debugging (code-expert)
- Git operations (git-workflow-assistant)
- Error understanding (error-stack-translator)
- Mock detection (mock-hunter)
- Task coordination (execution agents)
- Continuous improvement (pattern-learner)

## 🔧 Troubleshooting

If agents aren't responding:
1. Check if in `.claude/agents/` directory
2. Verify CLAUDE.md is in project root
3. Look for health warnings
4. Try manual invocation

## 📚 Learn More

- Architecture: `/optimal-agent-system/AGENT_SYSTEM_ARCHITECTURE.md`
- Visual Guide: `/optimal-agent-system/optimal-agent-system-visualization.html`
- Test Suite: `/optimal-agent-system/TEST_PROACTIVE_AGENTS.md`

---

**System Ready** - The Optimal Agent System is monitoring and ready to assist!

# 🧠 LocalBrain Enterprise — AI-Powered Local Environment Command-Centre

LocalBrain is a privacy-first macOS desktop application that gives power-users voice, chat and graphical control over their computer. It blends secure file operations, a multi-tab terminal, AI orchestration and rich visual tooling inside an ultra-light Tauri 2 shell. Everything runs locally by default; cloud AI services are opt-in and strictly scoped.

## 📋 Project Overview

| Capability | Highlights |
|------------|------------|
| **Voice / Chat Interface** | Always-listening wake-word ("Hey Brain"), streaming STT with OpenAI Whisper API or on-device whisper.cpp fallback; replies spoken by OpenAI TTS or local Piper TTS. |
| **AI Orchestration** | Unified capability layer routes prompts to OpenAI gpt-4o or Ollama local models. Offline mode blocks all network AI calls. |
| **Terminal Integration** | Multi-tab xterm.js front-end bridged to a secure Rust PTY (tokio-pty-process). Command output can be streamed into the LLM for context-aware reasoning. |
| **File Management** | Explorer with read, diff-preview write, Git-status colouring and scoped access to user-granted roots only. |
| **Knowledge & Tooling UIs** | Context-manager for prompt libraries, Agents-canvas for visual orchestration, Toolkit library and Knowledge-base browser. |
| **Extensibility** | Hot-load plugins written as Rust dylibs or WebAssembly modules, each sandboxed by permission ACL (fs, process, network, tts …). |
| **Enterprise-grade Security** | Encrypted sqlcipher settings, audit log, SSO via OIDC, optional Sentry crash capture (PII scrubbed, opt-in). |

## 🛠️ Technical Stack (Locked)

| Layer | Technology |
|-------|------------|
| **Desktop shell** | Tauri 2 (Rust 1.78, WKWebView) |
| **UI** | React 18 · Vite 5 · TypeScript 5 · TailwindCSS 3 (dark theme) |
| **State / Settings** | sqlcipher via @tauri-apps/plugin-sqlite, validated with Zod |
| **Editor** | Monaco Editor 0.51 |
| **Terminal** | xterm.js 5 ↔ Rust PTY (tokio-pty-process 0.5+) |
| **Package Manager** | pnpm workspaces 8 |
| **STT providers** | ① OpenAI Whisper API ② whisper.cpp (local) |
| **TTS providers** | ① OpenAI TTS API (voice "alloy") ② Piper TTS |
| **LLM providers** | ① OpenAI gpt-4o ② Ollama (llama3-8b-instr) |
| **Auth / SSO** | Tauri OIDC plugin (Auth0 / Okta compatible) |
| **Plugin runtime** | Rust dylibs or WASM (wasmtime) |
| **Build artefact** | Signed & notarised universal DMG ≤ 50 MB, auto-update via GitHub Releases |

## 🚀 Key Features

| # | Feature | What you get |
|---|---------|--------------|
| 1 | **Dual Conversation Modes** | Chain (push-to-talk) and Realtime (full-duplex streaming with barge-in). |
| 2 | **4-Pane IDE Layout** | Chat/Voice · Terminal · Preview/Editor · File Explorer — resizable, detachable. |
| 3 | **Context Manager** | Save/load prompt packs; bootstrap agents on launch. |
| 4 | **Agents Canvas** | Visual graph of active agents; click a node to edit its config in Monaco. |
| 5 | **Toolkit Library** | Card gallery of available CLI tools, APIs and scripts with metadata; LLM aware. |
| 6 | **Knowledge Base Browser** | Navigate datasets, vector stores and media assets; one-click embed into context. |
| 7 | **Offline Mode Toggle** | Instantly reroute STT/TTS/LLM to local providers; network blocked and UI indicator lights amber. |
| 8 | **Audit & Compliance** | Immutable action log, AES-256 at rest, no telemetry by default, GDPR/CCPA ready. |
| 9 | **Hot-Reload Plugins** | Drop a signed plugin into /plugins; manifest-declared permissions enforced at runtime. |
| 10 | **Enterprise SSO & Policy** | Login with corporate IdP; central admin can pre-configure allowed roots, disable cloud calls, enforce audit retention. |

## 📦 Repository Structure

```bash
localbrain/
├── .env.example
├── pnpm-workspace.yaml
├── package.json
├── LICENSE
├── apps/
│   └── desktop/
│       ├── src-tauri/           # Rust backend
│       └── src/                 # React front-end
├── packages/
│   ├── core/                    # Capability providers, shared utils
│   ├── ui/                      # Atomic React components
│   └── types/                   # Global TS types
├── plugins/                     # Sample sandboxed plugins
├── tests/                       # Jest + Playwright + Rust integration tests
├── scripts/                     # dev-postinstall, codesign, apply.sh
└── docs/                        # ADRs, architecture diagrams, user guides
```

## 🔧 Development Commands

```bash
# 1 — Install dependencies
pnpm install                # installs Node + Rust crates via cargo as needed

# 2 — Run in developer mode (hot-reload both sides)
pnpm --filter=desktop dev   # starts Vite + Tauri

# 3 — Lint, static analysis, security scanning
pnpm lint && cargo clippy -- -D warnings
cargo audit && cargo deny check licenses
npm audit

# 4 — Test suites
pnpm test            # unit + integration (Jest)
pnpm coverage        # generates lcov & uploads if CODECOV_TOKEN present
pnpm test:e2e        # Playwright E2E flows

# 5 — Create signed, notarised DMG (macOS 12+)
pnpm --filter=desktop build:mac
```

## 🤖 Streamlined Agent System (v0.3)

The Enhanced Agent System now includes 13 specialized agents optimized for LocalBrain's unique architecture:

- Voice / Chat requests are routed through **task-router** with LocalBrain domain awareness
- Agents can invoke `Capability.runCommand`, `Capability.readFile` etc. subject to allowed roots and audit logging
- All agent executions inherit offline-mode policy automatically
- New LocalBrain specialists handle voice, performance, and security requirements

### Agent Response Modes
Agents can respond through multiple channels:
- **text**: Standard chat response
- **voice**: TTS spoken response using OpenAI or Piper
- **terminal**: Execute and show in terminal pane
- **visual**: Display in preview/editor pane
- **notification**: Desktop notification for alerts

### Context-Aware Activation
Agents understand LocalBrain's current state:
- **offline_mode**: Routes to local-only providers
- **voice_active**: Prioritizes voice-capable responses
- **terminal_focus**: Enhances terminal-related features
- **plugin_dev**: Activates plugin development assistance

## 🎯 How It Works (End-to-End)

1. Wake word detected ➜ voice.stt transcribes locally or via cloud.
2. Prompt compiled ➜ llm.ask() chooses cloud or Ollama backend.
3. Result streamed to chat pane and, if "speak" enabled, to voice.tts.
4. If LLM response contains an `action:` block, the command is validated by the sandbox and executed via Rust Command, with output returned to the chat.
5. Audit log records the entire chain for compliance.

## ✨ What's New vs. Previous Draft

| Old spec (Electron) | New spec (Tauri 2) |
|--------------------|--------------------|
| Electron 28, node-pty | Tauri 2, Rust PTY (tokio-pty-process) |
| Cloud-only Whisper/TTS | Local fallbacks: whisper.cpp & Piper |
| Allowed-roots JSON | Encrypted sqlcipher settings |
| No SSO | OIDC SSO & policy packs |
| Unsigned DMG 150 MB | Signed DMG ≤ 50 MB with auto-update |
| Plugin full Node context | Sandbox ACL per plugin, WASM option |

## ⚙️ Usage Tips (unchanged)

Natural language still works best. Agent commands (`/agents code-expert ...`) and manual plugin invocations are identical; they now benefit from stricter sandboxing and offline guarantees.

## 🛡️ Security & Privacy Quick Facts

- **Default offline** — first-run wizard asks before enabling any cloud AI.
- **Zero telemetry** unless user opts into crash reporting.
- **File access** is restricted to user-approved directories and enforced in Rust.
- **Audit log** is append-only, time-stamped, and encrypt-at-rest.

## 📚 Further Reading

- **ARCHITECTURE.md** — deep dive into the provider pattern, IPC schema and plugin sandbox.
- **ADR-001 "Why Tauri 2"** — decision record for the framework migration.
- **TEST_PLAN.md** — full description of unit, integration and E2E suites.
- **OPTIMAL_AGENT_SYSTEM/…** — unchanged documentation for multi-agent workflows.