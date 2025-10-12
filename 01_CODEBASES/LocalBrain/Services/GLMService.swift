//
//  GLMService.swift
//  LocalBrain
//
//  Purpose: Real Zhipu GLM API integration with streaming support
//  Created: 2025-10-06 (AI Integration Day!)
//

import Foundation
import Combine

// MARK: - GLM Models
struct GLMMessage: Codable {
    let role: String
    let content: String
}

struct GLMRequest: Codable {
    let model: String
    let messages: [GLMMessage]
    let stream: Bool?
    let max_tokens: Int?
    let temperature: Double?
    let top_p: Double?
}

struct GLMResponse: Codable {
    let choices: [GLMChoice]
    let usage: GLMUsage?
}

struct GLMChoice: Codable {
    let index: Int?
    let message: GLMMessage?
    let delta: GLMDelta?
    let finish_reason: String?
}

struct GLMDelta: Codable {
    let role: String?
    let content: String?
}

struct GLMUsage: Codable {
    let prompt_tokens: Int?
    let completion_tokens: Int?
    let total_tokens: Int?
}

struct GLMErrorResponse: Codable {
    let error: GLMError
}

struct GLMError: Codable {
    let message: String
    let type: String?
    let code: String?
}

// MARK: - GLM Service
@MainActor
class GLMService: ObservableObject, LLMServiceProtocol {

    // MARK: - Configuration
    private let baseURL = "https://open.bigmodel.cn/api/paas/v4/chat/completions"
    private let apiKey: String

    // MARK: - State
    @Published var isConnected = false
    @Published var lastError: String?

    // MARK: - LLMServiceProtocol
    var providerName: String { "GLM" }

    // MARK: - Initialization
    init(apiKey: String, model: String = "glm-4-flash") {
        self.apiKey = apiKey
        // Note: model parameter stored for future use if needed
        testConnection()
    }

    // MARK: - Public Methods
    func sendMessage(text: String, history: [Message]) async throws -> AsyncStream<String> {
        lastError = nil

        // Convert Message to GLMMessage
        let glmMessages = history.map { message in
            GLMMessage(role: message.role == .user ? "user" : "assistant", content: message.text)
        }

        // Add current message
        var messages = glmMessages
        messages.append(GLMMessage(role: "user", content: text))

        let request = GLMRequest(
            model: "glm-4-flash",
            messages: messages,
            stream: true,
            max_tokens: 2000,
            temperature: 0.7,
            top_p: 0.95
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
                let testRequest = GLMRequest(
                    model: "glm-4-flash",
                    messages: [GLMMessage(role: "user", content: "Hello")],
                    stream: false,
                    max_tokens: 10,
                    temperature: 0.7,
                    top_p: 0.95
                )

                _ = try await sendNonStreamingRequest(request: testRequest)

                await MainActor.run {
                    self.isConnected = true
                    print("✅ GLM connection successful")
                }
            } catch {
                await MainActor.run {
                    self.isConnected = false
                    self.lastError = error.localizedDescription
                    print("❌ GLM connection failed: \(error)")
                }
            }
        }
    }

    private func sendStreamingRequest(request: GLMRequest, continuation: AsyncStream<String>.Continuation) async throws {
        guard let url = URL(string: baseURL) else {
            throw GLMServiceError.invalidURL
        }

        var urlRequest = URLRequest(url: url)
        urlRequest.httpMethod = "POST"
        urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
        urlRequest.setValue("Bearer \(apiKey)", forHTTPHeaderField: "Authorization")
        urlRequest.setValue("text/event-stream", forHTTPHeaderField: "Accept")

        let jsonData = try JSONEncoder().encode(request)
        urlRequest.httpBody = jsonData

        let (data, response) = try await URLSession.shared.data(for: urlRequest)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw GLMServiceError.invalidResponse
        }

        guard httpResponse.statusCode == 200 else {
            let errorMessage = String(data: data, encoding: .utf8) ?? "Unknown error"

            // Try to parse as error response
            if let errorResponse = try? JSONDecoder().decode(GLMErrorResponse.self, from: data) {
                throw GLMServiceError.apiError(errorResponse.error.message)
            } else {
                throw GLMServiceError.httpError(httpResponse.statusCode, errorMessage)
            }
        }

        // Parse streaming response
        let responseString = String(data: data, encoding: .utf8) ?? ""
        let lines = responseString.components(separatedBy: "\n")

        for line in lines {
            if line.hasPrefix("data: ") {
                let jsonString = String(line.dropFirst(6))

                if jsonString == "[DONE]" {
                    continuation.finish()
                    return
                }

                guard let jsonData = jsonString.data(using: .utf8) else { continue }

                do {
                    let response = try JSONDecoder().decode(GLMResponse.self, from: jsonData)
                    if let choice = response.choices.first, let delta = choice.delta {
                        if let content = delta.content {
                            continuation.yield(content)
                        }
                    }

                    // Check if this is the final chunk
                    if let choice = response.choices.first,
                       let finishReason = choice.finish_reason,
                       finishReason != "null" {
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

    private func sendNonStreamingRequest(request: GLMRequest) async throws -> GLMResponse {
        guard let url = URL(string: baseURL) else {
            throw GLMServiceError.invalidURL
        }

        var urlRequest = URLRequest(url: url)
        urlRequest.httpMethod = "POST"
        urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
        urlRequest.setValue("Bearer \(apiKey)", forHTTPHeaderField: "Authorization")

        let jsonData = try JSONEncoder().encode(request)
        urlRequest.httpBody = jsonData

        let (data, response) = try await URLSession.shared.data(for: urlRequest)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw GLMServiceError.invalidResponse
        }

        guard httpResponse.statusCode == 200 else {
            let errorMessage = String(data: data, encoding: .utf8) ?? "Unknown error"
            throw GLMServiceError.httpError(httpResponse.statusCode, errorMessage)
        }

        return try JSONDecoder().decode(GLMResponse.self, from: data)
    }
}

// MARK: - Error Types
enum GLMServiceError: LocalizedError {
    case invalidURL
    case invalidResponse
    case apiError(String)
    case httpError(Int, String)
    case encodingError
    case decodingError

    var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "Invalid URL"
        case .invalidResponse:
            return "Invalid response"
        case .apiError(let message):
            return "GLM API Error: \(message)"
        case .httpError(let code, let message):
            return "HTTP Error \(code): \(message)"
        case .encodingError:
            return "Failed to encode request"
        case .decodingError:
            return "Failed to decode response"
        }
    }
}