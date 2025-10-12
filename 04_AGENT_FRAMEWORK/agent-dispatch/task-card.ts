/**
 * Task Card Formatter - Beautiful CLI display of assigned tasks
 * Shows agents exactly what to do and how to do it
 */

import { Task } from './task-parser.js';

const AGENT_NAMES: { [key: string]: string } = {
  'A': 'UI VELOCITY SPECIALIST',
  'B': 'DESIGN SYSTEM SPECIALIST',
  'C': 'BACKEND SERVICES SPECIALIST',
  'D': 'INTEGRATION SPECIALIST',
  'E': 'GROUND SUPERVISOR',
  'F': 'STRATEGIC SUPERVISOR'
};

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

export function formatTaskCard(task: Task, agentId: string): string {
  const agentName = AGENT_NAMES[agentId] || 'AGENT';
  const lines: string[] = [];

  // Header
  lines.push('');
  lines.push('━'.repeat(80));
  lines.push(`${COLORS.cyan}${COLORS.bright}🎯 AGENT ${agentId} - ${agentName}${COLORS.reset}`);
  lines.push('━'.repeat(80));
  lines.push('');

  // Task info
  lines.push(`${COLORS.bright}YOUR CURRENT TASK:${COLORS.reset}`);
  lines.push(`${COLORS.green}📋 ${task.id} - ${task.title}${COLORS.reset}`);
  lines.push(`⏱️  ${task.timeline}`);
  lines.push(`🎯 ${task.priority} Priority`);

  // Dependencies
  if (task.dependencies.length > 0) {
    lines.push(`✅ Dependencies: ${task.dependencies.join(', ')} (all complete)`);
  } else {
    lines.push(`✅ No dependencies - ready to start`);
  }

  lines.push('');
  lines.push('━'.repeat(80));
  lines.push(`${COLORS.bright}WHAT YOU'RE BUILDING:${COLORS.reset}`);
  lines.push('━'.repeat(80));
  lines.push('');

  // Description
  const descLines = task.description.split('\n').filter(l => l.trim());
  descLines.forEach(line => {
    lines.push(`  ${line}`);
  });

  lines.push('');
  lines.push('━'.repeat(80));
  lines.push(`${COLORS.bright}FILES TO CREATE:${COLORS.reset}`);
  lines.push('━'.repeat(80));
  lines.push('');

  // Files
  if (task.filesToCreate.length > 0) {
    task.filesToCreate.forEach((file, idx) => {
      lines.push(`  ${idx + 1}. ${COLORS.yellow}${file}${COLORS.reset}`);
    });
  } else {
    lines.push(`  ${COLORS.yellow}Check task specification for file details${COLORS.reset}`);
  }

  lines.push('');
  lines.push('━'.repeat(80));
  lines.push(`${COLORS.bright}ACCEPTANCE CRITERIA:${COLORS.reset}`);
  lines.push('━'.repeat(80));
  lines.push('');

  // Acceptance criteria
  if (task.acceptanceCriteria.length > 0) {
    task.acceptanceCriteria.forEach(criterion => {
      lines.push(`  [ ] ${criterion}`);
    });
  } else {
    lines.push(`  ${COLORS.yellow}Check CENTRAL_TASK_REGISTRY.md for detailed criteria${COLORS.reset}`);
  }

  // Location hint
  if (task.location) {
    lines.push('');
    lines.push('━'.repeat(80));
    lines.push(`${COLORS.bright}LOCATION:${COLORS.reset}`);
    lines.push('━'.repeat(80));
    lines.push('');
    lines.push(`  ${COLORS.blue}${task.location}${COLORS.reset}`);
  }

  lines.push('');
  lines.push('━'.repeat(80));
  lines.push('');

  lines.push(`${COLORS.green}⚡ READY TO START!${COLORS.reset}`);
  lines.push('');
  lines.push(`When complete, commit with message: "${task.id}: [description]"`);
  lines.push(`System will automatically detect completion and assign next task.`);
  lines.push('');

  return lines.join('\n');
}

export function formatNoTasksMessage(agentId: string, stats: any): string {
  const agentName = AGENT_NAMES[agentId] || 'AGENT';
  const lines: string[] = [];

  lines.push('');
  lines.push('━'.repeat(80));
  lines.push(`${COLORS.cyan}${COLORS.bright}🎯 AGENT ${agentId} - ${agentName}${COLORS.reset}`);
  lines.push('━'.repeat(80));
  lines.push('');

  lines.push(`${COLORS.yellow}📊 NO AVAILABLE TASKS${COLORS.reset}`);
  lines.push('');

  lines.push(`${COLORS.bright}Your Task Status:${COLORS.reset}`);
  lines.push(`  ✅ Complete: ${stats.complete}`);
  lines.push(`  🔄 In Progress: ${stats.inProgress}`);
  lines.push(`  🟡 Claimed: ${stats.claimed}`);
  lines.push(`  🔒 Blocked: ${stats.blocked}`);
  lines.push('');

  if (stats.inProgress > 0) {
    lines.push(`${COLORS.green}Continue working on your IN_PROGRESS task.${COLORS.reset}`);
  } else if (stats.claimed > 0) {
    lines.push(`${COLORS.green}Start working on your CLAIMED task.${COLORS.reset}`);
  } else if (stats.blocked > 0) {
    lines.push(`${COLORS.yellow}Your tasks are blocked on dependencies.${COLORS.reset}`);
    lines.push(`Check CENTRAL_TASK_REGISTRY.md for blocker details.`);
  } else {
    lines.push(`${COLORS.green}🎉 All your tasks are complete!${COLORS.reset}`);
    lines.push(`Excellent work! Check with other agents or Lech for new assignments.`);
  }

  lines.push('');
  lines.push('━'.repeat(80));
  lines.push('');

  return lines.join('\n');
}

export function formatTaskList(tasks: Task[], agentId: string): string {
  const agentName = AGENT_NAMES[agentId] || 'AGENT';
  const lines: string[] = [];

  lines.push('');
  lines.push('━'.repeat(80));
  lines.push(`${COLORS.cyan}${COLORS.bright}🎯 AGENT ${agentId} - ${agentName}${COLORS.reset}`);
  lines.push('━'.repeat(80));
  lines.push('');

  lines.push(`${COLORS.bright}YOUR TASKS (${tasks.length} total):${COLORS.reset}`);
  lines.push('');

  // Group by status
  const byStatus = {
    'AVAILABLE': tasks.filter(t => t.status === 'AVAILABLE'),
    'IN_PROGRESS': tasks.filter(t => t.status === 'IN_PROGRESS'),
    'CLAIMED': tasks.filter(t => t.status === 'CLAIMED'),
    'BLOCKED': tasks.filter(t => t.status === 'BLOCKED'),
    'COMPLETE': tasks.filter(t => t.status === 'COMPLETE')
  };

  if (byStatus.AVAILABLE.length > 0) {
    lines.push(`${COLORS.green}✅ AVAILABLE (${byStatus.AVAILABLE.length}):${COLORS.reset}`);
    byStatus.AVAILABLE.forEach(t => {
      lines.push(`  ${t.id}: ${t.title} (${t.priority})`);
    });
    lines.push('');
  }

  if (byStatus.IN_PROGRESS.length > 0) {
    lines.push(`${COLORS.yellow}🔄 IN PROGRESS (${byStatus.IN_PROGRESS.length}):${COLORS.reset}`);
    byStatus.IN_PROGRESS.forEach(t => {
      lines.push(`  ${t.id}: ${t.title}`);
    });
    lines.push('');
  }

  if (byStatus.CLAIMED.length > 0) {
    lines.push(`${COLORS.cyan}🟡 CLAIMED (${byStatus.CLAIMED.length}):${COLORS.reset}`);
    byStatus.CLAIMED.forEach(t => {
      lines.push(`  ${t.id}: ${t.title}`);
    });
    lines.push('');
  }

  if (byStatus.BLOCKED.length > 0) {
    lines.push(`${COLORS.magenta}🔒 BLOCKED (${byStatus.BLOCKED.length}):${COLORS.reset}`);
    byStatus.BLOCKED.forEach(t => {
      const deps = t.dependencies.join(', ');
      lines.push(`  ${t.id}: ${t.title} (waiting on: ${deps})`);
    });
    lines.push('');
  }

  lines.push('━'.repeat(80));
  lines.push('');

  return lines.join('\n');
}
