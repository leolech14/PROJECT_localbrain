/**
 * T015 - Global Kill-Switch Implementation
 * ======================================
 *
 * Agent D: Integration Specialist
 * Priority: P0 - CRITICAL
 * Performance Target: ≤300ms activation
 */

export interface KillSwitchRequest {
  reason: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  evidence: any;
  requestedBy: string;
  timestamp: string;
}

export interface PolicyDecision {
  approved: boolean;
  confidence: number;
  reasoning: string;
  requiredActions: string[];
}

export interface EvidenceReport {
  timestamp: string;
  triggerEvent: KillSwitchRequest;
  systemState: SystemState;
  agentStates: AgentState[];
  networkActivity: NetworkActivity;
  policyDecisions: PolicyDecision[];
}

export interface SystemState {
  activeConnections: number;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkLatency: number;
}

export interface AgentState {
  agentId: string;
  status: 'active' | 'idle' | 'stopped' | 'error';
  currentTask?: string;
  lastHeartbeat: string;
}

export interface NetworkActivity {
  totalRequests: number;
  errorRate: number;
  averageResponseTime: number;
  activeConnections: number;
}

export interface RecoveryProcedure {
  id: string;
  name: string;
  steps: RecoveryStep[];
  rollbackTimeout: number;
}

export interface RecoveryStep {
  action: string;
  parameters: Record<string, any>;
  timeout: number;
  verification: string;
}

/**
 * Core Kill-Switch Manager
 * Performance Target: ≤300ms activation
 */
export class KillSwitchManager {
  private isActive = false;
  private propagationStartTime = 0;
  private evidenceCollector: EvidenceCollectionSystem;
  private policyService: PolicyEvaluationService;
  private recoverySystem: RecoveryProcedures;

  constructor() {
    this.evidenceCollector = new EvidenceCollectionSystem();
    this.policyService = new PolicyEvaluationService();
    this.recoverySystem = new RecoveryProcedures();
  }

  /**
   * Activate global kill-switch
   * CRITICAL: Must complete within 300ms
   */
  async activateKillSwitch(request: KillSwitchRequest): Promise<boolean> {
    this.propagationStartTime = Date.now();
    console.log(`🚨 KILL-SWITCH ACTIVATION STARTED: ${request.reason}`);

    try {
      // Step 1: Policy evaluation (≤50ms)
      const policyDecision = await this.policyService.evaluateKillSwitchRequest(request);
      if (!policyDecision.approved) {
        throw new Error(`Kill-switch denied by policy: ${policyDecision.reasoning}`);
      }

      // Step 2: Stop all agent actions (≤100ms)
      await this.stopAllAgentActions();

      // Step 3: Notify all systems (≤50ms)
      await this.notifyAllSystems(request.reason);

      // Step 4: Collect evidence (≤100ms)
      await this.collectEvidence(request);

      const propagationTime = Date.now() - this.propagationStartTime;

      if (propagationTime > 300) {
        console.error(`❌ KILL-SWITCH PROPAGATION TIMEOUT: ${propagationTime}ms (>300ms limit)`);
        await this.emergencyStop();
        return false;
      }

      this.isActive = true;
      console.log(`✅ KILL-SWITCH ACTIVATED: ${propagationTime}ms`);

      // Step 5: Start evidence collection in background
      this.evidenceCollector.startBackgroundCollection(request);

      return true;

    } catch (error) {
      console.error(`❌ KILL-SWITCH ACTIVATION FAILED: ${error.message}`);
      await this.emergencyStop();
      return false;
    }
  }

  /**
   * Deactivate kill-switch with recovery
   */
  async deactivateKillSwitch(recoveryProcedureId?: string): Promise<boolean> {
    if (!this.isActive) {
      return true; // Already deactivated
    }

    console.log(`🔄 KILL-SWITCH DEACTIVATION STARTED`);

    try {
      if (recoveryProcedureId) {
        const procedure = await this.recoverySystem.getProcedure(recoveryProcedureId);
        if (procedure) {
          await this.recoverySystem.executeRecoveryProcedure(procedure);
        }
      }

      // Resume all agent actions
      await this.resumeAllAgentActions();

      this.isActive = false;
      console.log(`✅ KILL-SWITCH DEACTIVATED`);
      return true;

    } catch (error) {
      console.error(`❌ KILL-SWITCH DEACTIVATION FAILED: ${error.message}`);
      return false;
    }
  }

  private async stopAllAgentActions(): Promise<void> {
    const agentIds = ['A', 'B', 'C', 'D', 'E', 'F'];

    await Promise.all(agentIds.map(async (agentId) => {
      try {
        await this.stopAgentActions(agentId);
      } catch (error) {
        console.error(`Failed to stop agent ${agentId}: ${error.message}`);
      }
    }));
  }

  private async stopAgentActions(agentId: string): Promise<void> {
    // Implementation to stop specific agent actions
    console.log(`⏹️ Stopping agent ${agentId} actions`);
    // TODO: Integrate with MCP system to stop agent tasks
  }

  private async notifyAllSystems(reason: string): Promise<void> {
    console.log(`📢 Notifying all systems: ${reason}`);
    // TODO: Implement system-wide notifications
  }

  private async collectEvidence(request: KillSwitchRequest): Promise<void> {
    const evidence = await this.evidenceCollector.collectKillSwitchEvidence({
      ...request,
      timestamp: new Date().toISOString(),
      propagationTime: Date.now() - this.propagationStartTime
    });

    console.log(`📸 Evidence collected: ${evidence.timestamp}`);
  }

  private async resumeAllAgentActions(): Promise<void> {
    const agentIds = ['A', 'B', 'C', 'D', 'E', 'F'];

    await Promise.all(agentIds.map(async (agentId) => {
      try {
        await this.resumeAgentActions(agentId);
      } catch (error) {
        console.error(`Failed to resume agent ${agentId}: ${error.message}`);
      }
    }));
  }

  private async resumeAgentActions(agentId: string): Promise<void> {
    console.log(`▶️ Resuming agent ${agentId} actions`);
    // TODO: Integrate with MCP system to resume agent tasks
  }

  private async emergencyStop(): Promise<void> {
    console.log(`🚨 EMERGENCY STOP ACTIVATED`);
    this.isActive = true; // Force active state for safety
    // TODO: Implement emergency stop procedures
  }

  get isActiveKillSwitch(): boolean {
    return this.isActive;
  }

  get activationTime(): number {
    return this.propagationStartTime > 0 ? Date.now() - this.propagationStartTime : 0;
  }
}

/**
 * Policy Evaluation Service
 * Real-time decision engine
 */
export class PolicyEvaluationService {
  async evaluateKillSwitchRequest(request: KillSwitchRequest): Promise<PolicyDecision> {
    const startTime = Date.now();

    // Policy rules evaluation
    const severityScore = this.getSeverityScore(request.severity);
    const reasonScore = this.evaluateReason(request.reason);
    const evidenceScore = this.evaluateEvidence(request.evidence);

    const totalScore = (severityScore + reasonScore + evidenceScore) / 3;
    const confidence = Math.min(totalScore, 1.0);

    const decision: PolicyDecision = {
      approved: totalScore > 0.8 || request.severity === 'critical',
      confidence,
      reasoning: `Severity: ${severityScore}, Reason: ${reasonScore}, Evidence: ${evidenceScore}`,
      requiredActions: this.getRequiredActions(request.severity, totalScore)
    };

    const evaluationTime = Date.now() - startTime;
    if (evaluationTime > 100) {
      console.warn(`⚠️ Policy evaluation took ${evaluationTime}ms (>100ms target)`);
    }

    return decision;
  }

  private getSeverityScore(severity: string): number {
    switch (severity) {
      case 'critical': return 1.0;
      case 'high': return 0.8;
      case 'medium': return 0.6;
      case 'low': return 0.4;
      default: return 0.2;
    }
  }

  private evaluateReason(reason: string): number {
    const criticalKeywords = [
      'security breach', 'data leak', 'unauthorized access',
      'system failure', 'corruption', 'attack', 'malicious'
    ];

    const highKeywords = [
      'performance', 'anomaly', 'suspicious', 'unusual',
      'error', 'timeout', 'overload'
    ];

    const lowerReason = reason.toLowerCase();

    if (criticalKeywords.some(keyword => lowerReason.includes(keyword))) {
      return 1.0;
    }

    if (highKeywords.some(keyword => lowerReason.includes(keyword))) {
      return 0.7;
    }

    return 0.5;
  }

  private evaluateEvidence(evidence: any): number {
    if (!evidence) return 0.3;
    if (typeof evidence === 'object' && Object.keys(evidence).length > 0) {
      return 0.8;
    }
    return 0.5;
  }

  private getRequiredActions(severity: string, score: number): string[] {
    const actions = ['log_event', 'notify_administrator'];

    if (severity === 'critical' || score > 0.9) {
      actions.push('immediate_stop', 'collect_full_evidence', 'enable_recovery_mode');
    } else if (severity === 'high' || score > 0.7) {
      actions.push('graceful_stop', 'collect_evidence');
    }

    return actions;
  }
}

/**
 * Evidence Collection System
 * Complete audit trail
 */
export class EvidenceCollectionSystem {
  private backgroundCollectionActive = false;

  async collectKillSwitchEvidence(event: any): Promise<EvidenceReport> {
    const timestamp = new Date().toISOString();

    const [systemState, agentStates, networkActivity, policyDecisions] = await Promise.all([
      this.captureSystemState(),
      this.captureAgentStates(),
      this.captureNetworkActivity(),
      this.capturePolicyDecisions()
    ]);

    return {
      timestamp,
      triggerEvent: event,
      systemState,
      agentStates,
      networkActivity,
      policyDecisions
    };
  }

  startBackgroundCollection(triggerEvent: any): void {
    if (this.backgroundCollectionActive) return;

    this.backgroundCollectionActive = true;
    console.log(`📸 Starting background evidence collection`);

    // TODO: Implement continuous evidence collection
    setInterval(async () => {
      if (this.backgroundCollectionActive) {
        const evidence = await this.collectKillSwitchEvidence(triggerEvent);
        await this.storeEvidence(evidence);
      }
    }, 5000); // Collect every 5 seconds
  }

  stopBackgroundCollection(): void {
    this.backgroundCollectionActive = false;
    console.log(`⏹️ Stopped background evidence collection`);
  }

  private async captureSystemState(): Promise<SystemState> {
    // TODO: Implement actual system state capture
    return {
      activeConnections: 10,
      cpuUsage: Math.random() * 100,
      memoryUsage: Math.random() * 100,
      diskUsage: Math.random() * 100,
      networkLatency: Math.random() * 100
    };
  }

  private async captureAgentStates(): Promise<AgentState[]> {
    // TODO: Integrate with MCP system to get real agent states
    return [
      { agentId: 'A', status: 'stopped', lastHeartbeat: new Date().toISOString() },
      { agentId: 'B', status: 'stopped', lastHeartbeat: new Date().toISOString() },
      { agentId: 'C', status: 'stopped', lastHeartbeat: new Date().toISOString() },
      { agentId: 'D', status: 'stopped', lastHeartbeat: new Date().toISOString() },
      { agentId: 'E', status: 'stopped', lastHeartbeat: new Date().toISOString() },
      { agentId: 'F', status: 'stopped', lastHeartbeat: new Date().toISOString() }
    ];
  }

  private async captureNetworkActivity(): Promise<NetworkActivity> {
    // TODO: Implement actual network monitoring
    return {
      totalRequests: 1000,
      errorRate: Math.random() * 5,
      averageResponseTime: Math.random() * 200,
      activeConnections: 10
    };
  }

  private async capturePolicyDecisions(): Promise<PolicyDecision[]> {
    // TODO: Implement actual policy decision capture
    return [];
  }

  private async storeEvidence(evidence: EvidenceReport): Promise<void> {
    // TODO: Store evidence in database or file system
    console.log(`💾 Evidence stored: ${evidence.timestamp}`);
  }
}

/**
 * Recovery Procedures
 * Safe rollback mechanisms
 */
export class RecoveryProcedures {
  private procedures: Map<string, RecoveryProcedure> = new Map();

  constructor() {
    this.initializeDefaultProcedures();
  }

  async getProcedure(id: string): Promise<RecoveryProcedure | null> {
    return this.procedures.get(id) || null;
  }

  async executeRecoveryProcedure(procedure: RecoveryProcedure): Promise<boolean> {
    console.log(`🔄 Executing recovery procedure: ${procedure.name}`);

    try {
      for (const step of procedure.steps) {
        console.log(`⚙️ Executing step: ${step.action}`);

        // Execute step with timeout
        const stepResult = await this.executeStep(step);

        if (!stepResult.success) {
          throw new Error(`Step failed: ${step.error}`);
        }

        // Verify step completion
        const verificationResult = await this.verifyStep(step);
        if (!verificationResult) {
          throw new Error(`Step verification failed: ${step.action}`);
        }
      }

      console.log(`✅ Recovery procedure completed: ${procedure.name}`);
      return true;

    } catch (error) {
      console.error(`❌ Recovery procedure failed: ${error.message}`);
      return false;
    }
  }

  private async executeStep(step: RecoveryStep): Promise<{ success: boolean; error?: string }> {
    try {
      // TODO: Implement actual step execution
      console.log(`⚙️ Executing: ${step.action} with params:`, step.parameters);

      // Simulate step execution time
      await new Promise(resolve => setTimeout(resolve, Math.random() * 100));

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  private async verifyStep(step: RecoveryStep): Promise<boolean> {
    try {
      // TODO: Implement actual step verification
      console.log(`🔍 Verifying: ${step.verification}`);

      // Simulate verification time
      await new Promise(resolve => setTimeout(resolve, Math.random() * 50));

      return true;
    } catch (error) {
      return false;
    }
  }

  private initializeDefaultProcedures(): void {
    const standardRecovery: RecoveryProcedure = {
      id: 'standard_recovery',
      name: 'Standard System Recovery',
      rollbackTimeout: 30000,
      steps: [
        {
          action: 'validate_system_integrity',
          parameters: { level: 'full' },
          timeout: 5000,
          verification: 'system_health_check_passed'
        },
        {
          action: 'restore_agent_states',
          parameters: { restoreLastKnownGood: true },
          timeout: 10000,
          verification: 'all_agents_responding'
        },
        {
          action: 'verify_connectivity',
          parameters: { testAllEndpoints: true },
          timeout: 5000,
          verification: 'connectivity_restored'
        }
      ]
    };

    this.procedures.set('standard_recovery', standardRecovery);
  }
}

// Export main kill-switch manager instance
export const killSwitchManager = new KillSwitchManager();