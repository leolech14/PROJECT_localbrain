/**
 * RAG Search Engine
 * ==================
 *
 * Fast search API with <10ms response time target
 */
import { RAGDatabase } from '../database/index.js';
import { SearchQuery, SearchResult, APISuccessResponse, APIErrorResponse } from '../types/index.js';
export declare class RAGSearch {
    private db;
    constructor(database: RAGDatabase);
    /**
     * Main search endpoint - optimized for speed
     */
    search(query: SearchQuery): Promise<APISuccessResponse<SearchResult[]> | APIErrorResponse>;
    /**
     * Execute the actual search query
     */
    private executeSearch;
    /**
     * Extract highlights from FTS results
     */
    private extractHighlights;
    /**
     * Get surrounding context for a chunk
     */
    private getContext;
    /**
     * Apply filters to search results
     */
    private matchesFilters;
    /**
     * Get search suggestions
     */
    getSuggestions(partial: string): Promise<string[]>;
    /**
     * Get popular searches
     */
    getPopularSearches(): Promise<string[]>;
}
//# sourceMappingURL=index.d.ts.map