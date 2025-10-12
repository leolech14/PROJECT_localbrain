//
//  DatabaseManager.swift
//  LocalBrain
//
//  Purpose: Complete database management for LocalBrain v2.0
//  Created: 2025-10-06 (Infrastructure Day!)
//  Manages: Projects, contexts, RAG data, conversations, metrics
//

import Foundation
import SQLite3
import CryptoKit

@Observable
class DatabaseManager {
    // MARK: - Database Connections
    private var mainDB: OpaquePointer?
    private var conversationsDB: OpaquePointer?
    private var metricsDB: OpaquePointer?
    private var contextIndexDB: OpaquePointer?
    private var userPreferencesDB: OpaquePointer?

    // MARK: - Configuration
    private let baseDirectory: URL
    private let databasesDirectory: URL

    // MARK: - Initialization
    init() {
        // Get user's Library directory for LocalBrain data
        baseDirectory = FileManager.default.urls(for: .libraryDirectory, in: .userDomainMask).first!
            .appendingPathComponent("LocalBrain-v2")

        databasesDirectory = baseDirectory.appendingPathComponent("databases")

        createDirectoryStructure()
        initializeDatabases()
        createTables()

        print("🗄️ DatabaseManager initialized at: \(baseDirectory.path)")
    }

    deinit {
        closeAllDatabases()
    }

    // MARK: - Directory Structure Creation
    private func createDirectoryStructure() {
        let directories = [
            "active-projects",
            "knowledge-base/rag-vectors",
            "knowledge-base/document-store",
            "knowledge-base/context-pool",
            "agent-memory",
            "configuration",
            "cache",
            "logs",
            "backup"
        ]

        for directory in directories {
            let dirPath = baseDirectory.appendingPathComponent(directory)
            try? FileManager.default.createDirectory(at: dirPath, withIntermediateDirectories: true)
        }

        // Create vector storage subdirectories
        let vectorDirs = [
            "knowledge-base/rag-vectors/embeddings",
            "knowledge-base/rag-vectors/indices"
        ]

        for dir in vectorDirs {
            let dirPath = baseDirectory.appendingPathComponent(dir)
            try? FileManager.default.createDirectory(at: dirPath, withIntermediateDirectories: true)
        }
    }

    // MARK: - Database Initialization
    private func initializeDatabases() {
        let dbFiles = [
            ("localbrain.sqlite", &mainDB),
            ("conversations.db", &conversationsDB),
            ("metrics.db", &metricsDB),
            ("context-index.db", &contextIndexDB),
            ("user-preferences.db", &userPreferencesDB)
        ]

        for (filename, dbPointer) in dbFiles {
            let dbPath = databasesDirectory.appendingPathComponent(filename)

            if sqlite3_open_v2(dbPath.path, dbPointer, SQLITE_OPEN_READWRITE | SQLITE_OPEN_CREATE, nil) == SQLITE_OK {
                print("✅ Opened database: \(filename)")

                // Enable WAL mode for better performance
                executeQuery("PRAGMA journal_mode=WAL", db: dbPointer.pointee)
                executeQuery("PRAGMA synchronous=NORMAL", db: dbPointer.pointee)
                executeQuery("PRAGMA cache_size=10000", db: dbPointer.pointee)
            } else {
                print("❌ Failed to open database: \(filename)")
            }
        }
    }

    // MARK: - Table Creation
    private func createTables() {
        createMainDatabaseTables()
        createConversationsDatabaseTables()
        createMetricsDatabaseTables()
        createContextIndexDatabaseTables()
        createUserPreferencesDatabaseTables()
    }

    private func createMainDatabaseTables() {
        guard let db = mainDB else { return }

        let tables = [
            """
            CREATE TABLE IF NOT EXISTS projects (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                type TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                last_modified DATETIME DEFAULT CURRENT_TIMESTAMP,
                status TEXT DEFAULT 'active',
                directory_path TEXT NOT NULL,
                metadata TEXT,
                settings TEXT
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS context_sources (
                id TEXT PRIMARY KEY,
                project_id TEXT NOT NULL,
                source_type TEXT NOT NULL,
                source_path TEXT NOT NULL,
                processed_at DATETIME,
                vector_count INTEGER DEFAULT 0,
                metadata TEXT,
                FOREIGN KEY (project_id) REFERENCES projects(id)
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS rag_chunks (
                id TEXT PRIMARY KEY,
                source_id TEXT NOT NULL,
                chunk_index INTEGER NOT NULL,
                content TEXT NOT NULL,
                embedding_id TEXT,
                metadata TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (source_id) REFERENCES context_sources(id)
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS vector_references (
                id TEXT PRIMARY KEY,
                chunk_id TEXT NOT NULL,
                vector_file_path TEXT NOT NULL,
                model_used TEXT NOT NULL,
                dimension_count INTEGER NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (chunk_id) REFERENCES rag_chunks(id)
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS ai_providers (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                type TEXT NOT NULL,
                api_endpoint TEXT,
                model_name TEXT,
                is_active BOOLEAN DEFAULT 1,
                rate_limit INTEGER,
                cost_per_token REAL,
                metadata TEXT
            )
            """
        ]

        for tableSQL in tables {
            executeQuery(tableSQL, db: db)
        }

        // Create indexes for performance
        let indexes = [
            "CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status)",
            "CREATE INDEX IF NOT EXISTS idx_context_sources_project ON context_sources(project_id)",
            "CREATE INDEX IF NOT EXISTS idx_rag_chunks_source ON rag_chunks(source_id)",
            "CREATE INDEX IF NOT EXISTS idx_vector_references_chunk ON vector_references(chunk_id)"
        ]

        for indexSQL in indexes {
            executeQuery(indexSQL, db: db)
        }
    }

    private func createConversationsDatabaseTables() {
        guard let db = conversationsDB else { return }

        let tables = [
            """
            CREATE TABLE IF NOT EXISTS conversations (
                id TEXT PRIMARY KEY,
                project_id TEXT,
                title TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                last_message_at DATETIME,
                message_count INTEGER DEFAULT 0,
                metadata TEXT
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS messages (
                id TEXT PRIMARY KEY,
                conversation_id TEXT NOT NULL,
                role TEXT NOT NULL,
                content TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                metadata TEXT,
                FOREIGN KEY (conversation_id) REFERENCES conversations(id)
            )
            """
        ]

        for tableSQL in tables {
            executeQuery(tableSQL, db: db)
        }

        let indexes = [
            "CREATE INDEX IF NOT EXISTS idx_conversations_project ON conversations(project_id)",
            "CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id)",
            "CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp)"
        ]

        for indexSQL in indexes {
            executeQuery(indexSQL, db: db)
        }
    }

    private func createMetricsDatabaseTables() {
        guard let db = metricsDB else { return }

        let tables = [
            """
            CREATE TABLE IF NOT EXISTS usage_metrics (
                id TEXT PRIMARY KEY,
                provider_id TEXT NOT NULL,
                project_id TEXT,
                conversation_id TEXT,
                input_tokens INTEGER DEFAULT 0,
                output_tokens INTEGER DEFAULT 0,
                cost REAL DEFAULT 0.0,
                response_time_ms INTEGER,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS performance_metrics (
                id TEXT PRIMARY KEY,
                metric_type TEXT NOT NULL,
                metric_value REAL NOT NULL,
                unit TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                metadata TEXT
            )
            """
        ]

        for tableSQL in tables {
            executeQuery(tableSQL, db: db)
        }

        let indexes = [
            "CREATE INDEX IF NOT EXISTS idx_usage_metrics_provider ON usage_metrics(provider_id)",
            "CREATE INDEX IF NOT EXISTS idx_usage_metrics_timestamp ON usage_metrics(timestamp)",
            "CREATE INDEX IF NOT EXISTS idx_performance_metrics_type ON performance_metrics(metric_type)"
        ]

        for indexSQL in indexes {
            executeQuery(indexSQL, db: db)
        }
    }

    private func createContextIndexDatabaseTables() {
        guard let db = contextIndexDB else { return }

        let tables = [
            """
            CREATE TABLE IF NOT EXISTS file_index (
                id TEXT PRIMARY KEY,
                file_path TEXT NOT NULL UNIQUE,
                file_hash TEXT NOT NULL,
                file_size INTEGER,
                last_modified DATETIME,
                content_type TEXT,
                processed_at DATETIME,
                metadata TEXT
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS entity_index (
                id TEXT PRIMARY KEY,
                entity_name TEXT NOT NULL,
                entity_type TEXT NOT NULL,
                confidence REAL,
                source_id TEXT,
                metadata TEXT
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS context_relationships (
                id TEXT PRIMARY KEY,
                source_id TEXT NOT NULL,
                target_id TEXT NOT NULL,
                relationship_type TEXT NOT NULL,
                strength REAL,
                metadata TEXT
            )
            """
        ]

        for tableSQL in tables {
            executeQuery(tableSQL, db: db)
        }

        let indexes = [
            "CREATE INDEX IF NOT EXISTS idx_file_index_path ON file_index(file_path)",
            "CREATE INDEX IF NOT EXISTS idx_entity_index_name ON entity_index(entity_name)",
            "CREATE INDEX IF NOT EXISTS idx_context_relationships_source ON context_relationships(source_id)"
        ]

        for indexSQL in indexes {
            executeQuery(indexSQL, db: db)
        }
    }

    private func createUserPreferencesDatabaseTables() {
        guard let db = userPreferencesDB else { return }

        let tables = [
            """
            CREATE TABLE IF NOT EXISTS user_settings (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL,
                type TEXT NOT NULL,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS widget_layouts (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                layout_data TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                is_default BOOLEAN DEFAULT 0
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS ai_preferences (
                id TEXT PRIMARY KEY,
                provider_id TEXT NOT NULL,
                preference_type TEXT NOT NULL,
                preference_value TEXT NOT NULL,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
            """
        ]

        for tableSQL in tables {
            executeQuery(tableSQL, db: db)
        }
    }

    // MARK: - Project Management
    func createProject(name: String, type: String) -> Project? {
        guard let db = mainDB else { return nil }

        let projectId = UUID().uuidString
        let projectDir = baseDirectory
            .appendingPathComponent("active-projects")
            .appendingPathComponent("project-\(projectId)")

        do {
            try FileManager.default.createDirectory(at: projectDir, withIntermediateDirectories: true)

            let sql = """
            INSERT INTO projects (id, name, type, directory_path, created_at, last_modified)
            VALUES (?, ?, ?, ?, ?, ?)
            """

            var statement: OpaquePointer?
            if sqlite3_prepare_v2(db, sql, -1, &statement, nil) == SQLITE_OK {
                sqlite3_bind_text(statement, 1, projectId, -1, nil)
                sqlite3_bind_text(statement, 2, name, -1, nil)
                sqlite3_bind_text(statement, 3, type, -1, nil)
                sqlite3_bind_text(statement, 4, projectDir.path, -1, nil)

                let now = ISO8601DateFormatter().string(from: Date())
                sqlite3_bind_text(statement, 5, now, -1, nil)
                sqlite3_bind_text(statement, 6, now, -1, nil)

                if sqlite3_step(statement) == SQLITE_DONE {
                    sqlite3_finalize(statement)

                    // Create project structure
                    createProjectStructure(projectDir, projectId: projectId)

                    return Project(
                        id: projectId,
                        name: name,
                        type: type,
                        directoryPath: projectDir,
                        createdAt: Date(),
                        lastModified: Date(),
                        status: .active
                    )
                }
            }
            sqlite3_finalize(statement)
        } catch {
            print("❌ Error creating project directory: \(error)")
        }

        return nil
    }

    private func createProjectStructure(_ projectDir: URL, projectId: String) {
        let subdirectories = [
            "contexts",
            "documents",
            "code",
            "conversations",
            "widgets",
            "assets",
            "metadata"
        ]

        for subdir in subdirectories {
            let dirPath = projectDir.appendingPathComponent(subdir)
            try? FileManager.default.createDirectory(at: dirPath, withIntermediateDirectories: true)
        }

        // Create project.json
        let projectConfig: [String: Any] = [
            "id": projectId,
            "name": projectDir.lastPathComponent,
            "created_at": ISO8601DateFormatter().string(from: Date()),
            "context_sources": [],
            "ai_providers": ["claude", "gpt-4", "gemini"],
            "widget_layout": "grid-default",
            "settings": [
                "auto_context": true,
                "voice_enabled": true,
                "code_generation": true
            ]
        ]

        let configPath = projectDir.appendingPathComponent("project.json")
        if let data = try? JSONSerialization.data(withJSONObject: projectConfig) {
            try? data.write(to: configPath)
        }
    }

    func getProject(id: String) -> Project? {
        guard let db = mainDB else { return nil }

        let sql = "SELECT * FROM projects WHERE id = ?"
        var statement: OpaquePointer?

        if sqlite3_prepare_v2(db, sql, -1, &statement, nil) == SQLITE_OK {
            sqlite3_bind_text(statement, 1, id, -1, nil)

            if sqlite3_step(statement) == SQLITE_ROW {
                let projectId = String(cString: sqlite3_column_text(statement, 0))
                let name = String(cString: sqlite3_column_text(statement, 1))
                let type = String(cString: sqlite3_column_text(statement, 2))
                let dirPath = String(cString: sqlite3_column_text(statement, 5))

                sqlite3_finalize(statement)

                return Project(
                    id: projectId,
                    name: name,
                    type: type,
                    directoryPath: URL(fileURLWithPath: dirPath),
                    createdAt: Date(),
                    lastModified: Date(),
                    status: .active
                )
            }
        }
        sqlite3_finalize(statement)

        return nil
    }

    // MARK: - Context Management
    func addContextSource(projectId: String, sourceType: ContextSourceType, sourcePath: String) -> ContextSource? {
        guard let db = mainDB else { return nil }

        let sourceId = UUID().uuidString
        let sql = """
        INSERT INTO context_sources (id, project_id, source_type, source_path, processed_at)
        VALUES (?, ?, ?, ?, ?)
        """

        var statement: OpaquePointer?
        if sqlite3_prepare_v2(db, sql, -1, &statement, nil) == SQLITE_OK {
            sqlite3_bind_text(statement, 1, sourceId, -1, nil)
            sqlite3_bind_text(statement, 2, projectId, -1, nil)
            sqlite3_bind_text(statement, 3, sourceType.rawValue, -1, nil)
            sqlite3_bind_text(statement, 4, sourcePath, -1, nil)

            let now = ISO8601DateFormatter().string(from: Date())
            sqlite3_bind_text(statement, 5, now, -1, nil)

            if sqlite3_step(statement) == SQLITE_DONE {
                sqlite3_finalize(statement)

                return ContextSource(
                    id: sourceId,
                    projectId: projectId,
                    sourceType: sourceType,
                    sourcePath: sourcePath,
                    processedAt: Date()
                )
            }
        }
        sqlite3_finalize(statement)

        return nil
    }

    // MARK: - Vector Management
    func storeVector(chunkId: String, vectorData: [Float], model: String) -> String? {
        let vectorsDir = baseDirectory
            .appendingPathComponent("knowledge-base/rag-vectors/embeddings")
            .appendingPathComponent(model)

        try? FileManager.default.createDirectory(at: vectorsDir, withIntermediateDirectories: true)

        let vectorId = UUID().uuidString
        let vectorFile = vectorsDir.appendingPathComponent("\(vectorId).bin")

        // Convert Float array to Data
        let data = vectorData.withUnsafeBufferPointer { buffer in
            Data(buffer: buffer)
        }

        do {
            try data.write(to: vectorFile)

            // Store reference in database
            guard let db = mainDB else { return nil }

            let sql = """
            INSERT INTO vector_references (id, chunk_id, vector_file_path, model_used, dimension_count)
            VALUES (?, ?, ?, ?, ?)
            """

            var statement: OpaquePointer?
            if sqlite3_prepare_v2(db, sql, -1, &statement, nil) == SQLITE_OK {
                sqlite3_bind_text(statement, 1, vectorId, -1, nil)
                sqlite3_bind_text(statement, 2, chunkId, -1, nil)
                sqlite3_bind_text(statement, 3, vectorFile.path, -1, nil)
                sqlite3_bind_text(statement, 4, model, -1, nil)
                sqlite3_bind_int(statement, 5, Int32(vectorData.count))

                if sqlite3_step(statement) == SQLITE_DONE {
                    sqlite3_finalize(statement)
                    return vectorId
                }
            }
            sqlite3_finalize(statement)
        } catch {
            print("❌ Error storing vector: \(error)")
        }

        return nil
    }

    // MARK: - Utility Methods
    private func executeQuery(_ sql: String, db: OpaquePointer?) {
        var errMsg: UnsafeMutablePointer<Int8>?
        if sqlite3_exec(db, sql, nil, nil, &errMsg) != SQLITE_OK {
            if let error = errMsg {
                print("❌ SQL Error: \(String(cString: error))")
                sqlite3_free(errMsg)
            }
        }
    }

    private func closeAllDatabases() {
        sqlite3_close(mainDB)
        sqlite3_close(conversationsDB)
        sqlite3_close(metricsDB)
        sqlite3_close(contextIndexDB)
        sqlite3_close(userPreferencesDB)
    }
}

// MARK: - Supporting Models
struct Project {
    let id: String
    let name: String
    let type: String
    let directoryPath: URL
    let createdAt: Date
    let lastModified: Date
    let status: ProjectStatus
}

enum ProjectStatus: String {
    case active = "active"
    case archived = "archived"
    case deleted = "deleted"
}

struct ContextSource {
    let id: String
    let projectId: String
    let sourceType: ContextSourceType
    let sourcePath: String
    let processedAt: Date
}

enum ContextSourceType: String {
    case document = "document"
    case conversation = "conversation"
    case code = "code"
    case web = "web"
}