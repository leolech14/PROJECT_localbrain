# 🎯 AGENT A (GLM-4.6) - Task Briefing
## UI Specialist - Assigned Tasks via MCP

**Agent**: A (UI Specialist - GLM-4.6 200K context)
**Project**: LocalBrain - Central Intelligence
**Coordinator**: Agent D (Integration Specialist - Sonnet 4.5)
**Status**: READY FOR ORDERS

---

## 📋 YOUR ASSIGNED TASK: T017 - CLI Tool Foundation

**Priority**: P0-CRITICAL
**Estimated**: 8 hours
**Dependencies**: T008 ✅, T009 ✅ (both complete)

**What You're Building**: `@lech/brain-cli` - The Doppler-like command-line tool

---

## 🎯 DELIVERABLES

### **1. Create CLI Package Structure**
```bash
Location: /Users/lech/PROJECTS_all/LocalBrain/packages/brain-cli/

Structure:
packages/brain-cli/
├── src/
│   ├── cli.ts (main entry)
│   ├── lib/
│   │   ├── mcp-client.ts (connect to our MCP server)
│   │   └── config.ts (manage ~/.brain/config.json)
│   └── commands/
│       ├── auth.ts (login, logout, status)
│       ├── connect.ts (brain connect - main command)
│       ├── task.ts (list, claim, update, complete)
│       └── config.ts (show, set, reset)
├── package.json
├── tsconfig.json
└── README.md
```

### **2. Implement Commands**

**brain auth login**:
```bash
$ brain auth login
? Enter MCP Server URL: http://localhost:3000
? Enter API Key: brain_xxxxxx
✅ Authenticated successfully!
💾 Config saved to ~/.brain/config.json
```

**brain connect**:
```bash
$ brain connect

Connecting to Central Intelligence...
✅ Connected!

🔍 Discovering environment...
✅ Agent recognized: Agent-GLM-xxx
✅ Project detected: LocalBrain
✅ Context: 1,808 files indexed
✅ Job proposals: 5 tasks available

📋 Recommended task: T011 (95% match)
   React Query + SSR Integration

Ready to work! Use: brain task claim T011
```

**brain task list**:
```bash
$ brain task list

📋 Available Tasks (5):

1. T011: React Query + SSR Integration (P0-Critical)
   Match: 95% | Effort: 16h | Ready: ✅

2. T014: IndexedDB Offline Persistence (P1-High)
   Match: 88% | Effort: 16h | Ready: ❌ (blocked by T011)

...
```

### **3. Use MCP Client**

```typescript
// In src/lib/mcp-client.ts
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

export class BrainMCPClient {
  async connect(serverPath: string) {
    const transport = new StdioClientTransport({
      command: 'node',
      args: ['dist/index.js'],
      cwd: serverPath
    });

    const client = new Client({ name: 'brain-cli', version: '1.0.0' });
    await client.connect(transport);

    return client;
  }

  async discoverEnvironment(cwd: string, modelId: string, trackingId?: string) {
    return await this.client.callTool('discover_environment', {
      cwd,
      modelId,
      trackingId
    });
  }

  // ... more methods
}
```

---

## 🛠️ TECHNICAL REQUIREMENTS

**Dependencies**:
```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.4",
    "commander": "^11.1.0",
    "chalk": "^5.3.0",
    "ora": "^8.0.1",
    "inquirer": "^9.2.12",
    "cli-table3": "^0.6.3",
    "conf": "^12.0.0"
  }
}
```

**Beautiful UI Examples**:
```typescript
import chalk from 'chalk';
import ora from 'ora';
import Table from 'cli-table3';

// Spinner
const spinner = ora('Discovering environment...').start();
// ...
spinner.succeed('Environment discovered!');

// Colors
console.log(chalk.green('✅ Success!'));
console.log(chalk.yellow('⚠️  Warning'));
console.log(chalk.red('❌ Error'));

// Table
const table = new Table({
  head: ['Task ID', 'Name', 'Match', 'Status']
});
table.push(['T011', 'React Query', '95%', '✅ Ready']);
console.log(table.toString());
```

---

## ✅ ACCEPTANCE CRITERIA

- [ ] Package created with proper structure
- [ ] brain auth login working
- [ ] brain connect working (calls discover_environment)
- [ ] brain task commands working
- [ ] Config in ~/.brain/config.json
- [ ] Beautiful terminal UI
- [ ] Error handling comprehensive
- [ ] Help text complete

---

## 🔗 RESOURCES

**Review These Files**:
- `01_CODEBASES/mcp-servers/localbrain-task-registry/src/tools/discovery/discoverEnvironment.ts`
- `04_AGENT_FRAMEWORK/CENTRAL_INTELLIGENCE_QUICK_REFERENCE.md`
- `04_AGENT_FRAMEWORK/mcp-integration/TaskRegistryClient.ts` (example client)

**MCP Server Location**:
- `/Users/lech/PROJECTS_all/LocalBrain/01_CODEBASES/mcp-servers/localbrain-task-registry`

---

## 🚀 START BUILDING

When ready, claim your task via MCP:
```
Use discover_environment to get activated
Review job proposals
Claim T017
Build the CLI tool
Update task registry when complete
```

**GO BUILD! 💪**
