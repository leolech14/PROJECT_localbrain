#!/usr/bin/env node

/**
 * Test script for Mr. Fix My Project Please MCP Server
 *
 * Tests the MCP server by:
 * 1. Starting the server process
 * 2. Sending initialize request
 * 3. Listing available tools
 * 4. Displaying tool information
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let requestId = 1;

function sendRequest(server, method, params = {}) {
  const request = {
    jsonrpc: '2.0',
    id: requestId++,
    method,
    params
  };

  console.error(`📤 Sending: ${method}`);
  server.stdin.write(JSON.stringify(request) + '\n');
}

async function testServer() {
  console.error('🚀 Starting MCP Server Test...\n');

  const serverPath = path.join(__dirname, 'mr-fix-mcp-server.js');
  const server = spawn('node', [serverPath], {
    stdio: ['pipe', 'pipe', 'inherit']
  });

  let responseBuffer = '';
  let testsPassed = 0;
  let totalTests = 2;

  server.stdout.on('data', (data) => {
    responseBuffer += data.toString();
    const lines = responseBuffer.split('\n');
    responseBuffer = lines.pop(); // Keep incomplete line

    for (const line of lines) {
      if (!line.trim()) continue;

      try {
        const response = JSON.parse(line);

        if (response.result) {
          if (response.result.capabilities) {
            console.error('✅ Test 1: Server initialized successfully');
            console.error(`   - Server: ${response.result.serverInfo?.name || 'Unknown'}`);
            console.error(`   - Version: ${response.result.serverInfo?.version || 'Unknown'}`);
            testsPassed++;

            // Request tools list
            sendRequest(server, 'tools/list');
          } else if (response.result.tools) {
            console.error('\n✅ Test 2: Tools list received');
            console.error(`   - Total tools: ${response.result.tools.length}\n`);

            response.result.tools.forEach((tool, i) => {
              console.error(`   ${i + 1}. ${tool.name}`);
              console.error(`      ${tool.description.substring(0, 80)}...`);
              console.error(`      Parameters: ${Object.keys(tool.inputSchema.properties || {}).join(', ') || 'none'}`);
              console.error('');
            });

            testsPassed++;

            // All tests complete
            server.kill();

            setTimeout(() => {
              console.error(`\n🎯 Test Results: ${testsPassed}/${totalTests} passed`);

              if (testsPassed === totalTests) {
                console.error('✅ All tests passed! Server is ready for use.\n');
                console.error('📋 Next steps:');
                console.error('   1. Add to Claude Desktop config.json:');
                console.error('      {');
                console.error('        "mcpServers": {');
                console.error('          "mr-fix": {');
                console.error('            "command": "node",');
                console.error('            "args": ["' + serverPath + '"]');
                console.error('          }');
                console.error('        }');
                console.error('      }\n');
                console.error('   2. Restart Claude Desktop');
                console.error('   3. Use tools: analyze_project, quick_analysis\n');
                process.exit(0);
              } else {
                console.error('❌ Some tests failed');
                process.exit(1);
              }
            }, 100);
          }
        } else if (response.error) {
          console.error(`❌ Error: ${response.error.message}`);
          server.kill();
          process.exit(1);
        }
      } catch (e) {
        // Ignore non-JSON lines (like console.error output)
      }
    }
  });

  server.on('error', (error) => {
    console.error(`❌ Server error: ${error.message}`);
    process.exit(1);
  });

  // Wait for server to be ready
  setTimeout(() => {
    // Send initialize request
    sendRequest(server, 'initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: {
        name: 'test-client',
        version: '1.0.0'
      }
    });
  }, 500);
}

testServer().catch((error) => {
  console.error(`❌ Test failed: ${error.message}`);
  process.exit(1);
});
