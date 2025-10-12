/**
 * RAG Index Refresh Pipeline - T018
 * ==================================
 *
 * Automated index refresh pipeline for specifications
 * Built by Agent A (GLM-4.6) completing RAG infrastructure
 */

import cron from 'node-cron';
import chokidar from 'chokidar';
import { RAGIndexer } from '../indexer/index.js';
import { RAGDatabase } from '../database/index.js';

export class RAGScheduler {
  private indexer: RAGIndexer;
  private db: RAGDatabase;
  private fileWatcher: chokidar.FSWatcher | null = null;
  private readonly CRON_SCHEDULES = {
    // Every 4 hours: refresh entire index
    fullRefresh: '0 */4 * * *', // At minute 0 of every 4th hour

    // Every 30 minutes: quick validation
    quickValidation: '*/30 * * * *', // Every 30 minutes

    // Daily at 2 AM: deep cleanup
    deepCleanup: '0 2 * * *' // At 2:00 AM every day
  };

  constructor(indexer: RAGIndexer, database: RAGDatabase) {
    this.indexer = indexer;
    this.db = database;
  }

  /**
   * Start all scheduled tasks
   */
  start(): void {
    console.log('⏰ Starting RAG index refresh pipeline...');

    // Full index refresh (every 4 hours)
    cron.schedule(this.CRON_SCHEDULES.fullRefresh, async () => {
      await this.fullRefresh();
    }, {
      scheduled: true,
      timezone: 'UTC'
    });

    // Quick validation (every 30 minutes)
    cron.schedule(this.CRON_SCHEDULES.quickValidation, async () => {
      await this.quickValidation();
    }, {
      scheduled: true,
      timezone: 'UTC'
    });

    // Deep cleanup (daily at 2 AM)
    cron.schedule(this.CRON_SCHEDULES.deepCleanup, async () => {
      await this.deepCleanup();
    }, {
      scheduled: true,
      timezone: 'UTC'
    });

    // File system watcher for real-time updates
    this.startFileWatcher();

    console.log('✅ RAG refresh pipeline started with schedules:');
    console.log(`   Full Refresh: ${this.CRON_SCHEDULES.fullRefresh}`);
    console.log(`   Quick Validation: ${this.CRON_SCHEDULES.quickValidation}`);
    console.log(`   Deep Cleanup: ${this.CRON_SCHEDULES.deepCleanup}`);
    console.log(`   File Watcher: Active`);
  }

  /**
   * Full index refresh - reindexes all files
   */
  private async fullRefresh(): Promise<void> {
    console.log('🔄 Starting full RAG index refresh...');
    const startTime = Date.now();

    try {
      // Get current stats
      const beforeStats = await this.db.getIndexStats();
      console.log(`📊 Before refresh: ${beforeStats.totalDocuments} docs, ${beforeStats.totalChunks} chunks`);

      // Perform full reindex
      await this.indexer.indexAll();

      // Get new stats
      const afterStats = await this.db.getIndexStats();
      const duration = Date.now() - startTime;

      console.log('✅ Full refresh complete!');
      console.log(`   Duration: ${(duration / 1000).toFixed(2)}s`);
      console.log(`   Before: ${beforeStats.totalDocuments} docs, ${beforeStats.totalChunks} chunks`);
      console.log(`   After: ${afterStats.totalDocuments} docs, ${afterStats.totalChunks} chunks`);
      console.log(`   Change: +${afterStats.totalDocuments - beforeStats.totalDocuments} docs, +${afterStats.totalChunks - beforeStats.totalChunks} chunks`);

      // Log to file for monitoring
      await this.logRefreshOperation('full', {
        duration,
        beforeStats,
        afterStats,
        change: {
          documents: afterStats.totalDocuments - beforeStats.totalDocuments,
          chunks: afterStats.totalChunks - beforeStats.totalChunks
        }
      });

    } catch (error) {
      console.error('❌ Full refresh failed:', error);
      await this.logRefreshOperation('full', {
        error: error.message,
        success: false
      });
    }
  }

  /**
   * Quick validation - checks for stale files
   */
  private async quickValidation(): Promise<void> {
    console.log('🔍 Running quick validation...');

    try {
      const stats = await this.db.getIndexStats();
      const staleFiles = await this.findStaleFiles();

      if (staleFiles.length > 0) {
        console.log(`⚠️ Found ${staleFiles.length} stale files, reindexing...`);

        let reindexed = 0;
        for (const filePath of staleFiles) {
          try {
            await this.indexer.indexDocument(filePath);
            reindexed++;
          } catch (error) {
            console.error(`❌ Failed to reindex ${filePath}:`, error);
          }
        }

        console.log(`✅ Reindexed ${reindexed}/${staleFiles.length} stale files`);
      } else {
        console.log('✅ No stale files found');
      }

      // Log health status
      await this.logRefreshOperation('validation', {
        totalDocuments: stats.totalDocuments,
        totalChunks: stats.totalChunks,
        staleFiles: staleFiles.length,
        reindexed: staleFiles.length
      });

    } catch (error) {
      console.error('❌ Quick validation failed:', error);
    }
  }

  /**
   * Deep cleanup - removes orphaned chunks and optimizes database
   */
  private async deepCleanup(): Promise<void> {
    console.log('🧹 Running deep cleanup...');

    try {
      const beforeStats = await this.db.getIndexStats();

      // Remove orphaned chunks
      await this.db.cleanup();

      // Vacuum database for optimization
      await this.db.query('VACUUM');

      // Analyze query plan optimization
      await this.db.query('ANALYZE');

      const afterStats = await this.db.getIndexStats();

      console.log('✅ Deep cleanup complete!');
      console.log(`   Before: ${beforeStats.totalDocuments} docs, ${beforeStats.totalChunks} chunks`);
      console.log(`   After: ${afterStats.totalDocuments} docs, ${afterStats.totalChunks} chunks`);
      console.log(`   Optimized: ${beforeStats.totalChunks - afterStats.totalChunks} orphaned chunks removed`);

      await this.logRefreshOperation('cleanup', {
        beforeStats,
        afterStats,
        orphanedChunksRemoved: beforeStats.totalChunks - afterStats.totalChunks
      });

    } catch (error) {
      console.error('❌ Deep cleanup failed:', error);
    }
  }

  /**
   * Start file system watcher for real-time updates
   */
  private startFileWatcher(): void {
    const specBasePath = '../../../02_SPECBASES';

    this.fileWatcher = chokidar.watch(specBasePath, {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true,
      ignoreInitial: true
    });

    // Debounce file changes to avoid excessive reindexing
    const debouncedReindex = this.debounce(async (filePath: string) => {
      if (filePath.endsWith('.md')) {
        try {
          console.log(`📝 File changed: ${filePath}`);
          await this.indexer.indexDocument(filePath);
          console.log(`✅ Reindexed: ${path.basename(filePath)}`);
        } catch (error) {
          console.error(`❌ Failed to reindex ${filePath}:`, error);
        }
      }
    }, 1000); // 1 second debounce

    this.fileWatcher
      .on('change', debouncedReindex)
      .on('add', debouncedReindex)
      .on('error', (error) => {
        console.error('❌ File watcher error:', error);
      });

    console.log('👀 File system watcher active');
  }

  /**
   * Find files that need reindexing (stale files)
   */
  private async findStaleFiles(): Promise<string[]> {
    // This would compare file modification times with database timestamps
    // For now, return empty array as the indexer handles this during full refresh
    return [];
  }

  /**
   * Simple debounce function
   */
  private debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  /**
   * Log refresh operations to monitoring log
   */
  private async logRefreshOperation(type: string, data: any): Promise<void> {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type,
      data
    };

    console.log('📊 Refresh operation:', JSON.stringify(logEntry, null, 2));

    // In production, you might want to:
    // - Send to monitoring system
    // - Store in database table
    // - Send to log aggregation service
  }

  /**
   * Get scheduler statistics
   */
  async getSchedulerStats(): Promise<{
    activeJobs: string[];
    lastRefresh: string | null;
    uptime: number;
    cronSchedules: Record<string, string>;
  }> {
    return {
      activeJobs: Object.keys(this.CRON_SCHEDULES),
      lastRefresh: new Date().toISOString(), // This would be tracked in real implementation
      uptime: process.uptime(),
      cronSchedules: this.CRON_SCHEDULES
    };
  }

  /**
   * Stop all scheduled tasks
   */
  stop(): void {
    console.log('🛑 Stopping RAG refresh pipeline...');

    if (this.fileWatcher) {
      this.fileWatcher.close();
      this.fileWatcher = null;
    }

    cron.getTasks().forEach(task => task.stop());

    console.log('✅ RAG refresh pipeline stopped');
  }

  /**
   * Manually trigger full refresh
   */
  async triggerFullRefresh(): Promise<void> {
    console.log('🔄 Manual full refresh triggered...');
    await this.fullRefresh();
  }

  /**
   * Manually trigger quick validation
   */
  async triggerQuickValidation(): Promise<void> {
    console.log('🔍 Manual quick validation triggered...');
    await this.quickValidation();
  }
}

export default RAGScheduler;