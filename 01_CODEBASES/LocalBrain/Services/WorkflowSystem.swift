//
//  WorkflowSystem.swift
//  LocalBrain
//
//  Purpose: Workflow system for template-based processing with shell commands, dependencies, and LLM integration
//  Created: 2025-10-06 (Workflow Architecture Day!)
//

import Foundation
import Combine

// MARK: - Workflow Models
@MainActor
class WorkflowSystem: ObservableObject {

    // MARK: - Published Properties
    @Published var availableWorkflows: [WorkflowTemplate] = []
    @Published var activeExecutions: [WorkflowExecution] = []
    @Published var executionHistory: [WorkflowExecution] = []

    // MARK: - Private Properties
    private let workflowRegistry = WorkflowRegistry()
    private let executionEngine = WorkflowExecutionEngine()
    private var cancellables = Set<AnyCancellable>()

    // MARK: - Initialization
    init() {
        loadWorkflowTemplates()
        setupExecutionMonitoring()
    }

    // MARK: - Public Methods

    /// Execute a workflow with given input
    func executeWorkflow(_ template: WorkflowTemplate, input: WorkflowInput) async throws -> WorkflowOutput {
        let execution = WorkflowExecution(
            id: UUID(),
            templateId: template.id,
            input: input,
            status: .running,
            startTime: Date()
        )

        activeExecutions.append(execution)

        do {
            let output = try await executionEngine.execute(template: template, input: input)

            // Update execution record
            if let index = activeExecutions.firstIndex(where: { $0.id == execution.id }) {
                activeExecutions[index].status = .completed
                activeExecutions[index].endTime = Date()
                activeExecutions[index].output = output

                // Move to history
                executionHistory.append(activeExecutions[index])
                activeExecutions.remove(at: index)
            }

            return output

        } catch {
            // Update execution record with error
            if let index = activeExecutions.firstIndex(where: { $0.id == execution.id }) {
                activeExecutions[index].status = .failed
                activeExecutions[index].endTime = Date()
                activeExecutions[index].error = error.localizedDescription

                // Move to history
                executionHistory.append(activeExecutions[index])
                activeExecutions.remove(at: index)
            }

            throw error
        }
    }

    /// Cancel a running workflow execution
    func cancelExecution(_ executionId: UUID) {
        executionEngine.cancelExecution(executionId)

        if let index = activeExecutions.firstIndex(where: { $0.id == executionId }) {
            activeExecutions[index].status = .cancelled
            activeExecutions[index].endTime = Date()

            executionHistory.append(activeExecutions[index])
            activeExecutions.remove(at: index)
        }
    }

    /// Load workflow templates from file system
    func loadWorkflowTemplates() {
        Task {
            let templates = await workflowRegistry.discoverWorkflows()

            await MainActor.run {
                self.availableWorkflows = templates
                print("🔧 Loaded \(templates.count) workflow templates")
            }
        }
    }

    /// Get execution progress for a workflow
    func getExecutionProgress(_ executionId: UUID) -> Double? {
        return executionEngine.getProgress(executionId)
    }

    // MARK: - Private Methods

    private func setupExecutionMonitoring() {
        executionEngine.$progress
            .receive(on: RunLoop.main)
            .sink { [weak self] (executionId, progress) in
                self?.updateExecutionProgress(executionId, progress: progress)
            }
            .store(in: &cancellables)
    }

    private func updateExecutionProgress(_ executionId: UUID, progress: Double) {
        if let index = activeExecutions.firstIndex(where: { $0.id == executionId }) {
            activeExecutions[index].progress = progress
        }
    }
}

// MARK: - Workflow Models
struct WorkflowTemplate: Identifiable, Codable, Hashable {
    let id: UUID
    let name: String
    let description: String
    let category: WorkflowCategory
    let version: String
    let author: String

    // Execution Configuration
    let shellCommand: String
    let dependencies: [WorkflowDependency]
    let inputSchema: WorkflowInputSchema
    let outputSchema: WorkflowOutputSchema

    // LLM Integration
    let llmSteps: [WorkflowLLMStep]?

    // Metadata
    let tags: [String]
    let estimatedDuration: TimeInterval
    let requiredPermissions: [String]

    // File System Location
    let workflowFilePath: String
    let workingDirectory: String
}

struct WorkflowDependency: Codable, Hashable {
    let name: String
    let version: String?
    let type: DependencyType
    let installCommand: String?
    let checkCommand: String

    enum DependencyType: String, Codable, Hashable {
        case python = "python"
        case node = "node"
        case brew = "brew"
        case binary = "binary"
        case system = "system"
    }
}

struct WorkflowInputSchema: Codable, Hashable {
    let type: InputType
    let required: Bool
    let description: String
    let validationPattern: String?

    enum InputType: String, Codable, Hashable {
        case text = "text"
        case file = "file"
        case url = "url"
        case directory = "directory"
        case json = "json"
    }
}

struct WorkflowOutputSchema: Codable, Hashable {
    let type: OutputType
    let description: String
    let fileExtensions: [String]?

    enum OutputType: String, Codable, Hashable {
        case text = "text"
        case file = "file"
        case directory = "directory"
        case json = "json"
        case html = "html"
        case dashboard = "dashboard"
    }
}

struct WorkflowLLMStep: Codable, Hashable {
    let id: String
    let name: String
    let prompt: String
    let model: String
    let provider: String
    let temperature: Double?
    let maxTokens: Int?
    let inputMapping: [String: String]?
    let outputMapping: [String: String]?
}

// MARK: - Execution Models
struct WorkflowExecution: Identifiable, Codable {
    let id: UUID
    let templateId: UUID
    let input: WorkflowInput
    var status: ExecutionStatus
    let startTime: Date
    var endTime: Date?
    var output: WorkflowOutput?
    var error: String?
    var progress: Double = 0.0
    var logs: [ExecutionLog] = []
}

struct WorkflowInput: Codable {
    let value: String
    let type: String
    let metadata: [String: String]?
}

struct WorkflowOutput: Codable {
    let files: [String]
    let directories: [String]
    let metadata: [String: String]
    let llmResponses: [String: String]?
}

struct ExecutionLog: Codable {
    let timestamp: Date
    let level: LogLevel
    let message: String

    enum LogLevel: String, Codable {
        case info = "info"
        case warning = "warning"
        case error = "error"
        case debug = "debug"
    }
}

enum ExecutionStatus: String, Codable {
    case pending = "pending"
    case running = "running"
    case completed = "completed"
    case failed = "failed"
    case cancelled = "cancelled"
}

enum WorkflowCategory: String, Codable, CaseIterable {
    case media = "media"
    case document = "document"
    case data = "data"
    case ai = "ai"
    case system = "system"
    case development = "development"
}

// MARK: - Workflow Registry
class WorkflowRegistry {

    /// Discover workflow templates from standard locations
    func discoverWorkflows() async -> [WorkflowTemplate] {
        var templates: [WorkflowTemplate] = []

        // Search for workflow files in standard locations
        let searchPaths = [
            "/Users/lech/PROJECTS_all/LocalBrain/workflows",
            "/Users/lech/PROJECTS_all/workflows",
            "/Users/lech/.localbrain/workflows"
        ]

        for path in searchPaths {
            let url = URL(fileURLWithPath: path)
            if FileManager.default.fileExists(atPath: path) {
                let foundTemplates = await loadWorkflowsFromDirectory(url)
                templates.append(contentsOf: foundTemplates)
            }
        }

        // Add built-in YouTube workflow template
        templates.append(createYouTubeWorkflowTemplate())

        return templates
    }

    private func loadWorkflowsFromDirectory(_ url: URL) async -> [WorkflowTemplate] {
        // Implementation for loading workflow files from directory
        return []
    }

    private func createYouTubeWorkflowTemplate() -> WorkflowTemplate {
        return WorkflowTemplate(
            id: UUID(),
            name: "YouTube Content Processor",
            description: "Complete YouTube video processing pipeline with transcription, analysis, and dashboard generation",
            category: .media,
            version: "1.0.0",
            author: "LocalBrain Team",
            shellCommand: "cd /Users/lech/PROJECTS_all/PROJECT_youtube && python3 ytpipe_official.py \"{input}\"",
            dependencies: [
                WorkflowDependency(
                    name: "yt-dlp",
                    version: "2024.01.01",
                    type: .python,
                    installCommand: "pip install yt-dlp",
                    checkCommand: "yt-dlp --version"
                ),
                WorkflowDependency(
                    name: "whisper",
                    version: "1.0.0",
                    type: .python,
                    installCommand: "pip install openai-whisper",
                    checkCommand: "whisper --help"
                ),
                WorkflowDependency(
                    name: "sentence-transformers",
                    version: "2.2.0",
                    type: .python,
                    installCommand: "pip install sentence-transformers",
                    checkCommand: "python -c \"import sentence_transformers\""
                )
            ],
            inputSchema: WorkflowInputSchema(
                type: .url,
                required: true,
                description: "YouTube video URL to process",
                validationPattern: "^https://(www\\.)?youtube\\.com/watch\\?v=.+"
            ),
            outputSchema: WorkflowOutputSchema(
                type: .directory,
                description: "Processed content directory with transcription, analysis, and dashboard",
                fileExtensions: ["html", "json", "jsonl", "txt", "vtt"]
            ),
            llmSteps: [
                WorkflowLLMStep(
                    id: "content_analysis",
                    name: "AI Content Analysis",
                    prompt: "Analyze this YouTube video transcript and provide key insights, summary, and actionable takeaways.",
                    model: "gpt-4",
                    provider: "openai",
                    temperature: 0.7,
                    maxTokens: 2000,
                    inputMapping: ["transcript": "transcript_text"],
                    outputMapping: ["analysis": "ai_analysis"]
                )
            ],
            tags: ["youtube", "video", "transcription", "ai", "analysis"],
            estimatedDuration: 300.0, // 5 minutes
            requiredPermissions: ["network", "filesystem"],
            workflowFilePath: "/Users/lech/PROJECTS_all/PROJECT_youtube/_PRODUCT/ytpipe_official.py",
            workingDirectory: "/Users/lech/PROJECTS_all/PROJECT_youtube"
        )
    }
}

// MARK: - Workflow Execution Engine
class WorkflowExecutionEngine: ObservableObject {

    @Published var progress: (UUID, Double) = (UUID(), 0.0)
    private var runningExecutions: [UUID: Process] = [:]

    func execute(template: WorkflowTemplate, input: WorkflowInput) async throws -> WorkflowOutput {
        let executionId = UUID()

        // Check dependencies
        try await checkDependencies(template.dependencies)

        // Prepare shell command
        let command = template.shellCommand.replacingOccurrences(of: "{input}", with: input.value)

        // Execute shell command
        let process = Process()
        process.executableURL = URL(fileURLWithPath: "/bin/bash")
        process.arguments = ["-c", command]
        process.currentDirectoryURL = URL(fileURLWithPath: template.workingDirectory)

        let pipe = Pipe()
        process.standardOutput = pipe
        process.standardError = pipe

        runningExecutions[executionId] = process

        do {
            try process.run()

            // Monitor progress (simplified for now)
            for await progressValue in generateProgress() {
                await MainActor.run {
                    self.progress = (executionId, progressValue)
                }
            }

            process.waitUntilExit()

            guard process.terminationStatus == 0 else {
                throw WorkflowExecutionError.commandFailed("Command failed with exit code \(process.terminationStatus)")
            }

            // Parse output
            let outputData = pipe.fileHandleForReading.readDataToEndOfFile()
            let outputString = String(data: outputData, encoding: .utf8) ?? ""

            // Create workflow output
            let output = WorkflowOutput(
                files: parseOutputFiles(outputString),
                directories: parseOutputDirectories(outputString),
                metadata: ["output": outputString],
                llmResponses: nil
            )

            runningExecutions.removeValue(forKey: executionId)
            return output

        } catch {
            runningExecutions.removeValue(forKey: executionId)
            throw error
        }
    }

    func cancelExecution(_ executionId: UUID) {
        runningExecutions[executionId]?.terminate()
        runningExecutions.removeValue(forKey: executionId)
    }

    func getProgress(_ executionId: UUID) -> Double? {
        return runningExecutions[executionId] != nil ? 0.5 : nil
    }

    private func checkDependencies(_ dependencies: [WorkflowDependency]) async throws {
        for dependency in dependencies {
            let process = Process()
            process.executableURL = URL(fileURLWithPath: "/bin/bash")
            process.arguments = ["-c", dependency.checkCommand]
            process.standardOutput = Pipe()
            process.standardError = Pipe()

            try process.run()
            process.waitUntilExit()

            guard process.terminationStatus == 0 else {
                throw WorkflowExecutionError.dependencyMissing("Missing dependency: \(dependency.name)")
            }
        }
    }

    private func generateProgress() -> AsyncStream<Double> {
        AsyncStream { continuation in
            Task {
                for progress in stride(from: 0.1, through: 1.0, by: 0.1) {
                    continuation.yield(progress)
                    try? await Task.sleep(nanoseconds: 200_000_000) // 200ms
                }
                continuation.finish()
            }
        }
    }

    private func parseOutputFiles(_ output: String) -> [String] {
        // Simplified file parsing - would be more sophisticated in real implementation
        return []
    }

    private func parseOutputDirectories(_ output: String) -> [String] {
        // Simplified directory parsing
        return []
    }
}

// MARK: - Workflow Errors
enum WorkflowExecutionError: LocalizedError {
    case dependencyMissing(String)
    case commandFailed(String)
    case invalidInput(String)
    case executionTimeout

    var errorDescription: String? {
        switch self {
        case .dependencyMissing(let dependency):
            return "Missing required dependency: \(dependency)"
        case .commandFailed(let command):
            return "Command execution failed: \(command)"
        case .invalidInput(let input):
            return "Invalid input: \(input)"
        case .executionTimeout:
            return "Workflow execution timed out"
        }
    }
}