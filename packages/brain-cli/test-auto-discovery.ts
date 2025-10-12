#!/usr/bin/env tsx
/**
 * Test Auto-Discovery System
 * ===========================
 *
 * Tests all 3 discovery methods
 */

import { MCPAutoDiscovery } from './src/lib/auto-discovery.js';
import chalk from 'chalk';

async function testDiscovery() {
  console.log(chalk.cyan('🧪 Testing MCP Auto-Discovery System\n'));

  const discovery = new MCPAutoDiscovery();

  // Test full discovery
  console.log(chalk.yellow('Running full auto-discovery...'));
  const result = await discovery.discover();

  console.log('\n' + chalk.green('📊 Discovery Result:\n'));
  console.log(`   Found: ${result.found ? chalk.green('✅ YES') : chalk.red('❌ NO')}`);
  console.log(`   Method: ${chalk.cyan(result.method)}`);
  console.log(`   Message: ${result.message}`);

  if (result.server) {
    console.log('\n' + chalk.yellow('🔧 Server Details:\n'));
    console.log(`   ID: ${result.server.id}`);
    console.log(`   Name: ${result.server.name}`);
    console.log(`   Type: ${result.server.type}`);

    if (result.server.path) {
      console.log(`   Path: ${result.server.path}`);
    }
    if (result.server.url) {
      console.log(`   URL: ${result.server.url}`);
    }

    console.log(`   Projects: ${result.server.projects.join(', ')}`);
    console.log(`   Priority: ${result.server.priority}`);
  }

  if (result.servers && result.servers.length > 1) {
    console.log('\n' + chalk.yellow(`📋 Alternative Servers (${result.servers.length - 1}):\n`));

    result.servers.slice(1, 4).forEach((s, i) => {
      console.log(`   ${i + 2}. ${s.name} (${s.type})`);
    });
  }

  // Test registry
  console.log('\n' + chalk.yellow('📚 Checking Global Registry:\n'));
  const allServers = discovery.getAllServers();
  console.log(`   Total registered: ${allServers.length}`);

  allServers.forEach((s, i) => {
    const status = s.active ? chalk.green('🟢 ACTIVE') : chalk.gray('🔴 INACTIVE');
    console.log(`   ${i + 1}. ${s.name} - ${status}`);
  });

  console.log('\n' + chalk.green('✅ Auto-Discovery Test Complete!\n'));
}

testDiscovery().catch(console.error);
