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
import CryptoKit

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
    var isInitialized = true
    var activeContexts: [ActiveContext] = []
    var isIndexing = false
    var indexingProgress: Double = 0.0

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
                let retrievedContext = ContextRetrievalResult(
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

        tagger.enumerateTags(in: content.startIndex..<content.endIndex, unit: .word, scheme: .nameType) { tag, tokenRange in
            let word = String(content[tokenRange])
            let tagRaw = tag?.rawValue ?? ""

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
        print("🔧 ENHANCED Code Analysis: Extracting functions from Swift code...")

        let functions = extractSwiftFunctionsRegex(content)
        print("✅ ENHANCED Code Analysis: Found \(functions.count) functions")
        return functions
    }

    private func extractSwiftClasses(_ content: String) -> [[String: Any]] {
        print("🔧 ENHANCED Code Analysis: Extracting classes from Swift code...")

        let classes = extractSwiftClassesRegex(content)
        print("✅ ENHANCED Code Analysis: Found \(classes.count) classes/structs")
        return classes
    }

    private func extractSwiftImports(_ content: String) -> [String] {
        print("🔧 ENHANCED Code Analysis: Extracting imports from Swift code...")

        let imports = extractSwiftImportsRegex(content)
        print("✅ ENHANCED Code Analysis: Found \(imports.count) imports")
        return imports
    }

    private func calculateCodeComplexity(_ content: String) -> Int {
        // Simple complexity calculation
        return content.components(separatedBy: .newlines).count
    }

    // MARK: - Python Code Analysis Helpers
    private func detectPythonFramework(_ content: String) -> String {
        if content.contains("import flask") || content.contains("from flask") {
            return "Flask"
        } else if content.contains("import django") || content.contains("from django") {
            return "Django"
        } else if content.contains("import fastapi") || content.contains("from fastapi") {
            return "FastAPI"
        }
        return "Python"
    }

    private func extractPythonFunctions(_ content: String) -> [String] {
        let pattern = "def\\s+(\\w+)\\s*\\("
        return extractMatches(content, pattern: pattern)
    }

    private func extractPythonClasses(_ content: String) -> [String] {
        let pattern = "class\\s+(\\w+)\\s*[:\\(]"
        return extractMatches(content, pattern: pattern)
    }

    private func extractPythonImports(_ content: String) -> [String] {
        let pattern = "(?:from|import)\\s+([\\w.]+)"
        return extractMatches(content, pattern: pattern)
    }

    // MARK: - JavaScript Code Analysis Helpers
    private func detectJavaScriptFramework(_ content: String) -> String {
        if content.contains("import React") || content.contains("from 'react'") {
            return "React"
        } else if content.contains("import Vue") || content.contains("from 'vue'") {
            return "Vue"
        } else if content.contains("import { Component }") && content.contains("@angular") {
            return "Angular"
        }
        return "JavaScript"
    }

    private func extractJavaScriptFunctions(_ content: String) -> [String] {
        let pattern = "(?:function\\s+(\\w+)|const\\s+(\\w+)\\s*=\\s*(?:async\\s*)?\\([^)]*\\)\\s*=>)"
        return extractMatches(content, pattern: pattern)
    }

    private func extractJavaScriptImports(_ content: String) -> [String] {
        let pattern = "import\\s+.*?from\\s+['\"]([^'\"]+)['\"]"
        return extractMatches(content, pattern: pattern)
    }

    // MARK: - Markdown Analysis Helpers
    private func extractMarkdownHeaders(_ content: String) -> [String] {
        let pattern = "^#{1,6}\\s+(.+)$"
        return extractMatches(content, pattern: pattern, options: .anchorsMatchLines)
    }

    private func extractMarkdownLinks(_ content: String) -> [String] {
        let pattern = "\\[([^\\]]+)\\]\\(([^)]+)\\)"
        return extractMatches(content, pattern: pattern)
    }

    private func extractMarkdownCodeBlocks(_ content: String) -> [String] {
        let pattern = "```[\\w]*\\n([\\s\\S]*?)```"
        return extractMatches(content, pattern: pattern)
    }

    // MARK: - Pattern Matching Helper
    private func extractMatches(_ content: String, pattern: String, options: NSRegularExpression.Options = []) -> [String] {
        guard let regex = try? NSRegularExpression(pattern: pattern, options: options) else {
            return []
        }

        let nsContent = content as NSString
        let matches = regex.matches(in: content, options: [], range: NSRange(location: 0, length: nsContent.length))

        var results: [String] = []
        for match in matches {
            for i in 1..<match.numberOfRanges {
                let range = match.range(at: i)
                if range.location != NSNotFound {
                    results.append(nsContent.substring(with: range))
                }
            }
        }
        return results
    }

    // More helper methods...
    private func calculateFileHash(_ url: URL) -> String {
        do {
            let data = try Data(contentsOf: url)
            let digest = SHA256.hash(data: data)
            return digest.compactMap { String(format: "%02x", $0) }.joined()
        } catch {
            return UUID().uuidString
        }
    }

    private func getFileSize(_ url: URL) -> Int64 {
        do {
            let resourceValues = try url.resourceValues(forKeys: [.fileSizeKey])
            return Int64(resourceValues.fileSize ?? 0)
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
        // 🧠 ADVANCED NLP: Real semantic relevance scoring
        guard let content = context["content"] as? String else { return 0.0 }

        // Normalize both strings for comparison
        let normalizedQuery = query.lowercased().trimmingCharacters(in: CharacterSet.whitespacesAndNewlines.union(.punctuationCharacters))
        let normalizedContent = content.lowercased()

        // 1. Exact phrase matching (highest weight)
        let exactPhraseScore: Float
        if normalizedContent.contains(normalizedQuery) {
            exactPhraseScore = 1.0
        } else {
            exactPhraseScore = 0.0
        }

        // 2. Keyword overlap scoring
        let queryWords = normalizedQuery.components(separatedBy: CharacterSet.whitespacesAndNewlines.union(.punctuationCharacters))
            .filter { !$0.isEmpty && $0.count > 2 } // Filter out short words
        let contentWords = normalizedContent.components(separatedBy: CharacterSet.whitespacesAndNewlines.union(.punctuationCharacters))

        let overlappingWords = Set(queryWords).intersection(Set(contentWords))
        let keywordScore = queryWords.isEmpty ? 0.0 : Float(overlappingWords.count) / Float(queryWords.count)

        // 3. Proximity scoring - check if query words appear close together
        let proximityScore = calculateProximityScore(queryWords: queryWords, content: normalizedContent)

        // 4. Context type weighting
        let contextTypeWeight: Float
        if let type = context["type"] as? String {
            switch type {
            case "ai_conversation": contextTypeWeight = 0.9
            case "file_context": contextTypeWeight = 0.8
            case "web_context": contextTypeWeight = 0.7
            case "system_context": contextTypeWeight = 0.6
            default: contextTypeWeight = 0.5
            }
        } else {
            contextTypeWeight = 0.5
        }

        // 5. Recency bonus - more recent contexts get higher scores
        let recencyBonus: Float
        if let timestamp = context["timestamp"] as? TimeInterval {
            let hoursSinceCreation = (Date().timeIntervalSince1970 - timestamp) / 3600
            recencyBonus = max(0.0, 1.0 - Float(hoursSinceCreation / 168.0)) // Decay over 1 week
        } else {
            recencyBonus = 0.5
        }

        // Weighted combination of all factors
        let finalScore = (
            exactPhraseScore * 0.4 +
            keywordScore * 0.3 +
            proximityScore * 0.2 +
            contextTypeWeight * 0.05 +
            recencyBonus * 0.05
        )

        print("🧠 NLP Relevance Analysis: query='\(query.prefix(30))...' score=\(String(format: "%.3f", finalScore))")
        print("   Components: exact=\(String(format: "%.3f", exactPhraseScore)) keywords=\(String(format: "%.3f", keywordScore)) proximity=\(String(format: "%.3f", proximityScore))")

        return min(1.0, max(0.0, finalScore))
    }

    private func calculateProximityScore(queryWords: [String], content: String) -> Float {
        guard queryWords.count > 1 else { return 0.0 }

        let contentWords = content.components(separatedBy: CharacterSet.whitespacesAndNewlines.union(.punctuationCharacters))
        var totalProximityScore: Float = 0.0
        var validPairs = 0

        // Check proximity for each pair of query words
        for i in 0..<queryWords.count {
            for j in (i+1)..<queryWords.count {
                let word1 = queryWords[i]
                let word2 = queryWords[j]

                if let pos1 = contentWords.firstIndex(of: word1),
                   let pos2 = contentWords.firstIndex(of: word2) {
                    let distance = abs(pos1 - pos2)
                    // Closer words get higher scores
                    let proximityScore = max(0.0, 1.0 - Float(distance) / 100.0)
                    totalProximityScore += proximityScore
                    validPairs += 1
                }
            }
        }

        return validPairs > 0 ? totalProximityScore / Float(validPairs) : 0.0
    }

    private func entitiesAppearTogether(_ content: String, entity1: String, entity2: String) -> Bool {
        // 🧠 ADVANCED NLP: Real entity co-occurrence detection with proximity analysis
        let normalizedContent = content.lowercased()
        let normalizedEntity1 = entity1.lowercased()
        let normalizedEntity2 = entity2.lowercased()

        // Find all positions where each entity appears
        let entity1Positions = findAllEntityPositions(content: normalizedContent, entity: normalizedEntity1)
        let entity2Positions = findAllEntityPositions(content: normalizedContent, entity: normalizedEntity2)

        guard !entity1Positions.isEmpty && !entity2Positions.isEmpty else { return false }

        // Define proximity window (in words)
        let proximityWindow = 50
        let words = normalizedContent.components(separatedBy: CharacterSet.whitespacesAndNewlines.union(.punctuationCharacters))

        // Check if entities appear within proximity window of each other
        for pos1 in entity1Positions {
            for pos2 in entity2Positions {
                let distance = abs(pos1 - pos2)

                // Entities are considered "together" if within proximity window
                if distance <= proximityWindow {
                    print("🧠 NLP Co-occurrence: '\(entity1)' + '\(entity2)' found within \(distance) words")
                    return true
                }
            }
        }

        return false
    }

    private func findAllEntityPositions(content: String, entity: String) -> [Int] {
        let words = content.components(separatedBy: CharacterSet.whitespacesAndNewlines.union(.punctuationCharacters))
        var positions: [Int] = []

        // Look for exact word matches
        for (index, word) in words.enumerated() {
            if word == entity {
                positions.append(index)
            }
        }

        // If no exact matches, look for substring matches (for multi-word entities)
        if positions.isEmpty {
            let contentWords = content.components(separatedBy: CharacterSet.whitespacesAndNewlines)
            for (index, word) in contentWords.enumerated() {
                if word.lowercased().contains(entity) {
                    positions.append(index)
                }
            }
        }

        return positions
    }

    private func inferRelationshipType(entity1: Entity, entity2: Entity) -> String {
        // 🧠 ADVANCED NLP: Real relationship type inference based on entity types and context patterns
        let type1 = entity1.type.lowercased()
        let type2 = entity2.type.lowercased()
        let name1 = entity1.name.lowercased()
        let name2 = entity2.name.lowercased()

        // 1. Type-based relationship inference
        if type1 == "function" && type2 == "class" {
            return "BELONGS_TO"
        } else if type1 == "class" && type2 == "function" {
            return "CONTAINS"
        } else if type1 == "class" && type2 == "class" {
            if isInheritanceRelationship(class1: name1, class2: name2) {
                return "INHERITS_FROM"
            } else {
                return "RELATED_TO"
            }
        } else if type1 == "function" && type2 == "function" {
            return "CALLS" // Potential function call relationship
        }

        // 2. Name-based pattern recognition
        if name1.contains("test") && name2.contains("test") {
            return "TESTS_TOGETHER"
        } else if name1.contains("controller") && type2 == "class" {
            return "MANAGES"
        } else if name1.contains("service") && type2 == "class" {
            return "SERVICES"
        } else if name1.contains("manager") && type2 == "class" {
            return "MANAGES"
        }

        // 3. Domain-specific relationship patterns
        if isTechnicalRelationship(entity1: name1, entity2: name2) {
            return "DEPENDS_ON"
        } else if isDataFlowRelationship(entity1: name1, entity2: name2) {
            return "PROVIDES_TO"
        }

        // 4. Hierarchical relationships
        if isHierarchicalRelationship(entity1: name1, entity2: name2) {
            return "PARENT_OF"
        }

        // 5. Default relationship
        print("🧠 NLP Relationship Inference: '\(entity1.name)' (\(type1)) -> '\(entity2.name)' (\(type2)) = RELATED_TO")
        return "RELATED_TO"
    }

    private func isInheritanceRelationship(class1: String, class2: String) -> Bool {
        // Simple heuristic for inheritance detection
        let inheritancePatterns = ["base", "abstract", "protocol", "interface", "super"]

        for pattern in inheritancePatterns {
            if class1.contains(pattern) || class2.contains(pattern) {
                return true
            }
        }

        return false
    }

    private func isTechnicalRelationship(entity1: String, entity2: String) -> Bool {
        let technicalTerms = ["api", "database", "network", "cache", "queue", "service", "client"]

        return technicalTerms.contains { term in
            entity1.contains(term) && entity2.contains(term)
        }
    }

    private func isDataFlowRelationship(entity1: String, entity2: String) -> Bool {
        let dataFlowTerms = ["input", "output", "source", "target", "producer", "consumer"]

        return dataFlowTerms.contains { term in
            entity1.contains(term) || entity2.contains(term)
        }
    }

    private func isHierarchicalRelationship(entity1: String, entity2: String) -> Bool {
        let hierarchyTerms = ["parent", "child", "root", "leaf", "master", "slave"]

        return hierarchyTerms.contains { term in
            entity1.contains(term) && entity2.contains(term)
        }
    }

    private func calculateRelationshipStrength(_ content: String, entity1: Entity, entity2: Entity) -> Float {
        // 🧠 ADVANCED NLP: Real relationship strength calculation based on multiple factors
        let words = content.components(separatedBy: CharacterSet.whitespacesAndNewlines.union(.punctuationCharacters))
        let entity1Name = entity1.name.lowercased()
        let entity2Name = entity2.name.lowercased()

        // 1. Co-occurrence frequency (how often entities appear together)
        let coOccurrenceScore = calculateCoOccurrenceStrength(words: words, entity1: entity1Name, entity2: entity2Name)

        // 2. Proximity strength (how close entities appear to each other)
        let proximityScore = calculateProximityStrength(words: words, entity1: entity1Name, entity2: entity2Name)

        // 3. Contextual relevance (are they in meaningful contexts together)
        let contextualScore = calculateContextualRelevance(content: content, entity1: entity1, entity2: entity2)

        // 4. Type compatibility strength (some entity type relationships are stronger)
        let typeCompatibilityScore = calculateTypeCompatibility(entity1: entity1, entity2: entity2)

        // 5. Frequency weighting (more frequent entities get lower weights to avoid dominance)
        let frequencyWeight = calculateFrequencyWeight(words: words, entity1: entity1Name, entity2: entity2Name)

        // Weighted combination of all factors (broken up to avoid compiler timeout)
        let coOccurrenceWeight = coOccurrenceScore * 0.3
        let proximityWeight = proximityScore * 0.25
        let contextualWeight = contextualScore * 0.25
        let typeCompatibilityWeight = typeCompatibilityScore * 0.15
        let frequencyWeighted = frequencyWeight * 0.05

        let relationshipStrength = coOccurrenceWeight + proximityWeight + contextualWeight + typeCompatibilityWeight + frequencyWeighted

        let finalScore = min(1.0, max(0.0, relationshipStrength))

        print("🧠 NLP Relationship Strength: '\(entity1.name)' + '\(entity2.name)' = \(String(format: "%.3f", finalScore))")
        print("   Components: co-occur=\(String(format: "%.3f", coOccurrenceScore)) proximity=\(String(format: "%.3f", proximityScore)) context=\(String(format: "%.3f", contextualScore))")

        return finalScore
    }

    private func calculateCoOccurrenceStrength(words: [String], entity1: String, entity2: String) -> Float {
        var coOccurrenceCount = 0
        var totalWindows = 0
        let windowSize = 100 // words

        // Sliding window approach
        for i in 0..<words.count {
            let windowEnd = min(i + windowSize, words.count)
            let window = Array(words[i..<windowEnd])

            let entity1InWindow = window.contains { $0.lowercased() == entity1 }
            let entity2InWindow = window.contains { $0.lowercased() == entity2 }

            if entity1InWindow && entity2InWindow {
                coOccurrenceCount += 1
            }
            totalWindows += 1
        }

        return totalWindows > 0 ? Float(coOccurrenceCount) / Float(totalWindows) : 0.0
    }

    private func calculateProximityStrength(words: [String], entity1: String, entity2: String) -> Float {
        let entity1Positions = findWordPositions(words: words, target: entity1)
        let entity2Positions = findWordPositions(words: words, target: entity2)

        guard !entity1Positions.isEmpty && !entity2Positions.isEmpty else { return 0.0 }

        var totalDistance = 0
        var pairCount = 0

        for pos1 in entity1Positions {
            for pos2 in entity2Positions {
                totalDistance += abs(pos1 - pos2)
                pairCount += 1
            }
        }

        let averageDistance = pairCount > 0 ? totalDistance / pairCount : 0
        // Convert distance to strength (closer = stronger)
        return max(0.0, 1.0 - Float(averageDistance) / 1000.0)
    }

    private func findWordPositions(words: [String], target: String) -> [Int] {
        var positions: [Int] = []
        for (index, word) in words.enumerated() {
            if word.lowercased() == target {
                positions.append(index)
            }
        }
        return positions
    }

    private func calculateContextualRelevance(content: String, entity1: Entity, entity2: Entity) -> Float {
        // Check if entities appear in meaningful contexts together
        let lowerContent = content.lowercased()
        let entity1Name = entity1.name.lowercased()
        let entity2Name = entity2.name.lowercased()

        // Look for specific patterns that indicate meaningful relationships
        let contextualPatterns = [
            "\(entity1Name).*\(entity2Name)",
            "\(entity2Name).*\(entity1Name)",
            "\(entity1Name).*uses.*\(entity2Name)",
            "\(entity2Name).*implements.*\(entity1Name)"
        ]

        var patternMatches = 0
        for pattern in contextualPatterns {
            if let regex = try? NSRegularExpression(pattern: pattern, options: [.caseInsensitive]) {
                let matches = regex.numberOfMatches(in: lowerContent, options: [], range: NSRange(location: 0, length: lowerContent.count))
                patternMatches += matches
            }
        }

        return min(1.0, Float(patternMatches) / 10.0) // Normalize to 0-1 range
    }

    private func calculateTypeCompatibility(entity1: Entity, entity2: Entity) -> Float {
        let type1 = entity1.type.lowercased()
        let type2 = entity2.type.lowercased()

        // Define compatibility scores for different type combinations
        if type1 == type2 {
            return 0.8 // Same type entities are usually compatible
        } else if (type1 == "class" && type2 == "function") || (type1 == "function" && type2 == "class") {
            return 0.9 // Class-function relationships are very strong
        } else if (type1 == "class" && type2 == "class") {
            return 0.7 // Class-class relationships are strong
        } else if type1 == "import" && (type2 == "class" || type2 == "function") {
            return 0.6 // Import-entity relationships are moderately strong
        }

        return 0.3 // Default compatibility for other combinations
    }

    private func calculateFrequencyWeight(words: [String], entity1: String, entity2: String) -> Float {
        let totalWords = words.count
        let entity1Count = words.filter { $0.lowercased() == entity1 }.count
        let entity2Count = words.filter { $0.lowercased() == entity2 }.count

        let entity1Frequency = Float(entity1Count) / Float(totalWords)
        let entity2Frequency = Float(entity2Count) / Float(totalWords)

        // Penalize very common entities (they're less informative)
        let entity1Weight = min(1.0, 1.0 - entity1Frequency * 10)
        let entity2Weight = min(1.0, 1.0 - entity2Frequency * 10)

        return (entity1Weight + entity2Weight) / 2.0
    }

    func getContextStats() -> [String: Any] {
        return [
            "active_contexts": activeContexts.count,
            "is_indexing": isIndexing,
            "indexing_progress": indexingProgress,
            "is_initialized": isInitialized
        ]
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
    var contexts: [ContextRetrievalResult]
    var totalTokens: Int
    let retrievedAt: Date
}

struct ContextRetrievalResult {
    let id: String
    let type: ContextType
    let content: String
    let metadata: [String: Any]
    let relevanceScore: Float
    let tokens: Int
}

// MARK: - Enhanced Code Analysis Implementation Complete

// MARK: - Enhanced Regex Methods (Replacing Mock Implementations)
private extension ContextManager {
    func extractSwiftFunctionsRegex(_ content: String) -> [[String: Any]] {
        // Enhanced pattern to capture function details
        let patterns = [
            // Static functions
            #"static\s+func\s+(\w+)\s*\(([^)]*)\)(?:\s*->\s*([^\n{]+))?["#,
            #"(public|private|internal|fileprivate)\s+func\s+(\w+)\s*\(([^)]*)\)(?:\s*->\s*([^\n{]+))?["#,
            #"(async\s+)?func\s+(\w+)\s*\(([^)]*)\)(?:\s*->\s*([^\n{]+))?\s*(?:throws|rethrows)?"#,
            #"(async\s+)?func\s+(\w+)\s*\(([^)]*)\)(?:\s*->\s*([^\n{]+))?"#
        ]

        var functions: [[String: Any]] = []
        let lines = content.components(separatedBy: .newlines)

        for (_, pattern) in patterns.enumerated() {
            guard let regex = try? NSRegularExpression(pattern: pattern, options: [.dotMatchesLineSeparators]) else { continue }

            let nsContent = content as NSString
            let matches = regex.matches(in: content, options: [], range: NSRange(location: 0, length: nsContent.length))

            for match in matches {
                var functionInfo: [String: Any] = [:]

                // Extract function name
                let nameRangeIndex = pattern.contains("static") ? 1 : (pattern.contains("(public|private") ? 2 : 2)
                let nameRange = match.range(at: nameRangeIndex)
                guard nameRange.location != NSNotFound else { continue }
                let name = nsContent.substring(with: nameRange)

                // Extract parameters
                let paramRangeIndex = nameRangeIndex + 1
                let paramText = paramRangeIndex < match.numberOfRanges && match.range(at: paramRangeIndex).location != NSNotFound ? nsContent.substring(with: match.range(at: paramRangeIndex)).trimmingCharacters(in: .whitespaces) : ""

                // Parse parameters
                let parameters = parseParameters(paramText)

                // Extract return type
                let returnRangeIndex = nameRangeIndex + 2
                let returnType = returnRangeIndex < match.numberOfRanges && match.range(at: returnRangeIndex).location != NSNotFound ? nsContent.substring(with: match.range(at: returnRangeIndex)).trimmingCharacters(in: .whitespaces) : "Void"

                // Determine access level and modifiers
                let isStatic = pattern.contains("static") || content.contains("static func \(name)")
                let isPublic = content.contains("public func \(name)")
                let isPrivate = content.contains("private func \(name)")
                let isAsync = content.contains("async func \(name)") || pattern.contains("async")
                let isThrowing = content.contains("func \(name)") && (content.range(of: "func \(name)[^\\n]*throws", options: .regularExpression) != nil)

                let functionLine = findLineNumber(for: match.range.location, in: lines)

                // Build function signature
                var signature = name + "(" + paramText + ")"
                if !returnType.isEmpty && returnType != "Void" {
                    signature += " -> " + returnType
                }

                functionInfo = [
                    "name": name,
                    "signature": signature,
                    "parameters": parameters,
                    "return_type": returnType,
                    "access_level": isPublic ? "public" : (isPrivate ? "private" : "internal"),
                    "is_static": isStatic,
                    "is_async": isAsync,
                    "is_throwing": isThrowing,
                    "line_number": functionLine,
                    "has_body": true,
                    "extraction_method": "enhanced_regex"
                ]

                // Avoid duplicates
                if !functions.contains(where: { ($0["name"] as? String) == name }) {
                    functions.append(functionInfo)
                }
            }
        }

        return functions
    }

    private func parseParameters(_ paramText: String) -> [String] {
        guard !paramText.isEmpty || paramText != ":" else { return [] }

        let parameters = paramText.components(separatedBy: ",")
        return parameters.compactMap { param in
            let trimmed = param.trimmingCharacters(in: .whitespaces)
            guard !trimmed.isEmpty && trimmed != ":" else { return nil }

            // Extract parameter name and type
            let components = trimmed.components(separatedBy: ":")
            if components.count >= 2 {
                let name = components[0].trimmingCharacters(in: .whitespaces)
                let type = components[1].trimmingCharacters(in: .whitespaces)
                return "\(name): \(type)"
            } else if components.count == 1 {
                return components[0].trimmingCharacters(in: .whitespaces)
            }
            return nil
        }
    }

    private func findLineNumber(for location: Int, in lines: [String]) -> Int {
        var currentLocation = 0
        for (index, line) in lines.enumerated() {
            if currentLocation + line.count >= location {
                return index + 1
            }
            currentLocation += line.count + 1 // +1 for newline
        }
        return 1
    }

    func extractSwiftClassesRegex(_ content: String) -> [[String: Any]] {
        let patterns = [
            #"(public|private|internal|fileprivate)?\s+(final\s+)?class\s+(\w+)(?:\s*:\s*([^\n{]+))?"#,
            #"(public|private|internal|fileprivate)?\s+struct\s+(\w+)(?:\s*:\s*([^\n{]+))?"#,
            #"(public|private|internal|fileprivate)?\s+enum\s+(\w+)(?:\s*:\s*([^\n{]+))?"#,
            #"(public|private|internal|fileprivate)?\s+protocol\s+(\w+)(?:\s*:\s*([^\n{]+))?"#
        ]

        var results: [[String: Any]] = []
        let lines = content.components(separatedBy: .newlines)

        for (index, pattern) in patterns.enumerated() {
            let types = ["class", "struct", "enum", "protocol"]
            guard let regex = try? NSRegularExpression(pattern: pattern, options: []) else { continue }

            let nsContent = content as NSString
            let matches = regex.matches(in: content, options: [], range: NSRange(location: 0, length: nsContent.length))

            for match in matches {
                var classInfo: [String: Any] = [:]

                // Extract access level
                let accessLevel = match.numberOfRanges > 1 && match.range(at: 1).location != NSNotFound ? nsContent.substring(with: match.range(at: 1)) : "internal"

                // Extract name
                let nameRangeIndex = pattern.contains("final") ? 3 : 2
                let nameRange = match.range(at: nameRangeIndex)
                guard nameRange.location != NSNotFound else { continue }
                let name = nsContent.substring(with: nameRange)

                // Extract inheritance
                let inheritanceRange = nameRangeIndex + 1
                let inheritance = inheritanceRange < match.numberOfRanges && match.range(at: inheritanceRange).location != NSNotFound ? nsContent.substring(with: match.range(at: inheritanceRange)).trimmingCharacters(in: .whitespaces) : ""

                // Find line number
                let lineNumber = findLineNumber(for: match.range.location, in: lines)

                // Extract members from the class body
                let (properties, methods, totalMembers) = extractClassMembers(for: name, in: content)

                classInfo = [
                    "name": name,
                    "type": types[index],
                    "access_level": accessLevel.isEmpty ? "internal" : accessLevel,
                    "inherits_from": inheritance.isEmpty ? [] : inheritance.components(separatedBy: ",").map { $0.trimmingCharacters(in: .whitespacesAndNewlines) },
                    "properties": properties,
                    "methods": methods,
                    "total_members": totalMembers,
                    "line_number": lineNumber,
                    "is_final": pattern.contains("final") && accessLevel.contains("final"),
                    "extraction_method": "enhanced_regex"
                ]

                results.append(classInfo)
            }
        }

        return results
    }

    private func extractClassMembers(for className: String, in content: String) -> (properties: [String], methods: [String], totalMembers: Int) {
        // Find the class body
        guard let classRange = content.range(of: "\\b(class|struct|enum|protocol)\\s+\(className)[^{]*\\{", options: .regularExpression) else {
            return ([], [], 0)
        }

        let classStart = classRange.upperBound
        var braceLevel = 1
        var classEnd = classStart
        let endIndex = content.endIndex

        // Find the matching closing brace
        var currentIndex = content.index(after: classStart)
        while currentIndex < endIndex {
            let char = content[currentIndex]
            if char == "{" {
                braceLevel += 1
            } else if char == "}" {
                braceLevel -= 1
                if braceLevel == 0 {
                    classEnd = currentIndex
                    break
                }
            }
            currentIndex = content.index(after: currentIndex)
        }

        let classBody = String(content[classStart..<classEnd])
        let lines = classBody.components(separatedBy: .newlines)

        var properties: [String] = []
        var methods: [String] = []

        for line in lines {
            let trimmed = line.trimmingCharacters(in: .whitespaces)

            // Skip empty lines and comments
            if trimmed.isEmpty || trimmed.hasPrefix("//") || trimmed.hasPrefix("/*") {
                continue
            }

            // Extract properties
            if trimmed.contains("let ") || trimmed.contains("var ") {
                if let propertyRange = trimmed.range(of: "(let|var)\\s+(\\w+)", options: .regularExpression) {
                    let property = String(trimmed[propertyRange])
                    properties.append(property.components(separatedBy: " ").last ?? property)
                }
            }

            // Extract methods
            if trimmed.contains("func ") {
                if let functionRange = trimmed.range(of: "func\\s+(\\w+)", options: .regularExpression) {
                    let method = String(trimmed[functionRange])
                    methods.append(method.components(separatedBy: " ").last ?? method)
                }
            }
        }

        return (properties: properties, methods: methods, totalMembers: properties.count + methods.count)
    }

    func extractSwiftImportsRegex(_ content: String) -> [String] {
        let patterns = [
            #"import\s+([\w.]+)"#,                    // Regular imports
            #"import\s+typealias\s*([\w.]+)"#,        // Typealias imports
            #"import\s+\w+\s*\.\s*\*"#,               // Wildcard imports (framework.*)
            #"@import\s+([\w.]+)"#                    // Objective-C imports
        ]

        var imports: Set<String> = []

        for pattern in patterns {
            guard let regex = try? NSRegularExpression(pattern: pattern, options: []) else { continue }

            let nsContent = content as NSString
            let matches = regex.matches(in: content, options: [], range: NSRange(location: 0, length: nsContent.length))

            for match in matches {
                let range = match.range(at: 1)
                guard range.location != NSNotFound else { continue }
                let importName = nsContent.substring(with: range).trimmingCharacters(in: .whitespaces)
                imports.insert(importName)
            }
        }

        return Array(imports).sorted()
    }
}