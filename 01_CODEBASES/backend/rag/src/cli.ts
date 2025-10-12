#!/usr/bin/env node
/**
 * RAG CLI Interface
 * ==================
 *
 * Command-line interface for RAG system management
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import RAGSystem from './index.js';

const program = new Command();
const rag = new RAGSystem();

program
  .name('rag-cli')
  .description('LocalBrain RAG Index CLI - Fast specification search and indexing')
  .version('1.0.0');

// Index command
program
  .command('index')
  .description('Index all specification files')
  .option('-f, --force', 'Force reindex all files')
  .action(async (options) => {
    const spinner = ora('🔍 Indexing specifications...').start();

    try {
      const startTime = Date.now();
      await rag.index();
      const duration = Date.now() - startTime;

      spinner.succeed(`✅ Indexing complete in ${(duration / 1000).toFixed(2)}s`);
    } catch (error) {
      spinner.fail('❌ Indexing failed');
      console.error(chalk.red('Error:'), error);
      process.exit(1);
    }
  });

// Search command
program
  .command('search')
  .description('Search the RAG index')
  .argument('<query>', 'Search query')
  .option('-l, --limit <number>', 'Maximum results', '10')
  .option('-t, --threshold <number>', 'Relevance threshold', '0.1')
  .action(async (query, options) => {
    const spinner = ora(`🔍 Searching for: "${query}"`).start();

    try {
      const { RAGSearch } = await import('./search/index.js');
      const searcher = new RAGSearch(rag.getDatabase());

      const result = await searcher.search({
        text: query,
        limit: parseInt(options.limit),
        threshold: parseFloat(options.threshold)
      });

      spinner.stop();

      if (result.success && result.data.length > 0) {
        console.log(chalk.green(`\n🎯 Found ${result.data.length} results:`));

        result.data.forEach((item: any, index: number) => {
          console.log(chalk.cyan(`\n${index + 1}. ${item.chunk.metadata.fileName}`));
          console.log(chalk.gray(`   Score: ${(item.score * 100).toFixed(1)}%`));
          console.log(chalk.gray(`   Section: ${item.chunk.metadata.section}`));

          if (item.highlights.length > 0) {
            console.log(chalk.yellow(`   Highlights: ${item.highlights.join(', ')}`));
          }

          console.log(chalk.gray(`   Content: ${item.chunk.content.substring(0, 200)}...`));
        });

        console.log(chalk.blue(`\n⏱️  Query time: ${result.timing.query}ms`));
      } else {
        console.log(chalk.yellow('No results found'));
      }

    } catch (error) {
      spinner.fail('❌ Search failed');
      console.error(chalk.red('Error:'), error);
      process.exit(1);
    }
  });

// Server command
program
  .command('server')
  .description('Start the RAG search API server')
  .option('-p, --port <number>', 'Port number', '3001')
  .action(async (options) => {
    console.log(chalk.blue('🚀 Starting RAG Search API Server...'));

    try {
      await rag.startServer(parseInt(options.port));
    } catch (error) {
      console.error(chalk.red('❌ Failed to start server:'), error);
      process.exit(1);
    }
  });

// Stats command
program
  .command('stats')
  .description('Show index statistics')
  .action(async () => {
    try {
      const stats = await rag.getDatabase().getIndexStats();

      console.log(chalk.blue('📊 RAG Index Statistics:'));
      console.log(chalk.cyan(`   Documents: ${stats.totalDocuments}`));
      console.log(chalk.cyan(`   Chunks: ${stats.totalChunks}`));
      console.log(chalk.cyan(`   Average Chunks/Doc: ${stats.averageChunksPerDoc}`));
      console.log(chalk.cyan(`   Total Size: ${(stats.totalSize / 1024 / 1024).toFixed(2)} MB`));
      console.log(chalk.cyan(`   Last Indexed: ${stats.lastIndexed.toLocaleString()}`));

    } catch (error) {
      console.error(chalk.red('❌ Failed to get stats:'), error);
      process.exit(1);
    }
  });

// Refresh command
program
  .command('refresh')
  .description('Refresh the index')
  .action(async () => {
    const spinner = ora('🔄 Refreshing index...').start();

    try {
      await rag.index();
      spinner.succeed('✅ Index refreshed');
    } catch (error) {
      spinner.fail('❌ Refresh failed');
      console.error(chalk.red('Error:'), error);
      process.exit(1);
    }
  });

// Cleanup command
program
  .command('cleanup')
  .description('Remove stale documents from index')
  .action(async () => {
    const spinner = ora('🧹 Cleaning up stale documents...').start();

    try {
      await rag.getDatabase().cleanup();
      spinner.succeed('✅ Cleanup complete');
    } catch (error) {
      spinner.fail('❌ Cleanup failed');
      console.error(chalk.red('Error:'), error);
      process.exit(1);
    }
  });

// Parse and execute
program.parse();