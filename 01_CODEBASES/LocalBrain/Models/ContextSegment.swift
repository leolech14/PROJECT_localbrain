// MARK: - Context Segment Model
// Structured context management for AI interactions
// LocalBrain › Models › ContextSegment.swift

import Foundation
import SwiftUI

// MARK: - Context Segment Types
enum ContextSegmentType: String, CaseIterable {
    case systemPrompt = "System Prompt"
    case userPrompt = "User Prompt"
    case knowledge = "Knowledge Base"
    case memory = "Conversation Memory"
    case file = "File Context"
    case snippet = "Code Snippet"
    case settings = "AI Settings"
    
    var icon: String {
        switch self {
        case .systemPrompt: return "🧠"
        case .userPrompt: return "💬"
        case .knowledge: return "📚"
        case .memory: return "🔄"
        case .file: return "📄"
        case .snippet: return "</>"
        case .settings: return "⚙️"
        }
    }
    
    var color: Color {
        switch self {
        case .systemPrompt: return .blue
        case .userPrompt: return .green
        case .knowledge: return .purple
        case .memory: return .orange
        case .file: return .gray
        case .snippet: return .pink
        case .settings: return .yellow
        }
    }
}

// MARK: - Context Segment
struct ContextSegment: Identifiable, Equatable {
    let id = UUID()
    var type: ContextSegmentType
    var title: String
    var content: String
    var isActive: Bool = true
    var tokens: Int = 0
    var timestamp: Date = Date()
    
    init(type: ContextSegmentType, title: String, content: String, isActive: Bool = true) {
        self.type = type
        self.title = title
        self.content = content
        self.isActive = isActive
        self.tokens = Self.estimateTokens(content)
    }
    
    static func estimateTokens(_ text: String) -> Int {
        // Rough estimation: ~4 characters per token
        return text.count / 4
    }
}

// MARK: - Default Context Templates
extension ContextSegment {
    static let defaultSystemPrompt = ContextSegment(
        type: .systemPrompt,
        title: "LocalBrain Assistant",
        content: """
        You are LocalBrain, an advanced AI assistant integrated into a macOS application.
        
        Core Capabilities:
        • You have access to the user's context files and conversation history
        • You can help with various tasks including coding, analysis, and creative work
        • You maintain awareness of all context segments provided to you
        
        Personality:
        • Be concise, helpful, and proactive
        • Provide clear, actionable responses
        • When referencing context, explicitly mention which segment you're using
        
        Context Awareness:
        • You can see files in the context pool
        • You understand the user's project structure
        • You maintain conversation continuity across messages
        """
    )
    
    static let defaultSettings = ContextSegment(
        type: .settings,
        title: "AI Configuration",
        content: """
        Temperature: 0.7
        Max Tokens: 2048
        Model: Claude 3 Opus
        Stream: Enabled
        """
    )
}

// MARK: - Context Statistics
struct ContextStatistics {
    let totalSegments: Int
    let activeSegments: Int
    let totalTokens: Int
    let maxTokens: Int
    
    var tokenUsagePercentage: Double {
        guard maxTokens > 0 else { return 0 }
        return Double(totalTokens) / Double(maxTokens)
    }
    
    var formattedTokenUsage: String {
        "\(totalTokens.formatted()) / \(maxTokens.formatted()) tokens"
    }
    
    var isNearLimit: Bool {
        tokenUsagePercentage > 0.8
    }
}