/**
 * Formatting Utilities
 * ====================
 *
 * Helper functions for formatting data in the CLI.
 */

import chalk from 'chalk';
import figures from 'figures';

/**
 * Format bytes to human readable format
 */
export function formatBytes(bytes: number): string {
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 B';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * Format milliseconds to human readable time
 */
export function formatTime(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  if (ms < 3600000) return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
  return `${Math.floor(ms / 3600000)}h ${Math.floor((ms % 3600000) / 60000)}m`;
}

/**
 * Format task status with colored icon
 */
export function formatTaskStatus(status: string): string {
  const statusMap: Record<string, string> = {
    TODO: chalk.gray(`${figures.circle} TODO`),
    IN_PROGRESS: chalk.blue(`${figures.pointer} IN PROGRESS`),
    CLAIMED: chalk.yellow(`${figures.warning} CLAIMED`),
    BLOCKED: chalk.red(`${figures.cross} BLOCKED`),
    COMPLETE: chalk.green(`${figures.tick} COMPLETE`)
  };

  return statusMap[status] || chalk.gray(status);
}

/**
 * Format priority with color
 */
export function formatPriority(priority: string): string {
  const priorityMap: Record<string, string> = {
    'P0-CRITICAL': chalk.red.bold('P0-CRITICAL'),
    'P1-HIGH': chalk.yellow.bold('P1-HIGH'),
    'P2-MEDIUM': chalk.blue('P2-MEDIUM'),
    'P3-LOW': chalk.gray('P3-LOW')
  };

  return priorityMap[priority] || chalk.gray(priority);
}

/**
 * Format percentage with color
 */
export function formatProgress(progress: number): string {
  if (progress === 100) return chalk.green.bold(`${progress}%`);
  if (progress >= 75) return chalk.green(`${progress}%`);
  if (progress >= 50) return chalk.yellow(`${progress}%`);
  if (progress >= 25) return chalk.blue(`${progress}%`);
  return chalk.gray(`${progress}%`);
}

/**
 * Format timestamp to relative time
 */
export function formatRelativeTime(timestamp: string): string {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diff = now - then;

  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)} days ago`;
  return new Date(timestamp).toLocaleDateString();
}

/**
 * Format agent letter with color
 */
export function formatAgentLetter(letter: string): string {
  const colors: Record<string, any> = {
    A: chalk.cyan,
    B: chalk.green,
    C: chalk.yellow,
    D: chalk.magenta,
    E: chalk.blue,
    F: chalk.red
  };

  const color = colors[letter] || chalk.white;
  return color.bold(`Agent ${letter}`);
}

/**
 * Format file count with icon
 */
export function formatFileCount(count: number, type: string): string {
  const icons: Record<string, string> = {
    specs: '📋',
    docs: '📚',
    code: '💻',
    architecture: '🏗️',
    tests: '🧪',
    config: '⚙️'
  };

  const icon = icons[type] || '📄';
  return `${icon} ${count} ${type}`;
}

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + '...';
}

/**
 * Format list with bullets
 */
export function formatList(items: string[], indent = 2): string {
  return items
    .map(item => ' '.repeat(indent) + chalk.gray('•') + ' ' + item)
    .join('\n');
}

/**
 * Format key-value pairs
 */
export function formatKeyValue(
  key: string,
  value: string,
  keyWidth = 20
): string {
  const paddedKey = key.padEnd(keyWidth, ' ');
  return chalk.gray(paddedKey) + value;
}

/**
 * Format duration in hours
 */
export function formatHours(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)} minutes`;
  if (hours === 1) return '1 hour';
  if (hours < 8) return `${hours} hours`;
  if (hours === 8) return '1 day';
  if (hours < 40) return `${Math.round(hours / 8)} days`;
  return `${Math.round(hours / 40)} weeks`;
}

/**
 * Format velocity percentage with icon
 */
export function formatVelocity(velocity: number): string {
  let icon = '';
  let color = chalk.white;

  if (velocity >= 150) {
    icon = '🚀';
    color = chalk.green.bold;
  } else if (velocity >= 100) {
    icon = '✓';
    color = chalk.green;
  } else if (velocity >= 75) {
    icon = '→';
    color = chalk.yellow;
  } else {
    icon = '↓';
    color = chalk.red;
  }

  return `${icon} ${color(`${velocity}%`)}`;
}

/**
 * Format success/error message
 */
export function formatMessage(type: 'success' | 'error' | 'warning' | 'info', message: string): string {
  const formats = {
    success: chalk.green(`${figures.tick} ${message}`),
    error: chalk.red(`${figures.cross} ${message}`),
    warning: chalk.yellow(`${figures.warning} ${message}`),
    info: chalk.blue(`${figures.info} ${message}`)
  };

  return formats[type] || message;
}