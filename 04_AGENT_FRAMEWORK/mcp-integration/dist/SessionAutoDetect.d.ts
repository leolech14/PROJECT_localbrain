/**
 * 🚀 SESSION AUTO-DETECT - Phase 1 Quick Win #1
 * ===============================================
 *
 * AUTOMATIC AGENT IDENTIFICATION ON SESSION START
 *
 * Purpose: Eliminate "Who am I?" friction - agent knows identity automatically
 * Impact: Saves 2 minutes per session, displays beautiful welcome banner
 *
 * Flow:
 * 1. Detect model ID from environment (claude-sonnet-4-5-20250929)
 * 2. Map model to possible agent roles (B=Design, D=Integration)
 * 3. Query MCP Task Registry to check which role has work
 * 4. Display beautiful welcome banner with agent identity
 * 5. Show task status and next available actions
 *
 * Integration: Uses existing TaskRegistryClient (100% compatible)
 */
/**
 * Agent Identity - Complete profile for this session
 */
export interface AgentIdentity {
    modelId: string;
    modelName: string;
    agentId: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
    agentRole: string;
    emoji: string;
    taskStatus: {
        total: number;
        completed: number;
        available: number;
        inProgress: number;
        blocked: number;
    };
    capabilities: string[];
    sessionId: string;
}
/**
 * SESSION AUTO-DETECT - Main class for automatic agent identification
 */
export declare class SessionAutoDetect {
    /**
     * 🎯 MAIN ENTRY POINT - Detect agent and display welcome banner
     *
     * Call this at the START of every Claude Code session to:
     * - Auto-detect which agent this session represents
     * - Display beautiful welcome banner with identity
     * - Show current task status
     * - Provide next action guidance
     *
     * @returns AgentIdentity - Complete profile for this session
     */
    static detectAndWelcome(): Promise<AgentIdentity>;
    /**
     * Get model ID from environment or Claude metadata
     *
     * Tries multiple sources in order:
     * 1. CLAUDE_MODEL_ID environment variable
     * 2. Claude Code context (future enhancement)
     * 3. Fallback to default (Sonnet-4.5)
     */
    private static getModelId;
    /**
     * Extract short model name from full model ID
     *
     * Examples:
     * - "claude-sonnet-4-5-20250929" → "claude-sonnet-4-5"
     * - "glm-4-6-preview-20250301" → "glm-4-6"
     * - "gemini-2.5-pro-latest" → "gemini-2.5-pro"
     */
    private static extractModelName;
    /**
     * Map model name to possible agent roles
     *
     * Model Mapping (from SYSTEM_TAXONOMY.md):
     * - GLM-4.6: Agent A (UI Velocity) OR Agent C (Backend Services)
     * - Sonnet-4.5: Agent B (Design System) OR Agent D (Integration)
     * - Gemini-2.5-Pro: Agent E (Ground Supervisor)
     * - ChatGPT-5: Agent F (Strategic Supervisor)
     */
    private static mapModelToAgents;
    /**
     * Select active role when model has multiple possible agents
     *
     * Strategy:
     * 1. If only one possible role → use it
     * 2. If multiple roles → query MCP to check which has work
     * 3. Prioritize role with available or in-progress tasks
     * 4. If both equal → default to first role
     */
    private static selectActiveRole;
    /**
     * Generate unique session ID
     *
     * Format: {AGENT_ID}_{TIMESTAMP}_{RANDOM}
     * Example: B_1728415234_k9j2l4m
     */
    private static generateSessionId;
    /**
     * 🎨 Display beautiful welcome banner with agent identity
     *
     * Shows:
     * - Agent emoji and role
     * - Model information
     * - Task status with progress bar
     * - Next action guidance
     */
    private static displayWelcomeBanner;
    /**
     * Render ASCII progress bar
     *
     * Examples:
     * - [████████████████████] 100% (5/5 complete)
     * - [████████████░░░░░░░░] 60% (3/5 complete)
     * - [░░░░░░░░░░░░░░░░░░░░] 0% (0/5 complete)
     */
    private static renderProgressBar;
    /**
     * Get agent emoji by ID
     */
    private static getAgentEmoji;
}
/**
 * 🚀 CONVENIENCE EXPORT - Quick session initialization
 *
 * Usage in agent code:
 * ```typescript
 * import { startSession } from './SessionAutoDetect.js';
 *
 * // Auto-detect agent and display welcome banner
 * const identity = await startSession();
 * console.log(`I am Agent ${identity.agentId}`);
 * ```
 */
export declare function startSession(): Promise<AgentIdentity>;
//# sourceMappingURL=SessionAutoDetect.d.ts.map