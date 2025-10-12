//
//  RAGSystem.swift
//  LocalBrain
//
//  Purpose: Retrieval-Augmented Generation system with vector stores
//  Created: 2025-10-06 (Infrastructure Day!)
//  Integrates: Document processing, embedding generation, vector similarity search
//

import Foundation
import CoreML
import NaturalLanguage
import Accelerate

@Observable
class RAGSystem {
    // MARK: - Components
    private let databaseManager: DatabaseManager
    private let documentProcessor: GraniteDoclingProcessor
    private let embeddingGenerator: EmbeddingGenerator
    private let vectorStore: VectorStore

    // MARK: - Configuration
    private let maxChunkSize = 500
    private let chunkOverlap = 50
    private let similarityThreshold: Float = 0.7

    // MARK: - State
    @Published var isProcessing = false
    @Published var processingProgress: Double = 0.0
    @Published var currentOperation: String = ""

    // MARK: - Initialization
    init() {
        self.databaseManager = DatabaseManager()
        self.documentProcessor = GraniteDoclingProcessor()
        self.embeddingGenerator = EmbeddingGenerator()
        self.vectorStore = VectorStore()

        print("🔍 RAGSystem initialized with vector stores")
    }

    // MARK: - Document Processing Pipeline
    func processDocument(url: URL, projectId: String) async -> ProcessResult {
        isProcessing = true
        currentOperation = "Processing document: \(url.lastPathComponent)"
        processingProgress = 0.0

        defer {
            isProcessing = false
            processingProgress = 0.0
            currentOperation = ""
        }

        do {
            // Step 1: Create context source
            processingProgress = 0.1
            guard let contextSource = databaseManager.addContextSource(
                projectId: projectId,
                sourceType: .document,
                sourcePath: url.path
            ) else {
                throw RAGError.failedToCreateContextSource
            }

            // Step 2: Process document with Granite-Docling
            processingProgress = 0.3
            let processedDocument = try await documentProcessor.processDocument(url)

            // Step 3: Chunk document content
            processingProgress = 0.5
            let chunks = chunkDocument(processedDocument, sourceId: contextSource.id)

            // Step 4: Generate embeddings for chunks
            processingProgress = 0.7
            let embeddings = try await generateEmbeddings(for: chunks)

            // Step 5: Store chunks and vectors
            processingProgress = 0.9
            try await storeChunksAndVectors(chunks: chunks, embeddings: embeddings)

            // Step 6: Update vector store index
            processingProgress = 1.0
            try await vectorStore.updateIndex()

            return ProcessResult(
                success: true,
                chunksProcessed: chunks.count,
                vectorsGenerated: embeddings.count,
                processingTime: Date()
            )

        } catch {
            print("❌ Document processing failed: \(error)")
            return ProcessResult(
                success: false,
                error: error.localizedDescription,
                processingTime: Date()
            )
        }
    }

    // MARK: - Document Chunking
    private func chunkDocument(_ document: ProcessedDocument, sourceId: String) -> [DocumentChunk] {
        var chunks: [DocumentChunk] = []
        let content = document.content

        // Split content into sentences first
        let tokenizer = NLTokenizer(unit: .sentence)
        tokenizer.string = content

        var sentences: [String] = []
        tokenizer.enumerateTokens(in: content.beginIndex..<content.endIndex) { tokenRange, _ in
            let sentence = String(content[tokenRange]).trimmingCharacters(in: .whitespacesAndNewlines)
            if !sentence.isEmpty {
                sentences.append(sentence)
            }
            return true
        }

        // Group sentences into chunks
        var currentChunk = ""
        var chunkIndex = 0

        for sentence in sentences {
            if currentChunk.count + sentence.count + 1 > maxChunkSize {
                if !currentChunk.isEmpty {
                    let chunk = DocumentChunk(
                        id: UUID().uuidString,
                        sourceId: sourceId,
                        chunkIndex: chunkIndex,
                        content: currentChunk.trimmingCharacters(in: .whitespacesAndNewlines),
                        metadata: [
                            "documentTitle": document.title,
                            "documentType": document.type,
                            "pageCount": document.pageCount,
                            "wordCount": currentChunk.components(separatedBy: .whitespaces).count,
                            "chunkIndex": chunkIndex
                        ]
                    )
                    chunks.append(chunk)
                    chunkIndex += 1
                }
                currentChunk = sentence
            } else {
                currentChunk += (currentChunk.isEmpty ? "" : " ") + sentence
            }
        }

        // Add final chunk if not empty
        if !currentChunk.isEmpty {
            let chunk = DocumentChunk(
                id: UUID().uuidString,
                sourceId: sourceId,
                chunkIndex: chunkIndex,
                content: currentChunk.trimmingCharacters(in: .whitespacesAndNewlines),
                metadata: [
                    "documentTitle": document.title,
                    "documentType": document.type,
                    "pageCount": document.pageCount,
                    "wordCount": currentChunk.components(separatedBy: .whitespaces).count,
                    "chunkIndex": chunkIndex
                ]
            )
            chunks.append(chunk)
        }

        print("📄 Document chunked into \(chunks.count) chunks")
        return chunks
    }

    // MARK: - Embedding Generation
    private func generateEmbeddings(for chunks: [DocumentChunk]) async throws -> [ChunkEmbedding] {
        var embeddings: [ChunkEmbedding] = []

        for (index, chunk) in chunks.enumerated() {
            do {
                let vector = try await embeddingGenerator.generateEmbedding(for: chunk.content)

                let embedding = ChunkEmbedding(
                    chunkId: chunk.id,
                    vector: vector,
                    model: "text-embedding-ada-002",
                    dimensions: vector.count,
                    generatedAt: Date()
                )
                embeddings.append(embedding)

                // Update progress
                processingProgress = 0.7 + (Double(index + 1) / Double(chunks.count)) * 0.2

            } catch {
                print("❌ Failed to generate embedding for chunk \(chunk.id): \(error)")
                throw RAGError.embeddingGenerationFailed
            }
        }

        print("🧠 Generated \(embeddings.count) embeddings")
        return embeddings
    }

    // MARK: - Storage Operations
    private func storeChunksAndVectors(chunks: [DocumentChunk], embeddings: [ChunkEmbedding]) async throws {
        guard let db = databaseManager.mainDB else {
            throw RAGError.databaseNotAvailable
        }

        // Store chunks in database
        for chunk in chunks {
            let sql = """
            INSERT INTO rag_chunks (id, source_id, chunk_index, content, metadata, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """

            var statement: OpaquePointer?
            if sqlite3_prepare_v2(db, sql, -1, &statement, nil) == SQLITE_OK {
                sqlite3_bind_text(statement, 1, chunk.id, -1, nil)
                sqlite3_bind_text(statement, 2, chunk.sourceId, -1, nil)
                sqlite3_bind_int(statement, 3, Int32(chunk.chunkIndex))
                sqlite3_bind_text(statement, 4, chunk.content, -1, nil)

                let metadataData = try JSONSerialization.data(withJSONObject: chunk.metadata)
                let metadataString = String(data: metadataData, encoding: .utf8)
                sqlite3_bind_text(statement, 5, metadataString, -1, nil)

                let now = ISO8601DateFormatter().string(from: Date())
                sqlite3_bind_text(statement, 6, now, -1, nil)

                if sqlite3_step(statement) != SQLITE_DONE {
                    throw RAGError.databaseInsertFailed
                }
            }
            sqlite3_finalize(statement)
        }

        // Store vectors in vector store
        for embedding in embeddings {
            if let vectorId = databaseManager.storeVector(
                chunkId: embedding.chunkId,
                vectorData: embedding.vector,
                model: embedding.model
            ) {
                await vectorStore.addVector(
                    id: vectorId,
                    chunkId: embedding.chunkId,
                    vector: embedding.vector
                )
            }
        }

        print("💾 Stored \(chunks.count) chunks and \(embeddings.count) vectors")
    }

    // MARK: - Similarity Search
    func search(query: String, projectId: String, limit: Int = 5) async -> [SearchResult] {
        do {
            // Generate embedding for query
            let queryVector = try await embeddingGenerator.generateEmbedding(for: query)

            // Search vector store
            let similarVectors = await vectorStore.searchSimilar(
                queryVector: queryVector,
                limit: limit * 2, // Get more to filter
                threshold: similarityThreshold
            )

            // Convert to search results with metadata
            var results: [SearchResult] = []

            for vectorResult in similarVectors {
                if let chunk = getChunk(id: vectorResult.chunkId) {
                    let result = SearchResult(
                        chunkId: chunk.id,
                        content: chunk.content,
                        similarity: vectorResult.similarity,
                        metadata: chunk.metadata,
                        sourcePath: getSourcePath(for: chunk.sourceId)
                    )
                    results.append(result)
                }
            }

            // Sort by similarity and limit results
            results.sort { $0.similarity > $1.similarity }
            return Array(results.prefix(limit))

        } catch {
            print("❌ Search failed: \(error)")
            return []
        }
    }

    // MARK: - Context Retrieval
    func retrieveContext(query: String, projectId: String, maxTokens: Int = 4000) async -> RetrievedContext {
        let searchResults = await search(query: query, projectId: projectId)
        var contextChunks: [ContextChunk] = []
        var totalTokens = 0

        for result in searchResults {
            let tokens = approximateTokenCount(result.content)
            if totalTokens + tokens <= maxTokens {
                let contextChunk = ContextChunk(
                    content: result.content,
                    sourcePath: result.sourcePath,
                    metadata: result.metadata,
                    relevanceScore: result.similarity
                )
                contextChunks.append(contextChunk)
                totalTokens += tokens
            }
        }

        return RetrievedContext(
            query: query,
            chunks: contextChunks,
            totalTokens: totalTokens,
            retrievedAt: Date()
        )
    }

    // MARK: - Helper Methods
    private func getChunk(id: String) -> DocumentChunk? {
        guard let db = databaseManager.mainDB else { return nil }

        let sql = "SELECT * FROM rag_chunks WHERE id = ?"
        var statement: OpaquePointer?

        if sqlite3_prepare_v2(db, sql, -1, &statement, nil) == SQLITE_OK {
            sqlite3_bind_text(statement, 1, id, -1, nil)

            if sqlite3_step(statement) == SQLITE_ROW {
                let chunkId = String(cString: sqlite3_column_text(statement, 0))
                let sourceId = String(cString: sqlite3_column_text(statement, 1))
                let chunkIndex = Int(sqlite3_column_int(statement, 2))
                let content = String(cString: sqlite3_column_text(statement, 3))

                if let metadataData = sqlite3_column_text(statement, 4),
                   let metadataString = String(cString: metadataData, encoding: .utf8),
                   let metadata = try? JSONSerialization.jsonObject(with: metadataString.data(using: .utf8)!) as? [String: Any] {

                    sqlite3_finalize(statement)

                    return DocumentChunk(
                        id: chunkId,
                        sourceId: sourceId,
                        chunkIndex: chunkIndex,
                        content: content,
                        metadata: metadata
                    )
                }
            }
        }
        sqlite3_finalize(statement)

        return nil
    }

    private func getSourcePath(for sourceId: String) -> String {
        guard let db = databaseManager.mainDB else { return "" }

        let sql = "SELECT source_path FROM context_sources WHERE id = ?"
        var statement: OpaquePointer?

        if sqlite3_prepare_v2(db, sql, -1, &statement, nil) == SQLITE_OK {
            sqlite3_bind_text(statement, 1, sourceId, -1, nil)

            if sqlite3_step(statement) == SQLITE_ROW {
                let path = String(cString: sqlite3_column_text(statement, 0))
                sqlite3_finalize(statement)
                return path
            }
        }
        sqlite3_finalize(statement)

        return ""
    }

    private func approximateTokenCount(_ text: String) -> Int {
        // Rough estimation: ~4 characters per token
        return Int(text.count / 4)
    }
}

// MARK: - Supporting Classes

class GraniteDoclingProcessor {
    func processDocument(_ url: URL) async throws -> ProcessedDocument {
        // This would integrate with the actual Granite-Docling service
        // For now, return a mock processed document

        let content = try String(contentsOf: url)

        return ProcessedDocument(
            title: url.lastPathComponent,
            type: url.pathExtension,
            content: content,
            pageCount: 1,
            metadata: [
                "fileSize": content.count,
                "lastModified": url.lastPathComponent
            ]
        )
    }
}

class EmbeddingGenerator {
    func generateEmbedding(for text: String) async throws -> [Float] {
        // This would integrate with actual embedding service
        // For now, return mock embedding (1536 dimensions for OpenAI ada-002)
        return Array(repeating: Float.random(in: -1...1), count: 1536)
    }
}

class VectorStore {
    private var vectors: [VectorStorage] = []

    func addVector(id: String, chunkId: String, vector: [Float]) async {
        let storage = VectorStorage(
            id: id,
            chunkId: chunkId,
            vector: vector,
            normalizedVector: normalizeVector(vector)
        )
        vectors.append(storage)
    }

    func searchSimilar(queryVector: [Float], limit: Int, threshold: Float) async -> [VectorSearchResult] {
        let normalizedQuery = normalizeVector(queryVector)
        var results: [VectorSearchResult] = []

        for vector in vectors {
            let similarity = cosineSimilarity(normalizedQuery, vector.normalizedVector)
            if similarity >= threshold {
                let result = VectorSearchResult(
                    chunkId: vector.chunkId,
                    similarity: similarity
                )
                results.append(result)
            }
        }

        results.sort { $0.similarity > $1.similarity }
        return Array(results.prefix(limit))
    }

    func updateIndex() async throws {
        // Update FAISS/HNSW index here
        print("📊 Vector index updated")
    }

    private func normalizeVector(_ vector: [Float]) -> [Float] {
        let magnitude = sqrt(vector.reduce(0) { $0 + $1 * $1 })
        return vector.map { $0 / Float(magnitude) }
    }

    private func cosineSimilarity(_ vec1: [Float], _ vec2: [Float]) -> Float {
        let dotProduct = zip(vec1, vec2).reduce(0) { $0 + $1 * $2 }
        return dotProduct
    }
}

// MARK: - Data Models
struct ProcessedDocument {
    let title: String
    let type: String
    let content: String
    let pageCount: Int
    let metadata: [String: Any]
}

struct DocumentChunk {
    let id: String
    let sourceId: String
    let chunkIndex: Int
    let content: String
    let metadata: [String: Any]
}

struct ChunkEmbedding {
    let chunkId: String
    let vector: [Float]
    let model: String
    let dimensions: Int
    let generatedAt: Date
}

struct VectorStorage {
    let id: String
    let chunkId: String
    let vector: [Float]
    let normalizedVector: [Float]
}

struct VectorSearchResult {
    let chunkId: String
    let similarity: Float
}

struct SearchResult {
    let chunkId: String
    let content: String
    let similarity: Float
    let metadata: [String: Any]
    let sourcePath: String
}

struct ContextChunk {
    let content: String
    let sourcePath: String
    let metadata: [String: Any]
    let relevanceScore: Float
}

struct RetrievedContext {
    let query: String
    let chunks: [ContextChunk]
    let totalTokens: Int
    let retrievedAt: Date
}

struct ProcessResult {
    let success: Bool
    let chunksProcessed: Int?
    let vectorsGenerated: Int?
    let error: String?
    let processingTime: Date

    init(success: Bool, chunksProcessed: Int? = nil, vectorsGenerated: Int? = nil, error: String? = nil, processingTime: Date) {
        self.success = success
        self.chunksProcessed = chunksProcessed
        self.vectorsGenerated = vectorsGenerated
        self.error = error
        self.processingTime = processingTime
    }
}

enum RAGError: Error {
    case failedToCreateContextSource
    case embeddingGenerationFailed
    case databaseNotAvailable
    case databaseInsertFailed
    case documentProcessingFailed
}