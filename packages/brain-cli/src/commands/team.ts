/**
 * Team Commands
 * =============
 *
 * Commands for team dashboard and overview.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import boxen from 'boxen';
import figures from 'figures';
import Table from 'cli-table3';
import gradient from 'gradient-string';
import { config } from '../lib/config.js';
import { mcpClient } from '../lib/mcp-client.js';
import { formatAgentLetter, formatTaskStatus, formatProgress } from '../utils/format.js';

export function teamCommand(program: Command): void {
  program
    .command('team')
    .description('View team dashboard')
    .alias('dashboard')
    .action(async () => {
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

        const spinner = ora('Loading team dashboard...').start();

        // Connect to MCP
        await mcpClient.connect();
        const dashboard = await mcpClient.getDashboard();
        await mcpClient.disconnect();

        spinner.succeed('Dashboard loaded');

        // Display banner
        const banner = gradient.rainbow.multiline([
          '═══════════════════════════════════════',
          '        TEAM DASHBOARD                 ',
          '═══════════════════════════════════════'
        ].join('\n'));
        console.log('\n' + banner + '\n');

        // Project info
        console.log(chalk.bold.cyan('📁 Project: ') + chalk.bold(dashboard.project || 'LocalBrain'));
        console.log(chalk.gray(`Sprint Day ${dashboard.sprintDay || 3} of 7\n`));

        // Team Status
        console.log(chalk.bold.cyan('👥 Team Status\n'));

        const teamTable = new Table({
          head: [
            chalk.gray('Agent'),
            chalk.gray('Status'),
            chalk.gray('Current Task'),
            chalk.gray('Progress')
          ],
          style: { head: [], border: [] }
        });

        if (dashboard.agents) {
          dashboard.agents.forEach((agent: any) => {
            teamTable.push([
              formatAgentLetter(agent.letter),
              agent.online ? chalk.green('● Online') : chalk.gray('○ Offline'),
              agent.currentTask ? chalk.cyan(agent.currentTask) : chalk.gray('Available'),
              agent.progress !== undefined ? formatProgress(agent.progress) : '-'
            ]);
          });
        } else {
          // Mock data if no real data
          teamTable.push(
            ['Agent A', chalk.green('● Online'), chalk.cyan('T004'), '75%'],
            ['Agent B', chalk.green('● Online'), chalk.gray('Available'), '-'],
            ['Agent C', chalk.gray('○ Offline'), '-', '-'],
            ['Agent D', chalk.green('● Online'), chalk.cyan('T020'), '50%'],
            ['Agent E', chalk.green('● Online'), 'Monitoring', '-'],
            ['Agent F', chalk.gray('○ Offline'), '-', '-']
          );
        }

        console.log(teamTable.toString());

        // Task Summary
        console.log(chalk.bold.cyan('\n📋 Task Summary\n'));

        const taskSummary = dashboard.taskSummary || {
          total: 19,
          complete: 8,
          inProgress: 4,
          available: 5,
          blocked: 2
        };

        const taskTable = new Table({
          style: { head: [], border: [] }
        });

        taskTable.push(
          [chalk.gray('Total Tasks:'), taskSummary.total],
          [chalk.green('Complete:'), `${taskSummary.complete} (${Math.round((taskSummary.complete / taskSummary.total) * 100)}%)`],
          [chalk.blue('In Progress:'), taskSummary.inProgress],
          [chalk.cyan('Available:'), taskSummary.available],
          [chalk.red('Blocked:'), taskSummary.blocked]
        );

        console.log(taskTable.toString());

        // Progress Bar
        const progressPercent = Math.round((taskSummary.complete / taskSummary.total) * 100);
        const progressBar = createProgressBar(progressPercent);

        console.log(chalk.bold.cyan('\n🎯 Overall Progress\n'));
        console.log(progressBar);
        console.log(chalk.gray(`${progressPercent}% complete\n`));

        // Recent Activity
        if (dashboard.recentActivity && dashboard.recentActivity.length > 0) {
          console.log(chalk.bold.cyan('📊 Recent Activity\n'));

          dashboard.recentActivity.slice(0, 5).forEach((activity: any) => {
            const icon = activity.type === 'complete' ? chalk.green(figures.tick) :
                        activity.type === 'claim' ? chalk.blue(figures.pointer) :
                        chalk.gray(figures.line);

            console.log(`  ${icon} ${activity.message}`);
          });
        }

        // Summary Box
        const summaryBox = boxen(
          [
            chalk.bold('Sprint Status'),
            '',
            `${chalk.gray('Day:')} ${dashboard.sprintDay || 3} of 7`,
            `${chalk.gray('Velocity:')} ${dashboard.velocity || 140}%`,
            `${chalk.gray('On Track:')} ${dashboard.onTrack !== false ? chalk.green('Yes') : chalk.red('No')}`,
            '',
            dashboard.nextMilestone
              ? `${chalk.gray('Next Milestone:')} ${dashboard.nextMilestone}`
              : ''
          ]
            .filter(Boolean)
            .join('\n'),
          {
            padding: 1,
            margin: { top: 1 },
            borderStyle: 'round',
            borderColor: dashboard.onTrack !== false ? 'green' : 'yellow'
          }
        );

        console.log(summaryBox);

      } catch (error: any) {
        console.error(
          chalk.red(`\n${figures.cross} Failed to load dashboard: ${error.message}`)
        );
        process.exit(1);
      }
    });
}

/**
 * Create ASCII progress bar
 */
function createProgressBar(percent: number): string {
  const width = 40;
  const filled = Math.round((percent / 100) * width);
  const empty = width - filled;

  const bar =
    chalk.green('█').repeat(filled) +
    chalk.gray('░').repeat(empty);

  return `[${bar}]`;
}