# Data Pool Architecture Specification

## Version: 1.0.0
**Author:** Trinity Intelligence Team
**Date:** 2025-10-04
**Status:** Foundation Spec

---

## 🎯 Vision Statement

**The Data Pool is the single source of truth for all context in LocalBrain.**
All modules—orchestrator, memory, UI, voice, file explorer—drink from the same soup.

**Analogy:** Like a living organism's bloodstream, the Data Pool circulates context nutrients to all organs (services).

---

## 🏗️ Core Principles

### 1. **Single Source of Truth**
- All context lives in ONE place
- No duplicate context storage across services
- Immutable append-only log for auditability

### 2. **Universal Access Pattern**
- All services READ from the pool
- All services WRITE to the pool
- Pool mediates all context flow

### 3. **Intelligent Filtering**
- Pool doesn't dump everything to every consumer
- Smart context selection based on:
  - Token budget
  - Relevance scoring
  - Task intent
  - Model capabilities

### 4. **Observable & Testable**
- Every pool operation emits telemetry
- Spec-driven validation
- Clear success metrics

---

## 📊 Data Pool Components

### **Pool Contents (The Soup)**

```typescript
interface DataPool {
  // Conversation History
  sessionLog: TurnEntry[]           // All conversation turns

  // File Context (Drawer)
  contextFiles: ContextFile[]       // User-added files

  // Memory Snippets
  memoryHits: MemorySnippet[]       // Vector DB results

  // Project State
  projectState?: ProjectState       // Current project context

  // System State
  systemState: SystemState          // User prefs, settings

  // Metadata
  poolMetadata: PoolMetadata        // Size, tokens, timestamp
}
```

### **Entry Types**

#### TurnEntry
```typescript
interface TurnEntry {
  id: string                        // Unique turn ID
  timestamp: Date                   // When turn occurred
  role: 'user' | 'assistant' | 'system'
  content: string                   // Turn content
  model?: string                    // Which model generated (if assistant)
  tokens: number                    // Token count
  metadata: {
    intent?: string                 // Classified intent
    confidence?: number             // Intent confidence
    tags?: string[]                 // User-added tags
  }
}
```

#### ContextFile
```typescript
interface ContextFile {
  id: string                        // Unique file ID
  path: string                      // File path
  name: string                      // Display name
  content: string                   // File contents
  contentType: string               // mime type
  addedAt: Date                     // When added to drawer
  tokens: number                    // Estimated tokens
  language?: string                 // Programming language
  summary?: string                  // AI-generated summary
  embeddings?: number[]             // Vector embeddings
  metadata: {
    size: number                    // File size bytes
    lastModified: Date
    isPinned: boolean               // User pinned important file
  }
}
```

#### MemorySnippet
```typescript
interface MemorySnippet {
  id: string
  text: string                      // Snippet content
  source: string                    // Where it came from
  timestamp: Date                   // When created
  relevanceScore: number            // Similarity to current query
  tokens: number
  metadata: {
    project?: string
    tags?: string[]
    path?: string
  }
}
```

#### ProjectState
```typescript
interface ProjectState {
  name: string                      // Project name
  rootPath: string                  // Project root directory
  language: string                  // Primary language
  framework?: string                // Framework (React, Next.js, etc.)
  description?: string              // Project description
  goals?: string[]                  // Project goals
  constraints?: string[]            // Known constraints
  recentChanges?: string[]          // Recent modifications
}
```

---

## 🔄 Pool Operations

### **Write Operations**

#### `pool.addTurn(turn: TurnEntry)`
- Appends conversation turn
- Updates metadata (total tokens, turn count)
- Emits: `pool.write` event
- Auto-trims if exceeds max size (keep recent + important)

#### `pool.addContextFile(file: ContextFile)`
- Adds file to drawer context
- Generates summary if large (>1000 tokens)
- Generates embeddings for semantic search
- Emits: `drawer.add` event

#### `pool.addMemoryHits(snippets: MemorySnippet[])`
- Caches recent memory query results
- Deduplicates based on content hash
- Emits: `memory.cached` event

#### `pool.updateProjectState(state: ProjectState)`
- Updates current project context
- Emits: `project.updated` event

---

### **Read Operations**

#### `pool.snapshot(): DataPoolSnapshot`
- Returns immutable snapshot of entire pool
- Used for debugging, UI display
- Emits: `pool.read` event

#### `pool.selectContext(params: ContextSelector): ContextBundle`
**This is the INTELLIGENT operation!**

**Input:**
```typescript
interface ContextSelector {
  intent: UserIntent              // What user wants
  tokenBudget: number             // Max tokens for this call
  targetAPI: APIType              // realtime | completion | batch
  priorityHints?: string[]        // Specific files/topics to prioritize
}
```

**Output:**
```typescript
interface ContextBundle {
  turns: TurnEntry[]              // Selected conversation turns
  files: ContextFile[]            // Selected drawer files
  memory: MemorySnippet[]         // Selected memory hits
  project?: ProjectState          // Project context if relevant

  metadata: {
    totalTokens: number           // Actual token usage
    budgetUtilization: number     // % of budget used
    selectionStrategy: string     // How selection was made
  }
}
```

**Selection Algorithm:**
1. **Reserve system tokens** (200 tokens for system prompt)
2. **Prioritize recent turns** (last 5-10 turns, ~500 tokens)
3. **Score files by relevance** (semantic similarity to intent)
4. **Add top files** until budget 50% consumed
5. **Add memory hits** (semantic search, top 3-5 hits)
6. **Add project state** if relevant and budget remains
7. **Return bundle + metadata**

---

## 🎯 Success Criteria

### **Functional Requirements**

✅ **FR-1:** Pool stores all conversation turns
✅ **FR-2:** Pool stores all drawer files with metadata
✅ **FR-3:** Pool maintains memory cache
✅ **FR-4:** Context selection stays within token budget
✅ **FR-5:** All pool operations are observable (events)

### **Performance Requirements**

✅ **PR-1:** Context selection completes in <100ms
✅ **PR-2:** Pool handles 1000+ turns without degradation
✅ **PR-3:** File addition with embedding generation <500ms
✅ **PR-4:** Pool memory footprint <100MB for typical session

### **Quality Requirements**

✅ **QR-1:** Context relevance score >0.7 for selected items
✅ **QR-2:** Token budget accuracy ±5%
✅ **QR-3:** Zero data loss (append-only with persistence)
✅ **QR-4:** All operations emit telemetry

---

## 🔗 Integration Points

### **CentralIntelligence**
```swift
// Before
let snapshot = context.snapshot()
let enhanced = PromptBuilder.build(userText, memory, snapshot)

// After
let contextBundle = await DataPoolService.shared.selectContext(
    intent: classifyIntent(input.text),
    tokenBudget: 8000,
    targetAPI: .completion
)
let enhanced = PromptBuilder.build(userText, contextBundle)
```

### **File Drawer UI**
```swift
func onFileDropped(_ url: URL) async {
    let file = await processFile(url)
    await DataPoolService.shared.addContextFile(file)
    // File automatically available to ALL models
}
```

### **Realtime Voice**
```swift
func onConversationStart() async {
    let context = await DataPoolService.shared.selectContext(
        intent: .conversational,
        tokenBudget: 4000,
        targetAPI: .realtime
    )
    session.sendContext(context)
}
```

---

## 📋 Validation Tests

### **Test 1: Basic Write/Read**
```swift
// Add turn
await pool.addTurn(TurnEntry(role: "user", content: "Hello"))

// Snapshot should contain turn
let snapshot = await pool.snapshot()
XCTAssertEqual(snapshot.sessionLog.count, 1)
```

### **Test 2: Token Budget Enforcement**
```swift
// Add 100 files (50k tokens total)
for i in 1...100 {
    await pool.addContextFile(ContextFile(
        content: String(repeating: "x", count: 500),
        tokens: 500
    ))
}

// Request context with 2000 token budget
let bundle = await pool.selectContext(
    intent: .fileAnalysis,
    tokenBudget: 2000,
    targetAPI: .completion
)

// Should return <2000 tokens
XCTAssertLessThanOrEqual(bundle.metadata.totalTokens, 2000)
```

### **Test 3: Relevance Scoring**
```swift
// Add files with different relevance
await pool.addContextFile(ContextFile(
    path: "backend.py",
    content: "def api_endpoint(): ..."
))
await pool.addContextFile(ContextFile(
    path: "frontend.tsx",
    content: "export default function Page() ..."
))

// Query for backend task
let bundle = await pool.selectContext(
    intent: UserIntent(text: "fix the API bug"),
    tokenBudget: 5000,
    targetAPI: .completion
)

// backend.py should rank higher
XCTAssertEqual(bundle.files.first?.path, "backend.py")
```

---

## 🚀 Implementation Roadmap

### **Phase 1: Foundation** (Week 1)
- [ ] Create `DataPoolService.swift` actor
- [ ] Implement basic write operations
- [ ] Implement snapshot read
- [ ] Add telemetry events
- [ ] Write unit tests

### **Phase 2: Intelligent Selection** (Week 2)
- [ ] Implement `selectContext()` algorithm
- [ ] Add relevance scoring (keyword-based first)
- [ ] Add token counting/budgeting
- [ ] Write selection tests
- [ ] Validate with real API calls

### **Phase 3: Optimization** (Week 3)
- [ ] Add embeddings for semantic search
- [ ] Implement caching for repeated queries
- [ ] Optimize for <100ms selection time
- [ ] Add compression for large files
- [ ] Performance benchmarks

### **Phase 4: Integration** (Week 4)
- [ ] Wire CentralIntelligence
- [ ] Wire File Drawer UI
- [ ] Wire Realtime Voice
- [ ] Wire all LLM services
- [ ] End-to-end validation

---

## 📊 Observable Events

All Data Pool operations emit telemetry:

```typescript
// Write events
"pool.write"           { type: "turn" | "file" | "memory" }
"drawer.add"           { path: string, tokens: number }
"drawer.remove"        { path: string }
"project.updated"      { name: string }

// Read events
"pool.read"            { operation: "snapshot" | "select" }
"context.selected"     {
  tokens: number,
  budgetUsed: number,
  filesSelected: number,
  turnsSelected: number
}

// Metrics
"pool.size"            { turns: number, files: number, totalTokens: number }
"selection.time"       { durationMs: number }
```

---

## 🎯 Success Metrics (Measurable)

**After implementation, we validate:**

1. ✅ **LB-DATA-POOL-011 spec passes** (orchestrator writes, memory reads)
2. ✅ **Token budget never exceeded** in production logs
3. ✅ **Context selection <100ms** in 95th percentile
4. ✅ **Drawer files appear in AI responses** (user-reported)
5. ✅ **Multi-model consistency** (models reference same files)

---

## 🔮 Future Enhancements

- **Semantic Clustering:** Group related turns/files automatically
- **Auto-Summarization:** Condense old context to preserve tokens
- **Priority Decay:** Lower priority for older content
- **User Annotations:** Let user mark "important" context
- **Cross-Session Persistence:** Save pool to disk, restore on launch

---

**This is the foundation. Everything else builds on the Pool.** 🌊
