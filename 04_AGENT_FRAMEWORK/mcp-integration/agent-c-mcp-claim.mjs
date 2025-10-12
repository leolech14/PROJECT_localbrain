#!/usr/bin/env node
/**
 * Agent C MCP Protocol Test
 * ========================
 *
 * Following correct MCP protocol - NO manual registry editing!
 */

import { TaskRegistryClient } from './TaskRegistryClient.js';

console.log('🚀 Agent C (Backend Services Specialist) - MCP Protocol Connection');
console.log('📋 Following correct MCP Database-First approach\n');

const client = new TaskRegistryClient('C');

async function demonstrateMCPProtocol() {
  try {
    console.log('1️⃣ Querying available tasks for Agent C...');
    const availableTasks = await client.getAvailableTasks(true);

    console.log('📊 Available Tasks:', JSON.stringify(availableTasks, null, 2));

    // Look for T018
    const t018 = availableTasks.tasks?.find(task => task.id === 'T018');

    if (t018) {
      console.log('✅ Found T018 - RAG Index for Specifications');
      console.log('📋 Task Details:');
      console.log(`   ID: ${t018.id}`);
      console.log(`   Name: ${t018.name}`);
      console.log(`   Status: ${t018.status}`);
      console.log(`   Priority: ${t018.priority}`);

      if (t018.status === 'AVAILABLE') {
        console.log('\n2️⃣ Claiming T018 via MCP protocol...');
        const claimResult = await client.claimTask('T018');
        console.log('✅ Task claimed via MCP!');
        console.log('📊 Claim Result:', JSON.stringify(claimResult, null, 2));

        console.log('\n3️⃣ Updating progress (20% - Started RAG implementation)...');
        const progressResult = await client.updateProgress(
          'T018',
          20,
          [
            '01_CODEBASES/backend/rag/package.json',
            '01_CODEBASES/backend/rag/src/types/index.ts',
            '01_CODEBASES/backend/rag/src/config/index.ts',
            '01_CODEBASES/backend/rag/src/database/index.ts'
          ],
          'Built RAG system foundation - types, config, database layer'
        );
        console.log('✅ Progress updated via MCP!');
        console.log('📊 Progress Result:', JSON.stringify(progressResult, null, 2));

      } else {
        console.log(`❌ T018 not available (status: ${t018.status})`);
      }
    } else {
      console.log('❌ T018 not found in available tasks');
    }

    console.log('\n🎯 MCP Protocol Summary:');
    console.log('✅ Connected to MCP server');
    console.log('✅ Queried available tasks');
    console.log('✅ Used TaskRegistryClient (NO manual registry editing)');
    console.log('✅ All operations via MCP database');

  } catch (error) {
    console.error('❌ MCP Protocol Error:', error);
  } finally {
    client.disconnect();
  }
}

demonstrateMCPProtocol();