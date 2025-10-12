/**
 * Example: How to Use TaskRegistryClient with Auto-Heartbeat
 * ===========================================================
 *
 * This example shows the correct way for agents to use the enhanced
 * TaskRegistryClient with automatic session management and heartbeat.
 */
import { TaskRegistryClient } from './TaskRegistryClient.js';
async function agentWorkflow() {
    console.log('🤖 Starting Agent A workflow...\n');
    // 1. Create client with auto-heartbeat enabled (default)
    const client = new TaskRegistryClient('A', {
        model: 'GLM-4.6',
        project: 'LocalBrain',
        autoHeartbeat: true // Optional: defaults to true
    });
    try {
        // 2. Connect to MCP server (starts auto-heartbeat)
        await client.connect();
        console.log(`✅ Connected! Session ID: ${client.getSessionId()}\n`);
        // 3. Do agent work - heartbeat runs automatically in background
        console.log('🔍 Checking available tasks...');
        const tasks = await client.getAvailableTasks();
        console.log(`Found ${tasks.availableTasks?.length || 0} tasks\n`);
        if (tasks.availableTasks && tasks.availableTasks.length > 0) {
            const task = tasks.availableTasks[0];
            console.log(`📋 Claiming task: ${task.name}`);
            const claimResult = await client.claimTask(task.id);
            console.log(`✅ Task claimed!\n`);
            // Simulate work (heartbeat continues automatically)
            console.log('💼 Working on task...');
            await new Promise(resolve => setTimeout(resolve, 5000));
            // Update progress
            await client.updateProgress(task.id, 50, [], 'Halfway done');
            console.log('📊 Progress updated to 50%\n');
            // More work...
            await new Promise(resolve => setTimeout(resolve, 5000));
            // Complete task
            await client.completeTask(task.id, ['example.ts'], 10);
            console.log('✅ Task completed!\n');
        }
        // 4. Check swarm status (optional)
        const dashboard = await client.getSwarmDashboard();
        console.log('📊 Swarm Status:');
        console.log(`   Online Agents: ${dashboard.swarmSummary.onlineAgents}`);
        console.log(`   Total Tasks: ${dashboard.taskSummary.totalTasks}\n`);
    }
    catch (error) {
        console.error('❌ Error during agent workflow:', error);
    }
    finally {
        // 5. Always disconnect (stops heartbeat, closes session)
        await client.disconnect();
        console.log('👋 Agent workflow complete!\n');
    }
}
/**
 * Example: Manual Heartbeat Control
 * ==================================
 */
async function manualHeartbeatExample() {
    console.log('🤖 Starting Agent B with manual heartbeat...\n');
    // Create client with auto-heartbeat disabled
    const client = new TaskRegistryClient('B', {
        model: 'Sonnet-4.5',
        project: 'LocalBrain',
        autoHeartbeat: false // Disable auto-heartbeat
    });
    try {
        await client.connect();
        console.log('✅ Connected (no auto-heartbeat)\n');
        // Manual heartbeat control
        await client.sendHeartbeat('Working on task X');
        console.log('💓 Manual heartbeat sent\n');
        // Do work...
        await new Promise(resolve => setTimeout(resolve, 5000));
        // Send another heartbeat when needed
        await client.sendHeartbeat('Still working...');
        console.log('💓 Another heartbeat sent\n');
    }
    finally {
        await client.disconnect();
        console.log('👋 Manual heartbeat example complete!\n');
    }
}
/**
 * Example: Long-Running Agent
 * ============================
 */
async function longRunningAgent() {
    console.log('🤖 Starting long-running Agent C...\n');
    const client = new TaskRegistryClient('C', {
        model: 'GLM-4.6',
        project: 'LocalBrain',
        autoHeartbeat: true
    });
    try {
        await client.connect();
        console.log('✅ Connected with auto-heartbeat\n');
        // Simulate long-running work (2 minutes)
        // Heartbeat will fire automatically every 30 seconds
        console.log('💼 Starting long-running work (2 minutes)...');
        console.log('💓 Heartbeat will fire automatically at:');
        console.log('   - 30 seconds');
        console.log('   - 60 seconds');
        console.log('   - 90 seconds');
        console.log('   - 120 seconds\n');
        for (let i = 0; i < 4; i++) {
            await new Promise(resolve => setTimeout(resolve, 30000));
            console.log(`✓ ${(i + 1) * 30} seconds elapsed (heartbeat should have fired)\n`);
        }
        console.log('✅ Long-running work complete!\n');
    }
    finally {
        await client.disconnect();
        console.log('👋 Long-running agent complete!\n');
    }
}
/**
 * Example: Error Handling
 * ========================
 */
async function errorHandlingExample() {
    console.log('🤖 Starting Agent D with error handling...\n');
    const client = new TaskRegistryClient('D', {
        model: 'Sonnet-4.5',
        project: 'LocalBrain'
    });
    try {
        // Connection errors
        try {
            await client.connect();
        }
        catch (error) {
            console.error('❌ Connection failed:', error);
            return;
        }
        // Check if connected
        if (!client.isAgentConnected()) {
            console.error('❌ Not connected!');
            return;
        }
        console.log('✅ Connected successfully\n');
        // Task operations with error handling
        try {
            const tasks = await client.getAvailableTasks();
            console.log(`Found ${tasks.availableTasks?.length || 0} tasks\n`);
        }
        catch (error) {
            console.error('❌ Failed to get tasks:', error);
        }
    }
    finally {
        // Always disconnect, even on errors
        try {
            await client.disconnect();
            console.log('👋 Disconnected safely\n');
        }
        catch (error) {
            console.error('⚠️  Disconnect failed (server may have already closed)');
        }
    }
}
/**
 * Run Examples
 */
async function runExamples() {
    console.log('='.repeat(70));
    console.log('TaskRegistryClient Usage Examples');
    console.log('='.repeat(70));
    console.log('\n');
    // Example 1: Standard workflow
    await agentWorkflow();
    await new Promise(resolve => setTimeout(resolve, 2000));
    // Example 2: Manual heartbeat
    await manualHeartbeatExample();
    await new Promise(resolve => setTimeout(resolve, 2000));
    // Example 3: Long-running (commented out - takes 2 minutes)
    // await longRunningAgent();
    // Example 4: Error handling
    await errorHandlingExample();
    console.log('='.repeat(70));
    console.log('All examples complete!');
    console.log('='.repeat(70));
}
// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runExamples().catch(console.error);
}
export { agentWorkflow, manualHeartbeatExample, longRunningAgent, errorHandlingExample };
//# sourceMappingURL=example-agent-usage.js.map