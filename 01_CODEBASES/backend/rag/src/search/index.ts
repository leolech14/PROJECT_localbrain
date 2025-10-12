/**
 * RAG Search Engine
 * ==================
 *
 * Fast search API with <10ms response time target
 */

import { RAGDatabase } from '../database/index.js';
import { SearchQuery, SearchResult, APISuccessResponse, APIErrorResponse } from '../types/index.js';
import { PERFORMANCE_TARGETS } from '../config/index.js';

export class RAGSearch {
  private db: RAGDatabase;

  constructor(database: RAGDatabase) {
    this.db = database;
  }

  /**
   * Main search endpoint - optimized for speed
   */
  async search(query: SearchQuery): Promise<APISuccessResponse<SearchResult[]> | APIErrorResponse> {
    const startTime = Date.now();

    try {
      // Execute search with timeout
      const results = await this.executeSearch(query);
      const queryTime = Date.now() - startTime;

      return {
        success: true,
        data: results,
        timing: {
          query: queryTime,
          total: queryTime
        }
      };

    } catch (error) {
      const totalTime = Date.now() - startTime;

      return {
        success: false,
        error: {
          code: 'SEARCH_ERROR',
          message: error instanceof Error ? error.message : 'Unknown search error',
          details: error
        },
        timing: {
          query: totalTime,
          total: totalTime
        }
      } as APIErrorResponse;
    }
  }

  /**
   * Execute the actual search query
   */
  private async executeSearch(query: SearchQuery): Promise<SearchResult[]> {
    const limit = Math.min(query.limit || 10, 50); // Cap at 50 results
    const threshold = query.threshold || 0.1;

    // FTS5 search with BM25 ranking
    const searchResults = await this.db.searchChunks(query.text, limit * 2); // Get more to filter

    const results: SearchResult[] = [];

    for (const row of searchResults) {
      // Apply relevance threshold
      if (row.relevance_score > threshold) {
        const chunk = {
          id: row.id,
          documentId: row.document_id,
          chunkIndex: row.chunk_index,
          content: row.content,
          startChar: row.start_char,
          endChar: row.end_char,
          metadata: JSON.parse(row.metadata)
        };

        // Apply filters
        if (this.matchesFilters(chunk, query.filters)) {
          const result: SearchResult = {
            chunk,
            score: 1 / (1 + row.relevance_score), // Convert BM25 to similarity score
            highlights: this.extractHighlights(row.highlighted_content),
            context: await this.getContext(chunk)
          };

          results.push(result);
        }
      }
    }

    // Sort by score and limit
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Extract highlights from FTS results
   */
  private extractHighlights(highlightedContent: string): string[] {
    const highlights: string[] = [];
    const matches = highlightedContent.match(/<mark>(.*?)<\/mark>/g);

    if (matches) {
      for (const match of matches) {
        const text = match.replace(/<\/?mark>/g, '');
        highlights.push(text);
      }
    }

    return highlights.slice(0, 5); // Limit to 5 highlights
  }

  /**
   * Get surrounding context for a chunk
   */
  private async getContext(chunk: any): Promise<{ before: string; after: string }> {
    try {
      const chunks = await this.db.getChunksByDocument(chunk.documentId);
      const currentIndex = chunks.findIndex(c => c.id === chunk.id);

      let before = '';
      let after = '';

      // Get previous chunk
      if (currentIndex > 0) {
        before = chunks[currentIndex - 1].content.substring(0, 200);
      }

      // Get next chunk
      if (currentIndex < chunks.length - 1) {
        after = chunks[currentIndex + 1].content.substring(0, 200);
      }

      return { before, after };
    } catch {
      return { before: '', after: '' };
    }
  }

  /**
   * Apply filters to search results
   */
  private matchesFilters(chunk: any, filters?: any): boolean {
    if (!filters) return true;

    // File name filter
    if (filters.fileName && !chunk.metadata.fileName.toLowerCase().includes(filters.fileName.toLowerCase())) {
      return false;
    }

    // Complexity filter
    if (filters.complexity && chunk.metadata.complexity !== filters.complexity) {
      return false;
    }

    // Section filter
    if (filters.section && !chunk.metadata.section.toLowerCase().includes(filters.section.toLowerCase())) {
      return false;
    }

    return true;
  }

  /**
   * Get search suggestions
   */
  async getSuggestions(partial: string): Promise<string[]> {
    // Simple suggestion system based on common terms
    const commonTerms = [
      'specification', 'architecture', 'implementation', 'API', 'backend',
      'frontend', 'design', 'policy', 'security', 'performance',
      'database', 'cache', 'server', 'client', 'protocol'
    ];

    return commonTerms
      .filter(term => term.toLowerCase().includes(partial.toLowerCase()))
      .slice(0, 5);
  }

  /**
   * Get popular searches
   */
  async getPopularSearches(): Promise<string[]> {
    // This would typically be implemented with analytics
    // For now, return static popular searches
    return [
      'API design patterns',
      'Security implementation',
      'Performance optimization',
      'Database schema',
      'UI components'
    ];
  }
}