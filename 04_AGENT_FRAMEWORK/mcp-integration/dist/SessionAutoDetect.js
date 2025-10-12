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
import { TaskRegistryClient } from './TaskRegistryClient.js';
/**
 * SESSION AUTO-DETECT - Main class for automatic agent identification
 */
export class SessionAutoDetect {
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
    static async detectAndWelcome() {
        console.log('\n🔍 Detecting agent identity...\n');
        try {
            // Step 1: Get model ID from environment
            const modelId = this.getModelId();
            const modelName = this.extractModelName(modelId);
            console.log(`   Model detected: ${modelName}`);
            // Step 2: Map model to possible agent roles
            const possibleRoles = this.mapModelToAgents(modelName);
            if (possibleRoles.length === 0) {
                throw new Error(`Unknown model: ${modelName}`);
            }
            console.log(`   Possible roles: ${possibleRoles.map(r => `Agent ${r.agentId}`).join(', ')}`);
            // Step 3: Query MCP to check which role has work (for models with 2 roles)
            const activeRole = await this.selectActiveRole(possibleRoles);
            console.log(`   Active role: Agent ${activeRole.agentId} (${activeRole.name})\n`);
            // Step 4: Get task status for this agent
            const client = new TaskRegistryClient(activeRole.agentId);
            const statusResponse = await client.getAgentStatus(activeRole.agentId);
            // Parse status from MCP response (comes as JSON string)
            let taskStatus;
            try {
                const parsed = typeof statusResponse === 'string'
                    ? JSON.parse(statusResponse)
                    : statusResponse;
                taskStatus = {
                    total: parsed.total || 0,
                    completed: parsed.completed || 0,
                    available: parsed.available || 0,
                    inProgress: parsed.inProgress || 0,
                    blocked: parsed.blocked || 0
                };
            }
            catch (error) {
                // Fallback if parsing fails
                taskStatus = {
                    total: 0,
                    completed: 0,
                    available: 0,
                    inProgress: 0,
                    blocked: 0
                };
            }
            // Step 5: Build identity object
            const identity = {
                modelId,
                modelName,
                agentId: activeRole.agentId,
                agentRole: activeRole.name,
                emoji: activeRole.emoji,
                taskStatus,
                capabilities: activeRole.capabilities,
                sessionId: this.generateSessionId(activeRole.agentId)
            };
            // Step 6: Display beautiful welcome banner
            this.displayWelcomeBanner(identity);
            return identity;
        }
        catch (error) {
            console.error('❌ Error during agent detection:', error);
            // Fallback to generic agent
            const fallbackIdentity = {
                modelId: 'unknown',
                modelName: 'unknown',
                agentId: 'F',
                agentRole: 'Unknown Agent',
                emoji: '⚫',
                taskStatus: {
                    total: 0,
                    completed: 0,
                    available: 0,
                    inProgress: 0,
                    blocked: 0
                },
                capabilities: ['General assistance'],
                sessionId: this.generateSessionId('F')
            };
            this.displayWelcomeBanner(fallbackIdentity);
            return fallbackIdentity;
        }
    }
    /**
     * Get model ID from environment or Claude metadata
     *
     * Tries multiple sources in order:
     * 1. CLAUDE_MODEL_ID environment variable
     * 2. Claude Code context (future enhancement)
     * 3. Fallback to default (Sonnet-4.5)
     */
    static getModelId() {
        // Try environment variable first
        if (process.env.CLAUDE_MODEL_ID) {
            return process.env.CLAUDE_MODEL_ID;
        }
        // Try to detect from Claude Code context
        // TODO: Once Claude Code exposes model ID via API, use it here
        // For now, we can make an educated guess based on capabilities
        // Fallback: Default to Sonnet-4.5 (most common for Agent B/D)
        console.warn('⚠️  CLAUDE_MODEL_ID not set, defaulting to Sonnet-4.5');
        return 'claude-sonnet-4-5-20250929';
    }
    /**
     * Extract short model name from full model ID
     *
     * Examples:
     * - "claude-sonnet-4-5-20250929" → "claude-sonnet-4-5"
     * - "glm-4-6-preview-20250301" → "glm-4-6"
     * - "gemini-2.5-pro-latest" → "gemini-2.5-pro"
     */
    static extractModelName(modelId) {
        const normalized = modelId.toLowerCase();
        // Pattern matching for known models
        if (normalized.includes('glm')) {
            return 'glm-4-6';
        }
        else if (normalized.includes('sonnet')) {
            return 'claude-sonnet-4-5';
        }
        else if (normalized.includes('gemini')) {
            return 'gemini-2.5-pro';
        }
        else if (normalized.includes('gpt-5') || normalized.includes('chatgpt-5')) {
            return 'chatgpt-5';
        }
        else if (normalized.includes('gpt-4')) {
            return 'gpt-4'; // Fallback for older models
        }
        // Unknown model - return as-is
        return modelId;
    }
    /**
     * Map model name to possible agent roles
     *
     * Model Mapping (from SYSTEM_TAXONOMY.md):
     * - GLM-4.6: Agent A (UI Velocity) OR Agent C (Backend Services)
     * - Sonnet-4.5: Agent B (Design System) OR Agent D (Integration)
     * - Gemini-2.5-Pro: Agent E (Ground Supervisor)
     * - ChatGPT-5: Agent F (Strategic Supervisor)
     */
    static mapModelToAgents(modelName) {
        const modelMap = {
            'glm-4-6': [
                {
                    agentId: 'A',
                    name: 'UI Velocity Specialist',
                    emoji: '🔵',
                    capabilities: [
                        'React/SwiftUI development',
                        'Rapid prototyping',
                        'Frontend components',
                        'Design system application'
                    ]
                },
                {
                    agentId: 'C',
                    name: 'Backend Services Specialist',
                    emoji: '🟢',
                    capabilities: [
                        'API development',
                        'Database operations',
                        'Service architecture',
                        'Infrastructure implementation'
                    ]
                }
            ],
            'claude-sonnet-4-5': [
                {
                    agentId: 'B',
                    name: 'Design System Specialist',
                    emoji: '🟣',
                    capabilities: [
                        'OKLCH color system',
                        'Accessibility (WCAG 2.2 AA)',
                        'Component library',
                        'UI/UX architecture'
                    ]
                },
                {
                    agentId: 'D',
                    name: 'Integration Specialist',
                    emoji: '🟡',
                    capabilities: [
                        'Swift ↔ Electron IPC bridge',
                        'Multi-platform coordination',
                        'System integration',
                        'Testing & verification'
                    ]
                }
            ],
            'gemini-2.5-pro': [
                {
                    agentId: 'E',
                    name: 'Ground Supervisor',
                    emoji: '🔴',
                    capabilities: [
                        'Complete codebase understanding (1M context)',
                        'Cross-agent coordination',
                        'Architectural coherence',
                        'Knowledge management'
                    ]
                }
            ],
            'chatgpt-5': [
                {
                    agentId: 'F',
                    name: 'Strategic Supervisor',
                    emoji: '⚪',
                    capabilities: [
                        'Strategic guidance',
                        'Instruction-set generation',
                        'Definition of Done validation',
                        'High-level architectural decisions'
                    ]
                }
            ]
        };
        return modelMap[modelName] || [];
    }
    /**
     * Select active role when model has multiple possible agents
     *
     * Strategy:
     * 1. If only one possible role → use it
     * 2. If multiple roles → query MCP to check which has work
     * 3. Prioritize role with available or in-progress tasks
     * 4. If both equal → default to first role
     */
    static async selectActiveRole(possibleRoles) {
        // Only one role - easy choice
        if (possibleRoles.length === 1) {
            return possibleRoles[0];
        }
        // Multiple roles - query MCP to determine which has work
        try {
            const client = new TaskRegistryClient(possibleRoles[0].agentId);
            // Query status for both roles
            const statusPromises = possibleRoles.map(async (role) => {
                try {
                    const response = await client.getAgentStatus(role.agentId);
                    const parsed = typeof response === 'string' ? JSON.parse(response) : response;
                    return {
                        role,
                        available: parsed.available || 0,
                        inProgress: parsed.inProgress || 0,
                        hasWork: (parsed.available || 0) > 0 || (parsed.inProgress || 0) > 0
                    };
                }
                catch (error) {
                    return {
                        role,
                        available: 0,
                        inProgress: 0,
                        hasWork: false
                    };
                }
            });
            const statuses = await Promise.all(statusPromises);
            // Prioritize role with work
            const roleWithWork = statuses.find(s => s.hasWork);
            if (roleWithWork) {
                console.log(`   Selecting ${roleWithWork.role.agentId}: ${roleWithWork.available} available, ${roleWithWork.inProgress} in progress`);
                return roleWithWork.role;
            }
            // No role has work - default to first
            console.log('   No role has pending work, defaulting to first role');
            return possibleRoles[0];
        }
        catch (error) {
            console.warn('⚠️  Could not query MCP for role selection, defaulting to first role');
            return possibleRoles[0];
        }
    }
    /**
     * Generate unique session ID
     *
     * Format: {AGENT_ID}_{TIMESTAMP}_{RANDOM}
     * Example: B_1728415234_k9j2l4m
     */
    static generateSessionId(agentId) {
        const timestamp = Math.floor(Date.now() / 1000);
        const random = Math.random().toString(36).substring(2, 9);
        return `${agentId}_${timestamp}_${random}`;
    }
    /**
     * 🎨 Display beautiful welcome banner with agent identity
     *
     * Shows:
     * - Agent emoji and role
     * - Model information
     * - Task status with progress bar
     * - Next action guidance
     */
    static displayWelcomeBanner(identity) {
        const { emoji, agentId, agentRole, modelName, taskStatus, capabilities } = identity;
        // Build progress bar
        const progressBar = this.renderProgressBar(taskStatus.completed, taskStatus.total);
        // Build status message
        let statusMessage;
        if (taskStatus.available > 0) {
            statusMessage = `🎯 ${taskStatus.available} task(s) available - Say "start working" to begin!`;
        }
        else if (taskStatus.inProgress > 0) {
            statusMessage = `⚡ ${taskStatus.inProgress} task(s) in progress - Continue working!`;
        }
        else if (taskStatus.total > 0 && taskStatus.completed === taskStatus.total) {
            statusMessage = '🏁 All tasks complete - Standing by for new assignments';
        }
        else {
            statusMessage = '📋 No tasks assigned yet - Standing by';
        }
        // Build capabilities summary (show first 3)
        const capabilitySummary = capabilities.slice(0, 3).join(' • ');
        const banner = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ${emoji} Agent ${agentId} (${agentRole})
  Model: ${modelName}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Registered with Central Coordinator
📊 Task Status: ${taskStatus.completed}/${taskStatus.total} complete
${progressBar}

${statusMessage}

💡 Capabilities: ${capabilitySummary}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
        console.log(banner);
    }
    /**
     * Render ASCII progress bar
     *
     * Examples:
     * - [████████████████████] 100% (5/5 complete)
     * - [████████████░░░░░░░░] 60% (3/5 complete)
     * - [░░░░░░░░░░░░░░░░░░░░] 0% (0/5 complete)
     */
    static renderProgressBar(completed, total) {
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
    static getAgentEmoji(agentId) {
        const emojiMap = {
            'A': '🔵',
            'B': '🟣',
            'C': '🟢',
            'D': '🟡',
            'E': '🔴',
            'F': '⚪'
        };
        return emojiMap[agentId] || '⚫';
    }
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
export async function startSession() {
    return await SessionAutoDetect.detectAndWelcome();
}
/**
 * 🧪 TEST FUNCTION - Manual testing
 *
 * Run with: npx tsx SessionAutoDetect.ts
 */
if (require.main === module) {
    console.log('🧪 Testing SessionAutoDetect...\n');
    startSession()
        .then(identity => {
        console.log('\n✅ Detection successful!');
        console.log('Identity:', JSON.stringify(identity, null, 2));
    })
        .catch(error => {
        console.error('\n❌ Detection failed:', error);
        process.exit(1);
    });
}
//# sourceMappingURL=SessionAutoDetect.js.map