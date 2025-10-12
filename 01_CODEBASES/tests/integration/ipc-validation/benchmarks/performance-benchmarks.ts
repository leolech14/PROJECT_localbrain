/**
 * IPC Performance Benchmarks
 * ===========================
 *
 * Task: T017 - Schema Validation System Testing
 * Agent: D (Integration Specialist)
 *
 * T002 Performance Requirements:
 * - Message Latency: ≤50ms
 * - Serialization: ≤5ms
 * - Validation: ≤10ms
 * - Throughput: ≥100 msg/s
 * - Error Rate: <1%
 */

import { SwiftBridgeClient } from '../../../../01_CODEBASES/localbrain-electron/renderer/lib/swift-bridge/SwiftBridgeClient';
import validMessages from '../fixtures/valid-messages.json';

interface BenchmarkResult {
  testName: string;
  iterations: number;
  totalTime: number;
  avgTime: number;
  minTime: number;
  maxTime: number;
  passed: boolean;
  requirement: number;
}

class PerformanceBenchmark {
  private results: BenchmarkResult[] = [];

  async runAll(): Promise<void> {
    console.log('🚀 Starting IPC Performance Benchmarks');
    console.log('=====================================\n');

    await this.benchmarkValidation();
    await this.benchmarkSerialization();
    await this.benchmarkThroughput();
    await this.benchmarkLatency();

    this.printResults();
  }

  private async benchmarkValidation(): Promise<void> {
    console.log('📊 Validation Performance (Target: ≤10ms)');

    const bridge = new SwiftBridgeClient();
    const message = validMessages.ui_intent_openPanel;
    const iterations = 1000;
    const times: number[] = [];

    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      (bridge as any).validateMessage(message);
      const end = performance.now();
      times.push(end - start);
    }

    const totalTime = times.reduce((a, b) => a + b, 0);
    const avgTime = totalTime / iterations;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);

    this.results.push({
      testName: 'Message Validation',
      iterations,
      totalTime,
      avgTime,
      minTime,
      maxTime,
      passed: avgTime <= 10,
      requirement: 10
    });

    bridge.destroy();
  }

  private async benchmarkSerialization(): Promise<void> {
    console.log('📊 Serialization Performance (Target: ≤5ms)');

    const message = validMessages.ui_intent_openPanel;
    const iterations = 1000;
    const times: number[] = [];

    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      JSON.stringify(message);
      const end = performance.now();
      times.push(end - start);
    }

    const totalTime = times.reduce((a, b) => a + b, 0);
    const avgTime = totalTime / iterations;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);

    this.results.push({
      testName: 'JSON Serialization',
      iterations,
      totalTime,
      avgTime,
      minTime,
      maxTime,
      passed: avgTime <= 5,
      requirement: 5
    });
  }

  private async benchmarkThroughput(): Promise<void> {
    console.log('📊 Throughput Performance (Target: ≥100 msg/s)');

    const bridge = new SwiftBridgeClient();
    const message = validMessages.ui_intent_openPanel;
    const duration = 1000; // 1 second
    let messageCount = 0;

    const startTime = performance.now();
    let currentTime = startTime;

    while (currentTime - startTime < duration) {
      (bridge as any).validateMessage(message);
      messageCount++;
      currentTime = performance.now();
    }

    const actualDuration = currentTime - startTime;
    const messagesPerSecond = (messageCount / actualDuration) * 1000;

    this.results.push({
      testName: 'Message Throughput',
      iterations: messageCount,
      totalTime: actualDuration,
      avgTime: messagesPerSecond,
      minTime: messagesPerSecond,
      maxTime: messagesPerSecond,
      passed: messagesPerSecond >= 100,
      requirement: 100
    });

    bridge.destroy();
  }

  private async benchmarkLatency(): Promise<void> {
    console.log('📊 End-to-End Latency (Target: ≤50ms)');

    const bridge = new SwiftBridgeClient();
    const iterations = 100;
    const times: number[] = [];

    // Mock webkit.messageHandlers for testing
    (global as any).window = {
      webkit: {
        messageHandlers: {
          ipcBridge: {
            postMessage: (msg: any) => {
              // Simulate immediate response
              setTimeout(() => {
                (bridge as any).receiveMessage({
                  type: 'ACK',
                  traceId: msg.traceId,
                  timestamp: new Date().toISOString(),
                  version: '1.0',
                  status: {
                    code: 200,
                    message: 'Success'
                  }
                });
              }, 5); // Simulate 5ms processing
            }
          }
        }
      }
    };

    for (let i = 0; i < iterations; i++) {
      const start = performance.now();

      await bridge.postIntent('openPanel', {
        type: 'sidebar',
        id: 'test'
      }, undefined, { timeout: 1000 });

      const end = performance.now();
      times.push(end - start);
    }

    const totalTime = times.reduce((a, b) => a + b, 0);
    const avgTime = totalTime / iterations;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);

    this.results.push({
      testName: 'End-to-End Latency',
      iterations,
      totalTime,
      avgTime,
      minTime,
      maxTime,
      passed: avgTime <= 50,
      requirement: 50
    });

    bridge.destroy();
  }

  private printResults(): void {
    console.log('\n');
    console.log('📈 BENCHMARK RESULTS');
    console.log('===================\n');

    let allPassed = true;

    for (const result of this.results) {
      const status = result.passed ? '✅ PASS' : '❌ FAIL';
      const unit = result.testName === 'Message Throughput' ? 'msg/s' : 'ms';

      console.log(`${status} ${result.testName}`);
      console.log(`   Iterations: ${result.iterations.toLocaleString()}`);
      console.log(`   Avg Time: ${result.avgTime.toFixed(3)} ${unit}`);
      console.log(`   Min Time: ${result.minTime.toFixed(3)} ${unit}`);
      console.log(`   Max Time: ${result.maxTime.toFixed(3)} ${unit}`);
      console.log(`   Requirement: ${result.requirement} ${unit}`);
      console.log('');

      if (!result.passed) {
        allPassed = false;
      }
    }

    console.log('===================');
    if (allPassed) {
      console.log('✅ ALL BENCHMARKS PASSED');
    } else {
      console.log('❌ SOME BENCHMARKS FAILED');
    }
  }
}

// Export for use in test suites
export { PerformanceBenchmark, BenchmarkResult };

// Run if executed directly
if (require.main === module) {
  const benchmark = new PerformanceBenchmark();
  benchmark.runAll().catch(console.error);
}
