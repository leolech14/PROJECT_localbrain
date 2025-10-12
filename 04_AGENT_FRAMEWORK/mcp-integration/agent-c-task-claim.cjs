#!/usr/bin/env node
/**
 * Agent C Task Query and Claim Test
 * ================================
 *
 * Connect to MCP server as Agent C (Backend Specialist - GLM-4.6)
 * Query available tasks and claim an appropriate backend task.
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🤖 Agent C (Backend Specialist) - Task Query & Claim');
console.log('===================================================');
console.log('🎯 Role: Backend Services Specialist');
console.log('📋 Focus: Cloud-native infrastructure, context management, RAG systems');
console.log('');

// Start the MCP server
const serverPath = path.join(__dirname, '../../01_CODEBASES/mcp-servers/localbrain-task-registry');
const server = spawn('node', ['dist/index.js'], {
  cwd: serverPath,
  stdio: ['pipe', 'pipe', 'inherit']
});

console.log(`📡 MCP Server started (PID: ${server.pid})`);
console.log('⏳ Waiting for server initialization...\n');

let sessionId = null;
let tasksQueried = false;
let taskClaimed = false;

// Listen for server output
server.stdout.on('data', (data) => {
  const output = data.toString();

  // Wait for server ready
  if (!tasksQueried && output.includes('running and ready')) {
    console.log('✅ Server ready! Connecting Agent C...\n');

    // Step 1: Connect as Agent C
    console.log('📋 Step 1: Connecting Agent C (Backend Specialist)');
    const connectRequest = {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: {
        name: 'agent_connect',
        arguments: {
          agent: 'C',
          model: 'GLM-4.6',
          project: 'LocalBrain',
          machineId: 'agent-c-backend-workstation'
        }
      }
    };
    server.stdin.write(JSON.stringify(connectRequest) + '\n');
  }

  // Parse responses
  try {
    const lines = output.split('\n').filter(line => line.trim());
    for (const line of lines) {
      if (line.startsWith('{') && line.includes('jsonrpc')) {
        const response = JSON.parse(line);

        // Handle connection response
        if (response.id === 1) {
          console.log('✅ Agent C Connected!');
          const data = JSON.parse(response.result.content[0].text);
          console.log(`   Session ID: ${data.sessionId}`);
          console.log(`   Agent: ${data.agent}`);
          console.log(`   Model: GLM-4.6`);
          console.log(`   Available Tasks: ${data.availableTasks}\n`);

          sessionId = data.sessionId;

          // Step 2: Query available tasks
          setTimeout(() => {
            console.log('📋 Step 2: Querying Available Tasks for Agent C');
            const tasksRequest = {
              jsonrpc: '2.0',
              id: 2,
              method: 'tools/call',
              params: {
                name: 'get_available_tasks',
                arguments: {
                  agent: 'C',
                  includeDetails: true
                }
              }
            };
            server.stdin.write(JSON.stringify(tasksRequest) + '\n');
          }, 500);
        }

        // Handle tasks response
        if (response.id === 2) {
          tasksQueried = true;
          console.log('✅ Tasks Response Received!');
          const data = JSON.parse(response.result.content[0].text);

          console.log(`\n📊 Agent C Task Analysis:`);
          console.log(`   Agent: ${data.agent}`);
          console.log(`   Available Tasks: ${data.availableTasks}`);
          console.log(`   Message: ${data.message}`);

          if (data.tasks && data.tasks.length > 0) {
            console.log('\n📋 Available Tasks:');
            data.tasks.forEach((task, index) => {
              console.log(`   ${index + 1}. ${task.taskId}: ${task.title}`);
              console.log(`      Status: ${task.status}`);
              console.log(`      Priority: ${task.priority}`);
              console.log(`      Estimate: ${task.estimatedHours}h`);
              if (task.description) {
                console.log(`      Description: ${task.description}`);
              }
              if (task.dependencies && task.dependencies.length > 0) {
                console.log(`      Dependencies: ${task.dependencies.join(', ')}`);
              }
              console.log('');
            });

            // Look for backend-specific tasks (T010, T011, T018)
            const backendTasks = data.tasks.filter(task =>
              ['T010', 'T011', 'T018'].includes(task.taskId)
            );

            if (backendTasks.length > 0) {
              console.log('🎯 Backend Specialist Tasks Found:');
              backendTasks.forEach(task => {
                console.log(`   ✅ ${task.taskId}: ${task.title}`);
                console.log(`      Status: ${task.status} | Priority: ${task.priority}`);
              });

              // Find available backend task
              const availableBackendTask = backendTasks.find(task => task.status === 'AVAILABLE');

              if (availableBackendTask && !taskClaimed) {
                console.log(`\n🔒 Step 3: Claiming Task: ${availableBackendTask.taskId}`);
                console.log(`   Title: ${availableBackendTask.title}`);

                const claimRequest = {
                  jsonrpc: '2.0',
                  id: 3,
                  method: 'tools/call',
                  params: {
                    name: 'claim_task',
                    arguments: {
                      agent: 'C',
                      taskId: availableBackendTask.taskId
                    }
                  }
                };
                server.stdin.write(JSON.stringify(claimRequest) + '\n');
                taskClaimed = true;

              } else if (!availableBackendTask) {
                console.log('\n❌ No backend tasks available for claiming');
                console.log('💡 Tasks may be already completed or blocked');
                setTimeout(() => disconnectAgent(), 1000);
              }

            } else {
              console.log('\n❌ No backend-specific tasks (T010, T011, T018) found');
              setTimeout(() => disconnectAgent(), 1000);
            }

          } else {
            console.log('\n❌ No available tasks found for Agent C');
            console.log('💡 All Agent C tasks may be completed or blocked');
            setTimeout(() => disconnectAgent(), 1000);
          }
        }

        // Handle claim response
        if (response.id === 3) {
          console.log('✅ Task Claim Response Received!');
          const data = JSON.parse(response.result.content[0].text);

          if (data.success) {
            console.log('\n🎉 TASK SUCCESSFULLY CLAIMED BY AGENT C!');
            console.log('=====================================');
            console.log(`📋 Task ID: ${data.task.taskId}`);
            console.log(`📝 Title: ${data.task.title}`);
            console.log(`📖 Description: ${data.task.description}`);
            console.log(`⏱️  Estimated Hours: ${data.task.estimatedHours}`);
            console.log(`🎯 Priority: ${data.task.priority}`);
            console.log(`📁 Location: ${data.task.location}`);
            console.log(`🔗 Dependencies: ${(data.task.dependencies || []).join(', ') || 'None'}`);

            console.log('\n💡 IMPLEMENTATION GUIDANCE:');
            if (data.task.taskId === 'T018') {
              console.log('   📚 RAG Index for Specifications:');
              console.log('   - Focus on vector database integration');
              console.log('   - Implement semantic search capabilities');
              console.log('   - Build document chunking strategies');
              console.log('   - Create API endpoints for queries');
            } else if (data.task.taskId === 'T010') {
              console.log('   🗄️  Change-Set Ledger Database:');
              console.log('   - Design audit trail schema');
              console.log('   - Implement atomic operations');
              console.log('   - Create migration scripts');
            } else if (data.task.taskId === 'T011') {
              console.log('   🧠 Context Manager:');
              console.log('   - Build context persistence layer');
              console.log('   - Implement context retrieval APIs');
              console.log('   - Design context expiration policies');
            }

            console.log('\n🚀 Agent C can now begin implementation!');
            console.log('💓 Heartbeat tracking is active');

          } else {
            console.log('\n❌ Task claim failed:');
            console.log(`   Error: ${data.error || 'Unknown error'}`);
          }

          // Disconnect after claim attempt
          setTimeout(() => disconnectAgent(), 1000);
        }
      }
    }
  } catch (e) {
    // Not JSON, ignore
  }
});

// Disconnect function
function disconnectAgent() {
  if (sessionId) {
    console.log('\n📋 Step 4: Disconnecting Agent C');
    const disconnectRequest = {
      jsonrpc: '2.0',
      id: 99,
      method: 'tools/call',
      params: {
        name: 'agent_disconnect',
        arguments: {
          sessionId: sessionId
        }
      }
    };
    server.stdin.write(JSON.stringify(disconnectRequest) + '\n');

    setTimeout(() => {
      console.log('\n✅ Agent C task query complete!');
      console.log('👋 Connection closed\n');
      server.kill();
      process.exit(0);
    }, 1000);
  } else {
    console.log('\n🔌 Closing connection...');
    server.kill();
    process.exit(0);
  }
}

// Handle errors
server.on('error', (error) => {
  console.error('❌ Server error:', error);
  process.exit(1);
});

// Timeout after 20 seconds
setTimeout(() => {
  console.error('⏱️  Timeout - Operation did not complete in time');
  server.kill();
  process.exit(1);
}, 20000);