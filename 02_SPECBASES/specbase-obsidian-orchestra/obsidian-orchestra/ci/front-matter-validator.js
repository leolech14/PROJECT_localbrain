#!/usr/bin/env node

/**
 * Front-Matter Validator
 * Validates front-matter structure and content across all specification files
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

class FrontMatterValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.requiredFields = [
      'title',
      'module_id',
      'type',
      'category',
      'lifecycle',
      'state',
      'seat',
      'phase_availability',
      'priority',
      'agent_accessible',
      'user_configurable',
      'promotion_gates',
      'observability',
      'security',
      'dependencies',
      'integrations',
      'api_contracts',
      'last_updated',
      'version',
      'maintainer',
      'agent_capabilities',
      'agent_boundaries'
    ];

    this.validEnums = {
      lifecycle: ['prep', 'dev', 'prod'],
      state: ['minimal', 'intermediate_i1', 'intermediate_i2', 'intermediate_i3', 'complete'],
      seat: ['mvp', 'scale', 'enterprise'],
      phase_availability: ['always', 'post_onboarding', 'advanced', 'enterprise'],
      priority: ['critical', 'high', 'medium', 'low'],
      type: ['structural', 'primitive', 'first_degree', 'default', 'advanced', 'backend', 'agentic', 'foundation', 'reference', 'technical', 'security'],
      category: ['structural', 'primitive', 'first_degree', 'default', 'advanced', 'backend', 'agentic', 'foundation', 'reference', 'technical', 'security', 'navigation'],
      authorization_level: ['user', 'admin', 'system'],
      data_classification: ['public', 'internal', 'confidential', 'restricted'],
      input_validation: ['strict', 'standard', 'basic']
    };
  }

  validateFile(filePath) {
    console.log(`\nValidating: ${filePath}`);

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

      if (!frontMatterMatch) {
        this.addError(filePath, 'No front-matter found');
        return false;
      }

      const frontMatter = yaml.load(frontMatterMatch[1]);

      return this.validateStructure(filePath, frontMatter) &&
             this.validateContent(filePath, frontMatter) &&
             this.validatePromotionGates(filePath, frontMatter) &&
             this.validateObservability(filePath, frontMatter) &&
             this.validateSecurity(filePath, frontMatter) &&
             this.validateAgentIntegration(filePath, frontMatter);

    } catch (error) {
      this.addError(filePath, `Parse error: ${error.message}`);
      return false;
    }
  }

  validateStructure(filePath, frontMatter) {
    let isValid = true;

    // Check required fields
    for (const field of this.requiredFields) {
      if (!(field in frontMatter)) {
        this.addError(filePath, `Missing required field: ${field}`);
        isValid = false;
      }
    }

    // Check field types
    if (frontMatter.title && typeof frontMatter.title !== 'string') {
      this.addError(filePath, 'title must be a string');
      isValid = false;
    }

    if (frontMatter.dependencies && !Array.isArray(frontMatter.dependencies)) {
      this.addError(filePath, 'dependencies must be an array');
      isValid = false;
    }

    if (frontMatter.integrations && !Array.isArray(frontMatter.integrations)) {
      this.addError(filePath, 'integrations must be an array');
      isValid = false;
    }

    return isValid;
  }

  validateContent(filePath, frontMatter) {
    let isValid = true;

    // Validate enum values
    for (const [field, validValues] of Object.entries(this.validEnums)) {
      if (frontMatter[field] && !validValues.includes(frontMatter[field])) {
        this.addError(filePath, `Invalid ${field}: ${frontMatter[field]}. Must be one of: ${validValues.join(', ')}`);
        isValid = false;
      }
    }

    // Validate type/category consistency
    if (frontMatter.type !== frontMatter.category &&
        !this.isValidTypeCategoryMismatch(frontMatter.type, frontMatter.category)) {
      this.addWarning(filePath, `Type and category mismatch: ${frontMatter.type} != ${frontMatter.category}`);
    }

    // Validate state progression
    if (!this.isValidStateProgression(frontMatter.state, frontMatter.lifecycle)) {
      this.addWarning(filePath, `State ${frontMatter.state} may not be appropriate for lifecycle ${frontMatter.lifecycle}`);
    }

    // Validate version format
    if (frontMatter.version && !/^\d+\.\d+\.\d+$/.test(frontMatter.version)) {
      this.addError(filePath, `Invalid version format: ${frontMatter.version}. Use semantic versioning (x.y.z)`);
      isValid = false;
    }

    return isValid;
  }

  validatePromotionGates(filePath, frontMatter) {
    let isValid = true;

    if (!frontMatter.promotion_gates || typeof frontMatter.promotion_gates !== 'object') {
      this.addError(filePath, 'promotion_gates must be an object');
      return false;
    }

    const requiredGates = ['to_intermediate_i1', 'to_intermediate_i2', 'to_intermediate_i3', 'to_complete'];
    for (const gate of requiredGates) {
      if (!frontMatter.promotion_gates[gate]) {
        this.addError(filePath, `Missing promotion gate: ${gate}`);
        isValid = false;
      } else if (!Array.isArray(frontMatter.promotion_gates[gate])) {
        this.addError(filePath, `Promotion gate ${gate} must be an array`);
        isValid = false;
      }
    }

    return isValid;
  }

  validateObservability(filePath, frontMatter) {
    let isValid = true;

    if (!frontMatter.observability || typeof frontMatter.observability !== 'object') {
      this.addError(filePath, 'observability must be an object');
      return false;
    }

    const requiredObservabilityFields = ['metrics', 'alerts', 'dashboards'];
    for (const field of requiredObservabilityFields) {
      if (!frontMatter.observability[field]) {
        this.addError(filePath, `Missing observability field: ${field}`);
        isValid = false;
      } else if (!Array.isArray(frontMatter.observability[field])) {
        this.addError(filePath, `Observability field ${field} must be an array`);
        isValid = false;
      }
    }

    return isValid;
  }

  validateSecurity(filePath, frontMatter) {
    let isValid = true;

    if (!frontMatter.security || typeof frontMatter.security !== 'object') {
      this.addError(filePath, 'security must be an object');
      return false;
    }

    const requiredSecurityFields = [
      'authentication_required',
      'authorization_level',
      'data_classification',
      'encryption_at_rest',
      'encryption_in_transit',
      'audit_logging',
      'rate_limiting',
      'input_validation'
    ];

    for (const field of requiredSecurityFields) {
      if (!(field in frontMatter.security)) {
        this.addError(filePath, `Missing security field: ${field}`);
        isValid = false;
      }
    }

    // Validate boolean fields
    const booleanFields = ['authentication_required', 'encryption_at_rest', 'encryption_in_transit', 'audit_logging', 'rate_limiting'];
    for (const field of booleanFields) {
      if (field in frontMatter.security && typeof frontMatter.security[field] !== 'boolean') {
        this.addError(filePath, `Security field ${field} must be boolean`);
        isValid = false;
      }
    }

    return isValid;
  }

  validateAgentIntegration(filePath, frontMatter) {
    let isValid = true;

    if (!frontMatter.agent_capabilities || typeof frontMatter.agent_capabilities !== 'object') {
      this.addError(filePath, 'agent_capabilities must be an object');
      return false;
    }

    if (!frontMatter.agent_boundaries || typeof frontMatter.agent_boundaries !== 'object') {
      this.addError(filePath, 'agent_boundaries must be an object');
      return false;
    }

    const requiredCapabilityFields = ['can_read', 'can_write', 'can_propose_changes', 'requires_approval'];
    for (const field of requiredCapabilityFields) {
      if (!(field in frontMatter.agent_capabilities)) {
        this.addError(filePath, `Missing agent capability field: ${field}`);
        isValid = false;
      } else if (typeof frontMatter.agent_capabilities[field] !== 'boolean') {
        this.addError(filePath, `Agent capability ${field} must be boolean`);
        isValid = false;
      }
    }

    const requiredBoundaryFields = ['allowed_operations', 'forbidden_operations', 'escalation_triggers'];
    for (const field of requiredBoundaryFields) {
      if (!frontMatter.agent_boundaries[field]) {
        this.addError(filePath, `Missing agent boundary field: ${field}`);
        isValid = false;
      } else if (!Array.isArray(frontMatter.agent_boundaries[field])) {
        this.addError(filePath, `Agent boundary ${field} must be an array`);
        isValid = false;
      }
    }

    return isValid;
  }

  isValidTypeCategoryMismatch(type, category) {
    // Allow some specific valid mismatches
    const validMismatches = [
      { type: 'index', category: 'navigation' },
      { type: 'process', category: 'process' }
    ];

    return validMismatches.some(mismatch =>
      mismatch.type === type && mismatch.category === category
    );
  }

  isValidStateProgression(state, lifecycle) {
    const validProgressions = {
      'prep': ['minimal', 'intermediate_i1'],
      'dev': ['minimal', 'intermediate_i1', 'intermediate_i2', 'intermediate_i3'],
      'prod': ['intermediate_i3', 'complete']
    };

    return validProgressions[lifecycle]?.includes(state) ?? false;
  }

  addError(filePath, message) {
    this.errors.push({ file: filePath, message, type: 'error' });
    console.log(`  ❌ ERROR: ${message}`);
  }

  addWarning(filePath, message) {
    this.warnings.push({ file: filePath, message, type: 'warning' });
    console.log(`  ⚠️  WARNING: ${message}`);
  }

  generateReport() {
    console.log('\n' + '='.repeat(80));
    console.log('FRONT-MATTER VALIDATION REPORT');
    console.log('='.repeat(80));

    console.log(`\nErrors: ${this.errors.length}`);
    console.log(`Warnings: ${this.warnings.length}`);

    if (this.errors.length > 0) {
      console.log('\n🔴 ERRORS:');
      this.errors.forEach(error => {
        console.log(`  ${error.file}: ${error.message}`);
      });
    }

    if (this.warnings.length > 0) {
      console.log('\n🟡 WARNINGS:');
      this.warnings.forEach(warning => {
        console.log(`  ${warning.file}: ${warning.message}`);
      });
    }

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('\n✅ All files passed validation!');
    }

    return {
      success: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings
    };
  }
}

// Main execution
function main() {
  const validator = new FrontMatterValidator();
  const obsidianDir = path.join(__dirname, '..');

  // Get all markdown files
  const files = fs.readdirSync(obsidianDir)
    .filter(file => file.endsWith('.md') && !file.startsWith('.'))
    .map(file => path.join(obsidianDir, file));

  console.log(`Found ${files.length} markdown files to validate`);

  let allValid = true;
  for (const file of files) {
    const isValid = validator.validateFile(file);
    if (!isValid) {
      allValid = false;
    }
  }

  const report = validator.generateReport();

  // Exit with error code if validation failed
  process.exit(report.success ? 0 : 1);
}

if (require.main === module) {
  main();
}

module.exports = FrontMatterValidator;