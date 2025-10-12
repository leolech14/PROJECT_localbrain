#!/usr/bin/env node

/**
 * Agent C (Backend Specialist) Task Client
 * ======================================
 *
 * Connects to MCP server as Agent C to query and claim backend tasks
 */

const { TaskRegistryClient } = require('./TaskRegistryClient');

async function agentCTaskOperations() {
  console.log('🤖 Agent C (Backend Specialist - GLM-4.6) connecting to MCP server...');

  const client = new TaskRegistryClient('C', {
    model: 'GLM-4.6',
    project: 'LocalBrain',
    autoHeartbeat: true
  });

  try {
    // Connect to MCP server
    await client.connect();

    // Query available tasks for Agent C
    console.log('\n📋 Querying available tasks for Agent C (Backend Specialist)...');
    const taskResponse = await client.getAvailableTasks(true);

    console.log('\n📊 Task Response:');
    console.log(JSON.stringify(taskResponse, null, 2));

    // Check if we have available tasks
    if (taskResponse.availableTasks > 0 && taskResponse.tasks.length > 0) {
      console.log(`\n🎯 Found ${taskResponse.availableTasks} available tasks for Agent C:`);

      // Display available tasks
      taskResponse.tasks.forEach((task, index) => {
        console.log(`\n${index + 1}. Task ${task.id}: ${task.title}`);
        console.log(`   Priority: ${task.priority}`);
        console.log(`   Estimated: ${task.estimatedHours}h`);
        console.log(`   Description: ${task.description.substring(0, 100)}...`);
      });

      // Auto-claim first available task (T010, T011, or T018 based on briefing)
      const preferredTasks = ['T010', 'T011', 'T018'];
      const taskToClaim = taskResponse.tasks.find(task => preferredTasks.includes(task.id)) || taskResponse.tasks[0];

      console.log(`\n🚀 Claiming Task ${taskToClaim.id}: ${taskToClaim.title}...`);
      const claimResponse = await client.claimTask(taskToClaim.id);

      console.log('\n✅ Task Claimed Successfully!');
      console.log(JSON.stringify(claimResponse, null, 2));

      // Start the task with initial progress
      console.log(`\n📝 Starting Task ${taskToClaim.id} - Setting initial progress...`);
      await client.updateProgress(taskToClaim.id, 10, [], 'Agent C (Backend Specialist) starting task implementation');

      console.log('\n🎯 AGENT C IS READY TO IMPLEMENT!');
      console.log(`📂 Task ID: ${taskToClaim.id}`);
      console.log(`📝 Task Title: ${taskToClaim.title}`);
      console.log(`📍 Working Directory: /Users/lech/PROJECTS_all/LocalBrain/`);

      // Keep connection alive for 30 seconds to show heartbeat
      console.log('\n💓 Heartbeat active for 30 seconds...');
      await new Promise(resolve => setTimeout(resolve, 30000));

      // Disconnect
      await client.disconnect();

    } else {
      console.log('\n⚠️ No available tasks for Agent C');
      console.log('All tasks might be completed or blocked on dependencies');
    }

  } catch (error) {
    console.error('❌ Agent C operation failed:', error);
    await client.disconnect();
    process.exit(1);
  }
}

// Execute Agent C task operations
agentCTaskOperations();