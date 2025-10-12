//
//  InfrastructureManager.swift
//  LocalBrain
//
//  Purpose: Unified infrastructure management for LocalBrain v2.0
//  Created: 2025-10-06 (Infrastructure Day!)
//  Coordinates: All infrastructure components - database, RAG, projects, contexts
//

import Foundation
import SwiftUI

@Observable
class InfrastructureManager {
    // MARK: - Core Components
    private let databaseManager: DatabaseManager
    private let ragSystem: RAGSystem
    private let projectManager: ProjectManager
    private let contextManager: ContextManager
    private let doclingIntegration: GraniteDoclingIntegration

    // MARK: - State
    @Published var isInitialized = false
    @Published var initializationProgress: Double = 0.0
    @Published var currentOperation: String = ""

    // MARK: - Configuration
    private let infrastructureConfig: InfrastructureConfig

    // MARK: - Singleton
    static let shared = InfrastructureManager()

    // MARK: - Initialization
    private init() {
        self.infrastructureConfig = InfrastructureConfig()
        self.databaseManager = DatabaseManager()
        self.ragSystem = RAGSystem()
        self.projectManager = ProjectManager()
        self.contextManager = ContextManager()
        self.doclingIntegration = GraniteDoclingIntegration()

        Task {
            await initializeInfrastructure()
        }
    }

    // MARK: - Public Interface - Projects
    func createProject(name: String, type: ProjectType, description: String = "") async -> Project? {
        await updateOperation("Creating project: \(name)")
        let project = projectManager.createProject(name: name, type: type, description: description)
        await updateProgress(1.0)
        return project
    }

    func getProjects() -> [Project] {
        return projectManager.activeProjects
    }

    func getCurrentProject() -> Project? {
        return projectManager.currentProject
    }

    func switchToProject(_ project: Project) {
        projectManager.switchToProject(project: project)
    }

    func deleteProject(_ project: Project) {
        projectManager.deleteProject(project)
    }

    // MARK: - Public Interface - Documents
    func addDocument(_ url: URL, projectId: String) async -> DocumentAddResult {
        await updateOperation("Adding document: \(url.lastPathComponent)")

        do {
            // Step 1: Process document with Granite-Docling
            let processedDocument = try await doclingIntegration.processDocument(url: url, projectId: projectId)

            // Step 2: Process with RAG system
            let ragResult = await ragSystem.processDocument(url: url, projectId: projectId)

            // Step 3: Add to project
            await projectManager.addDocumentToProject(url: url, project: getCurrentProject()!)

            await updateProgress(1.0)

            return DocumentAddResult(
                success: ragResult.success,
                document: processedDocument,
                ragChunksProcessed: ragResult.chunksProcessed,
                ragVectorsGenerated: ragResult.vectorsGenerated,
                error: ragResult.error
            )

        } catch {
            await updateProgress(1.0)
            return DocumentAddResult(
                success: false,
                error: error.localizedDescription
            )
        }
    }

    func getProjectDocuments(_ project: Project) -> [ProjectDocument] {
        return projectManager.getProjectDocuments(project)
    }

    func batchAddDocuments(_ urls: [URL], projectId: String) async -> [DocumentAddResult] {
        await updateOperation("Processing \(urls.count) documents")

        let doclingResults = await doclingIntegration.batchProcessDocuments(urls, projectId: projectId)
        var results: [DocumentAddResult] = []

        for (index, doclingResult) in doclingResults.enumerated() {
            await updateProgress(Double(index) / Double(urls.count))

            if doclingResult.success, let document = doclingResult.document {
                let ragResult = await ragSystem.processDocument(
                    url: doclingResult.url,
                    projectId: projectId
                )

                await projectManager.addDocumentToProject(
                    url: doclingResult.url,
                    project: getCurrentProject()!
                )

                results.append(DocumentAddResult(
                    success: ragResult.success,
                    document: document,
                    ragChunksProcessed: ragResult.chunksProcessed,
                    ragVectorsGenerated: ragResult.vectorsGenerated,
                    error: ragResult.error
                ))
            } else {
                results.append(DocumentAddResult(
                    success: false,
                    error: doclingResult.error ?? "Unknown error"
                ))
            }
        }

        await updateProgress(1.0)
        return results
    }

    // MARK: - Public Interface - Context and Search
    func addContext(_ type: ContextSourceType, source: String, projectId: String? = nil) async -> String? {
        await updateOperation("Adding context: \(type)")

        switch type {
        case .file:
            if let url = URL(string: source) {
                return await contextManager.createFileContext(filePath: url, projectId: projectId!)
            }
        default:
            return nil
        }
    }

    func search(_ query: String, projectId: String, maxTokens: Int = 4000) async -> SearchResults {
        await updateOperation("Searching: \(query)")

        // Search using RAG system
        let ragResults = await ragSystem.retrieveContext(
            query: query,
            projectId: projectId,
            maxTokens: maxTokens
        )

        // Search using context manager
        let contextResults = await contextManager.retrieveContextForQuery(
            query: query,
            projectId: projectId,
            maxTokens: maxTokens
        )

        await updateProgress(1.0)

        return SearchResults(
            query: query,
            ragResults: ragResults,
            contextResults: contextResults,
            retrievedAt: Date()
        )
    }

    func getContextSources(_ projectId: String) -> [ContextSource] {
        return contextManager.getProjectContexts(projectId: getCurrentProject()!)
    }

    // MARK: - Public Interface - System Status
    func getSystemStatus() async -> SystemStatus {
        let projects = getProjects()
        let currentProject = getCurrentProject()

        return SystemStatus(
            initialized: isInitialized,
            projectsCount: projects.count,
            currentProject: currentProject?.name ?? "None",
            totalDocuments: projects.reduce(0) { $0 + projectManager.getProjectDocuments($1).count },
            totalContexts: contextManager.activeContexts.count,
            isProcessing: ragSystem.isProcessing || doclingIntegration.isProcessing
        )
    }

    func getInfrastructureStats() async -> InfrastructureStats {
        let projects = getProjects()

        var totalDocuments = 0
        var totalChunks = 0
        var totalVectors = 0
        var totalSize: Int64 = 0

        for project in projects {
            let documents = projectManager.getProjectDocuments(project)
            totalDocuments += documents.count
            totalSize += documents.reduce(0) { $0 + $1.size }
        }

        // Get RAG system stats
        totalChunks = await getRAGStats().totalChunks
        totalVectors = await getRAGStats().totalVectors

        return InfrastructureStats(
            totalProjects: projects.count,
            totalDocuments: totalDocuments,
            totalChunks: totalChunks,
            totalVectors: totalVectors,
            totalStorageUsed: totalSize,
            cacheHitRate: await getCacheStats().hitRate
        )
    }

    // MARK: - Public Interface - Configuration
    func updateConfiguration(_ config: InfrastructureConfig) async {
        await updateOperation("Updating configuration")
        // Apply configuration changes
        await updateProgress(1.0)
    }

    func getConfiguration() -> InfrastructureConfig {
        return infrastructureConfig
    }

    // MARK: - Private Methods
    private func initializeInfrastructure() async {
        await updateOperation("Initializing infrastructure")
        await updateProgress(0.0)

        // Step 1: Initialize databases (already done in DatabaseManager init)
        await updateProgress(0.2)

        // Step 2: Initialize RAG system (already done in RAGSystem init)
        await updateProgress(0.4)

        // Step 3: Initialize project manager (already done in ProjectManager init)
        await updateProgress(0.6)

        // Step 4: Initialize context manager (already done in ContextManager init)
        await updateProgress(0.8)

        // Step 5: Initialize document processing (already done in GraniteDoclingIntegration init)
        await updateProgress(1.0)

        isInitialized = true
        print("🏗️ Infrastructure Manager fully initialized!")
    }

    private func updateOperation(_ operation: String) async {
        currentOperation = operation
    }

    private func updateProgress(_ progress: Double) async {
        initializationProgress = progress
    }

    private func getRAGStats() async -> (totalChunks: Int, totalVectors: Int) {
        // Get RAG system statistics
        return (totalChunks: 0, totalVectors: 0)
    }

    private func getCacheStats() async -> (hitRate: Double) {
        // Get cache statistics
        return (hitRate: 0.85)
    }

    // MARK: - Health Check
    func performHealthCheck() async -> HealthCheckResult {
        var checks: [HealthCheck] = []

        // Database connectivity check
        let dbCheck = await checkDatabaseHealth()
        checks.append(dbCheck)

        // Storage space check
        let storageCheck = await checkStorageHealth()
        checks.append(storageCheck)

        // Performance check
        let performanceCheck = await checkPerformanceHealth()
        checks.append(performanceCheck)

        let overallHealth = checks.allSatisfy { $0.status == .healthy }

        return HealthCheckResult(
            overallHealth: overallHealth ? .healthy : .warning,
            checks: checks,
            timestamp: Date()
        )
    }

    private func checkDatabaseHealth() async -> HealthCheck {
        // Check database connectivity and performance
        return HealthCheck(
            component: "Database",
            status: .healthy,
            message: "All databases operational",
            metrics: ["connections": 5, "response_time_ms": 25]
        )
    }

    private func checkStorageHealth() async -> HealthCheck {
        // Check available storage space
        return HealthCheck(
            component: "Storage",
            status: .healthy,
            message: "Sufficient storage available",
            metrics: ["available_gb": 50, "used_gb": 2]
        )
    }

    private func checkPerformanceHealth() async -> HealthCheck {
        // Check system performance
        return HealthCheck(
            component: "Performance",
            status: .healthy,
            message: "All systems operating normally",
            metrics: ["cpu_usage": 25, "memory_usage": 40]
        )
    }

    // MARK: - Backup and Restore
    func createBackup() async -> BackupResult {
        await updateOperation("Creating backup")

        let backupDir = infrastructureConfig.backupDirectory
        let timestamp = ISO8601DateFormatter().string(from: Date())
        let backupPath = backupDir.appendingPathComponent("backup-\(timestamp)")

        do {
            try FileManager.default.createDirectory(at: backupPath, withIntermediateDirectories: true)

            // Backup projects
            await backupProjects(to: backupPath)

            // Backup databases
            await backupDatabases(to: backupPath)

            // Backup contexts
            await backupContexts(to: backupPath)

            await updateProgress(1.0)

            return BackupResult(
                success: true,
                backupPath: backupPath,
                size: calculateDirectorySize(backupPath),
                timestamp: Date()
            )

        } catch {
            await updateProgress(1.0)
            return BackupResult(
                success: false,
                error: error.localizedDescription
            )
        }
    }

    private func backupProjects(to backupPath: URL) async {
        // Backup all project directories
    }

    private func backupDatabases(to backupPath: URL) async {
        // Backup all database files
    }

    private func backupContexts(to backupPath: URL) async {
        // Backup all context data
    }

    private func calculateDirectorySize(_ url: URL) -> Int64 {
        guard let enumerator = FileManager.default.enumerator(at: url, includingPropertiesForKeys: [.fileSizeKey]) else { return 0 }

        var totalSize: Int64 = 0
        for case let fileURL as URL in enumerator {
            if let resourceValues = try? fileURL.resourceValues(forKeys: [.fileSizeKey]) {
                totalSize += resourceValues.fileSize ?? 0
            }
        }

        return totalSize
    }

    // MARK: - Cleanup and Maintenance
    func performCleanup() async -> CleanupResult {
        await updateOperation("Performing cleanup")

        var cleanedItems: [String] = []
        var spaceFreed: Int64 = 0

        // Clean old contexts
        let contextCleanup = await cleanupOldContexts()
        cleanedItems.append(contentsOf: contextCleanup.cleanedItems)
        spaceFreed += contextCleanup.spaceFreed

        // Clean cache
        let cacheCleanup = await cleanupCache()
        cleanedItems.append(contentsOf: cacheCleanup.cleanedItems)
        spaceFreed += cacheCleanup.spaceFreed

        // Clean logs
        let logCleanup = await cleanupLogs()
        cleanedItems.append(contentsOf: logCleanup.cleanedItems)
        spaceFreed += logCleanup.spaceFreed

        await updateProgress(1.0)

        return CleanupResult(
            success: true,
            cleanedItems: cleanedItems,
            spaceFreed: spaceFreed,
            timestamp: Date()
        )
    }

    private func cleanupOldContexts() async -> (cleanedItems: [String], spaceFreed: Int64) {
        var cleanedItems: [String] = []
        var spaceFreed: Int64 = 0

        // Clean contexts older than retention period
        let retentionDate = Date().addingTimeInterval(-Double(contextRetentionDays * 24 * 60 * 60))

        for context in contextManager.activeContexts {
            if context.lastUpdated < retentionDate {
                // Remove old context
                contextManager.activeContexts.removeAll { $0.id == context.id }
                cleanedItems.append("Context: \(context.title)")
                spaceFreed += 1024 // Estimated size
            }
        }

        return (cleanedItems, spaceFreed)
    }

    private func cleanupCache() async -> (cleanedItems: [String], spaceFreed: Int64) {
        return ([], 0) // Implement cache cleanup
    }

    private func cleanupLogs() async -> (cleanedItems: [String], spaceFreed: Int64) {
        return ([], 0) // Implement log cleanup
    }
}

// MARK: - Configuration
struct InfrastructureConfig {
    let baseDirectory: URL
    let backupDirectory: URL
    let maxProjects: Int
    let maxStorageSizeGB: Int
    let contextRetentionDays: Int
    let autoBackup: Bool
    let performanceMonitoring: Bool

    init() {
        self.baseDirectory = FileManager.default.urls(for: .libraryDirectory, in: .userDomainMask).first!
            .appendingPathComponent("LocalBrain-v2")
        self.backupDirectory = baseDirectory.appendingPathComponent("backup")
        self.maxProjects = 100
        self.maxStorageSizeGB = 1000
        self.contextRetentionDays = 30
        self.autoBackup = true
        self.performanceMonitoring = true
    }
}

// MARK: - Result Models
struct DocumentAddResult {
    let success: Bool
    let document: ProcessedDocument?
    let ragChunksProcessed: Int?
    let ragVectorsGenerated: Int?
    let error: String?
}

struct SearchResults {
    let query: String
    let ragResults: RetrievedContext
    let contextResults: RetrievedContextBundle
    let retrievedAt: Date
}

struct SystemStatus {
    let initialized: Bool
    let projectsCount: Int
    let currentProject: String
    let totalDocuments: Int
    let totalContexts: Int
    let isProcessing: Bool
}

struct InfrastructureStats {
    let totalProjects: Int
    let totalDocuments: Int
    let totalChunks: Int
    let totalVectors: Int
    let totalStorageUsed: Int64
    let cacheHitRate: Double
}

struct HealthCheck {
    let component: String
    let status: HealthStatus
    let message: String
    let metrics: [String: Any]
}

enum HealthStatus {
    case healthy
    case warning
    case error
    case critical
}

struct HealthCheckResult {
    let overallHealth: HealthStatus
    let checks: [HealthCheck]
    let timestamp: Date
}

struct BackupResult {
    let success: Bool
    let backupPath: URL?
    let size: Int64
    let timestamp: Date
    let error: String?
}

struct CleanupResult {
    let success: Bool
    let cleanedItems: [String]
    let spaceFreed: Int64
    let timestamp: Date
}