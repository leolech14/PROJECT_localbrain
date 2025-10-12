#!/usr/bin/env node

/**
 * Comprehensive Validation Suite
 * Runs all validation checks for the Financial Intelligence Platform specifications
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

class ValidationSuite {
  constructor() {
    this.results = {};
    this.overallSuccess = true;
  }

  async runValidation() {
    console.log('🚀 Starting Financial Intelligence Platform Specification Validation');
    console.log('='.repeat(80));

    try {
      // Run all validation checks
      await this.runFrontMatterValidation();
      await this.runPromotionGateCheck();
      await this.runSecurityBoundaryLinting();
      await this.runArchitectureConsistencyCheck();
      await this.runRAGIndexGeneration();

      // Generate comprehensive report
      this.generateFinalReport();

    } catch (error) {
      console.error('❌ Validation suite failed:', error.message);
      this.overallSuccess = false;
    }

    process.exit(this.overallSuccess ? 0 : 1);
  }

  async runFrontMatterValidation() {
    console.log('\n📋 Running Front-Matter Validation...');
    const result = await this.runScript('front-matter-validator.js');
    this.results.frontMatter = result;

    if (!result.success) {
      console.log('❌ Front-matter validation failed');
      this.overallSuccess = false;
    } else {
      console.log('✅ Front-matter validation passed');
    }
  }

  async runPromotionGateCheck() {
    console.log('\n🚪 Running Promotion Gate Validation...');
    const result = await this.runScript('promotion-gate-checker.js');
    this.results.promotionGates = result;

    if (!result.success) {
      console.log('❌ Promotion gate validation failed');
      this.overallSuccess = false;
    } else {
      console.log('✅ Promotion gate validation passed');
    }
  }

  async runSecurityBoundaryLinting() {
    console.log('\n🔒 Running Security Boundary Linting...');
    const result = await this.runScript('security-boundary-linter.js');
    this.results.securityBoundaries = result;

    if (!result.success) {
      console.log('❌ Security boundary linting failed');
      this.overallSuccess = false;
    } else {
      console.log('✅ Security boundary linting passed');
    }
  }

  async runArchitectureConsistencyCheck() {
    console.log('\n🏗️  Running Architecture Consistency Check...');

    try {
      // Check cross-references
      const crossRefResult = await this.validateCrossReferences();
      this.results.crossReferences = crossRefResult;

      // Check module numbering
      const numberingResult = await this.validateModuleNumbering();
      this.results.moduleNumbering = numberingResult;

      // Check dependency graph
      const dependencyResult = await this.validateDependencyGraph();
      this.results.dependencies = dependencyResult;

      const architectureSuccess = crossRefResult.success &&
                                 numberingResult.success &&
                                 dependencyResult.success;

      if (!architectureSuccess) {
        console.log('❌ Architecture consistency check failed');
        this.overallSuccess = false;
      } else {
        console.log('✅ Architecture consistency check passed');
      }

    } catch (error) {
      console.log(`❌ Architecture check error: ${error.message}`);
      this.overallSuccess = false;
    }
  }

  async runRAGIndexGeneration() {
    console.log('\n🧠 Generating RAG Index for AI Agents...');

    try {
      const ragResult = await this.generateRAGIndex();
      this.results.ragIndex = ragResult;

      if (!ragResult.success) {
        console.log('⚠️  RAG index generation had issues (non-blocking)');
      } else {
        console.log('✅ RAG index generated successfully');
      }

    } catch (error) {
      console.log(`⚠️  RAG index generation error: ${error.message} (non-blocking)`);
    }
  }

  async runScript(scriptName) {
    return new Promise((resolve) => {
      const scriptPath = path.join(__dirname, scriptName);
      const child = spawn('node', [scriptPath], {
        stdio: 'pipe',
        cwd: __dirname
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        // Log output
        if (stdout) console.log(stdout);
        if (stderr) console.error(stderr);

        resolve({
          success: code === 0,
          exitCode: code,
          stdout,
          stderr
        });
      });
    });
  }

  async validateCrossReferences() {
    console.log('  🔗 Checking cross-references...');

    const obsidianDir = path.join(__dirname, '..');
    const files = fs.readdirSync(obsidianDir)
      .filter(file => file.endsWith('.md') && !file.startsWith('.'));

    const issues = [];
    const moduleIds = new Set();

    // First pass: collect all module IDs
    for (const file of files) {
      try {
        const content = fs.readFileSync(path.join(obsidianDir, file), 'utf8');
        const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (frontMatterMatch) {
          const yaml = require('js-yaml');
          const frontMatter = yaml.load(frontMatterMatch[1]);
          if (frontMatter.module_id) {
            moduleIds.add(frontMatter.module_id);
          }
        }
      } catch (error) {
        issues.push(`Error reading ${file}: ${error.message}`);
      }
    }

    // Second pass: validate references
    for (const file of files) {
      try {
        const content = fs.readFileSync(path.join(obsidianDir, file), 'utf8');

        // Find markdown links
        const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
        let match;

        while ((match = linkPattern.exec(content)) !== null) {
          const linkText = match[1];
          const linkTarget = match[2];

          // Check if it's a local markdown file reference
          if (linkTarget.endsWith('.md')) {
            const targetFile = linkTarget.replace(/^\.\//, '');
            if (!files.includes(targetFile)) {
              issues.push(`${file}: Broken link to ${linkTarget}`);
            }
          }
        }
      } catch (error) {
        issues.push(`Error validating references in ${file}: ${error.message}`);
      }
    }

    return {
      success: issues.length === 0,
      issues,
      totalModules: moduleIds.size
    };
  }

  async validateModuleNumbering() {
    console.log('  🔢 Checking module numbering...');

    const obsidianDir = path.join(__dirname, '..');
    const files = fs.readdirSync(obsidianDir)
      .filter(file => file.endsWith('.md') && !file.startsWith('.') && /^\d{1,2}_/.test(file))
      .sort();

    const issues = [];
    const numberRanges = {
      structural: [0, 9],
      primitive: [10, 19],
      first_degree: [20, 29],
      default: [30, 39],
      advanced: [40, 49],
      backend: [50, 59],
      agentic: [60, 69],
      foundation: [70, 79],
      reference: [80, 89],
      technical: [90, 99]
    };

    for (const file of files) {
      try {
        const number = parseInt(file.split('_')[0]);
        const content = fs.readFileSync(path.join(obsidianDir, file), 'utf8');
        const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

        if (frontMatterMatch) {
          const yaml = require('js-yaml');
          const frontMatter = yaml.load(frontMatterMatch[1]);
          const category = frontMatter.category;

          if (category && numberRanges[category]) {
            const [min, max] = numberRanges[category];
            if (number < min || number > max) {
              issues.push(`${file}: Number ${number} not in range ${min}-${max} for category ${category}`);
            }
          }
        }
      } catch (error) {
        issues.push(`Error checking numbering for ${file}: ${error.message}`);
      }
    }

    return {
      success: issues.length === 0,
      issues,
      totalFiles: files.length
    };
  }

  async validateDependencyGraph() {
    console.log('  📊 Checking dependency graph...');

    const obsidianDir = path.join(__dirname, '..');
    const files = fs.readdirSync(obsidianDir)
      .filter(file => file.endsWith('.md') && !file.startsWith('.'));

    const modules = new Map();
    const issues = [];

    // Build dependency graph
    for (const file of files) {
      try {
        const content = fs.readFileSync(path.join(obsidianDir, file), 'utf8');
        const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

        if (frontMatterMatch) {
          const yaml = require('js-yaml');
          const frontMatter = yaml.load(frontMatterMatch[1]);

          modules.set(frontMatter.module_id, {
            file,
            dependencies: frontMatter.dependencies || [],
            integrations: frontMatter.integrations || []
          });
        }
      } catch (error) {
        issues.push(`Error parsing ${file}: ${error.message}`);
      }
    }

    // Validate dependencies exist
    for (const [moduleId, moduleData] of modules) {
      for (const dependency of moduleData.dependencies) {
        if (!modules.has(dependency)) {
          issues.push(`${moduleData.file}: Dependency ${dependency} not found`);
        }
      }
    }

    // Check for circular dependencies (basic check)
    for (const [moduleId, moduleData] of modules) {
      if (this.hasCircularDependency(moduleId, modules, new Set())) {
        issues.push(`${moduleData.file}: Circular dependency detected for ${moduleId}`);
      }
    }

    return {
      success: issues.length === 0,
      issues,
      totalModules: modules.size
    };
  }

  hasCircularDependency(moduleId, modules, visited) {
    if (visited.has(moduleId)) {
      return true;
    }

    const module = modules.get(moduleId);
    if (!module) {
      return false;
    }

    visited.add(moduleId);

    for (const dependency of module.dependencies) {
      if (this.hasCircularDependency(dependency, modules, new Set(visited))) {
        return true;
      }
    }

    return false;
  }

  async generateRAGIndex() {
    console.log('  🧠 Generating RAG index...');

    const obsidianDir = path.join(__dirname, '..');
    const ragIndexPath = path.join(obsidianDir, 'rag-index.json');

    try {
      const files = fs.readdirSync(obsidianDir)
        .filter(file => file.endsWith('.md') && !file.startsWith('.'));

      const ragIndex = {
        generated_at: new Date().toISOString(),
        total_modules: files.length,
        modules: []
      };

      for (const file of files) {
        try {
          const content = fs.readFileSync(path.join(obsidianDir, file), 'utf8');
          const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

          if (frontMatterMatch) {
            const yaml = require('js-yaml');
            const frontMatter = yaml.load(frontMatterMatch[1]);
            const contentWithoutFrontMatter = content.replace(/^---\n[\s\S]*?\n---\n/, '');

            ragIndex.modules.push({
              file,
              module_id: frontMatter.module_id,
              title: frontMatter.title,
              type: frontMatter.type,
              category: frontMatter.category,
              state: frontMatter.state,
              lifecycle: frontMatter.lifecycle,
              dependencies: frontMatter.dependencies || [],
              integrations: frontMatter.integrations || [],
              content_summary: this.extractSummary(contentWithoutFrontMatter),
              searchable_content: this.extractSearchableContent(contentWithoutFrontMatter)
            });
          }
        } catch (error) {
          console.log(`  ⚠️  Error processing ${file} for RAG index: ${error.message}`);
        }
      }

      fs.writeFileSync(ragIndexPath, JSON.stringify(ragIndex, null, 2));

      return {
        success: true,
        indexPath: ragIndexPath,
        moduleCount: ragIndex.modules.length
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  extractSummary(content) {
    // Extract the Purpose section or first paragraph
    const purposeMatch = content.match(/## Purpose\n(.*?)(?=\n##|\n$)/s);
    if (purposeMatch) {
      return purposeMatch[1].trim().substring(0, 500);
    }

    // Fallback to first paragraph
    const paragraphs = content.split('\n\n');
    for (const paragraph of paragraphs) {
      if (paragraph.trim() && !paragraph.startsWith('#')) {
        return paragraph.trim().substring(0, 500);
      }
    }

    return '';
  }

  extractSearchableContent(content) {
    // Remove markdown syntax and extract key terms
    return content
      .replace(/#{1,6}\s*/g, '') // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/`(.*?)`/g, '$1') // Remove inline code
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Extract link text
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .trim()
      .substring(0, 2000); // Limit length
  }

  generateFinalReport() {
    console.log('\n' + '='.repeat(80));
    console.log('COMPREHENSIVE VALIDATION REPORT');
    console.log('='.repeat(80));

    console.log(`\nOverall Status: ${this.overallSuccess ? '✅ PASSED' : '❌ FAILED'}`);

    // Summary of each validation
    this.printValidationSummary('Front-Matter Validation', this.results.frontMatter);
    this.printValidationSummary('Promotion Gate Validation', this.results.promotionGates);
    this.printValidationSummary('Security Boundary Linting', this.results.securityBoundaries);
    this.printValidationSummary('Cross-References', this.results.crossReferences);
    this.printValidationSummary('Module Numbering', this.results.moduleNumbering);
    this.printValidationSummary('Dependency Graph', this.results.dependencies);
    this.printValidationSummary('RAG Index Generation', this.results.ragIndex);

    // Recommendations
    if (!this.overallSuccess) {
      console.log('\n🔧 RECOMMENDATIONS:');
      console.log('1. Fix all errors before proceeding with implementation');
      console.log('2. Address security violations immediately');
      console.log('3. Update front-matter to match the systematic framework');
      console.log('4. Ensure promotion gates are well-defined and measurable');
      console.log('5. Validate all cross-references and dependencies');
    } else {
      console.log('\n🎉 CONGRATULATIONS!');
      console.log('All validations passed. The specification is ready for implementation.');
    }

    console.log('\n📊 VALIDATION METRICS:');
    const totalChecks = Object.keys(this.results).length;
    const passedChecks = Object.values(this.results).filter(r => r?.success).length;
    console.log(`  Total Checks: ${totalChecks}`);
    console.log(`  Passed: ${passedChecks}`);
    console.log(`  Failed: ${totalChecks - passedChecks}`);
    console.log(`  Success Rate: ${((passedChecks / totalChecks) * 100).toFixed(1)}%`);
  }

  printValidationSummary(name, result) {
    if (!result) {
      console.log(`\n${name}: ⏭️  SKIPPED`);
      return;
    }

    const status = result.success ? '✅ PASSED' : '❌ FAILED';
    console.log(`\n${name}: ${status}`);

    if (result.issues && result.issues.length > 0) {
      console.log(`  Issues: ${result.issues.length}`);
    }

    if (result.errors && result.errors.length > 0) {
      console.log(`  Errors: ${result.errors.length}`);
    }

    if (result.warnings && result.warnings.length > 0) {
      console.log(`  Warnings: ${result.warnings.length}`);
    }

    if (result.securityViolations && result.securityViolations.length > 0) {
      console.log(`  Security Violations: ${result.securityViolations.length}`);
    }
  }
}

// Main execution
async function main() {
  const suite = new ValidationSuite();
  await suite.runValidation();
}

if (require.main === module) {
  main();
}

module.exports = ValidationSuite;