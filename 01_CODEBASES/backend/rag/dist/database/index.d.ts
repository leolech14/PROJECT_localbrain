/**
 * RAG Database Manager
 * ====================
 *
 * SQLite-based storage for RAG index with full-text search
 */
import { Chunk, SpecDocument, IndexStats } from '../types/index.js';
export declare class RAGDatabase {
    private db;
    private config;
    constructor(dbPath?: string);
    private initialize;
    private initializeSchema;
    storeDocument(document: Omit<SpecDocument, 'id' | 'indexedAt' | 'updatedAt'>): Promise<string>;
    getDocumentByPath(filePath: string): Promise<SpecDocument | null>;
    getAllDocuments(): Promise<SpecDocument[]>;
    deleteDocument(documentId: string): Promise<void>;
    storeChunk(chunk: Omit<Chunk, 'embedding'>): Promise<string>;
    getChunksByDocument(documentId: string): Promise<Chunk[]>;
    searchChunks(query: string, limit?: number): Promise<any[]>;
    getDocumentCount(): Promise<number>;
    getChunkCount(): Promise<number>;
    getIndexStats(): Promise<IndexStats>;
    cleanup(): Promise<void>;
    close(): void;
    private generateId;
}
//# sourceMappingURL=index.d.ts.map