# LocalBrain Swift → Electron Integration Plan

## Architecture Mapping

### Swift → TypeScript Component Mapping

```
SWIFT (LocalBrain/)              →  TYPESCRIPT (localbrain-electron/renderer/)
═══════════════════════════════════════════════════════════════════════════

📱 VIEWS
────────────────────────────────────────────────────────────────────────────
OrchestraMVPView.swift           →  app/page.tsx (✅ DONE)
  ├─ headerComponent             →  components/Header.tsx (✅ DONE)
  ├─ sidebarComponent            →  components/Sidebar.tsx (✅ DONE)
  ├─ centralCanvas               →  components/DraggableGridCanvas.tsx (✅ DONE)
  └─ footerComponent             →  components/Footer.tsx (✅ DONE)

MessageBubble.swift              →  components/MessageBubble.tsx (✅ DONE)
VoiceOrb.swift                   →  components/VoiceCanvas.tsx (✅ DONE)
WorkflowGalleryView.swift        →  components/WorkflowGallery.tsx (⏳ TODO)
WorkflowInputSheet.swift         →  components/WorkflowInput.tsx (⏳ TODO)
TerminalWidgetView.swift         →  components/TerminalWidget.tsx (⏳ TODO)
TaskManagerWidgetView.swift      →  components/TaskWidget.tsx (⏳ TODO)

📊 MODELS
────────────────────────────────────────────────────────────────────────────
AppModel.swift                   →  contexts/AppContext.tsx (⏳ TODO)
  ├─ messages: [Message]         →  useState<Message[]>
  ├─ contextPool: [Context]      →  useState<ContextItem[]>
  ├─ isStreaming: Bool           →  useState<boolean>
  └─ settings: Settings          →  useState<Settings>

Message.swift                    →  types/Message.ts (⏳ TODO)
ContextSegment.swift             →  types/Context.ts (⏳ TODO)

🔧 SERVICES
────────────────────────────────────────────────────────────────────────────
LLMServiceProtocol.swift         →  services/LLMService.ts (⏳ TODO)
ClaudeService.swift              →  services/ClaudeService.ts (⏳ TODO)
OpenAIService.swift              →  services/OpenAIService.ts (⏳ TODO)
GeminiService.swift              →  services/GeminiService.ts (⏳ TODO)
AIProviderManager.swift          →  services/AIProviderManager.ts (⏳ TODO)
WorkflowSystem.swift             →  services/WorkflowSystem.ts (⏳ TODO)
AppEventBus.swift                →  services/EventBus.ts (⏳ TODO)
KeychainService.swift            →  main/keychain.ts (Electron IPC) (⏳ TODO)

🎨 THEME
────────────────────────────────────────────────────────────────────────────
OKLCH.swift                      →  app/globals.css (✅ DONE)
  └─ Color extensions            →  CSS variables (--bg1, --tx1, etc.)
```

## Integration Strategy

### Phase 1: State Management (CURRENT)
**Goal:** Connect TypeScript frontend to Swift backend services via Electron IPC

**Files to Create:**
```
renderer/
├── contexts/
│   └── AppContext.tsx          # Global state management
├── types/
│   ├── Message.ts              # Message interface
│   ├── Context.ts              # Context interface
│   └── Settings.ts             # Settings interface
├── services/
│   ├── ipc.ts                  # Electron IPC wrapper
│   └── ai/
│       ├── LLMService.ts       # Protocol interface
│       ├── ClaudeService.ts    # Anthropic integration
│       ├── OpenAIService.ts    # OpenAI integration
│       └── GeminiService.ts    # Google integration
└── hooks/
    ├── useMessages.ts          # Message state + IPC
    ├── useContext.ts           # Context state + IPC
    └── useAI.ts                # AI provider state + IPC

main/
├── ipc/
│   ├── ai-handlers.ts          # AI service IPC handlers
│   ├── context-handlers.ts     # Context IPC handlers
│   └── settings-handlers.ts    # Settings IPC handlers
└── services/
    └── swift-bridge.ts         # Bridge to Swift services
```

### Phase 2: Service Integration
**Goal:** Wire up real AI services from Swift backend

**Electron IPC Channels:**
```typescript
// AI Services
'ai:send-message' → ClaudeService.sendMessage()
'ai:stream-response' → OpenAIService.streamCompletion()
'ai:switch-provider' → AIProviderManager.switchProvider()

// Context Management
'context:add-file' → ContextManager.addFile()
'context:remove-file' → ContextManager.removeFile()
'context:get-pool' → ContextManager.getPool()

// Settings
'settings:get' → KeychainService.getValue()
'settings:set' → KeychainService.setValue()

// Workflows
'workflow:execute' → WorkflowSystem.execute()
'workflow:get-all' → WorkflowSystem.getAllWorkflows()
```

### Phase 3: Widget System
**Goal:** Port Swift widget system to TypeScript

**New Widgets:**
```
components/widgets/
├── TerminalWidget.tsx          # From TerminalWidgetView.swift
├── TaskWidget.tsx              # From TaskManagerWidgetView.swift
├── WorkflowWidget.tsx          # New - Workflow execution
└── SettingsWidget.tsx          # From UnifiedSettingsView.swift
```

### Phase 4: Advanced Features
**Goal:** Complete feature parity with Swift app

- Voice input/output (WebRTC + Whisper API)
- Keyboard shortcuts (⌘K, ⌘B, etc.)
- Real-time system metrics
- Multi-window support
- Workflow gallery and execution

## Current Status

### ✅ Completed (Phase 0: UI Prototype)
- [x] OrchestraMVPView → page.tsx (exact copy)
- [x] Header component with search
- [x] Sidebar with widget list
- [x] Draggable grid canvas with living widgets
- [x] Footer with system metrics
- [x] OKLCH theme system
- [x] Message bubble component
- [x] Voice orb component
- [x] Context canvas
- [x] Metrics canvas
- [x] CMD+Click+Drag line cutting
- [x] Right-click context menu
- [x] Responsive widget content

### ⏳ Next Steps (Phase 1: Integration)
1. Create type definitions (Message, Context, Settings)
2. Setup AppContext for global state
3. Implement IPC bridge to Swift services
4. Wire up real AI services (Claude, OpenAI, Gemini)
5. Connect context management
6. Hook up settings/keychain

### 🎯 Priority Order
1. **AppContext + Types** (Foundation)
2. **IPC Bridge** (Communication layer)
3. **AI Services** (Core functionality)
4. **Context Management** (File handling)
5. **Workflows** (Advanced features)
6. **Voice/Audio** (Real-time features)

## Technical Decisions

### Why Electron + TypeScript?
- **Hot reload** for rapid UI iteration (Turbopack <100ms)
- **Web technologies** for UI flexibility
- **Swift backend** for native performance + AI services
- **Best of both worlds** - Fast UI dev + Native power

### Communication Pattern
```
TypeScript UI (Renderer)
    ↓ IPC (Electron)
Main Process (Node.js)
    ↓ Child Process / FFI
Swift Services (Native)
    ↓ AI APIs
Claude, OpenAI, Gemini
```

### State Management Strategy
- **React Context** for global state (AppContext)
- **Custom hooks** for service integration (useMessages, useAI)
- **IPC events** for Swift ↔ TypeScript sync
- **Local state** for UI-only concerns

## File Naming Convention

```
Swift: PascalCase.swift         →  TypeScript: PascalCase.tsx
Swift: camelCaseVar             →  TypeScript: camelCaseVar
Swift: SCREAMING_SNAKE          →  TypeScript: SCREAMING_SNAKE
```

## Next Session Goals

**IMMEDIATE (Today):**
1. Create type definitions (`types/`)
2. Setup AppContext (`contexts/AppContext.tsx`)
3. Create IPC bridge skeleton (`services/ipc.ts`)

**SHORT-TERM (This Week):**
4. Implement AI service wrappers
5. Connect message sending/receiving
6. Wire up context management

**MEDIUM-TERM (Next Week):**
7. Complete widget system
8. Add workflow execution
9. Implement voice features

---

**Current Branch:** `release/v2.0`
**Electron App:** `localbrain-electron/`
**Swift App:** `LocalBrain/`
**Integration Status:** Phase 1 Starting 🚀
