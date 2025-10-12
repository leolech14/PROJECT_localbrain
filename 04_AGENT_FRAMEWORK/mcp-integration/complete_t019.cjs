#!/usr/bin/env node

/**
 * Complete T019 Task via MCP System
 * =================================
 *
 * Agent D completing T019 - LOCAL MCP Task Registry Server
 */

const { spawn } = require('child_process');

async function completeTask() {
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
        console.log('✅ MCP Server ready - Completing T019 for Agent D');

        // Complete T019
        const completeRequest = {
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/call',
          params: {
            name: 'complete_task',
            arguments: {
              task_id: 'T019',
              agent: 'D',
              deliverables: [
                'MCP server with 6 tools completed',
                'SQLite task persistence operational',
                'Git-based verification working',
                'Real-time progress tracking active',
                'TaskRegistryClient wrapper ready',
                'Visual monitoring system implemented'
              ],
              notes: 'T019 - LOCAL MCP Task Registry Server complete and operational. All agents now have coordination infrastructure.'
            }
          }
        };
        server.stdin.write(JSON.stringify(completeRequest) + '\n');
      }
    }

    try {
      const lines = response.split('\n').filter(line => line.trim());
      lines.forEach(line => {
        if (line.startsWith('{') && line.includes('result') && line.includes('content')) {
          const parsed = JSON.parse(line);
          if (parsed.result && parsed.result.content && parsed.result.content[0]) {
            console.log('🎯 T019 Completion Result:');
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

completeTask();