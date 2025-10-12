/**
 * Autonomous Agent Keep-In-Touch Client
 * Handles automatic check-ins, progress updates, and lifecycle management
 */

import fetch from 'node-fetch';

export interface TaskAssignment {
  id: string;
  title: string;
  priority: string;
  estimated: string;
  dependencies: string[];
  files: string[];
  acceptance: string[];
  description: string;
}

export interface CheckInResponse {
  type: 'TASK_ASSIGNMENT' | 'AGENT_RELEASE';
  task?: TaskAssignment;
  message: string;
  instruction: string;
  kudos?: string;
  tasksCompleted?: string[];
  totalDuration?: string;
  velocity?: string;
}

export interface ProgressUpdate {
  progress?: number;
  filesCreated?: string[];
  filesModified?: string[];
  linesOfCode?: number;
  notes?: string;
  blockers?: string[];
  learned?: string;
}

export class AgentClient {
  private agentId: string;
  private currentTask: TaskAssignment | null = null;
  private checkInInterval: NodeJS.Timeout | null = null;
  private isReleased: boolean = false;
  private coordinatorUrl: string;
  private taskStartTime: Date | null = null;

  constructor(agentId: string, coordinatorUrl: string = 'http://localhost:3000/coordinator') {
    this.agentId = agentId;
    this.coordinatorUrl = coordinatorUrl;
  }

  /**
   * CHECK-IN: Start the autonomous lifecycle
   * Agent reports readiness and receives next task or release
   */
  async checkIn(context?: string): Promise<TaskAssignment | null> {
    const response = await this.send({
      type: 'CHECK_IN',
      agent: this.agentId,
      timestamp: new Date().toISOString(),
      status: 'ready',
      lastTask: this.currentTask?.id,
      context
    });

    if (response.type === 'AGENT_RELEASE') {
      this.handleRelease(response);
      return null;
    }

    // System assigned a task
    return response.task || null;
  }

  /**
   * CLAIM: Accept assigned task
   * Agent commits to working on this task
   */
  async claimTask(taskId: string): Promise<void> {
    const task = this.currentTask || { id: taskId };

    const response = await this.send({
      type: 'CLAIM_TASK',
      agent: this.agentId,
      task: taskId,
      timestamp: new Date().toISOString(),
      estimatedCompletion: this.calculateEstimatedCompletion(task)
    });

    this.taskStartTime = new Date();

    // Start automatic progress updates every 30-60 minutes
    this.startAutoUpdates();

    console.log(`✅ ${response.message}`);
    console.log(`📋 ${response.instruction}\n`);
  }

  /**
   * UPDATE: Manual or automatic progress reporting
   * Agent reports progress during work
   */
  async updateProgress(update: ProgressUpdate): Promise<void> {
    if (!this.currentTask) {
      throw new Error('No active task to update');
    }

    const response = await this.send({
      type: 'PROGRESS_UPDATE',
      agent: this.agentId,
      task: this.currentTask.id,
      timestamp: new Date().toISOString(),
      ...update
    });

    console.log(`📊 ${response.message}`);
    if (response.encouragement) {
      console.log(`💪 ${response.encouragement}`);
    }
    console.log(`⏰ ${response.instruction}\n`);
  }

  /**
   * COMPLETE: Report task completion
   * Agent submits work and waits for kudos
   */
  async completeTask(
    filesCreated: string[],
    filesModified: string[],
    notes: string,
    acceptance: Record<string, boolean>,
    learned?: string
  ): Promise<string> {
    if (!this.currentTask) {
      throw new Error('No active task to complete');
    }

    // Stop automatic updates
    this.stopAutoUpdates();

    // Calculate duration
    const duration = this.taskStartTime
      ? this.formatDuration(new Date().getTime() - this.taskStartTime.getTime())
      : 'unknown';

    const response = await this.send({
      type: 'TASK_COMPLETE',
      agent: this.agentId,
      task: this.currentTask.id,
      timestamp: new Date().toISOString(),
      duration,
      filesCreated,
      filesModified,
      linesOfCode: this.estimateLines(filesCreated, filesModified),
      acceptance,
      notes,
      learned
    });

    // WAIT FOR KUDOS - this is mandatory!
    if (!response.kudos) {
      throw new Error('NO KUDOS RECEIVED - System must acknowledge completion!');
    }

    console.log(`\n🎉 KUDOS:\n${response.kudos}\n`);
    if (response.impact) {
      console.log(`📈 Impact: ${response.impact}`);
    }
    if (response.velocity) {
      console.log(`⚡ Velocity: ${response.velocity}`);
    }
    console.log();

    this.currentTask = null;
    this.taskStartTime = null;

    return response.kudos;
  }

  /**
   * Check if agent is released (no more work)
   */
  isAgentReleased(): boolean {
    return this.isReleased;
  }

  /**
   * Get current task
   */
  getCurrentTask(): TaskAssignment | null {
    return this.currentTask;
  }

  /**
   * Set current task (after check-in assigns it)
   */
  setCurrentTask(task: TaskAssignment): void {
    this.currentTask = task;
  }

  // ===== PRIVATE METHODS =====

  /**
   * Start automatic progress updates every 30-60 minutes
   */
  private startAutoUpdates(): void {
    // Random interval between 30-60 minutes (for demo: 2-5 minutes)
    const minMinutes = process.env.NODE_ENV === 'demo' ? 2 : 30;
    const maxMinutes = process.env.NODE_ENV === 'demo' ? 5 : 60;
    const interval = (minMinutes + Math.random() * (maxMinutes - minMinutes)) * 60 * 1000;

    this.checkInInterval = setInterval(async () => {
      // Only update if we have a task
      if (this.currentTask) {
        await this.updateProgress({
          notes: 'Automatic progress check-in',
        });
      }
    }, interval);
  }

  /**
   * Stop automatic updates
   */
  private stopAutoUpdates(): void {
    if (this.checkInInterval) {
      clearInterval(this.checkInInterval);
      this.checkInInterval = null;
    }
  }

  /**
   * Handle agent release (no more tasks)
   */
  private handleRelease(response: any): void {
    this.isReleased = true;
    this.stopAutoUpdates();

    console.log(`\n${'='.repeat(60)}`);
    console.log(`🏆 AGENT RELEASE`);
    console.log('='.repeat(60));
    console.log();
    console.log(response.kudos);
    console.log();
    console.log(`📊 Tasks Completed: ${response.tasksCompleted?.length || 0}`);
    console.log(`⏱️  Total Duration: ${response.totalDuration || 'N/A'}`);
    console.log(`⚡ Overall Velocity: ${response.velocity || 'N/A'}`);
    console.log();
    console.log('✅ You have been released. No more tasks available.');
    console.log('💤 Agent lifecycle complete. Stopping automatic check-ins.');
    console.log('='.repeat(60));
    console.log();
  }

  /**
   * Send message to Central Coordinator
   */
  private async send(message: any): Promise<any> {
    try {
      const response = await fetch(this.coordinatorUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message)
      });

      if (!response.ok) {
        throw new Error(`Coordinator error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Failed to connect to Central Coordinator:', error);
      throw error;
    }
  }

  /**
   * Calculate estimated completion time
   */
  private calculateEstimatedCompletion(task: any): string {
    // Parse estimated time (e.g., "6 hours")
    const hours = parseInt(task.estimated) || 8;
    const completion = new Date();
    completion.setHours(completion.getHours() + hours);
    return completion.toISOString();
  }

  /**
   * Format duration in human-readable form
   */
  private formatDuration(ms: number): string {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  }

  /**
   * Estimate lines of code from file list
   */
  private estimateLines(created: string[], modified: string[]): number {
    // Rough estimate: 100 lines per created file, 50 per modified
    return (created.length * 100) + (modified.length * 50);
  }
}
