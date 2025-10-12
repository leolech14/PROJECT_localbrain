/**
 * RAG Search API Server
 * ======================
 *
 * Express server providing <10ms search API response times
 */
import express from 'express';
import cors from 'cors';
import { RAGDatabase } from '../database/index.js';
import { RAGSearch } from '../search/index.js';
import { RAGIndexer } from '../indexer/index.js';
import { PERFORMANCE_TARGETS } from '../config/index.js';
export class RAGServer {
    app;
    db;
    search;
    indexer;
    constructor() {
        this.app = express();
        this.db = new RAGDatabase();
        this.search = new RAGSearch(this.db);
        this.indexer = new RAGIndexer(this.db);
        this.setupMiddleware();
        this.setupRoutes();
        this.setupErrorHandling();
    }
    setupMiddleware() {
        // CORS for all origins (development)
        this.app.use(cors());
        // JSON parsing with size limit
        this.app.use(express.json({ limit: '1mb' }));
        // Request timing middleware
        this.app.use((req, res, next) => {
            const start = Date.now();
            res.on('finish', () => {
                const duration = Date.now() - start;
                console.log(`${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
            });
            next();
        });
        // Health check endpoint
        this.app.get('/health', (req, res) => {
            res.json({
                status: 'healthy',
                timestamp: new Date().toISOString(),
                uptime: process.uptime()
            });
        });
    }
    setupRoutes() {
        const router = express.Router();
        // Search endpoint
        router.post('/search', async (req, res) => {
            try {
                const startTime = Date.now();
                if (!req.body.query || typeof req.body.query !== 'string') {
                    return res.status(400).json({
                        success: false,
                        error: {
                            code: 'INVALID_QUERY',
                            message: 'Query is required and must be a string'
                        }
                    });
                }
                const searchQuery = {
                    text: req.body.query,
                    limit: Math.min(req.body.limit || 10, 50),
                    threshold: req.body.threshold || 0.1,
                    includeMetadata: req.body.includeMetadata !== false,
                    filters: req.body.filters || {}
                };
                const result = await this.search.search(searchQuery);
                const totalTime = Date.now() - startTime;
                // Performance warning
                if (totalTime > PERFORMANCE_TARGETS.SEARCH_RESPONSE_TIME) {
                    console.warn(`⚠️ Slow search query: ${totalTime}ms (target: ${PERFORMANCE_TARGETS.SEARCH_RESPONSE_TIME}ms)`);
                }
                res.json(result);
            }
            catch (error) {
                console.error('Search error:', error);
                res.status(500).json({
                    success: false,
                    error: {
                        code: 'INTERNAL_ERROR',
                        message: 'Internal server error during search'
                    }
                });
            }
        });
        // Suggestions endpoint
        router.get('/suggestions/:partial', async (req, res) => {
            try {
                const suggestions = await this.search.getSuggestions(req.params.partial);
                res.json({
                    success: true,
                    data: suggestions
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: {
                        code: 'SUGGESTIONS_ERROR',
                        message: 'Failed to get suggestions'
                    }
                });
            }
        });
        // Popular searches endpoint
        router.get('/popular', async (req, res) => {
            try {
                const popular = await this.search.getPopularSearches();
                res.json({
                    success: true,
                    data: popular
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: {
                        code: 'POPULAR_ERROR',
                        message: 'Failed to get popular searches'
                    }
                });
            }
        });
        // Index management endpoints
        router.post('/index/refresh', async (req, res) => {
            try {
                console.log('🔄 Starting manual index refresh...');
                const startTime = Date.now();
                await this.indexer.indexAll();
                const duration = Date.now() - startTime;
                const stats = await this.db.getIndexStats();
                res.json({
                    success: true,
                    data: {
                        message: 'Index refreshed successfully',
                        duration: `${(duration / 1000).toFixed(2)}s`,
                        stats
                    }
                });
            }
            catch (error) {
                console.error('Index refresh error:', error);
                res.status(500).json({
                    success: false,
                    error: {
                        code: 'INDEX_ERROR',
                        message: 'Failed to refresh index'
                    }
                });
            }
        });
        router.get('/index/stats', async (req, res) => {
            try {
                const stats = await this.db.getIndexStats();
                res.json({
                    success: true,
                    data: stats
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: {
                        code: 'STATS_ERROR',
                        message: 'Failed to get index statistics'
                    }
                });
            }
        });
        // Performance metrics endpoint
        router.get('/metrics', (req, res) => {
            const metrics = {
                uptime: process.uptime(),
                memory: process.memoryUsage(),
                timestamp: new Date().toISOString(),
                targets: PERFORMANCE_TARGETS
            };
            res.json({
                success: true,
                data: metrics
            });
        });
        this.app.use('/api/v1', router);
    }
    setupErrorHandling() {
        // 404 handler
        this.app.use((req, res) => {
            res.status(404).json({
                success: false,
                error: {
                    code: 'NOT_FOUND',
                    message: `Endpoint ${req.method} ${req.path} not found`
                }
            });
        });
        // Global error handler
        this.app.use((err, req, res, next) => {
            console.error('Unhandled error:', err);
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Internal server error'
                }
            });
        });
    }
    async start(port = 3001) {
        return new Promise((resolve) => {
            this.app.listen(port, () => {
                console.log(`🚀 RAG Search API Server running on port ${port}`);
                console.log(`📖 API Documentation: http://localhost:${port}/api/v1`);
                console.log(`🏥 Health Check: http://localhost:${port}/health`);
                console.log(`📊 Metrics: http://localhost:${port}/api/v1/metrics`);
                resolve();
            });
        });
    }
    async stop() {
        return new Promise((resolve) => {
            this.db.close();
            resolve();
        });
    }
}
//# sourceMappingURL=index.js.map