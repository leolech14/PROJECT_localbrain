/**
 * 🏗️ META Layer Scaffolding Module
 * ==================================
 *
 * Auto-scaffolding system for automatic project generation.
 * Built by Agent A (UI Velocity Specialist) - T016
 *
 * Exports:
 * - AutoScaffolder: Main scaffolding class
 * - TemplateEngine: Template rendering engine
 * - ScaffoldTypes: Type definitions
 */

export { AutoScaffolder } from './AutoScaffolder';
export { TemplateEngine } from './TemplateEngine';
export type {
  ScaffoldOptions,
  ProjectTemplate,
  TemplateVariable,
  TemplateFile,
  ScaffoldResult,
  TemplateContext
} from '../types/ScaffoldTypes';

/**
 * Quick scaffolding function
 */
export async function scaffoldProject(options: import('../types/ScaffoldTypes').ScaffoldOptions) {
  const { AutoScaffolder } = await import('./AutoScaffolder');
  const scaffolder = new AutoScaffolder();
  return scaffolder.scaffoldProject(options);
}

/**
 * Create scaffolder instance with custom working directory
 */
export function createScaffolder(workingDir?: string) {
  return new AutoScaffolder(workingDir);
}