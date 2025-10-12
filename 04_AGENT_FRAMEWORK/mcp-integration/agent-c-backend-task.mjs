#!/usr/bin/env node
/**
 * Agent C Backend Task Claim Script
 * =================================
 *
 * Connect to MCP server as Agent C (Backend Specialist - GLM-4.6)
 * Query available backend tasks and claim the most appropriate one.
 *
 * Backend Tasks for Agent C:
 * - T010: Change-Set Ledger Database Design (COMPLETE)
 * - T011: Context Manager Implementation (Agent A task)
 * - T018: RAG Index for Specifications (AVAILABLE)
 */

import { TaskRegistryClient } from './TaskRegistryClient.js';

async function main() {
  console.log('🤖 Agent C (Backend Specialist) - GLM-4.6');
  console.log('===========================================');
  console.log('🎯 Role: Backend Services Specialist');
  console.log('📋 Focus: Cloud-native infrastructure, context management, RAG systems');
  console.log('');

  const client = new TaskRegistryClient('C', {
    model: 'GLM-4.6',
    project: 'LocalBrain',
    machineId: 'agent-c-backend-specialist',
    autoHeartbeat: true
  });

  try {
    // Connect to MCP server
    console.log('🔌 Connecting to LocalBrain MCP Task Registry...');
    await client.connect();
    console.log(`✅ Connected! Session ID: ${client.getSessionId()}`);
    console.log('');

    // Query available tasks for Agent C
    console.log('📋 Querying available tasks for Agent C...');
    const tasks = await client.getAvailableTasks(true);

    console.log('\n📊 Task Query Results:');
    console.log(`   Agent: ${tasks.agent}`);
    console.log(`   Available Tasks: ${tasks.availableTasks}`);
    console.log(`   Message: ${tasks.message}`);

    if (tasks.tasks && tasks.tasks.length > 0) {
      console.log('\n📋 Detailed Task List:');
      tasks.tasks.forEach((task, index) => {
        console.log(`   ${index + 1}. ${task.taskId}: ${task.title}`);
        console.log(`      Status: ${task.status}`);
        console.log(`      Priority: ${task.priority}`);
        console.log(`      Estimate: ${task.estimatedHours} hours`);
        if (task.description) {
          console.log(`      Description: ${task.description}`);
        }
        if (task.dependencies && task.dependencies.length > 0) {
          console.log(`      Dependencies: ${task.dependencies.join(', ')}`);
        }
        console.log('');
      });

      // Look for backend-specific tasks (T010, T011, T018)
      const backendTasks = tasks.tasks.filter(task =>
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

        if (availableBackendTask) {
          console.log(`\n🔒 Claiming task: ${availableBackendTask.taskId}`);
          console.log(`   Title: ${availableBackendTask.title}`);

          const claimResult = await client.claimTask(availableBackendTask.taskId);
          console.log('\n✅ TASK CLAIMED SUCCESSFULLY!');
          console.log('📋 Claim Result:', JSON.stringify(claimResult, null, 2));

          console.log('\n🎉 Agent C - Task Assignment Complete!');
          console.log('=====================================');
          console.log(`📋 Task ID: ${availableBackendTask.taskId}`);
          console.log(`📝 Title: ${availableBackendTask.title}`);
          console.log(`📖 Description: ${availableBackendTask.description}`);
          console.log(`⏱️  Estimated Hours: ${availableBackendTask.estimatedHours}`);
          console.log(`🎯 Priority: ${availableBackendTask.priority}`);
          console.log(`📁 Location: ${availableBackendTask.location}`);

          if (availableBackendTask.dependencies && availableBackendTask.dependencies.length > 0) {
            console.log(`🔗 Dependencies: ${availableBackendTask.dependencies.join(', ')}`);
          }

          // Provide specific implementation guidance based on task
          console.log('\n💡 IMPLEMENTATION GUIDANCE:');
          if (availableBackendTask.taskId === 'T018') {
            console.log('   📚 RAG Index for Specifications:');
            console.log('   - Focus on vector database integration');
            console.log('   - Implement semantic search capabilities');
            console.log('   - Build document chunking strategies');
            console.log('   - Create API endpoints for queries');
          } else if (availableBackendTask.taskId === 'T010') {
            console.log('   🗄️  Change-Set Ledger Database:');
            console.log('   - Design audit trail schema');
            console.log('   - Implement atomic operations');
            console.log('   - Create migration scripts');
          } else if (availableBackendTask.taskId === 'T011') {
            console.log('   🧠 Context Manager:');
            console.log('   - Build context persistence layer');
            console.log('   - Implement context retrieval APIs');
            console.log('   - Design context expiration policies');
          }

          // Send heartbeat showing current activity
          await client.sendHeartbeat(`Claimed and starting ${availableBackendTask.taskId}: ${availableBackendTask.title}`);
          console.log('\n💓 Heartbeat sent - Task tracking started');

        } else {
          console.log('\n❌ No backend tasks available for claiming');
          console.log('💡 All backend tasks (T010, T011, T018) are either:');
          console.log('   - Already completed');
          console.log('   - Currently in progress');
          console.log('   - Blocked by dependencies');
        }

      } else {
        console.log('\n❌ No backend-specific tasks (T010, T011, T018) found');
        console.log('💡 Available tasks may be for other agents');
      }

    } else {
      console.log('\n❌ No available tasks found for Agent C');
      console.log('💡 All Agent C tasks may be completed or blocked');
    }

    // Get swarm dashboard for context
    console.log('\n📊 Swarm Dashboard Status:');
    const dashboard = await client.getSwarmDashboard();
    if (dashboard.swarmSummary) {
      console.log(`   Online Agents: ${dashboard.swarmSummary.onlineAgents}`);
      console.log(`   Total Tasks: ${dashboard.taskSummary?.totalTasks || 'N/A'}`);
      console.log(`   Overall Progress: ${dashboard.taskSummary?.completionRate || 'N/A'}%`);
    }

  } catch (error) {
    console.error('❌ Error during Agent C task query:', error);

    if (error.message.includes('already connected')) {
      console.log('💡 Agent C may already be connected from another session');
    }
  } finally {
    // Disconnect from MCP server
    console.log('\n🔌 Disconnecting from MCP server...');
    try {
      await client.disconnect();
      console.log('✅ Disconnected successfully');
    } catch (error) {
      console.log('⚠️  Disconnect note: Server may have already closed');
    }
  }

  console.log('\n👋 Agent C task query complete!');
}

// Run the script
main().catch(console.error);