#!/usr/bin/env node

/**
 * Agent C (Backend Specialist) Simple MCP Client
 * ==============================================
 *
 * Direct MCP connection for Agent C to query and claim tasks
 */

const { spawn } = require('child_process');

class AgentCSimpleClient {
  constructor() {
    this.agent = 'C'; // Backend Specialist
    this.serverProcess = null;
    this.messageId = 1;
    this.pendingRequests = new Map();
  }

  async connect() {
    console.log('🤖 Agent C (Backend Specialist - GLM-4.6) starting MCP connection...');

    // Start MCP server process
    this.serverProcess = spawn('node', ['dist/index.js'], {
      cwd: '../../01_CODEBASES/mcp-servers/localbrain-task-registry',
      stdio: ['pipe', 'pipe', 'pipe']
    });

    // Set up response handling
    this.serverProcess.stdout.on('data', (data) => {
      const responses = data.toString().trim().split('\n');
      responses.forEach(response => {
        if (response.trim()) {
          try {
            const parsed = JSON.parse(response);
            if (parsed.result && this.pendingRequests.has(parsed.id)) {
              const { resolve } = this.pendingRequests.get(parsed.id);
              resolve(parsed.result);
              this.pendingRequests.delete(parsed.id);
            }
          } catch (e) {
            // Not JSON, ignore server logs
          }
        }
      });
    });

    this.serverProcess.stderr.on('data', (data) => {
      console.error('Server error:', data.toString());
    });

    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('✅ MCP Server connection established');
  }

  async callTool(toolName, parameters) {
    return new Promise((resolve, reject) => {
      const id = this.messageId++;
      const request = {
        jsonrpc: "2.0",
        id,
        method: "tools/call",
        params: {
          name: toolName,
          arguments: { ...parameters, agent: this.agent }
        }
      };

      this.pendingRequests.set(id, { resolve, reject });

      this.serverProcess.stdin.write(JSON.stringify(request) + '\n');

      // Timeout after 10 seconds
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error(`Timeout waiting for ${toolName} response`));
        }
      }, 10000);
    });
  }

  async getAvailableTasks() {
    console.log('📋 Querying available tasks for Agent C (Backend Specialist)...');
    const response = await this.callTool('get_available_tasks', { includeDetails: true });

    if (response.content && response.content[0]) {
      return JSON.parse(response.content[0].text);
    }
    return response;
  }

  async claimTask(taskId) {
    console.log(`🚀 Claiming Task ${taskId}...`);
    const response = await this.callTool('claim_task', { taskId });

    if (response.content && response.content[0]) {
      return JSON.parse(response.content[0].text);
    }
    return response;
  }

  async updateProgress(taskId, percent, notes) {
    return this.callTool('update_task_progress', {
      taskId,
      status: 'IN_PROGRESS',
      completionPercent: percent,
      filesCreated: [],
      notes
    });
  }

  disconnect() {
    if (this.serverProcess) {
      this.serverProcess.kill();
      console.log('🔌 Disconnected from MCP server');
    }
  }
}

async function agentCExecute() {
  const client = new AgentCSimpleClient();

  try {
    await client.connect();

    // Get available tasks
    const taskData = await client.getAvailableTasks();

    console.log('\n📊 Agent C Task Status:');
    console.log(`Agent: ${taskData.agent}`);
    console.log(`Available Tasks: ${taskData.availableTasks}`);
    console.log(`Message: ${taskData.message}`);

    if (taskData.availableTasks > 0 && taskData.tasks.length > 0) {
      console.log('\n🎯 Available Tasks for Agent C (Backend Specialist):');

      taskData.tasks.forEach((task, index) => {
        console.log(`\n${index + 1}. ${task.id}: ${task.title}`);
        console.log(`   Priority: ${task.priority}`);
        console.log(`   Estimated: ${task.estimatedHours}h`);
        console.log(`   Status: ${task.status}`);
        console.log(`   Description: ${task.description.substring(0, 150)}...`);
      });

      // Look for preferred tasks (T010, T011, T018)
      const preferredTasks = ['T010', 'T011', 'T018'];
      let taskToClaim = null;

      // Try to find preferred tasks first
      for (const preferredId of preferredTasks) {
        const found = taskData.tasks.find(task => task.id === preferredId);
        if (found) {
          taskToClaim = found;
          break;
        }
      }

      // If no preferred tasks, claim first available
      if (!taskToClaim) {
        taskToClaim = taskData.tasks[0];
      }

      console.log(`\n🚀 CLAIMING TASK: ${taskToClaim.id} - ${taskToClaim.title}`);

      const claimResponse = await client.claimTask(taskToClaim.id);

      console.log('\n✅ TASK CLAIMED SUCCESSFULLY!');
      console.log(`Task ID: ${claimResponse.taskId}`);
      console.log(`Status: ${claimResponse.status}`);
      console.log(`Agent: ${claimResponse.agent}`);

      // Set initial progress
      await client.updateProgress(taskToClaim.id, 10, 'Agent C (Backend Specialist) starting implementation');

      console.log('\n🎯 AGENT C READY FOR IMPLEMENTATION!');
      console.log('=====================================');
      console.log(`📝 Task: ${taskToClaim.id} - ${taskToClaim.title}`);
      console.log(`📂 Working Directory: /Users/lech/PROJECTS_all/LocalBrain/`);
      console.log(`🧠 Agent: GLM-4.6 Backend Specialist`);
      console.log(`⏱️  Estimated: ${taskToClaim.estimatedHours} hours`);
      console.log(`🎯 Priority: ${taskToClaim.priority}`);

      // Update todo list
      console.log('\n📋 UPDATING TASK PROGRESS...');

    } else {
      console.log('\n⚠️ No available tasks for Agent C');
      console.log('All tasks completed or blocked on dependencies');
    }

  } catch (error) {
    console.error('❌ Agent C operation failed:', error);
  } finally {
    // Keep alive for a moment to show final status
    await new Promise(resolve => setTimeout(resolve, 2000));
    client.disconnect();
  }
}

// Execute Agent C task acquisition
agentCExecute();