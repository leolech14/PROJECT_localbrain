/**
 * Agent Commands
 * ==============
 *
 * Commands for agent status and management.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import boxen from 'boxen';
import figures from 'figures';
import Table from 'cli-table3';
import { config } from '../lib/config.js';
import { mcpClient } from '../lib/mcp-client.js';
import { formatAgentLetter, formatTaskStatus, formatRelativeTime, formatVelocity } from '../utils/format.js';

export function agentCommands(program: Command): void {
  const agent = program
    .command('agent')
    .description('Agent management commands');

  /**
   * Agent status
   */
  agent
    .command('status [agentLetter]')
    .description('View agent status')
    .action(async (agentLetter) => {
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

        const spinner = ora('Fetching agent status...').start();

        // Connect to MCP
        await mcpClient.connect();

        // Get agent status
        const letter = agentLetter || config.get('agentName')?.replace('Agent-', '').charAt(0) || 'A';
        const status = await mcpClient.getAgentStatus(letter);

        await mcpClient.disconnect();
        spinner.succeed('Agent status retrieved');

        // Display agent status
        console.log(chalk.bold.cyan(`\n👤 ${formatAgentLetter(letter)}\n`));

        const statusBox = boxen(
          [
            `${chalk.gray('Status:')} ${status.online ? chalk.green('● ONLINE') : chalk.gray('○ OFFLINE')}`,
            `${chalk.gray('Project:')} ${status.project || 'Not assigned'}`,
            status.currentTask
              ? `${chalk.gray('Current Task:')} ${status.currentTask.id} - ${status.currentTask.name}`
              : `${chalk.gray('Current Task:')} None`,
            status.currentTask && status.currentTask.progress !== undefined
              ? `${chalk.gray('Progress:')} ${status.currentTask.progress}%`
              : '',
            '',
            chalk.bold('Today\'s Statistics:'),
            `${chalk.gray('Tasks Completed:')} ${status.stats?.tasksCompleted || 0}`,
            `${chalk.gray('Active Time:')} ${status.stats?.activeTime || '0 hours'}`,
            `${chalk.gray('Velocity:')} ${formatVelocity(status.stats?.velocity || 100)}`,
            '',
            status.keepInTouch
              ? chalk.yellow(`⏱️  Keep-in-touch: ${status.keepInTouch.status}`)
              : '',
            status.keepInTouch?.nextCheckin
              ? chalk.gray(`Next check-in: ${formatRelativeTime(status.keepInTouch.nextCheckin)}`)
              : ''
          ]
            .filter(Boolean)
            .join('\n'),
          {
            padding: 1,
            margin: 1,
            borderStyle: 'round',
            borderColor: status.online ? 'green' : 'gray'
          }
        );

        console.log(statusBox);

        // Show recent tasks if available
        if (status.recentTasks && status.recentTasks.length > 0) {
          console.log(chalk.bold.cyan('\n📋 Recent Tasks\n'));

          const table = new Table({
            head: [chalk.gray('ID'), chalk.gray('Task'), chalk.gray('Status'), chalk.gray('Completed')],
            style: { head: [], border: [] }
          });

          status.recentTasks.forEach((task: any) => {
            table.push([
              chalk.cyan(task.id),
              task.name,
              formatTaskStatus(task.status),
              task.completedAt ? formatRelativeTime(task.completedAt) : '-'
            ]);
          });

          console.log(table.toString());
        }

      } catch (error: any) {
        console.error(
          chalk.red(`\n${figures.cross} Failed to get agent status: ${error.message}`)
        );
        process.exit(1);
      }
    });

  /**
   * Check-in command
   */
  agent
    .command('checkin <message>')
    .description('Send keep-in-touch check-in')
    .option('--progress <percent>', 'Current progress percentage')
    .option('--blocked', 'Flag as blocked')
    .action(async (message, options) => {
      try {
        const spinner = ora('Sending check-in...').start();

        // Simulate check-in
        await new Promise(resolve => setTimeout(resolve, 1000));

        spinner.succeed('Check-in received');

        const checkInBox = boxen(
          [
            chalk.green(`${figures.tick} Check-in Successful`),
            '',
            `${chalk.gray('Message:')} "${message}"`,
            options.progress ? `${chalk.gray('Progress:')} ${options.progress}%` : '',
            options.blocked ? chalk.red('⚠ BLOCKED - Requesting assistance') : '',
            '',
            chalk.gray('Next check-in due in 30 minutes')
          ]
            .filter(Boolean)
            .join('\n'),
          {
            padding: 1,
            margin: 1,
            borderStyle: 'round',
            borderColor: options.blocked ? 'red' : 'green'
          }
        );

        console.log(checkInBox);

        if (options.blocked) {
          console.log(
            chalk.yellow(
              `\n${figures.info} Your supervisor has been notified about the blocker.`
            )
          );
        }

      } catch (error: any) {
        console.error(
          chalk.red(`\n${figures.cross} Check-in failed: ${error.message}`)
        );
        process.exit(1);
      }
    });

  /**
   * List all agents
   */
  agent
    .command('list')
    .alias('ls')
    .description('List all agents')
    .action(async () => {
      console.log(chalk.bold.cyan('\n👥 All Agents\n'));

      // Mock agent data
      const agents = [
        { letter: 'A', name: 'UI Specialist', status: 'online', task: 'T004' },
        { letter: 'B', name: 'Design Specialist', status: 'online', task: null },
        { letter: 'C', name: 'Backend Specialist', status: 'offline', task: null },
        { letter: 'D', name: 'Integration Specialist', status: 'online', task: 'T020' },
        { letter: 'E', name: 'Supervisor', status: 'online', task: 'Monitoring' },
        { letter: 'F', name: 'Strategic', status: 'offline', task: null }
      ];

      const table = new Table({
        head: [
          chalk.gray('Agent'),
          chalk.gray('Role'),
          chalk.gray('Status'),
          chalk.gray('Current Task')
        ],
        style: { head: [], border: [] }
      });

      agents.forEach((agent) => {
        table.push([
          formatAgentLetter(agent.letter),
          agent.name,
          agent.status === 'online'
            ? chalk.green('● Online')
            : chalk.gray('○ Offline'),
          agent.task ? chalk.cyan(agent.task) : chalk.gray('-')
        ]);
      });

      console.log(table.toString());

      const onlineCount = agents.filter(a => a.status === 'online').length;
      console.log(
        chalk.gray(
          `\n${figures.info} ${onlineCount} agents online, ${agents.length - onlineCount} offline`
        )
      );
    });
}