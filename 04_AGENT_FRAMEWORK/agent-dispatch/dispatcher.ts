/**
 * Auto-Dispatch Engine - Assigns tasks to agents automatically
 * PUSH not PULL: System tells agents what to do
 */

import { Task, parseMarkdown, allDependenciesSatisfied } from './task-parser.js';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Navigate up to LocalBrain root, then to 04_AGENT_FRAMEWORK
const REGISTRY_PATH = path.join(__dirname, '..', '..', '..', '04_AGENT_FRAMEWORK', 'CENTRAL_TASK_REGISTRY.md');

export function getNextTask(agentId: string): Task | null {
  // 1. Parse all tasks from markdown
  const allTasks = parseMarkdown(REGISTRY_PATH);

  // 2. Filter for agent + AVAILABLE status + dependencies satisfied
  const available = allTasks.filter(t =>
    t.agent.includes(agentId) && // Agent assignment (handles "Agent D" format)
    t.status === 'AVAILABLE' &&
    allDependenciesSatisfied(t.dependencies, allTasks)
  );

  if (available.length === 0) {
    return null;
  }

  // 3. Sort by priority (P0 > P1 > P2) then by critical path
  const sorted = sortByPriority(available, allTasks);

  // 4. Return highest priority task
  return sorted[0];
}

function sortByPriority(tasks: Task[], allTasks: Task[]): Task[] {
  return tasks.sort((a, b) => {
    // Priority comparison
    const priorityOrder: { [key: string]: number } = {
      'P0': 0,
      'P1': 1,
      'P2': 2,
      'P3': 3
    };

    const aPriority = extractPriorityLevel(a.priority);
    const bPriority = extractPriorityLevel(b.priority);

    const aPriorityValue = priorityOrder[aPriority] ?? 999;
    const bPriorityValue = priorityOrder[bPriority] ?? 999;

    if (aPriorityValue !== bPriorityValue) {
      return aPriorityValue - bPriorityValue; // Lower number = higher priority
    }

    // If same priority, prefer critical path tasks
    const aOnCriticalPath = isOnCriticalPath(a, allTasks);
    const bOnCriticalPath = isOnCriticalPath(b, allTasks);

    if (aOnCriticalPath && !bOnCriticalPath) return -1;
    if (!aOnCriticalPath && bOnCriticalPath) return 1;

    // If still tied, prefer tasks with more dependent tasks
    const aDependentCount = countDependentTasks(a.id, allTasks);
    const bDependentCount = countDependentTasks(b.id, allTasks);

    return bDependentCount - aDependentCount; // More dependents = higher priority
  });
}

function extractPriorityLevel(priority: string): string {
  const match = priority.match(/P(\d)/);
  return match ? `P${match[1]}` : 'P2';
}

function isOnCriticalPath(task: Task, allTasks: Task[]): boolean {
  // A task is on critical path if it has:
  // 1. High priority (P0 or P1)
  // 2. Multiple tasks depending on it
  // 3. Blocks a chain of tasks

  const priorityLevel = extractPriorityLevel(task.priority);
  if (priorityLevel === 'P0') return true;

  const dependentCount = countDependentTasks(task.id, allTasks);
  return dependentCount >= 2;
}

function countDependentTasks(taskId: string, allTasks: Task[]): number {
  return allTasks.filter(t => t.dependencies.includes(taskId)).length;
}

export function getAllTasksForAgent(agentId: string): Task[] {
  const allTasks = parseMarkdown(REGISTRY_PATH);

  return allTasks.filter(t =>
    t.agent.includes(agentId) &&
    t.status !== 'COMPLETE'
  ).sort((a, b) => {
    // Sort by status priority: AVAILABLE > IN_PROGRESS > CLAIMED > BLOCKED
    const statusPriority: { [key: string]: number } = {
      'AVAILABLE': 0,
      'IN_PROGRESS': 1,
      'CLAIMED': 2,
      'BLOCKED': 3
    };

    const aStatusValue = statusPriority[a.status] ?? 999;
    const bStatusValue = statusPriority[b.status] ?? 999;

    return aStatusValue - bStatusValue;
  });
}

export function getTaskStats(agentId?: string) {
  const allTasks = parseMarkdown(REGISTRY_PATH);

  const filter = agentId
    ? (t: Task) => t.agent.includes(agentId)
    : (_: Task) => true;

  const filteredTasks = allTasks.filter(filter);

  return {
    total: filteredTasks.length,
    complete: filteredTasks.filter(t => t.status === 'COMPLETE').length,
    inProgress: filteredTasks.filter(t => t.status === 'IN_PROGRESS').length,
    claimed: filteredTasks.filter(t => t.status === 'CLAIMED').length,
    available: filteredTasks.filter(t =>
      t.status === 'AVAILABLE' &&
      allDependenciesSatisfied(t.dependencies, allTasks)
    ).length,
    blocked: filteredTasks.filter(t => t.status === 'BLOCKED').length
  };
}
