/**
 * 🎯 NATURAL LANGUAGE ROUTER - Phase 1 Quick Win #2
 * ==================================================
 *
 * AUTOMATIC TASK ROUTING FROM NATURAL LANGUAGE
 *
 * Purpose: Eliminate manual task coordination - "start working" just works!
 * Impact: Saves 2 minutes per task, zero friction coordination
 *
 * Supported Intents:
 * - REQUEST_TASK: "start working", "find me a task", "what can I do?"
 * - CHECK_STATUS: "what's my status?", "show progress", "where am I?"
 * - CONTINUE_WORK: "continue", "keep going", "resume"
 *
 * Flow:
 * 1. Detect user intent from natural language
 * 2. Route to appropriate handler (request, status, continue)
 * 3. Call existing MCP tools automatically
 * 4. Display beautiful formatted output
 * 5. Return action for agent to execute
 *
 * Integration: Uses existing TaskRegistryClient (100% compatible)
 */

import { TaskRegistryClient } from './TaskRegistryClient.js';

/**
 * Task Action - What the agent should do next
 */
export interface TaskAction {
  action: 'AUTO_START' | 'STATUS_UPDATE' | 'CONTINUE' | 'NONE';
  task?: any;              // Task object (if action is AUTO_START)
  message: string;         // Message to display to user
  nextSteps?: string[];    // Suggested next steps
}

/**
 * Task object structure (from MCP registry)
 */
interface Task {
  id: string;
  name: string;
  priority: string;
  phase: string;
  timeline: string;
  dependencies: string[];
  deliverables: string[];
  location: string;
  status?: string;
}

/**
 * Agent status from MCP
 */
interface AgentStatus {
  agent: string;
  total: number;
  completed: number;
  available: number;
  inProgress: number;
  blocked: number;
  currentTask?: Task;
  availableTasks?: Task[];
}

/**
 * NATURAL LANGUAGE ROUTER - Main class for intent detection and routing
 */
export class NaturalLanguageRouter {
  private agentId: string;
  private client: TaskRegistryClient;

  constructor(agentId: string) {
    this.agentId = agentId;
    this.client = new TaskRegistryClient(agentId);
  }

  /**
   * 🎯 MAIN ENTRY POINT - Route user prompt to task action
   *
   * Call this for EVERY user prompt to auto-detect task-related intents
   *
   * @param userPrompt - Raw user input
   * @returns TaskAction if intent detected, null if not task-related
   */
  async route(userPrompt: string): Promise<TaskAction | null> {
    const intent = this.detectIntent(userPrompt);

    switch (intent) {
      case 'REQUEST_TASK':
        return await this.handleRequestTask();

      case 'CHECK_STATUS':
        return await this.handleCheckStatus();

      case 'CONTINUE_WORK':
        return await this.handleContinueWork();

      default:
        return null; // Not a task-related prompt, Claude handles normally
    }
  }

  /**
   * 🧠 Detect user intent from natural language
   *
   * Uses simple pattern matching (Phase 1)
   * Future: Could use LLM-based intent classification
   */
  private detectIntent(prompt: string): string {
    const normalized = prompt.toLowerCase().trim();

    // Intent patterns (order matters - most specific first)
    const intentPatterns: Record<string, string[]> = {
      REQUEST_TASK: [
        'start working',
        'find me a task',
        'find task',
        'get task',
        'claim task',
        'what can i do',
        'what should i work on',
        'assign me',
        'ready for task',
        "let's work",
        "let's start",
        'begin work',
        'begin',
        'give me work',
        'need a task',
        'available tasks'
      ],
      CHECK_STATUS: [
        "what's my status",
        'show my status',
        'my status',
        'status',
        'progress',
        'show progress',
        'where am i',
        'current task',
        'what am i working on',
        'task status'
      ],
      CONTINUE_WORK: [
        'continue',
        'continue work',
        'keep going',
        'resume',
        'resume work',
        'carry on',
        'back to work',
        'keep working'
      ]
    };

    // Check each intent pattern
    for (const [intent, patterns] of Object.entries(intentPatterns)) {
      if (patterns.some(pattern => normalized.includes(pattern))) {
        return intent;
      }
    }

    return 'UNKNOWN';
  }

  /**
   * 📋 Handle REQUEST_TASK intent: "start working"
   *
   * Flow:
   * 1. Get available tasks from MCP
   * 2. Select highest priority task
   * 3. Auto-claim task
   * 4. Display beautiful task card
   * 5. Return AUTO_START action
   */
  private async handleRequestTask(): Promise<TaskAction> {
    console.log('\n🔍 Searching for tasks matching your specialization...\n');

    try {
      // Step 1: Get available tasks using existing MCP tool ✅
      const tasksResponse = await this.client.getAvailableTasks();

      // Parse response (comes as JSON string from MCP)
      let tasks: Task[];
      try {
        const parsed = typeof tasksResponse === 'string'
          ? JSON.parse(tasksResponse)
          : tasksResponse;
        tasks = parsed.tasks || [];
      } catch (error) {
        console.error('❌ Error parsing tasks response:', error);
        tasks = [];
      }

      // No tasks available
      if (!tasks || tasks.length === 0) {
        return {
          action: 'NONE',
          message: `✅ No available tasks for Agent ${this.agentId}. All work complete! 🎉`
        };
      }

      console.log(`✅ Found ${tasks.length} available task(s) for Agent ${this.agentId}\n`);

      // Step 2: Select highest priority task
      const topTask = this.selectTopPriorityTask(tasks);

      console.log(`📋 Auto-claiming highest priority task: ${topTask.id}\n`);

      // Step 3: Auto-claim task using existing MCP tool ✅
      try {
        await this.client.claimTask(topTask.id);
      } catch (error) {
        console.error(`❌ Error claiming task ${topTask.id}:`, error);
        return {
          action: 'NONE',
          message: `❌ Failed to claim task ${topTask.id}. Please try again.`
        };
      }

      // Step 4: Display beautiful task card
      this.displayTaskCard(topTask);

      // Step 5: Return AUTO_START action
      return {
        action: 'AUTO_START',
        task: topTask,
        message: '\n✅ Task claimed successfully! Let me begin by reading the existing code and specifications...',
        nextSteps: [
          'Read relevant specifications',
          'Examine existing codebase',
          'Plan implementation approach',
          'Start building deliverables'
        ]
      };

    } catch (error) {
      console.error('❌ Error during task request:', error);
      return {
        action: 'NONE',
        message: '❌ Error retrieving tasks. Please check MCP server connection.'
      };
    }
  }

  /**
   * 📊 Handle CHECK_STATUS intent: "what's my status?"
   *
   * Flow:
   * 1. Get agent status from MCP
   * 2. Display formatted status
   * 3. Return STATUS_UPDATE action
   */
  private async handleCheckStatus(): Promise<TaskAction> {
    console.log('\n📊 Checking agent status...\n');

    try {
      // Get status using existing MCP tool ✅
      const statusResponse = await this.client.getAgentStatus(this.agentId);

      // Parse response
      let status: AgentStatus;
      try {
        status = typeof statusResponse === 'string'
          ? JSON.parse(statusResponse)
          : statusResponse;
      } catch (error) {
        console.error('❌ Error parsing status response:', error);
        return {
          action: 'NONE',
          message: '❌ Error retrieving status. Please check MCP server connection.'
        };
      }

      // Build status message
      const progressBar = this.renderProgressBar(status.completed, status.total);

      const statusMessage = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📊 Agent ${this.agentId} Status Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Tasks Overview:
   Total Tasks:     ${status.total}
   ✅ Completed:    ${status.completed}
   ⚡ Available:    ${status.available}
   🔄 In Progress:  ${status.inProgress}
   🚫 Blocked:      ${status.blocked}

Progress: ${progressBar}

${status.currentTask
  ? `🔥 Current Task:\n   ${status.currentTask.id} - ${status.currentTask.name}`
  : status.available > 0
    ? `🎯 Ready to work! Say "start working" to claim a task.`
    : '🏁 All tasks complete! Standing by for new assignments.'
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

      console.log(statusMessage);

      return {
        action: 'STATUS_UPDATE',
        message: statusMessage
      };

    } catch (error) {
      console.error('❌ Error during status check:', error);
      return {
        action: 'NONE',
        message: '❌ Error retrieving status. Please check MCP server connection.'
      };
    }
  }

  /**
   * ⚡ Handle CONTINUE_WORK intent: "continue"
   *
   * Flow:
   * 1. Check for current task in progress
   * 2. Display task details
   * 3. Return CONTINUE action
   */
  private async handleContinueWork(): Promise<TaskAction> {
    console.log('\n⚡ Checking for work in progress...\n');

    try {
      // Get status to check for current task
      const statusResponse = await this.client.getAgentStatus(this.agentId);

      let status: AgentStatus;
      try {
        status = typeof statusResponse === 'string'
          ? JSON.parse(statusResponse)
          : statusResponse;
      } catch (error) {
        return {
          action: 'NONE',
          message: '❌ Error retrieving current task status.'
        };
      }

      // Check if there's a task in progress
      if (status.currentTask) {
        console.log(`✅ Resuming work on ${status.currentTask.id}\n`);
        this.displayTaskCard(status.currentTask);

        return {
          action: 'CONTINUE',
          task: status.currentTask,
          message: '\n✅ Resuming work on current task...'
        };
      } else if (status.available > 0) {
        return {
          action: 'NONE',
          message: `📋 No task currently in progress. Say "start working" to claim a new task.`
        };
      } else {
        return {
          action: 'NONE',
          message: '🏁 All tasks complete! Standing by for new assignments.'
        };
      }

    } catch (error) {
      console.error('❌ Error during continue work:', error);
      return {
        action: 'NONE',
        message: '❌ Error checking current task status.'
      };
    }
  }

  /**
   * 🎯 Select highest priority task from available tasks
   *
   * Priority order:
   * 1. P0-CRITICAL (blocking others)
   * 2. P1-HIGH (important features)
   * 3. P2-MEDIUM (enhancements)
   * 4. P3-LOW (nice-to-haves)
   */
  private selectTopPriorityTask(tasks: Task[]): Task {
    const priorityOrder: Record<string, number> = {
      'P0-CRITICAL': 0,
      'P1-HIGH': 1,
      'P2-MEDIUM': 2,
      'P3-LOW': 3
    };

    return tasks.sort((a, b) => {
      const aPriority = priorityOrder[a.priority] ?? 999;
      const bPriority = priorityOrder[b.priority] ?? 999;
      return aPriority - bPriority;
    })[0];
  }

  /**
   * 🎨 Display beautiful task card
   *
   * Shows:
   * - Task ID and name
   * - Agent emoji and role
   * - Estimated timeline
   * - Priority level
   * - Deliverables (first 5)
   */
  private displayTaskCard(task: Task): void {
    const emoji = this.getAgentEmoji(this.agentId);
    const role = this.getAgentRole(this.agentId);

    // Format deliverables (show first 5)
    const deliverableLines = this.formatDeliverables(task.deliverables);

    const card = `
┌────────────────────────────────────────────────────────────────┐
│ 📋 ${task.id} - ${this.truncate(task.name, 45).padEnd(45)} │
│ ${emoji} Agent ${this.agentId} (${this.truncate(role, 28).padEnd(28)}) │
│ ⏱️  Estimated: ${this.truncate(task.timeline || 'TBD', 44).padEnd(44)} │
│ 🎯 Priority: ${this.truncate(task.priority, 46).padEnd(46)} │
│                                                                │
│ Deliverables:                                                  │
${deliverableLines}
│                                                                │
│ ✅ Starting work automatically...                              │
└────────────────────────────────────────────────────────────────┘
`;

    console.log(card);
  }

  /**
   * Format deliverables for task card display
   */
  private formatDeliverables(deliverables: string[]): string {
    if (!deliverables || deliverables.length === 0) {
      return '│ • No deliverables specified                                   │';
    }

    return deliverables
      .slice(0, 5) // Show max 5 deliverables
      .map(d => {
        const truncated = this.truncate(d, 58);
        return `│ • ${truncated.padEnd(58)} │`;
      })
      .join('\n');
  }

  /**
   * Render ASCII progress bar
   */
  private renderProgressBar(completed: number, total: number): string {
    if (total === 0) {
      return '[░░░░░░░░░░░░░░░░░░░░] 0%';
    }

    const percentage = Math.round((completed / total) * 100);
    const barLength = 20;
    const filled = Math.round((completed / total) * barLength);
    const empty = barLength - filled;

    const bar = '█'.repeat(filled) + '░'.repeat(empty);
    return `[${bar}] ${percentage}%`;
  }

  /**
   * Get agent emoji by ID
   */
  private getAgentEmoji(agentId: string): string {
    const emojiMap: Record<string, string> = {
      'A': '🔵',
      'B': '🟣',
      'C': '🟢',
      'D': '🟡',
      'E': '🔴',
      'F': '⚪'
    };
    return emojiMap[agentId] || '⚫';
  }

  /**
   * Get agent role name
   */
  private getAgentRole(agentId: string): string {
    const roleMap: Record<string, string> = {
      'A': 'UI Velocity',
      'B': 'Design System',
      'C': 'Backend Services',
      'D': 'Integration',
      'E': 'Ground Supervisor',
      'F': 'Strategic Supervisor'
    };
    return roleMap[agentId] || 'Unknown';
  }

  /**
   * Truncate string to max length with ellipsis
   */
  private truncate(str: string, maxLength: number): string {
    if (str.length <= maxLength) {
      return str;
    }
    return str.substring(0, maxLength - 3) + '...';
  }
}

/**
 * 🚀 CONVENIENCE EXPORT - Quick router creation
 *
 * Usage in agent code:
 * ```typescript
 * import { createRouter } from './NaturalLanguageRouter.js';
 *
 * const router = createRouter('B');
 * const action = await router.route('start working');
 * ```
 */
export function createRouter(agentId: string): NaturalLanguageRouter {
  return new NaturalLanguageRouter(agentId);
}

/**
 * 🧪 TEST FUNCTION - Manual testing
 *
 * Run with: npx tsx NaturalLanguageRouter.ts
 */
if (require.main === module) {
  console.log('🧪 Testing NaturalLanguageRouter...\n');

  const router = new NaturalLanguageRouter('B');

  // Test various prompts
  const testPrompts = [
    'start working',
    "what's my status?",
    'continue',
    'Hello, how are you?' // Should return null
  ];

  (async () => {
    for (const prompt of testPrompts) {
      console.log(`\n📝 Testing prompt: "${prompt}"`);
      const result = await router.route(prompt);
      console.log('Result:', result ? result.action : 'null (not task-related)');
      console.log('─'.repeat(60));
    }
  })();
}
