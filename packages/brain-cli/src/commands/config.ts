/**
 * Configuration Commands
 * ======================
 *
 * Commands for managing CLI configuration.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import Table from 'cli-table3';
import figures from 'figures';
import { config } from '../lib/config.js';

export function configCommands(program: Command): void {
  const configCmd = program
    .command('config')
    .description('Configuration management');

  /**
   * Show configuration
   */
  configCmd
    .command('show')
    .description('Show current configuration')
    .action(() => {
      console.log(chalk.bold.cyan('\n⚙️  Current Configuration\n'));

      const allConfig = config.getAll();
      const table = new Table({
        head: [chalk.gray('Key'), chalk.gray('Value')],
        style: { head: [], border: [] }
      });

      // Format sensitive values
      const formatValue = (key: string, value: any): string => {
        if (key === 'apiKey' && value) {
          return `${value.substring(0, 10)}...${value.substring(value.length - 4)}`;
        }
        if (key === 'trackingId' && value) {
          return `${value.substring(0, 8)}...`;
        }
        if (value === undefined || value === null) {
          return chalk.gray('(not set)');
        }
        return String(value);
      };

      // Add config entries to table
      Object.entries(allConfig).forEach(([key, value]) => {
        table.push([key, formatValue(key, value)]);
      });

      console.log(table.toString());

      // Show config file location
      console.log(
        chalk.gray(`\n${figures.info} Config file: ${config.getConfigPath()}`)
      );

      // Show environment variables
      if (process.env.BRAIN_API_KEY) {
        console.log(
          chalk.yellow(
            `\n${figures.info} BRAIN_API_KEY environment variable is set (overrides config)`
          )
        );
      }
      if (process.env.BRAIN_SERVER_URL) {
        console.log(
          chalk.yellow(
            `${figures.info} BRAIN_SERVER_URL environment variable is set: ${process.env.BRAIN_SERVER_URL}`
          )
        );
      }
    });

  /**
   * Set configuration value
   */
  configCmd
    .command('set <key> <value>')
    .description('Set a configuration value')
    .action((key, value) => {
      try {
        // Validate key
        const validKeys = [
          'serverUrl',
          'checkinInterval',
          'autoContextSync',
          'theme',
          'notificationLevel',
          'currentProject'
        ];

        if (!validKeys.includes(key)) {
          console.error(
            chalk.red(`\n${figures.cross} Invalid configuration key: ${key}`)
          );
          console.log(chalk.gray(`\nValid keys: ${validKeys.join(', ')}`));
          process.exit(1);
        }

        // Parse value based on key
        let parsedValue: any = value;
        if (key === 'checkinInterval') {
          parsedValue = parseInt(value);
          if (isNaN(parsedValue) || parsedValue < 1) {
            console.error(
              chalk.red(`\n${figures.cross} Check-in interval must be a positive number`)
            );
            process.exit(1);
          }
        } else if (key === 'autoContextSync') {
          parsedValue = value === 'true';
        } else if (key === 'theme') {
          if (!['dark', 'light'].includes(value)) {
            console.error(
              chalk.red(`\n${figures.cross} Theme must be 'dark' or 'light'`)
            );
            process.exit(1);
          }
        } else if (key === 'notificationLevel') {
          if (!['quiet', 'normal', 'verbose'].includes(value)) {
            console.error(
              chalk.red(`\n${figures.cross} Notification level must be 'quiet', 'normal', or 'verbose'`)
            );
            process.exit(1);
          }
        }

        // Set the value
        config.set(key as any, parsedValue);

        console.log(
          chalk.green(`\n${figures.tick} Configuration updated successfully`)
        );
        console.log(chalk.gray(`${key} = ${parsedValue}`));

      } catch (error: any) {
        console.error(
          chalk.red(`\n${figures.cross} Failed to set configuration: ${error.message}`)
        );
        process.exit(1);
      }
    });

  /**
   * Get configuration value
   */
  configCmd
    .command('get <key>')
    .description('Get a configuration value')
    .action((key) => {
      const value = config.get(key as any);

      if (value === undefined) {
        console.log(chalk.gray(`${key} is not set`));
      } else {
        console.log(value);
      }
    });

  /**
   * Reset configuration
   */
  configCmd
    .command('reset')
    .description('Reset configuration to defaults')
    .action(() => {
      console.log(
        chalk.yellow(
          `\n${figures.warning} This will reset all configuration except authentication.`
        )
      );

      // Save auth before reset
      const apiKey = config.get('apiKey');
      const trackingId = config.get('trackingId');

      // Clear all config
      config.clear();

      // Restore auth
      if (apiKey) config.set('apiKey', apiKey);
      if (trackingId) config.set('trackingId', trackingId);

      console.log(
        chalk.green(`\n${figures.tick} Configuration reset to defaults`)
      );
    });
}