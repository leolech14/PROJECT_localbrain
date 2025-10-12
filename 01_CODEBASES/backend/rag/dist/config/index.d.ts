/**
 * RAG Configuration
 * =================
 */
import { RAGConfig } from '../types/index.js';
export declare const DEFAULT_CONFIG: RAGConfig;
export declare const PERFORMANCE_TARGETS: {
    SEARCH_RESPONSE_TIME: number;
    INDEX_REFRESH_TIME: number;
    CHUNK_PROCESSING_RATE: number;
    MAX_MEMORY_USAGE: number;
};
export declare const FILE_PATTERNS: {
    INCLUDE: string[];
    EXCLUDE: string[];
};
export declare const PARSING_RULES: {
    MIN_CHUNK_LENGTH: number;
    MAX_HEADER_DEPTH: number;
    STRIP_HTML: boolean;
    PRESERVE_CODE_BLOCKS: boolean;
    EXTRACT_METADATA: boolean;
};
//# sourceMappingURL=index.d.ts.map