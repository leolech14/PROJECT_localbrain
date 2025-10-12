#!/usr/bin/env node
/**
 * Deploy Parallel Agents via MCP
 * ===============================
 *
 * Uses our own Central Intelligence MCP to coordinate 2 GLM-4.6 agents
 * working in parallel on remaining tasks!
 *
 * Agent A: UI/Frontend specialist
 * Agent C: Backend specialist
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 DEPLOYING 2 GLM-4.6 AGENTS VIA CENTRAL INTELLIGENCE MCP...\n');

const serverPath = path.join(__dirname, '../../01_CODEBASES/mcp-servers/localbrain-task-registry');

// Start MCP server
const server = spawn('node', ['dist/index.js'], {
  cwd: serverPath,
  stdio: ['pipe', 'pipe', 'inherit']
});

console.log(`📡 Central Intelligence MCP Server started (PID: ${server.pid})\n`);

let step = 0;

server.stdout.on('data', (data) => {
  const output = data.toString();

  if (step === 0 && output.includes('running and ready')) {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('STEP 1: DISCOVER ENVIRONMENT FOR BOTH AGENTS');
    console.log('═══════════════════════════════════════════════════════════\n');

    console.log('🔍 Agent A (GLM-4.6) - UI Specialist - Discovering environment...\n');

    const agentADiscover = {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: {
        name: 'discover_environment',
        arguments: {
          cwd: '/Users/lech/PROJECTS_all/LocalBrain',
          modelId: 'glm-4.6',
          // No tracking ID = new agent
        }
      }
    };

    server.stdin.write(JSON.stringify(agentADiscover) + '\n');
    step = 1;
  }

  try {
    const lines = output.split('\n').filter(line => line.trim());
    for (const line of lines) {
      if (line.startsWith('{') && line.includes('jsonrpc')) {
        const response = JSON.parse(line);

        // Agent A Discovery Response
        if (response.id === 1 && step === 1) {
          const data = JSON.parse(response.result.content[0].text);

          console.log('✅ AGENT A ACTIVATED:\n');
          console.log(`   Agent: ${data.agent.name}`);
          console.log(`   Tracking ID: ${data.agent.trackingId}`);
          console.log(`   Project: ${data.project.name}`);
          console.log(`   Capabilities: UI=${data.agent.capabilities.ui}, Backend=${data.agent.capabilities.backend}\n`);

          console.log(`   📋 Job Proposals for Agent A (${data.proposals.length} tasks):`);
          data.proposals.slice(0, 3).forEach((p, i) => {
            console.log(`      ${i + 1}. ${p.taskId}: ${p.taskName} (${p.matchScore}% match)`);
          });

          console.log('\n🔍 Agent C (GLM-4.6) - Backend Specialist - Discovering environment...\n');

          // Deploy Agent C
          const agentCDiscover = {
            jsonrpc: '2.0',
            id: 2,
            method: 'tools/call',
            params: {
              name: 'discover_environment',
              arguments: {
                cwd: '/Users/lech/PROJECTS_all/LocalBrain',
                modelId: 'glm-4.6',
              }
            }
          };

          server.stdin.write(JSON.stringify(agentCDiscover) + '\n');
          step = 2;
        }

        // Agent C Discovery Response
        if (response.id === 2 && step === 2) {
          const data = JSON.parse(response.result.content[0].text);

          console.log('✅ AGENT C ACTIVATED:\n');
          console.log(`   Agent: ${data.agent.name}`);
          console.log(`   Tracking ID: ${data.agent.trackingId}`);
          console.log(`   Project: ${data.project.name}`);
          console.log(`   Capabilities: UI=${data.agent.capabilities.ui}, Backend=${data.agent.capabilities.backend}\n`);

          console.log(`   📋 Job Proposals for Agent C (${data.proposals.length} tasks):`);
          data.proposals.slice(0, 3).forEach((p, i) => {
            console.log(`      ${i + 1}. ${p.taskId}: ${p.taskName} (${p.matchScore}% match)`);
          });

          console.log('\n═══════════════════════════════════════════════════════════');
          console.log('STEP 2: GET AVAILABLE TASKS FOR PARALLEL ASSIGNMENT');
          console.log('═══════════════════════════════════════════════════════════\n');

          // Get all available tasks
          const getTasksA = {
            jsonrpc: '2.0',
            id: 3,
            method: 'tools/call',
            params: {
              name: 'get_available_tasks',
              arguments: { agent: 'A' }
            }
          };

          server.stdin.write(JSON.stringify(getTasksA) + '\n');
          step = 3;
        }

        // Available tasks for Agent A
        if (response.id === 3 && step === 3) {
          const data = JSON.parse(response.result.content[0].text);

          console.log(`📋 Agent A - Available Tasks: ${data.availableTasks?.length || 0}\n`);

          if (data.availableTasks && data.availableTasks.length > 0) {
            data.availableTasks.slice(0, 5).forEach((task, i) => {
              console.log(`   ${i + 1}. ${task.id}: ${task.name} (${task.priority})`);
            });
          }

          // Get tasks for Agent C
          const getTasksC = {
            jsonrpc: '2.0',
            id: 4,
            method: 'tools/call',
            params: {
              name: 'get_available_tasks',
              arguments: { agent: 'C' }
            }
          };

          server.stdin.write(JSON.stringify(getTasksC) + '\n');
          step = 4;
        }

        // Available tasks for Agent C
        if (response.id === 4 && step === 4) {
          const data = JSON.parse(response.result.content[0].text);

          console.log(`\n📋 Agent C - Available Tasks: ${data.availableTasks?.length || 0}\n`);

          if (data.availableTasks && data.availableTasks.length > 0) {
            data.availableTasks.slice(0, 5).forEach((task, i) => {
              console.log(`   ${i + 1}. ${task.id}: ${task.name} (${task.priority})`);
            });
          }

          console.log('\n═══════════════════════════════════════════════════════════');
          console.log('STEP 3: VIEW SWARM DASHBOARD');
          console.log('═══════════════════════════════════════════════════════════\n');

          const getDashboard = {
            jsonrpc: '2.0',
            id: 5,
            method: 'tools/call',
            params: {
              name: 'get_swarm_dashboard',
              arguments: {}
            }
          };

          server.stdin.write(JSON.stringify(getDashboard) + '\n');
          step = 5;
        }

        // Dashboard response
        if (response.id === 5 && step === 5) {
          const data = JSON.parse(response.result.content[0].text);

          console.log('📊 SWARM DASHBOARD:\n');
          console.log(`   Total Agents: ${data.swarmSummary.totalAgents}`);
          console.log(`   Online: ${data.swarmSummary.onlineAgents}`);
          console.log(`   Offline: ${data.swarmSummary.offlineAgents}\n`);

          console.log('   Agent Status:');
          data.agents.forEach(agent => {
            const status = agent.status === 'ONLINE' ? '🟢' : '🔴';
            console.log(`   ${status} Agent ${agent.letter}: ${agent.status} (${agent.model || 'No model'})`);
          });

          console.log('\n═══════════════════════════════════════════════════════════');
          console.log('🎯 PARALLEL AGENT DEPLOYMENT COMPLETE!');
          console.log('═══════════════════════════════════════════════════════════\n');

          console.log('✅ RESULTS:');
          console.log('   ✓ 2 GLM-4.6 agents discovered via MCP');
          console.log('   ✓ Project auto-detected: LocalBrain');
          console.log('   ✓ Context auto-extracted');
          console.log('   ✓ Job proposals generated');
          console.log('   ✓ Tasks available for parallel execution');
          console.log('   ✓ Swarm coordination active\n');

          console.log('🚀 AGENTS READY FOR PARALLEL TASK EXECUTION!');
          console.log('   Agent A: Ready to work on UI/Frontend tasks');
          console.log('   Agent C: Ready to work on Backend tasks\n');

          console.log('📋 TASK ASSIGNMENT RECOMMENDATIONS:');
          console.log('   Agent A → T011 (React Query + SSR)');
          console.log('   Agent C → T018 (RAG Index for Specs)');
          console.log('   Both work in parallel using MCP coordination!\n');

          console.log('🎯 Next: Use Task.tool to deploy specialized agents');
          console.log('   for backend-specialist and ui-specialist-pro!\n');

          setTimeout(() => {
            server.kill();
            process.exit(0);
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
  console.error('⏱️  Deployment timeout (60 seconds)');
  server.kill();
  process.exit(1);
}, 60000);
