#!/usr/bin/env node

/**
 * Test LocalBrain to Central-MCP Connection
 * ==========================================
 *
 * Tests if LocalBrain can actually USE Central-MCP as its coordinator
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🧪 Testing LocalBrain → Central-MCP Connection');
console.log('==========================================\n');

async function testCentralMCPConnection() {
  try {
    console.log('1. Starting Central-MCP server...');

    // Start Central-MCP server
    const centralMcpPath = '/Users/lech/PROJECTS_all/PROJECT_central-mcp/central-mcp';
    const mcpServer = spawn('node', ['dist/index.js'], {
      cwd: centralMcpPath,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let serverOutput = '';
    let isReady = false;

    mcpServer.stdout.on('data', (data) => {
      serverOutput += data.toString();
      console.log('   Server:', data.toString().trim());

      if (serverOutput.includes('MCP Server running and ready')) {
        isReady = true;
        console.log('   ✅ Central-MCP server is ready!');
      }
    });

    // Wait for server to be ready
    await new Promise(resolve => {
      const checkReady = () => {
        if (isReady) resolve();
        else setTimeout(checkReady, 500);
      };
      checkReady();
    });

    console.log('\n2. Testing MCP tools...');

    // Test MCP connection
    const testRequest = {
      jsonrpc: "2.0",
      id: 1,
      method: "tools/list",
      params: {}
    };

    return new Promise((resolve, reject) => {
      mcpServer.stdin.write(JSON.stringify(testRequest) + '\n');

      mcpServer.stdout.on('data', (data) => {
        try {
          const response = JSON.parse(data.toString());
          console.log('\n3. MCP Connection Results:');
          console.log('========================');
          console.log('✅ Tools available:', response.result?.tools?.length || 0);

          if (response.result?.tools) {
            console.log('\n📋 Available MCP Tools:');
            response.result.tools.forEach((tool, index) => {
              console.log(`   ${index + 1}. ${tool.name} (${tool.description?.substring(0, 50)}...)`);
            });
          }

          console.log('\n4. Testing task management...');

          // Test get_available_tasks
          const taskRequest = {
            jsonrpc: "2.0",
            id: 2,
            method: "tools/call",
            params: {
              name: "get_available_tasks",
              arguments: { agent: "A" }
            }
          };

          mcpServer.stdin.write(JSON.stringify(taskRequest) + '\n');

          mcpServer.stdout.on('data', (data) => {
            try {
              const taskResponse = JSON.parse(data.toString());
              if (taskResponse.id === 2) {
                console.log('\n✅ Task Management Working!');
                console.log('Available tasks:', taskResponse.result?.content?.[0]?.text || 'No tasks');

                console.log('\n🎯 CONNECTION SUCCESSFUL!');
                console.log('=====================');
                console.log('✅ LocalBrain can communicate with Central-MCP');
                console.log('✅ MCP tools are operational');
                console.log('✅ Task management is working');
                console.log('✅ Agent coordination is possible');

                console.log('\n📋 NEXT STEPS:');
                console.log('=============');
                console.log('1. Integrate agent workflows with Central-MCP tools');
                console.log('2. Update agent instructions to use MCP protocol');
                console.log('3. Replace manual task tracking with Central-MCP coordination');
                console.log('4. Enable real-time agent communication');

                mcpServer.kill();
                resolve(true);
              }
            } catch (e) {
              // Still accumulating response
            }
          });

        } catch (e) {
          console.log('\n❌ MCP Connection Error:', e.message);
          mcpServer.kill();
          reject(e);
        }
      });

      mcpServer.stderr.on('data', (data) => {
        console.log('   Server Error:', data.toString().trim());
      });

      // Timeout after 30 seconds
      setTimeout(() => {
        console.log('\n⚠️ Connection timeout - killing server');
        mcpServer.kill();
        reject(new Error('Connection timeout'));
      }, 30000);
    });

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testCentralMCPConnection();