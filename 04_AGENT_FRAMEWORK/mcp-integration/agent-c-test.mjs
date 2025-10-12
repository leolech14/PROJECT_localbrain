#!/usr/bin/env node
/**
 * Agent C MCP Connection Test
 * ============================
 *
 * Connect to MCP server as Agent C and check available tasks
 */

import { spawn } from 'child_process';

console.log('🚀 Agent C connecting to MCP Task Registry...\n');

// Start MCP server
const serverPath = '../../01_CODEBASES/mcp-servers/localbrain-task-registry';
const server = spawn('node', ['dist/index.js'], {
  cwd: serverPath,
  stdio: ['pipe', 'pipe', 'inherit']
});

let requestSent = false;
let responseReceived = false;

// Handle server output
server.stdout.on('data', (data) => {
  const output = data.toString();
  console.log('📡 MCP Server:', output.trim());

  // Send request for Agent C's available tasks when server is ready
  if (!requestSent && output.includes('MCP Server running and ready')) {
    console.log('✅ Server ready! Querying tasks for Agent C (Backend Services Specialist)...\n');

    // Send MCP request for Agent C's available tasks
    const request = {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: {
        name: 'get_available_tasks',
        arguments: {
          agent: 'C',
          includeDetails: true
        }
      }
    };

    server.stdin.write(JSON.stringify(request) + '\n');
    requestSent = true;
  }

  // Parse response
  if (requestSent && !responseReceived && output.includes('"result"')) {
    try {
      const lines = output.split('\n');
      for (const line of lines) {
        if (line.includes('"result"')) {
          const response = JSON.parse(line);
          console.log('\n🎯 AGENT C TASK ANALYSIS:');
          console.log('═'.repeat(60));

          if (response.result && response.result.tasks) {
            const tasks = response.result.tasks;
            console.log(`📋 Found ${tasks.length} available tasks for Agent C:\n`);

            tasks.forEach((task, index) => {
              console.log(`${index + 1}. ${task.name || task.id}`);
              console.log(`   Status: ${task.status}`);
              console.log(`   Priority: ${task.priority}`);
              if (task.description) {
                console.log(`   Description: ${task.description.substring(0, 100)}...`);
              }
              if (task.dependencies && task.dependencies.length > 0) {
                console.log(`   Dependencies: ${task.dependencies.join(', ')}`);
              }
              console.log('');
            });

            // Show current work
            const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS');
            const availableTasks = tasks.filter(t => t.status === 'AVAILABLE');

            console.log('🚀 IMMEDIATE ACTIONS FOR AGENT C:');
            if (inProgressTasks.length > 0) {
              console.log(`   🔄 RESUME: ${inProgressTasks[0].name || inProgressTasks[0].id}`);
            } else if (availableTasks.length > 0) {
              console.log(`   ⚡ START: ${availableTasks[0].name || availableTasks[0].id}`);
            } else {
              console.log('   📊 All backend tasks completed! Check for new work.');
            }

          } else {
            console.log('❌ No tasks found for Agent C');
            console.log('💡 Recommendation: Check CENTRAL_TASK_REGISTRY.md for backend assignments');
          }

          responseReceived = true;

          // Close server after getting response
          setTimeout(() => {
            console.log('\n✅ Agent C MCP connection test complete');
            server.kill('SIGTERM');
            process.exit(0);
          }, 1000);

          break;
        }
      }
    } catch (error) {
      console.error('❌ Error parsing response:', error.message);
    }
  }
});

// Handle server errors
server.stderr.on('data', (data) => {
  console.error('❌ MCP Server Error:', data.toString());
});

// Handle server exit
server.on('close', (code) => {
  if (code !== 0 && !responseReceived) {
    console.error(`❌ MCP Server exited with code ${code}`);
  }
});

// Timeout after 15 seconds
setTimeout(() => {
  if (!responseReceived) {
    console.log('⏰ Connection timeout - MCP server may not be ready');
    server.kill('SIGTERM');
    process.exit(1);
  }
}, 15000);