/**
 * RAG Configuration
 * =================
 */
export const DEFAULT_CONFIG = {
    // Chunking parameters optimized for technical specifications
    chunkSize: 800, // 800-character chunks (optimal for technical content)
    chunkOverlap: 100, // 100-character overlap for context continuity
    maxChunkLength: 1000, // Maximum chunk length before splitting
    // Embedding configuration
    embeddingModel: 'text-embedding-ada-002', // OpenAI embedding model
    // Database configuration
    databasePath: './data/rag-index.db',
    // Content paths
    specBasePath: '/Users/lech/PROJECTS_all/LocalBrain/02_SPECBASES',
    // Refresh configuration (5 minutes)
    refreshInterval: 5 * 60 * 1000,
};
// Performance targets
export const PERFORMANCE_TARGETS = {
    SEARCH_RESPONSE_TIME: 10, // ≤10ms search API target
    INDEX_REFRESH_TIME: 30000, // ≤30s for full refresh
    CHUNK_PROCESSING_RATE: 1000, // chunks per second
    MAX_MEMORY_USAGE: 512, // MB
};
// File filtering
export const FILE_PATTERNS = {
    INCLUDE: [
        '**/*.md',
        '**/*.mdx',
        '**/*.txt'
    ],
    EXCLUDE: [
        '**/node_modules/**',
        '**/dist/**',
        '**/.git/**',
        '**/README.md',
        '**/CHANGELOG.md'
    ]
};
// Content parsing rules
export const PARSING_RULES = {
    MIN_CHUNK_LENGTH: 100, // Minimum characters for valid chunk
    MAX_HEADER_DEPTH: 6, // Maximum header level to track
    STRIP_HTML: true, // Remove HTML tags
    PRESERVE_CODE_BLOCKS: true, // Keep code blocks intact
    EXTRACT_METADATA: true, // Extract headers, links, tables
};
//# sourceMappingURL=index.js.map