//
//  SharedTypes.swift
//  LocalBrain
//
//  Purpose: Minimal shared types to resolve compilation conflicts
//  Created: 2025-10-06 (Infrastructure Day!)
//

import Foundation

// Minimal Project type for database compatibility
struct Project {
    let id: String
    let name: String
    let type: String
    let directoryPath: URL
    let createdAt: Date
    let lastModified: Date
    let status: ProjectStatus

    init(id: String, name: String, type: String, directoryPath: URL, createdAt: Date = Date(), lastModified: Date = Date(), status: ProjectStatus = .active) {
        self.id = id
        self.name = name
        self.type = type
        self.directoryPath = directoryPath
        self.createdAt = createdAt
        self.lastModified = lastModified
        self.status = status
    }
}

enum ProjectStatus: String {
    case active = "active"
    case archived = "archived"
    case deleted = "deleted"
}

// Minimal ContextSource type for database compatibility
struct ContextSource {
    let id: String
    let projectId: String
    let sourceType: ContextSourceType
    let sourcePath: String
    let processedAt: Date

    init(id: String = UUID().uuidString, projectId: String, sourceType: ContextSourceType, sourcePath: String, processedAt: Date = Date()) {
        self.id = id
        self.projectId = projectId
        self.sourceType = sourceType
        self.sourcePath = sourcePath
        self.processedAt = processedAt
    }
}

enum ContextSourceType: String {
    case document = "document"
    case conversation = "conversation"
    case code = "code"
    case web = "web"
}