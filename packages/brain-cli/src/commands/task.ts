/**
 * Task Commands
 * =============
 *
 * Commands for task management (list, claim, update, complete).
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import Table from 'cli-table3';
import inquirer from 'inquirer';
import figures from 'figures';
import boxen from 'boxen';
import { config } from '../lib/config.js';
import { mcpClient } from '../lib/mcp-client.js';
import {
  formatTaskStatus,
  formatPriority,
  formatProgress,
  formatHours,
  formatRelativeTime,
  formatAgentLetter,
  truncate
} from '../utils/format.js';

export function taskCommands(program: Command): void {
  const task = program
    .command('task')
    .description('Task management commands');

  /**
   * List tasks
   */
  task
    .command('list')
    .alias('ls')
    .description('List available tasks')
    .option('-a, --agent <letter>', 'Filter by agent')
    .option('-p, --priority <level>', 'Filter by priority (P0, P1, P2, P3)')
    .option('-s, --status <status>', 'Filter by status (TODO, IN_PROGRESS, COMPLETE)')
    .option('--ready', 'Show only tasks ready to start (no blockers)')
    .option('--claimed', 'Show only your claimed tasks')
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

        const spinner = ora('Fetching tasks...').start();

        // Connect and get tasks
        await mcpClient.connect();
        const tasks = await mcpClient.getAvailableTasks(options.agent);

        // Filter tasks based on options
        let filteredTasks = tasks;

        if (options.priority) {
          filteredTasks = filteredTasks.filter(
            t => t.priority === options.priority
          );
        }

        if (options.status) {
          filteredTasks = filteredTasks.filter(
            t => t.status === options.status
          );
        }

        if (options.ready) {
          filteredTasks = filteredTasks.filter(
            t => t.status === 'TODO' && (!t.dependencies || t.dependencies.length === 0)
          );
        }

        if (options.claimed) {
          const agentName = config.get('agentName');
          filteredTasks = filteredTasks.filter(
            t => t.agent === agentName
          );
        }

        await mcpClient.disconnect();
        spinner.succeed(`Found ${filteredTasks.length} tasks`);

        // Display tasks
        if (filteredTasks.length === 0) {
          console.log(chalk.gray('\nNo tasks match your criteria.'));
          return;
        }

        console.log(chalk.bold.cyan(`\n📋 Tasks (${filteredTasks.length})\n`));

        const table = new Table({
          head: [
            chalk.gray('ID'),
            chalk.gray('Task'),
            chalk.gray('Priority'),
            chalk.gray('Status'),
            chalk.gray('Progress'),
            chalk.gray('Agent'),
            chalk.gray('Effort')
          ],
          style: { head: [], border: [] },
          colWidths: [8, 35, 12, 15, 10, 10, 10]
        });

        filteredTasks.forEach((task) => {
          table.push([
            chalk.cyan(task.id),
            truncate(task.name, 32),
            formatPriority(task.priority),
            formatTaskStatus(task.status),
            formatProgress(task.progress || 0),
            task.agent ? formatAgentLetter(task.agent) : chalk.gray('-'),
            formatHours(task.estimatedHours)
          ]);
        });

        console.log(table.toString());

        // Show summary
        const todoCount = filteredTasks.filter(t => t.status === 'TODO').length;
        const inProgressCount = filteredTasks.filter(t => t.status === 'IN_PROGRESS').length;
        const completeCount = filteredTasks.filter(t => t.status === 'COMPLETE').length;

        console.log(
          chalk.gray(
            `\n${figures.info} Summary: ${todoCount} TODO, ${inProgressCount} IN PROGRESS, ${completeCount} COMPLETE`
          )
        );

      } catch (error: any) {
        console.error(chalk.red(`\n${figures.cross} Failed to fetch tasks: ${error.message}`));
        process.exit(1);
      }
    });

  /**
   * Claim a task
   */
  task
    .command('claim <taskId>')
    .description('Claim a task')
    .option('-a, --agent <letter>', 'Agent letter (default: from config)')
    .action(async (taskId, options) => {
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

        // Get agent letter
        const agentLetter = options.agent || config.get('agentName')?.replace('Agent-', '').charAt(0) || 'A';

        const spinner = ora(`Claiming task ${taskId}...`).start();

        // Connect and claim task
        await mcpClient.connect();
        const result = await mcpClient.claimTask(taskId, agentLetter);
        await mcpClient.disconnect();

        spinner.succeed(`Task ${taskId} claimed successfully!`);

        // Display task details
        const taskBox = boxen(
          [
            chalk.green.bold(`✅ Task ${taskId} Claimed`),
            '',
            `${chalk.gray('Name:')} ${result.task.name}`,
            `${chalk.gray('Priority:')} ${formatPriority(result.task.priority)}`,
            `${chalk.gray('Estimated:')} ${formatHours(result.task.estimatedHours)}`,
            result.task.description ? `${chalk.gray('Description:')} ${result.task.description}` : '',
            '',
            chalk.yellow('⏱️  Keep-in-touch activated'),
            chalk.gray(`Next check-in due in 30 minutes`)
          ]
            .filter(Boolean)
            .join('\n'),
          {
            padding: 1,
            margin: 1,
            borderStyle: 'round',
            borderColor: 'green'
          }
        );

        console.log(taskBox);

        // Show next steps
        console.log(chalk.bold('\nNext steps:'));
        console.log(`  1. Start working on the task`);
        console.log(`  2. Run ${chalk.cyan(`brain task update ${taskId} 25%`)} to update progress`);
        console.log(`  3. Check in every 30 minutes with ${chalk.cyan('brain checkin "message"')}`);
        console.log(`  4. Complete with ${chalk.cyan(`brain task complete ${taskId}`)}`);

      } catch (error: any) {
        console.error(chalk.red(`\n${figures.cross} Failed to claim task: ${error.message}`));
        process.exit(1);
      }
    });

  /**
   * Update task progress
   */
  task
    .command('update <taskId> <progress>')
    .description('Update task progress')
    .option('-f, --files <files>', 'Comma-separated list of files modified')
    .option('-n, --notes <notes>', 'Progress notes')
    .action(async (taskId, progress, options) => {
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

        // Parse progress
        const progressNum = parseInt(progress.replace('%', ''));
        if (isNaN(progressNum) || progressNum < 0 || progressNum > 100) {
          console.error(chalk.red(`\n${figures.cross} Progress must be between 0 and 100`));
          process.exit(1);
        }

        const spinner = ora(`Updating task ${taskId}...`).start();

        // Parse files if provided
        const files = options.files ? options.files.split(',').map((f: string) => f.trim()) : undefined;

        // Connect and update task
        await mcpClient.connect();
        const result = await mcpClient.updateTaskProgress(taskId, progressNum, files, options.notes);
        await mcpClient.disconnect();

        spinner.succeed(`Task ${taskId} updated successfully!`);

        // Display update confirmation
        console.log(
          boxen(
            [
              chalk.green(`✅ Progress Updated`),
              '',
              `${chalk.gray('Task:')} ${taskId}`,
              `${chalk.gray('Progress:')} ${formatProgress(progressNum)}`,
              files ? `${chalk.gray('Files:')} ${files.join(', ')}` : '',
              options.notes ? `${chalk.gray('Notes:')} ${options.notes}` : ''
            ]
              .filter(Boolean)
              .join('\n'),
            {
              padding: 1,
              margin: 1,
              borderStyle: 'round',
              borderColor: 'green'
            }
          )
        );

        // Check if task is ready for completion
        if (progressNum === 100) {
          console.log(
            chalk.yellow(
              `\n${figures.info} Task is at 100%. Run ${chalk.cyan(`brain task complete ${taskId}`)} to mark it as complete.`
            )
          );
        }

      } catch (error: any) {
        console.error(chalk.red(`\n${figures.cross} Failed to update task: ${error.message}`));
        process.exit(1);
      }
    });

  /**
   * Complete a task
   */
  task
    .command('complete <taskId>')
    .description('Complete a task')
    .option('-d, --deliverables <files>', 'Comma-separated list of deliverables')
    .option('-t, --time <hours>', 'Actual time spent (in hours)')
    .action(async (taskId, options) => {
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

        // Prompt for confirmation
        const answers = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirm',
            message: `Are you sure you want to complete task ${taskId}?`,
            default: true
          }
        ]);

        if (!answers.confirm) {
          console.log(chalk.gray('\nTask completion cancelled.'));
          return;
        }

        const spinner = ora(`Completing task ${taskId}...`).start();

        // Parse deliverables
        const deliverables = options.deliverables
          ? options.deliverables.split(',').map((f: string) => f.trim())
          : [];

        // Parse actual time
        const actualTime = options.time ? parseFloat(options.time) : 0;

        // Connect and complete task
        await mcpClient.connect();
        const result = await mcpClient.completeTask(taskId, deliverables, actualTime);
        await mcpClient.disconnect();

        spinner.succeed(`Task ${taskId} completed successfully!`);

        // Display completion confirmation
        const completionBox = boxen(
          [
            chalk.green.bold(`🎉 Task ${taskId} Complete!`),
            '',
            `${chalk.gray('Deliverables:')} ${deliverables.length} files`,
            `${chalk.gray('Time Spent:')} ${formatHours(actualTime)}`,
            '',
            result.unlockedTasks && result.unlockedTasks.length > 0
              ? chalk.yellow(`🔓 Unlocked ${result.unlockedTasks.length} dependent tasks`)
              : '',
            result.velocity
              ? chalk.green(`📊 Your velocity: ${result.velocity}%`)
              : ''
          ]
            .filter(Boolean)
            .join('\n'),
          {
            padding: 1,
            margin: 1,
            borderStyle: 'double',
            borderColor: 'green'
          }
        );

        console.log(completionBox);

        // Suggest next task
        if (result.suggestedNext) {
          console.log(chalk.bold('\nNext suggested task:'));
          console.log(
            `  ${chalk.cyan(`brain task claim ${result.suggestedNext.id}`)} - ${result.suggestedNext.name}`
          );
        }

      } catch (error: any) {
        console.error(chalk.red(`\n${figures.cross} Failed to complete task: ${error.message}`));

        // Check for specific errors
        if (error.message.includes('check-in')) {
          console.log(
            chalk.yellow(
              `\n${figures.info} Please check in first with ${chalk.cyan('brain checkin "message"')}`
            )
          );
        }

        process.exit(1);
      }
    });
}