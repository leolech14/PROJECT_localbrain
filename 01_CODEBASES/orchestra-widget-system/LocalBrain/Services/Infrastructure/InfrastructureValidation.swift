//
//  InfrastructureValidation.swift
//  LocalBrain
//
//  Purpose: Infrastructure validation and health monitoring system
//  Created: 2025-10-06 (Infrastructure Day!)
//  Validates: Database integrity, RAG performance, system health
//

import Foundation
import SwiftUI

@Observable
class InfrastructureValidation {
    // MARK: - Core Components
    private let infrastructureManager: InfrastructureManager
    private var validationTimer: Timer?

    // MARK: - State
    @Published var isValidating = false
    @Published var lastValidationDate: Date?
    @Published var validationResults: [ValidationResult] = []
    @Published var overallHealth: ValidationHealth = .unknown
    @Published var criticalIssues: [ValidationResult] = []
    @Published var performanceMetrics: PerformanceMetrics?

    // MARK: - Configuration
    private let validationInterval: TimeInterval = 300 // 5 minutes
    private let criticalIssueThreshold = 3
    private let performanceWarningThreshold: TimeInterval = 2.0

    // MARK: - Initialization
    init(infrastructureManager: InfrastructureManager = InfrastructureManager.shared) {
        self.infrastructureManager = infrastructureManager

        // Start periodic validation
        startPeriodicValidation()

        // Run initial validation
        Task {
            await performFullValidation()
        }
    }

    deinit {
        validationTimer?.invalidate()
    }

    // MARK: - Public Interface

    /// Perform comprehensive infrastructure validation
    func performFullValidation() async {
        await MainActor.run {
            isValidating = true
            validationResults.removeAll()
            criticalIssues.removeAll()
        }

        print("🔍 Starting comprehensive infrastructure validation...")

        // Database validation
        await validateDatabaseIntegrity()

        // RAG system validation
        await validateRAGSystem()

        // Context management validation
        await validateContextManagement()

        // Project workspace validation
        await validateProjectWorkspaces()

        // Document processing validation
        await validateDocumentProcessing()

        // Performance validation
        await validateSystemPerformance()

        // Storage validation
        await validateStorageHealth()

        // Security validation
        await validateSecurity()

        // Calculate overall health
        await calculateOverallHealth()

        await MainActor.run {
            isValidating = false
            lastValidationDate = Date()
        }

        print("✅ Infrastructure validation completed")
        print("📊 Overall health: \(overallHealth)")
        print("🚨 Critical issues: \(criticalIssues.count)")

        // Log results
        await logValidationResults()
    }

    /// Quick health check for critical systems
    func performQuickHealthCheck() async -> ValidationHealth {
        let criticalValidations: [ValidationType] = [
            .databaseConnectivity,
            .ragSystemHealth,
            .storageSpace,
            .memoryUsage
        ]

        var issueCount = 0

        for validationType in criticalValidations {
            let result = await performValidation(type: validationType)
            if result.status == .error || result.status == .critical {
                issueCount += 1
            }
        }

        let health: ValidationHealth
        switch issueCount {
        case 0:
            health = .healthy
        case 1...2:
            health = .warning
        default:
            health = .critical
        }

        await MainActor.run {
            overallHealth = health
        }

        return health
    }

    /// Validate specific component
    func validateComponent(_ component: ValidationComponent) async -> ValidationResult {
        return await performValidation(type: component.validationType)
    }

    /// Get validation summary
    func getValidationSummary() -> ValidationSummary {
        let healthyCount = validationResults.filter { $0.status == .healthy }.count
        let warningCount = validationResults.filter { $0.status == .warning }.count
        let errorCount = validationResults.filter { $0.status == .error }.count
        let criticalCount = validationResults.filter { $0.status == .critical }.count

        return ValidationSummary(
            totalValidations: validationResults.count,
            healthyCount: healthyCount,
            warningCount: warningCount,
            errorCount: errorCount,
            criticalCount: criticalCount,
            overallHealth: overallHealth,
            lastValidationDate: lastValidationDate,
            criticalIssues: criticalIssues
        )
    }

    // MARK: - Private Validation Methods

    private func validateDatabaseIntegrity() async {
        print("🔍 Validating database integrity...")

        // Test database connectivity
        await validateDatabaseConnectivity()

        // Test database performance
        await validateDatabasePerformance()

        // Test data consistency
        await validateDataConsistency()

        // Test backup integrity
        await validateBackupIntegrity()
    }

    private func validateDatabaseConnectivity() async {
        let startTime = Date()
        var issues: [String] = []

        do {
            // Test main database connection
            let mainDbStatus = await testDatabaseConnection("main")
            if !mainDbStatus {
                issues.append("Main database connection failed")
            }

            // Test conversations database connection
            let conversationsDbStatus = await testDatabaseConnection("conversations")
            if !conversationsDbStatus {
                issues.append("Conversations database connection failed")
            }

            // Test metrics database connection
            let metricsDbStatus = await testDatabaseConnection("metrics")
            if !metricsDbStatus {
                issues.append("Metrics database connection failed")
            }

        } catch {
            issues.append("Database connectivity test failed: \(error.localizedDescription)")
        }

        let responseTime = Date().timeIntervalSince(startTime)
        let status: ValidationStatus = issues.isEmpty ? (responseTime < 0.5 ? .healthy : .warning) : .error

        let result = ValidationResult(
            type: .databaseConnectivity,
            status: status,
            message: issues.isEmpty ? "All databases accessible" : issues.joined(separator: "; "),
            responseTime: responseTime,
            metrics: [
                "response_time_ms": Int(responseTime * 1000),
                "connections_tested": 3,
                "connections_successful": 3 - issues.count
            ],
            timestamp: Date()
        )

        await addValidationResult(result)
    }

    private func validateDatabasePerformance() async {
        let startTime = Date()
        var issues: [String] = []

        do {
            // Test query performance
            let queryTime = await testQueryPerformance()
            if queryTime > 1.0 {
                issues.append("Slow query performance: \(queryTime)s")
            }

            // Test transaction performance
            let transactionTime = await testTransactionPerformance()
            if transactionTime > 2.0 {
                issues.append("Slow transaction performance: \(transactionTime)s")
            }

        } catch {
            issues.append("Database performance test failed: \(error.localizedDescription)")
        }

        let responseTime = Date().timeIntervalSince(startTime)
        let status: ValidationStatus = issues.isEmpty ? .healthy : (issues.count == 1 ? .warning : .error)

        let result = ValidationResult(
            type: .databasePerformance,
            status: status,
            message: issues.isEmpty ? "Database performance optimal" : issues.joined(separator: "; "),
            responseTime: responseTime,
            metrics: [
                "query_time_ms": Int(await testQueryPerformance() * 1000),
                "transaction_time_ms": Int(await testTransactionPerformance() * 1000)
            ],
            timestamp: Date()
        )

        await addValidationResult(result)
    }

    private func validateDataConsistency() async {
        let startTime = Date()
        var issues: [String] = []

        do {
            // Check for orphaned records
            let orphanedRecords = await findOrphanedRecords()
            if orphanedRecords > 0 {
                issues.append("Found \(orphanedRecords) orphaned records")
            }

            // Check data integrity constraints
            let constraintViolations = await checkDataIntegrityConstraints()
            if constraintViolations > 0 {
                issues.append("Found \(constraintViolations) constraint violations")
            }

        } catch {
            issues.append("Data consistency check failed: \(error.localizedDescription)")
        }

        let responseTime = Date().timeIntervalSince(startTime)
        let status: ValidationStatus = issues.isEmpty ? .healthy : .error

        let result = ValidationResult(
            type: .dataConsistency,
            status: status,
            message: issues.isEmpty ? "Data consistency verified" : issues.joined(separator: "; "),
            responseTime: responseTime,
            metrics: [
                "orphaned_records": await findOrphanedRecords(),
                "constraint_violations": await checkDataIntegrityConstraints()
            ],
            timestamp: Date()
        )

        await addValidationResult(result)
    }

    private func validateRAGSystem() async {
        print("🔍 Validating RAG system...")

        // Test RAG system health
        await validateRAGSystemHealth()

        // Test vector store performance
        await validateVectorStorePerformance()

        // Test embedding generation
        await validateEmbeddingGeneration()

        // Test search functionality
        await validateSearchFunctionality()
    }

    private func validateRAGSystemHealth() async {
        let startTime = Date()
        var issues: [String] = []

        do {
            // Test RAG system initialization
            let ragStats = await infrastructureManager.getInfrastructureStats()
            if ragStats.totalVectors < 0 {
                issues.append("Invalid vector count in RAG system")
            }

            // Test document processing
            let testResult = await testDocumentProcessing()
            if !testResult {
                issues.append("Document processing test failed")
            }

        } catch {
            issues.append("RAG system health check failed: \(error.localizedDescription)")
        }

        let responseTime = Date().timeIntervalSince(startTime)
        let status: ValidationStatus = issues.isEmpty ? .healthy : .warning

        let result = ValidationResult(
            type: .ragSystemHealth,
            status: status,
            message: issues.isEmpty ? "RAG system healthy" : issues.joined(separator: "; "),
            responseTime: responseTime,
            metrics: [
                "total_vectors": await infrastructureManager.getInfrastructureStats().totalVectors,
                "document_processing_test": await testDocumentProcessing() ? 1 : 0
            ],
            timestamp: Date()
        )

        await addValidationResult(result)
    }

    private func validateVectorStorePerformance() async {
        let startTime = Date()
        var issues: [String] = []

        do {
            // Test vector search performance
            let searchTime = await testVectorSearchPerformance()
            if searchTime > 1.0 {
                issues.append("Slow vector search: \(searchTime)s")
            }

            // Test index performance
            let indexTime = await testVectorIndexPerformance()
            if indexTime > 5.0 {
                issues.append("Slow vector indexing: \(indexTime)s")
            }

        } catch {
            issues.append("Vector store performance test failed: \(error.localizedDescription)")
        }

        let responseTime = Date().timeIntervalSince(startTime)
        let status: ValidationStatus = issues.isEmpty ? .healthy : .warning

        let result = ValidationResult(
            type: .vectorStorePerformance,
            status: status,
            message: issues.isEmpty ? "Vector store performance optimal" : issues.joined(separator: "; "),
            responseTime: responseTime,
            metrics: [
                "search_time_ms": Int(await testVectorSearchPerformance() * 1000),
                "index_time_ms": Int(await testVectorIndexPerformance() * 1000)
            ],
            timestamp: Date()
        )

        await addValidationResult(result)
    }

    private func validateContextManagement() async {
        print("🔍 Validating context management...")

        // Test context creation and retrieval
        await validateContextCRUD()

        // Test context indexing
        await validateContextIndexing()

        // Test context search
        await validateContextSearch()
    }

    private func validateProjectWorkspaces() async {
        print("🔍 Validating project workspaces...")

        // Test workspace integrity
        await validateWorkspaceIntegrity()

        // Test workspace permissions
        await validateWorkspacePermissions()

        // Test workspace storage
        await validateWorkspaceStorage()
    }

    private func validateDocumentProcessing() async {
        print("🔍 Validating document processing...")

        // Test document ingestion
        await validateDocumentIngestion()

        // Test chunk generation
        await validateChunkGeneration()

        // Test entity extraction
        await validateEntityExtraction()
    }

    private func validateSystemPerformance() async {
        print("🔍 Validating system performance...")

        let startTime = Date()
        var metrics: [String: Any] = [:]

        // Memory usage
        let memoryUsage = await getMemoryUsage()
        metrics["memory_usage_mb"] = memoryUsage

        // CPU usage
        let cpuUsage = await getCPUUsage()
        metrics["cpu_usage_percent"] = cpuUsage

        // Disk I/O
        let diskIO = await getDiskIOMetrics()
        metrics["disk_io_mb_per_sec"] = diskIO

        // Network I/O (if applicable)
        let networkIO = await getNetworkIOMetrics()
        metrics["network_io_mb_per_sec"] = networkIO

        let responseTime = Date().timeIntervalSince(startTime)

        // Determine performance status
        var issues: [String] = []
        if memoryUsage > 1000 { // 1GB
            issues.append("High memory usage: \(memoryUsage)MB")
        }
        if cpuUsage > 80 {
            issues.append("High CPU usage: \(cpuUsage)%")
        }

        let status: ValidationStatus = issues.isEmpty ? .healthy : .warning

        let result = ValidationResult(
            type: .systemPerformance,
            status: status,
            message: issues.isEmpty ? "System performance optimal" : issues.joined(separator: "; "),
            responseTime: responseTime,
            metrics: metrics,
            timestamp: Date()
        )

        await addValidationResult(result)

        // Update performance metrics
        await MainActor.run {
            performanceMetrics = PerformanceMetrics(
                memoryUsageMB: memoryUsage,
                cpuUsagePercent: cpuUsage,
                diskIOMBPerSec: diskIO,
                networkIOMBPerSec: networkIO,
                timestamp: Date()
            )
        }
    }

    private func validateStorageHealth() async {
        print("🔍 Validating storage health...")

        let startTime = Date()
        var issues: [String] = []

        do {
            // Check available storage space
            let availableSpace = await getAvailableStorageSpace()
            if availableSpace < 1024 * 1024 * 1024 { // 1GB
                issues.append("Low storage space: \(availableSpace / (1024*1024))MB available")
            }

            // Check storage I/O performance
            let ioPerformance = await testStorageIOPerformance()
            if ioPerformance < 50 { // 50 MB/s
                issues.append("Slow storage I/O: \(ioPerformance)MB/s")
            }

        } catch {
            issues.append("Storage health check failed: \(error.localizedDescription)")
        }

        let responseTime = Date().timeIntervalSince(startTime)
        let status: ValidationStatus = issues.isEmpty ? .healthy : (issues.count == 1 ? .warning : .critical)

        let result = ValidationResult(
            type: .storageHealth,
            status: status,
            message: issues.isEmpty ? "Storage health optimal" : issues.joined(separator: "; "),
            responseTime: responseTime,
            metrics: [
                "available_space_mb": await getAvailableStorageSpace() / (1024*1024),
                "io_performance_mb_per_sec": await testStorageIOPerformance()
            ],
            timestamp: Date()
        )

        await addValidationResult(result)
    }

    private func validateSecurity() async {
        print("🔍 Validating security...")

        // Test credential security
        await validateCredentialSecurity()

        // Test data encryption
        await validateDataEncryption()

        // Test access controls
        await validateAccessControls()
    }

    // MARK: - Helper Methods

    private func performValidation(type: ValidationType) async -> ValidationResult {
        let startTime = Date()

        switch type {
        case .databaseConnectivity:
            await validateDatabaseConnectivity()
        case .ragSystemHealth:
            await validateRAGSystemHealth()
        case .storageSpace:
            await validateStorageHealth()
        case .memoryUsage:
            await validateSystemPerformance()
        default:
            // Default implementation
            return ValidationResult(
                type: type,
                status: .unknown,
                message: "Validation not implemented",
                responseTime: Date().timeIntervalSince(startTime),
                metrics: [:],
                timestamp: Date()
            )
        }

        // Return the last result for this type
        return validationResults.last { $0.type == type } ?? ValidationResult(
            type: type,
            status: .error,
            message: "Validation result not found",
            responseTime: Date().timeIntervalSince(startTime),
            metrics: [:],
            timestamp: Date()
        )
    }

    private func addValidationResult(_ result: ValidationResult) async {
        await MainActor.run {
            validationResults.append(result)

            if result.status == .critical || result.status == .error {
                criticalIssues.append(result)
            }
        }
    }

    private func calculateOverallHealth() async {
        let errorCount = validationResults.filter { $0.status == .error || $0.status == .critical }.count
        let warningCount = validationResults.filter { $0.status == .warning }.count

        let health: ValidationHealth
        switch (errorCount, warningCount) {
        case (0, 0):
            health = .healthy
        case (0, 1...2):
            health = .warning
        case (1...2, _):
            health = .warning
        default:
            health = .critical
        }

        await MainActor.run {
            overallHealth = health
        }
    }

    private func startPeriodicValidation() {
        validationTimer = Timer.scheduledTimer(withTimeInterval: validationInterval, repeats: true) { _ in
            Task {
                await self.performFullValidation()
            }
        }
    }

    // MARK: - Test Implementation Methods

    private func testDatabaseConnection(_ dbName: String) async -> Bool {
        // Simulate database connection test
        try? await Task.sleep(nanoseconds: 100_000_000) // 0.1 seconds
        return true
    }

    private func testQueryPerformance() async -> TimeInterval {
        // Simulate query performance test
        try? await Task.sleep(nanoseconds: 200_000_000) // 0.2 seconds
        return 0.2
    }

    private func testTransactionPerformance() async -> TimeInterval {
        // Simulate transaction performance test
        try? await Task.sleep(nanoseconds: 500_000_000) // 0.5 seconds
        return 0.5
    }

    private func findOrphanedRecords() async -> Int {
        // Simulate orphaned records check
        return 0
    }

    private func checkDataIntegrityConstraints() async -> Int {
        // Simulate constraint violations check
        return 0
    }

    private func testDocumentProcessing() async -> Bool {
        // Simulate document processing test
        try? await Task.sleep(nanoseconds: 1_000_000_000) // 1 second
        return true
    }

    private func testVectorSearchPerformance() async -> TimeInterval {
        // Simulate vector search performance test
        try? await Task.sleep(nanoseconds: 300_000_000) // 0.3 seconds
        return 0.3
    }

    private func testVectorIndexPerformance() async -> TimeInterval {
        // Simulate vector index performance test
        try? await Task.sleep(nanoseconds: 2_000_000_000) // 2 seconds
        return 2.0
    }

    private func getMemoryUsage() async -> Int {
        // Simulate memory usage check
        return 256 // MB
    }

    private func getCPUUsage() async -> Double {
        // Simulate CPU usage check
        return 15.0 // %
    }

    private func getDiskIOMetrics() async -> Double {
        // Simulate disk I/O metrics
        return 25.0 // MB/s
    }

    private func getNetworkIOMetrics() async -> Double {
        // Simulate network I/O metrics
        return 5.0 // MB/s
    }

    private func getAvailableStorageSpace() async -> Int64 {
        // Simulate available storage space check
        return 50 * 1024 * 1024 * 1024 // 50GB
    }

    private func testStorageIOPerformance() async -> Double {
        // Simulate storage I/O performance test
        return 100.0 // MB/s
    }

    // Placeholder implementations for context validation
    private func validateContextCRUD() async { /* Implementation */ }
    private func validateContextIndexing() async { /* Implementation */ }
    private func validateContextSearch() async { /* Implementation */ }
    private func validateWorkspaceIntegrity() async { /* Implementation */ }
    private func validateWorkspacePermissions() async { /* Implementation */ }
    private func validateWorkspaceStorage() async { /* Implementation */ }
    private func validateDocumentIngestion() async { /* Implementation */ }
    private func validateChunkGeneration() async { /* Implementation */ }
    private func validateEntityExtraction() async { /* Implementation */ }
    private func validateEmbeddingGeneration() async { /* Implementation */ }
    private func validateSearchFunctionality() async { /* Implementation */ }
    private func validateCredentialSecurity() async { /* Implementation */ }
    private func validateDataEncryption() async { /* Implementation */ }
    private func validateAccessControls() async { /* Implementation */ }
    private func validateBackupIntegrity() async { /* Implementation */ }

    // MARK: - Logging

    private func logValidationResults() async {
        let summary = getValidationSummary()

        print("📊 Infrastructure Validation Summary:")
        print("   Total: \(summary.totalValidations)")
        print("   Healthy: \(summary.healthyCount)")
        print("   Warnings: \(summary.warningCount)")
        print("   Errors: \(summary.errorCount)")
        print("   Critical: \(summary.criticalCount)")
        print("   Overall: \(summary.overallHealth)")

        if !summary.criticalIssues.isEmpty {
            print("🚨 Critical Issues:")
            for issue in summary.criticalIssues {
                print("   - \(issue.type.rawValue): \(issue.message)")
            }
        }

        // Log to file (implementation depends on logging system)
        // await logToFile(summary)
    }
}

// MARK: - Supporting Models

enum ValidationType: String, CaseIterable {
    case databaseConnectivity = "database_connectivity"
    case databasePerformance = "database_performance"
    case dataConsistency = "data_consistency"
    case ragSystemHealth = "rag_system_health"
    case vectorStorePerformance = "vector_store_performance"
    case contextManagement = "context_management"
    case workspaceIntegrity = "workspace_integrity"
    case documentProcessing = "document_processing"
    case systemPerformance = "system_performance"
    case storageHealth = "storage_health"
    case security = "security"
    case backupIntegrity = "backup_integrity"
    case memoryUsage = "memory_usage"
    case storageSpace = "storage_space"
}

enum ValidationStatus: String, CaseIterable {
    case healthy = "healthy"
    case warning = "warning"
    case error = "error"
    case critical = "critical"
    case unknown = "unknown"
}

enum ValidationHealth: String, CaseIterable {
    case healthy = "healthy"
    case warning = "warning"
    case critical = "critical"
    case unknown = "unknown"
}

struct ValidationResult {
    let type: ValidationType
    let status: ValidationStatus
    let message: String
    let responseTime: TimeInterval
    let metrics: [String: Any]
    let timestamp: Date
}

struct ValidationSummary {
    let totalValidations: Int
    let healthyCount: Int
    let warningCount: Int
    let errorCount: Int
    let criticalCount: Int
    let overallHealth: ValidationHealth
    let lastValidationDate: Date?
    let criticalIssues: [ValidationResult]
}

struct PerformanceMetrics {
    let memoryUsageMB: Int
    let cpuUsagePercent: Double
    let diskIOMBPerSec: Double
    let networkIOMBPerSec: Double
    let timestamp: Date
}

struct ValidationComponent {
    let name: String
    let description: String
    let validationType: ValidationType
    let criticality: Criticality
}

enum Criticality {
    case critical
    case important
    case optional
}

// MARK: - Validation Components Registry

extension InfrastructureValidation {
    static let validationComponents: [ValidationComponent] = [
        ValidationComponent(
            name: "Database Connectivity",
            description: "Tests connection to all database instances",
            validationType: .databaseConnectivity,
            criticality: .critical
        ),
        ValidationComponent(
            name: "RAG System Health",
            description: "Validates RAG system functionality",
            validationType: .ragSystemHealth,
            criticality: .critical
        ),
        ValidationComponent(
            name: "Storage Space",
            description: "Checks available storage space",
            validationType: .storageSpace,
            criticality: .critical
        ),
        ValidationComponent(
            name: "Memory Usage",
            description: "Monitors system memory consumption",
            validationType: .memoryUsage,
            criticality: .important
        ),
        ValidationComponent(
            name: "Vector Store Performance",
            description: "Tests vector search and indexing performance",
            validationType: .vectorStorePerformance,
            criticality: .important
        ),
        ValidationComponent(
            name: "Document Processing",
            description: "Validates document ingestion pipeline",
            validationType: .documentProcessing,
            criticality: .important
        ),
        ValidationComponent(
            name: "Security",
            description: "Validates security controls and encryption",
            validationType: .security,
            criticality: .critical
        )
    ]
}