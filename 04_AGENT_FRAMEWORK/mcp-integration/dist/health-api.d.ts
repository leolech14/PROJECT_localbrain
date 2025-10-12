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
export declare class HealthCheckAPI {
    private monitor;
    private port;
    constructor(port?: number);
    /**
     * Start health check API server
     */
    start(): Promise<void>;
    /**
     * Handle incoming HTTP requests
     */
    private handleRequest;
    /**
     * Basic health check - Returns 200 if healthy, 503 if not
     */
    private handleBasicHealthCheck;
    /**
     * Detailed health check - Returns full metrics
     */
    private handleDetailedHealthCheck;
    /**
     * Prometheus-compatible metrics
     */
    private handlePrometheusMetrics;
    /**
     * Current alerts
     */
    private handleAlerts;
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
//# sourceMappingURL=health-api.d.ts.map