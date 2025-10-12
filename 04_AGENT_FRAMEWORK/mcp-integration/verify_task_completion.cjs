#!/usr/bin/env node

/**
 * Verify Task Completion via MCP System
 * =====================================
 *
 * Using proper MCP to verify actual task status
 */

const { spawn } = require('child_process');

async function verifyTasks() {
  const server = spawn('node', ['dist/index.js'], {
    stdio: ['pipe', 'pipe', 'pipe'],
    cwd: '/Users/lech/PROJECTS_all/LocalBrain/01_CODEBASES/mcp-servers/localbrain-task-registry'
  });

  let response = '';
  let ready = false;

  server.stdout.on('data', (data) => {
    const output = data.toString();
    response += output;

    if (output.includes('Server ready') || output.includes('MCP server listening') || output.includes('ready')) {
      if (!ready) {
        ready = true;
        console.log('✅ MCP Server ready - Verifying task completion');

        // Get dashboard status
        const dashboardRequest = {
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/call',
          params: {
            name: 'get_dashboard',
            arguments: {}
          }
        };
        server.stdin.write(JSON.stringify(dashboardRequest) + '\n');
      }
    }

    try {
      const lines = response.split('\n').filter(line => line.trim());
      lines.forEach(line => {
        if (line.startsWith('{') && line.includes('result') && line.includes('content')) {
          const parsed = JSON.parse(line);
          if (parsed.result && parsed.result.content && parsed.result.content[0]) {
            console.log('📊 MCP Dashboard Status:');
            console.log(parsed.result.content[0].text);
            server.kill();
            process.exit(0);
          }
        }
      });
    } catch (e) {
      // Not valid JSON yet
    }
  });

  setTimeout(() => {
    server.kill();
    process.exit(1);
  }, 8000);
}

verifyTasks();