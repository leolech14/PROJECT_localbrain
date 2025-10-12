//
//  ContextManager.swift
//  LocalBrain
//
//  Purpose: Advanced context management and indexing system
//  Created: 2025-10-06 (Infrastructure Day!)
//  Manages: Context pools, file indexing, relationship mapping, AI integration
//

import Foundation
import CoreML
import NaturalLanguage

@Observable
class ContextManager {
    // MARK: - Core Components
    private let databaseManager: DatabaseManager
    private let ragSystem: RAGSystem

    // MARK: - Configuration
    private let baseDirectory: URL
    private let maxContextSize = 8000 // tokens
    private let contextRetentionDays = 30

    // MARK: - State
    @Published var activeContexts: [ActiveContext] = []
    @Published var isIndexing = false
    @Published var indexingProgress: Double = 0.0

    // MARK: - Initialization
    init() {
        self.databaseManager = DatabaseManager()
        self.ragSystem = RAGSystem()

        self.baseDirectory = FileManager.default.urls(for: .libraryDirectory, in: .userDomainMask).first!
            .appendingPathComponent("LocalBrain-v2/knowledge-base/context-pool")

        createContextPoolStructure()
        loadActiveContexts()

        print("🧠 ContextManager initialized with advanced indexing capabilities")
    }

    // MARK: - Context Pool Structure
    private func createContextPoolStructure() {
        let contextTypes = [
            "ai-conversations",
            "file-contexts",
            "web-contexts",
            "system-contexts"
        ]

        for contextType in contextTypes {
            let contextDir = baseDirectory.appendingPathComponent(contextType)
            try? FileManager.default.createDirectory(at: contextDir, withIntermediateDirectories: true)

            // Create index files
            let indexFile = contextDir.appendingPathComponent("context-index.json")
            if !FileManager.default.fileExists(atPath: indexFile.path) {
                createInitialIndex(at: indexFile, type: contextType)
            }
        }

        // Create ontology directory
        let ontologyDir = baseDirectory.appendingPathComponent("../ontology")
        try? FileManager.default.createDirectory(at: ontologyDir, withIntermediateDirectories: true)

        createOntologyStructure(at: ontologyDir)
    }

    private func createInitialIndex(at indexFile: URL, type: String) {
        let initialIndex: [String: Any] = [
            "type": type,
            "created_at": ISO8601DateFormatter().string(from: Date()),
            "last_updated": ISO8601DateFormatter().string(from: Date()),
            "contexts": [:],
            "relationships": [:],
            "metadata": [
                "total_contexts": 0,
                "total_relationships": 0,
                "index_version": "1.0"
            ]
        ]

        do {
            let data = try JSONSerialization.data(withJSONObject: initialIndex)
            try data.write(to: indexFile)
        } catch {
            print("❌ Failed to create initial index: \(error)")
        }
    }

    private func createOntologyStructure(at ontologyDir: URL) {
        let ontologyFiles = [
            ("entities.json", [:] as [String: Any]),
            ("relationships.json", [:] as [String: Any]),
            ("concepts.json", [:] as [String: Any])
        ]

        for (filename, initialData) in ontologyFiles {
            let file = ontologyDir.appendingPathComponent(filename)
            if !FileManager.default.fileExists(atPath: file.path) {
                do {
                    let data = try JSONSerialization.data(withJSONObject: initialData)
                    try data.write(to: file)
                } catch {
                    print("❌ Failed to create ontology file \(filename): \(error)")
                }
            }
        }
    }

    // MARK: - Context Creation and Management
    func createAIConversationContext(projectId: String, conversationId: String, title: String) -> String {
        let contextId = UUID().uuidString
        let aiConversationsDir = baseDirectory.appendingPathComponent("ai-conversations")

        let contextData: [String: Any] = [
            "id": contextId,
            "type": "ai-conversation",
            "project_id": projectId,
            "conversation_id": conversationId,
            "title": title,
            "created_at": ISO8601DateFormatter().string(from: Date()),
            "last_updated": ISO8601DateFormatter().string(from: Date()),
            "messages": [],
            "summary": "",
            "key_points": [],
            "entities": [],
            "context_tokens": 0,
            "metadata": [
                "auto_summary": true,
                "entity_extraction": true,
                "context_window": maxContextSize
            ]
        ]

        let contextFile = aiConversationsDir.appendingPathComponent("\(contextId).json")
        saveContextData(contextData, to: contextFile)

        // Update active contexts
        let activeContext = ActiveContext(
            id: contextId,
            type: .aiConversation,
            projectId: projectId,
            title: title,
            createdAt: Date(),
            lastUpdated: Date(),
            tokenCount: 0
        )
        activeContexts.append(activeContext)

        // Update index
        updateContextIndex(contextType: "ai-conversations", context: contextData)

        print("💬 Created AI conversation context: \(contextId)")
        return contextId
    }

    func createFileContext(filePath: URL, projectId: String) async -> String {
        let contextId = UUID().uuidString
        let fileContextsDir = baseDirectory.appendingPathComponent("file-contexts")

        let fileHash = calculateFileHash(filePath)
        let contextData: [String: Any] = [
            "id": contextId,
            "type": "file-context",
            "project_id": projectId,
            "file_path": filePath.path,
            "file_hash": fileHash,
            "file_name": filePath.lastPathComponent,
            "file_size": getFileSize(filePath),
            "content_type": filePath.pathExtension,
            "created_at": ISO8601DateFormatter().string(from: Date()),
            "last_updated": ISO8601DateFormatter().string(from: Date()),
            "analysis": [
                "language": detectLanguage(filePath),
                "framework": detectFramework(filePath),
                "purpose": inferPurpose(filePath),
                "dependencies": [],
                "functions": [],
                "classes": [],
                "imports": []
            ],
            "context_tokens": 0,
            "metadata": [
                "auto_update": true,
                "track_changes": true,
                "extract_symbols": true
            ]
        ]

        let contextFile = fileContextsDir.appendingPathComponent("\(contextId).json")
        saveContextData(contextData, to: contextFile)

        // Add to active contexts
        let activeContext = ActiveContext(
            id: contextId,
            type: .fileContext,
            projectId: projectId,
            title: filePath.lastPathComponent,
            createdAt: Date(),
            lastUpdated: Date(),
            tokenCount: 0
        )
        activeContexts.append(activeContext)

        // Process file for detailed analysis
        await processFileForContext(filePath: filePath, contextId: contextId)

        print("📄 Created file context: \(contextId)")
        return contextId
    }

    func createWebContext(sessionId: String, url: URL, title: String) -> String {
        let contextId = UUID().uuidString
        let webContextsDir = baseDirectory.appendingPathComponent("web-contexts")

        let contextData: [String: Any] = [
            "id": contextId,
            "type": "web-context",
            "session_id": sessionId,
            "url": url.absoluteString,
            "title": title,
            "created_at": ISO8601DateFormatter().string(from: Date()),
            "last_updated": ISO8601DateFormatter().string(from: Date()),
            "content": [
                "page_text": "",
                "metadata": [:],
                "links": [],
                "images": []
            ],
            "context_tokens": 0,
            "metadata": [
                "auto_extract": true,
                "follow_links": false,
                "extract_images": false
            ]
        ]

        let contextFile = webContextsDir.appendingPathComponent("\(contextId).json")
        saveContextData(contextData, to: contextFile)

        // Add to active contexts
        let activeContext = ActiveContext(
            id: contextId,
            type: .webContext,
            projectId: nil,
            title: title,
            createdAt: Date(),
            lastUpdated: Date(),
            tokenCount: 0
        )
        activeContexts.append(activeContext)

        print("🌐 Created web context: \(contextId)")
        return contextId
    }

    // MARK: - Context Processing
    private func processFileForContext(filePath: URL, contextId: String) async {
        isIndexing = true
        indexingProgress = 0.0

        defer {
            isIndexing = false
            indexingProgress = 0.0
        }

        do {
            let content = try String(contentsOf: filePath)

            // Analyze content based on file type
            let analysis = await analyzeFileContent(content, filePath: filePath)

            // Update context with analysis
            updateContextWithAnalysis(contextId: contextId, analysis: analysis)

            // Extract entities and relationships
            let entities = extractEntities(from: content)
            let relationships = extractRelationships(from: content, entities: entities)

            // Update ontology
            updateOntology(entities: entities, relationships: relationships)

            // Calculate context tokens
            let tokens = approximateTokenCount(content)
            updateContextTokenCount(contextId: contextId, tokens: tokens)

            indexingProgress = 1.0

        } catch {
            print("❌ Failed to process file for context: \(error)")
        }
    }

    private func analyzeFileContent(_ content: String, filePath: URL) async -> [String: Any] {
        let fileExtension = filePath.pathExtension.lowercased()

        switch fileExtension {
        case "swift":
            return await analyzeSwiftCode(content)
        case "py":
            return await analyzePythonCode(content)
        case "js", "ts":
            return await analyzeJavaScriptCode(content)
        case "md":
            return analyzeMarkdown(content)
        default:
            return analyzeGenericContent(content)
        }
    }

    private func analyzeSwiftCode(_ content: String) async -> [String: Any] {
        let framework = detectSwiftFramework(content)
        let functions = extractSwiftFunctions(content)
        let classes = extractSwiftClasses(content)
        let imports = extractSwiftImports(content)

        return [
            "language": "swift",
            "framework": framework,
            "functions": functions,
            "classes": classes,
            "imports": imports,
            "complexity": calculateCodeComplexity(content),
            "lines_of_code": content.components(separatedBy: .newlines).count
        ]
    }

    private func analyzePythonCode(_ content: String) async -> [String: Any] {
        let framework = detectPythonFramework(content)
        let functions = extractPythonFunctions(content)
        let classes = extractPythonClasses(content)
        let imports = extractPythonImports(content)

        return [
            "language": "python",
            "framework": framework,
            "functions": functions,
            "classes": classes,
            "imports": imports,
            "complexity": calculateCodeComplexity(content),
            "lines_of_code": content.components(separatedBy: .newlines).count
        ]
    }

    private func analyzeJavaScriptCode(_ content: String) async -> [String: Any] {
        let framework = detectJavaScriptFramework(content)
        let functions = extractJavaScriptFunctions(content)
        let imports = extractJavaScriptImports(content)

        return [
            "language": "javascript",
            "framework": framework,
            "functions": functions,
            "imports": imports,
            "complexity": calculateCodeComplexity(content),
            "lines_of_code": content.components(separatedBy: .newlines).count
        ]
    }

    private func analyzeMarkdown(_ content: String) -> [String: Any] {
        let headers = extractMarkdownHeaders(content)
        let links = extractMarkdownLinks(content)
        let codeBlocks = extractMarkdownCodeBlocks(content)

        return [
            "language": "markdown",
            "structure": [
                "headers": headers,
                "links": links,
                "code_blocks": codeBlocks
            ],
            "word_count": content.components(separatedBy: .whitespaces).count,
            "reading_time": Int(content.components(separatedBy: .whitespaces).count / 200)
        ]
    }

    private func analyzeGenericContent(_ content: String) -> [String: Any] {
        return [
            "language": "text",
            "word_count": content.components(separatedBy: .whitespaces).count,
            "character_count": content.count,
            "estimated_reading_time": Int(content.components(separatedBy: .whitespaces).count / 200)
        ]
    }

    // MARK: - Context Retrieval
    func retrieveContextForQuery(_ query: String, projectId: String?, maxTokens: Int = 4000) async -> RetrievedContextBundle {
        let relevantContexts = findRelevantContexts(query: query, projectId: projectId)
        var contextBundle = RetrievedContextBundle(
            query: query,
            contexts: [],
            totalTokens: 0,
            retrievedAt: Date()
        )

        var accumulatedTokens = 0

        for context in relevantContexts {
            if accumulatedTokens >= maxTokens {
                break
            }

            let contextData = loadContextData(id: context.id, type: context.type.rawValue)
            let contextTokens = approximateTokenCount(extractContextText(contextData))

            if accumulatedTokens + contextTokens <= maxTokens {
                let retrievedContext = RetrievedContext(
                    id: context.id,
                    type: context.type,
                    content: extractContextText(contextData),
                    metadata: contextData["metadata"] as? [String: Any] ?? [:],
                    relevanceScore: calculateRelevanceScore(query: query, context: contextData),
                    tokens: contextTokens
                )
                contextBundle.contexts.append(retrievedContext)
                accumulatedTokens += contextTokens
            }
        }

        contextBundle.totalTokens = accumulatedTokens
        return contextBundle
    }

    // MARK: - Entity and Relationship Extraction
    private func extractEntities(from content: String) -> [Entity] {
        var entities: [Entity] = []

        // Use NLTK-style entity recognition
        let tagger = NLTagger(tagSchemes: [.nameType])
        tagger.string = content

        var currentEntity = ""
        var currentType: String?

        tagger.enumerateTags(in: content.beginIndex..<content.endIndex, unit: .word, scheme: .nameType) { tag, tokenRange in
            let word = String(content[tokenRange])
            let tagRaw = tag.rawValue

            if tagRaw.hasPrefix("N") || tagRaw.hasPrefix("ORG") || tagRaw.hasPrefix("PERSON") {
                if let existingType = currentType, existingType == tagRaw {
                    currentEntity += " " + word
                } else {
                    if !currentEntity.isEmpty {
                        entities.append(Entity(
                            name: currentEntity.trimmingCharacters(in: .whitespaces),
                            type: currentType ?? "UNKNOWN",
                            confidence: 0.8
                        ))
                    }
                    currentEntity = word
                    currentType = tagRaw
                }
            } else {
                if !currentEntity.isEmpty {
                    entities.append(Entity(
                        name: currentEntity.trimmingCharacters(in: .whitespaces),
                        type: currentType ?? "UNKNOWN",
                        confidence: 0.8
                    ))
                }
                currentEntity = ""
                currentType = nil
            }
            return true
        }

        // Add final entity if exists
        if !currentEntity.isEmpty {
            entities.append(Entity(
                name: currentEntity.trimmingCharacters(in: .whitespaces),
                type: currentType ?? "UNKNOWN",
                confidence: 0.8
            ))
        }

        return entities
    }

    private func extractRelationships(from content: String, entities: [Entity]) -> [Relationship] {
        var relationships: [Relationship] = []

        // Simple pattern-based relationship extraction
        for i in 0..<entities.count {
            for j in (i+1)..<entities.count {
                let entity1 = entities[i]
                let entity2 = entities[j]

                // Check if entities appear close to each other in text
                if entitiesAppearTogether(content, entity1: entity1.name, entity2: entity2.name) {
                    let relationship = Relationship(
                        sourceId: entity1.name,
                        targetId: entity2.name,
                        type: inferRelationshipType(entity1: entity1, entity2: entity2),
                        strength: calculateRelationshipStrength(content, entity1: entity1, entity2: entity2)
                    )
                    relationships.append(relationship)
                }
            }
        }

        return relationships
    }

    // MARK: - Helper Methods
    private func saveContextData(_ data: [String: Any], to file: URL) {
        do {
            let jsonData = try JSONSerialization.data(withJSONObject: data)
            try jsonData.write(to: file)
        } catch {
            print("❌ Failed to save context data: \(error)")
        }
    }

    private func loadContextData(id: String, type: String) -> [String: Any] {
        let contextDir = baseDirectory.appendingPathComponent(type)
        let contextFile = contextDir.appendingPathComponent("\(id).json")

        do {
            let data = try Data(contentsOf: contextFile)
            return try JSONSerialization.jsonObject(with: data) as? [String: Any] ?? [:]
        } catch {
            print("❌ Failed to load context data: \(error)")
            return [:]
        }
    }

    private func extractContextText(_ contextData: [String: Any]) -> String {
        switch contextData["type"] as? String {
        case "ai-conversation":
            return extractConversationText(contextData)
        case "file-context":
            return extractFileText(contextData)
        case "web-context":
            return extractWebText(contextData)
        default:
            return ""
        }
    }

    private func extractConversationText(_ data: [String: Any]) -> String {
        guard let messages = data["messages"] as? [[String: Any]] else { return "" }

        return messages.compactMap { message in
            if let content = message["content"] as? String,
               let role = message["role"] as? String {
                return "\(role.capitalized): \(content)"
            }
            return nil
        }.joined(separator: "\n")
    }

    private func extractFileText(_ data: [String: Any]) -> String {
        // This would contain the actual file content
        return data["content"] as? String ?? ""
    }

    private func extractWebText(_ data: [String: Any]) -> String {
        guard let content = data["content"] as? [String: Any] else { return "" }
        return content["page_text"] as? String ?? ""
    }

    // Additional helper methods for Swift/Python/JS analysis...
    private func detectSwiftFramework(_ content: String) -> String {
        if content.contains("import SwiftUI") { return "SwiftUI" }
        if content.contains("import UIKit") { return "UIKit" }
        if content.contains("import Foundation") { return "Foundation" }
        return "Swift"
    }

    private func extractSwiftFunctions(_ content: String) -> [[String: Any]] {
        // Extract Swift functions using regex or parsing
        return []
    }

    private func extractSwiftClasses(_ content: String) -> [[String: Any]] {
        // Extract Swift classes using regex or parsing
        return []
    }

    private func extractSwiftImports(_ content: String) -> [String] {
        // Extract Swift imports
        return []
    }

    private func calculateCodeComplexity(_ content: String) -> Int {
        // Simple complexity calculation
        return content.components(separatedBy: .newlines).count
    }

    // More helper methods...
    private func calculateFileHash(_ url: URL) -> String {
        do {
            let data = try Data(contentsOf: url)
            let digest = Insecure.SHA256.hash(data: data)
            return digest.compactMap { String(format: "%02x", $0) }.joined()
        } catch {
            return UUID().uuidString
        }
    }

    private func getFileSize(_ url: URL) -> Int64 {
        do {
            let resourceValues = try url.resourceValues(forKeys: [.fileSizeKey])
            return resourceValues.fileSize ?? 0
        } catch {
            return 0
        }
    }

    private func detectLanguage(_ url: URL) -> String {
        return url.pathExtension
    }

    private func detectFramework(_ url: URL) -> String {
        return url.pathExtension
    }

    private func inferPurpose(_ url: URL) -> String {
        return "Document"
    }

    private func approximateTokenCount(_ text: String) -> Int {
        return Int(text.count / 4)
    }

    private func updateContextIndex(contextType: String, context: [String: Any]) {
        // Update the context index file
    }

    private func updateContextWithAnalysis(contextId: String, analysis: [String: Any]) {
        // Update context with analysis results
    }

    private func updateOntology(entities: [Entity], relationships: [Relationship]) {
        // Update ontology files
    }

    private func updateContextTokenCount(contextId: String, tokens: Int) {
        // Update context token count
    }

    private func loadActiveContexts() {
        // Load active contexts from storage
    }

    private func findRelevantContexts(query: String, projectId: String?) -> [ActiveContext] {
        // Find contexts relevant to query
        return activeContexts
    }

    private func calculateRelevanceScore(query: String, context: [String: Any]) -> Float {
        // Calculate relevance score between query and context
        return 0.5
    }

    private func entitiesAppearTogether(_ content: String, entity1: String, entity2: String) -> Bool {
        // Check if entities appear close to each other
        return true
    }

    private func inferRelationshipType(entity1: Entity, entity2: Entity) -> String {
        // Infer relationship type between entities
        return "RELATED_TO"
    }

    private func calculateRelationshipStrength(_ content: String, entity1: Entity, entity2: Entity) -> Float {
        // Calculate relationship strength
        return 0.5
    }
}

// MARK: - Supporting Models
struct ActiveContext {
    let id: String
    let type: ContextType
    let projectId: String?
    let title: String
    let createdAt: Date
    let lastUpdated: Date
    let tokenCount: Int
}

enum ContextType {
    case aiConversation
    case fileContext
    case webContext
    case systemContext

    var rawValue: String {
        switch self {
        case .aiConversation: return "ai-conversation"
        case .fileContext: return "file-context"
        case .webContext: return "web-context"
        case .systemContext: return "system-context"
        }
    }
}

struct Entity {
    let name: String
    let type: String
    let confidence: Float
}

struct Relationship {
    let sourceId: String
    let targetId: String
    let type: String
    let strength: Float
}

struct RetrievedContextBundle {
    let query: String
    let contexts: [RetrievedContext]
    let totalTokens: Int
    let retrievedAt: Date
}

struct RetrievedContext {
    let id: String
    let type: ContextType
    let content: String
    let metadata: [String: Any]
    let relevanceScore: Float
    let tokens: Int
}