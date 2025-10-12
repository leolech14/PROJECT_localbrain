/**
 * Connect Command
 * ===============
 *
 * Main connection command that discovers the environment,
 * identifies the agent, and loads context.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import boxen from 'boxen';
import figures from 'figures';
import Table from 'cli-table3';
import gradient from 'gradient-string';
import { config } from '../lib/config.js';
import { mcpClient, DiscoveryResult } from '../lib/mcp-client.js';
import { formatBytes, formatTime } from '../utils/format.js';

export function connectCommand(program: Command): void {
  program
    .command('connect')
    .description('Connect to Central Intelligence and discover your environment')
    .option('-p, --project <path>', 'Project directory (default: current directory)')
    .option('-m, --model <id>', 'Model ID to use')
    .option('--no-banner', 'Skip the welcome banner')
    .action(async (options) => {
      try {
        // Check authentication
        if (!config.isAuthenticated()) {
          console.log(
            chalk.yellow(
              `\n${figures.warning} Not authenticated. Please run ${chalk.cyan('brain auth login')} first.\n`
            )
          );
          process.exit(1);
        }

        // Show banner unless disabled
        if (options.banner !== false) {
          const banner = gradient.rainbow.multiline([
            '═══════════════════════════════════════════════',
            '     CENTRAL INTELLIGENCE CONNECTION          ',
            '       Discovering Your Environment           ',
            '═══════════════════════════════════════════════'
          ].join('\n'));
          console.log('\n' + banner + '\n');
        }

        // Get project directory
        const projectPath = options.project || process.cwd();
        const modelId = options.model || 'brain-cli-2.0';

        // Connect to MCP server
        await mcpClient.connect();

        // Discover environment
        const discovery = await mcpClient.discoverEnvironment(projectPath, modelId);

        // Display discovery results
        displayDiscoveryResults(discovery);

        // Save project info
        if (discovery.project) {
          config.set('currentProject', discovery.project.name);
        }

        // Disconnect
        await mcpClient.disconnect();

        // Show next steps
        console.log(chalk.bold('\nNext steps:'));
        console.log(
          `  ${chalk.cyan('brain task list')}      ${chalk.gray('# View available tasks')}`
        );
        if (discovery.proposals && discovery.proposals.length > 0) {
          const topTask = discovery.proposals[0];
          console.log(
            `  ${chalk.cyan(`brain task claim ${topTask.taskId}`)} ${chalk.gray(`# Claim recommended task`)}`
          );
        }

      } catch (error: any) {
        console.error(
          chalk.red(`\n${figures.cross} Connection failed: ${error.message}`)
        );

        // Show troubleshooting tips
        console.log(chalk.bold('\nTroubleshooting:'));
        console.log(`  1. Ensure the MCP server is running`);
        console.log(`  2. Check your network connection`);
        console.log(`  3. Verify your authentication with ${chalk.cyan('brain auth status')}`);
        console.log(`  4. Try setting BRAIN_SERVER_URL environment variable`);

        process.exit(1);
      }
    });
}

/**
 * Display discovery results in a beautiful format
 */
function displayDiscoveryResults(discovery: DiscoveryResult): void {
  // Agent Information
  console.log(chalk.bold.cyan('\n👤 Agent Information'));
  const agentBox = boxen(
    [
      discovery.agentIdentity.recognized
        ? `${chalk.green(figures.tick)} Recognized Agent`
        : `${chalk.yellow(figures.info)} New Agent Created`,
      '',
      `${chalk.gray('Name:')} ${chalk.bold(discovery.agent.name)}`,
      `${chalk.gray('Model:')} ${discovery.agent.modelId}`,
      `${chalk.gray('Tracking ID:')} ${discovery.agent.trackingId.substring(0, 8)}...`,
      discovery.agentIdentity.recognized
        ? `${chalk.gray('Previous Sessions:')} ${discovery.agentIdentity.previousSessions}`
        : '',
      `${chalk.gray('Recognition Method:')} ${discovery.agentIdentity.method}`,
      `${chalk.gray('Confidence:')} ${discovery.agentIdentity.confidence}%`
    ]
      .filter(Boolean)
      .join('\n'),
    {
      padding: 1,
      borderStyle: 'round',
      borderColor: discovery.agentIdentity.recognized ? 'green' : 'yellow'
    }
  );
  console.log(agentBox);

  // Agent Capabilities
  const capabilities = discovery.agent.capabilities;
  console.log(chalk.bold.cyan('\n🎯 Agent Capabilities'));

  const capsTable = new Table({
    head: [chalk.gray('Capability'), chalk.gray('Status')],
    style: { head: [], border: [] }
  });

  capsTable.push(
    ['UI Development', capabilities.ui ? chalk.green('✓') : chalk.gray('✗')],
    ['Backend Services', capabilities.backend ? chalk.green('✓') : chalk.gray('✗')],
    ['Design System', capabilities.design ? chalk.green('✓') : chalk.gray('✗')],
    ['Integration', capabilities.integration ? chalk.green('✓') : chalk.gray('✗')],
    ['Context Size', formatBytes(capabilities.contextSize)],
    ['Multimodal', capabilities.multimodal ? chalk.green('✓') : chalk.gray('✗')],
    ['Languages', capabilities.languages.join(', ')]
  );

  console.log(capsTable.toString());

  // Project Information
  console.log(chalk.bold.cyan('\n📁 Project Information'));
  const projectBox = boxen(
    [
      discovery.projectRecognized
        ? `${chalk.green(figures.tick)} Project Recognized`
        : `${chalk.yellow(figures.info)} New Project`,
      '',
      `${chalk.gray('Name:')} ${chalk.bold(discovery.project.name)}`,
      `${chalk.gray('Type:')} ${discovery.project.type}`,
      `${chalk.gray('Path:')} ${discovery.project.path}`,
      discovery.project.gitRemote
        ? `${chalk.gray('Git Remote:')} ${discovery.project.gitRemote}`
        : '',
      discovery.project.vision
        ? `${chalk.gray('Vision:')} ${discovery.project.vision.substring(0, 50)}...`
        : ''
    ]
      .filter(Boolean)
      .join('\n'),
    {
      padding: 1,
      borderStyle: 'round',
      borderColor: discovery.projectRecognized ? 'green' : 'yellow'
    }
  );
  console.log(projectBox);

  // Context Statistics
  console.log(chalk.bold.cyan('\n📚 Context Loaded'));

  const contextTable = new Table({
    head: [chalk.gray('Category'), chalk.gray('Files'), chalk.gray('Size')],
    style: { head: [], border: [] }
  });

  contextTable.push(
    ['Specifications', discovery.categories.specs.toString(), '-'],
    ['Documentation', discovery.categories.docs.toString(), '-'],
    ['Code Files', discovery.categories.code.toString(), '-'],
    ['Architecture', discovery.categories.architecture.toString(), '-'],
    [chalk.bold('Total'), chalk.bold(discovery.context.totalFiles.toString()), chalk.bold(formatBytes(discovery.context.totalSize))]
  );

  console.log(contextTable.toString());

  // Technologies Detected
  if (discovery.context.technologies && discovery.context.technologies.length > 0) {
    console.log(chalk.gray(`\nTechnologies: ${discovery.context.technologies.join(', ')}`));
  }

  // Job Proposals
  if (discovery.proposals && discovery.proposals.length > 0) {
    console.log(chalk.bold.cyan('\n📋 Recommended Tasks'));

    const taskTable = new Table({
      head: [
        chalk.gray('ID'),
        chalk.gray('Task'),
        chalk.gray('Match'),
        chalk.gray('Effort'),
        chalk.gray('Impact')
      ],
      style: { head: [], border: [] },
      colWidths: [8, 40, 8, 10, 10]
    });

    discovery.proposals.slice(0, 5).forEach((proposal) => {
      const recommendedIcon = proposal.recommended ? chalk.green('★') : '';
      const readyIcon = proposal.readyToStart ? chalk.green('✓') : chalk.yellow('⏱');

      taskTable.push([
        chalk.cyan(proposal.taskId),
        `${recommendedIcon} ${proposal.taskName.substring(0, 35)}${proposal.taskName.length > 35 ? '...' : ''}`,
        `${proposal.matchScore}%`,
        proposal.estimatedEffort,
        proposal.impact
      ]);
    });

    console.log(taskTable.toString());

    if (discovery.proposals.length > 5) {
      console.log(
        chalk.gray(`\n... and ${discovery.proposals.length - 5} more tasks available`)
      );
    }
  }

  // Summary
  const summaryBox = boxen(
    [
      chalk.green.bold('✅ Ready to work!'),
      '',
      `${chalk.gray('Project:')} ${discovery.project.name}`,
      `${chalk.gray('Role:')} ${getAgentRole(discovery.agent.capabilities)}`,
      `${chalk.gray('Available Tasks:')} ${discovery.proposals.length} tasks`,
      `${chalk.gray('Context Loaded:')} ${discovery.context.totalFiles} files (${formatBytes(discovery.context.totalSize)})`,
      '',
      chalk.gray(`Discovery completed in ${formatTime(discovery.discoveryTime)}`)
    ].join('\n'),
    {
      padding: 1,
      margin: { top: 1 },
      borderStyle: 'double',
      borderColor: 'green',
      title: '🎯 Summary',
      titleAlignment: 'center'
    }
  );

  console.log(summaryBox);
}

/**
 * Get agent role based on capabilities
 */
function getAgentRole(capabilities: any): string {
  const roles = [];
  if (capabilities.ui) roles.push('UI Specialist');
  if (capabilities.backend) roles.push('Backend Specialist');
  if (capabilities.design) roles.push('Design Specialist');
  if (capabilities.integration) roles.push('Integration Specialist');

  return roles.length > 0 ? roles.join(', ') : 'General Developer';
}