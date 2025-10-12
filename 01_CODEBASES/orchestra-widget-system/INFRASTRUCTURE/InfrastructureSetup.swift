//
//  InfrastructureSetup.swift
//  LocalBrain
//
//  Purpose: One-click infrastructure setup and initialization
//  Created: 2025-10-06 (Infrastructure Day!)
//  Sets up: Databases, directories, RAG system, contexts, workspaces
//

import Foundation
import SwiftUI

@Observable
class InfrastructureSetup {
    // MARK: - State
    @Published var isSettingUp = false
    @Published var setupProgress: Double = 0.0
    @Published var currentStep: String = ""
    @Published var setupCompleted = false
    @Published var setupError: String?
    @Published var setupSteps: [SetupStep] = []

    // MARK: - Configuration
    private let setupStepsOrder: [SetupStepType] = [
        .validateEnvironment,
        .createDirectories,
        .initializeDatabases,
        .setupRAGSystem,
        .initializeContextManager,
        .setupProjectWorkspaces,
        .configureGraniteDocling,
        .runValidation,
        .createBackup
    ]

    // MARK: - Setup Methods

    /// Perform complete infrastructure setup
    func performSetup() async {
        await MainActor.run {
            isSettingUp = true
            setupProgress = 0.0
            currentStep = "Starting infrastructure setup..."
            setupError = nil
            setupCompleted = false
            setupSteps.removeAll()
        }

        print("🚀 Starting LocalBrain v2.0 Infrastructure Setup...")

        let totalSteps = setupStepsOrder.count

        for (index, stepType) in setupStepsOrder.enumerated() {
            let stepProgress = Double(index) / Double(totalSteps)
            await updateProgress(stepProgress, step: stepType.description)

            let success = await executeSetupStep(stepType)

            let step = SetupStep(
                type: stepType,
                status: success ? .completed : .failed,
                message: success ? "\(stepType.description) completed successfully" : "\(stepType.description) failed",
                timestamp: Date()
            )

            await MainActor.run {
                setupSteps.append(step)
            }

            if !success {
                await MainActor.run {
                    setupError = "Setup failed at step: \(stepType.description)"
                    isSettingUp = false
                }
                print("❌ Setup failed at step: \(stepType.description)")
                return
            }
        }

        await MainActor.run {
            setupProgress = 1.0
            currentStep = "Infrastructure setup completed successfully!"
            setupCompleted = true
            isSettingUp = false
        }

        print("✅ LocalBrain v2.0 Infrastructure Setup completed successfully!")
        await generateSetupReport()
    }

    /// Quick setup for development (skips some validations)
    func performQuickSetup() async {
        await MainActor.run {
            isSettingUp = true
            setupProgress = 0.0
            currentStep = "Starting quick setup..."
            setupError = nil
            setupCompleted = false
        }

        let quickSteps: [SetupStepType] = [
            .createDirectories,
            .initializeDatabases,
            .setupRAGSystem,
            .initializeContextManager
        ]

        let totalSteps = quickSteps.count

        for (index, stepType) in quickSteps.enumerated() {
            let stepProgress = Double(index) / Double(totalSteps)
            await updateProgress(stepProgress, step: stepType.description)

            let success = await executeSetupStep(stepType)

            if !success {
                await MainActor.run {
                    setupError = "Quick setup failed at step: \(stepType.description)"
                    isSettingUp = false
                }
                return
            }
        }

        await MainActor.run {
            setupProgress = 1.0
            currentStep = "Quick setup completed!"
            setupCompleted = true
            isSettingUp = false
        }

        print("⚡ LocalBrain v2.0 Quick Setup completed!")
    }

    /// Reset infrastructure (for development/testing)
    func resetInfrastructure() async -> Bool {
        print("🔄 Resetting infrastructure...")

        let resetSteps: [SetupStepType] = [
            .cleanupDatabases,
            .cleanupDirectories,
            .resetRAGSystem,
            .resetContextManager
        ]

        for stepType in resetSteps {
            let success = await executeResetStep(stepType)
            if !success {
                print("❌ Reset failed at step: \(stepType.description)")
                return false
            }
        }

        print("✅ Infrastructure reset completed")
        return true
    }

    // MARK: - Private Setup Implementation

    private func executeSetupStep(_ stepType: SetupStepType) async -> Bool {
        print("🔧 Executing: \(stepType.description)")

        switch stepType {
        case .validateEnvironment:
            return await validateEnvironment()
        case .createDirectories:
            return await createDirectories()
        case .initializeDatabases:
            return await initializeDatabases()
        case .setupRAGSystem:
            return await setupRAGSystem()
        case .initializeContextManager:
            return await initializeContextManager()
        case .setupProjectWorkspaces:
            return await setupProjectWorkspaces()
        case .configureGraniteDocling:
            return await configureGraniteDocling()
        case .runValidation:
            return await runValidation()
        case .createBackup:
            return await createBackup()
        }
    }

    private func executeResetStep(_ stepType: SetupStepType) async -> Bool {
        print("🧹 Executing reset: \(stepType.description)")

        switch stepType {
        case .cleanupDatabases:
            return await cleanupDatabases()
        case .cleanupDirectories:
            return await cleanupDirectories()
        case .resetRAGSystem:
            return await resetRAGSystem()
        case .resetContextManager:
            return await resetContextManager()
        default:
            return false
        }
    }

    // MARK: - Individual Setup Steps

    private func validateEnvironment() async -> Bool {
        print("🔍 Validating environment...")

        // Check macOS version
        let macOSVersion = ProcessInfo.processInfo.operatingSystemVersion
        guard macOSVersion.majorVersion >= 14 else {
            print("❌ macOS 14.0+ required, found: \(macOSVersion)")
            return false
        }

        // Check available disk space (minimum 5GB)
        let availableSpace = await getAvailableDiskSpace()
        guard availableSpace > 5 * 1024 * 1024 * 1024 else {
            print("❌ Insufficient disk space, need at least 5GB")
            return false
        }

        // Check memory (minimum 4GB)
        let physicalMemory = await getPhysicalMemory()
        guard physicalMemory > 4 * 1024 * 1024 * 1024 else {
            print("❌ Insufficient memory, need at least 4GB")
            return false
        }

        // Check permissions
        let libraryPath = FileManager.default.urls(for: .libraryDirectory, in: .userDomainMask).first!
        let isWritable = FileManager.default.isWritableFile(atPath: libraryPath.path)
        guard isWritable else {
            print("❌ No write permissions to library directory")
            return false
        }

        print("✅ Environment validation passed")
        return true
    }

    private func createDirectories() async -> Bool {
        print("📁 Creating directory structure...")

        let baseDirectory = FileManager.default.urls(for: .libraryDirectory, in: .userDomainMask).first!
            .appendingPathComponent("LocalBrain-v2")

        let directories = [
            "active-projects",
            "knowledge-base/rag-vectors",
            "knowledge-base/document-store",
            "knowledge-base/context-pool",
            "databases",
            "agent-memory",
            "configuration",
            "cache",
            "logs",
            "backup"
        ]

        do {
            try FileManager.default.createDirectory(at: baseDirectory, withIntermediateDirectories: true)

            for directory in directories {
                let dirPath = baseDirectory.appendingPathComponent(directory)
                try FileManager.default.createDirectory(at: dirPath, withIntermediateDirectories: true)
            }

            print("✅ Directory structure created")
            return true
        } catch {
            print("❌ Failed to create directories: \(error)")
            return false
        }
    }

    private func initializeDatabases() async -> Bool {
        print("🗄️ Initializing databases...")

        do {
            let databaseManager = DatabaseManager()

            // Wait for initialization
            let timeout = TimeInterval(30.0)
            let startTime = Date()

            while !databaseManager.isInitialized && Date().timeIntervalSince(startTime) < timeout {
                try? await Task.sleep(nanoseconds: 100_000_000) // 0.1 seconds
            }

            if !databaseManager.isInitialized {
                print("❌ Database initialization timed out")
                return false
            }

            // Test database operations
            let testProject = databaseManager.createProject(name: "Setup Test", type: "test")
            if testProject == nil {
                print("❌ Failed to create test project")
                return false
            }

            print("✅ Databases initialized successfully")
            return true
        } catch {
            print("❌ Database initialization failed: \(error)")
            return false
        }
    }

    private func setupRAGSystem() async -> Bool {
        print("🧠 Setting up RAG system...")

        do {
            let ragSystem = RAGSystem()

            // Wait for initialization
            let timeout = TimeInterval(30.0)
            let startTime = Date()

            while !ragSystem.isInitialized && Date().timeIntervalSince(startTime) < timeout {
                try? await Task.sleep(nanoseconds: 100_000_000) // 0.1 seconds
            }

            if !ragSystem.isInitialized {
                print("❌ RAG system initialization timed out")
                return false
            }

            // Test basic functionality
            let stats = await ragSystem.getSystemStats()
            if stats == nil {
                print("❌ Failed to get RAG system stats")
                return false
            }

            print("✅ RAG system setup completed")
            return true
        } catch {
            print("❌ RAG system setup failed: \(error)")
            return false
        }
    }

    private func initializeContextManager() async -> Bool {
        print("📝 Initializing context manager...")

        do {
            let contextManager = ContextManager()

            // Wait for initialization
            let timeout = TimeInterval(30.0)
            let startTime = Date()

            while !contextManager.isInitialized && Date().timeIntervalSince(startTime) < timeout {
                try? await Task.sleep(nanoseconds: 100_000_000) // 0.1 seconds
            }

            if !contextManager.isInitialized {
                print("❌ Context manager initialization timed out")
                return false
            }

            // Test basic functionality
            let stats = contextManager.getContextStats()
            if stats == nil {
                print("❌ Failed to get context manager stats")
                return false
            }

            print("✅ Context manager initialized")
            return true
        } catch {
            print("❌ Context manager initialization failed: \(error)")
            return false
        }
    }

    private func setupProjectWorkspaces() async -> Bool {
        print("🏗️ Setting up project workspaces...")

        do {
            let infrastructureManager = InfrastructureManager.shared

            // Wait for initialization
            let timeout = TimeInterval(30.0)
            let startTime = Date()

            while !infrastructureManager.isInitialized && Date().timeIntervalSince(startTime) < timeout {
                try? await Task.sleep(nanoseconds: 100_000_000) // 0.1 seconds
            }

            if !infrastructureManager.isInitialized {
                print("❌ Infrastructure manager initialization timed out")
                return false
            }

            // Create default project
            let projectType = ProjectType(
                id: "general",
                name: "General",
                icon: "folder",
                description: "General purpose workspace"
            )

            let project = await infrastructureManager.createProject(
                name: "Default Workspace",
                type: projectType,
                description: "Default workspace for general use"
            )

            if project == nil {
                print("❌ Failed to create default project")
                return false
            }

            print("✅ Project workspaces setup completed")
            return true
        } catch {
            print("❌ Project workspace setup failed: \(error)")
            return false
        }
    }

    private func configureGraniteDocling() async -> Bool {
        print("📄 Configuring Granite-Docling integration...")

        do {
            let doclingIntegration = GraniteDoclingIntegration()

            // Wait for initialization
            let timeout = TimeInterval(30.0)
            let startTime = Date()

            while !doclingIntegration.isInitialized && Date().timeIntervalSince(startTime) < timeout {
                try? await Task.sleep(nanoseconds: 100_000_000) // 0.1 seconds
            }

            if !doclingIntegration.isInitialized {
                print("❌ Granite-Docling initialization timed out")
                return false
            }

            // Test basic functionality
            let stats = doclingIntegration.getProcessingStats()
            if stats == nil {
                print("❌ Failed to get Docling processing stats")
                return false
            }

            print("✅ Granite-Docling integration configured")
            return true
        } catch {
            print("❌ Granite-Docling configuration failed: \(error)")
            return false
        }
    }

    private func runValidation() async -> Bool {
        print("✅ Running infrastructure validation...")

        do {
            let validator = InfrastructureValidation()
            let health = await validator.performQuickHealthCheck()

            if health == .critical {
                print("❌ Critical issues found during validation")
                return false
            }

            print("✅ Infrastructure validation passed (Health: \(health))")
            return true
        } catch {
            print("❌ Infrastructure validation failed: \(error)")
            return false
        }
    }

    private func createBackup() async -> Bool {
        print("💾 Creating initial backup...")

        do {
            let infrastructureManager = InfrastructureManager.shared
            let backupResult = await infrastructureManager.createBackup()

            if !backupResult.success {
                print("❌ Failed to create initial backup: \(backupResult.error ?? "Unknown error")")
                return false
            }

            print("✅ Initial backup created successfully")
            return true
        } catch {
            print("❌ Backup creation failed: \(error)")
            return false
        }
    }

    // MARK: - Reset Steps

    private func cleanupDatabases() async -> Bool {
        print("🗑️ Cleaning up databases...")

        let baseDirectory = FileManager.default.urls(for: .libraryDirectory, in: .userDomainMask).first!
            .appendingPathComponent("LocalBrain-v2")
            .appendingPathComponent("databases")

        do {
            if FileManager.default.fileExists(atPath: baseDirectory.path) {
                try FileManager.default.removeItem(at: baseDirectory)
            }
            print("✅ Database cleanup completed")
            return true
        } catch {
            print("❌ Database cleanup failed: \(error)")
            return false
        }
    }

    private func cleanupDirectories() async -> Bool {
        print("🗑️ Cleaning up directories...")

        let baseDirectory = FileManager.default.urls(for: .libraryDirectory, in: .userDomainMask).first!
            .appendingPathComponent("LocalBrain-v2")

        do {
            if FileManager.default.fileExists(atPath: baseDirectory.path) {
                try FileManager.default.removeItem(at: baseDirectory)
            }
            print("✅ Directory cleanup completed")
            return true
        } catch {
            print("❌ Directory cleanup failed: \(error)")
            return false
        }
    }

    private func resetRAGSystem() async -> Bool {
        print("🔄 Resetting RAG system...")

        // RAG system will automatically reset when databases are cleaned
        print("✅ RAG system reset completed")
        return true
    }

    private func resetContextManager() async -> Bool {
        print("🔄 Resetting context manager...")

        // Context manager will automatically reset when databases are cleaned
        print("✅ Context manager reset completed")
        return true
    }

    // MARK: - Helper Methods

    private func updateProgress(_ progress: Double, step: String) async {
        await MainActor.run {
            setupProgress = progress
            currentStep = step
        }
    }

    private func generateSetupReport() async {
        let report = SetupReport(
            timestamp: Date(),
            setupCompleted: setupCompleted,
            totalSteps: setupSteps.count,
            successfulSteps: setupSteps.filter { $0.status == .completed }.count,
            failedSteps: setupSteps.filter { $0.status == .failed }.count,
            setupSteps: setupSteps
        )

        await logSetupReport(report)
    }

    private func logSetupReport(_ report: SetupReport) async {
        print("📊 Setup Report:")
        print("   Timestamp: \(report.timestamp)")
        print("   Completed: \(report.setupCompleted)")
        print("   Total Steps: \(report.totalSteps)")
        print("   Successful: \(report.successfulSteps)")
        print("   Failed: \(report.failedSteps)")

        if !report.setupSteps.isEmpty {
            print("   Step Details:")
            for step in report.setupSteps {
                let status = step.status == .completed ? "✅" : "❌"
                print("     \(status) \(step.type.description): \(step.message)")
            }
        }

        // Save report to file
        await saveSetupReportToFile(report)
    }

    private func saveSetupReportToFile(_ report: SetupReport) async {
        let baseDirectory = FileManager.default.urls(for: .libraryDirectory, in: .userDomainMask).first!
            .appendingPathComponent("LocalBrain-v2")
            .appendingPathComponent("logs")

        do {
            try FileManager.default.createDirectory(at: baseDirectory, withIntermediateDirectories: true)

            let formatter = ISO8601DateFormatter()
            let filename = "setup-report-\(formatter.string(from: report.timestamp)).json"
            let fileURL = baseDirectory.appendingPathComponent(filename)

            let data = try JSONEncoder().encode(report)
            try data.write(to: fileURL)

            print("📝 Setup report saved to: \(fileURL.path)")
        } catch {
            print("❌ Failed to save setup report: \(error)")
        }
    }

    // MARK: - System Information Methods

    private func getAvailableDiskSpace() async -> Int64 {
        let documentPath = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
        do {
            let resourceValues = try documentPath.resourceValues(forKeys: [.volumeAvailableCapacityForImportantUsageKey])
            return resourceValues.volumeAvailableCapacityForImportantUsage ?? 0
        } catch {
            return 0
        }
    }

    private func getPhysicalMemory() async -> Int64 {
        var size: vm_size_t = 0
        sysctlbyname("hw.memsize", &size, nil, nil, 0)
        return Int64(size)
    }
}

// MARK: - Supporting Models

enum SetupStepType: String, CaseIterable {
    case validateEnvironment = "validate_environment"
    case createDirectories = "create_directories"
    case initializeDatabases = "initialize_databases"
    case setupRAGSystem = "setup_rag_system"
    case initializeContextManager = "initialize_context_manager"
    case setupProjectWorkspaces = "setup_project_workspaces"
    case configureGraniteDocling = "configure_granite_docling"
    case runValidation = "run_validation"
    case createBackup = "create_backup"

    // Reset steps
    case cleanupDatabases = "cleanup_databases"
    case cleanupDirectories = "cleanup_directories"
    case resetRAGSystem = "reset_rag_system"
    case resetContextManager = "reset_context_manager"

    var description: String {
        switch self {
        case .validateEnvironment: return "Validating Environment"
        case .createDirectories: return "Creating Directory Structure"
        case .initializeDatabases: return "Initializing Databases"
        case .setupRAGSystem: return "Setting Up RAG System"
        case .initializeContextManager: return "Initializing Context Manager"
        case .setupProjectWorkspaces: return "Setting Up Project Workspaces"
        case .configureGraniteDocling: return "Configuring Granite-Docling"
        case .runValidation: return "Running Validation"
        case .createBackup: return "Creating Initial Backup"
        case .cleanupDatabases: return "Cleaning Up Databases"
        case .cleanupDirectories: return "Cleaning Up Directories"
        case .resetRAGSystem: return "Resetting RAG System"
        case .resetContextManager: return "Resetting Context Manager"
        }
    }

    var estimatedDuration: TimeInterval {
        switch self {
        case .validateEnvironment: return 5.0
        case .createDirectories: return 2.0
        case .initializeDatabases: return 10.0
        case .setupRAGSystem: return 15.0
        case .initializeContextManager: return 10.0
        case .setupProjectWorkspaces: return 5.0
        case .configureGraniteDocling: return 10.0
        case .runValidation: return 30.0
        case .createBackup: return 5.0
        case .cleanupDatabases: return 5.0
        case .cleanupDirectories: return 2.0
        case .resetRAGSystem: return 5.0
        case .resetContextManager: return 5.0
        }
    }
}

enum SetupStepStatus: String, CaseIterable {
    case pending = "pending"
    case inProgress = "in_progress"
    case completed = "completed"
    case failed = "failed"
    case skipped = "skipped"
}

struct SetupStep {
    let type: SetupStepType
    let status: SetupStepStatus
    let message: String
    let timestamp: Date
}

struct SetupReport: Codable {
    let timestamp: Date
    let setupCompleted: Bool
    let totalSteps: Int
    let successfulSteps: Int
    let failedSteps: Int
    let setupSteps: [SetupStep]
}

// MARK: - Setup View for SwiftUI

struct InfrastructureSetupView: View {
    @StateObject private var setup = InfrastructureSetup()
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        VStack(spacing: 20) {
            // Header
            VStack {
                Image(systemName: "gear.badge.checkmark")
                    .font(.system(size: 48))
                    .foregroundColor(.blue)

                Text("LocalBrain v2.0 Infrastructure Setup")
                    .font(.title)
                    .fontWeight(.bold)

                Text("One-click setup of all infrastructure components")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }

            // Progress
            if setup.isSettingUp {
                VStack(spacing: 10) {
                    ProgressView(value: setup.setupProgress)
                        .progressViewStyle(LinearProgressViewStyle())

                    Text(setup.currentStep)
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                .padding()
            }

            // Setup Status
            if setup.setupCompleted {
                VStack {
                    Image(systemName: "checkmark.circle.fill")
                        .font(.system(size: 32))
                        .foregroundColor(.green)

                    Text("Setup Completed Successfully!")
                        .font(.headline)
                        .foregroundColor(.green)
                }
            }

            if let error = setup.setupError {
                VStack {
                    Image(systemName: "xmark.circle.fill")
                        .font(.system(size: 32))
                        .foregroundColor(.red)

                    Text("Setup Failed")
                        .font(.headline)
                        .foregroundColor(.red)

                    Text(error)
                        .font(.caption)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                }
            }

            // Steps List
            if !setup.setupSteps.isEmpty {
                ScrollView {
                    LazyVStack(alignment: .leading, spacing: 5) {
                        ForEach(setup.setupSteps, id: \.type) { step in
                            HStack {
                                Image(systemName: step.status == .completed ? "checkmark.circle.fill" : "xmark.circle.fill")
                                    .foregroundColor(step.status == .completed ? .green : .red)
                                    .font(.caption)

                                Text(step.type.description)
                                    .font(.caption)

                                Spacer()
                            }
                        }
                    }
                }
                .frame(maxHeight: 200)
                .padding()
                .background(Color.gray.opacity(0.1))
                .cornerRadius(8)
            }

            // Action Buttons
            HStack(spacing: 15) {
                if !setup.isSettingUp && !setup.setupCompleted {
                    Button("Full Setup") {
                        Task {
                            await setup.performSetup()
                        }
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Quick Setup") {
                        Task {
                            await setup.performQuickSetup()
                        }
                    }
                    .buttonStyle(.bordered)
                }

                if setup.setupCompleted {
                    Button("Done") {
                        dismiss()
                    }
                    .buttonStyle(.borderedProminent)
                }

                if setup.setupError != nil {
                    Button("Retry") {
                        Task {
                            await setup.performSetup()
                        }
                    }
                    .buttonStyle(.borderedProminent)
                }

                if !setup.isSettingUp {
                    Button("Reset") {
                        Task {
                            await setup.resetInfrastructure()
                        }
                    }
                    .buttonStyle(.bordered)
                    .foregroundColor(.red)
                }
            }

            Spacer()
        }
        .padding()
        .frame(width: 500, height: 600)
    }
}