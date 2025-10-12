//
//  InfrastructureTests.swift
//  LocalBrain
//
//  Purpose: Comprehensive integration tests for infrastructure components
//  Created: 2025-10-06 (Infrastructure Day!)
//  Tests: Database, RAG, Projects, Contexts, Docling integration
//

import XCTest
import Foundation

class InfrastructureTests: XCTestCase {

    // MARK: - Test Infrastructure
    private var databaseManager: DatabaseManager!
    private var ragSystem: RAGSystem!
    private var projectManager: ProjectManager!
    private var contextManager: ContextManager!
    private var doclingIntegration: GraniteDoclingIntegration!
    private var infrastructureManager: InfrastructureManager!

    override func setUp() async throws {
        try await super.setUp()

        // Initialize test infrastructure
        databaseManager = DatabaseManager()
        ragSystem = RAGSystem()
        projectManager = ProjectManager()
        contextManager = ContextManager()
        doclingIntegration = GraniteDoclingIntegration()

        // Wait for initialization
        let timeout = TimeInterval(5.0)
        let expectation = XCTestExpectation(description: "Infrastructure initialization")

        Task {
            while !databaseManager.isInitialized ||
                  !ragSystem.isInitialized ||
                  !contextManager.isInitialized ||
                  !doclingIntegration.isInitialized {
                try? await Task.sleep(nanoseconds: 100_000_000) // 0.1 seconds
            }
            expectation.fulfill()
        }

        await fulfillment(of: [expectation], timeout: timeout)

        infrastructureManager = InfrastructureManager.shared
    }

    override func tearDown() async throws {
        infrastructureManager = nil
        doclingIntegration = nil
        contextManager = nil
        projectManager = nil
        ragSystem = nil
        databaseManager = nil

        try await super.tearDown()
    }

    // MARK: - Database Tests

    func testDatabaseInitialization() async throws {
        XCTAssertTrue(databaseManager.isInitialized, "Database manager should be initialized")

        let stats = await databaseManager.getDatabaseStats()
        XCTAssertNotNil(stats, "Database stats should be available")
        XCTAssertGreaterThan(stats.totalProjects, 0, "Should have at least one project")
    }

    func testProjectCreation() async throws {
        let projectType = ProjectType(
            id: "test-type",
            name: "Test Project Type",
            icon: "test",
            description: "Test description"
        )

        let project = projectManager.createProject(
            name: "Test Project",
            type: projectType,
            description: "Test project for unit testing"
        )

        XCTAssertNotNil(project, "Project should be created successfully")
        XCTAssertEqual(project?.name, "Test Project")
        XCTAssertEqual(project?.type, "test-type")

        // Verify project was saved to database
        let projects = projectManager.activeProjects
        XCTAssertTrue(projects.contains { $0.id == project?.id }, "Project should be in active projects")

        // Verify project directory exists
        if let project = project {
            XCTAssertTrue(FileManager.default.fileExists(atPath: project.directoryPath.path),
                         "Project directory should exist")
        }
    }

    func testContextCreation() async throws {
        let projectType = ProjectType(
            id: "test-context",
            name: "Context Test Project",
            icon: "context",
            description: "Test project for context testing"
        )

        let project = projectManager.createProject(
            name: "Context Test Project",
            type: projectType,
            description: "Testing context creation"
        )

        XCTAssertNotNil(project, "Project should be created")

        guard let projectId = project?.id else {
            XCTFail("Project ID should be available")
            return
        }

        // Test AI conversation context
        let conversationId = UUID().uuidString
        let contextId = contextManager.createAIConversationContext(
            projectId: projectId,
            conversationId: conversationId,
            title: "Test Conversation"
        )

        XCTAssertNotNil(contextId, "Context ID should be returned")
        XCTAssertFalse(contextId!.isEmpty, "Context ID should not be empty")

        // Verify context was saved
        let contexts = contextManager.getProjectContexts(projectId: projectId)
        XCTAssertTrue(contexts.contains { $0.id == contextId }, "Context should be saved")
    }

    // MARK: - RAG System Tests

    func testRAGSystemInitialization() async throws {
        XCTAssertTrue(ragSystem.isInitialized, "RAG system should be initialized")

        let stats = await ragSystem.getSystemStats()
        XCTAssertNotNil(stats, "RAG stats should be available")
        XCTAssertGreaterThanOrEqual(stats.totalDocuments, 0, "Document count should be non-negative")
        XCTAssertGreaterThanOrEqual(stats.totalVectors, 0, "Vector count should be non-negative")
    }

    func testDocumentProcessing() async throws {
        // Create a test document
        let testContent = "This is a test document for infrastructure testing. It contains multiple sentences to test chunking and embedding generation."
        let testDocumentURL = createTestDocument(content: testContent)

        // Create project
        let projectType = ProjectType(
            id: "rag-test",
            name: "RAG Test Project",
            icon: "rag",
            description: "Test project for RAG testing"
        )

        let project = projectManager.createProject(
            name: "RAG Test Project",
            type: projectType,
            description: "Testing RAG functionality"
        )

        XCTAssertNotNil(project, "Project should be created")
        guard let projectId = project?.id else {
            XCTFail("Project ID should be available")
            return
        }

        // Process document
        let result = await ragSystem.processDocument(url: testDocumentURL, projectId: projectId)

        XCTAssertTrue(result.success, "Document processing should succeed")
        XCTAssertGreaterThan(result.chunksProcessed ?? 0, 0, "Should process at least one chunk")
        XCTAssertGreaterThan(result.vectorsGenerated ?? 0, 0, "Should generate vectors")

        // Test search functionality
        let searchResults = await ragSystem.search(
            query: "test document",
            projectId: projectId,
            limit: 5
        )

        XCTAssertNotNil(searchResults, "Search results should be available")
        XCTAssertGreaterThan(searchResults?.count ?? 0, 0, "Should find relevant chunks")

        // Clean up
        try? FileManager.default.removeItem(at: testDocumentURL)
    }

    func testVectorSearch() async throws {
        let projectType = ProjectType(
            id: "vector-test",
            name: "Vector Test Project",
            icon: "vector",
            description: "Test project for vector search testing"
        )

        let project = projectManager.createProject(
            name: "Vector Test Project",
            type: projectType,
            description: "Testing vector search functionality"
        )

        guard let projectId = project?.id else {
            XCTFail("Project ID should be available")
            return
        }

        // Create test document
        let testContent = """
        Machine learning is a subset of artificial intelligence that focuses on neural networks.
        Deep learning uses multiple layers to extract high-level features from raw data.
        Natural language processing helps computers understand human language.
        """

        let testDocumentURL = createTestDocument(content: testContent)

        // Process document
        let processResult = await ragSystem.processDocument(url: testDocumentURL, projectId: projectId)
        XCTAssertTrue(processResult.success, "Document processing should succeed")

        // Test semantic search
        let searchResults = await ragSystem.search(
            query: "neural networks and AI",
            projectId: projectId,
            limit: 3
        )

        XCTAssertNotNil(searchResults, "Search results should be available")
        XCTAssertEqual(searchResults?.count, 3, "Should return requested number of results")

        // Verify results are relevant
        if let results = searchResults, let firstResult = results.first {
            XCTAssertTrue(firstResult.content.lowercased().contains("machine") ||
                         firstResult.content.lowercased().contains("artificial") ||
                         firstResult.content.lowercased().contains("learning"),
                         "Search result should be relevant to query")
        }

        // Clean up
        try? FileManager.default.removeItem(at: testDocumentURL)
    }

    // MARK: - Context Manager Tests

    func testContextManagerInitialization() async throws {
        XCTAssertTrue(contextManager.isInitialized, "Context manager should be initialized")

        let stats = contextManager.getContextStats()
        XCTAssertNotNil(stats, "Context stats should be available")
        XCTAssertGreaterThanOrEqual(stats.totalContexts, 0, "Context count should be non-negative")
    }

    func testContextRetrieval() async throws {
        let projectType = ProjectType(
            id: "context-retrieval-test",
            name: "Context Retrieval Test",
            icon: "context",
            description: "Test project for context retrieval"
        )

        let project = projectManager.createProject(
            name: "Context Retrieval Test",
            type: projectType,
            description: "Testing context retrieval functionality"
        )

        guard let projectId = project?.id else {
            XCTFail("Project ID should be available")
            return
        }

        // Create multiple contexts
        let conversationId1 = UUID().uuidString
        let conversationId2 = UUID().uuidString

        let contextId1 = contextManager.createAIConversationContext(
            projectId: projectId,
            conversationId: conversationId1,
            title: "Test Conversation 1"
        )

        let contextId2 = contextManager.createAIConversationContext(
            projectId: projectId,
            conversationId: conversationId2,
            title: "Test Conversation 2"
        )

        XCTAssertNotNil(contextId1, "First context should be created")
        XCTAssertNotNil(contextId2, "Second context should be created")

        // Test context retrieval
        let retrievedBundle = await contextManager.retrieveContextForQuery(
            query: "test conversation",
            projectId: projectId,
            maxTokens: 4000
        )

        XCTAssertNotNil(retrievedBundle, "Retrieved context bundle should be available")
        XCTAssertGreaterThan(retrievedBundle.totalTokens, 0, "Should retrieve context tokens")
        XCTAssertGreaterThan(retrievedBundle.contexts.count, 0, "Should retrieve contexts")
    }

    // MARK: - Docling Integration Tests

    func testDoclingIntegrationInitialization() async throws {
        XCTAssertTrue(doclingIntegration.isInitialized, "Docling integration should be initialized")

        let stats = doclingIntegration.getProcessingStats()
        XCTAssertNotNil(stats, "Processing stats should be available")
    }

    func testDocumentProcessingWorkflow() async throws {
        let projectType = ProjectType(
            id: "docling-test",
            name: "Docling Test Project",
            icon: "docling",
            description: "Test project for Docling integration"
        )

        let project = projectManager.createProject(
            name: "Docling Test Project",
            type: projectType,
            description: "Testing Docling document processing"
        )

        guard let projectId = project?.id else {
            XCTFail("Project ID should be available")
            return
        }

        // Create test document with structured content
        let testContent = """
        # Document Title

        This is a test document with structured content for processing.

        ## Section 1: Introduction
        This section contains introductory content about machine learning and artificial intelligence.

        ## Section 2: Technical Details
        - Neural networks with multiple layers
        - Backpropagation algorithms
        - Gradient descent optimization

        ## Section 3: Applications
        1. Computer vision
        2. Natural language processing
        3. Reinforcement learning
        """

        let testDocumentURL = createTestDocument(content: testContent, extension: "md")

        // Process with Docling integration
        let processResult = await doclingIntegration.processDocument(url: testDocumentURL, projectId: projectId)

        XCTAssertTrue(processResult.success, "Docling processing should succeed")
        XCTAssertNotNil(processResult.document, "Processed document should be available")
        XCTAssertGreaterThan(processResult.document?.pages.count ?? 0, 0, "Should extract pages")

        // Verify document structure
        if let document = processResult.document {
            XCTAssertGreaterThan(document.metadata.chunks.count, 0, "Should create chunks")
            XCTAssertGreaterThan(document.metadata.entities.count, 0, "Should extract entities")
        }

        // Clean up
        try? FileManager.default.removeItem(at: testDocumentURL)
    }

    // MARK: - Infrastructure Manager Tests

    func testInfrastructureManagerInitialization() async throws {
        let status = await infrastructureManager.getSystemStatus()

        XCTAssertTrue(status.initialized, "Infrastructure should be initialized")
        XCTAssertGreaterThan(status.projectsCount, 0, "Should have at least one project")
        XCTAssertNotNil(status.currentProject, "Should have current project")
    }

    func testUnifiedDocumentProcessing() async throws {
        let project = infrastructureManager.getCurrentProject()
        XCTAssertNotNil(project, "Should have current project")

        guard let projectId = project?.id else {
            XCTFail("Project ID should be available")
            return
        }

        // Create test document
        let testContent = "This is a test document for unified infrastructure processing."
        let testDocumentURL = createTestDocument(content: testContent)

        // Process through infrastructure manager
        let result = await infrastructureManager.addDocument(url: testDocumentURL, projectId: projectId)

        XCTAssertTrue(result.success, "Unified document processing should succeed")
        XCTAssertNotNil(result.document, "Should return processed document")
        XCTAssertGreaterThan(result.ragChunksProcessed ?? 0, 0, "Should process RAG chunks")
        XCTAssertGreaterThan(result.ragVectorsGenerated ?? 0, 0, "Should generate vectors")

        // Test search through infrastructure manager
        let searchResults = await infrastructureManager.search(
            query: "test document",
            projectId: projectId,
            maxTokens: 4000
        )

        XCTAssertNotNil(searchResults, "Search results should be available")
        XCTAssertEqual(searchResults.query, "test document")
        XCTAssertGreaterThan(searchResults.ragResults.chunks.count, 0, "Should find RAG results")

        // Clean up
        try? FileManager.default.removeItem(at: testDocumentURL)
    }

    func testInfrastructureHealthCheck() async throws {
        let healthCheck = await infrastructureManager.performHealthCheck()

        XCTAssertNotNil(healthCheck, "Health check should be available")
        XCTAssertNotNil(healthCheck.overallHealth, "Overall health status should be available")
        XCTAssertGreaterThan(healthCheck.checks.count, 0, "Should perform health checks")

        // Verify all components are healthy
        for check in healthCheck.checks {
            XCTAssertEqual(check.status, .healthy, "Component \(check.component) should be healthy: \(check.message)")
        }
    }

    func testInfrastructureStats() async throws {
        let stats = await infrastructureManager.getInfrastructureStats()

        XCTAssertNotNil(stats, "Infrastructure stats should be available")
        XCTAssertGreaterThan(stats.totalProjects, 0, "Should have at least one project")
        XCTAssertGreaterThanOrEqual(stats.totalDocuments, 0, "Document count should be non-negative")
        XCTAssertGreaterThanOrEqual(stats.totalChunks, 0, "Chunk count should be non-negative")
        XCTAssertGreaterThanOrEqual(stats.totalVectors, 0, "Vector count should be non-negative")
        XCTAssertGreaterThanOrEqual(stats.totalStorageUsed, 0, "Storage usage should be non-negative")
        XCTAssertGreaterThanOrEqual(stats.cacheHitRate, 0.0, "Cache hit rate should be non-negative")
        XCTAssertLessThanOrEqual(stats.cacheHitRate, 1.0, "Cache hit rate should not exceed 1.0")
    }

    // MARK: - Performance Tests

    func testConcurrentDocumentProcessing() async throws {
        let project = infrastructureManager.getCurrentProject()
        guard let projectId = project?.id else {
            XCTFail("Project ID should be available")
            return
        }

        // Create multiple test documents
        let documentCount = 5
        var documentURLs: [URL] = []

        for i in 1...documentCount {
            let content = "Test document \(i) with content for concurrent processing testing."
            let documentURL = createTestDocument(content: content, name: "test_doc_\(i)")
            documentURLs.append(documentURL)
        }

        // Process documents concurrently
        let startTime = Date()

        let results = await infrastructureManager.batchAddDocuments(urls: documentURLs, projectId: projectId)

        let processingTime = Date().timeIntervalSince(startTime)

        // Verify results
        XCTAssertEqual(results.count, documentCount, "Should process all documents")

        let successCount = results.filter { $0.success }.count
        XCTAssertEqual(successCount, documentCount, "All documents should be processed successfully")

        // Performance assertion (should process within reasonable time)
        XCTAssertLessThan(processingTime, 30.0, "Concurrent processing should complete within 30 seconds")

        // Clean up
        for url in documentURLs {
            try? FileManager.default.removeItem(at: url)
        }
    }

    func testSearchPerformance() async throws {
        let project = infrastructureManager.getCurrentProject()
        guard let projectId = project?.id else {
            XCTFail("Project ID should be available")
            return
        }

        // Create test document with substantial content
        let content = String(repeating: "This is test content for search performance testing. ", count: 100)
        let testDocumentURL = createTestDocument(content: content)

        // Process document
        let processResult = await infrastructureManager.addDocument(url: testDocumentURL, projectId: projectId)
        XCTAssertTrue(processResult.success, "Document processing should succeed")

        // Measure search performance
        let startTime = Date()

        let searchResults = await infrastructureManager.search(
            query: "test content performance",
            projectId: projectId,
            maxTokens: 4000
        )

        let searchTime = Date().timeIntervalSince(startTime)

        // Verify results
        XCTAssertNotNil(searchResults, "Search results should be available")
        XCTAssertGreaterThan(searchResults.ragResults.chunks.count, 0, "Should find relevant chunks")

        // Performance assertion (search should be fast)
        XCTAssertLessThan(searchTime, 2.0, "Search should complete within 2 seconds")

        // Clean up
        try? FileManager.default.removeItem(at: testDocumentURL)
    }

    // MARK: - Helper Methods

    private func createTestDocument(content: String, name: String = "test_document", extension: String = "txt") -> URL {
        let tempDir = FileManager.default.temporaryDirectory
        let testFileURL = tempDir.appendingPathComponent("\(name)_\(UUID().uuidString).\(extension)")

        do {
            try content.write(to: testFileURL, atomically: true, encoding: .utf8)
        } catch {
            XCTFail("Failed to create test document: \(error)")
        }

        return testFileURL
    }

    private func waitForInitialization(_ timeout: TimeInterval = 10.0) async {
        let startTime = Date()

        while Date().timeIntervalSince(startTime) < timeout {
            if databaseManager.isInitialized &&
               ragSystem.isInitialized &&
               contextManager.isInitialized &&
               doclingIntegration.isInitialized {
                break
            }

            try? await Task.sleep(nanoseconds: 100_000_000) // 0.1 seconds
        }
    }
}

// MARK: - Mock Data for Testing

extension InfrastructureTests {

    func createMockProjectType() -> ProjectType {
        return ProjectType(
            id: "mock-test-type",
            name: "Mock Test Project",
            icon: "mock",
            description: "Mock project for testing purposes"
        )
    }

    func createMockProcessedDocument() -> ProcessedDocument {
        return ProcessedDocument(
            id: UUID().uuidString,
            sourceURL: URL(fileURLWithPath: "/mock/test.pdf"),
            projectId: UUID().uuidString,
            title: "Mock Test Document",
            content: "This is mock content for testing purposes.",
            pages: [
                DocumentPage(
                    pageNumber: 1,
                    content: "Mock page content",
                    boundingBoxes: [],
                    metadata: [:]
                )
            ],
            metadata: DocumentMetadata(
                totalPages: 1,
                totalWords: 10,
                totalCharacters: 45,
                language: "en",
                chunks: [
                    DocumentChunk(
                        id: UUID().uuidString,
                        content: "Mock chunk content",
                        startIndex: 0,
                        endIndex: 45,
                        pageNumber: 1,
                        metadata: [:]
                    )
                ],
                entities: [
                    Entity(
                        name: "Mock Entity",
                        type: .person,
                        confidence: 0.9,
                        startIndex: 0,
                        endIndex: 5
                    )
                ]
            ),
            processedAt: Date(),
            processingStatus: .completed
        )
    }
}