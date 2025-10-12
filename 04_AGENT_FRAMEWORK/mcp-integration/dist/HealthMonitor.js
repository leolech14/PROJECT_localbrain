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
import { TaskRegistryClient } from './TaskRegistryClient';
// ============================================================
// HEALTH MONITOR CLASS
// ============================================================
export class HealthMonitor {
    static instance;
    config;
    metrics;
    alerts = [];
    errors = [];
    startTime = Date.now();
    // Performance tracking
    initTimes = [];
    claimTimes = [];
    statusTimes = [];
    constructor(config) {
        this.config = config;
        this.metrics = this.initializeMetrics();
    }
    static getInstance(config) {
        if (!HealthMonitor.instance) {
            if (!config) {
                throw new Error('HealthMonitor must be initialized with config on first call');
            }
            HealthMonitor.instance = new HealthMonitor(config);
        }
        return HealthMonitor.instance;
    }
    // ============================================================
    // INITIALIZATION
    // ============================================================
    initializeMetrics() {
        const memUsage = process.memoryUsage();
        return {
            system: {
                uptime: 0,
                memory: {
                    used: memUsage.heapUsed,
                    total: memUsage.heapTotal,
                    percentage: (memUsage.heapUsed / memUsage.heapTotal) * 100
                },
                cpu: 0
            },
            mcp: {
                connected: false,
                responseTime: 0,
                lastCheck: new Date().toISOString()
            },
            agents: {
                activeAgents: 0,
                tasksClaimedToday: 0,
                tasksCompletedToday: 0,
                averageTaskTime: 0
            },
            performance: {
                avgInitTime: 0,
                avgClaimTime: 0,
                avgStatusTime: 0,
                p95Latency: 0
            },
            errors: {
                total: 0,
                rate: 0,
                criticalErrors: 0,
                recentErrors: []
            }
        };
    }
    // ============================================================
    // HEALTH CHECK
    // ============================================================
    async checkHealth() {
        // Update all metrics
        await this.updateSystemMetrics();
        await this.updateMCPMetrics();
        this.updatePerformanceMetrics();
        this.updateErrorMetrics();
        // Generate alerts based on thresholds
        this.generateAlerts();
        // Determine overall health status
        const status = this.determineHealthStatus();
        return {
            status,
            timestamp: new Date().toISOString(),
            metrics: this.metrics,
            alerts: this.alerts
        };
    }
    // ============================================================
    // METRIC UPDATES
    // ============================================================
    async updateSystemMetrics() {
        const memUsage = process.memoryUsage();
        this.metrics.system = {
            uptime: Math.floor((Date.now() - this.startTime) / 1000),
            memory: {
                used: memUsage.heapUsed,
                total: memUsage.heapTotal,
                percentage: (memUsage.heapUsed / memUsage.heapTotal) * 100
            },
            cpu: this.getCPUUsage()
        };
    }
    async updateMCPMetrics() {
        try {
            const startTime = performance.now();
            const client = new TaskRegistryClient('HEALTH_CHECK');
            await client.getAgentStatus('HEALTH_CHECK');
            const responseTime = performance.now() - startTime;
            this.metrics.mcp = {
                connected: true,
                responseTime,
                lastCheck: new Date().toISOString()
            };
        }
        catch (error) {
            this.metrics.mcp = {
                connected: false,
                responseTime: 0,
                lastCheck: new Date().toISOString()
            };
            this.recordError({
                type: 'MCP_CONNECTION_FAILED',
                message: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString()
            });
        }
    }
    updatePerformanceMetrics() {
        this.metrics.performance = {
            avgInitTime: this.calculateAverage(this.initTimes),
            avgClaimTime: this.calculateAverage(this.claimTimes),
            avgStatusTime: this.calculateAverage(this.statusTimes),
            p95Latency: this.calculatePercentile([...this.initTimes, ...this.claimTimes, ...this.statusTimes], 0.95)
        };
    }
    updateErrorMetrics() {
        const now = Date.now();
        const oneHourAgo = now - (60 * 60 * 1000);
        // Filter recent errors (last hour)
        const recentErrors = this.errors.filter(error => {
            const errorTime = new Date(error.timestamp).getTime();
            return errorTime >= oneHourAgo;
        });
        const criticalErrors = recentErrors.filter(error => error.type.includes('CRITICAL') || error.type.includes('FATAL'));
        this.metrics.errors = {
            total: this.errors.length,
            rate: (recentErrors.length / 60), // Errors per minute
            criticalErrors: criticalErrors.length,
            recentErrors: recentErrors.slice(-10) // Last 10 errors
        };
    }
    // ============================================================
    // ALERT GENERATION
    // ============================================================
    generateAlerts() {
        this.alerts = [];
        // System alerts
        if (this.metrics.system.memory.percentage > this.config.thresholds.memory) {
            this.addAlert({
                level: 'warning',
                category: 'system',
                message: `High memory usage: ${this.metrics.system.memory.percentage.toFixed(1)}%`,
                timestamp: new Date().toISOString(),
                metadata: {
                    used: this.metrics.system.memory.used,
                    total: this.metrics.system.memory.total
                }
            });
        }
        if (this.metrics.system.cpu > this.config.thresholds.cpu) {
            this.addAlert({
                level: 'warning',
                category: 'system',
                message: `High CPU usage: ${this.metrics.system.cpu.toFixed(1)}%`,
                timestamp: new Date().toISOString()
            });
        }
        // MCP alerts
        if (!this.metrics.mcp.connected) {
            this.addAlert({
                level: 'critical',
                category: 'mcp',
                message: 'MCP server unreachable - automatic coordination offline!',
                timestamp: new Date().toISOString()
            });
        }
        else if (this.metrics.mcp.responseTime > this.config.thresholds.mcpResponseTime) {
            this.addAlert({
                level: 'warning',
                category: 'mcp',
                message: `Slow MCP response: ${this.metrics.mcp.responseTime.toFixed(0)}ms`,
                timestamp: new Date().toISOString()
            });
        }
        // Performance alerts
        if (this.metrics.performance.avgClaimTime > this.config.thresholds.taskClaimTime) {
            this.addAlert({
                level: 'warning',
                category: 'performance',
                message: `Slow task claiming: ${this.metrics.performance.avgClaimTime.toFixed(0)}ms`,
                timestamp: new Date().toISOString()
            });
        }
        // Error alerts
        if (this.metrics.errors.rate > this.config.thresholds.errorRate) {
            this.addAlert({
                level: 'critical',
                category: 'errors',
                message: `High error rate: ${this.metrics.errors.rate.toFixed(2)} errors/min`,
                timestamp: new Date().toISOString(),
                metadata: {
                    recentErrors: this.metrics.errors.recentErrors.length,
                    criticalErrors: this.metrics.errors.criticalErrors
                }
            });
        }
        if (this.metrics.errors.criticalErrors > 0) {
            this.addAlert({
                level: 'critical',
                category: 'errors',
                message: `${this.metrics.errors.criticalErrors} critical errors detected`,
                timestamp: new Date().toISOString()
            });
        }
    }
    addAlert(alert) {
        this.alerts.push(alert);
        // Send notifications for critical alerts
        if (alert.level === 'critical') {
            void this.sendNotification(alert);
        }
    }
    // ============================================================
    // HEALTH STATUS DETERMINATION
    // ============================================================
    determineHealthStatus() {
        // Critical if MCP unreachable or high error rate
        if (!this.metrics.mcp.connected)
            return 'critical';
        if (this.metrics.errors.rate > this.config.thresholds.errorRate)
            return 'critical';
        if (this.metrics.errors.criticalErrors > 0)
            return 'critical';
        // Degraded if performance issues
        if (this.metrics.system.memory.percentage > this.config.thresholds.memory)
            return 'degraded';
        if (this.metrics.system.cpu > this.config.thresholds.cpu)
            return 'degraded';
        if (this.metrics.performance.avgClaimTime > this.config.thresholds.taskClaimTime)
            return 'degraded';
        return 'healthy';
    }
    // ============================================================
    // PERFORMANCE TRACKING
    // ============================================================
    recordInitTime(timeMs) {
        this.initTimes.push(timeMs);
        if (this.initTimes.length > 100)
            this.initTimes.shift(); // Keep last 100
    }
    recordClaimTime(timeMs) {
        this.claimTimes.push(timeMs);
        if (this.claimTimes.length > 100)
            this.claimTimes.shift();
    }
    recordStatusTime(timeMs) {
        this.statusTimes.push(timeMs);
        if (this.statusTimes.length > 100)
            this.statusTimes.shift();
    }
    recordError(error) {
        this.errors.push(error);
        if (this.errors.length > 1000)
            this.errors.shift(); // Keep last 1000
    }
    // ============================================================
    // NOTIFICATIONS
    // ============================================================
    async sendNotification(alert) {
        // Slack notification
        if (this.config.notifications.slack) {
            await this.sendSlackNotification(alert);
        }
        // Discord notification
        if (this.config.notifications.discord) {
            await this.sendDiscordNotification(alert);
        }
        // Email notification
        if (this.config.notifications.email) {
            await this.sendEmailNotification(alert);
        }
    }
    async sendSlackNotification(alert) {
        const slackConfig = this.config.notifications.slack;
        if (!slackConfig)
            return;
        const emoji = alert.level === 'critical' ? '🚨' : alert.level === 'warning' ? '⚠️' : 'ℹ️';
        const color = alert.level === 'critical' ? '#ff0000' : alert.level === 'warning' ? '#ffa500' : '#00ff00';
        try {
            await fetch(slackConfig.webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    channel: slackConfig.channel,
                    attachments: [{
                            color,
                            title: `${emoji} ${alert.level.toUpperCase()}: ${alert.category}`,
                            text: alert.message,
                            fields: alert.metadata ? Object.entries(alert.metadata).map(([key, value]) => ({
                                title: key,
                                value: String(value),
                                short: true
                            })) : [],
                            footer: 'LocalBrain Health Monitor',
                            ts: Math.floor(new Date(alert.timestamp).getTime() / 1000)
                        }]
                })
            });
        }
        catch (error) {
            console.error('Failed to send Slack notification:', error);
        }
    }
    async sendDiscordNotification(alert) {
        const discordConfig = this.config.notifications.discord;
        if (!discordConfig)
            return;
        const emoji = alert.level === 'critical' ? '🚨' : alert.level === 'warning' ? '⚠️' : 'ℹ️';
        const color = alert.level === 'critical' ? 0xff0000 : alert.level === 'warning' ? 0xffa500 : 0x00ff00;
        try {
            await fetch(discordConfig.webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    embeds: [{
                            title: `${emoji} ${alert.level.toUpperCase()}: ${alert.category}`,
                            description: alert.message,
                            color,
                            timestamp: alert.timestamp,
                            footer: {
                                text: 'LocalBrain Health Monitor'
                            }
                        }]
                })
            });
        }
        catch (error) {
            console.error('Failed to send Discord notification:', error);
        }
    }
    async sendEmailNotification(alert) {
        // Email implementation would go here
        // Requires SMTP configuration
        console.log('Email notification not yet implemented:', alert);
    }
    // ============================================================
    // UTILITY METHODS
    // ============================================================
    calculateAverage(values) {
        if (values.length === 0)
            return 0;
        return values.reduce((a, b) => a + b, 0) / values.length;
    }
    calculatePercentile(values, percentile) {
        if (values.length === 0)
            return 0;
        const sorted = [...values].sort((a, b) => a - b);
        const index = Math.floor(sorted.length * percentile);
        return sorted[index];
    }
    getCPUUsage() {
        // Simple CPU usage estimation
        // In production, use process.cpuUsage() and calculate delta
        return 0; // Placeholder
    }
    // ============================================================
    // PUBLIC API
    // ============================================================
    getMetrics() {
        return this.metrics;
    }
    getAlerts() {
        return this.alerts;
    }
    clearAlerts() {
        this.alerts = [];
    }
    async startMonitoring(intervalMs = 60000) {
        console.log(`🏥 Health Monitor started (checking every ${intervalMs}ms)`);
        setInterval(async () => {
            const health = await this.checkHealth();
            console.log(`\n🏥 Health Check: ${health.status.toUpperCase()}`);
            if (health.alerts.length > 0) {
                console.log(`⚠️  ${health.alerts.length} alerts:`);
                health.alerts.forEach(alert => {
                    const emoji = alert.level === 'critical' ? '🚨' : alert.level === 'warning' ? '⚠️' : 'ℹ️';
                    console.log(`   ${emoji} ${alert.category}: ${alert.message}`);
                });
            }
        }, intervalMs);
    }
}
// ============================================================
// DEFAULT CONFIGURATION
// ============================================================
export const DEFAULT_ALERT_CONFIG = {
    thresholds: {
        cpu: 80, // Alert if CPU > 80%
        memory: 85, // Alert if memory > 85%
        errorRate: 1.0, // Alert if > 1 error/min
        mcpResponseTime: 2000, // Alert if MCP response > 2s
        taskClaimTime: 1500 // Alert if task claim > 1.5s
    },
    notifications: {
    // Add Slack/Discord webhooks in production
    }
};
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
//# sourceMappingURL=HealthMonitor.js.map