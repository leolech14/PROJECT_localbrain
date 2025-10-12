#!/usr/bin/env node
/**
 * Autonomous Agent CLI with Keep-In-Touch
 * Self-managing agent that checks in, works, and reports back automatically
 */

import { AgentClient, TaskAssignment } from './agent-client.js';

// Agent names mapping
const AGENT_NAMES: Record<string, string> = {
  'A': 'UI VELOCITY SPECIALIST',
  'B': 'DESIGN SYSTEM SPECIALIST',
  'C': 'BACKEND SERVICES SPECIALIST',
  'D': 'INTEGRATION SPECIALIST',
  'E': 'GROUND SUPERVISOR',
  'F': 'STRATEGIC SUPERVISOR'
};

async function main() {
  const agentId = process.env.AGENT_ID;

  if (!agentId) {
    console.error('❌ Error: AGENT_ID environment variable not set');
    console.error('Usage: AGENT_ID=C node dist/cli-autonomous.js');
    process.exit(1);
  }

  const agentName = AGENT_NAMES[agentId] || 'UNKNOWN AGENT';
  const coordinatorUrl = process.env.COORDINATOR_URL || 'http://localhost:3000/coordinator';

  const agent = new AgentClient(agentId, coordinatorUrl);

  console.log('\n' + '='.repeat(60));
  console.log(`🤖 Agent ${agentId} - ${agentName}`);
  console.log('='.repeat(60));
  console.log();
  console.log('Starting autonomous lifecycle...');
  console.log(`Connected to: ${coordinatorUrl}`);
  console.log();

  // AUTONOMOUS LIFECYCLE LOOP
  let cycleCount = 0;

  while (!agent.isAgentReleased()) {
    cycleCount++;

    console.log('-'.repeat(60));
    console.log(`🔄 Cycle ${cycleCount}: Checking in with Central Coordinator...`);
    console.log('-'.repeat(60));
    console.log();

    try {
      // 1. CHECK-IN
      const task = await agent.checkIn(
        cycleCount === 1 ? undefined : 'Completed previous task successfully'
      );

      if (!task) {
        // Released - stop loop
        break;
      }

      // Store task in agent
      agent.setCurrentTask(task);

      // Display task assignment
      displayTask(task);

      // 2. CLAIM
      console.log('📝 Claiming task...\n');
      await agent.claimTask(task.id);

      // 3. WORK (simulated - in reality, agent does actual work)
      console.log('💻 Working on task...\n');
      await simulateWork(agent, task);

      // 4. COMPLETE
      console.log('📦 Task complete! Reporting to coordinator...\n');

      const kudos = await agent.completeTask(
        task.files, // files created
        [], // files modified
        'All acceptance criteria met. Task completed successfully.',
        // All acceptance criteria true
        task.acceptance.reduce((acc: Record<string, boolean>, criterion: string) => {
          acc[criterion.replace(/[^a-zA-Z0-9]/g, '_')] = true;
          return acc;
        }, {}),
        `Learned about ${task.title} implementation patterns`
      );

      console.log('─'.repeat(60));
      console.log();

      // Small delay before next check-in
      await sleep(2000);

    } catch (error: any) {
      console.error('❌ Error in agent lifecycle:', error.message);

      // If coordinator unavailable, exit gracefully
      if (error.message.includes('Failed to connect')) {
        console.log('\n⚠️  Central Coordinator unavailable. Exiting gracefully.\n');
        break;
      }

      // Otherwise, retry after delay
      console.log('⏳ Retrying in 30 seconds...\n');
      await sleep(30000);
    }
  }

  console.log('✅ Agent lifecycle complete. Goodbye!\n');
}

/**
 * Display task assignment in beautiful format
 */
function displayTask(task: TaskAssignment): void {
  console.log('✅ TASK ASSIGNED\n');
  console.log(`📋 ${task.id} - ${task.title}`);
  console.log(`🎯 Priority: ${task.priority}`);
  console.log(`⏱️  Estimated: ${task.estimated}`);

  if (task.dependencies.length > 0) {
    console.log(`🔗 Dependencies: ${task.dependencies.join(', ')}`);
  } else {
    console.log('🔗 Dependencies: None (ready to start)');
  }

  console.log();
  console.log('📝 WHAT TO BUILD:');
  console.log(`   ${task.description || 'See acceptance criteria below'}`);
  console.log();

  console.log('✅ ACCEPTANCE CRITERIA:');
  task.acceptance.forEach((criterion, i) => {
    console.log(`   ${i + 1}. ${criterion}`);
  });
  console.log();

  if (task.files.length > 0) {
    console.log('📁 FILES TO CREATE:');
    task.files.forEach(file => {
      console.log(`   - ${file}`);
    });
    console.log();
  }
}

/**
 * Simulate agent work with periodic progress updates
 */
async function simulateWork(agent: AgentClient, task: TaskAssignment): Promise<void> {
  const isDemoMode = process.env.NODE_ENV === 'demo';
  const updateInterval = isDemoMode ? 3000 : 15 * 60 * 1000; // 3s demo, 15min real

  const progressSteps = [
    { progress: 25, note: 'Initial setup and planning complete' },
    { progress: 50, note: 'Core implementation in progress' },
    { progress: 75, note: 'Testing and refinement' },
  ];

  for (const step of progressSteps) {
    await sleep(updateInterval);

    // Create some files as we progress
    const filesCreated = task.files.slice(0, Math.floor(task.files.length * step.progress / 100));

    await agent.updateProgress({
      progress: step.progress,
      filesCreated,
      notes: step.note,
      blockers: [],
      learned: step.progress === 50 ? 'Discovered efficient implementation pattern' : undefined
    });
  }

  // Final work to 100%
  await sleep(updateInterval);
}

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}
