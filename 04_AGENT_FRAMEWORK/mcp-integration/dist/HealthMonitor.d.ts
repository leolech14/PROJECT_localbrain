/**
 * 🏥 PRODUCTION HEALTH MONITORING SYSTEM
 * ======================================
 *
 * Real-time monitoring and alerting for automatic coordination system
 *
 * MONITORS:
 * - System health (CPU, memory, response times)
 * - MCP server connectivity
 * - Agent performance (task claims, completions)
 * - Error rates and types
 * - Performance degradation
 *
 * ALERTS:
 * - Critical: System down, MCP unreachable, >10% error rate
 * - Warning: Performance degradation, high memory usage
 * - Info: Successful deployments, milestone achievements
 */
export interface HealthStatus {
    status: 'healthy' | 'degraded' | 'critical';
    timestamp: string;
    metrics: HealthMetrics;
    alerts: Alert[];
}
export interface HealthMetrics {
    system: {
        uptime: number;
        memory: MemoryMetrics;
        cpu: number;
    };
    mcp: {
        connected: boolean;
        responseTime: number;
        lastCheck: string;
    };
    agents: {
        activeAgents: number;
        tasksClaimedToday: number;
        tasksCompletedToday: number;
        averageTaskTime: number;
    };
    performance: {
        avgInitTime: number;
        avgClaimTime: number;
        avgStatusTime: number;
        p95Latency: number;
    };
    errors: {
        total: number;
        rate: number;
        criticalErrors: number;
        recentErrors: ErrorRecord[];
    };
}
export interface MemoryMetrics {
    used: number;
    total: number;
    percentage: number;
}
export interface ErrorRecord {
    timestamp: string;
    type: string;
    message: string;
    agent?: string;
    stack?: string;
}
export interface Alert {
    level: 'critical' | 'warning' | 'info';
    category: 'system' | 'mcp' | 'performance' | 'errors';
    message: string;
    timestamp: string;
    metadata?: Record<string, unknown>;
}
export interface AlertConfig {
    thresholds: {
        cpu: number;
        memory: number;
        errorRate: number;
        mcpResponseTime: number;
        taskClaimTime: number;
    };
    notifications: {
        slack?: {
            webhookUrl: string;
            channel: string;
        };
        email?: {
            smtp: string;
            recipients: string[];
        };
        discord?: {
            webhookUrl: string;
        };
    };
}
export declare class HealthMonitor {
    private static instance;
    private config;
    private metrics;
    private alerts;
    private errors;
    private startTime;
    private initTimes;
    private claimTimes;
    private statusTimes;
    private constructor();
    static getInstance(config?: AlertConfig): HealthMonitor;
    private initializeMetrics;
    checkHealth(): Promise<HealthStatus>;
    private updateSystemMetrics;
    private updateMCPMetrics;
    private updatePerformanceMetrics;
    private updateErrorMetrics;
    private generateAlerts;
    private addAlert;
    private determineHealthStatus;
    recordInitTime(timeMs: number): void;
    recordClaimTime(timeMs: number): void;
    recordStatusTime(timeMs: number): void;
    recordError(error: ErrorRecord): void;
    private sendNotification;
    private sendSlackNotification;
    private sendDiscordNotification;
    private sendEmailNotification;
    private calculateAverage;
    private calculatePercentile;
    private getCPUUsage;
    getMetrics(): HealthMetrics;
    getAlerts(): Alert[];
    clearAlerts(): void;
    startMonitoring(intervalMs?: number): Promise<void>;
}
export declare const DEFAULT_ALERT_CONFIG: AlertConfig;
/**
 * 🎯 USAGE EXAMPLE
 *
 * ```typescript
 * import { HealthMonitor, DEFAULT_ALERT_CONFIG } from './HealthMonitor';
 *
 * // Initialize monitor
 * const monitor = HealthMonitor.getInstance(DEFAULT_ALERT_CONFIG);
 *
 * // Start continuous monitoring
 * await monitor.startMonitoring(60000); // Check every minute
 *
 * // Record performance metrics
 * monitor.recordInitTime(1500); // 1.5s initialization
 * monitor.recordClaimTime(800); // 800ms task claim
 *
 * // Manual health check
 * const health = await monitor.checkHealth();
 * console.log('Status:', health.status);
 * console.log('Alerts:', health.alerts);
 * ```
 */
//# sourceMappingURL=HealthMonitor.d.ts.map