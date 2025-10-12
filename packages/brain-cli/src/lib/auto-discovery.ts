/**
 * Auto-Discovery System
 * =====================
 *
 * Automatically discovers Central Intelligence MCP server using multiple methods.
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import path from 'path';
import os from 'os';

export interface MCPServer {
  id: string;
  name: string;
  type: 'stdio' | 'websocket' | 'http';
  path?: string;
  url?: string;
  projects: string[];
  active: boolean;
  lastSeen: string;
  priority: number;
}

export interface DiscoveryResult {
  found: boolean;
  method: 'environment' | 'registry' | 'git-repo' | 'not-found';
  server?: MCPServer;
  message: string;
}

export class MCPAutoDiscovery {
  private readonly REGISTRY_PATH = path.join(os.homedir(), '.brain', 'registry.json');

  async discover(): Promise<DiscoveryResult> {
    console.log('🔍 Auto-discovering Central Intelligence...\n');

    // Try environment first
    const envResult = this.discoverViaEnvironment();
    if (envResult.found) {
      console.log('✅ Found via environment');
      return envResult;
    }

    // Try registry
    const regResult = await this.discoverViaRegistry();
    if (regResult.found) {
      console.log('✅ Found via registry');
      return regResult;
    }

    // Try git scan
    const gitResult = await this.discoverViaGitRepo();
    if (gitResult.found) {
      console.log('✅ Found via git scan');
      return gitResult;
    }

    return { found: false, method: 'not-found', message: 'Not found' };
  }

  private discoverViaEnvironment(): DiscoveryResult {
    const value = process.env.BRAIN_MCP_SERVER || process.env.BRAIN_SERVER_PATH;
    if (value && existsSync(value)) {
      return {
        found: true,
        method: 'environment',
        server: {
          id: 'env',
          name: 'Environment',
          type: 'stdio',
          path: value,
          projects: ['*'],
          active: true,
          lastSeen: new Date().toISOString(),
          priority: 10
        },
        message: 'Found'
      };
    }
    return { found: false, method: 'environment', message: 'Not found' };
  }

  private async discoverViaRegistry(): Promise<DiscoveryResult> {
    if (!existsSync(this.REGISTRY_PATH)) {
      return { found: false, method: 'registry', message: 'Not found' };
    }

    const registry = JSON.parse(readFileSync(this.REGISTRY_PATH, 'utf-8'));
    const active = (registry.servers || []).find((s: MCPServer) => s.active);

    if (active && active.path && existsSync(active.path)) {
      return { found: true, method: 'registry', server: active, message: 'Found' };
    }

    return { found: false, method: 'registry', message: 'Not found' };
  }

  private async discoverViaGitRepo(): Promise<DiscoveryResult> {
    let dir = process.cwd();

    while (dir !== '/') {
      // Check marker
      const marker = path.join(dir, '.brain', 'server.json');
      if (existsSync(marker)) {
        const config = JSON.parse(readFileSync(marker, 'utf-8'));
        const serverPath = path.resolve(dir, config.serverPath);

        if (existsSync(serverPath)) {
          return {
            found: true,
            method: 'git-repo',
            server: {
              id: 'git',
              name: 'Git Marker',
              type: 'stdio',
              path: serverPath,
              projects: config.projects || ['*'],
              active: true,
              lastSeen: new Date().toISOString(),
              priority: 20
            },
            message: 'Found'
          };
        }
      }

      // Check git root
      if (existsSync(path.join(dir, '.git'))) {
        const serverPath = this.scanForMCPServer(dir);
        if (serverPath) {
          return {
            found: true,
            method: 'git-repo',
            server: {
              id: 'git-scan',
              name: 'Git Scan',
              type: 'stdio',
              path: serverPath,
              projects: [path.basename(dir)],
              active: true,
              lastSeen: new Date().toISOString(),
              priority: 30
            },
            message: 'Found'
          };
        }
      }

      const parent = path.dirname(dir);
      if (parent === dir) break;
      dir = parent;
    }

    return { found: false, method: 'git-repo', message: 'Not found' };
  }

  private scanForMCPServer(rootDir: string): string | null {
    const patterns = [
      '01_CODEBASES/mcp-servers',
      'mcp-server',
      '.brain/mcp-server'
    ];

    for (const pattern of patterns) {
      const dir = path.join(rootDir, pattern);
      if (existsSync(dir)) {
        const indexPath = path.join(dir, 'localbrain-task-registry/dist/index.js');
        if (existsSync(indexPath)) return indexPath;

        // Try generic scan
        const distIndex = path.join(dir, 'dist/index.js');
        if (existsSync(distIndex)) return distIndex;
      }
    }

    return null;
  }

  async autoStartServer(serverPath: string): Promise<boolean> {
    console.log('🚀 Auto-starting MCP server...');

    const { spawn } = await import('child_process');
    const server = spawn('node', [serverPath], {
      detached: true,
      stdio: 'ignore',
      cwd: path.dirname(serverPath)
    });

    server.unref();
    await new Promise(r => setTimeout(r, 2000));

    console.log('✅ Server started');
    return true;
  }

  getAllServers(): MCPServer[] {
    if (!existsSync(this.REGISTRY_PATH)) return [];
    const registry = JSON.parse(readFileSync(this.REGISTRY_PATH, 'utf-8'));
    return registry.servers || [];
  }
}
