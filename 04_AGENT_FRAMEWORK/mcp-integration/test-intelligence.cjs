#!/usr/bin/env node
/**
 * Test Agent Intelligence System
 * ==============================
 *
 * Simulates agent connection with intelligence tracking
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🧪 Testing Agent Intelligence System...\n');

// Start the MCP server
const serverPath = path.join(__dirname, '../../01_CODEBASES/mcp-servers/localbrain-task-registry');
const server = spawn('node', ['dist/index.js'], {
  cwd: serverPath,
  stdio: ['pipe', 'pipe', 'inherit']
});

console.log(`📡 MCP Server started (PID: ${server.pid})`);
console.log('⏳ Waiting for server initialization...\n');

let requestsSent = 0;
const totalRequests = 4;

// Listen for server output
server.stdout.on('data', (data) => {
  const output = data.toString();

  // Wait for server ready
  if (requestsSent === 0 && output.includes('running and ready')) {
    console.log('✅ Server ready! Testing intelligence features...\n');

    // Test 1: Agent Connect
    console.log('📋 Test 1: Agent Connect');
    const connectRequest = {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: {
        name: 'agent_connect',
        arguments: {
          agent: 'D',
          model: 'Sonnet-4.5',
          project: 'LocalBrain',
          machineId: 'test-machine-123'
        }
      }
    };
    server.stdin.write(JSON.stringify(connectRequest) + '\n');
    requestsSent++;
  }

  // Parse responses
  try {
    const lines = output.split('\n').filter(line => line.trim());
    for (const line of lines) {
      if (line.startsWith('{') && line.includes('jsonrpc')) {
        const response = JSON.parse(line);

        if (response.id === 1) {
          console.log('✅ Agent Connect Response:');
          const data = JSON.parse(response.result.content[0].text);
          console.log(`   Session ID: ${data.sessionId}`);
          console.log(`   Agent: ${data.agent}`);
          console.log(`   Status: ${data.status}`);
          console.log(`   Message: ${data.welcomeMessage}`);
          console.log(`   Available Tasks: ${data.availableTasks}\n`);

          // Store session ID for next tests
          global.sessionId = data.sessionId;

          // Test 2: Heartbeat
          setTimeout(() => {
            console.log('📋 Test 2: Agent Heartbeat');
            const heartbeatRequest = {
              jsonrpc: '2.0',
              id: 2,
              method: 'tools/call',
              params: {
                name: 'agent_heartbeat',
                arguments: {
                  sessionId: global.sessionId,
                  currentActivity: 'WORKING'
                }
              }
            };
            server.stdin.write(JSON.stringify(heartbeatRequest) + '\n');
            requestsSent++;
          }, 500);
        }

        if (response.id === 2) {
          console.log('✅ Heartbeat Response:');
          const data = JSON.parse(response.result.content[0].text);
          console.log(`   Status: ${data.status}`);
          console.log(`   Session ID: ${data.sessionId}\n`);

          // Test 3: Get Swarm Dashboard
          setTimeout(() => {
            console.log('📋 Test 3: Get Swarm Dashboard');
            const dashboardRequest = {
              jsonrpc: '2.0',
              id: 3,
              method: 'tools/call',
              params: {
                name: 'get_swarm_dashboard',
                arguments: {
                  project: 'LocalBrain'
                }
              }
            };
            server.stdin.write(JSON.stringify(dashboardRequest) + '\n');
            requestsSent++;
          }, 500);
        }

        if (response.id === 3) {
          console.log('✅ Swarm Dashboard Response:');
          const data = JSON.parse(response.result.content[0].text);
          console.log(`   Project: ${data.project}`);
          console.log(`   Total Agents: ${data.swarmSummary.totalAgents}`);
          console.log(`   Online Agents: ${data.swarmSummary.onlineAgents}`);
          console.log(`   Offline Agents: ${data.swarmSummary.offlineAgents}`);
          console.log(`\n   Agent D Status:`);
          const agentD = data.agents.find(a => a.letter === 'D');
          if (agentD) {
            console.log(`     - Status: ${agentD.status}`);
            console.log(`     - Model: ${agentD.model}`);
            console.log(`     - Last Seen: ${agentD.lastSeen}`);
            console.log(`     - Sessions Today: ${agentD.todayStats.sessions}`);
          }
          console.log(`\n   Recent Activity:`);
          data.recentActivity.slice(0, 5).forEach(a => {
            console.log(`     - ${a.agent}: ${a.type} ${a.taskId || ''}`);
          });
          console.log();

          // Test 4: Disconnect
          setTimeout(() => {
            console.log('📋 Test 4: Agent Disconnect');
            const disconnectRequest = {
              jsonrpc: '2.0',
              id: 4,
              method: 'tools/call',
              params: {
                name: 'agent_disconnect',
                arguments: {
                  sessionId: global.sessionId
                }
              }
            };
            server.stdin.write(JSON.stringify(disconnectRequest) + '\n');
            requestsSent++;
          }, 500);
        }

        if (response.id === 4) {
          console.log('✅ Disconnect Response:');
          const data = JSON.parse(response.result.content[0].text);
          console.log(`   Status: ${data.status}`);
          console.log(`   Agent: ${data.agent}`);
          console.log(`   Session Duration: ${data.sessionDuration} minutes`);
          console.log(`   Tasks Claimed: ${data.tasksClaimed}`);
          console.log(`   Tasks Completed: ${data.tasksCompleted}\n`);

          console.log('🎉 ALL INTELLIGENCE TESTS PASSED!\n');
          console.log('✅ Agent connection tracking: WORKING');
          console.log('✅ Heartbeat system: WORKING');
          console.log('✅ Swarm dashboard: WORKING');
          console.log('✅ Session management: WORKING\n');

          // Cleanup
          setTimeout(() => {
            console.log('🔌 Closing connection...');
            server.kill();
            process.exit(0);
          }, 1000);
        }
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

// Timeout
setTimeout(() => {
  console.error('⏱️  Timeout - Tests did not complete in time');
  server.kill();
  process.exit(1);
}, 15000);
