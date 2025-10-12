#!/usr/bin/env node
/**
 * MR. FIX MY PROJECT PLEASE - MCP SERVER
 * =======================================
 *
 * Standalone MCP server that exposes ULTRATHINK project analysis as MCP tools.
 *
 * Features:
 * - 🚀 ULTRATHINK Dependency Maps (5 Mermaid diagrams)
 * - 🔬 GPT-4O Purpose Discovery
 * - 🔫 Sniper Gun Entity Extraction
 * - 🌊 Ripple Effect Analysis
 * - 📊 Interactive HTML Reports
 * - 🌙 Dark Theme Visualizations
 * - 🔍 Right-Click Zoom Mode
 *
 * Usage:
 *   Add to Claude Desktop config.json:
 *   {
 *     "mcpServers": {
 *       "mr-fix": {
 *         "command": "node",
 *         "args": ["/Users/lech/PROJECTS_all/LocalBrain/mr-fix-mcp-server.js"]
 *       }
 *     }
 *   }
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';
const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Path to mr-fix-my-project-please.py
const ANALYZER_PATH = path.join(__dirname, 'mr-fix-my-project-please.py');
/**
 * Create and configure the MCP server
 */
function createServer() {
    const server = new Server({
        name: 'mr-fix-my-project-please',
        version: '1.0.0',
    }, {
        capabilities: {
            tools: {},
        },
    });
    /**
     * Register tool: analyze_project
     *
     * Runs comprehensive ULTRATHINK analysis on any project
     */
    server.setRequestHandler(ListToolsRequestSchema, async () => {
        return {
            tools: [
                {
                    name: 'analyze_project',
                    description: 'Run ULTRATHINK analysis on a project. Generates comprehensive HTML report with dependency maps (5 Mermaid diagrams), GPT-4O purpose discovery, entity extraction, ripple effect analysis, and interactive visualizations. Features dark theme, right-click zoom mode, and MEGALITH INDEX navigation.',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            projectPath: {
                                type: 'string',
                                description: 'Path to project directory to analyze (defaults to current directory)',
                            },
                            htmlOnly: {
                                type: 'boolean',
                                description: 'Generate HTML report only (faster, skips some analysis). Default: false',
                            },
                        },
                        required: [],
                    },
                },
                {
                    name: 'quick_analysis',
                    description: 'Quick project analysis with HTML report generation only (faster than full analysis). Perfect for getting a rapid overview of project structure, health, and dependencies.',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            projectPath: {
                                type: 'string',
                                description: 'Path to project directory to analyze (defaults to current directory)',
                            },
                        },
                        required: [],
                    },
                },
            ],
        };
    });
    /**
     * Handle tool calls
     */
    server.setRequestHandler(CallToolRequestSchema, async (request) => {
        const { name, arguments: args } = request.params;
        try {
            switch (name) {
                case 'analyze_project':
                    return await handleAnalyzeProject(args);
                case 'quick_analysis':
                    return await handleQuickAnalysis(args);
                default:
                    throw new Error(`Unknown tool: ${name}`);
            }
        }
        catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            error: error.message,
                            stderr: error.stderr || null,
                        }, null, 2),
                    },
                ],
                isError: true,
            };
        }
    });
    return server;
}
/**
 * Handle analyze_project tool
 */
async function handleAnalyzeProject(args) {
    const projectPath = args?.projectPath || process.cwd();
    const htmlOnly = args?.htmlOnly || false;
    console.error(`🚀 Starting ULTRATHINK analysis for: ${projectPath}`);
    // Build command
    const flags = htmlOnly ? '--html-only' : '';
    const command = `python3 "${ANALYZER_PATH}" "${projectPath}" ${flags}`;
    console.error(`📊 Executing: ${command}`);
    // Execute analysis (with 10 minute timeout for large projects)
    const { stdout, stderr } = await execAsync(command, {
        cwd: projectPath,
        timeout: 600000, // 10 minutes
        maxBuffer: 20 * 1024 * 1024, // 20MB buffer
    });
    // Parse output
    const htmlMatch = stdout.match(/Complete analysis saved to: (.+\.html)/);
    const filesMatch = stdout.match(/Found (\d+) files/);
    const dirsMatch = stdout.match(/(\d+) directories/);
    const purposeMatch = stdout.match(/GPT-4O analysis complete: (.+)/);
    const htmlPath = htmlMatch ? htmlMatch[1] : 'Unknown';
    const totalFiles = filesMatch ? parseInt(filesMatch[1]) : 0;
    const totalDirs = dirsMatch ? parseInt(dirsMatch[1]) : 0;
    const projectPurpose = purposeMatch ? purposeMatch[1] : 'Unknown';
    console.error(`✅ Analysis complete: ${htmlPath}`);
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify({
                    success: true,
                    project_path: projectPath,
                    html_report: htmlPath,
                    statistics: {
                        total_files: totalFiles,
                        total_directories: totalDirs,
                        project_purpose: projectPurpose,
                    },
                    features: [
                        '🚀 ULTRATHINK Dependency Maps (5 Mermaid diagrams)',
                        '🔬 GPT-4O Purpose Discovery',
                        '🔫 Sniper Gun Entity Extraction',
                        '🌊 Ripple Effect Analysis',
                        '📊 Interactive HTML Report',
                        '🌙 Dark Theme Mermaid Diagrams',
                        '🔍 Right-Click Zoom Mode',
                        '📚 MEGALITH INDEX Navigation',
                        '🎨 OKLCH Color System',
                        '⚙️ Settings Panel (Color Schemas)',
                        '🎯 Ultimate-UI-Studio-V2 Design System',
                    ],
                    next_steps: [
                        `Open the HTML report: open "${htmlPath}"`,
                        'Use right-click on Mermaid diagrams to enable zoom mode',
                        'Click ⚙️ button to change color schema (Temperature/GitHub/Plasma)',
                        'Use 📖 Expand All / 📕 Collapse All buttons for navigation',
                    ],
                }, null, 2),
            },
        ],
    };
}
/**
 * Handle quick_analysis tool
 */
async function handleQuickAnalysis(args) {
    // Quick analysis is just analyze_project with htmlOnly=true
    return handleAnalyzeProject({ ...args, htmlOnly: true });
}
/**
 * Main entry point
 */
async function main() {
    console.error('🔧 Starting Mr. Fix My Project Please MCP Server...');
    const server = createServer();
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('✅ MCP Server ready!');
    console.error('📡 Listening for tool requests...');
}
main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
