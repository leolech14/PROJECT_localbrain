#!/usr/bin/env node
/**
 * Claim Next Task via MCP System
 * =============================
 *
 * Agent A claims T004 (Grid System Foundation) since system shows:
 * - No dependencies (ready to work)
 * - IN_PROGRESS status (work started)
 * - Perfect match for UI Velocity Specialist
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🤖 Agent A claiming next task via Central MCP system...\n');

// Start the MCP server
const serverPath = path.join(__dirname, '../../01_CODEBASES/mcp-servers/localbrain-task-registry');
const server = spawn('node', ['dist/index.js'], {
  cwd: serverPath,
  stdio: ['pipe', 'pipe', 'inherit']
});

console.log(`📡 MCP Server started (PID: ${server.pid})`);

let requestCount = 0;
const workflow = [
  {
    name: 'claim_task',
    description: 'Agent A claims T004 (Grid System Foundation)',
    params: { agent: 'A', taskId: 'T004' }
  },
  {
    name: 'get_available_tasks',
    description: 'Check updated task status after claim',
    params: { agent: 'A', includeDetails: true }
  }
];

function sendRequest(action) {
  const mcpRequest = {
    jsonrpc: '2.0',
    id: ++requestCount,
    method: 'tools/call',
    params: {
      name: action.name,
      arguments: action.params
    }
  };

  console.log(`📤 ${action.description}`);
  server.stdin.write(JSON.stringify(mcpRequest) + '\n');
}

// Listen for server output
server.stdout.on('data', (data) => {
  const output = data.toString();

  // Wait for server ready
  if (output.includes('MCP Server running and ready')) {
    console.log('✅ Server ready! Agent A claiming T004...\n');

    // Send workflow requests with delay
    workflow.forEach((action, index) => {
      setTimeout(() => sendRequest(action), index * 1000);
    });
  }

  // Try to parse JSON responses
  try {
    const lines = output.split('\n').filter(line => line.trim() && line.startsWith('{'));
    for (const line of lines) {
      const response = JSON.parse(line);
      if (response.result && response.result.content) {
        const data = JSON.parse(response.result.content[0].text);

        console.log(`\n📦 System Response (${response.id}):`);

        if (data.claimed) {
          console.log(`✅ TASK CLAIMED SUCCESSFULLY!`);
          console.log(`   Task ID: ${data.taskId}`);
          console.log(`   Agent: ${data.agent}`);
          console.log(`   Status: ${data.status}`);
          console.log(`   Started: ${data.startedAt}`);
        } else if (data.success === false) {
          console.log(`❌ CLAIM FAILED: ${data.message}`);
        } else if (data.availableTasks !== undefined) {
          console.log(`📋 Available Tasks: ${data.availableTasks}`);
          if (data.availableTasks === 0) {
            console.log(`💭 ${data.message}`);
          }
        }

        console.log('─'.repeat(60));
      } else if (response.error) {
        console.log(`\n❌ System Error:`);
        console.log(JSON.stringify(response.error, null, 2));
        console.log('─'.repeat(60));
      }
    }
  } catch (e) {
    // Not JSON, ignore
  }
});

// Handle errors
server.on('error', (error) => {
  console.error('❌ Server error:', error);
  process.exit(1);
});

// Cleanup after timeout
setTimeout(() => {
  console.log('\n🎯 TASK CLAIMING WORKFLOW COMPLETE');
  console.log('🤖 Agent A will now work on the claimed task...');
  server.kill();
  process.exit(0);
}, 8000);