/**
 * 🚀 AutoScaffolder Class
 * =====================
 *
 * Implements T016: Automatic project directory structure creation,
 * template rendering, and file generation for the META layer.
 *
 * Built by Agent A (UI Velocity Specialist)
 * Part of META Layer implementation - Parallel Swarm Task T016
 * Estimated: 5 hours
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { TemplateEngine } from './TemplateEngine';
import { ProjectTemplate, ScaffoldOptions } from '../types/ScaffoldTypes';

export class AutoScaffolder {
  private templateEngine: TemplateEngine;
  private templatesDir: string;

  constructor(private workingDir: string = process.cwd()) {
    this.templateEngine = new TemplateEngine();
    this.templatesDir = path.join(__dirname, '../../templates');
  }

  /**
   * Create a new project from template
   */
  async scaffoldProject(options: ScaffoldOptions): Promise<void> {
    console.log(`🚀 Scaffolding project: ${options.projectName}`);
    console.log(`📁 Type: ${options.projectType}`);
    console.log(`📍 Location: ${options.outputPath}`);

    try {
      // 1. Create project directory structure
      await this.createDirectoryStructure(options);

      // 2. Generate files from templates
      await this.generateFiles(options);

      // 3. Create configuration files
      await this.createConfigurationFiles(options);

      // 4. Initialize package.json if needed
      if (options.projectType !== 'INFRASTRUCTURE') {
        await this.initializePackageJson(options);
      }

      // 5. Create initial documentation
      await this.createDocumentation(options);

      console.log(`✅ Project "${options.projectName}" scaffolded successfully!`);
      console.log(`📂 Location: ${options.outputPath}`);
      console.log(`🚀 Ready to start development!`);

    } catch (error) {
      console.error(`❌ Failed to scaffold project: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create directory structure based on project type
   */
  private async createDirectoryStructure(options: ScaffoldOptions): Promise<void> {
    const { projectType, outputPath } = options;
    const dirs = this.getDirectoryStructure(projectType);

    console.log(`📁 Creating ${dirs.length} directories...`);

    for (const dir of dirs) {
      const fullPath = path.join(outputPath, dir);
      await fs.mkdir(fullPath, { recursive: true });
      console.log(`  ✓ ${fullPath}`);
    }
  }

  /**
   * Get directory structure for project type
   */
  private getDirectoryStructure(projectType: string): string[] {
    const baseDirs = [
      'src',
      'docs',
      'tests',
      '.git',
      'scripts'
    ];

    switch (projectType) {
      case 'TOOL':
        return [
          ...baseDirs,
          'src/core',
          'src/utils',
          'src/cli',
          'src/types',
          'dist',
          'examples',
          'bin'
        ];

      case 'APP':
        return [
          ...baseDirs,
          'src/components',
          'src/pages',
          'src/hooks',
          'src/services',
          'src/utils',
          'src/styles',
          'src/types',
          'public',
          'build',
          '.vscode'
        ];

      case 'INFRASTRUCTURE':
        return [
          ...baseDirs,
          'terraform',
          'docker',
          'kubernetes',
          'scripts/deploy',
          'config',
          'monitoring'
        ];

      default:
        return baseDirs;
    }
  }

  /**
   * Generate files from templates
   */
  private async generateFiles(options: ScaffoldOptions): Promise<void> {
    const { projectType, outputPath, projectName } = options;

    console.log(`📄 Generating template files...`);

    // Core files for all project types
    const coreFiles = [
      { template: 'README.md.template', output: 'README.md' },
      { template: '.gitignore.template', output: '.gitignore' },
      { template: 'CLAUDE.md.template', output: 'CLAUDE.md' }
    ];

    for (const file of coreFiles) {
      await this.templateEngine.renderTemplate(
        path.join(this.templatesDir, file.template),
        path.join(outputPath, file.output),
        { projectName, projectType, ...options }
      );
      console.log(`  ✓ ${file.output}`);
    }

    // Type-specific files
    await this.generateTypeSpecificFiles(projectType, outputPath, options);
  }

  /**
   * Generate type-specific files
   */
  private async generateTypeSpecificFiles(
    projectType: string,
    outputPath: string,
    options: ScaffoldOptions
  ): Promise<void> {
    switch (projectType) {
      case 'TOOL':
        await this.generateToolFiles(outputPath, options);
        break;
      case 'APP':
        await this.generateAppFiles(outputPath, options);
        break;
      case 'INFRASTRUCTURE':
        await this.generateInfrastructureFiles(outputPath, options);
        break;
    }
  }

  /**
   * Generate tool-specific files
   */
  private async generateToolFiles(outputPath: string, options: ScaffoldOptions): Promise<void> {
    const toolFiles = [
      { template: 'tool/index.ts.template', output: 'src/index.ts' },
      { template: 'tool/cli.ts.template', output: 'src/cli/index.ts' },
      { template: 'tool/core.ts.template', output: 'src/core/index.ts' },
      { template: 'tool/utils.ts.template', output: 'src/utils/index.ts' },
      { template: 'tool/package.json.template', output: 'package.json' },
      { template: 'tool/tsconfig.json.template', output: 'tsconfig.json' }
    ];

    for (const file of toolFiles) {
      await this.templateEngine.renderTemplate(
        path.join(this.templatesDir, file.template),
        path.join(outputPath, file.output),
        options
      );
      console.log(`  ✓ ${file.output}`);
    }
  }

  /**
   * Generate app-specific files
   */
  private async generateAppFiles(outputPath: string, options: ScaffoldOptions): Promise<void> {
    const appFiles = [
      { template: 'app/App.tsx.template', output: 'src/App.tsx' },
      { template: 'app/index.tsx.template', output: 'src/index.tsx' },
      { template: 'app/components.ts.template', output: 'src/components/index.ts' },
      { template: 'app/package.json.template', output: 'package.json' },
      { template: 'app/tsconfig.json.template', output: 'tsconfig.json' },
      { template: 'app/vite.config.ts.template', output: 'vite.config.ts' }
    ];

    for (const file of appFiles) {
      await this.templateEngine.renderTemplate(
        path.join(this.templatesDir, file.template),
        path.join(outputPath, file.output),
        options
      );
      console.log(`  ✓ ${file.output}`);
    }
  }

  /**
   * Generate infrastructure-specific files
   */
  private async generateInfrastructureFiles(outputPath: string, options: ScaffoldOptions): Promise<void> {
    const infraFiles = [
      { template: 'infra/main.tf.template', output: 'terraform/main.tf' },
      { template: 'infra/variables.tf.template', output: 'terraform/variables.tf' },
      { template: 'infra/outputs.tf.template', output: 'terraform/outputs.tf' },
      { template: 'infra/Dockerfile.template', output: 'docker/Dockerfile' },
      { template: 'infra/deploy.sh.template', output: 'scripts/deploy.sh' }
    ];

    for (const file of infraFiles) {
      await this.templateEngine.renderTemplate(
        path.join(this.templatesDir, file.template),
        path.join(outputPath, file.output),
        options
      );
      console.log(`  ✓ ${file.output}`);
    }
  }

  /**
   * Create configuration files
   */
  private async createConfigurationFiles(options: ScaffoldOptions): Promise<void> {
    const { outputPath, projectType } = options;

    // VS Code configuration
    const vscodeDir = path.join(outputPath, '.vscode');
    await fs.mkdir(vscodeDir, { recursive: true });

    const vscodeSettings = {
      "typescript.preferences.importModuleSpecifier": "relative",
      "editor.formatOnSave": true,
      "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
      }
    };

    await fs.writeFile(
      path.join(vscodeDir, 'settings.json'),
      JSON.stringify(vscodeSettings, null, 2)
    );

    console.log(`  ✓ .vscode/settings.json`);
  }

  /**
   * Initialize package.json
   */
  private async initializePackageJson(options: ScaffoldOptions): Promise<void> {
    const { outputPath, projectName, projectType } = options;

    const packageJsonPath = path.join(outputPath, 'package.json');

    // Check if already created by template
    try {
      await fs.access(packageJsonPath);
      return; // Already exists
    } catch {
      // Create basic package.json
      const basicPackageJson = {
        name: projectName.toLowerCase().replace(/\s+/g, '-'),
        version: "1.0.0",
        description: `${projectType} project scaffolded by META layer`,
        main: "dist/index.js",
        scripts: {
          build: "tsc",
          start: "node dist/index.js",
          dev: "ts-node src/index.ts",
          test: "jest"
        },
        keywords: ["meta-layer", "scaffolded", projectType.toLowerCase()],
        author: "META Layer AutoScaffolder",
        license: "MIT",
        devDependencies: {
          "@types/node": "^20.0.0",
          "typescript": "^5.0.0",
          "ts-node": "^10.0.0",
          "jest": "^29.0.0",
          "@types/jest": "^29.0.0"
        }
      };

      await fs.writeFile(
        packageJsonPath,
        JSON.stringify(basicPackageJson, null, 2)
      );

      console.log(`  ✓ package.json`);
    }
  }

  /**
   * Create initial documentation
   */
  private async createDocumentation(options: ScaffoldOptions): Promise<void> {
    const { outputPath, projectName, projectType } = options;

    const docsDir = path.join(outputPath, 'docs');
    const docs = [
      {
        name: 'GETTING_STARTED.md',
        content: this.generateGettingStartedContent(options)
      },
      {
        name: 'ARCHITECTURE.md',
        content: this.generateArchitectureContent(options)
      }
    ];

    for (const doc of docs) {
      await fs.writeFile(
        path.join(docsDir, doc.name),
        doc.content
      );
      console.log(`  ✓ docs/${doc.name}`);
    }
  }

  /**
   * Generate getting started content
   */
  private generateGettingStartedContent(options: ScaffoldOptions): string {
    const { projectName, projectType } = options;

    return `# Getting Started with ${projectName}

## 🚀 Quick Start

\`\`\`bash
# Install dependencies
npm install

# Start development
npm run dev

# Run tests
npm test

# Build for production
npm run build
\`\`\`

## 📁 Project Structure

This is a **${projectType}** project scaffolded by the META layer.

## 🎯 Next Steps

1. Review the generated code
2. Customize templates and configurations
3. Start building your ${projectType.toLowerCase()}

## 📚 Documentation

- [Architecture](./ARCHITECTURE.md)
- [API Reference](./API.md)
- [Examples](../examples/)

---

*Scaffolded by META Layer AutoScaffolder (Agent A)*
`;
  }

  /**
   * Generate architecture content
   */
  private generateArchitectureContent(options: ScaffoldOptions): string {
    const { projectName, projectType } = options;

    return `# ${projectName} Architecture

## Project Type: ${projectType}

This project was automatically scaffolded by the META layer AutoScaffolder.

## Architecture Overview

\`\`\`
src/
├── core/          # Core functionality
├── utils/         # Utility functions
└── types/         # Type definitions
\`\`\`

## Design Principles

1. **Type Safety**: Full TypeScript implementation
2. **Modularity**: Clear separation of concerns
3. **Testability**: Comprehensive test coverage
4. **Documentation**: Self-documenting code

## Dependencies

- TypeScript for type safety
- Jest for testing
- ESLint for code quality

---

*Architecture documented by META Layer (Agent A)*
`;
  }

  /**
   * List available templates
   */
  async listTemplates(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.templatesDir);
      return files.filter(file => file.endsWith('.template'));
    } catch (error) {
      console.warn('Templates directory not found');
      return [];
    }
  }

  /**
   * Validate project name
   */
  validateProjectName(name: string): boolean {
    // Basic validation: alphanumeric, hyphens, underscores
    return /^[a-zA-Z0-9-_]+$/.test(name) && name.length > 0;
  }
}

/**
 * Example usage
 */
export async function exampleUsage() {
  const scaffolder = new AutoScaffolder();

  const options: ScaffoldOptions = {
    projectName: 'MyAwesomeTool',
    projectType: 'TOOL',
    outputPath: '/path/to/output',
    author: 'Agent A',
    description: 'An awesome tool built with META layer'
  };

  await scaffolder.scaffoldProject(options);
}