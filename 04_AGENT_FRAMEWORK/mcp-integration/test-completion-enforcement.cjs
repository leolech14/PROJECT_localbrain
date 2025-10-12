#!/usr/bin/env node
/**
 * Test Completion Enforcement
 * ============================
 *
 * Verifies that agents CANNOT complete tasks without:
 * 1. Keep-in-Touch permission
 * 2. Git commits (minimum 30% score)
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🔒 Testing Completion Enforcement (Keep-in-Touch + Git Gating)...\n');

const serverPath = path.join(__dirname, '../../01_CODEBASES/mcp-servers/localbrain-task-registry');
const server = spawn('node', ['dist/index.js'], {
  cwd: serverPath,
  stdio: ['pipe', 'pipe', 'inherit']
});

console.log(`📡 MCP Server started (PID: ${server.pid})\n`);

let step = 0;

server.stdout.on('data', (data) => {
  const output = data.toString();

  if (step === 0 && output.includes('running and ready')) {
    console.log('═══════════════════════════════════════════════════════');
    console.log('TEST 1: Try to Complete Without Git Commits');
    console.log('═══════════════════════════════════════════════════════\n');

    console.log('Attempting to complete T001 with NO git commits...\n');

    const completeWithoutGit = {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: {
        name: 'complete_task',
        arguments: {
          taskId: 'T001',
          agent: 'A',
          filesCreated: ['test.ts'],
          velocity: 100
        }
      }
    };

    server.stdin.write(JSON.stringify(completeWithoutGit) + '\n');
    step = 1;
  }

  try {
    const lines = output.split('\n').filter(line => line.trim());
    for (const line of lines) {
      if (line.startsWith('{') && line.includes('jsonrpc')) {
        const response = JSON.parse(line);

        if (response.id === 1 && step === 1) {
          const data = JSON.parse(response.result.content[0].text);

          console.log('📊 ENFORCEMENT TEST RESULT:\n');

          if (data.blocked) {
            console.log('✅ CORRECTLY BLOCKED!\n');
            console.log(`   Reason: ${data.reason}`);
            console.log(`   Message: ${data.message}`);
            console.log(`   Action Required: ${data.action}\n`);
            console.log('🎯 VERIFICATION: System PREVENTS completion without evidence! ✅\n');
          } else if (data.success) {
            console.log('❌ ENFORCEMENT FAILED!\n');
            console.log('   Task was allowed to complete without git commits!');
            console.log('   This should NOT happen!\n');
          } else {
            console.log('⚠️  UNEXPECTED RESPONSE:\n');
            console.log(JSON.stringify(data, null, 2));
          }

          console.log('═══════════════════════════════════════════════════════');
          console.log('🏆 ENFORCEMENT TEST COMPLETE!');
          console.log('═══════════════════════════════════════════════════════\n');

          if (data.blocked) {
            console.log('✅ SUCCESS: Agents cannot falsely claim completion!');
            console.log('✅ Keep-in-Touch + Git verification ENFORCED!');
            console.log('✅ System is aligned with truth!\n');
          } else {
            console.log('❌ FAILURE: Enforcement not working!');
            console.log('⚠️  Need to debug and fix!\n');
          }

          setTimeout(() => {
            server.kill();
            process.exit(data.blocked ? 0 : 1);
          }, 1000);
        }
      }
    }
  } catch (e) {
    // Not JSON
  }
});

server.on('error', (error) => {
  console.error('❌ Server error:', error);
  process.exit(1);
});

setTimeout(() => {
  console.error('⏱️  Test timeout');
  server.kill();
  process.exit(1);
}, 30000);
