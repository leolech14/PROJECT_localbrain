/**
 * Project Commands
 * ================
 *
 * Commands for project management.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import Table from 'cli-table3';
import figures from 'figures';
import { config } from '../lib/config.js';
import { mcpClient } from '../lib/mcp-client.js';
import { formatRelativeTime } from '../utils/format.js';

export function projectCommands(program: Command): void {
  const project = program
    .command('project')
    .description('Project management commands');

  /**
   * List projects
   */
  project
    .command('list')
    .alias('ls')
    .description('List all projects')
    .action(async () => {
      try {
        console.log(chalk.bold.cyan('\n📁 Your Projects\n'));

        // For now, show mock data (will be connected to real API later)
        const projects = [
          {
            name: 'LocalBrain',
            status: 'Active',
            role: 'Integration Specialist',
            tasks: { total: 19, available: 5, completed: 8 },
            lastActive: new Date().toISOString()
          },
          {
            name: 'AudioAnalyzer',
            status: 'Inactive',
            role: 'Not assigned',
            tasks: { total: 15, available: 15, completed: 0 },
            lastActive: null
          }
        ];

        const table = new Table({
          head: [
            chalk.gray('Project'),
            chalk.gray('Status'),
            chalk.gray('Role'),
            chalk.gray('Tasks'),
            chalk.gray('Last Active')
          ],
          style: { head: [], border: [] }
        });

        projects.forEach((proj) => {
          const taskSummary = `${proj.tasks.completed}/${proj.tasks.total} complete`;

          table.push([
            proj.name === config.get('currentProject')
              ? chalk.cyan.bold(`${proj.name} ⭐`)
              : proj.name,
            proj.status === 'Active'
              ? chalk.green('● Active')
              : chalk.gray('○ Inactive'),
            proj.role || chalk.gray('Not assigned'),
            taskSummary,
            proj.lastActive
              ? formatRelativeTime(proj.lastActive)
              : chalk.gray('Never')
          ]);
        });

        console.log(table.toString());

        // Show current project
        const current = config.get('currentProject');
        if (current) {
          console.log(
            chalk.gray(`\n${figures.info} Current project: ${chalk.cyan(current)}`)
          );
        }

      } catch (error: any) {
        console.error(
          chalk.red(`\n${figures.cross} Failed to list projects: ${error.message}`)
        );
        process.exit(1);
      }
    });

  /**
   * Switch project
   */
  project
    .command('switch <name>')
    .description('Switch to a different project')
    .action(async (name) => {
      try {
        const spinner = ora(`Switching to project ${name}...`).start();

        // Update config
        config.set('currentProject', name);

        // Simulate switch delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        spinner.succeed(`Switched to project: ${name}`);

        console.log(chalk.gray(`\n${figures.info} Run ${chalk.cyan('brain connect')} to load project context`));

      } catch (error: any) {
        console.error(
          chalk.red(`\n${figures.cross} Failed to switch project: ${error.message}`)
        );
        process.exit(1);
      }
    });

  /**
   * Create project (placeholder)
   */
  project
    .command('create <name>')
    .description('Create a new project')
    .action((name) => {
      console.log(
        chalk.yellow(
          `\n${figures.info} Project creation is coming soon in Phase 2!\n`
        )
      );
      console.log(
        chalk.gray(
          `For now, projects are automatically discovered when you run ${chalk.cyan('brain connect')} from a project directory.`
        )
      );
    });
}