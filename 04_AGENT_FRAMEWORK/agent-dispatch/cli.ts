#!/usr/bin/env node
/**
 * Agent Auto-Dispatch CLI
 * Simple entry point that shows agents their next task
 */

import { getNextTask, getAllTasksForAgent, getTaskStats } from './dispatcher.js';
import { formatTaskCard, formatNoTasksMessage, formatTaskList } from './task-card.js';

async function main() {
  const args = process.argv.slice(2);

  // Get agent ID from args or environment
  const agentId = args[0] || process.env.AGENT_ID || promptForAgentId();

  if (!agentId || !['A', 'B', 'C', 'D', 'E', 'F'].includes(agentId)) {
    console.error('Usage: node cli.js [A|B|C|D|E|F]');
    console.error('   or: AGENT_ID=C node cli.js');
    console.error('   or: export AGENT_ID=C');
    process.exit(1);
  }

  // Check for --list flag
  if (args.includes('--list') || args.includes('-l')) {
    const allTasks = getAllTasksForAgent(agentId);
    console.log(formatTaskList(allTasks, agentId));
    return;
  }

  // Get next task for agent
  const task = getNextTask(agentId);

  if (task) {
    // Display task card
    console.log(formatTaskCard(task, agentId));
  } else {
    // No available tasks
    const stats = getTaskStats(agentId);
    console.log(formatNoTasksMessage(agentId, stats));
  }
}

function promptForAgentId(): string {
  console.log('\n🎯 Which agent are you?');
  console.log('  A - UI Velocity Specialist (GLM-4.6)');
  console.log('  B - Design System Specialist (Sonnet-4.5)');
  console.log('  C - Backend Services Specialist (GLM-4.6)');
  console.log('  D - Integration Specialist (Sonnet-4.5)');
  console.log('  E - Ground Supervisor (Gemini 2.5 Pro)');
  console.log('  F - Strategic Supervisor (ChatGPT-5)');
  console.log('\nSet AGENT_ID environment variable or pass as argument.\n');
  return '';
}

// Run main function
main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
