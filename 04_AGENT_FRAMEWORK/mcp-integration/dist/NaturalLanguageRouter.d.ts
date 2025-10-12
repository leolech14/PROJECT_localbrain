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
/**
 * Task Action - What the agent should do next
 */
export interface TaskAction {
    action: 'AUTO_START' | 'STATUS_UPDATE' | 'CONTINUE' | 'NONE';
    task?: any;
    message: string;
    nextSteps?: string[];
}
/**
 * NATURAL LANGUAGE ROUTER - Main class for intent detection and routing
 */
export declare class NaturalLanguageRouter {
    private agentId;
    private client;
    constructor(agentId: string);
    /**
     * 🎯 MAIN ENTRY POINT - Route user prompt to task action
     *
     * Call this for EVERY user prompt to auto-detect task-related intents
     *
     * @param userPrompt - Raw user input
     * @returns TaskAction if intent detected, null if not task-related
     */
    route(userPrompt: string): Promise<TaskAction | null>;
    /**
     * 🧠 Detect user intent from natural language
     *
     * Uses simple pattern matching (Phase 1)
     * Future: Could use LLM-based intent classification
     */
    private detectIntent;
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
    private handleRequestTask;
    /**
     * 📊 Handle CHECK_STATUS intent: "what's my status?"
     *
     * Flow:
     * 1. Get agent status from MCP
     * 2. Display formatted status
     * 3. Return STATUS_UPDATE action
     */
    private handleCheckStatus;
    /**
     * ⚡ Handle CONTINUE_WORK intent: "continue"
     *
     * Flow:
     * 1. Check for current task in progress
     * 2. Display task details
     * 3. Return CONTINUE action
     */
    private handleContinueWork;
    /**
     * 🎯 Select highest priority task from available tasks
     *
     * Priority order:
     * 1. P0-CRITICAL (blocking others)
     * 2. P1-HIGH (important features)
     * 3. P2-MEDIUM (enhancements)
     * 4. P3-LOW (nice-to-haves)
     */
    private selectTopPriorityTask;
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
    private displayTaskCard;
    /**
     * Format deliverables for task card display
     */
    private formatDeliverables;
    /**
     * Render ASCII progress bar
     */
    private renderProgressBar;
    /**
     * Get agent emoji by ID
     */
    private getAgentEmoji;
    /**
     * Get agent role name
     */
    private getAgentRole;
    /**
     * Truncate string to max length with ellipsis
     */
    private truncate;
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
export declare function createRouter(agentId: string): NaturalLanguageRouter;
//# sourceMappingURL=NaturalLanguageRouter.d.ts.map