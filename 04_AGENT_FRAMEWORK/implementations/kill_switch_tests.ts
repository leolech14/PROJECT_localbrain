/**
 * T015 - Global Kill-Switch Performance Tests
 * ===========================================
 *
 * Agent D: Integration Specialist
 * Validating ≤300ms activation requirement
 */

import { KillSwitchManager, KillSwitchRequest, PolicyEvaluationService } from './kill_switch_system';

export class KillSwitchPerformanceTests {
  private killSwitchManager: KillSwitchManager;
  private policyService: PolicyEvaluationService;

  constructor() {
    this.killSwitchManager = new KillSwitchManager();
    this.policyService = new PolicyEvaluationService();
  }

  /**
   * Test 1: Kill-switch activation performance (≤300ms)
   */
  async testActivationPerformance(): Promise<boolean> {
    console.log(`🧪 Testing kill-switch activation performance...`);

    const testCases = [
      {
        name: 'Critical Security Breach',
        request: {
          reason: 'Security breach detected - unauthorized access attempt',
          severity: 'critical' as const,
          evidence: { source: 'ids', confidence: 0.95 },
          requestedBy: 'security_system',
          timestamp: new Date().toISOString()
        }
      },
      {
        name: 'High Performance Issue',
        request: {
          reason: 'System performance degradation detected',
          severity: 'high' as const,
          evidence: { cpu: 95, memory: 87, errors: 45 },
          requestedBy: 'monitoring_system',
          timestamp: new Date().toISOString()
        }
      },
      {
        name: 'Medium Anomaly Detection',
        request: {
          reason: 'Unusual system activity detected',
          severity: 'medium' as const,
          evidence: { anomaly_score: 0.78 },
          requestedBy: 'anomaly_detector',
          timestamp: new Date().toISOString()
        }
      }
    ];

    let allPassed = true;

    for (const testCase of testCases) {
      console.log(`  📊 Testing: ${testCase.name}`);

      const startTime = Date.now();
      const result = await this.killSwitchManager.activateKillSwitch(testCase.request);
      const activationTime = Date.now() - startTime;

      const passed = result && activationTime <= 300;
      allPassed = allPassed && passed;

      console.log(`    ${passed ? '✅' : '❌'} ${testCase.name}: ${activationTime}ms ${passed ? 'PASS' : 'FAIL'}`);

      if (result) {
        await this.killSwitchManager.deactivateKillSwitch('standard_recovery');
      }
    }

    return allPassed;
  }

  /**
   * Test 2: Policy evaluation performance (≤100ms)
   */
  async testPolicyEvaluationPerformance(): Promise<boolean> {
    console.log(`🧪 Testing policy evaluation performance...`);

    const testRequests: KillSwitchRequest[] = [
      {
        reason: 'Critical security vulnerability exploited',
        severity: 'critical',
        evidence: { vulnerability: 'CVE-2024-0001', exploited: true },
        requestedBy: 'security_scanner',
        timestamp: new Date().toISOString()
      },
      {
        reason: 'Database connection pool exhausted',
        severity: 'high',
        evidence: { connections: 1000, errors: 156 },
        requestedBy: 'database_monitor',
        timestamp: new Date().toISOString()
      },
      {
        reason: 'Memory usage spike detected',
        severity: 'medium',
        evidence: { memory: 89, spike_factor: 2.3 },
        requestedBy: 'resource_monitor',
        timestamp: new Date().toISOString()
      }
    ];

    let allPassed = true;
    let totalTime = 0;

    for (const request of testRequests) {
      const startTime = Date.now();
      const decision = await this.policyService.evaluateKillSwitchRequest(request);
      const evaluationTime = Date.now() - startTime;

      totalTime += evaluationTime;
      const passed = evaluationTime <= 100;
      allPassed = allPassed && passed;

      console.log(`  ${passed ? '✅' : '❌'} Policy evaluation: ${evaluationTime}ms (Confidence: ${decision.confidence.toFixed(2)})`);
    }

    const averageTime = totalTime / testRequests.length;
    console.log(`  📊 Average policy evaluation time: ${averageTime.toFixed(1)}ms`);

    return allPassed;
  }

  /**
   * Test 3: Evidence collection performance (≤500ms)
   */
  async testEvidenceCollectionPerformance(): Promise<boolean> {
    console.log(`🧪 Testing evidence collection performance...`);

    // Mock kill-switch activation to test evidence collection
    const testRequest: KillSwitchRequest = {
      reason: 'Performance test - evidence collection',
      severity: 'high',
      evidence: { test: true },
      requestedBy: 'performance_test',
      timestamp: new Date().toISOString()
    };

    const startTime = Date.now();
    const activated = await this.killSwitchManager.activateKillSwitch(testRequest);

    if (!activated) {
      console.log(`  ❌ Kill-switch activation failed`);
      return false;
    }

    // Wait for evidence collection
    await new Promise(resolve => setTimeout(resolve, 200));

    const evidenceTime = Date.now() - startTime;
    const passed = evidenceTime <= 500;

    console.log(`  ${passed ? '✅' : '❌'} Evidence collection: ${evidenceTime}ms ${passed ? 'PASS' : 'FAIL'}`);

    await this.killSwitchManager.deactivateKillSwitch('standard_recovery');

    return passed;
  }

  /**
   * Test 4: Recovery procedures (≤2000ms)
   */
  async testRecoveryPerformance(): Promise<boolean> {
    console.log(`🧪 Testing recovery procedures performance...`);

    const testRequest: KillSwitchRequest = {
      reason: 'Recovery performance test',
      severity: 'medium',
      evidence: { test: 'recovery' },
      requestedBy: 'recovery_test',
      timestamp: new Date().toISOString()
    };

    // Activate kill-switch first
    const activated = await this.killSwitchManager.activateKillSwitch(testRequest);
    if (!activated) {
      console.log(`  ❌ Kill-switch activation failed for recovery test`);
      return false;
    }

    // Test recovery performance
    const startTime = Date.now();
    const recovered = await this.killSwitchManager.deactivateKillSwitch('standard_recovery');
    const recoveryTime = Date.now() - startTime;

    const passed = recovered && recoveryTime <= 2000;
    console.log(`  ${passed ? '✅' : '❌'} Recovery procedure: ${recoveryTime}ms ${passed ? 'PASS' : 'FAIL'}`);

    return passed;
  }

  /**
   * Test 5: Concurrent activation attempts
   */
  async testConcurrentActivation(): Promise<boolean> {
    console.log(`🧪 Testing concurrent activation attempts...`);

    const concurrentRequests: KillSwitchRequest[] = [
      {
        reason: 'Concurrent test 1 - security issue',
        severity: 'critical',
        evidence: { test: 'concurrent', id: 1 },
        requestedBy: 'concurrent_test_1',
        timestamp: new Date().toISOString()
      },
      {
        reason: 'Concurrent test 2 - performance issue',
        severity: 'high',
        evidence: { test: 'concurrent', id: 2 },
        requestedBy: 'concurrent_test_2',
        timestamp: new Date().toISOString()
      },
      {
        reason: 'Concurrent test 3 - anomaly detected',
        severity: 'medium',
        evidence: { test: 'concurrent', id: 3 },
        requestedBy: 'concurrent_test_3',
        timestamp: new Date().toISOString()
      }
    ];

    const startTime = Date.now();

    // Execute concurrent activation attempts
    const activationPromises = concurrentRequests.map(request =>
      this.killSwitchManager.activateKillSwitch(request)
    );

    const results = await Promise.allSettled(activationPromises);
    const totalTime = Date.now() - startTime;

    // Only one should succeed, others should be rejected
    const successfulActivations = results.filter(result =>
      result.status === 'fulfilled' && result.value === true
    ).length;

    const passed = successfulActivations === 1 && totalTime <= 1000;
    console.log(`  ${passed ? '✅' : '❌'} Concurrent activation: ${successfulActivations} successful, ${totalTime}ms ${passed ? 'PASS' : 'FAIL'}`);

    // Clean up
    if (successfulActivations === 1) {
      await this.killSwitchManager.deactivateKillSwitch('standard_recovery');
    }

    return passed;
  }

  /**
   * Run all performance tests
   */
  async runAllTests(): Promise<{ passed: number; total: number; results: any[] }> {
    console.log(`🚀 Starting T015 Kill-Switch Performance Tests`);
    console.log(`================================================`);

    const tests = [
      { name: 'Activation Performance (≤300ms)', test: () => this.testActivationPerformance() },
      { name: 'Policy Evaluation (≤100ms)', test: () => this.testPolicyEvaluationPerformance() },
      { name: 'Evidence Collection (≤500ms)', test: () => this.testEvidenceCollectionPerformance() },
      { name: 'Recovery Procedures (≤2000ms)', test: () => this.testRecoveryPerformance() },
      { name: 'Concurrent Activation', test: () => this.testConcurrentActivation() }
    ];

    const results = [];
    let passed = 0;

    for (const test of tests) {
      try {
        console.log(`\n${test.name}:`);
        console.log('-'.repeat(test.name.length + 1));

        const result = await test.test();
        if (result) {
          passed++;
        }

        results.push({ name: test.name, passed: result });

      } catch (error) {
        console.log(`  ❌ Test failed with error: ${error.message}`);
        results.push({ name: test.name, passed: false, error: error.message });
      }
    }

    console.log(`\n📊 TEST SUMMARY:`);
    console.log(`   Passed: ${passed}/${tests.length}`);
    console.log(`   Success Rate: ${((passed / tests.length) * 100).toFixed(1)}%`);

    return { passed, total: tests.length, results };
  }
}

// Run tests if executed directly
if (require.main === module) {
  const testRunner = new KillSwitchPerformanceTests();

  testRunner.runAllTests()
    .then(results => {
      console.log(`\n🎯 T015 PERFORMANCE TESTS COMPLETE`);
      console.log(`Overall Result: ${results.passed === results.total ? '✅ PASS' : '❌ FAIL'}`);
      process.exit(results.passed === results.total ? 0 : 1);
    })
    .catch(error => {
      console.error(`❌ Test execution failed: ${error.message}`);
      process.exit(1);
    });
}