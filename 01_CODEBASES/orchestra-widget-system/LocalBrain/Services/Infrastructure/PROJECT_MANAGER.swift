//
//  ProjectManager.swift
//  LocalBrain
//
//  Purpose: Complete project workspace management for LocalBrain v2.0
//  Created: 2025-10-06 (Infrastructure Day!)
//  Manages: Project creation, workspace organization, context sources, AI integration
//

import Foundation
import SwiftUI

@Observable
class ProjectManager {
    // MARK: - Core Components
    private let databaseManager: DatabaseManager
    private let ragSystem: RAGSystem
    private let contextManager: ContextManager

    // MARK: - State
    @Published var activeProjects: [Project] = []
    @Published var currentProject: Project?
    @Published var isLoadingProjects = false

    // MARK: - Configuration
    private let projectTypes: [ProjectType] = [
        ProjectType(id: "software-development", name: "Software Development", icon: "hammer", description: "Code development, debugging, deployment"),
        ProjectType(id: "research", name: "Research", icon: "magnifyingglass", description: "Information gathering, analysis, synthesis"),
        ProjectType(id: "content-creation", name: "Content Creation", icon: "doc.text", description: "Writing, editing, publishing content"),
        ProjectType(id: "data-analysis", name: "Data Analysis", icon: "chart.bar", description: "Data processing, visualization, insights"),
        ProjectType(id: "learning", name: "Learning & Education", icon: "brain", description: "Study, education, skill development"),
        ProjectType(id: "business", name: "Business Operations", icon: "briefcase", description: "Planning, strategy, operations"),
        ProjectType(id: "creative", name: "Creative Projects", icon: "paintbrush", description: "Art, design, creative work"),
        ProjectType(id: "automation", name: "Automation", icon: "gear", description: "Scripting, workflow automation")
    ]

    // MARK: - Initialization
    init() {
        self.databaseManager = DatabaseManager()
        self.ragSystem = RAGSystem()
        self.contextManager = ContextManager()

        loadActiveProjects()
        print("🚀 ProjectManager initialized with \(projectTypes.count) project types")
    }

    // MARK: - Project Creation
    func createProject(name: String, type: ProjectType, description: String = "") -> Project? {
        print("📝 Creating project: \(name) (\(type.name))")

        // Create project in database
        guard let project = databaseManager.createProject(name: name, type: type.id) else {
            print("❌ Failed to create project in database")
            return nil
        }

        // Create project configuration
        let projectConfig = ProjectConfiguration(
            id: project.id,
            name: name,
            type: type.id,
            description: description,
            createdAt: Date(),
            settings: ProjectSettings(
                autoContext: true,
                voiceEnabled: true,
                codeGeneration: true,
                aiProviders: ["claude", "gpt-4", "gemini"],
                contextSources: [],
                widgetLayout: "default-grid"
            ),
            tags: extractTags(from: name, description: description)
        )

        // Save project configuration
        saveProjectConfiguration(projectConfig, project: project)

        // Initialize project workspace
        initializeProjectWorkspace(project: project)

        // Add to active projects
        activeProjects.append(project)
        if currentProject == nil {
            currentProject = project
        }

        print("✅ Project created successfully: \(project.id)")
        return project
    }

    // MARK: - Project Workspace Initialization
    private func initializeProjectWorkspace(project: Project) {
        let projectDir = project.directoryPath

        // Create standard directories
        let workspaceDirectories = [
            "contexts/ai-conversations",
            "contexts/file-analysis",
            "contexts/code-contexts",
            "contexts/research-contexts",
            "documents/sources",
            "documents/processed",
            "documents/exports",
            "code/generated",
            "code/modified",
            "conversations",
            "widgets",
            "assets/images",
            "assets/audio",
            "assets/video",
            "assets/documents",
            "metadata"
        ]

        for dir in workspaceDirectories {
            let dirPath = projectDir.appendingPathComponent(dir)
            try? FileManager.default.createDirectory(at: dirPath, withIntermediateDirectories: true)
        }

        // Create project-specific contexts
        createProjectContexts(project: project)

        // Create default widget layout
        createDefaultWidgetLayout(project: project)

        print("📁 Project workspace initialized: \(projectDir.path)")
    }

    private func createProjectContexts(project: Project) {
        let contextsDir = project.directoryPath.appendingPathComponent("contexts")

        // AI conversation context
        let aiContext: [String: Any] = [
            "type": "ai-conversations",
            "project_id": project.id,
            "created_at": ISO8601DateFormatter().string(from: Date()),
            "settings": [
                "auto_save": true,
                "context_limit": 4000,
                "include_file_context": true
            ]
        ]
        saveContext(aiContext, filename: "ai-context.json", directory: contextsDir)

        // File analysis context
        let fileContext: [String: Any] = [
            "type": "file-analysis",
            "project_id": project.id,
            "created_at": ISO8601DateFormatter().string(from: Date()),
            "settings": [
                "auto_index": true,
                "supported_formats": ["swift", "py", "js", "md", "txt", "pdf"],
                "chunk_size": 500
            ]
        ]
        saveContext(fileContext, filename: "file-context.json", directory: contextsDir)

        // Code context
        let codeContext: [String: Any] = [
            "type": "code-context",
            "project_id": project.id,
            "created_at": ISO8601DateFormatter().string(from: Date()),
            "settings": [
                "analyze_functions": true,
                "analyze_classes": true,
                "track_dependencies": true,
                "supported_languages": ["swift", "python", "javascript"]
            ]
        ]
        saveContext(codeContext, filename: "code-context.json", directory: contextsDir)
    }

    private func createDefaultWidgetLayout(project: Project) {
        let widgetsDir = project.directoryPath.appendingPathComponent("widgets")

        let defaultLayout: [String: Any] = [
            "layout_name": "default-grid",
            "created_at": ISO8601DateFormatter().string(from: Date()),
            "grid_size": ["width": 1200, "height": 800],
            "widgets": [
                [
                    "id": "file-explorer",
                    "type": "file-explorer",
                    "position": ["x": 50, "y": 50],
                    "size": ["width": 350, "height": 400],
                    "config": [
                        "initial_path": project.directoryPath.path,
                        "show_hidden": false,
                        "view_mode": "list"
                    ]
                ],
                [
                    "id": "ai-chat",
                    "type": "ai-chat",
                    "position": ["x": 450, "y": 50],
                    "size": ["width": 400, "height": 500],
                    "config": [
                        "default_provider": "claude",
                        "streaming": true,
                        "voice_input": true
                    ]
                ],
                [
                    "id": "code-editor",
                    "type": "code-editor",
                    "position": ["x": 900, "y": 50],
                    "size": ["width": 500, "height": 600],
                    "config": [
                        "language": "auto",
                        "theme": "dark",
                        "line_numbers": true
                    ]
                ],
                [
                    "id": "context-viewer",
                    "type": "context-viewer",
                    "position": ["x": 50, "y": 500],
                    "size": ["width": 350, "height": 250],
                    "config": [
                        "show_sources": true,
                        "max_items": 10
                    ]
                ]
            ]
        ]

        saveWidgetLayout(defaultLayout, directory: widgetsDir, filename: "default-layout.json")
    }

    // MARK: - Project Management
    func switchToProject(_ project: Project) {
        currentProject = project
        print("🔄 Switched to project: \(project.name)")
    }

    func deleteProject(_ project: Project) {
        // Archive project in database
        // archiveProject(project)

        // Remove from active projects
        activeProjects.removeAll { $0.id == project.id }

        // If this was current project, switch to another
        if currentProject?.id == project.id {
            currentProject = activeProjects.first
        }

        print("🗑️ Project deleted: \(project.name)")
    }

    // MARK: - Document Management
    func addDocumentToProject(_ url: URL, project: Project) async {
        print("📄 Adding document to project: \(url.lastPathComponent)")

        // Copy document to project directory
        let documentsDir = project.directoryPath.appendingPathComponent("documents/sources")
        let destination = documentsDir.appendingPathComponent(url.lastPathComponent)

        do {
            try FileManager.default.copyItem(at: url, to: destination)

            // Process document with RAG system
            let result = await ragSystem.processDocument(url: destination, projectId: project.id)

            if result.success {
                print("✅ Document processed successfully: \(result.chunksProcessed ?? 0) chunks")
            } else {
                print("❌ Document processing failed: \(result.error ?? "Unknown error")")
            }

        } catch {
            print("❌ Failed to copy document: \(error)")
        }
    }

    func getProjectDocuments(_ project: Project) -> [ProjectDocument] {
        let documentsDir = project.directoryPath.appendingPathComponent("documents/sources")
        var documents: [ProjectDocument] = []

        do {
            let fileURLs = try FileManager.default.contentsOfDirectory(at: documentsDir, includingPropertiesForKeys: [.fileSizeKey, .contentModificationDateKey])

            for url in fileURLs {
                let document = ProjectDocument(
                    url: url,
                    name: url.lastPathComponent,
                    type: url.pathExtension,
                    size: getFileSize(url),
                    lastModified: getFileModificationDate(url)
                )
                documents.append(document)
            }
        } catch {
            print("❌ Failed to list project documents: \(error)")
        }

        return documents.sorted { $0.name.localizedStandardCompare($1.name) == .orderedAscending }
    }

    // MARK: - Context Management
    func addContextSource(_ source: ContextSource, project: Project) {
        // Add context source to database
        if let contextSource = databaseManager.addContextSource(
            projectId: project.id,
            sourceType: source.type,
            sourcePath: source.path
        ) {
            print("✅ Context source added: \(source.path)")
        }
    }

    func getProjectContexts(_ project: Project) -> [ContextSource] {
        // Retrieve context sources from database
        // For now, return mock data
        return []
    }

    // MARK: - Widget Layout Management
    func saveWidgetLayout(_ layout: [String: Any], project: Project) {
        let widgetsDir = project.directoryPath.appendingPathComponent("widgets")
        saveWidgetLayout(layout, directory: widgetsDir, filename: "current-layout.json")
    }

    func getWidgetLayout(project: Project) -> [String: Any]? {
        let widgetsDir = project.directoryPath.appendingPathComponent("widgets")
        let layoutFile = widgetsDir.appendingPathComponent("current-layout.json")

        do {
            let data = try Data(contentsOf: layoutFile)
            return try JSONSerialization.jsonObject(with: data) as? [String: Any]
        } catch {
            print("❌ Failed to load widget layout: \(error)")
            return nil
        }
    }

    // MARK: - Data Loading
    private func loadActiveProjects() {
        isLoadingProjects = true
        defer { isLoadingProjects = false }

        // Load projects from database
        // For now, create mock project
        if activeProjects.isEmpty {
            let mockProject = createProject(
                name: "LocalBrain v2.0 Development",
                type: projectTypes.first!,
                description: "Building the next generation AI-powered workspace"
            )
            if let project = mockProject {
                currentProject = project
            }
        }

        print("📂 Loaded \(activeProjects.count) active projects")
    }

    // MARK: - Helper Methods
    private func saveProjectConfiguration(_ config: ProjectConfiguration, project: Project) {
        let configFile = project.directoryPath.appendingPathComponent("project.json")

        do {
            let data = try JSONSerialization.data(withJSONObject: [
                "id": config.id,
                "name": config.name,
                "type": config.type,
                "description": config.description,
                "created_at": ISO8601DateFormatter().string(from: config.createdAt),
                "settings": config.settings.dictionary,
                "tags": config.tags
            ])
            try data.write(to: configFile)
        } catch {
            print("❌ Failed to save project configuration: \(error)")
        }
    }

    private func saveContext(_ context: [String: Any], filename: String, directory: URL) {
        let contextFile = directory.appendingPathComponent(filename)

        do {
            let data = try JSONSerialization.data(withJSONObject: context)
            try data.write(to: contextFile)
        } catch {
            print("❌ Failed to save context file: \(error)")
        }
    }

    private func saveWidgetLayout(_ layout: [String: Any], directory: URL, filename: String) {
        let layoutFile = directory.appendingPathComponent(filename)

        do {
            let data = try JSONSerialization.data(withJSONObject: layout)
            try data.write(to: layoutFile)
        } catch {
            print("❌ Failed to save widget layout: \(error)")
        }
    }

    private func extractTags(from name: String, description: String) -> [String] {
        let combinedText = "\(name) \(description)".lowercased()
        var tags: [String] = []

        // Extract common tags
        let commonTags = [
            "swift", "ios", "macos", "ai", "machine learning", "python", "javascript",
            "web", "mobile", "desktop", "backend", "frontend", "database", "api"
        ]

        for tag in commonTags {
            if combinedText.contains(tag) {
                tags.append(tag)
            }
        }

        return tags
    }

    private func getFileSize(_ url: URL) -> Int64 {
        do {
            let resourceValues = try url.resourceValues(forKeys: [.fileSizeKey])
            return resourceValues.fileSize ?? 0
        } catch {
            return 0
        }
    }

    private func getFileModificationDate(_ url: URL) -> Date {
        do {
            let resourceValues = try url.resourceValues(forKeys: [.contentModificationDateKey])
            return resourceValues.contentModificationDate ?? Date()
        } catch {
            return Date()
        }
    }
}

// MARK: - Supporting Models
struct ProjectType {
    let id: String
    let name: String
    let icon: String
    let description: String
}

struct ProjectConfiguration {
    let id: String
    let name: String
    let type: String
    let description: String
    let createdAt: Date
    let settings: ProjectSettings
    let tags: [String]
}

struct ProjectSettings {
    let autoContext: Bool
    let voiceEnabled: Bool
    let codeGeneration: Bool
    let aiProviders: [String]
    let contextSources: [String]
    let widgetLayout: String

    var dictionary: [String: Any] {
        return [
            "auto_context": autoContext,
            "voice_enabled": voiceEnabled,
            "code_generation": codeGeneration,
            "ai_providers": aiProviders,
            "context_sources": contextSources,
            "widget_layout": widgetLayout
        ]
    }
}

struct ContextSource {
    let type: ContextSourceType
    let path: String
}

enum ContextSourceType {
    case document
    case conversation
    case code
    case web
    case system

    var rawValue: String {
        switch self {
        case .document: return "document"
        case .conversation: return "conversation"
        case .code: return "code"
        case .web: return "web"
        case .system: return "system"
        }
    }
}

struct ProjectDocument {
    let url: URL
    let name: String
    let type: String
    let size: Int64
    let lastModified: Date
}