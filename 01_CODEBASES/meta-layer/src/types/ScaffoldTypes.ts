/**
 * 🏗️ Scaffolding Types
 * ==================
 *
 * Type definitions for the META layer AutoScaffolder.
 * Built by Agent A (UI Velocity Specialist) - T016
 */

export interface ScaffoldOptions {
  projectName: string;
  projectType: 'TOOL' | 'APP' | 'INFRASTRUCTURE';
  outputPath: string;
  author?: string;
  description?: string;
  version?: string;
  repository?: string;
  license?: string;
  templates?: string[];
  features?: {
    typescript: boolean;
    eslint: boolean;
    prettier: boolean;
    jest: boolean;
    docker: boolean;
    cicd: boolean;
  };
}

export interface ProjectTemplate {
  name: string;
  type: ScaffoldOptions['projectType'];
  description: string;
  variables: TemplateVariable[];
  files: TemplateFile[];
  directories: string[];
}

export interface TemplateVariable {
  name: string;
  type: 'string' | 'boolean' | 'number' | 'array';
  description: string;
  required: boolean;
  default?: any;
  options?: string[];
}

export interface TemplateFile {
  template: string;
  output: string;
  condition?: string;
  variables?: Record<string, any>;
}

export interface ScaffoldResult {
  success: boolean;
  projectName: string;
  outputPath: string;
  filesCreated: string[];
  directoriesCreated: string[];
  warnings: string[];
  errors: string[];
  duration: number;
}

export interface TemplateContext {
  projectName: string;
  projectType: string;
  author?: string;
  description?: string;
  version?: string;
  repository?: string;
  license?: string;
  timestamp: Date;
  scaffolderVersion: string;
  [key: string]: any;
}