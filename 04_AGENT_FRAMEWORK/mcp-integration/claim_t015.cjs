#!/usr/bin/env node

/**
 * Claim T015 - Global Kill-Switch Implementation
 * =============================================
 *
 * Agent D claiming critical P0 task for immediate completion
 */

const { spawn } = require('child_process');

async function claimT015() {
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
        console.log('🚨 Agent D claiming T015 - Global Kill-Switch Implementation');

        // Claim T015
        const claimRequest = {
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/call',
          params: {
            name: 'claim_task',
            arguments: {
              task_id: 'T015',
              agent: 'D'
            }
          }
        };
        server.stdin.write(JSON.stringify(claimRequest) + '\n');
      }
    }

    try {
      const lines = response.split('\n').filter(line => line.trim());
      lines.forEach(line => {
        if (line.startsWith('{') && line.includes('result') && line.includes('content')) {
          const parsed = JSON.parse(line);
          if (parsed.result && parsed.result.content && parsed.result.content[0]) {
            console.log('🎯 T015 Claim Result:');
            console.log(parsed.result.content[0].text);

            // Update status to IN_PROGRESS
            setTimeout(() => {
              const progressRequest = {
                jsonrpc: '2.0',
                id: 2,
                method: 'tools/call',
                params: {
                  name: 'update_task_progress',
                  arguments: {
                    task_id: 'T015',
                    agent: 'D',
                    completion_percent: 10,
                    notes: 'T015 claimed by Agent D - Starting Global Kill-Switch Implementation analysis'
                  }
                }
              };
              server.stdin.write(JSON.stringify(progressRequest) + '\n');
            }, 1000);

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

claimT015();