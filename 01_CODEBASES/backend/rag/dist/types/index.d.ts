/**
 * RAG Index Type Definitions
 * ============================
 */
export interface SpecDocument {
    id: string;
    filePath: string;
    fileName: string;
    title: string;
    content: string;
    chunkCount: number;
    indexedAt: Date;
    updatedAt: Date;
    fileSize: number;
}
export interface Chunk {
    id: string;
    documentId: string;
    chunkIndex: number;
    content: string;
    startChar: number;
    endChar: number;
    embedding?: number[];
    metadata: ChunkMetadata;
}
export interface ChunkMetadata {
    fileName: string;
    filePath: string;
    section?: string;
    headers: string[];
    codeBlocks: number;
    links: number;
    tables: number;
    complexity: 'low' | 'medium' | 'high';
}
export interface SearchResult {
    chunk: Chunk;
    score: number;
    highlights: string[];
    context: {
        before: string;
        after: string;
    };
}
export interface SearchQuery {
    text: string;
    limit?: number;
    threshold?: number;
    includeMetadata?: boolean;
    filters?: {
        fileName?: string;
        complexity?: string;
        section?: string;
    };
}
export interface RAGConfig {
    chunkSize: number;
    chunkOverlap: number;
    maxChunkLength: number;
    embeddingModel: string;
    databasePath: string;
    specBasePath: string;
    refreshInterval: number;
}
export interface IndexStats {
    totalDocuments: number;
    totalChunks: number;
    averageChunksPerDoc: number;
    totalSize: number;
    lastIndexed: Date;
    indexingTime: number;
}
export interface APISuccessResponse<T = any> {
    success: true;
    data: T;
    stats?: IndexStats;
    timing: {
        query: number;
        total: number;
    };
}
export interface APIErrorResponse {
    success: false;
    error: {
        code: string;
        message: string;
        details?: any;
    };
    timing: {
        total: number;
    };
}
//# sourceMappingURL=index.d.ts.map