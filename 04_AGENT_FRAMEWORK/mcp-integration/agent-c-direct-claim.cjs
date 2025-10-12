#!/usr/bin/env node

/**
 * Agent C Direct Task Claim
 * =========================
 *
 * Direct claim of T018 (RAG Index for Specifications)
 */

const { spawn } = require('child_process');

async function directClaim() {
  console.log('🚀 Agent C (Backend Specialist) - Direct Task Claim\n');

  const server = spawn('node', ['dist/index.js'], {
    cwd: '../../01_CODEBASES/mcp-servers/localbrain-task-registry',
    stdio: ['pipe', 'pipe', 'pipe']
  });

  let ready = false;

  server.stdout.on('data', (data) => {
    const output = data.toString();

    if (!ready && output.includes('MCP Server running and ready')) {
      ready = true;
      console.log('✅ Server ready - Claiming T018 (RAG Index for Specifications)...');

      // Direct claim request
      const claimRequest = {
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/call',
        params: {
          name: 'claim_task',
          arguments: {
            agent: 'C',
            taskId: 'T018'
          }
        }
      };

      server.stdin.write(JSON.stringify(claimRequest) + '\n');
    }

    // Parse response
    try {
      if (output.includes('jsonrpc') && output.includes('result')) {
        const lines = output.split('\n');
        for (const line of lines) {
          if (line.startsWith('{') && line.includes('result')) {
            const response = JSON.parse(line);
            if (response.result && response.result.content) {
              const result = JSON.parse(response.result.content[0].text);

              console.log('\n🎯 TASK CLAIM RESULT:');
              console.log(JSON.stringify(result, null, 2));

              if (result.success) {
                console.log('\n✅ T018 SUCCESSFULLY CLAIMED BY AGENT C!');
                console.log('📝 Task: RAG Index for Specifications');
                console.log('🧠 Agent: GLM-4.6 Backend Specialist');
                console.log('⏱️  Priority: P1-HIGH');
                console.log('📍 Ready to begin implementation...\n');

                // Update todo list
                console.log('📋 UPDATING PROGRESS TRACKING...');
              }

              server.kill();
              process.exit(0);
            }
          }
        }
      }
    } catch (e) {
      // Ignore JSON parse errors
    }
  });

  server.stderr.on('data', (data) => {
    console.error('Server:', data.toString());
  });

  // Timeout
  setTimeout(() => {
    console.log('⏱️ Timeout - checking task status directly...');
    server.kill();
  }, 10000);
}

directClaim();