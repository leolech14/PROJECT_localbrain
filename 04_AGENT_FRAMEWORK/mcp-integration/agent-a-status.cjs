#!/usr/bin/env node
/**
 * Agent A Status Check
 * ===================
 *
 * Query detailed status for Agent A including all tasks and history
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🤖 Agent A (GLM-4.6) querying detailed status...\n');

// Start the MCP server
const serverPath = path.join(__dirname, '../../01_CODEBASES/mcp-servers/localbrain-task-registry');
const server = spawn('node', ['dist/index.js'], {
  cwd: serverPath,
  stdio: ['pipe', 'pipe', 'inherit']
});

console.log(`📡 MCP Server started (PID: ${server.pid})`);

let requestCount = 0;
const requests = [
  {
    name: 'get_agent_status',
    params: { agent: 'A' }
  },
  {
    name: 'get_available_tasks',
    params: { agent: 'A', includeDetails: true }
  },
  {
    name: 'get_dashboard',
    params: {}
  }
];

function sendRequest(request) {
  const mcpRequest = {
    jsonrpc: '2.0',
    id: ++requestCount,
    method: 'tools/call',
    params: {
      name: request.name,
      arguments: request.params
    }
  };

  console.log(`📤 Sending: ${request.name}`);
  server.stdin.write(JSON.stringify(mcpRequest) + '\n');
}

// Listen for server output
server.stdout.on('data', (data) => {
  const output = data.toString();

  // Wait for server ready
  if (output.includes('MCP Server running and ready')) {
    console.log('✅ Server ready! Sending status requests...\n');

    // Send all requests with delay
    requests.forEach((req, index) => {
      setTimeout(() => sendRequest(req), index * 500);
    });
  }

  // Try to parse JSON responses
  try {
    const lines = output.split('\n').filter(line => line.trim() && line.startsWith('{'));
    for (const line of lines) {
      const response = JSON.parse(line);
      if (response.result && response.result.content) {
        console.log(`\n📦 Response to ${response.id || 'unknown'}:`);
        const content = response.result.content[0].text;
        console.log(JSON.stringify(JSON.parse(content), null, 2));
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
  console.log('\n✅ Status check complete');
  server.kill();
  process.exit(0);
}, 8000);