#!/usr/bin/env node
/**
 * Complete T011 as Agent A
 */

const { spawn } = require('child_process');
const path = require('path');

const MCP_SERVER_PATH = path.join(__dirname, '../../01_CODEBASES/mcp-servers/localbrain-task-registry');

function startMCPServer() {
  return spawn('node', ['dist/index.js'], {
    cwd: MCP_SERVER_PATH,
    stdio: ['pipe', 'pipe', 'pipe']
  });
}

function sendMCPRequest(serverProcess, request) {
  return new Promise((resolve, reject) => {
    let output = '';

    serverProcess.stdout.on('data', (data) => {
      try {
        const response = JSON.parse(data.toString());
        resolve(response);
      } catch (e) {
        output += data.toString();
        try {
          const response = JSON.parse(output);
          resolve(response);
        } catch (e2) {
          // Still waiting for complete response
        }
      }
    });

    serverProcess.stderr.on('data', (data) => {
      console.error('Server stderr:', data.toString());
    });

    // Send the request
    serverProcess.stdin.write(JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: request
    }) + '\n');

    // Timeout after 10 seconds
    setTimeout(() => {
      reject(new Error('MCP request timeout'));
    }, 10000);
  });
}

async function main() {
  console.log('🚀 Starting MCP server to complete T011...');

  const serverProcess = startMCPServer();

  // Wait a moment for server to start
  await new Promise(resolve => setTimeout(resolve, 2000));

  try {
    const response = await sendMCPRequest(serverProcess, {
      name: "complete_task",
      arguments: {
        taskId: "T011",
        agent: "A",
        deliverables: [
          "TanStack Query client configuration with optimized defaults",
          "Comprehensive query functions integrating with IPC services",
          "React Query provider with SSR support and error boundaries",
          "React Query hooks integrating with AppContext",
          "Server-state management with local state synchronization"
        ],
        completionPercentage: 100,
        actualMinutes: 180
      }
    });

    console.log('📦 MCP Response:', JSON.stringify(response, null, 2));

    if (response.result && response.result.content) {
      const content = response.result.content[0];
      if (content.text) {
        const data = JSON.parse(content.text);
        if (data.success) {
          console.log('✅ Successfully completed T011!');
          console.log(`📊 Completion score: ${data.completionScore}%`);
        } else {
          console.log('❌ Failed to complete T011:', data.message);
        }
      }
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    serverProcess.kill();
    setTimeout(() => process.exit(0), 1000);
  }
}

main().catch(console.error);