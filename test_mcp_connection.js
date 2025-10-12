#!/usr/bin/env node
/**
 * Live MCP Connection Test
 * ======================
 */

const { spawn } = require('child_process');

console.log('🔌 Establishing live MCP connection...\n');

// Start Sniper Gun MCP server
const serverPath = '/Users/lech/PROJECTS_all/PROJECT_lechworld/sniper-gun-mcp-server';
const server = spawn('/opt/homebrew/bin/node', ['dist/index.js'], {
  cwd: serverPath,
  stdio: ['pipe', 'pipe', 'inherit']
});

console.log(`📡 MCP Server started (PID: ${server.pid})`);
console.log('⏳ Initializing connection...\n');

let responseData = '';
let requestSent = false;

// Listen for server output
server.stdout.on('data', (data) => {
  const output = data.toString();
  console.log('📥 Server:', output.trim());

  // Send test request when ready
  if (!requestSent && (output.includes('running') || output.includes('ready'))) {
    console.log('✅ Server ready! Sending MCP request...\n');

    const request = {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/list',
      params: {}
    };

    server.stdin.write(JSON.stringify(request) + '\n');
    requestSent = true;
  }

  // Try to parse JSON responses
  try {
    const lines = output.split('\n').filter(line => line.trim());
    for (const line of lines) {
      if (line.startsWith('{') && line.includes('jsonrpc')) {
        const response = JSON.parse(line);
        console.log('📦 MCP Response:');
        console.log(JSON.stringify(response, null, 2));
        console.log('\n✅ LIVE MCP CONNECTION ESTABLISHED! 🔥\n');

        // List available tools
        if (response.result && response.result.tools) {
          console.log(`🛠️  Available Tools: ${response.result.tools.length}`);
          response.result.tools.forEach(tool => {
            console.log(`   - ${tool.name}: ${tool.description}`);
          });
        }

        // Cleanup
        setTimeout(() => {
          console.log('\n🔌 Connection test complete!');
          server.kill();
          process.exit(0);
        }, 2000);
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

// Timeout after 15 seconds
setTimeout(() => {
  console.error('⏱️  Timeout - Server did not respond properly');
  server.kill();
  process.exit(1);
}, 15000);