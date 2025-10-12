#!/usr/bin/env node

/**
 * Security Boundary Linter
 * Validates security configurations and agent boundary definitions
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

class SecurityBoundaryLinter {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.securityViolations = [];

    this.securityRules = {
      // Data classification rules
      dataClassification: {
        'restricted': {
          minAuthLevel: 'admin',
          requiredEncryption: true,
          auditRequired: true,
          agentAccess: false
        },
        'confidential': {
          minAuthLevel: 'user',
          requiredEncryption: true,
          auditRequired: true,
          agentAccess: 'limited'
        },
        'internal': {
          minAuthLevel: 'user',
          requiredEncryption: false,
          auditRequired: true,
          agentAccess: true
        },
        'public': {
          minAuthLevel: 'user',
          requiredEncryption: false,
          auditRequired: false,
          agentAccess: true
        }
      },

      // Agent capability restrictions
      agentCapabilities: {
        'restricted_data': {
          can_read: false,
          can_write: false,
          can_propose_changes: false
        },
        'confidential_data': {
          can_read: true,
          can_write: false,
          can_propose_changes: true,
          requires_approval: true
        }
      },

      // Critical security operations
      forbiddenOperations: [
        'bypass_security_controls',
        'modify_security_policies',
        'access_raw_authentication_tokens',
        'override_user_permissions',
        'disable_audit_logging',
        'modify_encryption_keys',
        'access_system_credentials'
      ],

      // Required security features by module type
      requiredSecurityByType: {
        'primitive': {
          audit_logging: true,
          encryption_in_transit: true,
          authentication_required: true
        },
        'security': {
          audit_logging: true,
          encryption_at_rest: true,
          encryption_in_transit: true,
          authentication_required: true,
          authorization_level: 'admin',
          input_validation: 'strict'
        },
        'agentic': {
          audit_logging: true,
          rate_limiting: true,
          input_validation: 'strict'
        }
      }
    };
  }

  lintFile(filePath) {
    console.log(`\nLinting security: ${filePath}`);

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

      if (!frontMatterMatch) {
        this.addError(filePath, 'No front-matter found');
        return false;
      }

      const frontMatter = yaml.load(frontMatterMatch[1]);

      return this.validateSecurityConfiguration(filePath, frontMatter) &&
             this.validateAgentBoundaries(filePath, frontMatter) &&
             this.validateDataClassification(filePath, frontMatter) &&
             this.validateComplianceRequirements(filePath, frontMatter) &&
             this.validateSecurityByType(filePath, frontMatter);

    } catch (error) {
      this.addError(filePath, `Parse error: ${error.message}`);
      return false;
    }
  }

  validateSecurityConfiguration(filePath, frontMatter) {
    let isValid = true;

    if (!frontMatter.security) {
      this.addError(filePath, 'Missing security configuration');
      return false;
    }

    const security = frontMatter.security;

    // Validate encryption requirements
    if (security.data_classification === 'restricted' || security.data_classification === 'confidential') {
      if (!security.encryption_at_rest) {
        this.addSecurityViolation(filePath, 'Sensitive data must be encrypted at rest');
        isValid = false;
      }
      if (!security.encryption_in_transit) {
        this.addSecurityViolation(filePath, 'Sensitive data must be encrypted in transit');
        isValid = false;
      }
    }

    // Validate authentication requirements
    if (!security.authentication_required && security.data_classification !== 'public') {
      this.addSecurityViolation(filePath, 'Authentication required for non-public data');
      isValid = false;
    }

    // Validate authorization level
    const authLevelHierarchy = ['user', 'admin', 'system'];
    const requiredAuthIndex = this.getRequiredAuthLevel(security.data_classification);
    const currentAuthIndex = authLevelHierarchy.indexOf(security.authorization_level);

    if (currentAuthIndex < requiredAuthIndex) {
      this.addSecurityViolation(filePath,
        `Authorization level too low for ${security.data_classification} data: ` +
        `${security.authorization_level} < ${authLevelHierarchy[requiredAuthIndex]}`
      );
      isValid = false;
    }

    // Validate audit logging
    if (security.data_classification !== 'public' && !security.audit_logging) {
      this.addSecurityViolation(filePath, 'Audit logging required for sensitive data');
      isValid = false;
    }

    // Validate input validation
    if (frontMatter.agent_accessible && security.input_validation !== 'strict') {
      this.addWarning(filePath, 'Agent-accessible modules should use strict input validation');
    }

    return isValid;
  }

  validateAgentBoundaries(filePath, frontMatter) {
    let isValid = true;

    if (!frontMatter.agent_boundaries) {
      this.addError(filePath, 'Missing agent_boundaries configuration');
      return false;
    }

    const boundaries = frontMatter.agent_boundaries;
    const capabilities = frontMatter.agent_capabilities;
    const security = frontMatter.security;

    // Check forbidden operations
    if (boundaries.allowed_operations) {
      for (const operation of boundaries.allowed_operations) {
        if (this.securityRules.forbiddenOperations.includes(operation)) {
          this.addSecurityViolation(filePath, `Forbidden operation in allowed list: ${operation}`);
          isValid = false;
        }
      }
    }

    // Validate consistency between capabilities and boundaries
    if (capabilities.can_write && security.data_classification === 'restricted') {
      this.addSecurityViolation(filePath, 'Agents cannot have write access to restricted data');
      isValid = false;
    }

    // Check escalation triggers
    if (!boundaries.escalation_triggers || boundaries.escalation_triggers.length === 0) {
      this.addWarning(filePath, 'No escalation triggers defined - consider adding security monitoring');
    }

    // Validate agent access to sensitive data
    if (frontMatter.agent_accessible && security.data_classification === 'restricted') {
      this.addSecurityViolation(filePath, 'Agents cannot access restricted data');
      isValid = false;
    }

    return isValid;
  }

  validateDataClassification(filePath, frontMatter) {
    let isValid = true;

    const security = frontMatter.security;
    if (!security.data_classification) {
      this.addError(filePath, 'Missing data_classification in security configuration');
      return false;
    }

    const classification = security.data_classification;
    const rules = this.securityRules.dataClassification[classification];

    if (!rules) {
      this.addError(filePath, `Invalid data classification: ${classification}`);
      return false;
    }

    // Validate agent access rules
    if (rules.agentAccess === false && frontMatter.agent_accessible) {
      this.addSecurityViolation(filePath,
        `Agents cannot access ${classification} data but agent_accessible is true`
      );
      isValid = false;
    }

    // Validate encryption requirements
    if (rules.requiredEncryption) {
      if (!security.encryption_at_rest) {
        this.addSecurityViolation(filePath,
          `${classification} data requires encryption at rest`
        );
        isValid = false;
      }
      if (!security.encryption_in_transit) {
        this.addSecurityViolation(filePath,
          `${classification} data requires encryption in transit`
        );
        isValid = false;
      }
    }

    // Validate audit requirements
    if (rules.auditRequired && !security.audit_logging) {
      this.addSecurityViolation(filePath,
        `${classification} data requires audit logging`
      );
      isValid = false;
    }

    return isValid;
  }

  validateComplianceRequirements(filePath, frontMatter) {
    let isValid = true;

    const moduleType = frontMatter.type;
    const security = frontMatter.security;

    // LGPD compliance checks
    if (this.handlesPersonalData(frontMatter)) {
      if (!security.audit_logging) {
        this.addSecurityViolation(filePath, 'LGPD compliance requires audit logging for personal data');
        isValid = false;
      }

      if (!this.hasDataSubjectRights(frontMatter)) {
        this.addWarning(filePath, 'Consider implementing data subject rights for LGPD compliance');
      }
    }

    // Financial regulation compliance
    if (this.handlesFinancialData(frontMatter)) {
      if (!security.encryption_at_rest) {
        this.addSecurityViolation(filePath, 'Financial data requires encryption at rest');
        isValid = false;
      }

      if (!security.rate_limiting) {
        this.addWarning(filePath, 'Financial modules should implement rate limiting');
      }
    }

    // PCI DSS compliance for payment data
    if (this.handlesPaymentData(frontMatter)) {
      if (security.data_classification !== 'restricted') {
        this.addSecurityViolation(filePath, 'Payment data must be classified as restricted');
        isValid = false;
      }

      if (!security.encryption_at_rest || !security.encryption_in_transit) {
        this.addSecurityViolation(filePath, 'PCI DSS requires encryption for payment data');
        isValid = false;
      }
    }

    return isValid;
  }

  validateSecurityByType(filePath, frontMatter) {
    let isValid = true;

    const moduleType = frontMatter.type;
    const security = frontMatter.security;
    const requirements = this.securityRules.requiredSecurityByType[moduleType];

    if (!requirements) {
      return true; // No specific requirements for this type
    }

    for (const [requirement, expectedValue] of Object.entries(requirements)) {
      const actualValue = security[requirement];

      if (typeof expectedValue === 'boolean' && actualValue !== expectedValue) {
        this.addSecurityViolation(filePath,
          `${moduleType} modules require ${requirement}: ${expectedValue}, got: ${actualValue}`
        );
        isValid = false;
      } else if (typeof expectedValue === 'string' && actualValue !== expectedValue) {
        this.addSecurityViolation(filePath,
          `${moduleType} modules require ${requirement}: ${expectedValue}, got: ${actualValue}`
        );
        isValid = false;
      }
    }

    return isValid;
  }

  getRequiredAuthLevel(dataClassification) {
    const authLevels = ['user', 'admin', 'system'];
    const rules = this.securityRules.dataClassification[dataClassification];
    return authLevels.indexOf(rules?.minAuthLevel || 'user');
  }

  handlesPersonalData(frontMatter) {
    const indicators = ['user_identity', 'personal', 'profile', 'account', 'identity'];
    const title = frontMatter.title?.toLowerCase() || '';
    const moduleId = frontMatter.module_id?.toLowerCase() || '';

    return indicators.some(indicator =>
      title.includes(indicator) || moduleId.includes(indicator)
    );
  }

  handlesFinancialData(frontMatter) {
    const indicators = ['transaction', 'bank', 'payment', 'financial', 'money', 'currency'];
    const title = frontMatter.title?.toLowerCase() || '';
    const moduleId = frontMatter.module_id?.toLowerCase() || '';

    return indicators.some(indicator =>
      title.includes(indicator) || moduleId.includes(indicator)
    );
  }

  handlesPaymentData(frontMatter) {
    const indicators = ['payment', 'card', 'pix', 'transaction', 'wallet'];
    const title = frontMatter.title?.toLowerCase() || '';
    const moduleId = frontMatter.module_id?.toLowerCase() || '';

    return indicators.some(indicator =>
      title.includes(indicator) || moduleId.includes(indicator)
    );
  }

  hasDataSubjectRights(frontMatter) {
    // Check if module mentions data subject rights implementation
    const integrations = frontMatter.integrations || [];
    const apiContracts = frontMatter.api_contracts || [];

    return integrations.some(integration =>
      integration.toLowerCase().includes('gdpr') ||
      integration.toLowerCase().includes('lgpd')
    ) || apiContracts.some(contract =>
      contract.toLowerCase().includes('data subject') ||
      contract.toLowerCase().includes('privacy')
    );
  }

  addError(filePath, message) {
    this.errors.push({ file: filePath, message, type: 'error' });
    console.log(`  ❌ ERROR: ${message}`);
  }

  addWarning(filePath, message) {
    this.warnings.push({ file: filePath, message, type: 'warning' });
    console.log(`  ⚠️  WARNING: ${message}`);
  }

  addSecurityViolation(filePath, message) {
    this.securityViolations.push({ file: filePath, message, type: 'security_violation' });
    console.log(`  🔒 SECURITY VIOLATION: ${message}`);
  }

  generateReport() {
    console.log('\n' + '='.repeat(80));
    console.log('SECURITY BOUNDARY LINTING REPORT');
    console.log('='.repeat(80));

    console.log(`\nErrors: ${this.errors.length}`);
    console.log(`Warnings: ${this.warnings.length}`);
    console.log(`Security Violations: ${this.securityViolations.length}`);

    if (this.securityViolations.length > 0) {
      console.log('\n🔒 SECURITY VIOLATIONS:');
      this.securityViolations.forEach(violation => {
        console.log(`  ${violation.file}: ${violation.message}`);
      });
    }

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

    // Security summary
    this.generateSecuritySummary();

    const hasSecurityIssues = this.securityViolations.length > 0 || this.errors.length > 0;

    if (!hasSecurityIssues && this.warnings.length === 0) {
      console.log('\n✅ All security boundaries are properly configured!');
    }

    return {
      success: !hasSecurityIssues,
      errors: this.errors,
      warnings: this.warnings,
      securityViolations: this.securityViolations
    };
  }

  generateSecuritySummary() {
    console.log('\n🛡️  SECURITY SUMMARY:');

    // Count modules by security level
    const securityStats = {
      restricted: 0,
      confidential: 0,
      internal: 0,
      public: 0,
      agentAccessible: 0,
      encryptedAtRest: 0,
      encryptedInTransit: 0,
      auditLogged: 0
    };

    // This would be populated during validation
    console.log('  Security configuration analysis complete');
    console.log(`  ${this.securityViolations.length} security violations found`);

    if (this.securityViolations.length === 0) {
      console.log('  ✅ No security violations detected');
    } else {
      console.log('  🚨 Security violations require immediate attention');
    }
  }
}

// Main execution
function main() {
  const linter = new SecurityBoundaryLinter();
  const obsidianDir = path.join(__dirname, '..');

  // Get all markdown files
  const files = fs.readdirSync(obsidianDir)
    .filter(file => file.endsWith('.md') && !file.startsWith('.'))
    .map(file => path.join(obsidianDir, file));

  console.log(`Found ${files.length} markdown files to lint`);

  let allValid = true;
  for (const file of files) {
    const isValid = linter.lintFile(file);
    if (!isValid) {
      allValid = false;
    }
  }

  const report = linter.generateReport();

  // Exit with error code if security violations found
  process.exit(report.success ? 0 : 1);
}

if (require.main === module) {
  main();
}

module.exports = SecurityBoundaryLinter;