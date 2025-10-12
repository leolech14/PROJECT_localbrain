# Context Selector Module Specification

## Version: 1.0.0
**Module:** Intelligent Context Selection Engine
**Date:** 2025-10-04
**Status:** Core Module Spec
**Dependencies:** Data Pool Service

---

## 🎯 Purpose

**The Context Selector is the INTELLIGENCE that decides what context to send to each API call.**

**Problem it solves:**
- Can't send entire Data Pool to every API (too many tokens)
- Different tasks need different context
- Different models have different token limits
- User expects AI to "know" relevant context without being told

**Solution:**
Intelligent, token-efficient context selection based on:
- User intent classification
- Semantic relevance scoring
- Token budget constraints
- Task-specific prioritization

---

## 🧠 Core Algorithm

### **Input Parameters**

```typescript
interface ContextSelectionRequest {
  // Required
  intent: UserIntent                // What the user wants to accomplish
  tokenBudget: number               // Maximum tokens for this request
  targetAPI: APIType                // Which API we're calling

  // Optional
  priorityHints?: string[]          // User-specified important files/topics
  excludePatterns?: string[]        // Patterns to exclude
  minRelevance?: number             // Min relevance score (0-1)

  // Advanced
  selectionStrategy?: SelectionStrategy
  customWeights?: SelectionWeights
}
```

```typescript
interface UserIntent {
  text: string                      // Original user query
  classification: IntentType        // Classified intent type
  confidence: number                // Classification confidence
  entities?: ExtractedEntity[]      // Extracted entities (files, functions, etc.)

  metadata: {
    requiresCode?: boolean          // Needs code context
    requiresFiles?: boolean         // Needs file context
    requiresHistory?: boolean       // Needs conversation history
    requiresProject?: boolean       // Needs project state
  }
}

enum IntentType {
  CODE_WRITING = "code_writing",          // Writing new code
  CODE_DEBUGGING = "code_debugging",      // Fixing bugs
  CODE_REFACTORING = "code_refactoring",  // Improving existing code
  FILE_ANALYSIS = "file_analysis",        // Understanding files
  CONVERSATIONAL = "conversational",      // General chat
  PROJECT_PLANNING = "project_planning",  // High-level planning
  DOCUMENTATION = "documentation",        // Writing docs
  COMMAND_EXECUTION = "command_execution" // Running commands
}

enum APIType {
  REALTIME = "realtime",            // OpenAI Realtime (4K context)
  COMPLETION = "completion",        // Standard completion (8K-128K)
  BATCH = "batch",                  // Batch processing (large context)
  STREAMING = "streaming"           // Streaming completion
}
```

---

## 🎯 Selection Algorithm

### **Phase 1: Budget Allocation**

```typescript
function allocateBudget(request: ContextSelectionRequest): BudgetAllocation {
  const { tokenBudget, intent, targetAPI } = request

  // Reserve system tokens (always needed)
  const systemReserve = 200

  // Allocate remaining budget based on intent
  const remaining = tokenBudget - systemReserve

  switch (intent.classification) {
    case IntentType.CODE_WRITING:
      return {
        system: systemReserve,
        recentTurns: remaining * 0.2,      // 20% - minimal history
        files: remaining * 0.6,             // 60% - lots of code context
        memory: remaining * 0.1,            // 10% - relevant snippets
        project: remaining * 0.1            // 10% - project overview
      }

    case IntentType.CONVERSATIONAL:
      return {
        system: systemReserve,
        recentTurns: remaining * 0.6,      // 60% - conversation matters
        files: remaining * 0.1,             // 10% - minimal file context
        memory: remaining * 0.2,            // 20% - remember past
        project: remaining * 0.1            // 10% - project context
      }

    case IntentType.FILE_ANALYSIS:
      return {
        system: systemReserve,
        recentTurns: remaining * 0.15,     // 15% - some history
        files: remaining * 0.7,             // 70% - HEAVY file context
        memory: remaining * 0.1,            // 10% - snippets
        project: remaining * 0.05           // 5% - minimal project
      }

    // ... more intent types
  }
}
```

---

### **Phase 2: Relevance Scoring**

#### **For Conversation Turns**

```typescript
function scoreConversationTurn(
  turn: TurnEntry,
  intent: UserIntent,
  recencyWeight: number = 0.7
): number {
  // Recency: More recent = higher score
  const age = Date.now() - turn.timestamp.getTime()
  const recencyScore = Math.exp(-age / (1000 * 60 * 60)) // Decay over hours

  // Semantic: How related to current query
  const semanticScore = computeSimilarity(turn.content, intent.text)

  // Entity overlap: Mentions same files/functions?
  const entityScore = computeEntityOverlap(turn, intent)

  // Weighted combination
  return (
    recencyScore * recencyWeight +
    semanticScore * 0.2 +
    entityScore * 0.1
  )
}
```

#### **For Context Files**

```typescript
function scoreContextFile(
  file: ContextFile,
  intent: UserIntent
): number {
  let score = 0

  // 1. Direct mention in query?
  if (intent.text.includes(file.name) || intent.text.includes(file.path)) {
    score += 1.0  // Maximum score for direct mention
  }

  // 2. Semantic similarity (if embeddings available)
  if (file.embeddings && intent.embeddings) {
    score += cosineSimilarity(file.embeddings, intent.embeddings) * 0.8
  }

  // 3. File type relevance
  if (intent.metadata.requiresCode && isCodeFile(file)) {
    score += 0.3
  }

  // 4. Pinned by user? (user knows it's important)
  if (file.metadata.isPinned) {
    score += 0.5
  }

  // 5. Recently modified? (likely relevant)
  const daysSinceModified = (Date.now() - file.metadata.lastModified.getTime()) / (1000 * 60 * 60 * 24)
  if (daysSinceModified < 1) {
    score += 0.2
  }

  // 6. Keyword matching (simple but effective)
  const keywords = extractKeywords(intent.text)
  const matchCount = keywords.filter(kw =>
    file.content.toLowerCase().includes(kw.toLowerCase())
  ).length
  score += (matchCount / keywords.length) * 0.4

  return Math.min(score, 2.0) // Cap at 2.0
}
```

#### **For Memory Snippets**

```typescript
function scoreMemorySnippet(
  snippet: MemorySnippet,
  intent: UserIntent
): number {
  // Memory already has relevance score from vector DB
  let score = snippet.relevanceScore

  // Boost recent memories
  const age = Date.now() - snippet.timestamp.getTime()
  const recencyBoost = Math.exp(-age / (1000 * 60 * 60 * 24)) * 0.2
  score += recencyBoost

  // Boost if from same project
  if (snippet.metadata.project && intent.metadata.currentProject) {
    if (snippet.metadata.project === intent.metadata.currentProject) {
      score += 0.3
    }
  }

  return score
}
```

---

### **Phase 3: Selection & Packing**

```typescript
function selectAndPackContext(
  pool: DataPoolSnapshot,
  allocation: BudgetAllocation,
  intent: UserIntent
): ContextBundle {

  const selected: ContextBundle = {
    turns: [],
    files: [],
    memory: [],
    project: null,
    metadata: { totalTokens: 0, budgetUtilization: 0, selectionStrategy: "" }
  }

  // 1. ALWAYS include system prompt
  let usedTokens = allocation.system

  // 2. Select conversation turns
  const scoredTurns = pool.sessionLog
    .map(turn => ({
      turn,
      score: scoreConversationTurn(turn, intent)
    }))
    .sort((a, b) => b.score - a.score) // Highest score first

  for (const { turn } of scoredTurns) {
    if (usedTokens + turn.tokens <= allocation.system + allocation.recentTurns) {
      selected.turns.push(turn)
      usedTokens += turn.tokens
    }
  }

  // 3. Select files (highest relevance that fit)
  const scoredFiles = pool.contextFiles
    .map(file => ({
      file,
      score: scoreContextFile(file, intent)
    }))
    .sort((a, b) => b.score - a.score)

  const filesBudget = allocation.system + allocation.recentTurns + allocation.files
  for (const { file, score } of scoredFiles) {
    // Skip if relevance too low
    if (score < 0.3) continue

    // Try to fit file
    if (usedTokens + file.tokens <= filesBudget) {
      selected.files.push(file)
      usedTokens += file.tokens
    }

    // If file is too big but highly relevant, include summary
    else if (score > 0.8 && file.summary) {
      const summaryTokens = estimateTokens(file.summary)
      if (usedTokens + summaryTokens <= filesBudget) {
        selected.files.push({
          ...file,
          content: file.summary, // Use summary instead of full content
          tokens: summaryTokens
        })
        usedTokens += summaryTokens
      }
    }
  }

  // 4. Select memory snippets
  const scoredMemory = pool.memoryHits
    .map(snippet => ({
      snippet,
      score: scoreMemorySnippet(snippet, intent)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5) // Top 5 max

  const memoryBudget = filesBudget + allocation.memory
  for (const { snippet } of scoredMemory) {
    if (usedTokens + snippet.tokens <= memoryBudget) {
      selected.memory.push(snippet)
      usedTokens += snippet.tokens
    }
  }

  // 5. Include project state if relevant and budget remains
  if (pool.projectState && intent.metadata.requiresProject) {
    const projectTokens = estimateTokens(JSON.stringify(pool.projectState))
    const totalBudget = memoryBudget + allocation.project
    if (usedTokens + projectTokens <= totalBudget) {
      selected.project = pool.projectState
      usedTokens += projectTokens
    }
  }

  // 6. Update metadata
  selected.metadata = {
    totalTokens: usedTokens,
    budgetUtilization: usedTokens / allocation.totalBudget,
    selectionStrategy: `intent:${intent.classification} budget:${allocation.totalBudget}`,
    filesSelected: selected.files.length,
    turnsSelected: selected.turns.length,
    memorySelected: selected.memory.length
  }

  return selected
}
```

---

## 🎯 Intent Classification

**Simple keyword-based classifier (v1):**

```typescript
function classifyIntent(text: string): UserIntent {
  const lower = text.toLowerCase()

  // Code writing indicators
  if (lower.match(/write|create|implement|add|build|make a/)) {
    return {
      text,
      classification: IntentType.CODE_WRITING,
      confidence: 0.8,
      metadata: { requiresCode: true, requiresFiles: true }
    }
  }

  // Debugging indicators
  if (lower.match(/fix|bug|error|broken|not working|debug/)) {
    return {
      text,
      classification: IntentType.CODE_DEBUGGING,
      confidence: 0.85,
      metadata: { requiresCode: true, requiresFiles: true, requiresHistory: true }
    }
  }

  // File analysis
  if (lower.match(/explain|what does|how does|analyze|understand/)) {
    return {
      text,
      classification: IntentType.FILE_ANALYSIS,
      confidence: 0.75,
      metadata: { requiresFiles: true }
    }
  }

  // Conversational (default)
  return {
    text,
    classification: IntentType.CONVERSATIONAL,
    confidence: 0.6,
    metadata: { requiresHistory: true }
  }
}
```

**Future: ML-based classifier**
- Train on user interactions
- Learn personal patterns
- Improve over time

---

## 📊 Success Metrics

### **Functional Requirements**
✅ **FR-1:** Always stays within token budget (±5%)
✅ **FR-2:** Selects most relevant context (relevance score >0.7)
✅ **FR-3:** Handles all intent types
✅ **FR-4:** Gracefully handles large files (via summaries)

### **Performance Requirements**
✅ **PR-1:** Selection completes in <100ms (p95)
✅ **PR-2:** Scales to 100+ files in drawer
✅ **PR-3:** Scales to 1000+ conversation turns

### **Quality Requirements**
✅ **QR-1:** User-mentioned files ALWAYS included (if fit budget)
✅ **QR-2:** Recent conversation ALWAYS included
✅ **QR-3:** Pinned files get priority
✅ **QR-4:** Context relevance improves AI response quality

---

## 🧪 Validation Tests

### **Test 1: Budget Enforcement**
```swift
let result = await ContextSelector.select(
    intent: classifyIntent("explain this code"),
    tokenBudget: 2000,
    pool: poolWith100Files
)
XCTAssertLessThanOrEqual(result.metadata.totalTokens, 2000)
```

### **Test 2: Relevance Ranking**
```swift
// Add 2 files: relevant and irrelevant
await pool.addFile("backend.py", content: "def api()...")
await pool.addFile("readme.txt", content: "This is a readme...")

let result = await ContextSelector.select(
    intent: classifyIntent("fix the API endpoint"),
    tokenBudget: 5000,
    pool: pool
)

// backend.py should be selected first
XCTAssertEqual(result.files.first?.path, "backend.py")
```

### **Test 3: Direct File Mention**
```swift
let result = await ContextSelector.select(
    intent: classifyIntent("explain the code in config.ts"),
    tokenBudget: 3000,
    pool: pool
)

// config.ts MUST be included
XCTAssertTrue(result.files.contains(where: { $0.name == "config.ts" }))
```

---

## 🚀 Implementation Plan

### **Week 1: Foundation**
- [ ] Intent classification (keyword-based)
- [ ] Budget allocation logic
- [ ] Basic scoring functions
- [ ] Selection algorithm core

### **Week 2: Refinement**
- [ ] Semantic similarity (embeddings)
- [ ] Entity extraction
- [ ] File summary integration
- [ ] Optimization (<100ms)

### **Week 3: Integration**
- [ ] Wire to CentralIntelligence
- [ ] Wire to DataPoolService
- [ ] Add telemetry
- [ ] Validation tests

### **Week 4: Intelligence**
- [ ] ML-based intent classifier (optional)
- [ ] Adaptive weights
- [ ] User feedback loop
- [ ] A/B testing different strategies

---

## 📡 Observable Events

```typescript
"context.selection.start"    { intent: string, budget: number }
"context.selection.complete" {
  durationMs: number,
  filesSelected: number,
  turnsSelected: number,
  tokensUsed: number,
  budgetUtilization: number
}
"context.file.scored"        { file: string, score: number }
"context.budget.exceeded"    { requested: number, available: number }  // Should never fire!
```

---

## 🔮 Future Enhancements

- **Learned Preferences:** Track which context leads to better responses
- **Multi-turn Optimization:** Adjust selection based on conversation flow
- **Compression:** Automatically compress/summarize old context
- **User Feedback:** "This context was not helpful" → adjust weights
- **Proactive Loading:** Pre-fetch likely needed context

---

**The selector is the BRAIN. The pool is the MEMORY. Together they make LocalBrain intelligent.** 🧠
