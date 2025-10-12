#!/usr/bin/env node

/**
 * Brain CLI - Beautiful Central Intelligence Interface
 * ===================================================
 *
 * Doppler-simple commands for universal agent orchestration.
 * One command connects you, identifies your role, loads your context, and gets you working.
 *
 * @author Agent A (UI Specialist)
 * @version 2.0.0
 */

import { Command } from 'commander';
import chalk from 'chalk';
import gradient from 'gradient-string';
import boxen from 'boxen';
import figures from 'figures';
import { createRequire } from 'module';

// Commands
import { authCommands } from './commands/auth.js';
import { connectCommand } from './commands/connect.js';
import { taskCommands } from './commands/task.js';
import { configCommands } from './commands/config.js';
import { projectCommands } from './commands/project.js';
import { contextCommands } from './commands/context.js';
import { agentCommands } from './commands/agent.js';
import { teamCommand } from './commands/team.js';

// Get package version
const require = createRequire(import.meta.url);
const packageJson = require('../package.json');

// Create main program
const program = new Command();

// ASCII Art Banner
const banner = gradient.rainbow.multiline([
  '╔══════════════════════════════════════════╗',
  '║     CENTRAL INTELLIGENCE SYSTEM         ║',
  '║        Universal Agent Orchestration     ║',
  '╚══════════════════════════════════════════╝'
].join('\n'));

// Configure program
program
  .name('brain')
  .description('Central Intelligence CLI - Doppler-simple agent orchestration')
  .version(packageJson.version)
  .addHelpText('before', '\n' + banner + '\n')
  .addHelpText('after', `
${chalk.bold('Quick Start:')}
  ${chalk.cyan('brain auth login')}     ${chalk.gray('# Authenticate with Central Intelligence')}
  ${chalk.cyan('brain connect')}        ${chalk.gray('# Connect and discover your environment')}
  ${chalk.cyan('brain task list')}      ${chalk.gray('# View available tasks')}
  ${chalk.cyan('brain task claim T020')} ${chalk.gray('# Claim a task')}

${chalk.bold('Documentation:')}
  ${chalk.blue('https://github.com/localbrain/central-intelligence')}

${chalk.bold('Support:')}
  ${chalk.gray('For issues or questions, contact the development team')}
`);

// Add commands
authCommands(program);
connectCommand(program);
taskCommands(program);
configCommands(program);
projectCommands(program);
contextCommands(program);
agentCommands(program);
teamCommand(program);

// Handle unknown commands
program.on('command:*', () => {
  console.error(
    chalk.red(`\n${figures.cross} Invalid command: ${chalk.bold(program.args.join(' '))}`)
  );
  console.log(chalk.yellow(`\n${figures.info} Run ${chalk.cyan('brain --help')} to see available commands\n`));
  process.exit(1);
});

// Parse arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}