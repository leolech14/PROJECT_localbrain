#!/usr/bin/env node
/**
 * Agent Dashboard Test
 * ===================
 *
 * Test the agent dashboard visual monitoring system
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🎯 Testing Agent Dashboard Visual System...\n');

// Start the MCP server
const serverPath = path.join(__dirname, '../../01_CODEBASES/mcp-servers/localbrain-task-registry');
const server = spawn('node', ['dist/index.js'], {
  cwd: serverPath,
  stdio: ['pipe', 'pipe', 'inherit']
});

console.log(`📡 MCP Server started (PID: ${server.pid})`);
console.log('⏳ Waiting for server initialization...\n');

let requestCount = 0;
const maxRequests = 2;

// Listen for server output
server.stdout.on('data', (data) => {
  const output = data.toString();

  // Wait for server to be ready
  if (requestCount === 0 && output.includes('MCP Server running and ready')) {
    console.log('✅ Server ready! Testing get_available_tasks first...\n');

    // Test 1: Get available tasks
    const request1 = {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: {
        name: 'get_available_tasks',
        arguments: {
          agent: 'A',
          includeDetails: true
        }
      }
    };

    server.stdin.write(JSON.stringify(request1) + '\n');
    requestCount++;
  }

  // Try to parse JSON responses
  try {
    const lines = output.split('\n').filter(line => line.trim());
    for (const line of lines) {
      if (line.startsWith('{') && line.includes('jsonrpc')) {
        const response = JSON.parse(line);

        if (response.id === 1) {
          console.log('📋 Available Tasks Response:');
          console.log(JSON.stringify(response, null, 2));
          console.log('\n' + '='.repeat(60) + '\n');

          // Now test the agent dashboard
          console.log('🎨 Now testing get_agent_dashboard...\n');

          const request2 = {
            jsonrpc: '2.0',
            id: 2,
            method: 'tools/call',
            params: {
              name: 'get_agent_dashboard',
              arguments: {}
            }
          };

          server.stdin.write(JSON.stringify(request2) + '\n');
          requestCount++;
        }

        if (response.id === 2) {
          console.log('🎨 Agent Dashboard Response:');
          console.log(JSON.stringify(response, null, 2));

          // Parse and display the dashboard content
          if (response.result && response.result.content) {
            const dashboardData = JSON.parse(response.result.content[0].text);

            console.log('\n🌟 === AGENT DASHBOARD VISUAL SYSTEM === 🌟\n');
            console.log(`📊 Dashboard Version: ${dashboardData.systemStatus.version}`);
            console.log(`🕐 Generated: ${dashboardData.systemStatus.generatedAt}`);
            console.log(`🏥 System Health: ${dashboardData.systemStatus.health} (${dashboardData.systemStatus.uptime})`);
            console.log(`📝 Total Tasks: ${dashboardData.statistics.totalTasks}`);
            console.log(`🤖 Active Agents: ${dashboardData.statistics.activeAgents}`);

            // Display agent status
            console.log('\n👥 AGENT STATUS:');
            dashboardData.agents.forEach(agent => {
              const emoji = agent.status === 'active' ? '🟢' :
                           agent.status === 'idle' ? '🟡' : '🔴';
              console.log(`   ${emoji} ${agent.role}: ${agent.status.toUpperCase()} (${agent.workload})`);
            });

            // Display system metrics
            console.log('\n📈 SYSTEM METRICS:');
            console.log(`   💾 Database: ${dashboardData.systemMetrics.database.status}`);
            console.log(`   📡 MCP Server: ${dashboardData.systemMetrics.mcpServer.status}`);
            console.log(`   🔄 Git Operations: ${dashboardData.systemMetrics.gitOperations.status}`);

            // Display visual elements
            console.log('\n🎨 VISUAL ELEMENTS:');
            if (dashboardData.visualElements.progressBars) {
              dashboardData.visualElements.progressBars.forEach(bar => {
                console.log(`   ${bar.label}: ${bar.bar} ${bar.percentage}%`);
              });
            }

            if (dashboardData.visualElements.agentGrid) {
              console.log('\n   AGENT WORKLOAD GRID:');
              dashboardData.visualElements.agentGrid.forEach(grid => {
                console.log(`     ${grid.role} | ${grid.current} | ${grid.status}`);
              });
            }

            console.log('\n✅ AGENT DASHBOARD TEST COMPLETE - Beautiful visual system working!\n');
          }

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

// Timeout after 15 seconds
setTimeout(() => {
  console.error('⏱️  Timeout - Server did not respond in time');
  server.kill();
  process.exit(1);
}, 15000);