/**
 * 🏥 HEALTH CHECK API ENDPOINTS
 * =============================
 *
 * REST API endpoints for health monitoring
 * Used by cloud infrastructure (AWS CloudWatch, GCP Monitoring, etc.)
 *
 * ENDPOINTS:
 * - GET /health - Basic health check (200 OK if healthy)
 * - GET /health/detailed - Detailed metrics
 * - GET /health/metrics - Prometheus-compatible metrics
 * - GET /health/alerts - Current alerts
 */
import { HealthMonitor, DEFAULT_ALERT_CONFIG } from './HealthMonitor';
// ============================================================
// HEALTH CHECK API SERVER
// ============================================================
export class HealthCheckAPI {
    monitor;
    port;
    constructor(port = 3001) {
        this.port = port;
        this.monitor = HealthMonitor.getInstance(DEFAULT_ALERT_CONFIG);
    }
    /**
     * Start health check API server
     */
    async start() {
        // Using Node's built-in http module for zero dependencies
        const http = await import('http');
        const server = http.createServer(async (req, res) => {
            // Enable CORS
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            if (req.method === 'OPTIONS') {
                res.writeHead(204);
                res.end();
                return;
            }
            if (req.method !== 'GET') {
                res.writeHead(405, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Method not allowed' }));
                return;
            }
            try {
                await this.handleRequest(req, res);
            }
            catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    error: 'Internal server error',
                    message: error instanceof Error ? error.message : 'Unknown error'
                }));
            }
        });
        server.listen(this.port, () => {
            console.log(`\n🏥 Health Check API started on port ${this.port}`);
            console.log(`   GET http://localhost:${this.port}/health`);
            console.log(`   GET http://localhost:${this.port}/health/detailed`);
            console.log(`   GET http://localhost:${this.port}/health/metrics`);
            console.log(`   GET http://localhost:${this.port}/health/alerts`);
        });
        // Start continuous monitoring
        await this.monitor.startMonitoring(60000); // Check every minute
    }
    /**
     * Handle incoming HTTP requests
     */
    async handleRequest(req, res) {
        const url = req.url || '/';
        if (url === '/health') {
            await this.handleBasicHealthCheck(res);
        }
        else if (url === '/health/detailed') {
            await this.handleDetailedHealthCheck(res);
        }
        else if (url === '/health/metrics') {
            await this.handlePrometheusMetrics(res);
        }
        else if (url === '/health/alerts') {
            await this.handleAlerts(res);
        }
        else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                error: 'Not found',
                availableEndpoints: [
                    '/health',
                    '/health/detailed',
                    '/health/metrics',
                    '/health/alerts'
                ]
            }));
        }
    }
    // ============================================================
    // ENDPOINT HANDLERS
    // ============================================================
    /**
     * Basic health check - Returns 200 if healthy, 503 if not
     */
    async handleBasicHealthCheck(res) {
        const health = await this.monitor.checkHealth();
        const statusCode = health.status === 'healthy' ? 200 :
            health.status === 'degraded' ? 200 : 503;
        res.writeHead(statusCode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: health.status,
            timestamp: health.timestamp,
            uptime: health.metrics.system.uptime,
            mcpConnected: health.metrics.mcp.connected
        }));
    }
    /**
     * Detailed health check - Returns full metrics
     */
    async handleDetailedHealthCheck(res) {
        const health = await this.monitor.checkHealth();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(health, null, 2));
    }
    /**
     * Prometheus-compatible metrics
     */
    async handlePrometheusMetrics(res) {
        const health = await this.monitor.checkHealth();
        const m = health.metrics;
        const prometheusMetrics = `
# HELP localbrain_system_uptime_seconds System uptime in seconds
# TYPE localbrain_system_uptime_seconds gauge
localbrain_system_uptime_seconds ${m.system.uptime}

# HELP localbrain_memory_usage_percent Memory usage percentage
# TYPE localbrain_memory_usage_percent gauge
localbrain_memory_usage_percent ${m.system.memory.percentage.toFixed(2)}

# HELP localbrain_memory_used_bytes Memory used in bytes
# TYPE localbrain_memory_used_bytes gauge
localbrain_memory_used_bytes ${m.system.memory.used}

# HELP localbrain_cpu_usage_percent CPU usage percentage
# TYPE localbrain_cpu_usage_percent gauge
localbrain_cpu_usage_percent ${m.system.cpu.toFixed(2)}

# HELP localbrain_mcp_connected MCP server connection status (1=connected, 0=disconnected)
# TYPE localbrain_mcp_connected gauge
localbrain_mcp_connected ${m.mcp.connected ? 1 : 0}

# HELP localbrain_mcp_response_time_ms MCP server response time in milliseconds
# TYPE localbrain_mcp_response_time_ms gauge
localbrain_mcp_response_time_ms ${m.mcp.responseTime.toFixed(2)}

# HELP localbrain_active_agents Number of active agents
# TYPE localbrain_active_agents gauge
localbrain_active_agents ${m.agents.activeAgents}

# HELP localbrain_tasks_claimed_today Tasks claimed today
# TYPE localbrain_tasks_claimed_today counter
localbrain_tasks_claimed_today ${m.agents.tasksClaimedToday}

# HELP localbrain_tasks_completed_today Tasks completed today
# TYPE localbrain_tasks_completed_today counter
localbrain_tasks_completed_today ${m.agents.tasksCompletedToday}

# HELP localbrain_avg_init_time_ms Average agent initialization time in milliseconds
# TYPE localbrain_avg_init_time_ms gauge
localbrain_avg_init_time_ms ${m.performance.avgInitTime.toFixed(2)}

# HELP localbrain_avg_claim_time_ms Average task claim time in milliseconds
# TYPE localbrain_avg_claim_time_ms gauge
localbrain_avg_claim_time_ms ${m.performance.avgClaimTime.toFixed(2)}

# HELP localbrain_avg_status_time_ms Average status check time in milliseconds
# TYPE localbrain_avg_status_time_ms gauge
localbrain_avg_status_time_ms ${m.performance.avgStatusTime.toFixed(2)}

# HELP localbrain_p95_latency_ms 95th percentile latency in milliseconds
# TYPE localbrain_p95_latency_ms gauge
localbrain_p95_latency_ms ${m.performance.p95Latency.toFixed(2)}

# HELP localbrain_errors_total Total number of errors
# TYPE localbrain_errors_total counter
localbrain_errors_total ${m.errors.total}

# HELP localbrain_error_rate_per_minute Error rate per minute
# TYPE localbrain_error_rate_per_minute gauge
localbrain_error_rate_per_minute ${m.errors.rate.toFixed(2)}

# HELP localbrain_critical_errors Number of critical errors
# TYPE localbrain_critical_errors gauge
localbrain_critical_errors ${m.errors.criticalErrors}

# HELP localbrain_health_status Overall health status (2=healthy, 1=degraded, 0=critical)
# TYPE localbrain_health_status gauge
localbrain_health_status ${health.status === 'healthy' ? 2 : health.status === 'degraded' ? 1 : 0}

# HELP localbrain_alerts_total Number of active alerts
# TYPE localbrain_alerts_total gauge
localbrain_alerts_total ${health.alerts.length}
`.trim();
        res.writeHead(200, { 'Content-Type': 'text/plain; version=0.0.4' });
        res.end(prometheusMetrics);
    }
    /**
     * Current alerts
     */
    async handleAlerts(res) {
        const alerts = this.monitor.getAlerts();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            count: alerts.length,
            alerts
        }, null, 2));
    }
}
// ============================================================
// STANDALONE SERVER (for development/testing)
// ============================================================
if (import.meta.url === `file://${process.argv[1]}`) {
    const port = parseInt(process.env.HEALTH_PORT || '3001');
    const api = new HealthCheckAPI(port);
    void api.start().then(() => {
        console.log('\n✅ Health Check API is running!');
        console.log('\nTry these endpoints:');
        console.log(`   curl http://localhost:${port}/health`);
        console.log(`   curl http://localhost:${port}/health/detailed`);
        console.log(`   curl http://localhost:${port}/health/metrics`);
        console.log(`   curl http://localhost:${port}/health/alerts`);
    });
}
/**
 * 🎯 USAGE EXAMPLES
 *
 * ## AWS CloudWatch Integration
 * ```bash
 * # Add to Lambda or EC2 instance
 * curl -f http://localhost:3001/health || exit 1
 * ```
 *
 * ## GCP Cloud Monitoring
 * ```yaml
 * health_check:
 *   http_health_check:
 *     port: 3001
 *     request_path: /health
 * ```
 *
 * ## Kubernetes Liveness Probe
 * ```yaml
 * livenessProbe:
 *   httpGet:
 *     path: /health
 *     port: 3001
 *   initialDelaySeconds: 30
 *   periodSeconds: 10
 * ```
 *
 * ## Prometheus Scraping
 * ```yaml
 * scrape_configs:
 *   - job_name: 'localbrain'
 *     static_configs:
 *       - targets: ['localhost:3001']
 *     metrics_path: '/health/metrics'
 * ```
 */
//# sourceMappingURL=health-api.js.map