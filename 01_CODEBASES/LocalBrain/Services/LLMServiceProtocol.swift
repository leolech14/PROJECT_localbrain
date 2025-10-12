//
//  LLMServiceProtocol.swift
//  LocalBrain
//
//  Purpose: Unified protocol for all AI provider services
//  Created: 2025-10-06 (Multi-Provider Integration Day!)
//

import Foundation
import Combine

// MARK: - LLM Service Protocol
@MainActor
protocol LLMServiceProtocol {
    /// Send a message to the LLM with conversation history
    /// - Parameters:
    ///   - text: The user's message text
    ///   - history: Array of previous messages
    /// - Returns: AsyncStream of response tokens
    func sendMessage(text: String, history: [Message]) async throws -> AsyncStream<String>

    /// Check if the service is connected and available
    var isConnected: Bool { get }

    /// Get the last error if any
    var lastError: String? { get }

    /// Get the provider name for identification
    var providerName: String { get }
}

// MARK: - AI Provider Enumeration
enum AIProvider: String, CaseIterable {
    case openai = "OpenAI"
    case claude = "Claude"
    case gemini = "Gemini"
    case glm = "GLM"

    var displayName: String {
        return self.rawValue
    }

    var defaultModel: String {
        switch self {
        case .openai:
            return "gpt-3.5-turbo"
        case .claude:
            return "claude-3-haiku-20240307"
        case .gemini:
            return "gemini-1.5-flash"
        case .glm:
            return "glm-4-flash"
        }
    }
}