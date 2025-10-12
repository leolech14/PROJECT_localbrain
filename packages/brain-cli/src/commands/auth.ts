/**
 * Authentication Commands
 * ======================
 *
 * Handles login, logout, and authentication status.
 */

import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import boxen from 'boxen';
import figures from 'figures';
import { config } from '../lib/config.js';

export function authCommands(program: Command): void {
  const auth = program
    .command('auth')
    .description('Authentication management');

  /**
   * Login command
   */
  auth
    .command('login')
    .description('Authenticate with Central Intelligence')
    .option('-k, --api-key <key>', 'API key (or set BRAIN_API_KEY env var)')
    .action(async (options) => {
      console.log(chalk.bold('\n🔐 Central Intelligence Authentication\n'));

      try {
        let apiKey = options.apiKey;

        // If no API key provided, prompt for it
        if (!apiKey) {
          const answers = await inquirer.prompt([
            {
              type: 'input',
              name: 'email',
              message: 'Enter your email:',
              validate: (input) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(input) || 'Please enter a valid email address';
              }
            },
            {
              type: 'password',
              name: 'apiKey',
              message: 'Enter your API key:',
              mask: '*',
              validate: (input) => {
                return input.length > 0 || 'API key is required';
              }
            }
          ]);

          apiKey = answers.apiKey;
        }

        // Validate API key format (should start with brain_)
        if (!apiKey.startsWith('brain_')) {
          console.log(
            chalk.yellow(`\n${figures.warning} API key should start with "brain_"`)
          );
        }

        // Save authentication
        const spinner = ora('Authenticating...').start();

        // Simulate authentication (in real app, would validate with server)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        config.saveAuth(apiKey);
        spinner.succeed('Authenticated successfully!');

        // Show success message
        const successBox = boxen(
          chalk.green(
            `${figures.tick} Authentication successful!\n\n` +
            `Your API key has been securely saved.\n` +
            `You can now use ${chalk.cyan('brain connect')} to start working.`
          ),
          {
            padding: 1,
            margin: 1,
            borderStyle: 'round',
            borderColor: 'green'
          }
        );

        console.log(successBox);

        // Show next steps
        console.log(chalk.bold('\nNext steps:'));
        console.log(
          `  ${chalk.cyan('brain connect')}  ${chalk.gray('# Connect and discover your environment')}`
        );
        console.log(
          `  ${chalk.cyan('brain task list')} ${chalk.gray('# View available tasks')}`
        );

      } catch (error) {
        console.error(chalk.red(`\n${figures.cross} Authentication failed:`), error);
        process.exit(1);
      }
    });

  /**
   * Logout command
   */
  auth
    .command('logout')
    .description('Logout from Central Intelligence')
    .action(async () => {
      try {
        // Confirm logout
        const answers = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirm',
            message: 'Are you sure you want to logout?',
            default: false
          }
        ]);

        if (!answers.confirm) {
          console.log(chalk.gray('\nLogout cancelled.'));
          return;
        }

        // Clear authentication
        const spinner = ora('Logging out...').start();
        config.clearAuth();
        await new Promise((resolve) => setTimeout(resolve, 500));
        spinner.succeed('Logged out successfully');

        console.log(
          chalk.gray(`\nTo authenticate again, run: ${chalk.cyan('brain auth login')}`)
        );

      } catch (error) {
        console.error(chalk.red(`\n${figures.cross} Logout failed:`), error);
        process.exit(1);
      }
    });

  /**
   * Status command
   */
  auth
    .command('status')
    .description('Check authentication status')
    .action(() => {
      const isAuthenticated = config.isAuthenticated();
      const apiKey = config.getApiKey();
      const trackingId = config.getTrackingId();
      const registeredAt = config.get('registeredAt');
      const lastConnected = config.get('lastConnected');

      console.log(chalk.bold('\n🔐 Authentication Status\n'));

      if (isAuthenticated) {
        const maskedKey = apiKey
          ? `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`
          : 'Not set';

        const statusBox = boxen(
          [
            `${chalk.green(figures.tick)} ${chalk.bold('Authenticated')}`,
            '',
            `${chalk.gray('API Key:')} ${maskedKey}`,
            trackingId ? `${chalk.gray('Tracking ID:')} ${trackingId.substring(0, 8)}...` : '',
            registeredAt ? `${chalk.gray('Registered:')} ${new Date(registeredAt).toLocaleString()}` : '',
            lastConnected ? `${chalk.gray('Last Connected:')} ${new Date(lastConnected).toLocaleString()}` : ''
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

        console.log(statusBox);

        // Check if using environment variable
        if (process.env.BRAIN_API_KEY) {
          console.log(
            chalk.gray(
              `\n${figures.info} Using API key from BRAIN_API_KEY environment variable`
            )
          );
        }

      } else {
        const statusBox = boxen(
          chalk.yellow(
            `${figures.cross} Not authenticated\n\n` +
            `Run ${chalk.cyan('brain auth login')} to authenticate`
          ),
          {
            padding: 1,
            margin: 1,
            borderStyle: 'round',
            borderColor: 'yellow'
          }
        );

        console.log(statusBox);
      }

      // Show config file location
      console.log(
        chalk.gray(`\n${figures.info} Config file: ${config.getConfigPath()}`)
      );
    });
}