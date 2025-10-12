/**
 * RAG Database Manager
 * ====================
 *
 * SQLite-based storage for RAG index with full-text search
 */
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { promises as fs } from 'fs';
import path from 'path';
import { DEFAULT_CONFIG } from '../config/index.js';
export class RAGDatabase {
    db = null;
    config = DEFAULT_CONFIG;
    constructor(dbPath) {
        this.initialize(dbPath);
    }
    async initialize(dbPath) {
        const databasePath = dbPath || this.config.databasePath;
        // Ensure data directory exists
        const dataDir = path.dirname(databasePath);
        await fs.mkdir(dataDir, { recursive: true });
        this.db = await open({
            filename: databasePath,
            driver: sqlite3.Database
        });
        await this.initializeSchema();
    }
    async initializeSchema() {
        if (!this.db)
            throw new Error('Database not initialized');
        // Documents table
        await this.db.exec(`
      CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        file_path TEXT UNIQUE NOT NULL,
        file_name TEXT NOT NULL,
        title TEXT,
        content TEXT NOT NULL,
        chunk_count INTEGER DEFAULT 0,
        indexed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        file_size INTEGER DEFAULT 0
      )
    `);
        // Chunks table
        await this.db.exec(`
      CREATE TABLE IF NOT EXISTS chunks (
        id TEXT PRIMARY KEY,
        document_id TEXT NOT NULL,
        chunk_index INTEGER NOT NULL,
        content TEXT NOT NULL,
        start_char INTEGER NOT NULL,
        end_char INTEGER NOT NULL,
        metadata TEXT NOT NULL,
        FOREIGN KEY (document_id) REFERENCES documents (id) ON DELETE CASCADE
      )
    `);
        // Virtual table for FTS5
        await this.db.exec(`
      CREATE VIRTUAL TABLE IF NOT EXISTS chunks_fts USING fts5(
        chunk_id UNINDEXED,
        content,
        document_id UNINDEXED,
        file_name,
        title,
        section,
        metadata
      )
    `);
        // Triggers for FTS
        await this.db.exec(`
      CREATE TRIGGER IF NOT EXISTS chunks_fts_insert AFTER INSERT ON chunks
      BEGIN
        INSERT INTO chunks_fts(chunk_id, content, document_id, file_name, title, section, metadata)
        VALUES (new.id, new.content, new.document_id,
                json_extract(new.metadata, '$.fileName'),
                (SELECT title FROM documents WHERE id = new.document_id),
                json_extract(new.metadata, '$.section'),
                new.metadata);
      END
    `);
        // Indexes
        await this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_chunks_document_id ON chunks(document_id);
      CREATE INDEX IF NOT EXISTS idx_chunks_document_order ON chunks(document_id, chunk_index);
      CREATE INDEX IF NOT EXISTS idx_documents_updated ON documents(updated_at);
    `);
    }
    // Document operations
    async storeDocument(document) {
        if (!this.db)
            throw new Error('Database not initialized');
        const id = this.generateId();
        await this.db.run(`
      INSERT OR REPLACE INTO documents
      (id, file_path, file_name, title, content, chunk_count, file_size)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
            id,
            document.filePath,
            document.fileName,
            document.title,
            document.content,
            document.chunkCount,
            document.fileSize
        ]);
        return id;
    }
    async getDocumentByPath(filePath) {
        if (!this.db)
            throw new Error('Database not initialized');
        const row = await this.db.get(`
      SELECT * FROM documents WHERE file_path = ?
    `, [filePath]);
        return row ? {
            id: row.id,
            filePath: row.file_path,
            fileName: row.file_name,
            title: row.title,
            content: row.content,
            chunkCount: row.chunk_count,
            indexedAt: new Date(row.indexed_at),
            updatedAt: new Date(row.updated_at),
            fileSize: row.file_size
        } : null;
    }
    async getAllDocuments() {
        if (!this.db)
            throw new Error('Database not initialized');
        const rows = await this.db.all(`
      SELECT * FROM documents ORDER BY updated_at DESC
    `);
        return rows.map(row => ({
            id: row.id,
            filePath: row.file_path,
            fileName: row.file_name,
            title: row.title,
            content: row.content,
            chunkCount: row.chunk_count,
            indexedAt: new Date(row.indexed_at),
            updatedAt: new Date(row.updated_at),
            fileSize: row.file_size
        }));
    }
    async deleteDocument(documentId) {
        if (!this.db)
            throw new Error('Database not initialized');
        await this.db.run(`DELETE FROM documents WHERE id = ?`, [documentId]);
    }
    // Chunk operations
    async storeChunk(chunk) {
        if (!this.db)
            throw new Error('Database not initialized');
        const id = this.generateId();
        await this.db.run(`
      INSERT OR REPLACE INTO chunks
      (id, document_id, chunk_index, content, start_char, end_char, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
            id,
            chunk.documentId,
            chunk.chunkIndex,
            chunk.content,
            chunk.startChar,
            chunk.endChar,
            JSON.stringify(chunk.metadata)
        ]);
        return id;
    }
    async getChunksByDocument(documentId) {
        if (!this.db)
            throw new Error('Database not initialized');
        const rows = await this.db.all(`
      SELECT * FROM chunks WHERE document_id = ? ORDER BY chunk_index
    `, [documentId]);
        return rows.map(row => ({
            id: row.id,
            documentId: row.document_id,
            chunkIndex: row.chunk_index,
            content: row.content,
            startChar: row.start_char,
            endChar: row.end_char,
            embedding: row.embedding ? Array.from(new Float32Array(row.embedding)) : undefined,
            metadata: JSON.parse(row.metadata)
        }));
    }
    // Search operations
    async searchChunks(query, limit = 10) {
        if (!this.db)
            throw new Error('Database not initialized');
        const rows = await this.db.all(`
      SELECT
        chunks.*,
        documents.title,
        documents.file_name,
        bm25(chunks_fts) as relevance_score
      FROM chunks_fts
      JOIN chunks ON chunks.id = chunks_fts.chunk_id
      JOIN documents ON documents.id = chunks.document_id
      WHERE chunks_fts MATCH ?
      ORDER BY relevance_score
      LIMIT ?
    `, [query, limit]);
        return rows;
    }
    async getDocumentCount() {
        if (!this.db)
            throw new Error('Database not initialized');
        const result = await this.db.get(`SELECT COUNT(*) as count FROM documents`);
        return result.count;
    }
    async getChunkCount() {
        if (!this.db)
            throw new Error('Database not initialized');
        const result = await this.db.get(`SELECT COUNT(*) as count FROM chunks`);
        return result.count;
    }
    async getIndexStats() {
        if (!this.db)
            throw new Error('Database not initialized');
        const docCount = await this.getDocumentCount();
        const chunkCount = await this.getChunkCount();
        const stats = await this.db.get(`
      SELECT
        AVG(file_size) as avg_size,
        MAX(updated_at) as last_indexed,
        SUM(file_size) as total_size
      FROM documents
    `);
        return {
            totalDocuments: docCount,
            totalChunks: chunkCount,
            averageChunksPerDoc: docCount > 0 ? Math.round(chunkCount / docCount * 100) / 100 : 0,
            totalSize: stats.total_size || 0,
            lastIndexed: new Date(stats.last_indexed || Date.now()),
            indexingTime: 0
        };
    }
    // Cleanup
    async cleanup() {
        if (!this.db)
            throw new Error('Database not initialized');
        const documents = await this.getAllDocuments();
        let deletedCount = 0;
        for (const doc of documents) {
            try {
                await fs.access(doc.filePath);
            }
            catch {
                await this.deleteDocument(doc.id);
                deletedCount++;
            }
        }
        console.log(`🧹 Cleaned up ${deletedCount} stale documents`);
    }
    close() {
        if (this.db) {
            this.db.close();
            this.db = null;
        }
    }
    generateId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}
//# sourceMappingURL=index.js.map