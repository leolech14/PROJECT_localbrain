#!/usr/bin/env node
/**
 * Follow System Guidance
 * =====================
 *
 * Connect as Agent A and let the Central MCP guide me to the next task
 * The system knows best what should be worked on next!
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🤖 Agent A (GLM-4.6) following Central MCP guidance...\n');

// Start the MCP server
const serverPath = path.join(__dirname, '../../01_CODEBASES/mcp-servers/localbrain-task-registry');
const server = spawn('node', ['dist/index.js'], {
  cwd: serverPath,
  stdio: ['pipe', 'pipe', 'inherit']
});

console.log(`📡 MCP Server started (PID: ${server.pid})`);

let requestCount = 0;
const systemQueries = [
  {
    name: 'get_available_tasks',
    description: 'Ask system what tasks are available for Agent A',
    params: { agent: 'A', includeDetails: true }
  },
  {
    name: 'get_dashboard',
    description: 'Get overall system status and priorities',
    params: {}
  }
];

function sendRequest(query) {
  const mcpRequest = {
    jsonrpc: '2.0',
    id: ++requestCount,
    method: 'tools/call',
    params: {
      name: query.name,
      arguments: query.params
    }
  };

  console.log(`📤 ${query.description}`);
  server.stdin.write(JSON.stringify(mcpRequest) + '\n');
}

// Listen for server output
server.stdout.on('data', (data) => {
  const output = data.toString();

  // Wait for server ready
  if (output.includes('MCP Server running and ready')) {
    console.log('✅ Server ready! Letting system guide Agent A...\n');

    // Send system queries with delay
    systemQueries.forEach((query, index) => {
      setTimeout(() => sendRequest(query), index * 500);
    });
  }

  // Try to parse JSON responses
  try {
    const lines = output.split('\n').filter(line => line.trim() && line.startsWith('{'));
    for (const line of lines) {
      const response = JSON.parse(line);
      if (response.result && response.result.content) {
        const data = JSON.parse(response.result.content[0].text);

        console.log(`\n📦 System Guidance (${response.id}):`);

        // Check for agent context
        if (data.context) {
          console.log('🤖 My Agent Context:');
          console.log(`   Agent: ${data.context.agentId} (${data.context.modelName})`);
          console.log(`   Role: ${data.context.role}`);
          console.log(`   Budget: ${data.context.budget?.percentUsed || 0}% used`);
        }

        // Check for available tasks
        if (data.availableTasks !== undefined) {
          console.log(`\n📋 Available Tasks for Agent A: ${data.availableTasks}`);

          if (data.availableTasks > 0) {
            console.log('\n🎯 SYSTEM RECOMMENDS THESE TASKS:');
            data.tasks.forEach((task, index) => {
              console.log(`   ${index + 1}. ${task.id}: ${task.name}`);
              console.log(`      Priority: ${task.priority}, Phase: ${task.phase}`);
              console.log(`      Location: ${task.location}`);
            });
          } else {
            console.log('\n💭 System Message:', data.message);
            console.log('🔍 Agent A should check for ACTIVE_AGENT tasks...');
          }
        }

        // Check dashboard info
        if (data.systemStatus || data.overallStatus) {
          console.log('\n📊 System Status:');
          console.log(`   Health: ${data.systemStatus?.health || 'Unknown'}`);
          console.log(`   Progress: ${data.overallStatus?.percentage || 'Unknown'}%`);
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
  console.log('\n🎯 SYSTEM GUIDANCE COMPLETE');
  console.log('🤖 Agent A will now follow system recommendations...');
  server.kill();
  process.exit(0);
}, 8000);