#!/usr/bin/env node

/**
 * Promotion Gate Checker
 * Validates promotion gate criteria and state progression logic
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

class PromotionGateChecker {
  constructor() {
    this.results = [];
    this.errors = [];
    this.warnings = [];
    this.stateHierarchy = [
      'minimal',
      'intermediate_i1',
      'intermediate_i2',
      'intermediate_i3',
      'complete'
    ];
  }

  checkFile(filePath) {
    console.log(`\nChecking promotion gates: ${filePath}`);

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

      if (!frontMatterMatch) {
        this.addError(filePath, 'No front-matter found');
        return false;
      }

      const frontMatter = yaml.load(frontMatterMatch[1]);

      return this.validatePromotionGates(filePath, frontMatter) &&
             this.validateStateProgression(filePath, frontMatter) &&
             this.validateGateCriteria(filePath, frontMatter) &&
             this.checkContentAlignment(filePath, frontMatter, content);

    } catch (error) {
      this.addError(filePath, `Parse error: ${error.message}`);
      return false;
    }
  }

  validatePromotionGates(filePath, frontMatter) {
    let isValid = true;

    if (!frontMatter.promotion_gates) {
      this.addError(filePath, 'Missing promotion_gates section');
      return false;
    }

    const currentState = frontMatter.state;
    const currentStateIndex = this.stateHierarchy.indexOf(currentState);

    if (currentStateIndex === -1) {
      this.addError(filePath, `Invalid current state: ${currentState}`);
      return false;
    }

    // Check that all required promotion gates exist
    const requiredGates = [];
    for (let i = currentStateIndex + 1; i < this.stateHierarchy.length; i++) {
      requiredGates.push(`to_${this.stateHierarchy[i]}`);
    }

    for (const gate of requiredGates) {
      if (!frontMatter.promotion_gates[gate]) {
        this.addError(filePath, `Missing promotion gate: ${gate}`);
        isValid = false;
      } else if (!Array.isArray(frontMatter.promotion_gates[gate])) {
        this.addError(filePath, `Promotion gate ${gate} must be an array of criteria`);
        isValid = false;
      } else if (frontMatter.promotion_gates[gate].length === 0) {
        this.addWarning(filePath, `Promotion gate ${gate} has no criteria`);
      }
    }

    // Check for unnecessary gates
    const unnecessaryGates = [];
    for (let i = 0; i <= currentStateIndex; i++) {
      const gateName = `to_${this.stateHierarchy[i]}`;
      if (frontMatter.promotion_gates[gateName]) {
        unnecessaryGates.push(gateName);
      }
    }

    if (unnecessaryGates.length > 0) {
      this.addWarning(filePath, `Unnecessary promotion gates for completed states: ${unnecessaryGates.join(', ')}`);
    }

    return isValid;
  }

  validateStateProgression(filePath, frontMatter) {
    let isValid = true;

    const lifecycle = frontMatter.lifecycle;
    const state = frontMatter.state;
    const seat = frontMatter.seat;

    // Validate lifecycle-state alignment
    const validStatesByLifecycle = {
      'prep': ['minimal', 'intermediate_i1'],
      'dev': ['minimal', 'intermediate_i1', 'intermediate_i2', 'intermediate_i3'],
      'prod': ['intermediate_i3', 'complete']
    };

    if (!validStatesByLifecycle[lifecycle]?.includes(state)) {
      this.addError(filePath, `State ${state} is not valid for lifecycle ${lifecycle}`);
      isValid = false;
    }

    // Validate seat-state alignment
    const minStatesBySeat = {
      'mvp': 'minimal',
      'scale': 'intermediate_i2',
      'enterprise': 'intermediate_i3'
    };

    const minStateIndex = this.stateHierarchy.indexOf(minStatesBySeat[seat]);
    const currentStateIndex = this.stateHierarchy.indexOf(state);

    if (currentStateIndex < minStateIndex) {
      this.addWarning(filePath, `State ${state} may be insufficient for seat ${seat} (minimum: ${minStatesBySeat[seat]})`);
    }

    return isValid;
  }

  validateGateCriteria(filePath, frontMatter) {
    let isValid = true;

    const promotionGates = frontMatter.promotion_gates;
    const moduleType = frontMatter.type;

    for (const [gateName, criteria] of Object.entries(promotionGates)) {
      if (!Array.isArray(criteria)) continue;

      // Check for quality criteria
      for (const criterion of criteria) {
        if (typeof criterion !== 'string') {
          this.addError(filePath, `Invalid criterion type in ${gateName}: must be string`);
          isValid = false;
          continue;
        }

        // Validate criterion quality
        if (criterion.length < 10) {
          this.addWarning(filePath, `Vague criterion in ${gateName}: "${criterion}"`);
        }

        // Check for measurable criteria
        if (!this.isMeasurableCriterion(criterion)) {
          this.addWarning(filePath, `Non-measurable criterion in ${gateName}: "${criterion}"`);
        }

        // Check for module-specific criteria
        if (!this.isRelevantForModuleType(criterion, moduleType)) {
          this.addWarning(filePath, `Possibly irrelevant criterion for ${moduleType} module in ${gateName}: "${criterion}"`);
        }
      }
    }

    return isValid;
  }

  checkContentAlignment(filePath, frontMatter, content) {
    let isValid = true;

    // Check for state progression scaffolding in content
    const hasStateScaffolding = content.includes('## State Progression Scaffolding');
    if (!hasStateScaffolding) {
      this.addError(filePath, 'Missing state progression scaffolding in content');
      isValid = false;
    }

    // Check for current state documentation
    const currentState = frontMatter.state;
    const currentStatePattern = new RegExp(`### Current State: ${currentState}`, 'i');
    if (!currentStatePattern.test(content)) {
      this.addWarning(filePath, `Current state (${currentState}) not documented in content`);
    }

    // Check for promotion gate alignment with content
    const promotionGates = frontMatter.promotion_gates;
    for (const [gateName, criteria] of Object.entries(promotionGates)) {
      if (!Array.isArray(criteria)) continue;

      const targetState = gateName.replace('to_', '');
      const statePattern = new RegExp(`### ${targetState.charAt(0).toUpperCase() + targetState.slice(1)} State`, 'i');

      if (!statePattern.test(content)) {
        this.addWarning(filePath, `Target state ${targetState} not documented in content`);
      }
    }

    return isValid;
  }

  isMeasurableCriterion(criterion) {
    const measurableIndicators = [
      'implemented', 'operational', 'completed', 'achieved', 'working', 'functional',
      'passed', 'verified', 'validated', 'tested', 'compliance', 'met', 'active',
      'deployed', 'integrated', 'optimized', 'polished', 'established'
    ];

    return measurableIndicators.some(indicator =>
      criterion.toLowerCase().includes(indicator)
    );
  }

  isRelevantForModuleType(criterion, moduleType) {
    const typeSpecificKeywords = {
      'structural': ['layout', 'navigation', 'responsive', 'component', 'ui', 'interface'],
      'primitive': ['substrate', 'foundation', 'core', 'essential', 'fundamental'],
      'security': ['audit', 'compliance', 'encryption', 'authentication', 'authorization'],
      'agentic': ['agent', 'federation', 'orchestration', 'coordination', 'collaboration'],
      'backend': ['api', 'service', 'engine', 'processing', 'data', 'integration'],
      'advanced': ['analytics', 'intelligence', 'optimization', 'forecasting', 'prediction']
    };

    if (!typeSpecificKeywords[moduleType]) {
      return true; // Unknown type, assume relevant
    }

    return typeSpecificKeywords[moduleType].some(keyword =>
      criterion.toLowerCase().includes(keyword)
    ) || this.hasGenericCriteria(criterion);
  }

  hasGenericCriteria(criterion) {
    const genericKeywords = [
      'implemented', 'operational', 'tested', 'validated', 'compliance',
      'security', 'performance', 'user', 'production', 'complete'
    ];

    return genericKeywords.some(keyword =>
      criterion.toLowerCase().includes(keyword)
    );
  }

  analyzePromotionReadiness(filePath, frontMatter) {
    const currentState = frontMatter.state;
    const currentStateIndex = this.stateHierarchy.indexOf(currentState);

    if (currentStateIndex === -1 || currentStateIndex >= this.stateHierarchy.length - 1) {
      return null; // Invalid state or already at highest state
    }

    const nextState = this.stateHierarchy[currentStateIndex + 1];
    const nextGate = `to_${nextState}`;
    const criteria = frontMatter.promotion_gates?.[nextGate];

    if (!criteria || !Array.isArray(criteria)) {
      return null;
    }

    const analysis = {
      currentState,
      nextState,
      totalCriteria: criteria.length,
      readinessScore: this.calculateReadinessScore(criteria),
      blockers: this.identifyBlockers(criteria),
      recommendations: this.generateRecommendations(criteria)
    };

    console.log(`  📊 Promotion Readiness Analysis:`);
    console.log(`     Current: ${currentState} → Next: ${nextState}`);
    console.log(`     Criteria: ${analysis.totalCriteria}`);
    console.log(`     Readiness: ${(analysis.readinessScore * 100).toFixed(1)}%`);

    return analysis;
  }

  calculateReadinessScore(criteria) {
    // Simple heuristic based on criterion quality and measurability
    let score = 0;
    for (const criterion of criteria) {
      if (this.isMeasurableCriterion(criterion)) {
        score += 1;
      } else {
        score += 0.5; // Partial credit for non-measurable criteria
      }
    }
    return Math.min(score / criteria.length, 1.0);
  }

  identifyBlockers(criteria) {
    return criteria.filter(criterion =>
      !this.isMeasurableCriterion(criterion) || criterion.includes('TBD') || criterion.includes('TODO')
    );
  }

  generateRecommendations(criteria) {
    const recommendations = [];

    for (const criterion of criteria) {
      if (!this.isMeasurableCriterion(criterion)) {
        recommendations.push(`Make criterion more specific and measurable: "${criterion}"`);
      }
    }

    return recommendations;
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
    console.log('PROMOTION GATE VALIDATION REPORT');
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

    // Generate promotion readiness summary
    this.generatePromotionSummary();

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('\n✅ All promotion gates are properly configured!');
    }

    return {
      success: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
      results: this.results
    };
  }

  generatePromotionSummary() {
    console.log('\n📈 PROMOTION READINESS SUMMARY:');

    const stateDistribution = {};
    this.results.forEach(result => {
      const state = result.currentState || 'unknown';
      stateDistribution[state] = (stateDistribution[state] || 0) + 1;
    });

    for (const [state, count] of Object.entries(stateDistribution)) {
      console.log(`  ${state}: ${count} modules`);
    }

    const readyForPromotion = this.results.filter(r =>
      r.readinessScore && r.readinessScore > 0.8
    );

    if (readyForPromotion.length > 0) {
      console.log(`\n🚀 ${readyForPromotion.length} modules ready for promotion:`);
      readyForPromotion.forEach(result => {
        console.log(`  ${result.file}: ${result.currentState} → ${result.nextState}`);
      });
    }
  }
}

// Main execution
function main() {
  const checker = new PromotionGateChecker();
  const obsidianDir = path.join(__dirname, '..');

  // Get all markdown files
  const files = fs.readdirSync(obsidianDir)
    .filter(file => file.endsWith('.md') && !file.startsWith('.'))
    .map(file => path.join(obsidianDir, file));

  console.log(`Found ${files.length} markdown files to check`);

  let allValid = true;
  for (const file of files) {
    const isValid = checker.checkFile(file);
    if (!isValid) {
      allValid = false;
    }

    // Analyze promotion readiness
    try {
      const content = fs.readFileSync(file, 'utf8');
      const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (frontMatterMatch) {
        const frontMatter = yaml.load(frontMatterMatch[1]);
        const analysis = checker.analyzePromotionReadiness(file, frontMatter);
        if (analysis) {
          checker.results.push({ file, ...analysis });
        }
      }
    } catch (error) {
      // Error already logged in checkFile
    }
  }

  const report = checker.generateReport();

  // Exit with error code if validation failed
  process.exit(report.success ? 0 : 1);
}

if (require.main === module) {
  main();
}

module.exports = PromotionGateChecker;