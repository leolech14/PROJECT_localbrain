//
//  ClaudeService.swift
//  LocalBrain
//
//  Purpose: Real Anthropic Claude API integration with streaming support
//  Created: 2025-10-06 (AI Integration Day!)
//

import Foundation
import Combine

// MARK: - Claude Models
struct ClaudeMessage: Codable {
    let role: String
    let content: String
}

struct ClaudeRequest: Codable {
    let model: String
    let messages: [ClaudeMessage]
    let max_tokens: Int?
    let temperature: Double?
    let stream: Bool
}

struct ClaudeResponse: Codable {
    let content: [ClaudeContentBlock]
    let usage: ClaudeUsage?
}

struct ClaudeContentBlock: Codable {
    let type: String
    let text: String?
}

struct ClaudeUsage: Codable {
    let input_tokens: Int
    let output_tokens: Int
}

struct ClaudeStreamingResponse: Codable {
    let type: String
    let delta: ClaudeDelta?
}

struct ClaudeDelta: Codable {
    let type: String
    let text: String?
}

// MARK: - Claude Service
@MainActor
class ClaudeService: ObservableObject, LLMServiceProtocol {

    // MARK: - Configuration
    private let baseURL = "https://api.anthropic.com/v1/messages"
    private let apiKey: String

    // MARK: - State
    @Published var isConnected = false
    @Published var lastError: String?

    // MARK: - LLMServiceProtocol
    var providerName: String { "Claude" }

    // MARK: - Initialization
    init(apiKey: String) {
        self.apiKey = apiKey
        testConnection()
    }

    // MARK: - Public Methods
    func sendMessage(text: String, history: [Message]) async throws -> AsyncStream<String> {
        lastError = nil

        // Convert Message to ClaudeMessage
        let claudeMessages = history.map { message in
            ClaudeMessage(role: message.role == .user ? "user" : "assistant", content: message.text)
        }

        // Add current message
        var messages = claudeMessages
        messages.append(ClaudeMessage(role: "user", content: text))

        let request = ClaudeRequest(
            model: "claude-3-haiku-20240307",
            messages: messages,
            max_tokens: 2000,
            temperature: 0.7,
            stream: true
        )

        return AsyncStream { continuation in
            Task {
                do {
                    try await sendStreamingRequest(request: request, continuation: continuation)
                } catch {
                    await MainActor.run {
                        self.lastError = error.localizedDescription
                    }
                    continuation.finish()
                }
            }
        }
    }

    // MARK: - Private Methods
    private func testConnection() {
        Task {
            do {
                let testRequest = ClaudeRequest(
                    model: "claude-3-haiku-20240307",
                    messages: [ClaudeMessage(role: "user", content: "Hello")],
                    max_tokens: 10,
                    temperature: 0.7,
                    stream: false
                )

                _ = try await sendNonStreamingRequest(request: testRequest)

                await MainActor.run {
                    self.isConnected = true
                    print("✅ Claude connection successful")
                }
            } catch {
                await MainActor.run {
                    self.isConnected = false
                    self.lastError = error.localizedDescription
                    print("❌ Claude connection failed: \(error)")
                }
            }
        }
    }

    private func sendStreamingRequest(request: ClaudeRequest, continuation: AsyncStream<String>.Continuation) async throws {
        guard let url = URL(string: baseURL) else {
            throw ClaudeServiceError.invalidURL
        }

        var urlRequest = URLRequest(url: url)
        urlRequest.httpMethod = "POST"
        urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
        urlRequest.setValue("application/json", forHTTPHeaderField: "Accept")
        urlRequest.setValue("2023-06-01", forHTTPHeaderField: "anthropic-version")
        urlRequest.setValue(apiKey, forHTTPHeaderField: "x-api-key")
        urlRequest.setValue("text/event-stream", forHTTPHeaderField: "Accept")

        let jsonData = try JSONEncoder().encode(request)
        urlRequest.httpBody = jsonData

        let (data, response) = try await URLSession.shared.data(for: urlRequest)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw ClaudeServiceError.invalidResponse
        }

        guard httpResponse.statusCode == 200 else {
            let errorMessage = String(data: data, encoding: .utf8) ?? "Unknown error"
            throw ClaudeServiceError.httpError(httpResponse.statusCode, errorMessage)
        }

        // Parse streaming response
        let responseString = String(data: data, encoding: .utf8) ?? ""
        let lines = responseString.components(separatedBy: "\n")

        for line in lines {
            if line.hasPrefix("data: ") {
                let jsonString = String(line.dropFirst(6))

                guard let jsonData = jsonString.data(using: .utf8) else { continue }

                do {
                    let streamingResponse = try JSONDecoder().decode(ClaudeStreamingResponse.self, from: jsonData)

                    if streamingResponse.type == "content_block_delta", let delta = streamingResponse.delta, let text = delta.text {
                        continuation.yield(text)
                    } else if streamingResponse.type == "message_stop" {
                        continuation.finish()
                        return
                    }
                } catch {
                    // Skip malformed JSON chunks
                    continue
                }
            }
        }

        continuation.finish()
    }

    private func sendNonStreamingRequest(request: ClaudeRequest) async throws -> ClaudeResponse {
        guard let url = URL(string: baseURL) else {
            throw ClaudeServiceError.invalidURL
        }

        var urlRequest = URLRequest(url: url)
        urlRequest.httpMethod = "POST"
        urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
        urlRequest.setValue("application/json", forHTTPHeaderField: "Accept")
        urlRequest.setValue("2023-06-01", forHTTPHeaderField: "anthropic-version")
        urlRequest.setValue(apiKey, forHTTPHeaderField: "x-api-key")

        let jsonData = try JSONEncoder().encode(request)
        urlRequest.httpBody = jsonData

        let (data, response) = try await URLSession.shared.data(for: urlRequest)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw ClaudeServiceError.invalidResponse
        }

        guard httpResponse.statusCode == 200 else {
            let errorMessage = String(data: data, encoding: .utf8) ?? "Unknown error"
            throw ClaudeServiceError.httpError(httpResponse.statusCode, errorMessage)
        }

        return try JSONDecoder().decode(ClaudeResponse.self, from: data)
    }
}

// MARK: - Error Types
enum ClaudeServiceError: LocalizedError {
    case invalidURL
    case invalidResponse
    case httpError(Int, String)
    case encodingError
    case decodingError

    var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "Invalid URL"
        case .invalidResponse:
            return "Invalid response"
        case .httpError(let code, let message):
            return "HTTP Error \(code): \(message)"
        case .encodingError:
            return "Failed to encode request"
        case .decodingError:
            return "Failed to decode response"
        }
    }
}