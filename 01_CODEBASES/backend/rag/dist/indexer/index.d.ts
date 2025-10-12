/**
 * RAG Indexer
 * ============
 *
 * Efficient document chunking and indexing system
 */
import { RAGDatabase } from '../database/index.js';
export declare class RAGIndexer {
    private db;
    private config;
    constructor(database: RAGDatabase);
    /**
     * Index all specification files
     */
    indexAll(): Promise<void>;
    /**
     * Index a single document
     */
    indexDocument(filePath: string): Promise<{
        chunkCount: number;
    }>;
    /**
     * Find all specification files
     */
    private findSpecFiles;
    /**
     * Create intelligent chunks from content
     */
    private createChunks;
    /**
     * Extract title from markdown content
     */
    private extractTitle;
    /**
     * Extract metadata from content
     */
    private extractMetadata;
    /**
     * Split content into logical sections
     */
    private splitIntoSections;
    /**
     * Chunk a section into optimal pieces
     */
    private chunkSection;
    /**
     * Find optimal break point for chunking
     */
    private findBreakPoint;
    /**
     * Extract section title
     */
    private extractSectionTitle;
    private generateChunkId;
}
//# sourceMappingURL=index.d.ts.map