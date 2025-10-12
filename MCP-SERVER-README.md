# 🔧 Mr. Fix My Project Please - MCP Server

Standalone MCP server that exposes ULTRATHINK project analysis as tools for Claude Desktop and other MCP clients.

## ✨ Features

- 🚀 **ULTRATHINK Dependency Maps** - 5 Mermaid diagrams showing project structure
- 🔬 **GPT-4O Purpose Discovery** - AI-powered project purpose analysis
- 🔫 **Sniper Gun Entity Extraction** - Precise entity identification
- 🌊 **Ripple Effect Analysis** - Change impact visualization
- 📊 **Interactive HTML Reports** - Beautiful, dark-themed reports
- 🌙 **Dark Theme Visualizations** - High contrast Mermaid diagrams
- 🔍 **Right-Click Zoom Mode** - Interactive diagram exploration
- 📚 **MEGALITH INDEX Navigation** - Comprehensive file browsing
- 🎨 **OKLCH Color System** - Professional color palette
- ⚙️ **Settings Panel** - Multiple color schemas
- 🎯 **Ultimate-UI-Studio-V2 Design System** - Modern, compact UI

## 🚀 Installation

### 1. Prerequisites

- Node.js 18+ installed
- Python 3 installed
- Claude Desktop installed

### 2. Install Dependencies

```bash
cd /Users/lech/PROJECTS_all/LocalBrain
npm install
```

### 3. Verify Installation

```bash
npm test
```

You should see:
```
✅ Test 1: Server initialized successfully
✅ Test 2: Tools list received
🎯 Test Results: 2/2 passed
```

## ⚙️ Configuration

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "mr-fix": {
      "command": "node",
      "args": ["/Users/lech/PROJECTS_all/LocalBrain/mr-fix-mcp-server.js"]
    }
  }
}
```

**Important**: Use absolute path to the `.js` file (not `.ts`)!

### Restart Claude Desktop

After updating config:
1. Quit Claude Desktop completely
2. Restart Claude Desktop
3. Verify server appears in MCP tools list

## 🛠️ Available Tools

### 1. analyze_project

Runs comprehensive ULTRATHINK analysis on any project.

**Parameters:**
- `projectPath` (optional) - Path to project directory (defaults to current directory)
- `htmlOnly` (optional) - Generate HTML report only, skip some analysis (faster)

**Example:**
```typescript
{
  "projectPath": "/path/to/my/project",
  "htmlOnly": false
}
```

**Returns:**
- `success` - Boolean indicating if analysis completed
- `project_path` - Path to analyzed project
- `html_report` - Path to generated HTML report
- `statistics` - File counts, directory counts, project purpose
- `features` - List of analysis features used
- `next_steps` - Recommended actions

### 2. quick_analysis

Fast project analysis with HTML report generation only.

**Parameters:**
- `projectPath` (optional) - Path to project directory

**Example:**
```typescript
{
  "projectPath": "/path/to/my/project"
}
```

**Returns:** Same structure as `analyze_project`

## 📋 Usage Examples

### From Claude Desktop

Once configured, you can use natural language:

**"Analyze this project"**
- Claude will use `analyze_project` with current directory

**"Quick analysis of /path/to/project"**
- Claude will use `quick_analysis` with specified path

**"Generate HTML report only"**
- Claude will use `analyze_project` with `htmlOnly: true`

### From MCP Client

Using the MCP protocol directly:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "analyze_project",
    "arguments": {
      "projectPath": "/Users/lech/PROJECTS_all/PROJECT_lechworld",
      "htmlOnly": false
    }
  }
}
```

## 🔍 Output

Analysis generates an HTML report with:

### 📊 5 Mermaid Dependency Diagrams
1. **Module Dependencies** - Import/export relationships
2. **File Dependencies** - File-to-file connections
3. **Component Dependencies** - React/UI component structure
4. **Data Flow** - Information flow through system
5. **Architecture Overview** - High-level system design

### 🎨 Interactive Features
- **Right-click any diagram** to enable zoom mode
- **Scroll to zoom** (0.5x - 5.0x)
- **Drag to pan** when zoomed
- **Right-click again** to lock zoom
- **Settings panel** for color schema changes

### 📈 Analysis Sections
- Project health metrics
- File statistics and complexity
- Ripple effect analysis (change impact)
- Entity extraction (functions, classes, components)
- GPT-4O purpose discovery

## 🧪 Testing

### Run Test Suite

```bash
npm test
```

### Manual Test

```bash
# Start server manually
node mr-fix-mcp-server.js

# In another terminal, send test request
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}' | node mr-fix-mcp-server.js
```

## 🔧 Development

### Build TypeScript

```bash
npm run build
```

### Watch Mode

```bash
npm run dev
```

### Files

- `mr-fix-mcp-server.ts` - TypeScript source
- `mr-fix-mcp-server.js` - Compiled JavaScript
- `test-mcp-server.js` - Test script
- `mr-fix-my-project-please.py` - Python analyzer (792KB megalith)
- `package.json` - Dependencies and scripts

## 📊 Performance

- **Initialization**: < 1 second
- **Small projects** (< 100 files): 5-15 seconds
- **Medium projects** (100-1000 files): 15-45 seconds
- **Large projects** (1000+ files): 1-3 minutes
- **Timeout**: 10 minutes (600,000ms)

## 🐛 Troubleshooting

### Server Won't Start

**Check Node version:**
```bash
node --version  # Should be 18+
```

**Check dependencies:**
```bash
npm install
```

**Check file permissions:**
```bash
chmod +x mr-fix-mcp-server.js
```

### Claude Desktop Can't Find Server

**Verify config path:**
```bash
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

**Use absolute path:**
- ✅ `"/Users/lech/PROJECTS_all/LocalBrain/mr-fix-mcp-server.js"`
- ❌ `"./mr-fix-mcp-server.js"`
- ❌ `"~/PROJECTS_all/LocalBrain/mr-fix-mcp-server.js"`

**Restart Claude Desktop:**
- Quit completely (Cmd+Q)
- Relaunch from Applications

### Python Script Not Found

**Verify analyzer path:**
```bash
ls -lh /Users/lech/PROJECTS_all/LocalBrain/mr-fix-my-project-please.py
```

**Check Python version:**
```bash
python3 --version  # Should be 3.8+
```

### Analysis Times Out

**For large projects, use quick analysis:**
```typescript
{
  "projectPath": "/huge/project",
  "htmlOnly": true  // Skip deep analysis, generate HTML only
}
```

**Or increase timeout in code:**
```typescript
// In mr-fix-mcp-server.ts, line 163
timeout: 1200000,  // 20 minutes instead of 10
```

## 📝 License

Part of LocalBrain project ecosystem.

## 🙏 Credits

- **ULTRATHINK Analysis** - mr-fix-my-project-please.py
- **MCP Protocol** - Model Context Protocol SDK
- **Design System** - Ultimate-UI-Studio-V2
- **Visualization** - Mermaid.js + OKLCH colors

---

**Generated with ULTRATHINK methodology** 🧠✨
