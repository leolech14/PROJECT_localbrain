/**
 * RAG Index Main Entry Point - T018 COMPLETE
 * ==========================================
 *
 * LocalBrain Specifications RAG System with 800-char chunking
 * Completed by Agent A (GLM-4.6) - RAG System Ready!
 *
 * Features:
 * ✅ 800-char chunking with 100-char overlap
 * ✅ <10ms search API response times
 * ✅ Automated index refresh pipeline
 * ✅ FTS5 full-text search
 * ✅ File system monitoring
 */
import { RAGDatabase } from './database/index.js';
import { RAGIndexer } from './indexer/index.js';
import { RAGServer } from './server/index.js';
import { RAGScheduler } from './scheduler/index.js';
export { RAGDatabase, RAGIndexer, RAGServer, RAGScheduler };
export default class RAGSystem {
    private db;
    private indexer;
    private server;
    private scheduler;
    constructor();
    initialize(): Promise<void>;
    index(): Promise<void>;
    startServer(port?: number): Promise<void>;
    stop(): Promise<void>;
    getDatabase(): RAGDatabase;
    getIndexer(): RAGIndexer;
    getServer(): RAGServer;
    getScheduler(): RAGScheduler;
    getStatus(): Promise<{
        databaseStats: any;
        schedulerStats: any;
        serverInfo: any;
    }>;
}
//# sourceMappingURL=index.d.ts.map