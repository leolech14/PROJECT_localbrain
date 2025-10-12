/**
 * RAG Search API Server
 * ======================
 *
 * Express server providing <10ms search API response times
 */
export declare class RAGServer {
    private app;
    private db;
    private search;
    private indexer;
    constructor();
    private setupMiddleware;
    private setupRoutes;
    private setupErrorHandling;
    start(port?: number): Promise<void>;
    stop(): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map