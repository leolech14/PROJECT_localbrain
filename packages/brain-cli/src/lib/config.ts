/**
 * Configuration Manager
 * ====================
 *
 * Manages ~/.brain/config.json for persistent configuration.
 * Includes API keys, tracking IDs, preferences, and more.
 */

import Conf from 'conf';
import { homedir } from 'os';
import { join, dirname } from 'path';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface BrainConfig {
  apiKey?: string;
  trackingId?: string;
  agentId?: string;
  agentName?: string;
  currentProject?: string;
  serverPath?: string;
  checkinInterval?: number;
  autoContextSync?: boolean;
  theme?: 'dark' | 'light';
  notificationLevel?: 'quiet' | 'normal' | 'verbose';
  registeredAt?: string;
  lastConnected?: string;
  version?: string;
}

class ConfigManager {
  private config: Conf<BrainConfig>;
  private configDir: string;
  private legacyConfigPath: string;

  constructor() {
    // Initialize config with Conf library
    this.config = new Conf<BrainConfig>({
      projectName: 'brain-cli',
      projectVersion: '2.0.0',
      defaults: {
        serverPath: process.env.BRAIN_SERVER_PATH || '/Users/lech/PROJECTS_all/LocalBrain/01_CODEBASES/mcp-servers/localbrain-task-registry/dist/index.js',
        checkinInterval: 30,
        autoContextSync: true,
        theme: 'dark',
        notificationLevel: 'normal'
      }
    });

    // Legacy config path for backwards compatibility
    this.configDir = join(homedir(), '.brain');
    this.legacyConfigPath = join(this.configDir, 'config.json');

    // Migrate legacy config if exists
    this.migrateLegacyConfig();
  }

  /**
   * Migrate from legacy ~/.brain/config.json if it exists
   */
  private migrateLegacyConfig(): void {
    if (existsSync(this.legacyConfigPath)) {
      try {
        const legacyConfig = JSON.parse(readFileSync(this.legacyConfigPath, 'utf-8'));

        // Migrate each field
        if (legacyConfig.trackingId) this.set('trackingId', legacyConfig.trackingId);
        if (legacyConfig.agentId) this.set('agentId', legacyConfig.agentId);
        if (legacyConfig.apiKey) this.set('apiKey', legacyConfig.apiKey);
        if (legacyConfig.registeredAt) this.set('registeredAt', legacyConfig.registeredAt);

        console.log(chalk.green(`✓ Migrated legacy configuration from ${this.legacyConfigPath}`));
      } catch (error) {
        console.log(chalk.yellow(`⚠ Could not migrate legacy config: ${error}`));
      }
    }
  }

  /**
   * Get configuration value
   */
  get<K extends keyof BrainConfig>(key: K): BrainConfig[K] {
    // Check environment variables first
    const envMap: Record<string, keyof BrainConfig> = {
      BRAIN_API_KEY: 'apiKey',
      BRAIN_SERVER_PATH: 'serverPath',
      BRAIN_TRACKING_ID: 'trackingId'
    };

    for (const [envKey, configKey] of Object.entries(envMap)) {
      if (configKey === key && process.env[envKey]) {
        return process.env[envKey] as BrainConfig[K];
      }
    }

    return this.config.get(key);
  }

  /**
   * Set configuration value
   */
  set<K extends keyof BrainConfig>(key: K, value: BrainConfig[K]): void {
    this.config.set(key, value);
  }

  /**
   * Delete configuration value
   */
  delete(key: keyof BrainConfig): void {
    this.config.delete(key);
  }

  /**
   * Clear all configuration
   */
  clear(): void {
    this.config.clear();
  }

  /**
   * Get all configuration
   */
  getAll(): BrainConfig {
    return this.config.store;
  }

  /**
   * Check if authenticated
   */
  isAuthenticated(): boolean {
    return !!(this.get('apiKey') || process.env.BRAIN_API_KEY);
  }

  /**
   * Get API key (with fallback to env)
   */
  getApiKey(): string | undefined {
    return this.get('apiKey') || process.env.BRAIN_API_KEY;
  }

  /**
   * Get tracking ID
   */
  getTrackingId(): string | undefined {
    return this.get('trackingId');
  }

  /**
   * Save authentication details
   */
  saveAuth(apiKey: string, trackingId?: string): void {
    this.set('apiKey', apiKey);
    if (trackingId) {
      this.set('trackingId', trackingId);
    }
    this.set('registeredAt', new Date().toISOString());
  }

  /**
   * Clear authentication
   */
  clearAuth(): void {
    this.delete('apiKey');
    this.delete('trackingId');
    this.delete('agentId');
    this.delete('agentName');
  }

  /**
   * Update last connected timestamp
   */
  updateLastConnected(): void {
    this.set('lastConnected', new Date().toISOString());
  }

  /**
   * Get config file path
   */
  getConfigPath(): string {
    return this.config.path;
  }

  /**
   * Ensure config directory exists (for legacy support)
   */
  ensureConfigDir(): void {
    if (!existsSync(this.configDir)) {
      mkdirSync(this.configDir, { recursive: true });
    }
  }
}

// Export singleton instance
export const config = new ConfigManager();