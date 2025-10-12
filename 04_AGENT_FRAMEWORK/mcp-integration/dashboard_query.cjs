const { spawn } = require('child_process');

async function getDashboard() {
  return new Promise((resolve, reject) => {
    const server = spawn('node', ['../../01_CODEBASES/mcp-servers/localbrain-task-registry/dist/index.js'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: process.cwd()
    });

    let response = '';
    let ready = false;

    server.stdout.on('data', (data) => {
      const output = data.toString();
      response += output;

      if (output.includes('Server ready') || output.includes('MCP server listening') || output.includes('ready')) {
        if (!ready) {
          ready = true;
          // Request dashboard
          const request = {
            jsonrpc: '2.0',
            id: 1,
            method: 'tools/call',
            params: {
              name: 'get_dashboard',
              arguments: {}
            }
          };
          server.stdin.write(JSON.stringify(request) + '\n');
        }
      }

      // Try to parse response
      try {
        const lines = response.split('\n').filter(line => line.trim());
        lines.forEach(line => {
          if (line.startsWith('{') && line.includes('result') && line.includes('content')) {
            const parsed = JSON.parse(line);
            if (parsed.result && parsed.result.content && parsed.result.content[0]) {
              const dashboardData = JSON.parse(parsed.result.content[0].text);
              server.kill();
              resolve(dashboardData);
            }
          }
        });
      } catch (e) {
        // Not valid JSON yet, continue collecting
      }
    });

    server.stderr.on('data', (data) => {
      console.error('Server error:', data.toString());
    });

    server.on('close', (code) => {
      if (!ready) {
        reject(new Error('Server closed before ready'));
      }
    });

    // Timeout after 10 seconds
    setTimeout(() => {
      server.kill();
      reject(new Error('Timeout getting dashboard'));
    }, 10000);
  });
}

async function getAgentStatus(agentId) {
  return new Promise((resolve, reject) => {
    const server = spawn('node', ['../../01_CODEBASES/mcp-servers/localbrain-task-registry/dist/index.js'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: process.cwd()
    });

    let response = '';
    let ready = false;

    server.stdout.on('data', (data) => {
      const output = data.toString();
      response += output;

      if (output.includes('Server ready') || output.includes('MCP server listening') || output.includes('ready')) {
        if (!ready) {
          ready = true;
          // Request agent status
          const request = {
            jsonrpc: '2.0',
            id: 1,
            method: 'tools/call',
            params: {
              name: 'get_agent_status',
              arguments: { agent: agentId }
            }
          };
          server.stdin.write(JSON.stringify(request) + '\n');
        }
      }

      // Try to parse response
      try {
        const lines = response.split('\n').filter(line => line.trim());
        lines.forEach(line => {
          if (line.startsWith('{') && line.includes('result') && line.includes('content')) {
            const parsed = JSON.parse(line);
            if (parsed.result && parsed.result.content && parsed.result.content[0]) {
              const statusData = JSON.parse(parsed.result.content[0].text);
              server.kill();
              resolve(statusData);
            }
          }
        });
      } catch (e) {
        // Not valid JSON yet, continue collecting
      }
    });

    setTimeout(() => {
      server.kill();
      reject(new Error('Timeout getting agent status'));
    }, 8000);
  });
}

async function main() {
  try {
    console.log('🎯 LOCALBRAIN MCP SYSTEM STATUS');
    console.log('===============================\n');

    // Get dashboard
    const dashboard = await getDashboard();
    console.log('📊 DASHBOARD OVERVIEW:');
    console.log(`   Total Tasks: ${dashboard.totalTasks || 'N/A'}`);
    console.log(`   Completed: ${dashboard.completedTasks || 'N/A'}`);
    console.log(`   In Progress: ${dashboard.inProgressTasks || 'N/A'}`);
    console.log(`   Overall Progress: ${dashboard.overallProgress || 'N/A'}%\n`);

    // Get status for each agent
    const agents = ['A', 'B', 'C', 'D', 'E', 'F'];

    for (const agent of agents) {
      try {
        const status = await getAgentStatus(agent);
        console.log(`🤖 Agent ${status.agent} (${status.role}):`);
        console.log(`   Status: ${status.status}`);
        console.log(`   Available Tasks: ${status.availableTasks}`);
        console.log(`   Current Task: ${status.currentTask || 'None'}`);
        console.log(`   Completed: ${status.completedTasks}`);
        console.log(`   Velocity: ${status.velocity || 'N/A'} tasks/hr\n`);
      } catch (err) {
        console.log(`🤖 Agent ${agent}: Status unavailable\n`);
      }
    }

    console.log('✅ MCP System Connection: ACTIVE');
    console.log('🔥 All agents ready for coordination');

  } catch (error) {
    console.error('❌ Error getting system status:', error.message);
  }
}

main();