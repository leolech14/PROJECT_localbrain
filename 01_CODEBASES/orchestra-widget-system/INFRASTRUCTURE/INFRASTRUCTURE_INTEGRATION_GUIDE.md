# LocalBrain v2.0 Infrastructure Integration Guide

> **Version**: 2.0.0
> **Created**: 2025-10-06 (Infrastructure Day!)
> **Purpose**: Complete guide for integrating and using the LocalBrain v2.0 infrastructure system

## 📋 Overview

The LocalBrain v2.0 Infrastructure System provides a comprehensive foundation for AI-powered workspace management. This guide covers integration, setup, and usage of all infrastructure components.

## 🏗️ Architecture Overview

### Core Components

```
InfrastructureManager (Unified API)
├── DatabaseManager (SQLite databases)
├── RAGSystem (Vector stores & similarity search)
├── ProjectManager (Workspace organization)
├── ContextManager (Context indexing & retrieval)
├── GraniteDoclingIntegration (Document processing)
├── InfrastructureValidation (Health monitoring)
└── InfrastructureSetup (One-click setup)
```

### Data Flow

```
Documents → Granite-Docling → RAG System → Vector Store → Search
Projects → Database Manager → Context Manager → AI Orchestration
```

## 🚀 Quick Start

### 1. Basic Setup

```swift
import SwiftUI

@main
struct LocalBrainApp: App {
    @StateObject private var infrastructure = InfrastructureManager.shared

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(infrastructure)
                .task {
                    if !infrastructure.isInitialized {
                        await waitForInfrastructure()
                    }
                }
        }
    }

    private func waitForInfrastructure() async {
        while !infrastructure.isInitialized {
            try? await Task.sleep(nanoseconds: 100_000_000)
        }
    }
}
```

### 2. One-Click Setup

```swift
struct SetupView: View {
    @StateObject private var setup = InfrastructureSetup()

    var body: some View {
        InfrastructureSetupView()
    }
}
```

### 3. Basic Usage

```swift
struct ContentView: View {
    @EnvironmentObject private var infrastructure: InfrastructureManager

    var body: some View {
        VStack {
            // Create project
            Button("Create Project") {
                Task {
                    let project = await infrastructure.createProject(
                        name: "My Project",
                        type: ProjectType(
                            id: "software-development",
                            name: "Software Development",
                            icon: "hammer",
                            description: "Code development"
                        )
                    )
                    if let project = project {
                        infrastructure.switchToProject(project)
                    }
                }
            }

            // Add document
            Button("Add Document") {
                Task {
                    let documentURL = Bundle.main.url(forResource: "sample", withExtension: "pdf")!
                    let result = await infrastructure.addDocument(
                        url: documentURL,
                        projectId: infrastructure.getCurrentProject()?.id ?? ""
                    )
                    if result.success {
                        print("Document processed: \(result.ragChunksProcessed ?? 0) chunks")
                    }
                }
            }

            // Search
            Button("Search") {
                Task {
                    let results = await infrastructure.search(
                        query: "How to implement authentication?",
                        projectId: infrastructure.getCurrentProject()?.id ?? "",
                        maxTokens: 4000
                    )
                    print("Found \(results.ragResults.chunks.count) relevant chunks")
                }
            }
        }
    }
}
```

## 🔧 Advanced Integration

### 1. Custom Project Types

```swift
extension ProjectType {
    static let customType = ProjectType(
        id: "ai-research",
        name: "AI Research",
        icon: "brain",
        description: "Machine learning and AI research projects"
    )
}

// Use custom project type
let project = await infrastructure.createProject(
    name: "LLM Research",
    type: .customType,
    description: "Research on large language models"
)
```

### 2. Batch Document Processing

```swift
func processMultipleDocuments(urls: [URL]) async {
    guard let project = infrastructure.getCurrentProject() else { return }

    let results = await infrastructure.batchAddDocuments(
        urls: urls,
        projectId: project.id
    )

    for (index, result) in results.enumerated() {
        print("Document \(index + 1): \(result.success ? "✅" : "❌")")
        if let error = result.error {
            print("  Error: \(error)")
        }
    }
}
```

### 3. Advanced Search with Context

```swift
func performIntelligentSearch(query: String) async {
    guard let project = infrastructure.getCurrentProject() else { return }

    let searchResults = await infrastructure.search(
        query: query,
        projectId: project.id,
        maxTokens: 6000
    )

    // Process RAG results
    for chunk in searchResults.ragResults.chunks {
        print("Content: \(chunk.content)")
        print("Source: \(chunk.sourceURL)")
        print("Score: \(chunk.score)")
    }

    // Process context results
    for context in searchResults.contextResults.contexts {
        print("Context: \(context.title)")
        print("Type: \(context.type)")
        print("Relevance: \(context.relevanceScore)")
    }
}
```

### 4. Custom Context Sources

```swift
func addCustomContext() async {
    guard let project = infrastructure.getCurrentProject() else { return }

    // Add file context
    let contextId = await infrastructure.addContext(
        type: .file,
        source: "/path/to/important/file.swift",
        projectId: project.id
    )

    if let contextId = contextId {
        print("Custom context added: \(contextId)")
    }
}
```

## 🔍 Monitoring and Health

### 1. System Health Monitoring

```swift
struct HealthMonitorView: View {
    @StateObject private var validator = InfrastructureValidation()

    var body: some View {
        VStack {
            Button("Check Health") {
                Task {
                    await validator.performFullValidation()
                }
            }

            if validator.isValidating {
                ProgressView("Validating infrastructure...")
            }

            if let summary = validator.getValidationSummary() as? ValidationSummary {
                VStack(alignment: .leading) {
                    Text("Overall Health: \(summary.overallHealth)")
                        .foregroundColor(colorForHealth(summary.overallHealth))

                    Text("Validations: \(summary.totalValidations)")
                    Text("Healthy: \(summary.healthyCount)")
                    Text("Warnings: \(summary.warningCount)")
                    Text("Errors: \(summary.errorCount)")
                    Text("Critical: \(summary.criticalCount)")
                }
            }
        }
    }

    private func colorForHealth(_ health: ValidationHealth) -> Color {
        switch health {
        case .healthy: return .green
        case .warning: return .orange
        case .critical: return .red
        case .unknown: return .gray
        }
    }
}
```

### 2. Performance Metrics

```swift
struct PerformanceMetricsView: View {
    @StateObject private var validator = InfrastructureValidation()

    var body: some View {
        VStack {
            if let metrics = validator.performanceMetrics {
                VStack(alignment: .leading) {
                    Text("Memory Usage: \(metrics.memoryUsageMB) MB")
                    Text("CPU Usage: \(String(format: "%.1f", metrics.cpuUsagePercent))%")
                    Text("Disk I/O: \(String(format: "%.1f", metrics.diskIOMBPerSec)) MB/s")
                    Text("Network I/O: \(String(format: "%.1f", metrics.networkIOMBPerSec)) MB/s")
                }
            }
        }
        .task {
            await validator.performFullValidation()
        }
    }
}
```

### 3. Infrastructure Statistics

```swift
struct InfrastructureStatsView: View {
    @EnvironmentObject private var infrastructure: InfrastructureManager
    @State private var stats: InfrastructureStats?

    var body: some View {
        VStack(alignment: .leading) {
            if let stats = stats {
                Group {
                    Text("Projects: \(stats.totalProjects)")
                    Text("Documents: \(stats.totalDocuments)")
                    Text("Chunks: \(stats.totalChunks)")
                    Text("Vectors: \(stats.totalVectors)")
                    Text("Storage: \(ByteCountFormatter.string(fromByteCount: stats.totalStorageUsed, countStyle: .file))")
                    Text("Cache Hit Rate: \(String(format: "%.1f", stats.cacheHitRate * 100))%")
                }
            } else {
                Text("Loading statistics...")
            }
        }
        .task {
            stats = await infrastructure.getInfrastructureStats()
        }
    }
}
```

## 🧪 Testing and Validation

### 1. Unit Testing Infrastructure

```swift
import XCTest

class MyInfrastructureTests: XCTestCase {
    private var infrastructureManager: InfrastructureManager!

    override func setUp() async throws {
        infrastructureManager = InfrastructureManager.shared

        // Wait for initialization
        while !infrastructureManager.isInitialized {
            try? await Task.sleep(nanoseconds: 100_000_000)
        }
    }

    func testProjectCreation() async throws {
        let projectType = ProjectType(
            id: "test",
            name: "Test",
            icon: "test",
            description: "Test project"
        )

        let project = await infrastructureManager.createProject(
            name: "Test Project",
            type: projectType
        )

        XCTAssertNotNil(project)
        XCTAssertEqual(project?.name, "Test Project")
    }

    func testDocumentProcessing() async throws {
        guard let project = infrastructureManager.getCurrentProject() else {
            XCTFail("No current project")
            return
        }

        let testDocumentURL = createTestDocument()
        let result = await infrastructureManager.addDocument(
            url: testDocumentURL,
            projectId: project.id
        )

        XCTAssertTrue(result.success)
        XCTAssertNotNil(result.document)
        XCTAssertGreaterThan(result.ragChunksProcessed ?? 0, 0)

        // Clean up
        try? FileManager.default.removeItem(at: testDocumentURL)
    }

    private func createTestDocument() -> URL {
        let content = "This is a test document for infrastructure testing."
        let tempURL = FileManager.default.temporaryDirectory.appendingPathComponent("test.txt")
        try? content.write(to: tempURL, atomically: true, encoding: .utf8)
        return tempURL
    }
}
```

### 2. Integration Testing

```swift
class InfrastructureIntegrationTests: XCTestCase {
    func testCompleteWorkflow() async throws {
        let infrastructure = InfrastructureManager.shared

        // Wait for initialization
        while !infrastructure.isInitialized {
            try? await Task.sleep(nanoseconds: 100_000_000)
        }

        // 1. Create project
        let project = await infrastructure.createProject(
            name: "Integration Test",
            type: ProjectType(
                id: "test",
                name: "Test",
                icon: "test",
                description: "Integration test"
            )
        )
        XCTAssertNotNil(project)

        // 2. Add document
        let testDoc = createTestDocument()
        let addResult = await infrastructure.addDocument(
            url: testDoc,
            projectId: project!.id
        )
        XCTAssertTrue(addResult.success)

        // 3. Search
        let searchResults = await infrastructure.search(
            query: "test document",
            projectId: project!.id
        )
        XCTAssertGreaterThan(searchResults.ragResults.chunks.count, 0)

        // 4. Get stats
        let stats = await infrastructure.getInfrastructureStats()
        XCTAssertGreaterThan(stats.totalDocuments, 0)

        // Clean up
        try? FileManager.default.removeItem(at: testDoc)
    }
}
```

## 🛠️ Troubleshooting

### Common Issues and Solutions

#### 1. Infrastructure Not Initializing

**Problem**: InfrastructureManager.isInitialized remains false

**Solution**:
```swift
// Check system status
let status = await infrastructureManager.getSystemStatus()
print("System status: \(status)")

// Run health check
let healthCheck = await infrastructureManager.performHealthCheck()
for check in healthCheck.checks {
    print("\(check.component): \(check.status) - \(check.message)")
}
```

#### 2. Document Processing Fails

**Problem**: addDocument returns success: false

**Solution**:
```swift
// Check file exists and is accessible
guard FileManager.default.fileExists(atPath: documentURL.path) else {
    print("File does not exist: \(documentURL.path)")
    return
}

// Check file size (50MB limit)
let fileSize = try? documentURL.resourceValues(forKeys: [.fileSizeKey])?.fileSize ?? 0
guard fileSize <= 50 * 1024 * 1024 else {
    print("File too large: \(fileSize) bytes")
    return
}

// Check supported format
let supportedFormats = ["pdf", "docx", "txt", "md", "rtf"]
let fileExtension = documentURL.pathExtension.lowercased()
guard supportedFormats.contains(fileExtension) else {
    print("Unsupported format: \(fileExtension)")
    return
}
```

#### 3. Search Returns No Results

**Problem**: search returns empty chunks array

**Solution**:
```swift
// Check if documents have been processed
let stats = await infrastructureManager.getInfrastructureStats()
print("Total documents: \(stats.totalDocuments)")
print("Total chunks: \(stats.totalChunks)")
print("Total vectors: \(stats.totalVectors)")

// Check if project has documents
if let project = infrastructureManager.getCurrentProject() {
    let documents = infrastructureManager.getProjectDocuments(project)
    print("Project documents: \(documents.count)")
}

// Try broader search terms
let broadResults = await infrastructureManager.search(
    query: "document",
    projectId: projectId,
    maxTokens: 8000
)
```

#### 4. Performance Issues

**Problem**: Slow search or processing

**Solution**:
```swift
// Check performance metrics
let validator = InfrastructureValidation()
await validator.performFullValidation()

if let metrics = validator.performanceMetrics {
    if metrics.memoryUsageMB > 1000 {
        print("High memory usage: \(metrics.memoryUsageMB) MB")
    }
    if metrics.cpuUsagePercent > 80 {
        print("High CPU usage: \(metrics.cpuUsagePercent)%")
    }
}

// Run performance optimization
await infrastructureManager.performCleanup()
```

## 📚 API Reference

### InfrastructureManager

#### Project Management
```swift
func createProject(name: String, type: ProjectType, description: String) async -> Project?
func getProjects() -> [Project]
func getCurrentProject() -> Project?
func switchToProject(_ project: Project)
func deleteProject(_ project: Project)
```

#### Document Management
```swift
func addDocument(_ url: URL, projectId: String) async -> DocumentAddResult
func getProjectDocuments(_ project: Project) -> [ProjectDocument]
func batchAddDocuments(_ urls: [URL], projectId: String) async -> [DocumentAddResult]
```

#### Context and Search
```swift
func addContext(_ type: ContextSourceType, source: String, projectId: String?) async -> String?
func search(_ query: String, projectId: String, maxTokens: Int) async -> SearchResults
func getContextSources(_ projectId: String) -> [ContextSource]
```

#### System Management
```swift
func getSystemStatus() async -> SystemStatus
func getInfrastructureStats() async -> InfrastructureStats
func performHealthCheck() async -> HealthCheckResult
func createBackup() async -> BackupResult
func performCleanup() async -> CleanupResult
```

### InfrastructureSetup

#### Setup Methods
```swift
func performSetup() async
func performQuickSetup() async
func resetInfrastructure() async -> Bool
```

### InfrastructureValidation

#### Validation Methods
```swift
func performFullValidation() async
func performQuickHealthCheck() async -> ValidationHealth
func validateComponent(_ component: ValidationComponent) async -> ValidationResult
func getValidationSummary() -> ValidationSummary
```

## 🎯 Best Practices

### 1. Initialization
- Always wait for infrastructure to be fully initialized before use
- Use error handling for all infrastructure operations
- Implement proper timeout handling for long-running operations

### 2. Performance
- Use batch operations for multiple documents
- Monitor memory usage and implement cleanup routines
- Cache frequently accessed data

### 3. Error Handling
- Implement comprehensive error handling for all infrastructure calls
- Use validation to check system health before operations
- Provide meaningful error messages to users

### 4. Testing
- Write unit tests for all infrastructure interactions
- Use integration tests for complete workflows
- Mock infrastructure components for UI testing

### 5. Security
- Never expose sensitive infrastructure data
- Use secure credential management
- Validate all user inputs before processing

## 🚀 Deployment

### Production Setup

1. **Run Full Setup**
```swift
let setup = InfrastructureSetup()
await setup.performSetup()
```

2. **Validate Infrastructure**
```swift
let validator = InfrastructureValidation()
await validator.performFullValidation()
```

3. **Create Backup**
```swift
let infrastructure = InfrastructureManager.shared
let backup = await infrastructure.createBackup()
```

4. **Monitor Health**
```swift
// Set up periodic health checks
Timer.scheduledTimer(withTimeInterval: 300, repeats: true) { _ in
    Task {
        let health = await validator.performQuickHealthCheck()
        if health == .critical {
            // Send alert
        }
    }
}
```

## 📞 Support

### Getting Help

1. **Check Documentation**: Refer to this guide and inline documentation
2. **Run Diagnostics**: Use `InfrastructureValidation` to identify issues
3. **Check Logs**: Review infrastructure logs in `~/Library/LocalBrain-v2/logs/`
4. **Reset Infrastructure**: Use `InfrastructureSetup.resetInfrastructure()` if needed

### Contributing

When contributing to the infrastructure system:

1. Follow existing code patterns and conventions
2. Add comprehensive tests for new functionality
3. Update documentation for API changes
4. Validate all changes with `InfrastructureValidation`

---

**This infrastructure system provides the foundation for LocalBrain v2.0's AI-powered workspace, enabling intelligent document processing, semantic search, and context-aware AI interactions.**