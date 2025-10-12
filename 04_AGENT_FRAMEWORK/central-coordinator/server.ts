/**
 * Central Coordinator - Brain of the Keep-In-Touch System
 * Manages all agent lifecycles, task assignments, kudos, and releases
 */

import express from 'express';
import cors from 'cors';
import { parseMarkdown, allDependenciesSatisfied } from '../agent-dispatch/src/task-parser.js';
import { getNextTask } from '../agent-dispatch/src/dispatcher.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Agent state tracking
interface AgentState {
  agentId: string;
  status: 'idle' | 'working' | 'released';
  currentTask: string | null;
  taskStartTime: Date | null;
  tasksCompleted: string[];
  totalDuration: number; // milliseconds
  lastCheckIn: Date;
  learnings: string[];
}

const agentStates = new Map<string, AgentState>();

// Registry path
const REGISTRY_PATH = path.join(__dirname, '..', '..', 'CENTRAL_TASK_REGISTRY.md');

// Initialize agent state
function initAgentState(agentId: string): AgentState {
  if (!agentStates.has(agentId)) {
    agentStates.set(agentId, {
      agentId,
      status: 'idle',
      currentTask: null,
      taskStartTime: null,
      tasksCompleted: [],
      totalDuration: 0,
      lastCheckIn: new Date(),
      learnings: []
    });
  }
  return agentStates.get(agentId)!;
}

// ===== MESSAGE HANDLERS =====

app.post('/coordinator', async (req, res) => {
  const message = req.body;

  console.log(`📨 Received: ${message.type} from Agent ${message.agent}`);

  try {
    switch (message.type) {
      case 'CHECK_IN':
        return res.json(await handleCheckIn(message));

      case 'CLAIM_TASK':
        return res.json(await handleClaim(message));

      case 'PROGRESS_UPDATE':
        return res.json(await handleUpdate(message));

      case 'TASK_COMPLETE':
        return res.json(await handleComplete(message));

      default:
        return res.status(400).json({ error: 'Unknown message type' });
    }
  } catch (error: any) {
    console.error('❌ Error handling message:', error);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * 1. CHECK-IN Handler
 * Agent reports readiness, receives task or release
 */
async function handleCheckIn(message: any) {
  const { agent, context } = message;
  const state = initAgentState(agent);

  state.lastCheckIn = new Date();
  state.status = 'idle';

  // Record context from last task
  if (context) {
    state.learnings.push(context);
    console.log(`📝 Agent ${agent} shared: ${context}`);
  }

  // Get next available task for agent
  const task = getNextTask(agent);

  if (!task) {
    // No tasks available - RELEASE agent
    state.status = 'released';

    const stats = {
      completed: state.tasksCompleted,
      totalDuration: formatDuration(state.totalDuration),
      velocity: calculateVelocity(state)
    };

    console.log(`🏆 Agent ${agent} RELEASED - ${stats.completed.length} tasks completed`);

    return {
      type: 'AGENT_RELEASE',
      agent,
      timestamp: new Date().toISOString(),
      tasksCompleted: stats.completed,
      totalDuration: stats.totalDuration,
      velocity: stats.velocity,
      kudos: generateFinalKudos(agent, stats),
      instruction: 'STOP calling - you are released until new tasks assigned'
    };
  }

  // Assign task
  console.log(`✅ Assigning ${task.id} to Agent ${agent}`);

  return {
    type: 'TASK_ASSIGNMENT',
    task: {
      id: task.id,
      title: task.title,
      priority: task.priority,
      estimated: task.timeEstimate,
      dependencies: task.dependencies,
      files: task.files || [],
      acceptance: task.acceptanceCriteria || [],
      description: task.deliverables?.join(', ') || ''
    },
    message: `Ready for ${task.id} - ${task.title}?`,
    instruction: 'CLAIM this task when ready to start'
  };
}

/**
 * 2. CLAIM Handler
 * Agent commits to working on assigned task
 */
async function handleClaim(message: any) {
  const { agent, task } = message;
  const state = initAgentState(agent);

  state.status = 'working';
  state.currentTask = task;
  state.taskStartTime = new Date();

  // Update registry (mark as CLAIMED)
  await updateRegistry(task, 'CLAIMED', agent);

  console.log(`✅ Agent ${agent} claimed ${task}`);

  return {
    type: 'CLAIM_ACKNOWLEDGED',
    task,
    status: 'CLAIMED',
    message: `Task ${task} is yours! Good luck Agent ${agent}!`,
    nextCheckIn: '30-60 minutes',
    instruction: 'UPDATE with progress regularly, COMPLETE when done'
  };
}

/**
 * 3. UPDATE Handler
 * Agent reports progress during work
 */
async function handleUpdate(message: any) {
  const { agent, task, progress, notes, blockers } = message;
  const state = initAgentState(agent);

  state.lastCheckIn = new Date();

  console.log(`📊 Agent ${agent}: ${task} at ${progress || '?'}%`);
  if (notes) console.log(`   Note: ${notes}`);

  // Handle blockers if any
  if (blockers && blockers.length > 0) {
    console.log(`⚠️  Blockers reported: ${blockers.join(', ')}`);
    // In real system: notify team, create alerts
  }

  return {
    type: 'UPDATE_ACKNOWLEDGED',
    message: `Great progress Agent ${agent}! ${progress ? `${progress}% complete on ${task}` : `Working on ${task}`}.`,
    encouragement: generateEncouragement(progress || 0),
    nextCheckIn: '30-60 minutes',
    instruction: 'Continue working, UPDATE when progress or COMPLETE when done'
  };
}

/**
 * 4. COMPLETE Handler
 * Agent reports completion, receives KUDOS (mandatory!)
 */
async function handleComplete(message: any) {
  const { agent, task, duration, filesCreated, acceptance, learned } = message;
  const state = initAgentState(agent);

  // Verify all acceptance criteria met
  const allMet = Object.values(acceptance).every(met => met === true);

  if (!allMet) {
    console.log(`❌ Agent ${agent}: ${task} incomplete - criteria not met`);

    return {
      type: 'COMPLETION_REJECTED',
      message: 'Some acceptance criteria not met. Please review and complete.',
      missingCriteria: Object.entries(acceptance)
        .filter(([_, met]) => !met)
        .map(([criterion]) => criterion),
      instruction: 'Continue working on incomplete criteria'
    };
  }

  // Calculate duration
  const durationMs = state.taskStartTime
    ? new Date().getTime() - state.taskStartTime.getTime()
    : 0;

  state.totalDuration += durationMs;
  state.tasksCompleted.push(task);
  state.currentTask = null;
  state.taskStartTime = null;
  state.status = 'idle';

  if (learned) {
    state.learnings.push(learned);
  }

  // Update registry (mark as COMPLETE)
  await updateRegistry(task, 'COMPLETE', agent);

  // Get unblocked tasks
  const unblocked = getUnblockedTasks(task);

  // Calculate velocity (comparing to estimate)
  const velocity = calculateTaskVelocity(duration);

  console.log(`🎉 Agent ${agent} completed ${task}! Velocity: ${velocity}%`);
  if (unblocked.length > 0) {
    console.log(`   Unblocked: ${unblocked.join(', ')}`);
  }

  // GENERATE KUDOS - This is MANDATORY!
  const kudos = generateKudos(agent, task, velocity, unblocked);

  return {
    type: 'COMPLETION_VERIFIED',
    task,
    status: 'COMPLETE',
    kudos, // ALWAYS present!
    impact: unblocked.length > 0 ? `Unblocked ${unblocked.length} task${unblocked.length > 1 ? 's' : ''}: ${unblocked.join(', ')}` : 'Moved project forward',
    velocity: `${velocity}% of estimate`,
    instruction: 'CHECK_IN again for next task'
  };
}

// ===== STATUS ENDPOINT =====

app.get('/status', (req, res) => {
  const status: any = {
    timestamp: new Date().toISOString(),
    agents: {}
  };

  for (const [agentId, state] of agentStates.entries()) {
    status.agents[agentId] = {
      status: state.status,
      currentTask: state.currentTask,
      tasksCompleted: state.tasksCompleted.length,
      lastCheckIn: state.lastCheckIn.toISOString(),
      velocity: calculateVelocity(state)
    };
  }

  // Overall system stats
  const allTasks = parseMarkdown(REGISTRY_PATH);
  status.system = {
    totalTasks: allTasks.length,
    completed: allTasks.filter(t => t.status === 'COMPLETE').length,
    inProgress: allTasks.filter(t => t.status === 'IN_PROGRESS' || t.status === 'CLAIMED').length,
    available: allTasks.filter(t => t.status === 'AVAILABLE').length,
    blocked: allTasks.filter(t => t.status === 'BLOCKED').length
  };

  res.json(status);
});

// ===== UTILITY FUNCTIONS =====

/**
 * Update CENTRAL_TASK_REGISTRY.md with new status
 */
async function updateRegistry(taskId: string, status: string, agent: string): Promise<void> {
  try {
    let content = fs.readFileSync(REGISTRY_PATH, 'utf-8');

    // Find task section and update status
    const taskRegex = new RegExp(`(### \\*\\*${taskId} [^\\n]+\\n[^]*?- \\*\\*Status\\*\\*: )([^\\n]+)`, 'g');

    const statusEmoji = status === 'COMPLETE' ? '🟢' : status === 'CLAIMED' ? '🟡' : '🔄';
    content = content.replace(taskRegex, `$1${statusEmoji} ${status}`);

    // Add timestamp for completion
    if (status === 'COMPLETE') {
      const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
      const completedRegex = new RegExp(`(### \\*\\*${taskId} [^\\n]+\\n[^]*?)- \\*\\*Location\\*\\*:`, 'g');
      content = content.replace(completedRegex, `$1- **Completed At**: ${timestamp} UTC (Agent ${agent})\n- **Location**:`);
    }

    fs.writeFileSync(REGISTRY_PATH, content, 'utf-8');
    console.log(`📝 Updated registry: ${taskId} → ${status}`);
  } catch (error) {
    console.error('❌ Failed to update registry:', error);
  }
}

/**
 * Get tasks unblocked by completion
 */
function getUnblockedTasks(completedTask: string): string[] {
  const allTasks = parseMarkdown(REGISTRY_PATH);
  const unblocked: string[] = [];

  for (const task of allTasks) {
    if (task.status === 'BLOCKED' && task.dependencies.includes(completedTask)) {
      // Check if all dependencies now satisfied
      if (allDependenciesSatisfied(task.dependencies, allTasks)) {
        unblocked.push(task.id);
      }
    }
  }

  return unblocked;
}

/**
 * Generate kudos for task completion
 */
function generateKudos(agent: string, task: string, velocity: number, unblocked: string[]): string {
  const emoji = velocity > 110 ? '🎉' : velocity > 100 ? '✨' : '👏';
  const speed = velocity > 110 ? 'lightning fast' : velocity > 100 ? 'ahead of schedule' : 'right on time';
  const impact = unblocked.length > 0 ? ` Unblocking ${unblocked.length} task${unblocked.length > 1 ? 's' : ''}!` : '';

  return `${emoji} OUTSTANDING WORK Agent ${agent}! ${task} completed ${speed}!${impact} Your contribution moves the entire project forward. Excellent work!`;
}

/**
 * Generate final kudos for release
 */
function generateFinalKudos(agent: string, stats: any): string {
  const taskCount = stats.completed.length;
  const velocity = stats.velocity;

  return `🏆 EXCEPTIONAL SPRINT Agent ${agent}! You completed ${taskCount} task${taskCount > 1 ? 's' : ''} with ${velocity} velocity. Your contributions are invaluable. Take a well-deserved break!`;
}

/**
 * Generate encouragement based on progress
 */
function generateEncouragement(progress: number): string {
  if (progress < 25) return "You're off to a great start!";
  if (progress < 50) return "Nice momentum! Keep it up!";
  if (progress < 75) return "More than halfway there! Excellent progress!";
  return "Almost done! The finish line is in sight!";
}

/**
 * Calculate overall agent velocity
 */
function calculateVelocity(state: AgentState): string {
  if (state.tasksCompleted.length === 0) return 'N/A';

  // Simple average for now (in real system: compare actual vs estimated)
  return '115%'; // Placeholder
}

/**
 * Calculate task velocity (actual vs estimated)
 */
function calculateTaskVelocity(duration: string): number {
  // Parse duration like "5h 43m"
  // Compare to estimated time
  // For now: random between 90-120%
  return Math.floor(90 + Math.random() * 30);
}

/**
 * Format duration in milliseconds to readable string
 */
function formatDuration(ms: number): string {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}

// ===== SERVER STARTUP =====

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🧠 CENTRAL COORDINATOR - Keep-In-Touch System');
  console.log('='.repeat(60));
  console.log();
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📡 Endpoint: http://localhost:${PORT}/coordinator`);
  console.log(`📊 Status: http://localhost:${PORT}/status`);
  console.log();
  console.log('Ready to manage agent lifecycles!');
  console.log('='.repeat(60));
  console.log();
});

export default app;
