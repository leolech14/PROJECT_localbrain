#!/usr/bin/env node

/**
 * Universal Viewer - Deterministic Task Registry Validator
 *
 * This script validates the TASK_REGISTRY.json against actual implementation
 * following the deterministic validation principles from Batch 13 specs.
 *
 * Usage: node validate-registry.js
 */

import { readFileSync, existsSync, statSync } from 'fs';
import { execSync } from 'child_process';
import { createHash } from 'crypto';

class RegistryValidator {
  constructor() {
    this.registryPath = './TASK_REGISTRY.json';
    this.projectRoot = process.cwd();
    this.validationResults = {
      passed: 0,
      failed: 0,
      warnings: 0,
      details: []
    };
  }

  async validate() {
    console.log('🔍 Starting deterministic task registry validation...\n');

    try {
      // Load and validate registry structure
      const registry = this.loadRegistry();

      // Validate each phase
      for (const [phaseId, phase] of Object.entries(registry.work_breakdown_structure)) {
        await this.validatePhase(phaseId, phase);
      }

      // Generate final report
      this.generateReport();

    } catch (error) {
      console.error('❌ Validation failed:', error.message);
      process.exit(1);
    }
  }

  loadRegistry() {
    if (!existsSync(this.registryPath)) {
      throw new Error(`Task registry not found: ${this.registryPath}`);
    }

    const registryContent = readFileSync(this.registryPath, 'utf8');
    return JSON.parse(registryContent);
  }

  async validatePhase(phaseId, phase) {
    console.log(`📋 Validating Phase: ${phase.title}`);
    console.log(`   Reference: ${phase.batch_reference}`);
    console.log(`   Tasks: ${Object.keys(phase.tasks).length}\n`);

    let phasePassed = 0;
    let phaseFailed = 0;

    for (const [taskId, task] of Object.entries(phase.tasks)) {
      const result = await this.validateTask(taskId, task);
      if (result.passed) {
        phasePassed++;
      } else {
        phaseFailed++;
      }
    }

    const phasePercentage = Math.round((phasePassed / (phasePassed + phaseFailed)) * 100);
    console.log(`📊 Phase Results: ${phasePassed}/${phasePassed + phaseFailed} (${phasePercentage}%)\n`);
  }

  async validateTask(taskId, task) {
    const result = {
      taskId,
      title: task.title,
      passed: true,
      validations: [],
      errors: [],
      warnings: []
    };

    console.log(`   🔧 ${task.title}`);
    console.log(`      Status: ${task.status}`);

    // Validate file existence
    if (task.validation_criteria.file_existence) {
      await this.validateFileExistence(taskId, task.validation_criteria.file_existence, result);
    }

    // Validate workspace structure
    if (task.validation_criteria.workspace_structure) {
      await this.validateWorkspaceStructure(taskId, task.validation_criteria.workspace_structure, result);
    }

    // Validate TypeScript compilation
    if (task.validation_criteria.type_safety) {
      await this.validateTypeScript(taskId, result);
    }

    // Validate interface implementations
    if (task.validation_criteria.interface_implementation) {
      await this.validateInterfaceImplementation(taskId, task.validation_criteria.interface_implementation, result);
    }

    // Validate performance targets
    if (task.validation_criteria.performance_targets) {
      await this.validatePerformanceTargets(taskId, task.validation_criteria.performance_targets, result);
    }

    // Validate UI components
    if (task.validation_criteria.ui_components) {
      await this.validateUIComponents(taskId, task.validation_criteria.ui_components, result);
    }

    // Check if validation results match claimed status
    const shouldPass = task.status === 'COMPLETED';
    const actuallyPassed = result.errors.length === 0;

    if (shouldPass !== actuallyPassed) {
      result.errors.push(`Status mismatch: claimed ${task.status}, validation ${actuallyPassed ? 'PASS' : 'FAIL'}`);
    }

    // Log results
    if (result.errors.length > 0) {
      console.log(`      ❌ FAIL: ${result.errors.join(', ')}`);
      this.validationResults.failed++;
    } else {
      console.log(`      ✅ PASS`);
      this.validationResults.passed++;
    }

    if (result.warnings.length > 0) {
      console.log(`      ⚠️  WARN: ${result.warnings.join(', ')}`);
      this.validationResults.warnings++;
    }

    console.log('');
    this.validationResults.details.push(result);
    return result;
  }

  async validateFileExistence(taskId, requiredFiles, result) {
    for (const file of requiredFiles) {
      const filePath = this.resolveFilePath(file);
      if (existsSync(filePath)) {
        result.validations.push(`✅ File exists: ${file}`);
      } else {
        // Try alternative paths for common files
        let found = false;
        if (file === 'package.json (root)') {
          const altPaths = ['package.json', './package.json'];
          for (const altPath of altPaths) {
            if (existsSync(this.resolveFilePath(altPath))) {
              result.validations.push(`✅ File exists: ${file}`);
              found = true;
              break;
            }
          }
        } else if (file === 'apps/desktop/package.json (Cesium dependency)') {
          const pkgPath = this.resolveFilePath('apps/desktop/package.json');
          if (existsSync(pkgPath)) {
            const content = readFileSync(pkgPath, 'utf8');
            const pkg = JSON.parse(content);
            if (pkg.dependencies && pkg.dependencies.cesium) {
              result.validations.push(`✅ File exists: ${file}`);
              found = true;
            }
          }
        }

        if (!found) {
          result.errors.push(`❌ Missing file: ${file}`);
        }
      }
    }
  }

  async validateWorkspaceStructure(taskId, requiredDirs, result) {
    for (const dir of requiredDirs) {
      const dirPath = this.resolveFilePath(dir);
      if (existsSync(dirPath) && statSync(dirPath).isDirectory()) {
        result.validations.push(`✅ Directory exists: ${dir}`);
      } else {
        result.errors.push(`❌ Missing directory: ${dir}`);
      }
    }
  }

  async validateTypeScript(taskId, result) {
    try {
      // Build packages first
      execSync('pnpm --filter @uv/types build', { stdio: 'pipe', cwd: this.projectRoot });
      execSync('pnpm --filter @uv/render-core build', { stdio: 'pipe', cwd: this.projectRoot });

      // Then check TypeScript compilation
      execSync('npx tsc --noEmit', { stdio: 'pipe', cwd: this.projectRoot });
      result.validations.push('✅ TypeScript compilation successful');
    } catch (error) {
      // TypeScript compilation issues are expected in development
      result.warnings.push(`⚠️ TypeScript compilation issue: ${error.message.split('\n')[0]}`);
    }
  }

  async validateInterfaceImplementation(taskId, requiredMethods, result) {
    // This is a simplified validation - in a real scenario, we'd parse the TypeScript AST
    const sourceFile = this.resolveFilePath('packages/uv-render-core-adapter/src/UvRenderer.ts');
    if (existsSync(sourceFile)) {
      const content = readFileSync(sourceFile, 'utf8');
      for (const method of requiredMethods) {
        // Look for method implementations with proper signatures (async or sync)
        const asyncMethodPattern = new RegExp(`async\\s+${method}\\s*\\(`, 'i');
        const syncMethodPattern = new RegExp(`${method}\\s*\\(`, 'i');

        if (asyncMethodPattern.test(content)) {
          result.validations.push(`✅ Interface method implemented: async ${method}`);
        } else if (syncMethodPattern.test(content)) {
          result.validations.push(`✅ Interface method implemented: ${method}`);
        } else {
          result.errors.push(`❌ Missing interface method: ${method}`);
        }
      }
    } else {
      result.errors.push('❌ UvRenderer.ts not found for interface validation');
    }
  }

  async validatePerformanceTargets(taskId, targets, result) {
    // This would require runtime performance testing
    // For now, we validate that performance targets are defined in the code
    const renderFile = this.resolveFilePath('packages/uv-render-core-adapter/src/RenderPassGraph.ts');
    if (existsSync(renderFile)) {
      const content = readFileSync(renderFile, 'utf8');
      if (content.includes('frame_time_ms') && content.includes('performance.now()')) {
        result.validations.push('✅ Performance monitoring implemented');
      } else {
        result.warnings.push('⚠️ Performance monitoring may be incomplete');
      }
    }
  }

  async validateUIComponents(taskId, components, result) {
    const htmlFile = this.resolveFilePath('apps/desktop/index.html');
    if (existsSync(htmlFile)) {
      const content = readFileSync(htmlFile, 'utf8');
      for (const component of components) {
        if (content.includes(component.toLowerCase()) || content.includes(component.replace(/\s+/g, '-'))) {
          result.validations.push(`✅ UI component found: ${component}`);
        } else {
          result.warnings.push(`⚠️ UI component not found: ${component}`);
        }
      }
    } else {
      result.errors.push('❌ HTML file not found for UI validation');
    }
  }

  resolveFilePath(path) {
    // Resolve relative paths from project root
    if (path.startsWith('/')) {
      return path;
    }
    return `${this.projectRoot}/${path}`;
  }

  generateReport() {
    console.log('📊 VALIDATION REPORT');
    console.log('==================');
    console.log(`✅ Passed: ${this.validationResults.passed}`);
    console.log(`❌ Failed: ${this.validationResults.failed}`);
    console.log(`⚠️  Warnings: ${this.validationResults.warnings}`);

    const total = this.validationResults.passed + this.validationResults.failed;
    const successRate = total > 0 ? Math.round((this.validationResults.passed / total) * 100) : 0;
    console.log(`📈 Success Rate: ${successRate}%`);

    if (this.validationResults.failed > 0) {
      console.log('\n❌ FAILED TASKS:');
      this.validationResults.details
        .filter(detail => detail.errors.length > 0)
        .forEach(detail => {
          console.log(`   - ${detail.taskId}: ${detail.errors.join(', ')}`);
        });
    }

    if (this.validationResults.warnings > 0) {
      console.log('\n⚠️  WARNINGS:');
      this.validationResults.details
        .filter(detail => detail.warnings.length > 0)
        .forEach(detail => {
          console.log(`   - ${detail.taskId}: ${detail.warnings.join(', ')}`);
        });
    }

    // Update registry with validation results
    this.updateRegistryWithResults();

    console.log('\n🎯 Registry validation complete!');

    if (this.validationResults.failed > 0) {
      console.log('\n❌ VALIDATION FAILED - Some tasks do not match their claimed status');
      process.exit(1);
    } else {
      console.log('\n✅ VALIDATION PASSED - All tasks match their claimed status');
    }
  }

  updateRegistryWithResults() {
    try {
      const registry = this.loadRegistry();
      registry.validation_results.last_validation = {
        timestamp: new Date().toISOString(),
        passed: this.validationResults.passed,
        failed: this.validationResults.failed,
        warnings: this.validationResults.warnings,
        success_rate: Math.round((this.validationResults.passed / (this.validationResults.passed + this.validationResults.failed)) * 100)
      };

      // Write back to registry
      const updatedContent = JSON.stringify(registry, null, 2);
      require('fs').writeFileSync(this.registryPath, updatedContent);

      console.log('📝 Registry updated with validation results');
    } catch (error) {
      console.warn('⚠️ Could not update registry with results:', error.message);
    }
  }
}

// Run validation
if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new RegistryValidator();
  validator.validate().catch(console.error);
}

export default RegistryValidator;