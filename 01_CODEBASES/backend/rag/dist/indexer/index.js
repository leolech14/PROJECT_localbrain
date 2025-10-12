/**
 * RAG Indexer
 * ============
 *
 * Efficient document chunking and indexing system
 */
import { promises as fs } from 'fs';
import path from 'path';
import { glob } from 'glob';
import { DEFAULT_CONFIG, PARSING_RULES, FILE_PATTERNS } from '../config/index.js';
export class RAGIndexer {
    db;
    config = DEFAULT_CONFIG;
    constructor(database) {
        this.db = database;
    }
    /**
     * Index all specification files
     */
    async indexAll() {
        console.log('🚀 Starting RAG indexing for LocalBrain specifications...');
        const startTime = Date.now();
        // Find all markdown files
        const files = await this.findSpecFiles();
        console.log(`📄 Found ${files.length} specification files`);
        let processedCount = 0;
        let updatedCount = 0;
        let totalChunks = 0;
        for (const filePath of files) {
            try {
                const stats = await fs.stat(filePath);
                const mtime = stats.mtime;
                // Check if document exists and is up to date
                const existingDoc = await this.db.getDocumentByPath(filePath);
                if (existingDoc && existingDoc.updatedAt >= mtime) {
                    processedCount++;
                    continue;
                }
                // Process document
                const result = await this.indexDocument(filePath);
                updatedCount++;
                totalChunks += result.chunkCount;
                console.log(`✅ Indexed: ${path.basename(filePath)} (${result.chunkCount} chunks)`);
            }
            catch (error) {
                console.error(`❌ Failed to index ${filePath}:`, error);
            }
        }
        // Cleanup stale documents
        await this.db.cleanup();
        const duration = Date.now() - startTime;
        const stats = await this.db.getIndexStats();
        console.log('\n🎉 RAG Indexing Complete!');
        console.log(`📊 Statistics:`);
        console.log(`   - Total Documents: ${stats.totalDocuments}`);
        console.log(`   - Total Chunks: ${stats.totalChunks}`);
        console.log(`   - Processed: ${processedCount}`);
        console.log(`   - Updated: ${updatedCount}`);
        console.log(`   - Duration: ${(duration / 1000).toFixed(2)}s`);
        console.log(`   - Rate: ${Math.round(totalChunks / (duration / 1000))} chunks/sec`);
    }
    /**
     * Index a single document
     */
    async indexDocument(filePath) {
        const content = await fs.readFile(filePath, 'utf-8');
        const fileName = path.basename(filePath);
        const title = this.extractTitle(content) || fileName;
        // Create chunks
        const chunks = await this.createChunks(content, filePath);
        // Store document
        const documentId = await this.db.storeDocument({
            filePath,
            fileName,
            title,
            content,
            chunkCount: chunks.length,
            fileSize: Buffer.byteLength(content, 'utf8')
        });
        // Remove old chunks for this document
        await this.db.deleteDocument(documentId);
        await this.db.storeDocument({
            filePath,
            fileName,
            title,
            content,
            chunkCount: chunks.length,
            fileSize: Buffer.byteLength(content, 'utf8')
        });
        // Store chunks
        for (const chunk of chunks) {
            await this.db.storeChunk({
                ...chunk,
                documentId
            });
        }
        return { chunkCount: chunks.length };
    }
    /**
     * Find all specification files
     */
    async findSpecFiles() {
        const patterns = FILE_PATTERNS.INCLUDE.map(pattern => path.join(this.config.specBasePath, pattern));
        const files = [];
        for (const pattern of patterns) {
            const matches = await glob(pattern);
            files.push(...matches);
        }
        // Remove duplicates and excluded files
        const uniqueFiles = [...new Set(files)];
        return uniqueFiles.filter(file => {
            return !FILE_PATTERNS.EXCLUDE.some(exclude => file.includes(exclude.replace('**/', '').replace('/**', '')));
        });
    }
    /**
     * Create intelligent chunks from content
     */
    async createChunks(content, filePath) {
        const chunks = [];
        const fileName = path.basename(filePath);
        // Extract metadata
        const metadata = this.extractMetadata(content, fileName);
        // Split content into sections
        const sections = this.splitIntoSections(content);
        let chunkIndex = 0;
        for (const section of sections) {
            // Create chunks within each section
            const sectionChunks = this.chunkSection(section, metadata, chunkIndex);
            chunks.push(...sectionChunks);
            chunkIndex += sectionChunks.length;
        }
        return chunks;
    }
    /**
     * Extract title from markdown content
     */
    extractTitle(content) {
        const lines = content.split('\n');
        for (const line of lines) {
            const match = line.match(/^#\s+(.+)$/);
            if (match) {
                return match[1].trim();
            }
        }
        return null;
    }
    /**
     * Extract metadata from content
     */
    extractMetadata(content, fileName) {
        const headers = [];
        let codeBlocks = 0;
        let links = 0;
        let tables = 0;
        const lines = content.split('\n');
        let currentSection = '';
        for (const line of lines) {
            // Extract headers
            const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
            if (headerMatch) {
                headers.push(headerMatch[2].trim());
                currentSection = headerMatch[2].trim();
            }
            // Count code blocks
            if (line.match(/^```/)) {
                codeBlocks++;
            }
            // Count links
            if (line.match(/\[.*?\]\(.*?\)/)) {
                links++;
            }
            // Count tables
            if (line.match(/\|.*\|/)) {
                tables++;
            }
        }
        // Determine complexity
        let complexity = 'low';
        if (codeBlocks > 5 || tables > 3 || links > 10) {
            complexity = 'high';
        }
        else if (codeBlocks > 2 || tables > 1 || links > 5) {
            complexity = 'medium';
        }
        return {
            fileName,
            filePath: '',
            section: currentSection,
            headers,
            codeBlocks,
            links,
            tables,
            complexity
        };
    }
    /**
     * Split content into logical sections
     */
    splitIntoSections(content) {
        const sections = [];
        const lines = content.split('\n');
        let currentSection = [];
        let currentLevel = 0;
        for (const line of lines) {
            const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
            if (headerMatch) {
                const level = headerMatch[1].length;
                // Start new section if this is a top-level header
                if (level <= 2 && currentSection.length > 0) {
                    sections.push(currentSection.join('\n'));
                    currentSection = [line];
                }
                else {
                    currentSection.push(line);
                }
                currentLevel = level;
            }
            else {
                currentSection.push(line);
            }
        }
        // Add final section
        if (currentSection.length > 0) {
            sections.push(currentSection.join('\n'));
        }
        return sections.filter(section => section.trim().length > PARSING_RULES.MIN_CHUNK_LENGTH);
    }
    /**
     * Chunk a section into optimal pieces
     */
    chunkSection(section, metadata, startIndex) {
        const chunks = [];
        const content = section.trim();
        // T018 REQUIREMENT: 800-character chunks with overlap
        const CHUNK_SIZE = 800;
        const CHUNK_OVERLAP = 100;
        // If content is small enough, return as single chunk
        if (content.length <= CHUNK_SIZE) {
            return [{
                    id: this.generateChunkId(),
                    documentId: '',
                    chunkIndex: startIndex,
                    content,
                    startChar: 0,
                    endChar: content.length,
                    metadata: { ...metadata, section: this.extractSectionTitle(section), chunkSize: content.length }
                }];
        }
        // Split larger content with 800-char requirement and 100-char overlap
        let currentPos = 0;
        let chunkIndex = startIndex;
        while (currentPos < content.length) {
            let endPos = Math.min(currentPos + CHUNK_SIZE, content.length);
            // Try to break at sentence or paragraph boundaries
            if (endPos < content.length) {
                const breakPoint = this.findBreakPoint(content, currentPos, endPos);
                if (breakPoint > currentPos) {
                    endPos = breakPoint;
                }
            }
            const chunkContent = content.substring(currentPos, endPos).trim();
            if (chunkContent.length > PARSING_RULES.MIN_CHUNK_LENGTH) {
                chunks.push({
                    id: this.generateChunkId(),
                    documentId: '',
                    chunkIndex,
                    content: chunkContent,
                    startChar: currentPos,
                    endChar: endPos,
                    metadata: {
                        ...metadata,
                        section: this.extractSectionTitle(section),
                        chunkSize: chunkContent.length,
                        chunkTarget: CHUNK_SIZE,
                        overlapApplied: endPos < content.length ? CHUNK_OVERLAP : 0
                    }
                });
                chunkIndex++;
            }
            // Move to next position with overlap for context preservation
            currentPos = Math.max(0, endPos - CHUNK_OVERLAP);
        }
        return chunks;
    }
    /**
     * Find optimal break point for chunking
     */
    findBreakPoint(content, start, end) {
        const segment = content.substring(start, end);
        // Look for sentence endings
        const sentences = segment.match(/([.!?])\s+/g);
        if (sentences && sentences.length > 0) {
            const lastSentence = sentences[sentences.length - 1];
            return start + segment.indexOf(lastSentence) + lastSentence.length;
        }
        // Look for paragraph breaks
        const paragraphs = segment.match(/\n\n+/);
        if (paragraphs && paragraphs.length > 0) {
            const lastParagraph = paragraphs[paragraphs.length - 1];
            return start + segment.indexOf(lastParagraph);
        }
        // Look for line breaks
        const lines = segment.match(/\n/);
        if (lines && lines.length > 0) {
            const lastLine = lines[lines.length - 1];
            return start + segment.indexOf(lastLine);
        }
        return end;
    }
    /**
     * Extract section title
     */
    extractSectionTitle(section) {
        const lines = section.split('\n');
        for (const line of lines) {
            const match = line.match(/^#{1,6}\s+(.+)$/);
            if (match) {
                return match[1].trim();
            }
        }
        return 'Introduction';
    }
    generateChunkId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}
//# sourceMappingURL=index.js.map