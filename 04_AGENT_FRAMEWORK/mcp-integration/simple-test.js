#!/usr/bin/env node
/**
 * Simple MCP Server Test
 * ======================
 *
 * Direct stdio communication test with the MCP server
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting MCP server connection test...\n');

// Start the MCP server
const serverPath = path.join(__dirname, '../../01_CODEBASES/mcp-servers/localbrain-task-registry');
const server = spawn('node', ['dist/index.js'], {
  cwd: serverPath,
  stdio: ['pipe', 'pipe', 'inherit'] // stdin pipe, stdout pipe, stderr to console
});

console.log(`📡 MCP Server started (PID: ${server.pid})`);
console.log('⏳ Waiting for server initialization...\n');

let responseData = '';
let requestSent = false;

// Listen for server output
server.stdout.on('data', (data) => {
  const output = data.toString();

  // Wait for server to be ready before sending request
  if (!requestSent && output.includes('MCP Server running and ready')) {
    console.log('✅ Server ready! Sending getAvailableTasks request...\n');

    // Send MCP request for Agent A's available tasks (proper MCP protocol format)
    const request = {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: {
        name: 'get_available_tasks',
        arguments: {
          agent: 'A',
          includeDetails: true
        }
      }
    };

    server.stdin.write(JSON.stringify(request) + '\n');
    requestSent = true;

    // Wait for response
    setTimeout(() => {
      console.log('⏱️  Waiting for response...\n');
    }, 500);
  }

  // Try to parse JSON responses
  try {
    const lines = output.split('\n').filter(line => line.trim());
    for (const line of lines) {
      if (line.startsWith('{') && line.includes('jsonrpc')) {
        const response = JSON.parse(line);
        console.log('📦 MCP Server Response:');
        console.log(JSON.stringify(response, null, 2));
        console.log('\n✅ TEST SUCCESSFUL - MCP Server is responding!\n');

        // Parse the actual task data
        if (response.result && response.result.content) {
          const taskData = JSON.parse(response.result.content[0].text);
          console.log('📊 Task Data:');
          console.log(`   Agent: ${taskData.agent}`);
          console.log(`   Available Tasks: ${taskData.availableTasks}`);
          console.log(`   Message: ${taskData.message}`);
        }

        // Cleanup
        setTimeout(() => {
          console.log('\n🔌 Closing connection...');
          server.kill();
          process.exit(0);
        }, 1000);
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

// Timeout after 10 seconds
setTimeout(() => {
  console.error('⏱️  Timeout - Server did not respond in time');
  server.kill();
  process.exit(1);
}, 10000);
